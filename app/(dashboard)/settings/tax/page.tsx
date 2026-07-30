"use client";

import { SettingsHub } from "@/src/components/settings/settings-hub";
import { SETTINGS_GROUPS } from "@/src/lib/settings-navigation";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const GROUP = SETTINGS_GROUPS.find((g) => g.id === "tax")!;

export default function TaxSettingsPage() {
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const settings = useTenantSettingsStore((s) => s.settings);

  if (isLoading && !settings) return <SettingsPageSkeleton />;

  const tax = settings?.tax ?? {};

  return (
    <SettingsHub
      title="Tax Configuration"
      description="Manage tax authorities, rates, and codes for your organization."
      group={GROUP}
      links={GROUP.links}
      summary={[
        { label: "VAT enabled", value: tax.enableVAT ? "Yes" : "No" },
        { label: "Default VAT", value: `${tax.defaultVATRate ?? 0}%` },
        { label: "Withholding tax", value: tax.enableWithholdingTax ? "Enabled" : "Disabled" },
        { label: "Filing frequency", value: String(tax.filingFrequency ?? "MONTHLY") },
      ]}
    />
  );
}
