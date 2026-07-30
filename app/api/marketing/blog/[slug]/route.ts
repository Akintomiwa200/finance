import { NextResponse } from "next/server";
import { getBlogPostBySlug } from "@/src/services/marketing.service";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const post = await getBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load blog post";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
