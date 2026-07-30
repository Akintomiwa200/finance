import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/src/lib/support-auth";
import { sendUserHelpCenterMessage } from "@/src/services/help-center.service";

export async function POST(req: Request) {
  const { error, session, org } = await requireAuthenticatedUser();
  if (error) return error;

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
    const result = await sendUserHelpCenterMessage({
      userId: session!.user.id,
      organizationId: org!.id,
      userName: session!.user.name ?? "User",
      userEmail: session!.user.email,
      orgName: org!.name,
      content,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[HELP_CENTER_MESSAGE_POST]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
