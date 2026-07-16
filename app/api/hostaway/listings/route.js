import { getHostAwayListings } from "@/lib/hostaway/listings";

export async function GET() {
  try {
    const data = await getHostAwayListings();
    return Response.json(data.result);
  } catch (error) {
    console.error(
      "[hostaway] /api/hostaway/listings failed:",
      error?.message || error,
    );
    return new Response(
      JSON.stringify({ message: "Failed to load Hostaway listings" }),
      {
        status: 502,
      },
    );
  }
}
