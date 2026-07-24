import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const employee = await db.employee.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { department: { select: { name: true } } },
  });
  if (!employee) return NextResponse.json({ error: "Employee not found" }, { status: 404 });

  return NextResponse.json({
    employee: {
      ...employee,
      baseSalary: Number(employee.baseSalary),
      departmentName: employee.department?.name || null,
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
  const existing = await db.employee.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Employee not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.firstName !== undefined) data.firstName = body.firstName;
  if (body.lastName !== undefined) data.lastName = body.lastName;
  if (body.email !== undefined) data.email = body.email;
  if (body.phone !== undefined) data.phone = body.phone || null;
  if (body.position !== undefined) data.position = body.position || null;
  if (body.baseSalary !== undefined) data.baseSalary = body.baseSalary;
  if (body.bankName !== undefined) data.bankName = body.bankName || null;
  if (body.bankAccount !== undefined) data.bankAccount = body.bankAccount || null;
  if (body.bankCode !== undefined) data.bankCode = body.bankCode || null;
  if (body.taxId !== undefined) data.taxId = body.taxId || null;
  if (body.hireDate !== undefined) data.hireDate = body.hireDate ? new Date(body.hireDate) : null;
  if (body.isActive !== undefined) data.isActive = body.isActive;
  if (body.role !== undefined) data.role = body.role.toUpperCase();
  if (body.departmentId !== undefined) data.departmentId = body.departmentId;

  const employee = await db.employee.update({
    where: { id },
    data,
    include: { department: { select: { name: true } } },
  });

  return NextResponse.json({
    employee: {
      ...employee,
      baseSalary: Number(employee.baseSalary),
      departmentName: employee.department?.name || null,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.employee.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Employee not found" }, { status: 404 });

  const hasPayroll = await db.payrollItem.count({ where: { employeeId: id } });
  if (hasPayroll > 0) {
    return NextResponse.json({ error: "Cannot delete employee with existing payroll records" }, { status: 400 });
  }

  await db.employee.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
