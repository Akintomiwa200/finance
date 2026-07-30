"use client";

import { SettingsHub } from "@/src/components/settings/settings-hub";
import { SETTINGS_GROUPS } from "@/src/lib/settings-navigation";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { useEmployeeStore } from "@/src/store/employee-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useEffect } from "react";

const GROUP = SETTINGS_GROUPS.find((g) => g.id === "roles")!;

export default function RolesSettingsPage() {
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const settings = useTenantSettingsStore((s) => s.settings);
  const { employees, loading, startPolling, stopPolling } = useEmployeeStore();

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  if ((isLoading && !settings) || (loading && employees.length === 0)) {
    return <SettingsPageSkeleton />;
  }

  const activeUsers = employees.filter((e) => e.isActive !== false).length;

  return (
    <SettingsHub
      title="Roles & Permissions"
      description="Manage users, role access, and audit activity across your organization."
      group={GROUP}
      links={GROUP.links}
      summary={[
        { label: "Active users", value: String(activeUsers) },
        { label: "Total users", value: String(employees.length) },
        { label: "Organization", value: settings?.org.name ?? "—" },
        { label: "MFA required", value: settings?.security.mfaEnabled ? "Yes" : "No" },
      ]}
    />
  );
}
