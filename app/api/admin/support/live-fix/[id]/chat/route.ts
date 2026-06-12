import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getLiveFixSession,
  getLiveFixChatMessages,
  addLiveFixChatMessage,
} from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";
import { onLiveFixChatMessage } from "@/src/services/notification-events.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  const { id } = await params;
  const session = getLiveFixSession(id);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(getLiveFixChatMessages(id));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session: adminSession } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  const { id } = await params;
  const session = getLiveFixSession(id);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const body = await req.json();
  const content = String(body.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const message = addLiveFixChatMessage({
    sessionId: id,
    author: "admin",
    authorName: adminSession!.user.name ?? "Support Agent",
    content,
  });

  void onLiveFixChatMessage(session, message).catch((err) =>
    console.error("[notify] admin live fix chat", err),
  );

  pushRealtimeEvent({
    event: "create",
    entity: "live_fix_chat",
    data: message,
    userId: adminSession!.user.id,
  });

  return NextResponse.json(message);
}
