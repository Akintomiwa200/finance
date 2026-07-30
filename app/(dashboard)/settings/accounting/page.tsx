"use client";

import { SettingsHub } from "@/src/components/settings/settings-hub";
import { SETTINGS_GROUPS } from "@/src/lib/settings-navigation";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const GROUP = SETTINGS_GROUPS.find((g) => g.id === "accounting")!;

export default function AccountingSettingsPage() {
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const settings = useTenantSettingsStore((s) => s.settings);

  if (isLoading && !settings) return <SettingsPageSkeleton />;

  const accounting = settings?.accounting ?? {};

  return (
    <SettingsHub
      title="Accounting Settings"
      description="Configure ledger defaults, chart of accounts, and accounting periods."
      group={GROUP}
      links={GROUP.links}
      summary={[
        { label: "Base currency", value: String(accounting.baseCurrency ?? "USD") },
        { label: "Multi-currency", value: accounting.enableMultiCurrency ? "Enabled" : "Disabled" },
        { label: "Auto journal", value: accounting.enableAutoJournal ? "On" : "Off" },
        { label: "Decimal places", value: String(accounting.decimalPlaces ?? 2) },
      ]}
    />
  );
}
