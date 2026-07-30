import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/src/lib/admin-auth";
import {
  getAdminHelpCenterConversation,
  resolveHelpCenterConversation,
} from "@/src/services/help-center.service";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;

  try {
    const session = await getAdminHelpCenterConversation(id);
    if (!session) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    return NextResponse.json(session);
  } catch (err) {
    console.error("[ADMIN_HELP_CENTER_CONVERSATION_GET]", err);
    return NextResponse.json({ error: "Failed to load conversation" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireSuperAdmin();
  if (error) return error;

  const { id } = await params;
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status === "RESOLVED") {
    const conversation = await resolveHelpCenterConversation(id);
    return NextResponse.json({ conversation });
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
}
