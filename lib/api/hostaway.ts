// Listings
export async function fetchPublicListings(options?: { limit?: number }) {
  const res = await fetch("/api/hostaway/listings");
  if (!res.ok) {
    throw new Error("Failed to fetch listings");
  }
  const data = await res.json();
  if (options?.limit) {
    return data.slice(0, options.limit);
  }
  return data;
}

export async function fetchListingById(id: string) {
  const res = await fetch(`/api/hostaway/individual-listing?id=${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch listing");
  }
  return res.json();
}

// Reviews
export async function fetchReviews(listingMapId?: string, minRating?: number) {
  const params = new URLSearchParams();
  if (listingMapId) params.set("listingMapId", listingMapId);
  if (minRating) params.set("minRating", String(minRating));
  const qs = params.toString();
  const url = qs ? `/api/hostaway/reviews?${qs}` : "/api/hostaway/reviews";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }
  const data = await res.json();
  return data.result || [];
}

export async function fetchReviewsWithCount(listingMapId: string): Promise<{
  reviews: Array<{
    reviewerName: string;
    publicReview: string;
    rating: number;
    channelId: number;
    listingMapId: number;
    insertedOn: string;
    listingName?: string;
  }>;
  totalCount: number;
}> {
  const res = await fetch(
    `/api/hostaway/reviews?listingMapId=${listingMapId}&includeCount=true`,
  );
  if (!res.ok) {
    throw new Error("Failed to fetch reviews");
  }
  const data = await res.json();

  //  console.log("in fetchReviewsWithCount - listingMapId:", listingMapId);

  return {
    reviews: data.result || [],
    totalCount: data.totalCount ?? 0,
  };
}
