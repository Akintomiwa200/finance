import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const user = await db.employee.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, role, isActive, departmentId } = body;

    const updated = await db.employee.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(role && { role }),
        ...(typeof isActive === "boolean" && { isActive }),
        ...(departmentId && { departmentId }),
      },
      include: { department: true },
    });

    return NextResponse.json({
      id: updated.id,
      employeeCode: updated.employeeCode,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      role: updated.role,
      isActive: updated.isActive,
      department: updated.department ? { id: updated.department.id, name: updated.department.name } : null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const user = await db.employee.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await db.employee.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ success: true });
}
