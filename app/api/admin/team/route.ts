import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminPlatformTeam } from "@/src/services/admin.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const team = await getAdminPlatformTeam();
  return NextResponse.json(team);
}
