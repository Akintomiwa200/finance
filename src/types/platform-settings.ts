import type { ThemeMode } from "@/src/context/theme-context";

export type AccentColor = "blue" | "purple" | "emerald" | "amber" | "rose";

export interface PlatformGeneralSettings {
  platformName: string;
  supportEmail: string;
  defaultCurrency: string;
  theme: ThemeMode;
  accentColor: AccentColor;
  timezone: string;
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  compactNav: boolean;
}

export type PlatformPersonalization = Pick<
  PlatformGeneralSettings,
  "platformName" | "theme" | "accentColor" | "compactNav"
>;

export const DEFAULT_PLATFORM_SETTINGS: PlatformGeneralSettings = {
  platformName: "FaaS Platform",
  supportEmail: "support@faas.dev",
  defaultCurrency: "NGN",
  theme: "system",
  accentColor: "rose",
  timezone: "Africa/Lagos",
  dateFormat: "DD/MM/YYYY",
  compactNav: false,
};
