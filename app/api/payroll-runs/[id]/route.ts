import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const run = await db.payrollRun.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      items: {
        include: {
          employee: { select: { firstName: true, lastName: true, employeeCode: true } },
        },
      },
    },
  });
  if (!run) return NextResponse.json({ error: "Payroll run not found" }, { status: 404 });

  return NextResponse.json({
    payrollRun: {
      ...run,
      totalAmount: Number(run.totalAmount),
      items: run.items.map((i) => ({
        ...i,
        grossPay: Number(i.grossPay),
        deductions: Number(i.deductions),
        taxAmount: Number(i.taxAmount),
        netPay: Number(i.netPay),
        allowances: Number(i.allowances),
        bonus: Number(i.bonus),
        loanDeduction: Number(i.loanDeduction),
        overtimePay: Number(i.overtimePay),
        employeeName: `${i.employee.firstName} ${i.employee.lastName}`,
        employeeCode: i.employee.employeeCode,
      })),
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
  const existing = await db.payrollRun.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Payroll run not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.periodStart !== undefined) data.periodStart = new Date(body.periodStart);
  if (body.periodEnd !== undefined) data.periodEnd = new Date(body.periodEnd);
  if (body.notes !== undefined) data.notes = body.notes || null;

  if (body.status) {
    const newStatus = body.status.toUpperCase();
    if (newStatus === "COMPUTED") {
      data.status = "COMPUTED";
      data.processedAt = new Date();
    } else if (newStatus === "APPROVED") {
      data.status = "APPROVED";
    } else if (newStatus === "PAID") {
      data.status = "PAID";
    } else if (newStatus === "CANCELLED") {
      data.status = "CANCELLED";
    } else {
      data.status = newStatus;
    }
  }

  const run = await db.payrollRun.update({
    where: { id },
    data,
    include: {
      items: {
        include: {
          employee: { select: { firstName: true, lastName: true, employeeCode: true } },
        },
      },
    },
  });

  return NextResponse.json({
    payrollRun: {
      ...run,
      totalAmount: Number(run.totalAmount),
      items: run.items.map((i) => ({
        ...i,
        grossPay: Number(i.grossPay),
        deductions: Number(i.deductions),
        taxAmount: Number(i.taxAmount),
        netPay: Number(i.netPay),
        allowances: Number(i.allowances),
        bonus: Number(i.bonus),
        loanDeduction: Number(i.loanDeduction),
        overtimePay: Number(i.overtimePay),
        employeeName: `${i.employee.firstName} ${i.employee.lastName}`,
        employeeCode: i.employee.employeeCode,
      })),
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.payrollRun.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Payroll run not found" }, { status: 404 });

  if (existing.status === "PAID") {
    return NextResponse.json({ error: "Cannot delete a paid payroll run" }, { status: 400 });
  }

  await db.payrollItem.deleteMany({ where: { payrollRunId: id } });
  await db.payrollRun.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
