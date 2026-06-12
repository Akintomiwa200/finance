import type { AccentColor } from "@/src/types/platform-settings";
import type { ThemeMode } from "@/src/context/theme-context";

const ACCENT_CLASSES: AccentColor[] = ["blue", "purple", "emerald", "amber", "rose"];

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

export function applyPlatformPersonalization(settings: {
  theme: ThemeMode;
  accentColor: AccentColor;
  compactNav: boolean;
}) {
  if (typeof window === "undefined") return;
  applyThemeMode(settings.theme);
  applyAccentColor(settings.accentColor);
  applyCompactNav(settings.compactNav);
  localStorage.setItem("faas-theme", settings.theme);
}
