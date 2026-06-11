const DASHBOARD_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/transactions": "Transactions",
  "/profile": "Profile",
  "/settings": "Settings",
  "/support": "Support",
  "/notifications": "Notifications",
  "/reports": "Reports",
  "/tax": "Tax",
  "/budget": "Budget",
  "/payroll": "Payroll",
};

const ADMIN_TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/profile": "Profile",
  "/admin/support": "Support",
  "/admin/notifications": "Notifications",
  "/admin/companies": "Companies",
  "/admin/employees": "Team",
  "/admin/users": "Users",
  "/admin/modules": "Modules",
  "/admin/billing/plans": "Tenant Plans",
  "/admin/billing/subscriptions": "Tenant Subscriptions",
  "/admin/billing/invoices": "Tenant Invoices",
  "/admin/billing/payment-methods": "Payment Methods",
  "/admin/settings/general": "General Settings",
  "/admin/settings/security": "Security",
  "/admin/settings/notifications": "Notifications",
  "/admin/settings/integrations": "Integrations",
  "/admin/settings/users": "User Management",
  "/admin/settings/privacy": "Data & Privacy",
  "/admin/settings/api": "API & Developer",
  "/admin/settings/performance": "Performance",
};

function titleFromSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function getNavbarTitle(pathname: string, scope: "dashboard" | "admin" = "dashboard") {
  const map = scope === "admin" ? ADMIN_TITLES : DASHBOARD_TITLES;
  if (map[pathname]) return map[pathname];

  const parts = pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1];
  if (!last) return scope === "admin" ? "Dashboard" : "Dashboard";

  if (/^[a-f0-9-]{8,}$/i.test(last) || /^\d+$/.test(last)) {
    const parent = parts[parts.length - 2];
    return parent ? titleFromSegment(parent) : "Dashboard";
  }

  return titleFromSegment(last);
}
