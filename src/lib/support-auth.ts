import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function requireAuthenticatedUser() {
  const session = await auth();

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null, org: null };
  }

  if (!session.user.organizationId) {
    return { error: NextResponse.json({ error: "No organization" }, { status: 403 }), session: null, org: null };
  }

  const org = await db.organization.findUnique({
    where: { id: session.user.organizationId },
    select: { id: true, name: true },
  });

  if (!org) {
    return { error: NextResponse.json({ error: "Organization not found" }, { status: 404 }), session: null, org: null };
  }

  return { error: null, session, org };
}
