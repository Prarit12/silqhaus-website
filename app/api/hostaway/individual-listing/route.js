import { getHostAwayListingById } from "@/lib/hostaway/listings";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return new Response(JSON.stringify({ message: "Missing listing ID" }), {
        status: 400,
      });
    }
    
    const data = await getHostAwayListingById(id);
    return Response.json(data);
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
