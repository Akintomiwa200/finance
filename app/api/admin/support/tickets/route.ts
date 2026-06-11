import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getSupportTickets, createSupportTicket } from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  return NextResponse.json(getSupportTickets());
}

export async function POST(req: Request) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  const body = await req.json();
  const ticket = createSupportTicket({
    title: body.title,
    description: body.description,
    status: "OPEN",
    priority: body.priority ?? "MEDIUM",
    organizationId: body.organizationId,
    organizationName: body.organizationName,
    createdByName: session!.user.name ?? "Super Admin",
    assignedToName: null,
  });

  pushRealtimeEvent({
    event: "create",
    entity: "support_ticket",
    data: ticket,
    userId: session!.user.id,
  });

  return NextResponse.json(ticket);
}
