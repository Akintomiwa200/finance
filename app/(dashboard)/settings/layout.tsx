"use client";

import { useEffect } from "react";
import { SettingsSyncBar } from "@/src/components/settings/settings-sync-bar";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrated = useTenantSettingsStore((s) => s.hydrated);
  const fetchSettings = useTenantSettingsStore((s) => s.fetchSettings);

  useEffect(() => {
    if (hydrated) {
      fetchSettings(true);
    }
  }, [hydrated, fetchSettings]);

  return (
    <div className="min-h-full">
      <SettingsSyncBar />
      {children}
    </div>
  );
}
