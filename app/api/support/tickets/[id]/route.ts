import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import {
  getSupportTicket,
  getTicketComments,
  addTicketComment,
  updateTicketStatus,
} from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, org } = await requireAuthenticatedUser();
  if (error) return error;

  await prepareSupportData();
  const { id } = await params;
  const ticket = getSupportTicket(id);

  if (!ticket || ticket.organizationId !== org!.id) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json({
    ticket,
    comments: getTicketComments(id),
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session, org } = await requireAuthenticatedUser();
  if (error) return error;

  await prepareSupportData();
  const { id } = await params;
  const ticket = getSupportTicket(id);

  if (!ticket || ticket.organizationId !== org!.id) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const body = await req.json();

  if (body.status === "CLOSED") {
    const updated = updateTicketStatus(id, "CLOSED");
    pushRealtimeEvent({
      event: "update",
      entity: "support_ticket",
      data: updated,
      userId: session!.user.id,
    });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
