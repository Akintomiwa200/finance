import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getPlatformSettings,
  updatePlatformSettings,
} from "@/src/services/platform-settings.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  return NextResponse.json(getPlatformSettings());
}

export async function PATCH(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const body = await req.json();
  const settings = updatePlatformSettings(body);
  return NextResponse.json(settings);
}
