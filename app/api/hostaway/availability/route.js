import { getHostAwayCalendar } from "@/lib/hostaway/listings";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
      return new Response(JSON.stringify({ message: "Missing listing ID" }), {
        status: 400,
      });
    }

    // Get calendar for next 6 months
    const today = new Date();
    const startDate = today.toISOString().split("T")[0];
    
    const endDate = new Date(today);
    endDate.setMonth(endDate.getMonth() + 6);
    const endDateStr = endDate.toISOString().split("T")[0];

    const calendarResponse = await getHostAwayCalendar(listingId, startDate, endDateStr);
    const calendarData = calendarResponse.result || [];

    // Extract reserved dates and minimum stay info
    const reservedDates = [];
    let minimumStay = 1;

    for (const day of calendarData) {
      if (day.status === "reserved" || day.isAvailable !== 1) {
        reservedDates.push(day.date);
      }
      if (day.minimumStay && day.minimumStay > minimumStay) {
        minimumStay = day.minimumStay;
      }
    }

    return Response.json({
      listingId,
      startDate,
      endDate: endDateStr,
      reservedDates,
      minimumStay,
      calendar: calendarData,
    });
  } catch (error) {
    console.error("Availability API error:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
