import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getSystemRoles } from "@/src/services/platform-permissions.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  return NextResponse.json(getSystemRoles());
}
