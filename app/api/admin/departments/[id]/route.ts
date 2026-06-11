import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminDepartment } from "@/src/services/admin.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  const department = await getAdminDepartment(id);

  if (!department) {
    return NextResponse.json({ error: "Department not found" }, { status: 404 });
  }

  return NextResponse.json(department);
}
