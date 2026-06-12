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
  /** Tenant companies using the software (excludes platform org) */
  totalOrganizations: number;
  activeOrganizations: number;
  /** People at tenant companies who use the product */
  tenantUserCount: number;
  /** Internal staff: support, IT, developers, etc. */
  platformTeamCount: number;
  /** @deprecated Use tenantUserCount — kept for older UI references */
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

export type SupportTicketLabel =
  | "bug"
  | "billing"
  | "feature_request"
  | "account"
  | "integration"
  | "other";

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  organizationId: string;
  organizationName: string;
  createdByName: string | null;
  createdByEmail?: string | null;
  createdByUserId?: string | null;
  assignedToName: string | null;
  labels: SupportTicketLabel[];
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
  isInternal?: boolean;
  createdAt: string;
}

export type SupportActivityType =
  | "created"
  | "status_changed"
  | "priority_changed"
  | "assigned"
  | "comment"
  | "internal_note"
  | "label_changed"
  | "live_fix_linked"
  | "github_linked"
  | "jira_linked";

export interface SupportActivity {
  id: string;
  ticketId: string;
  type: SupportActivityType;
  actorName: string | null;
  message: string;
  metadata?: Record<string, string>;
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

export interface PlatformPermission {
  key: string;
  label: string;
  category: string;
  description: string;
}

export interface GroupAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  groupId: string;
  groupName: string;
  assignedAt: string;
  assignedBy: string | null;
}

export interface SystemRole {
  id: string;
  key: string;
  name: string;
  description: string;
  privilegeGroupId: string | null;
  isBuiltIn: boolean;
  memberCount: number;
  capabilities: string[];
}

export interface LiveFixSession {
  id: string;
  ticketId: string | null;
  organizationId?: string;
  organizationName: string;
  status: "waiting" | "active" | "ended";
  sessionCode: string;
  requestedBy: string;
  requestedByEmail?: string | null;
  requestedByUserId?: string | null;
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
