import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminAuditLog } from "@/src/services/admin.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const log = await getAdminAuditLog(id);

  if (!log) {
    return NextResponse.json({ error: "Audit log not found" }, { status: 404 });
  }

  return NextResponse.json(log);
}
