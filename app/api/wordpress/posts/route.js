import { NextResponse } from "next/server";
import { getPosts } from "@/lib/wordpress/blogs";

export async function GET() {
  const result = await getPosts();

  if (result.error) {
    return NextResponse.json(
      { error: result.error, details: result.details },
      { status: result.status || 500 },
    );
  }

  return NextResponse.json(result.posts);
}
