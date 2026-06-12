"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Database,
  Globe,
  Key,
  Plug,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { DashCard } from "@/src/components/admin/reports-shared";
import { SettingsCategoryCard } from "@/src/components/settings/settings-category-card";
import { SettingsTabs } from "@/src/components/admin/settings-shared";
import { StatCardsSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { StatCard } from "@/src/components/admin/roles-shared";

interface SettingsOverview {
  platformName: string;
  supportEmail: string;
  require2FA: boolean;
  rateLimiting: boolean;
  smtpConfigured: boolean;
  webhookEnabled: boolean;
  activeIntegrations: number;
  ssoEnabled: boolean;
  gdprEnabled: boolean;
  cachingEnabled: boolean;
  publicApiEnabled: boolean;
}

const SECTIONS = [
  {
    title: "General",
    href: "/admin/settings/general",
    description: "Platform name, branding, theme, regional defaults",
    icon: Globe,
    tags: ["Identity", "Theme", "Currency"],
  },
  {
    title: "Security",
    href: "/admin/settings/security",
    description: "Sessions, passwords, brute-force protection, API security",
    icon: Shield,
    tags: ["2FA", "Sessions", "Rate limits"],
  },
  {
    title: "Notifications",
    href: "/admin/settings/notifications",
    description: "SMTP email, platform alerts, outbound webhooks",
    icon: Bell,
    tags: ["Email", "Alerts", "Webhooks"],
  },
  {
    title: "Integrations",
    href: "/admin/settings/integrations",
    description: "Stripe, SendGrid, Slack, GitHub, and Jira connections",
    icon: Plug,
    tags: ["Billing", "Support", "Dev tools"],
  },
  {
    title: "Tenant User Access",
    href: "/admin/settings/users",
    description: "SSO, invites, signup policy, and API keys for tenant users",
    icon: Users,
    tags: ["SSO", "Invites", "API keys"],
  },
  {
    title: "Data & Privacy",
    href: "/admin/settings/privacy",
    description: "Retention, GDPR/CCPA, encryption, and data export",
    icon: Database,
    tags: ["GDPR", "Retention", "Export"],
  },
  {
    title: "API & Developer",
    href: "/admin/settings/api",
    description: "Public API, rate limits, CORS, and webhook signing",
    icon: Key,
    tags: ["REST API", "CORS", "Signing"],
  },
  {
    title: "Performance",
    href: "/admin/settings/performance",
    description: "Caching, CDN, compression, and upload limits",
    icon: Zap,
    tags: ["Cache", "CDN", "Assets"],
  },
];

export function SettingsHubPageContent() {
  const { data, refetch, isLoading } = useFetch<SettingsOverview>("/api/admin/settings");
  useAdminRealtime(refetch);

  const overview = data;

  return (
    <div className="space-y-5">
      <SettingsTabs activeHref="/admin/settings" />

      <DashCard className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-5 sm:w-[120px]">
          <Settings className="h-10 w-10 text-brand-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Platform settings
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Configure the Uifry platform for your team and tenant companies. Changes here
            affect the super admin console and platform-wide behavior — not individual tenant org settings.
          </p>
          {overview && (
            <p className="mt-3 text-xs text-muted-foreground">
              {overview.platformName} · {overview.supportEmail}
            </p>
          )}
        </div>
      </DashCard>

      {isLoading ? (
        <StatCardsSkeleton count={4} className="grid-cols-2 sm:grid-cols-4" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="2FA required"
            value={overview?.require2FA ? "Yes" : "No"}
            hint="Super admin accounts"
          />
          <StatCard
            label="Integrations"
            value={overview?.activeIntegrations ?? 0}
            hint="Active connections"
          />
          <StatCard
            label="Email"
            value={overview?.smtpConfigured ? "Ready" : "Setup"}
            hint="SMTP configured"
          />
          <StatCard
            label="Public API"
            value={overview?.publicApiEnabled ? "On" : "Off"}
            hint="Developer access"
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <SettingsCategoryCard key={section.href} {...section} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/admin/audit-logs" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Audit logs</p>
              <p className="text-xs text-muted-foreground">Track settings changes</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
        <Link href="/admin/settings/security" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Security review</p>
              <p className="text-xs text-muted-foreground">
                {isLoading ? "Loading…" : overview?.rateLimiting ? "Rate limiting on" : "Review policies"}
              </p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
      </div>
    </div>
  );
}
