import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { getAdminHelpCenterInbox } from "@/src/services/help-center.service";

export async function GET() {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  try {
    const conversations = await getAdminHelpCenterInbox();
    return NextResponse.json({ conversations });
  } catch (err) {
    console.error("[ADMIN_HELP_CENTER_GET]", err);
    return NextResponse.json({ error: "Failed to load help center inbox" }, { status: 500 });
  }
}
