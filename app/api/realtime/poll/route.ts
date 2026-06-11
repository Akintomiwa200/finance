import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { pollRealtimeEvents } from "@/src/lib/realtime-bus";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const since = searchParams.get("since") ?? searchParams.get("after") ?? undefined;
  const events = pollRealtimeEvents(since);

  return NextResponse.json({
    events,
    messages: events,
    timestamp: new Date().toISOString(),
  });
}
