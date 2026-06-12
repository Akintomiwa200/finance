import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { markAsRead } from "@/src/services/notification.service";
import { db } from "@/src/lib/db";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const notification = await db.notification.findUnique({ where: { id } });

  if (!notification || notification.userId !== session.user.id) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  const updated = await markAsRead(id);
  return NextResponse.json(updated);
}
