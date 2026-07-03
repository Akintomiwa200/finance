import type { ThemeMode } from "@/src/context/theme-context";

export type AccentColor = "blue" | "purple" | "emerald" | "amber" | "rose";
export type FontSize = "small" | "medium" | "large";
export type FontFamily = "sans" | "nunito" | "bricolage" | "dm-sans";

export interface PlatformGeneralSettings {
  platformName: string;
  supportEmail: string;
  defaultCurrency: string;
  theme: ThemeMode;
  accentColor: AccentColor;
  timezone: string;
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
  compactNav: boolean;
  fontSize: FontSize;
  fontFamily: FontFamily;
}

export type PlatformPersonalization = Pick<
  PlatformGeneralSettings,
  "platformName" | "theme" | "accentColor" | "compactNav" | "fontSize" | "fontFamily"
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
  fontSize: "medium",
  fontFamily: "sans",
};
