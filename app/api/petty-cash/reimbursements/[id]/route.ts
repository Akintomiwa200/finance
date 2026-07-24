import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const reimbursement = await db.pettyCashReimbursement.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { request: { select: { requestNumber: true } } },
  });

  if (!reimbursement) {
    return NextResponse.json({ error: "Reimbursement not found" }, { status: 404 });
  }

  return NextResponse.json({ reimbursement });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await db.pettyCashReimbursement.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Reimbursement not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (body.amount !== undefined) data.amount = Number(body.amount);
  if (body.status !== undefined) data.status = body.status.toUpperCase();
  if (body.description !== undefined) data.description = body.description;
  if (body.category !== undefined) data.category = body.category;
  if (body.rejectionReason !== undefined) data.rejectionReason = body.rejectionReason;
  if (body.employeeName !== undefined) data.employeeName = body.employeeName;
  if (body.employeeEmail !== undefined) data.employeeEmail = body.employeeEmail;
  if (body.departmentName !== undefined) data.departmentName = body.departmentName;

  if (body.status === "APPROVED") {
    data.approvedAt = new Date().toISOString();
    if (!existing.approvedBy) data.approvedBy = "System";
  }
  if (body.status === "PAID") {
    data.paidAt = new Date().toISOString();
  }

  const reimbursement = await db.pettyCashReimbursement.update({
    where: { id },
    data,
    include: { request: { select: { requestNumber: true } } },
  });

  return NextResponse.json({ reimbursement });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.pettyCashReimbursement.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Reimbursement not found" }, { status: 404 });
  }

  await db.pettyCashReimbursement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
