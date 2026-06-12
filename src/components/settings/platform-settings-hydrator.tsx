"use client";

import { useEffect, useRef } from "react";
import { usePlatformSettingsStore } from "@/src/store/platform-settings-store";
import { useTheme } from "@/src/context/theme-context";
import { api } from "@/src/lib/api";
import type { PlatformPersonalization } from "@/src/types/platform-settings";

export function PlatformSettingsHydrator() {
  const hydrated = usePlatformSettingsStore((s) => s.hydrated);
  const theme = usePlatformSettingsStore((s) => s.theme);
  const accentColor = usePlatformSettingsStore((s) => s.accentColor);
  const compactNav = usePlatformSettingsStore((s) => s.compactNav);
  const setSettings = usePlatformSettingsStore((s) => s.setSettings);
  const applyPersonalization = usePlatformSettingsStore((s) => s.applyPersonalization);
  const { mode, setMode } = useTheme();
  const fetchedServerSettings = useRef(false);
  const lastAppliedTheme = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    applyPersonalization();
  }, [hydrated, accentColor, compactNav, theme, applyPersonalization]);

  useEffect(() => {
    if (!hydrated || theme === mode) return;
    if (lastAppliedTheme.current === theme) return;
    lastAppliedTheme.current = theme;
    setMode(theme);
  }, [hydrated, theme, mode, setMode]);

  useEffect(() => {
    if (!hydrated || fetchedServerSettings.current) return;
    fetchedServerSettings.current = true;

    let cancelled = false;

    (async () => {
      const result = await api.get<PlatformPersonalization>("/api/platform/personalization");
      if (cancelled || !result.success || !result.data) return;
      setSettings(result.data);
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, setSettings]);

  return null;
}
