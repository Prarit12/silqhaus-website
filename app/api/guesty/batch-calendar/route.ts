import {
  getGuestyBulkCalendar,
  computeRangePricing,
  GuestyOpenApiError,
} from "@/lib/guesty/calendar";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingIdsParam = searchParams.get("listingIds");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!listingIdsParam || !startDate || !endDate) {
      return new Response(
        JSON.stringify({
          message: "Missing listingIds, startDate, or endDate",
        }),
        { status: 400 },
      );
    }

    const ids = listingIdsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (ids.length === 0) return Response.json({});

    const calendars = await getGuestyBulkCalendar(ids, startDate, endDate);
    const data: Record<string, ReturnType<typeof computeRangePricing>> = {};
    for (const cal of calendars) {
      data[cal.listingId] = computeRangePricing(cal, endDate, startDate);
    }
    return Response.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      error instanceof GuestyOpenApiError &&
      error.status >= 400 &&
      error.status < 600
        ? error.status
        : 502;
    console.error("[guesty] batch-calendar failed:", message);
    return new Response(
      JSON.stringify({ message: "Failed to load Guesty calendar" }),
      { status },
    );
  }
}
