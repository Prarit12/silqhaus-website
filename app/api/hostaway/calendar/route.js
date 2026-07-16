import { getHostAwayCalendar, calculateTotalPrice } from "@/lib/hostaway/listings";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!listingId) {
      return new Response(JSON.stringify({ message: "Missing listing ID" }), {
        status: 400,
      });
    }

    if (!startDate || !endDate) {
      return new Response(
        JSON.stringify({ message: "Missing start or end date" }),
        { status: 400 }
      );
    }

    const calendarResponse = await getHostAwayCalendar(listingId, startDate, endDate);
    const calendarData = calendarResponse.result || [];
    
    // Pass checkout date to exclude it from price calculation
    const priceCalculation = calculateTotalPrice(calendarData, endDate);

    return Response.json({
      listingId,
      startDate,
      endDate,
      ...priceCalculation,
      calendar: calendarData,
    });
  } catch (error) {
    console.error("Calendar API error:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
