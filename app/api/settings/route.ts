import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import {
  getTenantSettings,
  updateTenantSettings,
} from "@/src/services/tenant-settings.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await getTenantSettings(session.user.organizationId);
    if (!settings) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const settings = await updateTenantSettings(
      session.user.organizationId,
      body,
      session.user.id,
    );

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error);
    const message =
      error instanceof Error ? error.message : "Failed to update settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
