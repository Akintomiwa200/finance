"use client";

import { SettingsHub } from "@/src/components/settings/settings-hub";
import { SETTINGS_GROUPS } from "@/src/lib/settings-navigation";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const GROUP = SETTINGS_GROUPS.find((g) => g.id === "notifications")!;

export default function NotificationsSettingsPage() {
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const settings = useTenantSettingsStore((s) => s.settings);

  if (isLoading && !settings) return <SettingsPageSkeleton />;

  const notifications = settings?.notifications ?? {};

  return (
    <SettingsHub
      title="Notifications"
      description="Configure email alerts, in-app notifications, and delivery channels."
      group={GROUP}
      links={GROUP.links}
      summary={[
        { label: "Email alerts", value: notifications.emailEnabled ? "On" : "Off" },
        { label: "Desktop alerts", value: notifications.desktopEnabled ? "On" : "Off" },
        { label: "Payroll alerts", value: notifications.payrollAlerts ? "On" : "Off" },
        { label: "Approval alerts", value: notifications.approvalAlerts ? "On" : "Off" },
      ]}
    />
  );
}
