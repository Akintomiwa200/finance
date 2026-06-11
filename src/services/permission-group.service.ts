import type { PermissionGroup } from "@/src/types/admin";
import { generateId } from "@/src/lib/utils";

const groups: PermissionGroup[] = [
  {
    id: "grp_001",
    name: "Finance Full Access",
    description: "Complete access to all finance modules",
    permissions: {
      dashboard: "full",
      payroll: "full",
      ledger: "full",
      payables: "full",
      receivables: "full",
      reports: "full",
    },
    isSystem: true,
    assignmentCount: 12,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "grp_002",
    name: "Payroll Officer",
    description: "Payroll processing and employee management",
    permissions: {
      dashboard: "view",
      employees: "view",
      payroll: "full",
      reports: "view",
    },
    isSystem: true,
    assignmentCount: 8,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "grp_003",
    name: "Accounts Payable",
    description: "Vendor bills and payment processing",
    permissions: {
      dashboard: "view",
      payables: "full",
      ledger: "view",
      reports: "view",
    },
    isSystem: true,
    assignmentCount: 5,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "grp_004",
    name: "Department Head",
    description: "Approvals and department budget oversight",
    permissions: {
      dashboard: "view",
      employees: "view",
      departments: "view",
      budget: "view",
      approvals: "approve",
      expenses: "approve",
    },
    isSystem: true,
    assignmentCount: 15,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
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

export const MODULE_PERMISSIONS = [
  "dashboard", "employees", "payroll", "ledger", "petty-cash",
  "payables", "receivables", "cash", "assets", "tax", "budget",
  "financial-reports", "approvals", "departments", "reports", "settings", "expenses",
] as const;

export const PERMISSION_LEVELS = ["none", "view", "create", "edit", "delete", "approve", "full"] as const;
