import { getGuestyListingReviews } from "@/lib/guesty/reviews";

export const revalidate = 300;

export async function GET(
  _request: Request,
  context: { params: Promise<{ listingId: string }> },
) {
  try {
    const { listingId } = await context.params;
    if (!listingId) {
      return new Response(JSON.stringify({ message: "Missing listing ID" }), {
        status: 400,
      });
    }
    const payload = await getGuestyListingReviews(listingId);
    return Response.json(payload);
  } catch (error) {
    console.error(
      `[guesty] /api/guesty/reviews/[listingId] failed: ${error instanceof Error ? error.message : error}`,
    );
    return new Response(
      JSON.stringify({ message: "Failed to load Guesty reviews" }),
      { status: 502 },
    );
  }
}
