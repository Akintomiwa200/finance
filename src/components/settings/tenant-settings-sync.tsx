"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";

export function TenantSettingsSync() {
  const organizationId = useAuthStore((s) => s.user?.organizationId ?? null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const _hydrated = useAuthStore((s) => s._hydrated);
  const setOrganizationId = useTenantSettingsStore((s) => s.setOrganizationId);
  const startPolling = useTenantSettingsStore((s) => s.startPolling);
  const stopPolling = useTenantSettingsStore((s) => s.stopPolling);

  useEffect(() => {
    if (!_hydrated) return;

    if (isAuthenticated && organizationId) {
      setOrganizationId(organizationId);
      startPolling();
      return () => stopPolling();
    }

    setOrganizationId(null);
    stopPolling();
  }, [_hydrated, isAuthenticated, organizationId, setOrganizationId, startPolling, stopPolling]);

  return null;
}
