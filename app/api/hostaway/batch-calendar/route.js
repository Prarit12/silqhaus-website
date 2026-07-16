import {
  getHostAwayCalendar,
  calculateTotalPrice,
} from "@/lib/hostaway/listings";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingIds = searchParams.get("listingIds");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!listingIds || !startDate || !endDate) {
      return new Response(
        JSON.stringify({
          message: "Missing listingIds, startDate, or endDate",
        }),
        { status: 400 },
      );
    }

    const ids = listingIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const calendarResponse = await getHostAwayCalendar(
          id,
          startDate,
          endDate,
        );
        const calendarData = calendarResponse.result || [];
        const pricing = calculateTotalPrice(calendarData, endDate);
        return { listingId: parseInt(id), ...pricing };
      }),
    );

    const data = {};
    for (const result of results) {
      if (result.status === "fulfilled") {
        data[result.value.listingId] = result.value;
      }
    }

    return Response.json(data);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
