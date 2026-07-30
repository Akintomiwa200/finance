import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

function cleanNull(val: unknown): string | null {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (str === "" || str.toLowerCase() === "null" || str.toLowerCase() === "undefined") return null;
  return str;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const employee = await db.employee.findUnique({
    where: { id: session.user.id },
    include: { department: { select: { name: true } } },
  });

  if (!employee) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: employee.id,
    firstName: cleanNull(employee.firstName) || "User",
    lastName: cleanNull(employee.lastName) || "",
    email: cleanNull(employee.email) || "",
    phone: cleanNull(employee.phone),
    jobTitle: cleanNull(employee.jobTitle) || cleanNull(employee.position) || (employee.role ? employee.role.charAt(0) + employee.role.slice(1).toLowerCase().replace(/_/g, " ") : null),
    department: cleanNull(employee.department?.name),
    bio: cleanNull(employee.bio),
    avatarUrl: cleanNull(employee.avatarUrl),
    role: employee.role,
    isActive: employee.isActive,
    createdAt: employee.createdAt?.toISOString() || null,
    lastLoginAt: employee.lastLoginAt?.toISOString() || null,
    updatedAt: employee.updatedAt?.toISOString() || null,
  });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const allowed = ["firstName", "lastName", "email", "phone", "jobTitle", "bio", "avatarUrl"];
  const data: Record<string, string | null> = {};

  for (const key of allowed) {
    const val = body[key];
    if (val !== undefined) {
      data[key] = val === "" || val === null ? null : String(val);
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const updated = await db.employee.update({
      where: { id: session.user.id },
      data,
      include: { department: { select: { name: true } } },
    });

    return NextResponse.json({
      id: updated.id,
      firstName: cleanNull(updated.firstName) || "User",
      lastName: cleanNull(updated.lastName) || "",
      email: cleanNull(updated.email) || "",
      phone: cleanNull(updated.phone),
      jobTitle: cleanNull(updated.jobTitle) || cleanNull(updated.position) || null,
      department: cleanNull(updated.department?.name),
      bio: cleanNull(updated.bio),
      avatarUrl: cleanNull(updated.avatarUrl),
      role: updated.role,
      name: `${updated.firstName} ${updated.lastName}`,
      createdAt: updated.createdAt?.toISOString() || null,
    });
  } catch (error: unknown) {
    console.error("[PROFILE_PATCH]", error);
    const message =
      error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
