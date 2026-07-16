import { NextRequest, NextResponse } from "next/server";
import {
  fetchListings,
  type PMSListingType,
} from "@/lib/silqhaus-pms/listings";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const typeParam = searchParams.get("type");
  const type: PMSListingType | undefined =
    typeParam === "RENT" || typeParam === "SALE" ? typeParam : undefined;

  const page = searchParams.get("page");
  const pageSize = searchParams.get("pageSize");
  const sort = searchParams.get("sort") as "createdAt" | "price" | null;
  const order = searchParams.get("order") as "asc" | "desc" | null;

  try {
    const data = await fetchListings({
      type,
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
      sort: sort ?? undefined,
      order: order ?? undefined,
    });
    return NextResponse.json(data);
  } catch (err) {
    if (err instanceof Error) {
      console.error("[silqhaus-pms] list error:", err.message);
    }
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 502 },
    );
  }
}
