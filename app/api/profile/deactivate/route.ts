import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await db.employee.update({
      where: { id: session.user.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Account deactivated" });
  } catch {
    return NextResponse.json({ error: "Failed to deactivate account" }, { status: 500 });
  }
}
