import { getHostAwayReviews } from "@/lib/hostaway/listings";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingMapId = searchParams.get("listingMapId");
    const includeCount = searchParams.get("includeCount") === "true";
    const minRating = searchParams.get("minRating");

    const data = await getHostAwayReviews(listingMapId);
    const allReviews = data.result || [];

    // console.log(
    //   "in api/hostaway/reviews - fetched reviews count:",
    //   allReviews.length,
    // );

    let published = allReviews.filter((r) => r.status === "published");

    if (listingMapId) {
      published = published.filter(
        (r) => String(r.listingMapId) === listingMapId,
      );
    }

    published = published.filter(
      (r) => r.publicReview && r.publicReview.trim() !== "",
    );

    const totalCount = published.length;

    let filtered = published;
    if (minRating) {
      filtered = published.filter((r) => r.rating >= Number(minRating));
    }

    const response = { status: "success", result: filtered };
    if (includeCount) {
      response.totalCount = totalCount;
    }

    return Response.json(response);
  } catch (error) {
    console.error("Hostaway reviews API error:", error.message);
    return new Response(
      JSON.stringify({ message: "Failed to fetch reviews" }),
      { status: 500 },
    );
  }
}
