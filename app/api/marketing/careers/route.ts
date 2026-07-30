import { NextResponse } from "next/server";
import { listJobListings } from "@/src/services/marketing.service";

export async function GET() {
  try {
    const jobs = await listJobListings();
    return NextResponse.json({ success: true, data: jobs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load jobs";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
