export interface AdminOrganization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  email: string | null;
  phone: string | null;
  isPlatform: boolean;
  isActive: boolean;
  employeeCount: number;
  departmentCount: number;
  domain?: string;
  plan?: string;
  enabledModules?: string[];
  createdAt: string;
}

export interface AdminEmployee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  organizationId: string;
  organizationName: string;
  departmentName: string | null;
  createdAt: string;
}

export interface AdminDepartment {
  id: string;
  name: string;
  code: string;
  organizationId: string;
  organizationName: string;
  employeeCount: number;
  head: string | null;
  createdAt: string;
}

export interface AdminStats {
  totalOrganizations: number;
  activeOrganizations: number;
  totalEmployees: number;
  totalDepartments: number;
  totalTransactions: number;
  recentSignups: number;
  revenueEstimate: number;
  growthRate: number;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  userName: string | null;
  organizationName: string | null;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  organizationId: string;
  organizationName: string;
  createdByName: string | null;
  assignedToName: string | null;
  githubIssueUrl?: string | null;
  jiraIssueKey?: string | null;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SupportComment {
  id: string;
  ticketId: string;
  content: string;
  authorName: string | null;
  isStaff?: boolean;
  createdAt: string;
}

export interface PermissionGroup {
  id: string;
  name: string;
  description: string | null;
  permissions: Record<string, string>;
  isSystem: boolean;
  assignmentCount: number;
  createdAt: string;
}

export interface LiveFixSession {
  id: string;
  ticketId: string | null;
  organizationId?: string;
  organizationName: string;
  status: "waiting" | "active" | "ended";
  sessionCode: string;
  requestedBy: string;
  startedAt: string | null;
  endedAt?: string | null;
  createdAt: string;
}

export interface LiveFixChatMessage {
  id: string;
  sessionId: string;
  author: "admin" | "customer";
  authorName: string;
  content: string;
  createdAt: string;
}

export interface LiveFixSessionState {
  sessionId: string;
  isSharing: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  remoteControlRequested: boolean;
  remoteControlGranted: boolean;
  activeRemoteTool: string | null;
  updatedAt: string;
}
