"use client";

import { useEffect } from "react";
import { usePlatformSettingsStore } from "@/src/store/platform-settings-store";
import { useTheme } from "@/src/context/theme-context";

export function PlatformSettingsHydrator() {
  const { setMode } = useTheme();
  const applyPersonalization = usePlatformSettingsStore((s) => s.applyPersonalization);
  const theme = usePlatformSettingsStore((s) => s.theme);
  const hydrated = usePlatformSettingsStore((s) => s.hydrated);

  useEffect(() => {
    applyPersonalization();
  }, [applyPersonalization]);

  useEffect(() => {
    if (hydrated) {
      setMode(theme);
    }
  }, [hydrated, theme, setMode]);

  return null;
}
