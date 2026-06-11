import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import { getSupportTickets, createSupportTicket } from "@/src/services/support.service";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import { prepareSupportData } from "@/src/lib/support-api";

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

  const ticket = createSupportTicket({
    title: body.title,
    description: body.description,
    status: "OPEN",
    priority,
    organizationId: org!.id,
    organizationName: org!.name,
    createdByName: session!.user.name ?? "User",
    assignedToName: null,
    githubIssueUrl: null,
    jiraIssueKey: null,
  });

  pushRealtimeEvent({
    event: "create",
    entity: "support_ticket",
    data: ticket,
    userId: session!.user.id,
  });

  return NextResponse.json(ticket);
}
