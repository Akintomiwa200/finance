import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  locale: string;
  currency: string;
  timezone: string;
  dateFormat: "short" | "long" | "relative";
  itemsPerPage: number;
  sidebarCollapsed: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;

  setLocale: (locale: string) => void;
  setCurrency: (currency: string) => void;
  setTimezone: (timezone: string) => void;
  setDateFormat: (format: "short" | "long" | "relative") => void;
  setItemsPerPage: (count: number) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setEmailNotifications: (enabled: boolean) => void;
  setPushNotifications: (enabled: boolean) => void;
  resetToDefaults: () => void;
}

const defaults = {
  locale: "en-NG",
  currency: "NGN",
  timezone: "Africa/Lagos",
  dateFormat: "short" as const,
  itemsPerPage: 10,
  sidebarCollapsed: false,
  emailNotifications: true,
  pushNotifications: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,

      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
      setTimezone: (timezone) => set({ timezone }),
      setDateFormat: (format) => set({ dateFormat: format }),
      setItemsPerPage: (count) => set({ itemsPerPage: count }),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setEmailNotifications: (enabled) => set({ emailNotifications: enabled }),
      setPushNotifications: (enabled) => set({ pushNotifications: enabled }),
      resetToDefaults: () => set(defaults),
    }),
    { name: "faas-settings" }
  )
);
