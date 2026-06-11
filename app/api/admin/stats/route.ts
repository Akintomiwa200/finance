import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminStats } from "@/src/services/admin.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const stats = await getAdminStats();
  return NextResponse.json(stats);
}
