"use client";

import {
  SettingsCategoryGroup,
  type SettingsCategoryItem,
} from "@/src/components/settings/settings-category-card";
import { Settings, Shield, Bell, Plug, Users, Database, Key, Activity } from "lucide-react";

const coreSettings: SettingsCategoryItem[] = [
  {
    title: "General",
    href: "/admin/settings/general",
    description: "Platform name, branding, theme, and regional defaults.",
    icon: Settings,
    tags: ["Branding", "Theme", "Timezone"],
  },
  {
    title: "Security",
    href: "/admin/settings/security",
    description: "Authentication policies, sessions, and API access controls.",
    icon: Shield,
    tags: ["2FA", "Sessions", "Rate limits"],
  },
  {
    title: "Notifications",
    href: "/admin/settings/notifications",
    description: "Email delivery, alert types, and outbound webhooks.",
    icon: Bell,
    tags: ["SMTP", "Alerts", "Webhooks"],
  },
  {
    title: "Integrations",
    href: "/admin/settings/integrations",
    description: "Connect Stripe, SendGrid, Slack, GitHub, and Jira.",
    icon: Plug,
    tags: ["Stripe", "GitHub", "Jira"],
  },
];

const advancedSettings: SettingsCategoryItem[] = [
  {
    title: "User Management",
    href: "/admin/settings/users",
    description: "Directories, SSO, and account lifecycle policies.",
    icon: Users,
    tags: ["SSO", "Roles", "API keys"],
  },
  {
    title: "Data & Privacy",
    href: "/admin/settings/privacy",
    description: "Retention rules, compliance, and encryption settings.",
    icon: Database,
    tags: ["GDPR", "Backups", "Retention"],
  },
  {
    title: "API & Developer",
    href: "/admin/settings/api",
    description: "Developer keys, quotas, and platform API tooling.",
    icon: Key,
    tags: ["API keys", "Quotas", "Docs"],
  },
  {
    title: "Performance",
    href: "/admin/settings/performance",
    description: "Caching, CDN, and resource optimization controls.",
    icon: Activity,
    tags: ["Cache", "CDN", "Scaling"],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-10">
      <SettingsCategoryGroup
        title="Settings"
        description="Configure branding, security, alerts, and third-party services."
        items={coreSettings}
      />

      <SettingsCategoryGroup
        title="More settings"
        description="User access, compliance, APIs, and platform performance."
        items={advancedSettings}
      />
    </div>
  );
}
