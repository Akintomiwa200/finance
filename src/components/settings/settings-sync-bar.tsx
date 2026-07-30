"use client";

import { RefreshCw, Wifi } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { useSessionSettingsStore } from "@/src/store/session-settings-store";

export function SettingsSyncBar() {
  const settings = useTenantSettingsStore((s) => s.settings);
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const isSaving = useTenantSettingsStore((s) => s.isSaving);
  const fetchSettings = useTenantSettingsStore((s) => s.fetchSettings);
  const timeoutMinutes = useSessionSettingsStore((s) => s.inactivityTimeoutMinutes);

  if (!settings) return null;

  const statusText = isSaving
    ? "Saving..."
    : isLoading
      ? "Syncing..."
      : "Live sync active";

  return (
    <div className="mb-4 flex flex-col gap-2 rounded-lg border bg-muted/30 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Wifi className={`h-3.5 w-3.5 ${isLoading || isSaving ? "animate-pulse text-amber-500" : "text-emerald-600"}`} />
        <span>{statusText}</span>
        {settings.updatedAt && (
          <span>· Last synced {new Date(settings.updatedAt).toLocaleString()}</span>
        )}
        <span>· Auto logout: {timeoutMinutes === 0 ? "Off" : `${timeoutMinutes} min`}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-7 text-xs"
        onClick={() => fetchSettings(true)}
        disabled={isLoading || isSaving}
      >
        <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}
