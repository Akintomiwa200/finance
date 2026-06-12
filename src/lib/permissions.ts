export type Role =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "FINANCE_MANAGER"
  | "ACCOUNTANT_PAYABLE"
  | "ACCOUNTANT_RECEIVABLE"
  | "PAYROLL_OFFICER"
  | "BUDGET_ANALYST"
  | "DEPARTMENT_HEAD"
  | "AUDITOR"
  | "TAX_SPECIALIST"
  | "EMPLOYEE";

export type ModuleId =
  | "dashboard"
  | "employees"
  | "payroll"
  | "ledger"
  | "petty-cash"
  | "payables"
  | "receivables"
  | "cash"
  | "assets"
  | "tax"
  | "budget"
  | "financial-reports"
  | "approvals"
  | "departments"
  | "reports"
  | "settings"
  | "expenses"
  | "invoices"
  | "support";

const roleModuleAccess: Record<Role, ModuleId[]> = {
  SUPER_ADMIN: [
    "dashboard", "employees", "payroll", "ledger", "petty-cash",
    "payables", "receivables", "cash", "assets", "tax", "budget",
    "financial-reports", "approvals", "departments", "reports", "settings", "expenses", "invoices", "support",
  ],
  ADMIN: [
    "dashboard", "employees", "payroll", "ledger", "petty-cash",
    "payables", "receivables", "cash", "assets", "tax", "budget",
    "financial-reports", "approvals", "departments", "reports", "settings", "expenses", "invoices", "support",
  ],
  FINANCE_MANAGER: [
    "dashboard", "payroll", "ledger", "petty-cash", "payables", "receivables",
    "cash", "assets", "tax", "budget", "financial-reports",
    "approvals", "reports", "settings", "expenses", "support",
  ],
  ACCOUNTANT_PAYABLE: [
    "dashboard", "payables", "ledger", "tax", "reports",
  ],
  ACCOUNTANT_RECEIVABLE: [
    "dashboard", "receivables", "cash", "ledger", "tax", "reports",
  ],
  PAYROLL_OFFICER: [
    "dashboard", "employees", "payroll", "reports",
  ],
  BUDGET_ANALYST: [
    "dashboard", "budget", "departments", "reports", "financial-reports",
  ],
  DEPARTMENT_HEAD: [
    "dashboard", "employees", "departments", "budget", "approvals", "expenses", "reports", "support",
  ],
  AUDITOR: [
    "dashboard", "ledger", "reports", "financial-reports", "tax",
  ],
  TAX_SPECIALIST: [
    "dashboard", "tax", "reports", "ledger",
  ],
  EMPLOYEE: [
    "dashboard", "expenses", "support",
  ],
};

export function getVisibleModules(role: Role | string): ModuleId[] {
  return roleModuleAccess[role as Role] ?? ["dashboard"];
}

export function canAccessModule(role: Role | string, moduleId: ModuleId): boolean {
  return getVisibleModules(role).includes(moduleId);
}

export function getEffectiveModules(
  role: Role | string,
  planModuleIds: ModuleId[],
): ModuleId[] {
  const roleModules = getVisibleModules(role);
  if (!planModuleIds.length) return roleModules;
  return roleModules.filter((id) => planModuleIds.includes(id));
}
