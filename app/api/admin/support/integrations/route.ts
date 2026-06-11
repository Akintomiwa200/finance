import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getLinkedIssuesSummary } from "@/src/services/support.service";
import { prepareSupportData } from "@/src/lib/support-api";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  await prepareSupportData();
  return NextResponse.json(getLinkedIssuesSummary());
}
