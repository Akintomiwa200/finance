import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import { getLiveFixSession } from "@/src/services/support.service";
import {
  getSignalState,
  setSignalOffer,
  addIceCandidate,
  clearSignalState,
} from "@/src/services/webrtc-signaling.service";
import { prepareSupportData } from "@/src/lib/support-api";

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

  return NextResponse.json(getSignalState(id));
}

export async function POST(
  req: Request,
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

  const body = await req.json();

  if (body.type === "offer" && body.sdp) {
    return NextResponse.json(setSignalOffer(id, body.sdp));
  }

  if (body.type === "ice" && body.candidate) {
    return NextResponse.json(addIceCandidate(id, "host", body.candidate));
  }

  if (body.type === "reset") {
    clearSignalState(id);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Invalid signal payload" }, { status: 400 });
}
