import type { PermissionGroup } from "@/src/types/admin";
import { generateId } from "@/src/lib/utils";
import {
  PLATFORM_ADMIN_AREAS,
  PERMISSION_LEVELS,
} from "@/src/services/platform-permissions.service";

export { PLATFORM_ADMIN_AREAS, PERMISSION_LEVELS };

/** Tenant product modules — used by tenant module management, not platform team roles */
export const MODULE_PERMISSIONS = [
  "dashboard", "employees", "payroll", "ledger", "petty-cash",
  "payables", "receivables", "cash", "assets", "tax", "budget",
  "financial-reports", "approvals", "departments", "reports", "settings", "expenses",
] as const;

const groups: PermissionGroup[] = [
  {
    id: "grp_001",
    name: "Platform Administrator",
    description: "Full access to all admin console areas for senior platform staff",
    permissions: {
      dashboard: "full",
      companies: "full",
      team: "full",
      departments: "full",
      billing: "full",
      reports: "full",
      "audit-logs": "full",
      roles: "full",
      support: "full",
      modules: "full",
      settings: "full",
    },
    isSystem: true,
    assignmentCount: 0,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "grp_002",
    name: "Billing Operations",
    description: "Subscription plans, invoices, and revenue reporting",
    permissions: {
      dashboard: "view",
      companies: "view",
      billing: "full",
      reports: "view",
      "audit-logs": "view",
    },
    isSystem: true,
    assignmentCount: 0,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "grp_003",
    name: "Customer Success",
    description: "Support tickets, live fix, and tenant visibility for escalations",
    permissions: {
      dashboard: "view",
      companies: "view",
      support: "full",
      "audit-logs": "view",
      reports: "view",
    },
    isSystem: true,
    assignmentCount: 0,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "grp_004",
    name: "Support Agent",
    description: "Front-line ticket handling and live fix participation",
    permissions: {
      dashboard: "view",
      support: "edit",
      companies: "view",
    },
    isSystem: true,
    assignmentCount: 0,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "grp_005",
    name: "Platform Developer",
    description: "Module catalog, integrations, and platform configuration",
    permissions: {
      dashboard: "view",
      modules: "full",
      settings: "edit",
      reports: "view",
      "audit-logs": "view",
    },
    isSystem: true,
    assignmentCount: 0,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getPermissionGroups(): PermissionGroup[] {
  return [...groups];
}

export function getPermissionGroup(id: string): PermissionGroup | undefined {
  return groups.find((g) => g.id === id);
}

export function createPermissionGroup(data: {
  name: string;
  description?: string;
  permissions: Record<string, string>;
}): PermissionGroup {
  const group: PermissionGroup = {
    id: generateId("grp_"),
    name: data.name,
    description: data.description ?? null,
    permissions: data.permissions,
    isSystem: false,
    assignmentCount: 0,
    createdAt: new Date().toISOString(),
  };
  groups.push(group);
  return group;
}

export function updatePermissionGroup(
  id: string,
  data: Partial<Pick<PermissionGroup, "name" | "description" | "permissions">>,
): PermissionGroup | undefined {
  const group = groups.find((g) => g.id === id);
  if (!group || group.isSystem) return undefined;

  if (data.name) group.name = data.name;
  if (data.description !== undefined) group.description = data.description;
  if (data.permissions) group.permissions = data.permissions;

  return group;
}

export function deletePermissionGroup(id: string): boolean {
  const index = groups.findIndex((g) => g.id === id && !g.isSystem);
  if (index === -1) return false;
  groups.splice(index, 1);
  return true;
}

export function defaultPermissions(): Record<string, string> {
  return Object.fromEntries(
    PLATFORM_ADMIN_AREAS.map((area) => [area, "none"]),
  );
}
