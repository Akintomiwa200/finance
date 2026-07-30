"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { useToast } from "@/src/components/ui/use-toast";

/** Re-hydrate local state when remote settings change and the form is clean. */
export function useSyncSectionData(
  data: Record<string, unknown> | null,
  settingsVersion: number,
  isDirty: boolean,
  onSync: (data: Record<string, unknown>) => void,
) {
  const onSyncRef = useRef(onSync);
  onSyncRef.current = onSync;

  useEffect(() => {
    if (!data || isDirty) return;
    onSyncRef.current(data);
  }, [data, settingsVersion, isDirty]);
}

export function useSettingsSection(section: string) {
  const settings = useTenantSettingsStore((s) => s.settings);
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const isSaving = useTenantSettingsStore((s) => s.isSaving);
  const error = useTenantSettingsStore((s) => s.error);
  const settingsVersion = useTenantSettingsStore((s) => s.settingsVersion);
  const hydrated = useTenantSettingsStore((s) => s.hydrated);
  const updateSettings = useTenantSettingsStore((s) => s.updateSettings);
  const fetchSettings = useTenantSettingsStore((s) => s.fetchSettings);
  const { toast } = useToast();

  const sectionData = useMemo(() => {
    if (!settings) return null;
    return (settings as unknown as Record<string, unknown>)[section] || null;
  }, [settings, section]);

  useEffect(() => {
    if (hydrated && !settings && !isLoading) {
      fetchSettings(true);
    }
  }, [hydrated, settings, isLoading, fetchSettings]);

  const saveSection = useCallback(
    async (data: Record<string, unknown>, extra?: Record<string, unknown>) => {
      const success = await updateSettings(section, data, extra);
      if (success) {
        toast({
          title: "Settings saved",
          description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated and synced.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
      }
      return success;
    },
    [section, updateSettings, toast],
  );

  return {
    data: sectionData as Record<string, unknown> | null,
    org: settings?.org ?? null,
    isLoading: isLoading && !settings,
    isSaving,
    error,
    settingsVersion,
    saveSection,
    refresh: fetchSettings,
  };
}
