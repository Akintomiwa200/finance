import type { ModuleId } from "@/src/lib/permissions";

const ALWAYS_ALLOWED_PREFIXES = ["/profile", "/notifications", "/access-denied"];

export function pathnameToModuleId(pathname: string): ModuleId | null {
  if (ALWAYS_ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return "dashboard";
  if (segment === "financial-reports") return "financial-reports";
  if (segment === "petty-cash") return "petty-cash";

  const known: ModuleId[] = [
    "dashboard",
    "employees",
    "payroll",
    "ledger",
    "petty-cash",
    "payables",
    "receivables",
    "cash",
    "assets",
    "tax",
    "budget",
    "financial-reports",
    "approvals",
    "departments",
    "reports",
    "settings",
    "expenses",
    "invoices",
    "support",
  ];

  if (known.includes(segment as ModuleId)) {
    return segment as ModuleId;
  }

  return null;
}

export function isPathAllowedByPlan(pathname: string, planModuleIds: ModuleId[]): boolean {
  const moduleId = pathnameToModuleId(pathname);
  if (!moduleId) return true;
  return planModuleIds.includes(moduleId);
}
