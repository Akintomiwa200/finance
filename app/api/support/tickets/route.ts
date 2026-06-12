import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import { getSupportTickets, createSupportTicket } from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";
import { onSupportTicketCreated } from "@/src/services/notification-events.service";

export async function GET() {
  const { error, session, org } = await requireAuthenticatedUser();
  if (error) return error;

  await prepareSupportData();
  return NextResponse.json(getSupportTickets(org!.id));
}

export async function POST(req: Request) {
  const { error, session, org } = await requireAuthenticatedUser();
  if (error) return error;

  await prepareSupportData();
  const body = await req.json();
  const priority = (body.priority ?? "MEDIUM").toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "URGENT";

  const labels = Array.isArray(body.labels)
    ? body.labels
    : body.label
      ? [body.label]
      : [];

  const ticket = createSupportTicket(
    {
      title: body.title,
      description: body.description,
      status: "OPEN",
      priority,
      organizationId: org!.id,
      organizationName: org!.name,
      createdByName: session!.user.name ?? "User",
      createdByEmail: session!.user.email ?? null,
      createdByUserId: session!.user.id,
      assignedToName: null,
      labels,
      githubIssueUrl: null,
      jiraIssueKey: null,
    },
    session!.user.name ?? "User",
  );

  void onSupportTicketCreated(ticket, {
    userId: session!.user.id,
    email: session!.user.email ?? undefined,
    name: session!.user.name ?? undefined,
  }).catch((err) => console.error("[notify] ticket created", err));

  pushRealtimeEvent({
    event: "create",
    entity: "support_ticket",
    data: ticket,
    userId: session!.user.id,
  });

  return NextResponse.json(ticket);
}
