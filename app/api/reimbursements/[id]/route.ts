import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const reimbursement = await db.reimbursement.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      expenseReport: { select: { title: true } },
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
  if (!reimbursement) return NextResponse.json({ error: "Reimbursement not found" }, { status: 404 });

  return NextResponse.json({
    reimbursement: {
      ...reimbursement,
      amount: Number(reimbursement.amount),
      expenseReportTitle: reimbursement.expenseReport?.title || null,
      employeeName: reimbursement.employeeName || `${reimbursement.employee?.firstName ?? ""} ${reimbursement.employee?.lastName ?? ""}`.trim(),
      employeeEmail: reimbursement.employeeEmail || reimbursement.employee?.email || null,
      department: reimbursement.department || reimbursement.employee?.department?.name || null,
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
  const existing = await db.reimbursement.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Reimbursement not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.amount !== undefined) data.amount = body.amount;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.category !== undefined) data.category = body.category || null;
  if (body.paymentMethod !== undefined) data.paymentMethod = body.paymentMethod || null;
  if (body.employeeId !== undefined) data.employeeId = body.employeeId || null;
  if (body.employeeName !== undefined) data.employeeName = body.employeeName || null;
  if (body.employeeEmail !== undefined) data.employeeEmail = body.employeeEmail || null;
  if (body.department !== undefined) data.department = body.department || null;
  if (body.expenseReportId !== undefined) data.expenseReportId = body.expenseReportId || null;

  if (body.status) {
    const newStatus = body.status.toUpperCase();
    if (newStatus === "APPROVED") {
      data.status = "APPROVED";
      data.approvedAt = new Date();
      data.approvedBy = session.user.name || session.user.email || "system";
    } else if (newStatus === "REJECTED") {
      data.status = "REJECTED";
      data.rejectionReason = body.rejectionReason || null;
    } else if (newStatus === "PAID") {
      data.status = "PAID";
      data.paidAt = new Date();
    } else {
      data.status = newStatus;
    }
  }

  const reimbursement = await db.reimbursement.update({
    where: { id },
    data,
    include: {
      expenseReport: { select: { title: true } },
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
    reimbursement: {
      ...reimbursement,
      amount: Number(reimbursement.amount),
      expenseReportTitle: reimbursement.expenseReport?.title || null,
      employeeName: reimbursement.employeeName || `${reimbursement.employee?.firstName ?? ""} ${reimbursement.employee?.lastName ?? ""}`.trim(),
      employeeEmail: reimbursement.employeeEmail || reimbursement.employee?.email || null,
      department: reimbursement.department || reimbursement.employee?.department?.name || null,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.reimbursement.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Reimbursement not found" }, { status: 404 });

  await db.reimbursement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
