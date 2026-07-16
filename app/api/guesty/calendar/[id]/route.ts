import {
  getGuestyListingCalendar,
  computeRangePricing,
  GuestyOpenApiError,
} from "@/lib/guesty/calendar";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!id || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ message: "Missing id, startDate, or endDate" }),
        { status: 400 },
      );
    }

    const cal = await getGuestyListingCalendar(id, startDate, endDate);
    const pricing = computeRangePricing(cal, endDate, startDate);

    return Response.json({
      listingId: id,
      startDate,
      endDate,
      days: cal.days,
      ...pricing,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      error instanceof GuestyOpenApiError &&
      error.status >= 400 &&
      error.status < 600
        ? error.status
        : 502;
    console.error("[guesty] calendar/[id] failed:", message);
    return new Response(
      JSON.stringify({ message: "Failed to load Guesty calendar" }),
      { status },
    );
  }
}
