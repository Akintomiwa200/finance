"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useMobileSidebar } from "@/src/context/mobile-sidebar-context";
import { cn } from "@/src/lib/utils";

import { SidebarCollapseToggle } from "@/src/components/layout/sidebar-collapse-toggle";
import { SidebarProfileFooter } from "@/src/components/layout/sidebar-profile-footer";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  Settings,
  CreditCard,
  FileSearch,
  Shield,
  BarChart3,
  LifeBuoy,
  Blocks,
  X,
  ChevronDown,
  Plus,
  FileText,
  Receipt,
  Monitor,
  Key,
  Bell,
  Plug,
  Layers,
  UserCheck,
  Radio,
  Wallet,
  HeartPulse,
  ShieldCheck,
  Ticket,
  DollarSign,
  TrendingUp,
  Globe,
  Database,
  Activity,
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

const navSections: NavSection[] = [
  {
    title: "Platform",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      {
        label: "Companies",
        href: "/admin/companies",
        icon: Building2,
        children: [
          { label: "All Companies", href: "/admin/companies", icon: Building2 },
          { label: "Add Company", href: "/admin/companies/new", icon: Plus },
        ],
      },
      { label: "Departments", href: "/admin/departments", icon: Briefcase },
      { label: "Team", href: "/admin/employees", icon: Users },
    ],
  },
  {
    title: "Operations",
    items: [
      {
        label: "Billing",
        href: "/admin/billing/plans",
        icon: CreditCard,
        children: [
          { label: "Plans", href: "/admin/billing/plans", icon: Layers },
          { label: "Subscriptions", href: "/admin/billing/subscriptions", icon: Receipt },
          { label: "Invoices", href: "/admin/billing/invoices", icon: FileText },
          { label: "Payment Methods", href: "/admin/billing/payment-methods", icon: Wallet },
        ],
      },
      {
        label: "Reports",
        href: "/admin/reports/revenue",
        icon: BarChart3,
        children: [
          { label: "Revenue", href: "/admin/reports/revenue", icon: DollarSign },
          { label: "Growth", href: "/admin/reports/growth", icon: TrendingUp },
          { label: "Usage", href: "/admin/reports/usage", icon: Monitor },
          { label: "Platform Health", href: "/admin/reports/platform-health", icon: HeartPulse },
        ],
      },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: FileSearch },
      {
        label: "Team Roles",
        href: "/admin/roles/groups",
        icon: Shield,
        children: [
          { label: "Privilege Groups", href: "/admin/roles/groups", icon: Layers },
          { label: "Permissions", href: "/admin/roles/permissions", icon: Key },
          { label: "Assignments", href: "/admin/roles/assignments", icon: UserCheck },
          { label: "System Roles", href: "/admin/roles/system", icon: ShieldCheck },
        ],
      },
    ],
  },
  {
    title: "Customer Success",
    items: [
      {
        label: "Support",
        href: "/admin/support",
        icon: LifeBuoy,
        children: [
          { label: "Ticket Inbox", href: "/admin/support", icon: Ticket },
          { label: "Live Fix Queue", href: "/admin/support/live-fix", icon: Radio },
          { label: "GitHub & Jira", href: "/admin/support/integrations", icon: Plug },
        ],
      },
    ],
  },
  {
    title: "Setup",
    items: [
      { label: "Modules", href: "/admin/modules", icon: Blocks },
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        children: [
          { label: "Overview", href: "/admin/settings", icon: Settings },
          { label: "General", href: "/admin/settings/general", icon: Globe },
          { label: "Security", href: "/admin/settings/security", icon: Shield },
          { label: "Notifications", href: "/admin/settings/notifications", icon: Bell },
          { label: "Integrations", href: "/admin/settings/integrations", icon: Plug },
          { label: "Tenant User Access", href: "/admin/settings/users", icon: Users },
          { label: "Data & Privacy", href: "/admin/settings/privacy", icon: Database },
          { label: "API & Developer", href: "/admin/settings/api", icon: Key },
          { label: "Performance", href: "/admin/settings/performance", icon: Activity },
        ],
      },
    ],
  },
];

function Chevron({ open }: { open: boolean }) {
  return (
    <ChevronDown
      className={cn(
        "w-4 h-4 admin-nav-chevron transition-transform duration-200 shrink-0",
        open && "rotate-180",
      )}
    />
  );
}

function SidebarHeader({
  collapsed,
  onToggle,
  onClose,
}: {
  collapsed: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center border-b min-h-[60px] border-[var(--admin-nav-border)]",
        collapsed ? "justify-center px-2 py-4" : "justify-between px-3 py-4",
      )}
    >
      {!collapsed && (
        <Link href="/admin/dashboard" className="shrink-0 no-underline">
          <Image src="/logo.svg" alt="Logo" width={28} height={28} className="shrink-0" />
        </Link>
      )}

      {onToggle && (
        <SidebarCollapseToggle
          collapsed={collapsed}
          onToggle={onToggle}
          variant="admin"
        />
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-md transition-all text-[var(--admin-nav-item-muted)] hover:text-[var(--admin-nav-item)] hover:bg-[var(--admin-nav-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          aria-label="Close navigation"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

function NavContent({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href + "/"));

  const isChildActive = (href: string, siblings: NavItem[]) => {
    if (pathname === href) return true;
    if (!pathname.startsWith(href + "/")) return false;
    const bestMatch = siblings
      .filter((sibling) => pathname === sibling.href || pathname.startsWith(sibling.href + "/"))
      .sort((a, b) => b.href.length - a.href.length)[0];
    return bestMatch?.href === href;
  };

  const toggle = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  useEffect(() => {
    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children?.some((c) => isChildActive(c.href, item.children!))) {
          setOpenSections((prev) => ({ ...prev, [item.label]: true }));
        }
      });
    });
  }, [pathname]);

  return (
    <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 custom-scrollbar">
      {navSections.map((section) => (
        <div key={section.title} className="mb-2">
          <div
            className={cn(
              "admin-nav-section px-4 pt-4 pb-2 whitespace-nowrap",
              collapsed ? "opacity-0 h-0 py-0 overflow-hidden" : "opacity-100",
            )}
          >
            {section.title}
          </div>

          <div className="px-2 space-y-0.5">
            {section.items.map((item) => {
              const hasChildren = !!item.children?.length;
              const active = isActive(item.href);
              const open = openSections[item.label] ?? false;
              const Icon = item.icon;

              return (
                <div key={item.label}>
                  {!hasChildren ? (
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "admin-nav-item group relative flex items-center gap-3 px-3 py-2.5 text-sm no-underline",
                        active && "is-active",
                      )}
                    >
                      {collapsed && (
                        <span className="pointer-events-none absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-md bg-[var(--admin-nav-bg)] border border-[var(--admin-nav-border)] px-2.5 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-lg text-[var(--admin-nav-item)]">
                          {item.label}
                        </span>
                      )}
                      <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                      <span className={cn("flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => toggle(item.label)}
                        className="admin-nav-item w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left"
                      >
                        <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
                        <span className={cn("flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>
                        {!collapsed && <Chevron open={open} />}
                      </button>

                      {!collapsed && (
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200",
                            open ? "max-h-96 opacity-100 mt-0.5" : "max-h-0 opacity-0",
                          )}
                        >
                          <div className="pl-4 pr-1 space-y-0.5">
                            {item.children!.map((child) => {
                              const ChildIcon = child.icon;
                              const childActive = isChildActive(child.href, item.children!);
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onNavigate}
                                  className={cn(
                                    "admin-nav-child flex items-center gap-2.5 px-3 py-2 text-[13px] no-underline",
                                    childActive && "is-active",
                                  )}
                                >
                                  <ChildIcon className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

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
      variant="admin"
      profileHref="/admin/profile"
    />
  );
}

function MobileDrawerHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex shrink-0 items-center gap-3 border-b border-[var(--admin-nav-border)] px-4 py-4 min-h-[60px]">
      <Link href="/admin/dashboard" className="shrink-0 no-underline" onClick={onClose}>
        <Image src="/logo.svg" alt="Logo" width={28} height={28} className="shrink-0" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--admin-nav-item)] leading-tight">
          Platform Console
        </p>
        <p className="truncate text-xs text-[var(--admin-nav-item-muted)] leading-tight">
          Super Admin
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--admin-nav-border)] text-[var(--admin-nav-item-muted)] transition-all hover:bg-[var(--admin-nav-hover)] hover:text-[var(--admin-nav-item)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        aria-label="Close navigation"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function SuperAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isOpen: mobileOpen, close: closeMobile } = useMobileSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  const desktopAsideClass = cn(
    "admin-sidebar hidden md:flex flex-col h-screen shrink-0 sticky top-0 border-r transition-all duration-300 overflow-hidden",
    collapsed ? "w-[68px]" : "w-[248px]",
  );

  const mobileDrawer =
    mounted &&
    createPortal(
      <>
        <div
          className={cn(
            "fixed inset-0 z-[100] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 md:hidden",
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={closeMobile}
          aria-hidden="true"
        />
        <aside
          className={cn(
            "admin-sidebar fixed inset-y-0 left-0 z-[110] flex h-dvh w-[min(288px,88vw)] min-h-0 flex-col border-r shadow-2xl transition-transform duration-300 ease-in-out md:hidden",
            mobileOpen ? "translate-x-0" : "pointer-events-none -translate-x-full",
          )}
          aria-hidden={!mobileOpen}
          role="dialog"
          aria-modal={mobileOpen}
          aria-label="Admin navigation menu"
        >
          <MobileDrawerHeader onClose={closeMobile} />
          <NavContent collapsed={false} onNavigate={closeMobile} />
          <SidebarFooter collapsed={false} compact />
        </aside>
      </>,
      document.body,
    );

  return (
    <>
      <aside className={desktopAsideClass}>
        <SidebarHeader collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <NavContent collapsed={collapsed} />
        <SidebarFooter collapsed={collapsed} />
      </aside>
      {mobileDrawer}
    </>
  );
}
