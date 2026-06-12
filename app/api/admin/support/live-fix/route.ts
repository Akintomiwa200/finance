import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getLiveFixSessions,
  createLiveFixSession,
  startLiveFixSession,
  getSupportTicket,
} from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";
import {
  onLiveFixSessionCreated,
  onLiveFixSessionStarted,
} from "@/src/services/notification-events.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  return NextResponse.json(getLiveFixSessions());
}

export async function POST(req: Request) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  const body = await req.json();

  if (body.action === "start" && body.sessionId) {
    const session_ = startLiveFixSession(body.sessionId);
    if (!session_) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    void onLiveFixSessionStarted(session_).catch((err) =>
      console.error("[notify] live fix started", err),
    );

    pushRealtimeEvent({
      event: "update",
      entity: "live_fix_session",
      data: session_,
      userId: session!.user.id,
    });

    return NextResponse.json(session_);
  }

  const linkedTicket = body.ticketId ? getSupportTicket(body.ticketId) : undefined;

  const liveSession = createLiveFixSession({
    ticketId: body.ticketId,
    organizationId: body.organizationId ?? linkedTicket?.organizationId,
    organizationName:
      body.organizationName ?? linkedTicket?.organizationName ?? "Unknown",
    requestedBy: body.requestedBy ?? session!.user.name ?? "Super Admin",
  });

  pushRealtimeEvent({
    event: "create",
    entity: "live_fix_session",
    data: liveSession,
    userId: session!.user.id,
  });

  return NextResponse.json(liveSession);
}
