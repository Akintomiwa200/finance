import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getGroupAssignments,
  createGroupAssignment,
} from "@/src/services/group-assignment.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";

export async function GET(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get("groupId");

  let assignments = getGroupAssignments();
  if (groupId) {
    assignments = assignments.filter((a) => a.groupId === groupId);
  }

  return NextResponse.json(assignments);
}

export async function POST(req: Request) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json();

  if (!body.employeeId || !body.groupId) {
    return NextResponse.json(
      { error: "employeeId and groupId are required" },
      { status: 400 },
    );
  }

  if (body.employeeRole === "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Super Admin accounts are not managed through privilege groups" },
      { status: 400 },
    );
  }

  const assignment = createGroupAssignment({
    employeeId: body.employeeId,
    employeeName: body.employeeName ?? "Unknown",
    employeeEmail: body.employeeEmail ?? "",
    employeeRole: body.employeeRole ?? "EMPLOYEE",
    groupId: body.groupId,
    assignedBy: session?.user?.name ?? "Super Admin",
  });

  if (!assignment) {
    return NextResponse.json({ error: "Invalid group" }, { status: 404 });
  }

  pushRealtimeEvent({
    event: "update",
    entity: "group_assignment",
    data: assignment,
    userId: session!.user.id,
  });

  return NextResponse.json(assignment);
}
