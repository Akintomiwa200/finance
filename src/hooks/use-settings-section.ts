"use client";

import { useCallback, useMemo } from "react";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { useToast } from "@/src/components/ui/use-toast";

export function useSettingsSection(section: string) {
  const settings = useTenantSettingsStore((s) => s.settings);
  const isLoading = useTenantSettingsStore((s) => s.isLoading);
  const error = useTenantSettingsStore((s) => s.error);
  const updateSettings = useTenantSettingsStore((s) => s.updateSettings);
  const { toast } = useToast();

  const sectionData = useMemo(() => {
    if (!settings) return null;
    return (settings as unknown as Record<string, unknown>)[section] || null;
  }, [settings, section]);

  const saveSection = useCallback(
    async (data: Record<string, unknown>) => {
      const success = await updateSettings(section, data);
      if (success) {
        toast({
          title: "Settings saved",
          description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been updated.`,
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
    isLoading,
    error,
    saveSection,
  };
}
