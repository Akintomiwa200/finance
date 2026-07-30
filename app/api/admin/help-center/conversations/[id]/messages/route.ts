import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import { sendStaffHelpCenterMessage } from "@/src/services/help-center.service";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error, session } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;

  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = body.content?.trim();
  if (!content) {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  try {
    const message = await sendStaffHelpCenterMessage({
      conversationId: id,
      staffId: session!.user.id,
      staffName: session!.user.name ?? "Support",
      content,
    });

    return NextResponse.json({ message });
  } catch (err) {
    console.error("[ADMIN_HELP_CENTER_MESSAGE_POST]", err);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
