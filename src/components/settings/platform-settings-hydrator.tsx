"use client";

import { useEffect, useRef } from "react";
import { usePlatformSettingsStore } from "@/src/store/platform-settings-store";
import { useTheme } from "@/src/context/theme-context";
import { useAuthStore } from "@/src/store/auth-store";
import { useUserAppearanceStore } from "@/src/store/user-appearance-store";

export function PlatformSettingsHydrator() {
  const hydrated = usePlatformSettingsStore((s) => s.hydrated);
  const theme = usePlatformSettingsStore((s) => s.theme);
  const accentColor = usePlatformSettingsStore((s) => s.accentColor);
  const compactNav = usePlatformSettingsStore((s) => s.compactNav);
  const fontSize = usePlatformSettingsStore((s) => s.fontSize);
  const fontFamily = usePlatformSettingsStore((s) => s.fontFamily);
  const applyPersonalization = usePlatformSettingsStore((s) => s.applyPersonalization);
  const { mode, setMode } = useTheme();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userAppearanceHydrated = useUserAppearanceStore((s) => s.hydrated);
  const userAppearance = useUserAppearanceStore((s) => s.appearance);
  const lastAppliedTheme = useRef<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (isAuthenticated && userAppearanceHydrated) return;
    applyPersonalization();
  }, [
    hydrated,
    isAuthenticated,
    userAppearanceHydrated,
    accentColor,
    compactNav,
    theme,
    fontSize,
    fontFamily,
    applyPersonalization,
  ]);

  useEffect(() => {
    if (!isAuthenticated || !userAppearanceHydrated) return;
    if (userAppearance.theme === mode) return;
    if (lastAppliedTheme.current === userAppearance.theme) return;
    lastAppliedTheme.current = userAppearance.theme;
    setMode(userAppearance.theme);
  }, [isAuthenticated, userAppearanceHydrated, userAppearance.theme, mode, setMode]);

  useEffect(() => {
    if (!hydrated || isAuthenticated) return;
    if (theme === mode) return;
    if (lastAppliedTheme.current === theme) return;
    lastAppliedTheme.current = theme;
    setMode(theme);
  }, [hydrated, isAuthenticated, theme, mode, setMode]);

  return null;
}
