import {
  getGuestyListings,
  getCachedGuestyListings,
  GuestyApiError,
  GuestyRateLimitError,
} from "@/lib/guesty/listings";

export const revalidate = 300;

const BLOCKED_PARAMS = new Set(["access_token", "token", "authorization"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const forwarded = new URLSearchParams();
  for (const [key, value] of url.searchParams.entries()) {
    if (!BLOCKED_PARAMS.has(key.toLowerCase())) forwarded.append(key, value);
  }

  try {
    const listings = await getGuestyListings(forwarded);
    return Response.json(listings);
  } catch (error) {
    const upstreamStatus =
      error instanceof GuestyApiError ? error.status : undefined;
    console.error(
      `[guesty] /api/guesty/listings failed (status=${upstreamStatus ?? "unknown"})`,
    );

    // Fallback: serve any cached listings (even past TTL) so a transient
    // token outage doesn't blank the Guesty source on /our-property.
    const cached = getCachedGuestyListings(forwarded);
    if (cached) {
      return new Response(JSON.stringify(cached), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Guesty-Stale": "true",
        },
      });
    }

    let responseStatus = 502;
    if (error instanceof GuestyRateLimitError) {
      responseStatus = 429;
    } else if (
      upstreamStatus !== undefined &&
      upstreamStatus >= 400 &&
      upstreamStatus < 600
    ) {
      responseStatus = upstreamStatus;
    }

    return new Response(
      JSON.stringify({ message: "Failed to load Guesty listings" }),
      { status: responseStatus },
    );
  }
}
