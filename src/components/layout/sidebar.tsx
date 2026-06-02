"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  Menu,
  X,
  TrendingUp,
  HandCoins,
  PiggyBank,
  ShieldCheck,
  Bell,
  Key,
  DollarSign,
  FileSpreadsheet,
  Calculator,
  FileCheck,
  Clock,
  Landmark,
  ReceiptText,
  Package,
  Sigma,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navSections: { title: string; items: NavItem[] }[] = [
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
        label: "Expenses",
        href: "/expenses",
        icon: Receipt,
        children: [
          {
            label: "Expense Reports",
            href: "/expenses/reports",
            icon: FileSpreadsheet,
          },
          {
            label: "Reimbursements",
            href: "/expenses/reimbursements",
            icon: TrendingUp,
          },
        ],
      },
      {
        label: "Invoices",
        href: "/invoices",
        icon: FileText,
        children: [
          {
            label: "Sales Invoices",
            href: "/invoices/customer",
            icon: ReceiptText,
          },
          {
            label: "Purchase Invoices",
            href: "/invoices/vendor",
            icon: Package,
          },
        ],
      },
      {
        label: "Budget",
        href: "/budget",
        icon: Wallet,
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
          },
          {
            label: "Tax Configuration",
            href: "/settings/tax",
            icon: Sigma,
          },
          {
            label: "Notifications",
            href: "/settings/notifications",
            icon: Bell,
          },
          {
            label: "Roles & Permissions",
            href: "/settings/roles",
            icon: Key,
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
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const isParentActive = (item: NavItem): boolean => {
    if (pathname === item.href) return true;
    if (item.children)
      return item.children.some(
        (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
      );
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
            className={`px-4 pt-4 pb-1.5 text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 ${
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
                  className={`group relative flex items-center gap-3 mx-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150
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
                      const childActive = pathname === child.href;
                      const ChildIcon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onNavigate}
                          className={`flex items-center gap-3 mx-2 pl-3 pr-3 py-1.5 rounded-lg text-sm no-underline transition-all duration-150
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

function SidebarFooter({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="border-t border-light p-3 flex items-center gap-3 overflow-hidden">
      <div className="w-8 h-8 shrink-0 rounded-full bg-accent-100 flex items-center justify-center text-xs font-semibold text-accent-700">
        AD
      </div>
      <div
        className={`flex-1 min-w-0 transition-all duration-200 ${
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
        }`}
      >
        <p className="text-sm font-medium text-primary truncate leading-tight">
          Admin User
        </p>
        <p className="text-xs text-muted truncate leading-tight mt-0.5">
          admin@finance.com
        </p>
      </div>
    </div>
  );
}

// ─── Logo/Collapse header ──────────────────────────────────────────────────────

function SidebarHeader({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-4 border-b border-light min-h-[60px]">
      {/* Logo - only visible when NOT collapsed */}
      {!collapsed && (
        <Link href="/dashboard" className="shrink-0 no-underline">
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            F
          </div>
        </Link>
      )}

      {/* Spacer to keep button on the right when collapsed */}
      {collapsed && <div className="w-full" />}

      {/* Collapse/Expand button - always visible */}
      <button
        onClick={onToggle}
        className={`shrink-0 w-7 h-7 rounded-lg border border-light flex items-center justify-center text-muted hover:bg-surface-2 hover:text-primary transition-all ${
          !collapsed ? "ml-auto" : "mx-auto"
        }`}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {collapsed ? (
            <path d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          ) : (
            <path d="M11 5l-7 7 7 7M19 5l-7 7 7 7" />
          )}
        </svg>
      </button>
    </div>
  );
}

// ─── Desktop Sidebar ─────────────────────────────────────────────────────────

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close drawer on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Hamburger button (mobile only) ── */}
      <button
        className="md:hidden fixed top-4 left-4 z-[60] w-9 h-9 flex items-center justify-center rounded-lg border border-light bg-card text-secondary shadow-sm hover:bg-surface-2 transition-all"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 bg-card border-r border-light transition-all duration-300 ease-in-out overflow-hidden ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed((v) => !v)}
        />
        <NavContent collapsed={collapsed} />
        <SidebarFooter collapsed={collapsed} />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-overlay transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile drawer ── */}
      <aside
        className={`md:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-card flex flex-col shadow-xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header with close button */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-light min-h-[60px]">
          <Link href="/dashboard" className="shrink-0 no-underline">
            <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center text-white font-bold text-sm">
              F
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary leading-tight">
              FinServ
            </p>
            <p className="text-xs text-muted leading-tight">
              Finance as a Service
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="shrink-0 w-7 h-7 rounded-lg border border-light flex items-center justify-center text-muted hover:bg-surface-2 hover:text-primary transition-all"
            aria-label="Close navigation"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <NavContent collapsed={false} onNavigate={() => setMobileOpen(false)} />
        <SidebarFooter collapsed={false} />
      </aside>
    </>
  );
}
