import type { ModuleId } from "@/src/lib/permissions";

export interface TenantModuleOption {
  id: ModuleId;
  label: string;
}

export interface TenantModuleSection {
  title: string;
  modules: TenantModuleOption[];
}

/** Sidebar sections mirrored for plan module picker */
export const TENANT_MODULE_SECTIONS: TenantModuleSection[] = [
  {
    title: "Main",
    modules: [{ id: "dashboard", label: "Dashboard" }],
  },
  {
    title: "Finance",
    modules: [
      { id: "employees", label: "Employees" },
      { id: "payroll", label: "Payroll" },
      { id: "ledger", label: "General Ledger" },
      { id: "petty-cash", label: "Petty Cash" },
      { id: "payables", label: "Accounts Payable" },
      { id: "receivables", label: "Accounts Receivable" },
      { id: "cash", label: "Cash Management" },
      { id: "assets", label: "Fixed Assets" },
      { id: "tax", label: "Tax Management" },
      { id: "budget", label: "Budget" },
      { id: "invoices", label: "Invoices" },
      { id: "expenses", label: "Expenses" },
      { id: "financial-reports", label: "Financial Reports" },
    ],
  },
  {
    title: "Management",
    modules: [
      { id: "approvals", label: "Approvals" },
      { id: "departments", label: "Departments" },
      { id: "reports", label: "Reports" },
    ],
  },
  {
    title: "Help & Support",
    modules: [{ id: "support", label: "Support" }],
  },
  {
    title: "System",
    modules: [{ id: "settings", label: "Settings" }],
  },
];

export const ALL_TENANT_MODULE_IDS: ModuleId[] = TENANT_MODULE_SECTIONS.flatMap(
  (section) => section.modules.map((m) => m.id),
);

export const STARTER_PLAN_MODULES: ModuleId[] = [
  "dashboard",
  "ledger",
  "payables",
  "receivables",
  "expenses",
];

export const PROFESSIONAL_PLAN_MODULES: ModuleId[] = [
  "dashboard",
  "employees",
  "payroll",
  "ledger",
  "payables",
  "receivables",
  "cash",
  "tax",
  "budget",
  "reports",
  "departments",
  "expenses",
];

export function moduleLabel(id: ModuleId): string {
  for (const section of TENANT_MODULE_SECTIONS) {
    const match = section.modules.find((m) => m.id === id);
    if (match) return match.label;
  }
  return id;
}
