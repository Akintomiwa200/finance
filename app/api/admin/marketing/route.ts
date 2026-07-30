import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getMarketingAdminSummary,
  listContactSubmissions,
  listJobApplications,
} from "@/src/services/marketing.service";

export async function GET(req: Request) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view");

  try {
    if (view === "applications") {
      const data = await listJobApplications();
      return NextResponse.json({ success: true, data });
    }
    if (view === "contacts") {
      const data = await listContactSubmissions();
      return NextResponse.json({ success: true, data });
    }
    const data = await getMarketingAdminSummary();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load marketing admin data";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
