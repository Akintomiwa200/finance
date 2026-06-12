import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getGroupAssignment,
  deleteGroupAssignment,
} from "@/src/services/group-assignment.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const assignment = getGroupAssignment(id);

  if (!assignment) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  }

  return NextResponse.json(assignment);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const deleted = deleteGroupAssignment(id);

  if (!deleted) {
    return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
  }

  pushRealtimeEvent({
    event: "delete",
    entity: "group_assignment",
    data: { id },
    userId: session!.user.id,
  });

  return NextResponse.json({ success: true });
}
