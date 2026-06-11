import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getPermissionGroups,
  createPermissionGroup,
} from "@/src/services/permission-group.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  return NextResponse.json(getPermissionGroups());
}

export async function POST(req: Request) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json();

  if (!body.name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const group = createPermissionGroup({
    name: body.name,
    description: body.description,
    permissions: body.permissions ?? {},
  });

  pushRealtimeEvent({
    event: "create",
    entity: "permission_group",
    data: group,
    userId: session!.user.id,
  });

  return NextResponse.json(group);
}
