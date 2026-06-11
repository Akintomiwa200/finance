import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getPermissionGroup,
  updatePermissionGroup,
  deletePermissionGroup,
} from "@/src/services/permission-group.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const group = getPermissionGroup(id);

  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();
  const group = updatePermissionGroup(id, body);

  if (!group) {
    return NextResponse.json({ error: "Group not found or is a system group" }, { status: 404 });
  }

  pushRealtimeEvent({
    event: "update",
    entity: "permission_group",
    data: group,
    userId: session!.user.id,
  });

  return NextResponse.json(group);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const deleted = deletePermissionGroup(id);

  if (!deleted) {
    return NextResponse.json({ error: "Group not found or is a system group" }, { status: 404 });
  }

  pushRealtimeEvent({
    event: "delete",
    entity: "permission_group",
    data: { id },
    userId: session!.user.id,
  });

  return NextResponse.json({ success: true });
}
