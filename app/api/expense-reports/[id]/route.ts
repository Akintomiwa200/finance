import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const report = await db.expenseReport.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      items: true,
      employee: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          department: { select: { name: true } },
        },
      },
    },
  });
  if (!report) return NextResponse.json({ error: "Expense report not found" }, { status: 404 });

  return NextResponse.json({
    expenseReport: {
      ...report,
      totalAmount: Number(report.totalAmount),
      employeeName: report.employeeName || `${report.employee?.firstName ?? ""} ${report.employee?.lastName ?? ""}`.trim(),
      employeeEmail: report.employeeEmail || report.employee?.email || null,
      department: report.department || report.employee?.department?.name || null,
      items: report.items.map((i) => ({
        ...i,
        amount: Number(i.amount),
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
  const existing = await db.expenseReport.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Expense report not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.department !== undefined) data.department = body.department || null;
  if (body.totalAmount !== undefined) data.totalAmount = body.totalAmount;
  if (body.notes !== undefined) data.notes = body.notes || null;
  if (body.receiptUrl !== undefined) data.receiptUrl = body.receiptUrl || null;
  if (body.employeeId !== undefined) data.employeeId = body.employeeId || null;
  if (body.employeeName !== undefined) data.employeeName = body.employeeName || null;
  if (body.employeeEmail !== undefined) data.employeeEmail = body.employeeEmail || null;

  if (body.status) {
    const newStatus = body.status.toUpperCase();
    if (newStatus === "SUBMITTED") {
      data.status = "SUBMITTED";
      data.submittedAt = new Date();
    } else if (newStatus === "APPROVED") {
      data.status = "APPROVED";
      data.approvedAt = new Date();
      data.approvedBy = session.user.name || session.user.email || "system";
    } else if (newStatus === "REJECTED") {
      data.status = "REJECTED";
      data.rejectedReason = body.rejectedReason || null;
    } else if (newStatus === "REIMBURSED") {
      data.status = "REIMBURSED";
      data.reimbursedAt = new Date();
    } else {
      data.status = newStatus;
    }
  }

  if (body.items && Array.isArray(body.items)) {
    await db.expenseItem.deleteMany({ where: { expenseReportId: id } });
    if (body.items.length > 0) {
      await db.expenseItem.createMany({
        data: body.items.map((item: Record<string, unknown>) => ({
          category: item.category || "OTHER",
          description: item.description || null,
          amount: item.amount || 0,
          receiptUrl: item.receiptUrl || null,
          expenseDate: item.expenseDate ? new Date(item.expenseDate as string) : null,
          paymentMethod: item.paymentMethod || null,
          isReimbursable: item.isReimbursable !== false,
          merchant: item.merchant || null,
          expenseReportId: id,
        })),
      });
    }
    const updatedReport = await db.expenseReport.update({
      where: { id },
      data,
      include: {
        items: true,
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            department: { select: { name: true } },
          },
        },
      },
    });
    return NextResponse.json({
      expenseReport: {
        ...updatedReport!,
        totalAmount: Number(updatedReport!.totalAmount),
        employeeName: updatedReport!.employeeName || `${updatedReport!.employee?.firstName ?? ""} ${updatedReport!.employee?.lastName ?? ""}`.trim(),
        employeeEmail: updatedReport!.employeeEmail || updatedReport!.employee?.email || null,
        department: updatedReport!.department || updatedReport!.employee?.department?.name || null,
        items: updatedReport!.items.map((i) => ({
          ...i,
          amount: Number(i.amount),
        })),
      },
    });
  }

  const report = await db.expenseReport.update({
    where: { id },
    data,
    include: {
      items: true,
      employee: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          department: { select: { name: true } },
        },
      },
    },
  });

  return NextResponse.json({
    expenseReport: {
      ...report,
      totalAmount: Number(report.totalAmount),
      employeeName: report.employeeName || `${report.employee?.firstName ?? ""} ${report.employee?.lastName ?? ""}`.trim(),
      employeeEmail: report.employeeEmail || report.employee?.email || null,
      department: report.department || report.employee?.department?.name || null,
      items: report.items.map((i) => ({
        ...i,
        amount: Number(i.amount),
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
  const existing = await db.expenseReport.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Expense report not found" }, { status: 404 });

  await db.expenseItem.deleteMany({ where: { expenseReportId: id } });
  await db.expenseReport.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
