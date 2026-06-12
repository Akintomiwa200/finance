import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import {
  getLiveFixSessions,
  createLiveFixSession,
  getSupportTicket,
} from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";
import { onLiveFixSessionCreated } from "@/src/services/notification-events.service";

export async function GET() {
  const { error, org } = await requireAuthenticatedUser();
  if (error) return error;

  await prepareSupportData();
  return NextResponse.json(getLiveFixSessions(org!.id));
}

export async function POST(req: Request) {
  const { error, session, org } = await requireAuthenticatedUser();
  if (error) return error;

  await prepareSupportData();
  const body = await req.json();

  if (body.ticketId) {
    const ticket = getSupportTicket(body.ticketId);
    if (!ticket || ticket.organizationId !== org!.id) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }
  }

  const liveSession = createLiveFixSession({
    ticketId: body.ticketId,
    organizationId: org!.id,
    organizationName: org!.name,
    requestedBy: session!.user.name ?? "User",
    requestedByEmail: session!.user.email ?? null,
    requestedByUserId: session!.user.id,
    actorName: session!.user.name ?? "User",
  });

  void onLiveFixSessionCreated(liveSession, {
    userId: session!.user.id,
    email: session!.user.email ?? undefined,
    name: session!.user.name ?? undefined,
  }).catch((err) => console.error("[notify] live fix created", err));

  pushRealtimeEvent({
    event: "create",
    entity: "live_fix_session",
    data: liveSession,
    userId: session!.user.id,
  });

  return NextResponse.json(liveSession);
}
