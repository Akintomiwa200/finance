import type { GroupAssignment } from "@/src/types/admin";
import { generateId } from "@/src/lib/utils";
import { getPermissionGroup, getPermissionGroups } from "@/src/services/permission-group.service";

const assignments: GroupAssignment[] = [
  {
    id: "asgn_001",
    employeeId: "emp_platform_01",
    employeeName: "Alex Rivera",
    employeeEmail: "alex@platform.internal",
    employeeRole: "SUPPORT_LEAD",
    groupId: "grp_003",
    groupName: "Customer Success",
    assignedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    assignedBy: "Super Admin",
  },
  {
    id: "asgn_002",
    employeeId: "emp_platform_02",
    employeeName: "Jordan Lee",
    employeeEmail: "jordan@platform.internal",
    employeeRole: "SUPPORT_AGENT",
    groupId: "grp_004",
    groupName: "Support Agent",
    assignedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    assignedBy: "Super Admin",
  },
  {
    id: "asgn_003",
    employeeId: "emp_platform_03",
    employeeName: "Sam Patel",
    employeeEmail: "sam@platform.internal",
    employeeRole: "BILLING_OPS",
    groupId: "grp_002",
    groupName: "Billing Operations",
    assignedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    assignedBy: "Super Admin",
  },
];

function syncAssignmentCounts() {
  const groups = getPermissionGroups();
  const counts = new Map<string, number>();
  for (const a of assignments) {
    counts.set(a.groupId, (counts.get(a.groupId) ?? 0) + 1);
  }
  for (const g of groups) {
    g.assignmentCount = counts.get(g.id) ?? 0;
  }
}

syncAssignmentCounts();

export function getGroupAssignments(): GroupAssignment[] {
  return [...assignments].sort(
    (a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime(),
  );
}

export function getGroupAssignment(id: string): GroupAssignment | undefined {
  return assignments.find((a) => a.id === id);
}

export function createGroupAssignment(data: {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  employeeRole: string;
  groupId: string;
  assignedBy?: string | null;
}): GroupAssignment | null {
  const group = getPermissionGroup(data.groupId);
  if (!group) return null;

  const existing = assignments.find((a) => a.employeeId === data.employeeId);
  if (existing) {
    existing.groupId = data.groupId;
    existing.groupName = group.name;
    existing.assignedAt = new Date().toISOString();
    existing.assignedBy = data.assignedBy ?? null;
    syncAssignmentCounts();
    return existing;
  }

  const assignment: GroupAssignment = {
    id: generateId("asgn_"),
    employeeId: data.employeeId,
    employeeName: data.employeeName,
    employeeEmail: data.employeeEmail,
    employeeRole: data.employeeRole,
    groupId: data.groupId,
    groupName: group.name,
    assignedAt: new Date().toISOString(),
    assignedBy: data.assignedBy ?? null,
  };
  assignments.push(assignment);
  syncAssignmentCounts();
  return assignment;
}

export function deleteGroupAssignment(id: string): boolean {
  const index = assignments.findIndex((a) => a.id === id);
  if (index === -1) return false;
  assignments.splice(index, 1);
  syncAssignmentCounts();
  return true;
}

export function getAssignmentsForGroup(groupId: string): GroupAssignment[] {
  return assignments.filter((a) => a.groupId === groupId);
}

export function getAssignmentForEmployee(employeeId: string): GroupAssignment | undefined {
  return assignments.find((a) => a.employeeId === employeeId);
}
