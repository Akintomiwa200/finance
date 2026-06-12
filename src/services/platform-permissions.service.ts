import type { PlatformPermission, SystemRole } from "@/src/types/admin";

/** Admin console areas platform team members can access — not tenant finance modules */
export const PLATFORM_ADMIN_AREAS = [
  "dashboard",
  "companies",
  "team",
  "departments",
  "billing",
  "reports",
  "audit-logs",
  "roles",
  "support",
  "modules",
  "settings",
] as const;

export type PlatformAdminArea = (typeof PLATFORM_ADMIN_AREAS)[number];

export const PERMISSION_LEVELS = [
  "none",
  "view",
  "create",
  "edit",
  "delete",
  "approve",
  "full",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  companies: "Companies",
  team: "Platform Team",
  departments: "Departments",
  billing: "Billing",
  reports: "Reports",
  "audit-logs": "Audit Logs",
  roles: "Roles & Groups",
  support: "Customer Success",
  modules: "Modules",
  settings: "Settings",
};

export function getPlatformPermissionCatalog(): PlatformPermission[] {
  return PLATFORM_ADMIN_AREAS.map((area) => ({
    key: area,
    label: CATEGORY_LABELS[area] ?? area,
    category: area,
    description: getAreaDescription(area),
  }));
}

function getAreaDescription(area: PlatformAdminArea): string {
  const descriptions: Record<PlatformAdminArea, string> = {
    dashboard: "Platform overview metrics and health indicators",
    companies: "Tenant organization onboarding and lifecycle",
    team: "Internal staff accounts (support, IT, developers)",
    departments: "Cross-tenant department directory",
    billing: "Plans, subscriptions, invoices, and payment methods",
    reports: "Revenue, growth, usage, and platform health reports",
    "audit-logs": "Compliance trail of platform and tenant changes",
    roles: "Privilege groups, permissions, and team assignments",
    support: "Tickets, live fix sessions, and integrations",
    modules: "Feature flags and module enablement per tenant",
    settings: "Platform configuration, security, and integrations",
  };
  return descriptions[area];
}

export function getSystemRoles(): SystemRole[] {
  return [
    {
      id: "sys_super_admin",
      key: "SUPER_ADMIN",
      name: "Super Admin",
      description:
        "Platform owner with unrestricted access. Not managed through privilege groups — this account governs the entire platform.",
      privilegeGroupId: null,
      isBuiltIn: true,
      memberCount: 1,
      capabilities: [
        "Full admin console access",
        "Manage privilege groups and assignments",
        "Billing and tenant lifecycle",
        "Cannot be demoted via group assignment",
      ],
    },
    {
      id: "sys_support_lead",
      key: "SUPPORT_LEAD",
      name: "Support Lead",
      description:
        "Leads customer success operations — tickets, live fix, and escalations for tenant companies.",
      privilegeGroupId: "grp_003",
      isBuiltIn: true,
      memberCount: 2,
      capabilities: [
        "Support inbox and live fix queue",
        "View tenant companies (read-only)",
        "Audit log visibility",
      ],
    },
    {
      id: "sys_support_agent",
      key: "SUPPORT_AGENT",
      name: "Support Agent",
      description:
        "Front-line support for tenant users — handles tickets and basic troubleshooting.",
      privilegeGroupId: "grp_004",
      isBuiltIn: true,
      memberCount: 5,
      capabilities: [
        "Ticket inbox",
        "Live fix participation",
        "Limited tenant visibility",
      ],
    },
    {
      id: "sys_billing_ops",
      key: "BILLING_OPS",
      name: "Billing Operations",
      description:
        "Manages subscription plans, invoices, and payment methods across tenant companies.",
      privilegeGroupId: "grp_002",
      isBuiltIn: true,
      memberCount: 3,
      capabilities: [
        "Billing plans and subscriptions",
        "Invoice review",
        "Revenue reports (view)",
      ],
    },
    {
      id: "sys_platform_dev",
      key: "PLATFORM_DEV",
      name: "Platform Developer",
      description:
        "Internal engineering staff — modules, integrations, and platform settings.",
      privilegeGroupId: "grp_005",
      isBuiltIn: true,
      memberCount: 4,
      capabilities: [
        "Module catalog management",
        "API and integration settings",
        "Platform health reports",
      ],
    },
  ];
}
