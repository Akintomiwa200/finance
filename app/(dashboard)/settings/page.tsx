"use client";

import { SettingsHub } from "@/src/components/settings/settings-hub";
import {
  SETTINGS_GROUPS,
  SETTINGS_ROOT_LINKS,
} from "@/src/lib/settings-navigation";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

export default function SettingsPage() {
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const settings = useTenantSettingsStore((s) => s.settings);

  if (isLoading && !settings) return <SettingsPageSkeleton />;

  const allLinks = [
    ...SETTINGS_ROOT_LINKS,
    ...SETTINGS_GROUPS.flatMap((group) => group.links),
  ];

  return (
    <SettingsHub
      title="Settings"
      description="All configuration is saved to your organization, cached locally, and synchronized in real time across devices."
      links={allLinks}
      summary={[
        { label: "Organization", value: settings?.org.name ?? "—" },
        { label: "Base currency", value: String((settings?.accounting as Record<string, unknown>)?.baseCurrency ?? settings?.regional.currency ?? "—") },
        { label: "Timezone", value: settings?.regional.timezone ?? "—" },
        {
          label: "Auto logout",
          value:
            settings?.session.inactivityTimeoutMinutes === 0
              ? "Disabled"
              : `${settings?.session.inactivityTimeoutMinutes ?? 30} min`,
        },
      ]}
    />
  );
}
