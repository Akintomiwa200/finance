import { NextResponse } from "next/server";
import { getJobListingBySlug } from "@/src/services/marketing.service";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const job = await getJobListingBySlug(slug);
    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load job";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
