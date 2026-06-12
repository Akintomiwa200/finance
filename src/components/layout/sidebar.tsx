"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useMobileSidebar } from "@/src/context/mobile-sidebar-context";
import { useAuthStore } from "@/src/store/auth-store";
import { useOrganization } from "@/src/hooks/use-organization";
import { CompanyLogo } from "@/src/components/ui/company-logo";
import { getEffectiveModules, type ModuleId } from "@/src/lib/permissions";
import { useTenantAccess } from "@/src/hooks/use-tenant-access";
import { SidebarCollapseToggle } from "@/src/components/layout/sidebar-collapse-toggle";
import { SidebarProfileFooter } from "@/src/components/layout/sidebar-profile-footer";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Wallet,
  CheckCircle,
  Building2,
  BarChart3,
  Settings,
  ChevronDown,
  X,
  ListTree,
  History,
  Scale,
  Truck,
  BookCheck,
  ArrowLeftRight,
  Coins,
  NotebookPen,
  ShoppingCart,
  Barcode,
  CalendarRange,
  Trash2,
  Calendar,
  LineChart,
  GitBranch,
  Percent,
  CreditCard,
  FileMinus,
  RefreshCw,
  TrendingUp,
  HandCoins,
  ClipboardList,
  PiggyBank,
  ShieldCheck,
  Bell,
  Key,
  DollarSign,
  FileSpreadsheet,
  Calculator,
  FileCheck,
  Clock,
  CalendarDays,
  Database,
  Mail,
  BellRing,
  Webhook,
  Shield,
  FileSearch,
  Globe,
  Plug,
  Sliders,
  Landmark,
  ReceiptText,
  Package,
  Sigma,
  BookOpen,
  LifeBuoy,
  Radio,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

function hrefToModuleId(href: string): ModuleId {
  const path = href.split("/")[1];
  if (path === "financial-reports") return "financial-reports";
  if (path === "petty-cash") return "petty-cash";
  return path as ModuleId;
}

function filterNavItems(items: NavItem[], visibleModules: ModuleId[]): NavItem[] {
  return items.filter((item) => {
    const moduleId = hrefToModuleId(item.href);
    if (!visibleModules.includes(moduleId)) return false;
    if (item.children) {
      item.children = filterNavItems(item.children, visibleModules);
    }
    return true;
  });
}

const allNavSections: NavSection[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Employees",
        href: "/employees",
        icon: Users,
      },
      {
        label: "Payroll",
        href: "/payroll",
        icon: DollarSign,
        children: [
          {
            label: "Pay Runs",
            href: "/payroll/runs",
            icon: FileSpreadsheet,
          },
          {
            label: "Payslips",
            href: "/payroll/payslips",
            icon: FileText,
          },
          {
            label: "Employee Loans",
            href: "/payroll/loans",
            icon: HandCoins,
          },
        ],
      },
      {
        label: "General Ledger",
        href: "/ledger",
        icon: BookOpen,
        children: [
          {
            label: "Chart of Accounts",
            href: "/ledger/chart-of-accounts",
            icon: ListTree,
          },
          {
            label: "Journal Entries",
            href: "/ledger/journal-entries",
            icon: NotebookPen,
          },
          {
            label: "Trial Balance",
            href: "/ledger/trial-balance",
            icon: Scale,
          },
          {
            label: "General Ledger Report",
            href: "/ledger/report",
            icon: FileText,
          },
        ],
      },
      {
        label: "Petty Cash",
        href: "/petty-cash",
        icon: Coins,
        children: [
          {
            label: "Cash Requests",
            href: "/petty-cash/requests",
            icon: HandCoins,
          },
          {
            label: "Reimbursements",
            href: "/petty-cash/reimbursements",
            icon: ArrowLeftRight,
          },
          {
            label: "Petty Cash Register",
            href: "/petty-cash/register",
            icon: BookCheck,
          },
          {
            label: "Reconciliation",
            href: "/petty-cash/reconcile",
            icon: Calculator,
          },
        ],
      },
      {
        label: "Accounts Payable",
        href: "/payables",
        icon: Package,
        children: [
          {
            label: "Vendors",
            href: "/payables/vendors",
            icon: Truck,
          },
          {
            label: "Purchase Orders",
            href: "/payables/purchase-orders",
            icon: ShoppingCart,
          },
          {
            label: "Vendor Bills",
            href: "/payables/vendor-bills",
            icon: FileText,
          },
          {
            label: "Bill Payments",
            href: "/payables/bill-payments",
            icon: CreditCard,
          },
        ],
      },
      {
        label: "Accounts Receivable",
        href: "/receivables",
        icon: ReceiptText,
        children: [
          {
            label: "Customers",
            href: "/receivables/customers",
            icon: Users,
          },
          {
            label: "Sales Invoices",
            href: "/receivables/sales-invoices",
            icon: FileSpreadsheet,
          },
          {
            label: "Customer Payments",
            href: "/receivables/customer-payments",
            icon: CreditCard,
          },
          {
            label: "Credit Notes",
            href: "/receivables/credit-notes",
            icon: FileMinus,
          },
        ],
      },
      {
        label: "Cash Management",
        href: "/cash",
        icon: PiggyBank,
        children: [
          {
            label: "Bank Accounts",
            href: "/cash/bank-accounts",
            icon: Landmark,
          },
          {
            label: "Bank Reconciliation",
            href: "/cash/bank-reconciliation",
            icon: RefreshCw,
          },
          {
            label: "Cash Flow Statement",
            href: "/cash/cash-flow",
            icon: TrendingUp,
          },
          {
            label: "Deposits & Withdrawals",
            href: "/cash/transactions",
            icon: ArrowLeftRight,
          },
        ],
      },
      {
        label: "Fixed Assets",
        href: "/assets",
        icon: Package,
        children: [
          {
            label: "Asset Register",
            href: "/assets/register",
            icon: ClipboardList,
          },
          {
            label: "Depreciation Schedule",
            href: "/assets/depreciation",
            icon: CalendarRange,
          },
          {
            label: "Asset Disposal",
            href: "/assets/disposal",
            icon: Trash2,
          },
        ],
      },
      {
        label: "Tax Management",
        href: "/tax",
        icon: Sigma,
        children: [
          {
            label: "Tax Returns",
            href: "/tax/returns",
            icon: FileCheck,
          },
          {
            label: "VAT/GST Reports",
            href: "/tax/vat-reports",
            icon: FileSpreadsheet,
          },
          {
            label: "Withholding Tax",
            href: "/tax/withholding",
            icon: Percent,
          },
          {
            label: "Tax Calendar",
            href: "/tax/calendar",
            icon: Calendar,
          },
        ],
      },
      {
        label: "Budget",
        href: "/budget",
        icon: Wallet,
        children: [
          {
            label: "Annual Budget",
            href: "/budget/annual",
            icon: Calendar,
          },
          {
            label: "Budget vs Actual",
            href: "/budget/vs-actual",
            icon: TrendingUp,
          },
          {
            label: "Forecasting",
            href: "/budget/forecast",
            icon: LineChart,
          },
        ],
      },
      {
        label: "Invoices",
        href: "/invoices",
        icon: ReceiptText,
        children: [
          {
            label: "Customer Invoices",
            href: "/invoices/customer",
            icon: FileSpreadsheet,
          },
          {
            label: "Vendor Invoices",
            href: "/invoices/vendor",
            icon: FileText,
          },
        ],
      },
      {
        label: "Expenses",
        href: "/expenses",
        icon: Receipt,
        children: [
          {
            label: "Expense Reports",
            href: "/expenses/reports",
            icon: FileText,
          },
          {
            label: "Reimbursements",
            href: "/expenses/reimbursements",
            icon: ArrowLeftRight,
          },
        ],
      },
      {
        label: "Financial Reports",
        href: "/financial-reports",
        icon: BarChart3,
        children: [
          {
            label: "Profit & Loss",
            href: "/reports/pnl",
            icon: TrendingUp,
          },
          {
            label: "Balance Sheet",
            href: "/reports/balance-sheet",
            icon: Scale,
          },
          {
            label: "Trial Balance",
            href: "/reports/trial-balance",
            icon: FileText,
          },
          {
            label: "Aging Reports",
            href: "/reports/aging",
            icon: Clock,
          },
          {
            label: "Financial Ratios",
            href: "/reports/ratios",
            icon: Percent,
          },
        ],
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Approvals",
        href: "/approvals",
        icon: CheckCircle,
        children: [
          {
            label: "Pending Approvals",
            href: "/approvals/pending",
            icon: Clock,
          },
          {
            label: "Approval Workflows",
            href: "/approvals/workflows",
            icon: GitBranch,
          },
          {
            label: "Approval History",
            href: "/approvals/history",
            icon: History,
          },
        ],
      },
      {
        label: "Departments",
        href: "/departments",
        icon: Building2,
        children: [
          {
            label: "All Departments",
            href: "/departments/list",
            icon: Building2,
          },
          {
            label: "Cost Centers",
            href: "/departments/cost-centers",
            icon: Landmark,
          },
          {
            label: "Department Budgets",
            href: "/departments/budgets",
            icon: Wallet,
          },
        ],
      },
      {
        label: "Reports",
        href: "/reports",
        icon: BarChart3,
        children: [
          {
            label: "Payroll Summary",
            href: "/reports/payroll",
            icon: Calculator,
          },
          {
            label: "Budget vs Actual",
            href: "/reports/budget",
            icon: PiggyBank,
          },
          {
            label: "Expense Analysis",
            href: "/reports/expenses",
            icon: TrendingUp,
          },
          {
            label: "Invoice Aging",
            href: "/reports/invoices",
            icon: Clock,
          },
          {
            label: "Tax Reports",
            href: "/reports/tax",
            icon: FileCheck,
          },
          {
            label: "Audit Trail",
            href: "/reports/audit",
            icon: ShieldCheck,
          },
          {
            label: "Financial Statements",
            href: "/reports/financial",
            icon: FileText,
          },
        ],
      },
    ],
  },
  {
    title: "Help & Support",
    items: [
      {
        label: "Support",
        href: "/support",
        icon: LifeBuoy,
        children: [
          {
            label: "My Tickets",
            href: "/support",
            icon: LifeBuoy,
          },
          {
            label: "Live Fix",
            href: "/support/live",
            icon: Radio,
          },
        ],
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
        children: [
          {
            label: "Organization",
            href: "/settings/organization",
            icon: Building2,
            children: [
              {
                label: "Company Profile",
                href: "/settings/organization/profile",
                icon: Building2,
              },
              {
                label: "Fiscal Year",
                href: "/settings/organization/fiscal-year",
                icon: Calendar,
              },
              {
                label: "Currencies",
                href: "/settings/organization/currencies",
                icon: DollarSign,
              },
            ],
          },
          {
            label: "Accounting",
            href: "/settings/accounting",
            icon: BookOpen,
            children: [
              {
                label: "Chart of Accounts",
                href: "/settings/accounting/chart",
                icon: ListTree,
              },
              {
                label: "Journal Settings",
                href: "/settings/accounting/journals",
                icon: NotebookPen,
              },
              {
                label: "Accounting Periods",
                href: "/settings/accounting/periods",
                icon: CalendarRange,
              },
            ],
          },
          {
            label: "Tax Configuration",
            href: "/settings/tax",
            icon: Sigma,
            children: [
              {
                label: "Tax Rates",
                href: "/settings/tax/rates",
                icon: Percent,
              },
              {
                label: "Tax Authorities",
                href: "/settings/tax/authorities",
                icon: Landmark,
              },
              {
                label: "Tax Codes",
                href: "/settings/tax/codes",
                icon: Barcode,
              },
            ],
          },
          {
            label: "Payroll Settings",
            href: "/settings/payroll",
            icon: DollarSign,
            children: [
              {
                label: "Salary Structures",
                href: "/settings/payroll/structures",
                icon: FileText,
              },
              {
                label: "Payroll Periods",
                href: "/settings/payroll/periods",
                icon: Calendar,
              },
              {
                label: "Statutory Deductions",
                href: "/settings/payroll/deductions",
                icon: HandCoins,
              },
              {
                label: "Leave Policies",
                href: "/settings/payroll/leave",
                icon: CalendarDays,
              },
            ],
          },
          {
            label: "Notifications",
            href: "/settings/notifications",
            icon: Bell,
            children: [
              {
                label: "Email Templates",
                href: "/settings/notifications/email",
                icon: Mail,
              },
              {
                label: "Alert Rules",
                href: "/settings/notifications/alerts",
                icon: BellRing,
              },
              {
                label: "Webhooks",
                href: "/settings/notifications/webhooks",
                icon: Webhook,
              },
            ],
          },
          {
            label: "Roles & Permissions",
            href: "/settings/roles",
            icon: Key,
            children: [
              {
                label: "User Roles",
                href: "/settings/roles/users",
                icon: Users,
              },
              {
                label: "Permission Matrix",
                href: "/settings/roles/permissions",
                icon: Shield,
              },
              {
                label: "Audit Logs",
                href: "/settings/roles/audit",
                icon: FileSearch,
              },
            ],
          },
          {
            label: "Integrations",
            href: "/settings/integrations",
            icon: Plug,
            children: [
              {
                label: "Bank Feeds",
                href: "/settings/integrations/bank",
                icon: Landmark,
              },
              {
                label: "API Tokens",
                href: "/settings/integrations/api",
                icon: Key,
              },
              {
                label: "Webhooks",
                href: "/settings/integrations/webhooks",
                icon: Webhook,
              },
            ],
          },
          {
            label: "System Preferences",
            href: "/settings/preferences",
            icon: Settings,
            children: [
              {
                label: "General Preferences",
                href: "/settings/preferences/general",
                icon: Sliders,
              },
              {
                label: "Regional Settings",
                href: "/settings/preferences/regional",
                icon: Globe,
              },
              {
                label: "Security",
                href: "/settings/preferences/security",
                icon: ShieldCheck,
              },
              {
                label: "Backup & Restore",
                href: "/settings/preferences/backup",
                icon: Database,
              },
            ],
          },
        ],
      },
    ],
  },
];
// ─── Chevron ─────────────────────────────────────────────────────────────────

function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      className={`shrink-0 w-3.5 h-3.5 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    />
  );
}

// ─── Shared nav content (used in both sidebar and drawer) ────────────────────

function NavContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const { planModuleIds } = useTenantAccess();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const userRole = user?.role || "EMPLOYEE";
  const visibleModules = getEffectiveModules(userRole, planModuleIds);

  const navSections = allNavSections
    .map((section) => ({
      ...section,
      items: filterNavItems(section.items, visibleModules),
    }))
    .filter((section) => section.items.length > 0);

  const isParentActive = (item: NavItem): boolean => {
    if (pathname === item.href) return true;
    if (item.children) return item.children.some((child) => isParentActive(child));
    return false;
  };

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  const isOpen = (item: NavItem) =>
    expanded[item.label] !== undefined
      ? expanded[item.label]
      : isParentActive(item);

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 custom-scrollbar">
      {navSections.map((section) => (
        <div key={section.title}>
          {/* Section title */}
          <div
            className={`sidebar-nav-section px-4 pt-4 pb-1.5 text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 ${
              collapsed ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100"
            }`}
          >
            <span className="text-muted">{section.title}</span>
          </div>

          {section.items.map((item) => {
            const hasChildren = !!item.children?.length;
            const parentActive = isParentActive(item);
            const open = isOpen(item);
            const Icon = item.icon;

            return (
              <div key={item.label}>
                {/* Parent row */}
                <div
                  className={`sidebar-nav-item group relative flex items-center gap-3 mx-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150
                    ${
                      parentActive && !hasChildren
                        ? "bg-accent-50 text-accent-700 font-medium"
                        : "text-secondary hover:bg-surface-2 hover:text-primary"
                    }`}
                >
                  {/* Tooltip for collapsed state */}
                  {collapsed && (
                    <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow-lg">
                      {item.label}
                    </span>
                  )}

                  <Icon className="shrink-0 w-4.5 h-4.5" strokeWidth={1.75} />

                  {!hasChildren ? (
                    <Link
                      href={item.href}
                      className="flex flex-1 items-center min-w-0 no-underline text-inherit"
                      onClick={onNavigate}
                    >
                      <span
                        className={`flex-1 text-sm leading-none truncate transition-all duration-200 ${
                          collapsed
                            ? "opacity-0 w-0 overflow-hidden"
                            : "opacity-100 w-auto"
                        }`}
                      >
                        {item.label}
                      </span>
                    </Link>
                  ) : (
                    <div
                      className="flex flex-1 items-center min-w-0 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(item.label);
                      }}
                    >
                      <span
                        className={`flex-1 text-sm leading-none truncate transition-all duration-200 ${
                          collapsed
                            ? "opacity-0 w-0 overflow-hidden"
                            : "opacity-100 w-auto"
                        }`}
                      >
                        {item.label}
                      </span>
                      {!collapsed && (
                        <div className="text-muted">
                          <Chevron open={open} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Children */}
                {hasChildren && !collapsed && (
                  <div
                    className={`ml-9 mt-1 space-y-0.5 overflow-hidden transition-all duration-200 ${
                      open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.children!.map((child) => {
                      const childActive = isParentActive(child);
                      const ChildIcon = child.icon;
                      return (
                        <div key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onNavigate}
                            className={`sidebar-nav-child flex items-center gap-3 mx-2 pl-3 pr-3 py-1.5 rounded-lg text-sm no-underline transition-all duration-150
                              ${
                                childActive
                                  ? "text-accent-700 font-medium bg-accent-50"
                                  : "text-muted hover:bg-surface-2 hover:text-secondary"
                              }`}
                          >
                            <ChildIcon
                              className="shrink-0 w-3.5 h-3.5"
                              strokeWidth={1.75}
                            />
                            {child.label}
                          </Link>
                          {child.children?.map((grandchild) => {
                            const GrandchildIcon = grandchild.icon;
                            const grandchildActive = pathname === grandchild.href;

                            return (
                              <Link
                                key={grandchild.href}
                                href={grandchild.href}
                                onClick={onNavigate}
                                className={`ml-7 flex items-center gap-2 mx-2 pl-3 pr-3 py-1.5 rounded-lg text-xs no-underline transition-all duration-150
                                  ${
                                    grandchildActive
                                      ? "text-accent-700 font-medium bg-accent-50"
                                      : "text-muted hover:bg-surface-2 hover:text-secondary"
                                  }`}
                              >
                                <GrandchildIcon
                                  className="shrink-0 w-3 h-3"
                                  strokeWidth={1.75}
                                />
                                {grandchild.label}
                              </Link>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

// ─── Footer user block ───────────────────────────────────────────────────────

function SidebarFooter({
  collapsed,
  compact,
}: {
  collapsed: boolean;
  compact?: boolean;
}) {
  return (
    <SidebarProfileFooter
      collapsed={collapsed}
      compact={compact}
      profileHref="/profile"
    />
  );
}

// ─── Logo/Collapse header ──────────────────────────────────────────────────────

function SidebarHeader({
  collapsed,
  onToggle,
  orgName,
  orgLogo,
}: {
  collapsed: boolean;
  onToggle: () => void;
  orgName?: string;
  orgLogo?: string | null;
}) {
  return (
    <div
      className={`flex items-center border-b border-light min-h-[60px] ${
        collapsed ? "justify-center px-2 py-4" : "justify-between px-3 py-4"
      }`}
    >
      {!collapsed && (
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2.5 no-underline">
          {orgName ? (
            <>
              <CompanyLogo name={orgName} logo={orgLogo} size={28} />
              <span className="truncate text-sm font-semibold text-primary">
                {orgName}
              </span>
            </>
          ) : (
            <Image src="/logo.svg" alt="Finance App" width={28} height={28} className="shrink-0" />
          )}
        </Link>
      )}

      {collapsed && orgName && (
        <CompanyLogo name={orgName} logo={orgLogo} size={28} />
      )}

      <SidebarCollapseToggle collapsed={collapsed} onToggle={onToggle} />
    </div>
  );
}

// ─── Desktop Sidebar ─────────────────────────────────────────────────────────

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const { data: organization } = useOrganization();
  const [collapsed, setCollapsed] = useState(false);
  const { isOpen: mobileOpen, close: closeMobile } = useMobileSidebar();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 bg-card border-r border-light transition-all duration-300 ease-in-out overflow-hidden ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
          orgName={organization?.name}
          orgLogo={organization?.logo}
        />
        <NavContent collapsed={collapsed} />
        <SidebarFooter collapsed={collapsed} />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* ── Mobile drawer (off-canvas, not desktop sidebar) ── */}
      <aside
        className={`md:hidden fixed left-0 top-0 z-50 flex h-dvh w-[min(288px,88vw)] min-h-0 flex-col bg-card shadow-xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-light px-4 py-4 min-h-[60px]">
          <Link href="/dashboard" className="shrink-0 no-underline" onClick={closeMobile}>
            {organization?.name ? (
              <CompanyLogo
                name={organization.name}
                logo={organization.logo}
                size={28}
              />
            ) : (
              <Image src="/logo.svg" alt="Finance App" width={28} height={28} className="shrink-0" />
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-primary leading-tight truncate">
              {organization?.name || user?.name || "Finance App"}
            </p>
            <p className="text-xs text-muted leading-tight truncate capitalize">
              {user?.role?.replace(/_/g, " ") || ""}
            </p>
          </div>
          <button
            type="button"
            onClick={closeMobile}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-light text-muted transition-all hover:bg-surface-2 hover:text-primary"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <NavContent collapsed={false} onNavigate={closeMobile} />
        <SidebarFooter collapsed={false} compact />
      </aside>
    </>
  );
}
