import { NextResponse } from "next/server";
import { getPlatformSettings } from "@/src/services/platform-settings.service";

export async function GET() {
  const settings = getPlatformSettings();
  return NextResponse.json({
    platformName: settings.platformName,
    theme: settings.theme,
    accentColor: settings.accentColor,
    compactNav: settings.compactNav,
  });
}
