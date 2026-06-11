import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import { getSupportTicket, addTicketComment } from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";

export async function POST(
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
  if (!body.content?.trim()) {
    return NextResponse.json({ error: "Comment required" }, { status: 400 });
  }

  const comment = addTicketComment(
    id,
    body.content.trim(),
    session!.user.name ?? "User",
    false,
  );

  pushRealtimeEvent({
    event: "create",
    entity: "support_comment",
    data: comment,
    userId: session!.user.id,
  });

  return NextResponse.json(comment);
}
