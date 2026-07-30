import type { ThemeMode } from "@/src/context/theme-context";
import type { AccentColor, FontFamily, FontSize } from "@/src/types/platform-settings";

export interface UserAppearanceSettings {
  theme: ThemeMode;
  accentColor: AccentColor;
  fontSize: FontSize;
  fontFamily: FontFamily;
  compactNav: boolean;
  updatedAt: string;
}

export const DEFAULT_USER_APPEARANCE: UserAppearanceSettings = {
  theme: "system",
  accentColor: "rose",
  fontSize: "medium",
  fontFamily: "sans",
  compactNav: false,
  updatedAt: new Date(0).toISOString(),
};

const THEMES: ThemeMode[] = ["light", "dark", "system"];
const ACCENTS: AccentColor[] = ["blue", "purple", "emerald", "amber", "rose"];
const FONT_SIZES: FontSize[] = ["small", "medium", "large"];
const FONT_FAMILIES: FontFamily[] = ["sans", "nunito", "bricolage", "dm-sans"];

export function normalizeUserAppearance(
  input: Partial<UserAppearanceSettings> | null | undefined,
  fallback: UserAppearanceSettings = DEFAULT_USER_APPEARANCE,
): UserAppearanceSettings {
  const theme = THEMES.includes(input?.theme as ThemeMode)
    ? (input!.theme as ThemeMode)
    : fallback.theme;
  const accentColor = ACCENTS.includes(input?.accentColor as AccentColor)
    ? (input!.accentColor as AccentColor)
    : fallback.accentColor;
  const fontSize = FONT_SIZES.includes(input?.fontSize as FontSize)
    ? (input!.fontSize as FontSize)
    : fallback.fontSize;
  const fontFamily = FONT_FAMILIES.includes(input?.fontFamily as FontFamily)
    ? (input!.fontFamily as FontFamily)
    : fallback.fontFamily;

  return {
    theme,
    accentColor,
    fontSize,
    fontFamily,
    compactNav: typeof input?.compactNav === "boolean" ? input.compactNav : fallback.compactNav,
    updatedAt:
      typeof input?.updatedAt === "string" && input.updatedAt
        ? input.updatedAt
        : fallback.updatedAt,
  };
}

export function appearanceFromOrgGeneral(
  general: Record<string, unknown> | null | undefined,
): UserAppearanceSettings {
  if (!general) return { ...DEFAULT_USER_APPEARANCE };
  return normalizeUserAppearance({
    theme: general.theme as ThemeMode,
    accentColor: general.accentColor as AccentColor,
    fontSize: general.fontSize as FontSize,
    fontFamily: general.fontFamily as FontFamily,
    compactNav: general.compactNav as boolean,
  });
}
