import { getGuestyListingById, GuestyApiError } from "@/lib/guesty/listings";

export const revalidate = 300;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    if (!id) {
      return new Response(JSON.stringify({ message: "Missing listing ID" }), {
        status: 400,
      });
    }

    const listing = await getGuestyListingById(id);
    if (!listing) {
      return new Response(JSON.stringify({ message: "Not found" }), {
        status: 404,
      });
    }

    return Response.json(listing);
  } catch (error) {
    const status =
      error instanceof GuestyApiError &&
      error.status >= 400 &&
      error.status < 600
        ? error.status
        : 502;
    console.error(
      `[guesty] /api/guesty/listings/[id] failed (status=${status})`,
    );
    return new Response(
      JSON.stringify({ message: "Failed to load Guesty listing" }),
      { status },
    );
  }
}
