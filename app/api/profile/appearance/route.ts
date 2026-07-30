import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import {
  getUserAppearance,
  updateUserAppearance,
} from "@/src/services/user-appearance.service";
import { normalizeUserAppearance } from "@/src/types/user-appearance";
import type { ThemeMode } from "@/src/context/theme-context";
import type { AccentColor, FontFamily, FontSize } from "@/src/types/platform-settings";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const appearance = await getUserAppearance(
      session.user.id,
      session.user.organizationId,
    );
    return NextResponse.json({ appearance });
  } catch (error) {
    console.error("[PROFILE_APPEARANCE_GET]", error);
    return NextResponse.json({ error: "Failed to fetch appearance settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const patch: Partial<{
    theme: ThemeMode;
    accentColor: AccentColor;
    fontSize: FontSize;
    fontFamily: FontFamily;
    compactNav: boolean;
  }> = {};

  if (body.theme !== undefined) patch.theme = body.theme as ThemeMode;
  if (body.accentColor !== undefined) patch.accentColor = body.accentColor as AccentColor;
  if (body.fontSize !== undefined) patch.fontSize = body.fontSize as FontSize;
  if (body.fontFamily !== undefined) patch.fontFamily = body.fontFamily as FontFamily;
  if (body.compactNav !== undefined) patch.compactNav = Boolean(body.compactNav);

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No appearance fields to update" }, { status: 400 });
  }

  try {
    const appearance = await updateUserAppearance(session.user.id, patch);
    return NextResponse.json({
      success: true,
      appearance: normalizeUserAppearance(appearance),
    });
  } catch (error) {
    console.error("[PROFILE_APPEARANCE_PATCH]", error);
    return NextResponse.json({ error: "Failed to update appearance settings" }, { status: 500 });
  }
}
