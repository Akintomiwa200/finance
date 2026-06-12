import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import {
  getNotifications,
  getUnreadCount,
  markAllAsRead,
} from "@/src/services/notification.service";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(session.user.id),
    getUnreadCount(session.user.id),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await markAllAsRead(session.user.id);
  return NextResponse.json({ success: true });
}
