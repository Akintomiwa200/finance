import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminEmployees } from "@/src/services/admin.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const employees = await getAdminEmployees();
  return NextResponse.json(employees);
}
