import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
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
  const { error, org } = await requireAuthenticatedUser();
  if (error) return error;

  await prepareSupportData();
  const { id } = await params;
  const session = getLiveFixSession(id);
  if (!session || session.organizationId !== org!.id) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  return NextResponse.json(getLiveFixChatMessages(id));
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, org, session: authSession } = await requireAuthenticatedUser();
  if (error) return error;

  await prepareSupportData();
  const { id } = await params;
  const session = getLiveFixSession(id);
  if (!session || session.organizationId !== org!.id) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const body = await req.json();
  const content = String(body.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }

  const message = addLiveFixChatMessage({
    sessionId: id,
    author: "customer",
    authorName: authSession!.user.name ?? session.requestedBy,
    content,
  });

  void onLiveFixChatMessage(session, message, {
    userId: authSession!.user.id,
    email: authSession!.user.email ?? undefined,
  }).catch((err) => console.error("[notify] live fix chat", err));

  pushRealtimeEvent({
    event: "create",
    entity: "live_fix_chat",
    data: message,
    userId: authSession!.user.id,
  });

  return NextResponse.json(message);
}
