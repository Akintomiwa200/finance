import type {
  SupportTicket,
  SupportComment,
  SupportActivity,
  SupportActivityType,
  SupportTicketLabel,
  LiveFixSession,
  LiveFixChatMessage,
  LiveFixSessionState,
} from "@/src/types/admin";
import { generateId } from "@/src/lib/utils";

const tickets: SupportTicket[] = [
  {
    id: "tkt_001",
    title: "Payment gateway integration failing",
    description: "Our payment gateway returns 502 errors when processing vendor bills.",
    status: "IN_PROGRESS",
    priority: "HIGH",
    organizationId: "org_1",
    organizationName: "Acme Corp",
    createdByName: "John Doe",
    assignedToName: "Support Team",
    labels: ["integration", "bug"],
    githubIssueUrl: "https://github.com/faas-platform/finance/issues/42",
    jiraIssueKey: "FAAS-128",
    commentCount: 3,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tkt_002",
    title: "Cannot export payroll reports",
    description: "PDF export button is unresponsive on the payroll reports page.",
    status: "OPEN",
    priority: "MEDIUM",
    organizationId: "org_2",
    organizationName: "Beta Corp",
    createdByName: "Sarah Jones",
    assignedToName: null,
    labels: ["bug"],
    githubIssueUrl: null,
    jiraIssueKey: null,
    commentCount: 1,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "tkt_003",
    title: "Request live-fix session for ledger mismatch",
    description: "Trial balance does not match journal entries. Need remote assistance.",
    status: "OPEN",
    priority: "URGENT",
    organizationId: "org_3",
    organizationName: "Gamma Ltd",
    createdByName: "Mike Ross",
    assignedToName: null,
    labels: ["account", "bug"],
    githubIssueUrl: null,
    jiraIssueKey: "FAAS-131",
    commentCount: 0,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

const comments: SupportComment[] = [
  {
    id: "cmt_001",
    ticketId: "tkt_001",
    content: "We are investigating the gateway timeout issue.",
    authorName: "Support Team",
    isStaff: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cmt_002",
    ticketId: "tkt_001",
    content: "Can you share the error logs from the last failed transaction?",
    authorName: "Support Team",
    isStaff: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cmt_003",
    ticketId: "tkt_001",
    content: "Attached logs from yesterday's failed batch run.",
    authorName: "John Doe",
    isStaff: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "cmt_004",
    ticketId: "tkt_001",
    content: "Escalated to payments squad — likely upstream timeout on vendor API.",
    authorName: "Support Team",
    isStaff: true,
    isInternal: true,
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
  },
];

const activities: SupportActivity[] = [
  {
    id: "act_001",
    ticketId: "tkt_001",
    type: "created",
    actorName: "John Doe",
    message: "Ticket opened",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_002",
    ticketId: "tkt_001",
    type: "assigned",
    actorName: "Support Team",
    message: "Assigned to Support Team",
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_003",
    ticketId: "tkt_001",
    type: "status_changed",
    actorName: "Support Team",
    message: "Status changed to In Progress",
    metadata: { from: "OPEN", to: "IN_PROGRESS" },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "act_004",
    ticketId: "tkt_001",
    type: "github_linked",
    actorName: "Support Team",
    message: "Linked GitHub issue #42",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
];

const liveFixSessions: LiveFixSession[] = [
  {
    id: "lfx_001",
    ticketId: "tkt_003",
    organizationId: "org_3",
    organizationName: "Gamma Ltd",
    status: "active",
    sessionCode: "FX-4829",
    requestedBy: "Mike Ross",
    startedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

const liveFixChatMessages: LiveFixChatMessage[] = [
  {
    id: "lfx_chat_001",
    sessionId: "lfx_001",
    author: "admin",
    authorName: "Support Agent",
    content: "Hello! I'm connected. What issue are you seeing?",
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
];

const liveFixSessionStates = new Map<string, LiveFixSessionState>();

function defaultSessionState(sessionId: string): LiveFixSessionState {
  return {
    sessionId,
    isSharing: false,
    isMuted: false,
    isVideoOff: false,
    remoteControlRequested: false,
    remoteControlGranted: false,
    activeRemoteTool: null,
    updatedAt: new Date().toISOString(),
  };
}

function touchTicket(ticket: SupportTicket) {
  ticket.updatedAt = new Date().toISOString();
}

export function logTicketActivity(
  ticketId: string,
  type: SupportActivityType,
  actorName: string | null,
  message: string,
  metadata?: Record<string, string>,
): SupportActivity {
  const activity: SupportActivity = {
    id: generateId("act_"),
    ticketId,
    type,
    actorName,
    message,
    metadata,
    createdAt: new Date().toISOString(),
  };
  activities.unshift(activity);
  return activity;
}

export function remapOrganizationId(mockId: string, realId: string) {
  for (const ticket of tickets) {
    if (ticket.organizationId === mockId) {
      ticket.organizationId = realId;
    }
  }
  for (const session of liveFixSessions) {
    if (session.organizationId === mockId) {
      session.organizationId = realId;
    }
  }
}

export function getSupportTickets(organizationId?: string): SupportTicket[] {
  const list = [...tickets];
  if (organizationId) {
    return list.filter((t) => t.organizationId === organizationId);
  }
  return list;
}

export function createSupportTicket(
  data: Omit<SupportTicket, "id" | "commentCount" | "createdAt" | "updatedAt">,
  actorName?: string | null,
): SupportTicket {
  const ticket: SupportTicket = {
    ...data,
    labels: data.labels ?? [],
    id: generateId("tkt_"),
    commentCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tickets.unshift(ticket);
  logTicketActivity(
    ticket.id,
    "created",
    actorName ?? data.createdByName,
    "Ticket opened",
  );
  return ticket;
}

export function getSupportTicket(id: string): SupportTicket | undefined {
  return tickets.find((t) => t.id === id);
}

export function getTicketComments(
  ticketId: string,
  options?: { includeInternal?: boolean },
): SupportComment[] {
  const includeInternal = options?.includeInternal ?? false;
  return comments
    .filter((c) => c.ticketId === ticketId)
    .filter((c) => includeInternal || !c.isInternal)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function getTicketActivities(ticketId: string): SupportActivity[] {
  return activities
    .filter((a) => a.ticketId === ticketId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addTicketComment(
  ticketId: string,
  content: string,
  authorName: string,
  options?: { isStaff?: boolean; isInternal?: boolean; actorName?: string | null },
): SupportComment {
  const isStaff = options?.isStaff ?? false;
  const isInternal = options?.isInternal ?? false;

  const comment: SupportComment = {
    id: generateId("cmt_"),
    ticketId,
    content,
    authorName,
    isStaff,
    isInternal,
    createdAt: new Date().toISOString(),
  };
  comments.push(comment);

  const ticket = tickets.find((t) => t.id === ticketId);
  if (ticket) {
    if (!isInternal) {
      ticket.commentCount += 1;
    }
    touchTicket(ticket);
  }

  logTicketActivity(
    ticketId,
    isInternal ? "internal_note" : "comment",
    options?.actorName ?? authorName,
    isInternal ? "Internal note added" : isStaff ? "Support replied" : "Customer replied",
  );

  return comment;
}

export function updateTicketStatus(
  id: string,
  status: SupportTicket["status"],
  actorName?: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket && ticket.status !== status) {
    const from = ticket.status;
    ticket.status = status;
    touchTicket(ticket);
    logTicketActivity(
      id,
      "status_changed",
      actorName ?? null,
      `Status changed to ${status.replace(/_/g, " ")}`,
      { from, to: status },
    );
  }
  return ticket;
}

export function updateTicketPriority(
  id: string,
  priority: SupportTicket["priority"],
  actorName?: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket && ticket.priority !== priority) {
    const from = ticket.priority;
    ticket.priority = priority;
    touchTicket(ticket);
    logTicketActivity(
      id,
      "priority_changed",
      actorName ?? null,
      `Priority changed to ${priority}`,
      { from, to: priority },
    );
  }
  return ticket;
}

export function updateTicketAssignment(
  id: string,
  assignedToName: string | null,
  actorName?: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.assignedToName = assignedToName;
    touchTicket(ticket);
    logTicketActivity(
      id,
      "assigned",
      actorName ?? null,
      assignedToName ? `Assigned to ${assignedToName}` : "Unassigned",
      assignedToName ? { assignee: assignedToName } : undefined,
    );
  }
  return ticket;
}

export function updateTicketLabels(
  id: string,
  labels: SupportTicketLabel[],
  actorName?: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.labels = labels;
    touchTicket(ticket);
    logTicketActivity(
      id,
      "label_changed",
      actorName ?? null,
      `Labels updated: ${labels.join(", ") || "none"}`,
    );
  }
  return ticket;
}

export function updateTicketGithubIssue(
  id: string,
  githubIssueUrl: string | null,
  actorName?: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.githubIssueUrl = githubIssueUrl;
    touchTicket(ticket);
    if (githubIssueUrl) {
      logTicketActivity(
        id,
        "github_linked",
        actorName ?? null,
        `Linked GitHub issue`,
        { url: githubIssueUrl },
      );
    }
  }
  return ticket;
}

export function updateTicketJiraIssue(
  id: string,
  jiraIssueKey: string | null,
  actorName?: string | null,
): SupportTicket | undefined {
  const ticket = tickets.find((t) => t.id === id);
  if (ticket) {
    ticket.jiraIssueKey = jiraIssueKey;
    touchTicket(ticket);
    if (jiraIssueKey) {
      logTicketActivity(
        id,
        "jira_linked",
        actorName ?? null,
        `Linked Jira issue ${jiraIssueKey}`,
        { key: jiraIssueKey },
      );
    }
  }
  return ticket;
}

export function getLiveFixSessions(organizationId?: string): LiveFixSession[] {
  const list = [...liveFixSessions];
  if (organizationId) {
    return list.filter((s) => s.organizationId === organizationId);
  }
  return list;
}

export function getLiveFixSessionsForTicket(ticketId: string): LiveFixSession[] {
  return liveFixSessions.filter((s) => s.ticketId === ticketId);
}

export function getLiveFixSession(id: string): LiveFixSession | undefined {
  return liveFixSessions.find((s) => s.id === id);
}

export function createLiveFixSession(data: {
  ticketId?: string;
  organizationId?: string;
  organizationName: string;
  requestedBy: string;
  requestedByEmail?: string | null;
  requestedByUserId?: string | null;
  actorName?: string | null;
}): LiveFixSession {
  const session: LiveFixSession = {
    id: generateId("lfx_"),
    ticketId: data.ticketId ?? null,
    organizationId: data.organizationId,
    organizationName: data.organizationName,
    status: "waiting",
    sessionCode: `FX-${Math.floor(1000 + Math.random() * 9000)}`,
    requestedBy: data.requestedBy,
    requestedByEmail: data.requestedByEmail ?? null,
    requestedByUserId: data.requestedByUserId ?? null,
    startedAt: null,
    createdAt: new Date().toISOString(),
  };
  liveFixSessions.unshift(session);

  if (data.ticketId) {
    logTicketActivity(
      data.ticketId,
      "live_fix_linked",
      data.actorName ?? data.requestedBy,
      `Live fix session ${session.sessionCode} requested`,
      { sessionId: session.id },
    );
  }

  return session;
}

export function startLiveFixSession(id: string): LiveFixSession | undefined {
  const session = liveFixSessions.find((s) => s.id === id);
  if (session) {
    session.status = "active";
    session.startedAt = new Date().toISOString();
  }
  return session;
}

export function endLiveFixSession(id: string): LiveFixSession | undefined {
  const session = liveFixSessions.find((s) => s.id === id);
  if (session) {
    session.status = "ended";
    session.endedAt = new Date().toISOString();
  }
  return session;
}

export function getLiveFixChatMessages(sessionId: string): LiveFixChatMessage[] {
  return liveFixChatMessages
    .filter((m) => m.sessionId === sessionId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}

export function addLiveFixChatMessage(data: {
  sessionId: string;
  author: LiveFixChatMessage["author"];
  authorName: string;
  content: string;
}): LiveFixChatMessage {
  const message: LiveFixChatMessage = {
    id: generateId("lfx_chat_"),
    sessionId: data.sessionId,
    author: data.author,
    authorName: data.authorName,
    content: data.content,
    createdAt: new Date().toISOString(),
  };
  liveFixChatMessages.push(message);
  return message;
}

export function getLiveFixSessionState(sessionId: string): LiveFixSessionState {
  if (!liveFixSessionStates.has(sessionId)) {
    liveFixSessionStates.set(sessionId, defaultSessionState(sessionId));
  }
  return { ...liveFixSessionStates.get(sessionId)! };
}

export function updateLiveFixSessionState(
  sessionId: string,
  patch: Partial<Omit<LiveFixSessionState, "sessionId" | "updatedAt">>,
): LiveFixSessionState {
  const current = getLiveFixSessionState(sessionId);
  const next: LiveFixSessionState = {
    ...current,
    ...patch,
    sessionId,
    updatedAt: new Date().toISOString(),
  };
  liveFixSessionStates.set(sessionId, next);
  return { ...next };
}

export function getLinkedIssuesSummary() {
  const linkedGithub = tickets.filter((t) => t.githubIssueUrl);
  const linkedJira = tickets.filter((t) => t.jiraIssueKey);
  return { linkedGithub, linkedJira };
}
