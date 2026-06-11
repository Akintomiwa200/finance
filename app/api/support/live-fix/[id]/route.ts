import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import { getLiveFixSession } from "@/src/services/support.service";
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

  return NextResponse.json(session);
}
