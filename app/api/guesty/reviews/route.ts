import { getAllGuestyReviews } from "@/lib/guesty/reviews";
import { getGuestyListings } from "@/lib/guesty/listings";
import { displayPropertyName } from "@/config/property-names";

export const revalidate = 300;

/**
 * Every Guesty guest review, account-wide, shaped like the Hostaway
 * review feed so the shared review carousel can merge the two. Listing
 * names resolve server-side — the client only has Hostaway ids.
 */
export async function GET() {
  try {
    const [reviews, listings] = await Promise.all([
      getAllGuestyReviews(),
      getGuestyListings().catch(() => []),
    ]);
    const names = new Map(
      (listings ?? []).map((l: any) => [
        String(l.id),
        displayPropertyName({
          id: l.id,
          source: "guesty",
          name: l.name,
          nickname: l.nickname,
        }) || l.name,
      ]),
    );
    const payload = reviews.map((r) => ({
      reviewerName: r.reviewerName || "",
      publicReview: r.publicReview,
      rating: r.rating,
      channelId: r.channelId,
      listingMapId: r.listingId,
      insertedOn: r.insertedOn,
      listingName: names.get(r.listingId),
    }));
    return Response.json(payload);
  } catch (error) {
    console.error(
      `[guesty] /api/guesty/reviews failed: ${error instanceof Error ? error.message : error}`,
    );
    return new Response(
      JSON.stringify({ message: "Failed to load Guesty reviews" }),
      { status: 502 },
    );
  }
}
