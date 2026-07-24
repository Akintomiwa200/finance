import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (status) where.status = status.toUpperCase();

  const [runs, total] = await Promise.all([
    db.payrollRun.findMany({
      where,
      include: {
        items: {
          include: {
            employee: { select: { firstName: true, lastName: true, employeeCode: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.payrollRun.count({ where }),
  ]);

  const mapped = runs.map((r) => ({
    ...r,
    totalAmount: Number(r.totalAmount),
    items: r.items.map((i) => ({
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
  }));

  return NextResponse.json({ payrollRuns: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const run = await db.$transaction(async (tx) => {
    const payrollRun = await tx.payrollRun.create({
      data: {
        periodStart: new Date(body.periodStart),
        periodEnd: new Date(body.periodEnd),
        totalAmount: 0,
        status: "DRAFT",
        notes: body.notes || null,
        processedBy: session.user.name || session.user.email || null,
        organizationId,
      },
    });

    let totalAmount = 0;

    if (body.items && body.items.length > 0) {
      const items = body.items.map((item: Record<string, unknown>) => {
        const grossPay = Number(item.grossPay) || 0;
        const deductions = Number(item.deductions) || 0;
        const taxAmount = Number(item.taxAmount) || 0;
        const allowances = Number(item.allowances) || 0;
        const bonus = Number(item.bonus) || 0;
        const loanDeduction = Number(item.loanDeduction) || 0;
        const overtimePay = Number(item.overtimePay) || 0;
        const netPay = grossPay + allowances + bonus + overtimePay - deductions - taxAmount - loanDeduction;
        totalAmount += grossPay;
        return {
          grossPay,
          deductions,
          taxAmount,
          netPay,
          allowances,
          bonus,
          loanDeduction,
          overtimePay,
          employeeId: item.employeeId as string,
          payrollRunId: payrollRun.id,
        };
      });

      await tx.payrollItem.createMany({ data: items });
    }

    await tx.payrollRun.update({
      where: { id: payrollRun.id },
      data: { totalAmount },
    });

    return tx.payrollRun.findUnique({
      where: { id: payrollRun.id },
      include: {
        items: {
          include: {
            employee: { select: { firstName: true, lastName: true, employeeCode: true } },
          },
        },
      },
    });
  });

  return NextResponse.json({
    payrollRun: {
      ...run!,
      totalAmount: Number(run!.totalAmount),
      items: run!.items.map((i) => ({
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
  }, { status: 201 });
}
