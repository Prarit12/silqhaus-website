import { NextRequest, NextResponse } from "next/server";
import { fetchListing } from "@/lib/silqhaus-pms/listings";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ idOrSlug: string }> },
) {
  const { idOrSlug } = await params;
  try {
    const data = await fetchListing(idOrSlug);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status = /404|not found/i.test(message) ? 404 : 502;
    if (err instanceof Error) {
      console.error("[silqhaus-pms] detail error:", err.message);
    }
    return NextResponse.json(
      {
        error: status === 404 ? "Listing not found" : "Failed to fetch listing",
      },
      { status },
    );
  }
}
