import {
  getJson,
  setJson,
  acquireLock,
  releaseLock,
  NO_KV_LOCK,
} from "./cache";

let cachedToken: { access_token: string; expires_at: number } | null = null;
let tokenRequestPromise: Promise<string> | null = null;
let tokenLockedUntil = 0;
let cacheLoadPromise: Promise<void> | null = null;
let cacheLoadDone = false;

const TOKEN_KEY = "guesty:booking:token";
const COOLDOWN_KEY = "guesty:booking:cooldown_until";
const LOCK_KEY = "guesty:booking:lock";
const LOCK_TTL_S = 10;
// Hard deadline > LOCK_TTL_S so a loser keeps polling/retrying across
// at least one lock expiry, avoiding a timeout-while-holder-still-valid
// race that would force unlocked minting.
const LOCK_WAIT_TIMEOUT_MS = 30_000;
const LOCK_WAIT_INTERVAL_MS = 400;
const DEFAULT_RATE_LIMIT_COOLDOWN_MS = 60 * 60 * 1000;

const normalizeApiUrl = (url: string | undefined) =>
  url ? url.replace(/\/$/, "") : "";

const getBookingBaseUrl = () =>
  normalizeApiUrl(
    process.env.GUESTY_BOOKING_BASE_URL || "https://booking.guesty.com",
  );

export class GuestyApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "GuestyApiError";
  }
}

export class GuestyRateLimitError extends GuestyApiError {
  retryAfterMs: number;
  constructor(message: string, retryAfterMs: number) {
    super(message, 429);
    this.name = "GuestyRateLimitError";
    this.retryAfterMs = retryAfterMs;
  }
}

async function refreshFromCache(): Promise<void> {
  const [token, cooldown] = await Promise.all([
    getJson<{ access_token: string; expires_at: number }>(TOKEN_KEY),
    getJson<number>(COOLDOWN_KEY),
  ]);
  if (
    token &&
    typeof token.access_token === "string" &&
    typeof token.expires_at === "number" &&
    token.expires_at > Date.now() + 60_000
  ) {
    cachedToken = {
      access_token: token.access_token,
      expires_at: token.expires_at,
    };
  }
  const cooldownNum =
    typeof cooldown === "number" ? cooldown : Number(cooldown);
  if (Number.isFinite(cooldownNum) && cooldownNum > Date.now()) {
    if (cooldownNum > tokenLockedUntil) tokenLockedUntil = cooldownNum;
  }
}

function loadFromCache(): Promise<void> {
  if (cacheLoadDone) return Promise.resolve();
  if (cacheLoadPromise) return cacheLoadPromise;
  cacheLoadPromise = (async () => {
    try {
      await refreshFromCache();
    } finally {
      cacheLoadDone = true;
      cacheLoadPromise = null;
    }
  })();
  return cacheLoadPromise;
}

function parseRetryAfter(header: string | null): number {
  if (!header) return DEFAULT_RATE_LIMIT_COOLDOWN_MS;
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(seconds * 1000, 24 * 60 * 60 * 1000);
  }
  const dateMs = Date.parse(header);
  if (!Number.isNaN(dateMs)) {
    const delta = dateMs - Date.now();
    if (delta > 0) return Math.min(delta, 24 * 60 * 60 * 1000);
  }
  return DEFAULT_RATE_LIMIT_COOLDOWN_MS;
}

export async function getGuestyAccessToken(): Promise<string> {
  if (!cacheLoadDone) {
    await loadFromCache();
  }

  if (Date.now() < tokenLockedUntil) {
    const remainingMs = tokenLockedUntil - Date.now();
    throw new GuestyRateLimitError(
      `Guesty token endpoint cooldown active (${Math.ceil(
        remainingMs / 1000,
      )}s remaining)`,
      remainingMs,
    );
  }

  if (cachedToken && Date.now() < cachedToken.expires_at - 60_000) {
    return cachedToken.access_token;
  }

  if (tokenRequestPromise) {
    return tokenRequestPromise;
  }

  const clientId = process.env.GUESTY_BOOKING_CLIENT_ID;
  const clientSecret = process.env.GUESTY_BOOKING_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Guesty Booking Engine credentials not configured");
  }

  tokenRequestPromise = (async () => {
    const deadline = Date.now() + LOCK_WAIT_TIMEOUT_MS;
    while (true) {
      const lockToken = await acquireLock(LOCK_KEY, LOCK_TTL_S);
      if (lockToken) {
        try {
          await refreshFromCache();
          if (Date.now() < tokenLockedUntil) {
            const remainingMs = tokenLockedUntil - Date.now();
            throw new GuestyRateLimitError(
              `Guesty token endpoint cooldown active (${Math.ceil(
                remainingMs / 1000,
              )}s remaining)`,
              remainingMs,
            );
          }
          if (cachedToken && Date.now() < cachedToken.expires_at - 60_000) {
            return cachedToken.access_token;
          }
          return await mintBookingToken(clientId, clientSecret);
        } finally {
          if (lockToken !== NO_KV_LOCK) {
            await releaseLock(LOCK_KEY, lockToken);
          }
        }
      }
      await new Promise((r) => setTimeout(r, LOCK_WAIT_INTERVAL_MS));
      await refreshFromCache();
      if (Date.now() < tokenLockedUntil) {
        const remainingMs = tokenLockedUntil - Date.now();
        throw new GuestyRateLimitError(
          `Guesty token endpoint cooldown active (${Math.ceil(
            remainingMs / 1000,
          )}s remaining)`,
          remainingMs,
        );
      }
      if (cachedToken && Date.now() < cachedToken.expires_at - 60_000) {
        return cachedToken.access_token;
      }
      if (Date.now() > deadline) {
        console.warn(
          "[guesty] lock wait deadline exceeded; minting without lock as safety net",
        );
        return await mintBookingToken(clientId, clientSecret);
      }
    }
  })();

  try {
    return await tokenRequestPromise;
  } finally {
    tokenRequestPromise = null;
  }
}

async function mintBookingToken(
  clientId: string,
  clientSecret: string,
): Promise<string> {
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: "booking_engine:api",
  });

  const response = await fetch(`${getBookingBaseUrl()}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: body.toString(),
  });

  if (response.status === 429) {
    const cooldownMs = parseRetryAfter(response.headers.get("retry-after"));
    tokenLockedUntil = Date.now() + cooldownMs;
    console.error(
      `[guesty] token endpoint rate-limited (429); cooling down for ${Math.round(
        cooldownMs / 1000,
      )}s`,
    );
    const cooldownTtl = Math.ceil(cooldownMs / 1000);
    try {
      await setJson(COOLDOWN_KEY, tokenLockedUntil, cooldownTtl);
      const readback = await getJson<unknown>(COOLDOWN_KEY);
      console.warn(
        `[guesty] cooldown write: value=${tokenLockedUntil} ttl=${cooldownTtl}s readback=${JSON.stringify(
          readback,
        )} typeof=${typeof readback}`,
      );
    } catch (e) {
      console.warn(
        "[guesty] cooldown write threw:",
        e instanceof Error ? e.message : String(e),
      );
    }
    throw new GuestyRateLimitError(
      "Guesty token endpoint rate-limited",
      cooldownMs,
    );
  }

  if (!response.ok) {
    await response.text().catch(() => "");
    throw new GuestyApiError(
      `Guesty token error: HTTP ${response.status}`,
      response.status,
    );
  }

  const json = await response.json();
  const expiresIn = Number(json.expires_in || 0);
  if (!json.access_token || expiresIn <= 0) {
    throw new Error("Guesty token response missing access_token or expires_in");
  }

  const next = {
    access_token: json.access_token as string,
    expires_at: Date.now() + expiresIn * 1000,
  };
  cachedToken = next;
  // TTL slightly less than expires_in so KV evicts before Guesty rejects.
  await setJson(TOKEN_KEY, next, Math.max(1, expiresIn - 60));
  return next.access_token;
}

export function invalidateGuestyToken() {
  cachedToken = null;
}

export function getGuestyBookingBaseUrl() {
  return getBookingBaseUrl();
}
