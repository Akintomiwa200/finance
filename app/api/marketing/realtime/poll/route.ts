import { NextResponse } from "next/server";
import { pollRealtimeEvents } from "@/src/lib/realtime-bus";

const MARKETING_ENTITIES = new Set([
  "marketing_seed",
  "marketing_blog_post",
  "marketing_job_listing",
  "marketing_job_application",
  "marketing_changelog",
  "marketing_integration",
  "marketing_contact",
  "marketing_newsletter",
]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since") ?? undefined;
  const events = pollRealtimeEvents(since).filter((event) =>
    MARKETING_ENTITIES.has(event.entity),
  );

  return NextResponse.json({
    success: true,
    events,
    timestamp: new Date().toISOString(),
  });
}
