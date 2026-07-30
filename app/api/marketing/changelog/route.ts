import { NextResponse } from "next/server";
import { listChangelogEntries } from "@/src/services/marketing.service";

export async function GET() {
  try {
    const entries = await listChangelogEntries();
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load changelog";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
