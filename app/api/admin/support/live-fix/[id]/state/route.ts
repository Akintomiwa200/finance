import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getLiveFixSession,
  getLiveFixSessionState,
  updateLiveFixSessionState,
} from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";

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

  return NextResponse.json(getLiveFixSessionState(id));
}

export async function PATCH(
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
  const allowed = [
    "isSharing",
    "isMuted",
    "isVideoOff",
    "remoteControlRequested",
    "remoteControlGranted",
    "activeRemoteTool",
  ] as const;

  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  const state = updateLiveFixSessionState(id, patch);

  pushRealtimeEvent({
    event: "update",
    entity: "live_fix_state",
    data: state,
    userId: adminSession!.user.id,
  });

  return NextResponse.json(state);
}
