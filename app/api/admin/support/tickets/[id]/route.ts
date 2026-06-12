import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getSupportTicket,
  getTicketComments,
  getTicketActivities,
  getLiveFixSessionsForTicket,
  addTicketComment,
  updateTicketStatus,
  updateTicketPriority,
  updateTicketAssignment,
  updateTicketLabels,
  updateTicketGithubIssue,
  updateTicketJiraIssue,
} from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";
import {
  onSupportCommentAdded,
  onSupportTicketUpdated,
} from "@/src/services/notification-events.service";

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
    comments: getTicketComments(id, { includeInternal: true }),
    activities: getTicketActivities(id),
    liveFixSessions: getLiveFixSessionsForTicket(id),
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
  const actorName = session!.user.name ?? "Super Admin";
  let ticket = getSupportTicket(id);

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  if (body.status) {
    ticket = updateTicketStatus(id, body.status, actorName) ?? ticket;
  }

  if (body.priority) {
    ticket = updateTicketPriority(id, body.priority, actorName) ?? ticket;
  }

  if ("assignedToName" in body) {
    ticket = updateTicketAssignment(id, body.assignedToName, actorName) ?? ticket;
  }

  if (body.labels) {
    ticket = updateTicketLabels(id, body.labels, actorName) ?? ticket;
  }

  if ("githubIssueUrl" in body) {
    ticket = updateTicketGithubIssue(id, body.githubIssueUrl, actorName) ?? ticket;
  }

  if ("jiraIssueKey" in body) {
    ticket = updateTicketJiraIssue(id, body.jiraIssueKey, actorName) ?? ticket;
  }

  if (body.comment) {
    const comment = addTicketComment(id, body.comment, actorName, {
      isStaff: true,
      isInternal: false,
      actorName,
    });
    void onSupportCommentAdded(ticket, comment).catch((err) =>
      console.error("[notify] staff comment", err),
    );
    pushRealtimeEvent({
      event: "create",
      entity: "support_comment",
      data: comment,
      userId: session!.user.id,
    });
    return NextResponse.json({ ticket, comment });
  }

  if (body.internalNote) {
    const comment = addTicketComment(id, body.internalNote, actorName, {
      isStaff: true,
      isInternal: true,
      actorName,
    });
    pushRealtimeEvent({
      event: "create",
      entity: "support_comment",
      data: comment,
      userId: session!.user.id,
    });
    return NextResponse.json({ ticket, comment });
  }

  void onSupportTicketUpdated(ticket).catch((err) =>
    console.error("[notify] ticket updated", err),
  );

  pushRealtimeEvent({
    event: "update",
    entity: "support_ticket",
    data: ticket,
    userId: session!.user.id,
  });

  return NextResponse.json(ticket);
}
