import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getSupportTicket,
  getTicketComments,
  addTicketComment,
  updateTicketStatus,
  updateTicketPriority,
  updateTicketAssignment,
  updateTicketGithubIssue,
  updateTicketJiraIssue,
} from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  const { id } = await params;
  const ticket = getSupportTicket(id);

  if (!ticket) {
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
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  const { id } = await params;
  const body = await req.json();
  let ticket = getSupportTicket(id);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (body.status) {
    ticket = updateTicketStatus(id, body.status) ?? ticket;
  }

  if (body.priority) {
    ticket = updateTicketPriority(id, body.priority) ?? ticket;
  }

  if ("assignedToName" in body) {
    ticket = updateTicketAssignment(id, body.assignedToName) ?? ticket;
  }

  if ("githubIssueUrl" in body) {
    ticket = updateTicketGithubIssue(id, body.githubIssueUrl) ?? ticket;
  }

  if ("jiraIssueKey" in body) {
    ticket = updateTicketJiraIssue(id, body.jiraIssueKey) ?? ticket;
  }

  if (body.comment) {
    const comment = addTicketComment(
      id,
      body.comment,
      session!.user.name ?? "Super Admin",
      true,
    );
    pushRealtimeEvent({
      event: "create",
      entity: "support_comment",
      data: comment,
      userId: session!.user.id,
    });
    return NextResponse.json(comment);
  }

  pushRealtimeEvent({
    event: "update",
    entity: "support_ticket",
    data: ticket,
    userId: session!.user.id,
  });

  return NextResponse.json(ticket);
}
