import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import {
  getHelpCenterArticles,
  getHelpCenterUnreadCount,
  getUserHelpCenterSession,
  markHelpCenterRead,
} from "@/src/services/help-center.service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view");

  if (view === "articles") {
    const articles = await getHelpCenterArticles();
    return NextResponse.json({ articles });
  }

  const { error, session, org } = await requireAuthenticatedUser();
  if (error) return error;

  if (view === "unread") {
    const unreadCount = await getHelpCenterUnreadCount(session!.user.id);
    return NextResponse.json({ unreadCount });
  }

  const sessionData = await getUserHelpCenterSession({
    userId: session!.user.id,
    organizationId: org!.id,
    userName: session!.user.name ?? "User",
    userEmail: session!.user.email,
    orgName: org!.name,
  });

  return NextResponse.json(sessionData);
}

export async function PATCH(req: Request) {
  const { error, session } = await requireAuthenticatedUser();
  if (error) return error;

  let body: { conversationId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }

  const conversation = await markHelpCenterRead(body.conversationId, session!.user.id);
  if (!conversation) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, conversation });
}
