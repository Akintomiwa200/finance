import type { AccentColor, FontSize, FontFamily } from "@/src/types/platform-settings";
import type { ThemeMode } from "@/src/context/theme-context";

const ACCENT_CLASSES: AccentColor[] = ["blue", "purple", "emerald", "amber", "rose"];

const FONT_SIZE_MAP: Record<FontSize, string> = {
  small: "87.5%",
  medium: "100%",
  large: "112.5%",
};

const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  sans: "var(--font-sans)",
  nunito: "var(--font-nunito)",
  "dm-sans": "var(--font-dm-sans)",
  bricolage: "var(--font-bricolage)",
};

export function applyAccentColor(accent: AccentColor) {
  const root = document.documentElement;
  ACCENT_CLASSES.forEach((name) => root.classList.remove(`accent-${name}`));
  root.classList.add(`accent-${accent}`);
}

export function applyThemeMode(mode: ThemeMode) {
  const resolved =
    mode === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : mode;

  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = mode === "system" ? "light dark" : resolved;
}

export function applyCompactNav(compact: boolean) {
  document.documentElement.classList.toggle("compact-nav", compact);
}

export function applyFontSize(size: FontSize) {
  document.documentElement.style.fontSize = FONT_SIZE_MAP[size];
}

export function applyFontFamily(family: FontFamily) {
  document.documentElement.style.setProperty("--app-font", FONT_FAMILY_MAP[family]);
}

export function applyPlatformPersonalization(settings: {
  theme: ThemeMode;
  accentColor: AccentColor;
  compactNav: boolean;
  fontSize?: FontSize;
  fontFamily?: FontFamily;
}) {
  if (typeof window === "undefined") return;
  applyThemeMode(settings.theme);
  applyAccentColor(settings.accentColor);
  applyCompactNav(settings.compactNav);
  if (settings.fontSize) applyFontSize(settings.fontSize);
  if (settings.fontFamily) applyFontFamily(settings.fontFamily);
  localStorage.setItem("faas-theme", settings.theme);
}
