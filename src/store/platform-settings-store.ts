"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlatformGeneralSettings } from "@/src/types/platform-settings";
import type { ThemeMode } from "@/src/context/theme-context";
import { DEFAULT_PLATFORM_SETTINGS } from "@/src/types/platform-settings";
import { applyPlatformPersonalization } from "@/src/lib/apply-platform-personalization";

interface PlatformSettingsState extends PlatformGeneralSettings {
  hydrated: boolean;
  setSettings: (settings: Partial<PlatformGeneralSettings>) => void;
  syncTheme: (theme: ThemeMode) => void;
  applyPersonalization: () => void;
  setHydrated: () => void;
}

export const usePlatformSettingsStore = create<PlatformSettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PLATFORM_SETTINGS,
      hydrated: false,

      setSettings: (patch) => {
        const state = get();
        const hasChange = (
          Object.entries(patch) as [keyof PlatformGeneralSettings, PlatformGeneralSettings[keyof PlatformGeneralSettings]][]
        ).some(([key, value]) => state[key] !== value);
        if (!hasChange) return;
        set(patch);
        get().applyPersonalization();
      },

      syncTheme: (theme) => {
        if (get().theme !== theme) {
          set({ theme });
        }
      },

      applyPersonalization: () => {
        const { theme, accentColor, compactNav } = get();
        if (typeof window === "undefined") return;
        applyPlatformPersonalization({ theme, accentColor, compactNav });
      },

      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "faas-platform-settings",
      partialize: (state) => ({
        platformName: state.platformName,
        supportEmail: state.supportEmail,
        defaultCurrency: state.defaultCurrency,
        theme: state.theme,
        accentColor: state.accentColor,
        timezone: state.timezone,
        dateFormat: state.dateFormat,
        compactNav: state.compactNav,
      }),
      onRehydrateStorage: () => (state) => {
        state?.applyPersonalization();
        state?.setHydrated();
      },
    },
  ),
);
