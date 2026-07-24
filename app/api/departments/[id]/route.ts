import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const department = await db.department.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      _count: { select: { employees: true } },
      employees: { select: { id: true, firstName: true, lastName: true, position: true } },
    },
  });
  if (!department) return NextResponse.json({ error: "Department not found" }, { status: 404 });

  return NextResponse.json({
    department: {
      ...department,
      budgetAmount: Number(department.budgetAmount),
      employeeCount: department._count.employees,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.department.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Department not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.costCenter !== undefined) data.costCenter = body.costCenter || null;
  if (body.budgetAmount !== undefined) data.budgetAmount = body.budgetAmount;
  if (body.head !== undefined) data.head = body.head || null;

  const department = await db.department.update({
    where: { id },
    data,
  });

  return NextResponse.json({
    department: { ...department, budgetAmount: Number(department.budgetAmount) },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.department.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Department not found" }, { status: 404 });

  const employeeCount = await db.employee.count({ where: { departmentId: id } });
  if (employeeCount > 0) {
    return NextResponse.json({ error: "Cannot delete department with existing employees" }, { status: 400 });
  }

  await db.department.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
