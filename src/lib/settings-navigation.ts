import type { LucideIcon } from "lucide-react";
import {
  Settings2,
  User,
  Palette,
  Building2,
  Calculator,
  Receipt,
  Wallet,
  Bell,
  Shield,
  Plug,
  SlidersHorizontal,
  BookOpen,
  Calendar,
  Coins,
  FileText,
  Landmark,
  Percent,
  Code,
  Mail,
  AlertTriangle,
  Webhook,
  Key,
  Users,
  Lock,
  ClipboardList,
} from "lucide-react";

export interface SettingsNavLink {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface SettingsNavGroup {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  links: SettingsNavLink[];
}

export const SETTINGS_ROOT_LINKS: SettingsNavLink[] = [
  {
    title: "General",
    description: "Theme, behavior, session timeout, and app defaults",
    href: "/settings/general",
    icon: Settings2,
  },
  {
    title: "Profile",
    description: "Your personal account information",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Appearance",
    description: "Theme, colors, fonts — synced to your account",
    href: "/settings/appearance",
    icon: Palette,
  },
  {
    title: "System Preferences",
    description: "Regional, security, and backup preferences",
    href: "/settings/preferences",
    icon: SlidersHorizontal,
  },
];

export const SETTINGS_GROUPS: SettingsNavGroup[] = [
  {
    id: "organization",
    title: "Organization",
    description: "Company profile, branding, currencies, and fiscal year",
    href: "/settings/organization",
    icon: Building2,
    links: [
      {
        title: "Organization Overview",
        description: "General info, branding, localization, fiscal year, security",
        href: "/settings/organization",
        icon: Building2,
      },
      {
        title: "Company Profile",
        description: "Legal details, contact, bank, and social links",
        href: "/settings/organization/profile",
        icon: FileText,
      },
      {
        title: "Currencies",
        description: "Base currency and multi-currency setup",
        href: "/settings/organization/currencies",
        icon: Coins,
      },
      {
        title: "Fiscal Year",
        description: "Fiscal calendar, timezone, and locale",
        href: "/settings/organization/fiscal-year",
        icon: Calendar,
      },
    ],
  },
  {
    id: "accounting",
    title: "Accounting",
    description: "Ledger, journals, chart of accounts, and periods",
    href: "/settings/accounting",
    icon: Calculator,
    links: [
      {
        title: "Chart of Accounts",
        description: "Account types and structure defaults",
        href: "/settings/accounting/chart",
        icon: BookOpen,
      },
      {
        title: "Journal Settings",
        description: "Live journal entries overview",
        href: "/settings/accounting/journals",
        icon: FileText,
      },
      {
        title: "Accounting Periods",
        description: "Period close and fiscal period rules",
        href: "/settings/accounting/periods",
        icon: Calendar,
      },
    ],
  },
  {
    id: "tax",
    title: "Tax Configuration",
    description: "VAT, withholding, authorities, rates, and codes",
    href: "/settings/tax",
    icon: Receipt,
    links: [
      {
        title: "Tax Authorities",
        description: "Registered tax offices and filing entities",
        href: "/settings/tax/authorities",
        icon: Landmark,
      },
      {
        title: "Tax Rates",
        description: "VAT and withholding rate defaults",
        href: "/settings/tax/rates",
        icon: Percent,
      },
      {
        title: "Tax Codes",
        description: "Product and transaction tax codes",
        href: "/settings/tax/codes",
        icon: Code,
      },
    ],
  },
  {
    id: "payroll",
    title: "Payroll",
    description: "Pay periods, structures, deductions, and leave",
    href: "/settings/payroll",
    icon: Wallet,
    links: [
      {
        title: "Pay Periods",
        description: "Payroll frequency and cycle settings",
        href: "/settings/payroll/periods",
        icon: Calendar,
      },
      {
        title: "Salary Structures",
        description: "Earnings and compensation templates",
        href: "/settings/payroll/structures",
        icon: FileText,
      },
      {
        title: "Deductions",
        description: "Statutory and custom deduction rules",
        href: "/settings/payroll/deductions",
        icon: Receipt,
      },
      {
        title: "Leave Policies",
        description: "Leave accrual and payroll leave settings",
        href: "/settings/payroll/leave",
        icon: Calendar,
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Email alerts, in-app notifications, and delivery",
    href: "/settings/notifications",
    icon: Bell,
    links: [
      {
        title: "Email Notifications",
        description: "SMTP and email alert preferences",
        href: "/settings/notifications/email",
        icon: Mail,
      },
      {
        title: "Alert Preferences",
        description: "Payroll, expense, and approval alerts",
        href: "/settings/notifications/alerts",
        icon: AlertTriangle,
      },
      {
        title: "Notification Webhooks",
        description: "Outbound webhook delivery for events",
        href: "/settings/integrations/webhooks",
        icon: Webhook,
      },
    ],
  },
  {
    id: "roles",
    title: "Roles & Permissions",
    description: "Users, access control, and audit activity",
    href: "/settings/roles",
    icon: Shield,
    links: [
      {
        title: "Users & Roles",
        description: "Team members and assigned roles",
        href: "/settings/roles/users",
        icon: Users,
      },
      {
        title: "Permissions Matrix",
        description: "Module access by role",
        href: "/settings/roles/permissions",
        icon: Lock,
      },
      {
        title: "Audit Log",
        description: "Recent user and access activity",
        href: "/settings/roles/audit",
        icon: ClipboardList,
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    description: "Bank feeds, API keys, and webhooks",
    href: "/settings/integrations",
    icon: Plug,
    links: [
      {
        title: "Bank Integrations",
        description: "Connect bank feeds and providers",
        href: "/settings/integrations/bank",
        icon: Landmark,
      },
      {
        title: "API Access",
        description: "API keys and rate limits",
        href: "/settings/integrations/api",
        icon: Key,
      },
      {
        title: "Webhooks",
        description: "Outbound webhook endpoints",
        href: "/settings/integrations/webhooks",
        icon: Webhook,
      },
    ],
  },
];

export function findSettingsGroup(pathname: string) {
  return SETTINGS_GROUPS.find(
    (group) => pathname === group.href || pathname.startsWith(`${group.href}/`),
  );
}
