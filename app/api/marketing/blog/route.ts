import { NextResponse } from "next/server";
import { listBlogPosts } from "@/src/services/marketing.service";

export async function GET() {
  try {
    const posts = await listBlogPosts();
    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load blog posts";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
