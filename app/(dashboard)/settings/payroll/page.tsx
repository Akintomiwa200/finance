"use client";

import { SettingsHub } from "@/src/components/settings/settings-hub";
import { SETTINGS_GROUPS } from "@/src/lib/settings-navigation";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const GROUP = SETTINGS_GROUPS.find((g) => g.id === "payroll")!;

export default function PayrollSettingsPage() {
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const settings = useTenantSettingsStore((s) => s.settings);

  if (isLoading && !settings) return <SettingsPageSkeleton />;

  const payroll = settings?.payroll ?? {};

  return (
    <SettingsHub
      title="Payroll Settings"
      description="Configure pay frequency, structures, deductions, and leave policies."
      group={GROUP}
      links={GROUP.links}
      summary={[
        { label: "Pay frequency", value: String(payroll.payFrequency ?? "MONTHLY") },
        { label: "Auto payslip", value: payroll.enableAutoPayslip ? "Enabled" : "Disabled" },
        { label: "Overtime rate", value: `${payroll.overtimeRate ?? 1.5}x` },
        { label: "Payment method", value: String(payroll.defaultPaymentMethod ?? "BANK_TRANSFER") },
      ]}
    />
  );
}
