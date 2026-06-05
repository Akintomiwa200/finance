import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await db.employee.findMany({
    where: { organizationId: session.user.organizationId },
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      employeeCode: u.employeeCode,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      isActive: u.isActive,
      department: u.department ? { id: u.department.id, name: u.department.name } : null,
      createdAt: u.createdAt,
    }))
  );
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { firstName, lastName, email, password, role, departmentId } = body;

    if (!firstName || !lastName || !email || !password || !role || !departmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await db.employee.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const department = await db.department.findFirst({
      where: { id: departmentId, organizationId: session.user.organizationId },
    });
    if (!department) {
      return NextResponse.json({ error: "Department not found" }, { status: 404 });
    }

    const count = await db.employee.count({
      where: { organizationId: session.user.organizationId },
    });
    const employeeCode = `EMP${String(count + 1).padStart(4, "0")}`;

    const passwordHash = await hash(password, 12);

    const user = await db.employee.create({
      data: {
        firstName,
        lastName,
        email,
        employeeCode,
        passwordHash,
        role,
        departmentId,
        organizationId: session.user.organizationId,
      },
      include: { department: true },
    });

    return NextResponse.json({
      id: user.id,
      employeeCode: user.employeeCode,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      department: user.department ? { id: user.department.id, name: user.department.name } : null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
