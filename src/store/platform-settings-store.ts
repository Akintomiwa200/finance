"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PlatformGeneralSettings } from "@/src/types/platform-settings";
import { DEFAULT_PLATFORM_SETTINGS } from "@/src/types/platform-settings";
import {
  applyAccentColor,
  applyCompactNav,
} from "@/src/lib/apply-platform-personalization";

interface PlatformSettingsState extends PlatformGeneralSettings {
  hydrated: boolean;
  setSettings: (settings: Partial<PlatformGeneralSettings>) => void;
  applyPersonalization: () => void;
  setHydrated: () => void;
}

export const usePlatformSettingsStore = create<PlatformSettingsState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_PLATFORM_SETTINGS,
      hydrated: false,

      setSettings: (patch) => {
        set((state) => ({ ...state, ...patch }));
        get().applyPersonalization();
      },

      applyPersonalization: () => {
        const { accentColor, compactNav } = get();
        if (typeof window === "undefined") return;
        applyAccentColor(accentColor);
        applyCompactNav(compactNav);
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
