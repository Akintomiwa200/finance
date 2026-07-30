import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { getPlatformSettings } from "@/src/services/platform-settings.service";
import { getUserAppearance } from "@/src/services/user-appearance.service";

export async function GET() {
  const session = await auth();

  if (session?.user?.id) {
    try {
      const appearance = await getUserAppearance(
        session.user.id,
        session.user.organizationId,
      );
      return NextResponse.json({
        platformName: getPlatformSettings().platformName,
        theme: appearance.theme,
        accentColor: appearance.accentColor,
        compactNav: appearance.compactNav,
        fontSize: appearance.fontSize,
        fontFamily: appearance.fontFamily,
      });
    } catch (error) {
      console.error("[PLATFORM_PERSONALIZATION_GET]", error);
    }
  }

  const settings = getPlatformSettings();
  return NextResponse.json({
    platformName: settings.platformName,
    theme: settings.theme,
    accentColor: settings.accentColor,
    compactNav: settings.compactNav,
    fontSize: settings.fontSize,
    fontFamily: settings.fontFamily,
  });
}
