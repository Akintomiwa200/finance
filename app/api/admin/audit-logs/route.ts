import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminAuditLogs } from "@/src/services/admin.service";

export async function GET(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") ?? "100", 10);

  const logs = await getAdminAuditLogs(limit);
  return NextResponse.json(logs);
}
