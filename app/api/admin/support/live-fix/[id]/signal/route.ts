import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getLiveFixSession } from "@/src/services/support.service";
import {
  getSignalState,
  setSignalAnswer,
  addIceCandidate,
} from "@/src/services/webrtc-signaling.service";
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

  return NextResponse.json(getSignalState(id));
}

export async function POST(
  req: Request,
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

  const body = await req.json();

  if (body.type === "answer" && body.sdp) {
    return NextResponse.json(setSignalAnswer(id, body.sdp));
  }

  if (body.type === "ice" && body.candidate) {
    return NextResponse.json(addIceCandidate(id, "viewer", body.candidate));
  }

  return NextResponse.json({ error: "Invalid signal payload" }, { status: 400 });
}
