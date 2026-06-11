import type { PlatformGeneralSettings } from "@/src/types/platform-settings";
import { DEFAULT_PLATFORM_SETTINGS } from "@/src/types/platform-settings";

let settings: PlatformGeneralSettings = { ...DEFAULT_PLATFORM_SETTINGS };

export function getPlatformSettings(): PlatformGeneralSettings {
  return { ...settings };
}

export function updatePlatformSettings(
  patch: Partial<PlatformGeneralSettings>,
): PlatformGeneralSettings {
  settings = { ...settings, ...patch };
  return { ...settings };
}
