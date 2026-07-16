import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const PMS_DEFAULT_BASE_URL =
  "https://silqhaus-property-management-hub.replit.app";

const PhoneSchema = z.object({
  countryCode: z.string().regex(/^\+\d{1,4}$/),
  countryIso: z.string().regex(/^[A-Z]{2}$/),
  number: z.string().min(1),
  e164: z.string().regex(/^\+\d{6,16}$/),
});

const PayloadSchema = z.object({
  source: z.string().min(1),
  locale: z.enum(["en", "th"]),
  submittedAt: z.string().datetime(),
  listing: z.object({
    id: z.string().min(1),
    slug: z.string().min(1),
    title: z.string().min(1),
    side: z.enum(["rent", "sale"]),
    url: z
      .string()
      .url()
      .refine((u) => /^https?:\/\//i.test(u), {
        message: "URL must be http(s)",
      }),
  }),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: PhoneSchema,
  }),
  inquiry: z.object({
    purpose: z.enum([
      "more_info",
      "schedule_viewing",
      "want_to_buy",
      "want_to_rent",
    ]),
    purposeLabel: z.string().min(1),
    message: z.string().nullish(),
  }),
  consent: z.object({
    termsAccepted: z.literal(true),
    termsVersion: z.string().nullish(),
  }),
});

type ApiResponse =
  | { ok: true; id?: string }
  | {
      ok: false;
      error: {
        code:
          | "validation_error"
          | "rate_limited"
          | "unauthorized"
          | "upstream_error"
          | "network_error";
        message: string;
        fields?: Record<string, string>;
        retryAfter?: number;
      };
    };

function jsonResponse(body: ApiResponse, status: number) {
  return NextResponse.json(body, { status });
}

function getClientIp(req: NextRequest): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || null;
}

async function postToPMS(body: unknown): Promise<Response> {
  const baseUrl = (
    process.env.SILQHAUS_PMS_API_BASE_URL || PMS_DEFAULT_BASE_URL
  ).replace(/\/$/, "");
  const apiKey = process.env.SILQHAUS_PMS_API_KEY;
  if (!apiKey) {
    throw new Error("SILQHAUS_PMS_API_KEY is not configured");
  }
  return fetch(`${baseUrl}/api/v1/public/inquiries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(body),
  });
}

export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        error: { code: "validation_error", message: "Invalid JSON body" },
      },
      400,
    );
  }

  const parsed = PayloadSchema.safeParse(json);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fields[issue.path.join(".")] = issue.message;
    }
    return jsonResponse(
      {
        ok: false,
        error: {
          code: "validation_error",
          message: "Invalid inquiry payload",
          fields,
        },
      },
      400,
    );
  }

  const ipAddress = getClientIp(req);
  const userAgent = req.headers.get("user-agent");

  const upstreamPayload = {
    ...parsed.data,
    consent: { ...parsed.data.consent, ipAddress, userAgent },
  };

  let res: Response;
  try {
    res = await postToPMS(upstreamPayload);
  } catch (err) {
    console.error("[inquiries] PMS request failed:", err);
    return jsonResponse(
      {
        ok: false,
        error: {
          code: "network_error",
          message: "Could not reach inquiry service",
        },
      },
      502,
    );
  }

  if (res.status === 429) {
    const retryAfterHeader = Number(res.headers.get("Retry-After") ?? 30);
    const retryAfter =
      Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
        ? Math.min(retryAfterHeader, 30)
        : 5;
    await new Promise((r) => setTimeout(r, retryAfter * 1000));
    try {
      res = await postToPMS(upstreamPayload);
    } catch (err) {
      console.error("[inquiries] PMS retry failed:", err);
      return jsonResponse(
        {
          ok: false,
          error: {
            code: "network_error",
            message: "Could not reach inquiry service",
          },
        },
        502,
      );
    }
    if (res.status === 429) {
      const ra = Number(res.headers.get("Retry-After") ?? retryAfter);
      return jsonResponse(
        {
          ok: false,
          error: {
            code: "rate_limited",
            message: "Too many inquiries, please try again shortly",
            retryAfter: Number.isFinite(ra) ? ra : retryAfter,
          },
        },
        429,
      );
    }
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (res.ok) {
    const id =
      data &&
      typeof data === "object" &&
      "id" in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).id)
        : undefined;
    return jsonResponse({ ok: true, id }, 201);
  }

  console.error(
    "[inquiries] PMS responded with",
    res.status,
    typeof data === "object" ? JSON.stringify(data).slice(0, 300) : "",
  );

  if (res.status === 400 && data && typeof data === "object") {
    const d = data as { message?: string; fields?: Record<string, string> };
    return jsonResponse(
      {
        ok: false,
        error: {
          code: "validation_error",
          message: d.message || "Invalid inquiry payload",
          fields: d.fields,
        },
      },
      400,
    );
  }

  if (res.status === 401) {
    return jsonResponse(
      {
        ok: false,
        error: {
          code: "unauthorized",
          message: "Inquiry service is not configured",
        },
      },
      502,
    );
  }

  return jsonResponse(
    {
      ok: false,
      error: {
        code: "upstream_error",
        message: `Upstream HTTP ${res.status}`,
      },
    },
    502,
  );
}
