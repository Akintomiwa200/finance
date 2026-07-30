"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { applySessionTimeoutFromSettings } from "@/src/lib/sync-session-timeout";

export function SessionSettingsSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const _hydrated = useAuthStore((s) => s._hydrated);
  const settings = useTenantSettingsStore((s) => s.settings);
  const settingsVersion = useTenantSettingsStore((s) => s.settingsVersion);

  useEffect(() => {
    if (!_hydrated || !isAuthenticated || !settings) return;
    applySessionTimeoutFromSettings(
      settings.session as unknown as Record<string, unknown>,
      settings.security as unknown as Record<string, unknown>,
    );
  }, [_hydrated, isAuthenticated, settings, settingsVersion]);

  return null;
}
