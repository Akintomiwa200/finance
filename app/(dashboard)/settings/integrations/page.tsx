"use client";

import { SettingsHub } from "@/src/components/settings/settings-hub";
import { SETTINGS_GROUPS } from "@/src/lib/settings-navigation";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const GROUP = SETTINGS_GROUPS.find((g) => g.id === "integrations")!;

export default function IntegrationsSettingsPage() {
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const settings = useTenantSettingsStore((s) => s.settings);

  if (isLoading && !settings) return <SettingsPageSkeleton />;

  const integrations = settings?.integrations ?? {};

  return (
    <SettingsHub
      title="Integrations"
      description="Connect banks, API clients, and outbound webhooks."
      group={GROUP}
      links={GROUP.links}
      summary={[
        { label: "Webhooks", value: integrations.enableWebhooks ? "Enabled" : "Disabled" },
        { label: "Bank feed", value: integrations.enableBankFeed ? "Connected" : "Not connected" },
        { label: "API access", value: integrations.enableAPIAccess ? "Enabled" : "Disabled" },
        { label: "Rate limit", value: `${integrations.rateLimit ?? 1000}/hr` },
      ]}
    />
  );
}
