import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const request = await db.pettyCashRequest.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  return NextResponse.json({ request });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const existing = await db.pettyCashRequest.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.amount !== undefined) data.amount = Number(body.amount);
  if (body.category !== undefined) data.category = body.category;
  if (body.priority !== undefined) data.priority = body.priority.toUpperCase();
  if (body.status !== undefined) data.status = body.status.toUpperCase();
  if (body.paymentMethod !== undefined) data.paymentMethod = body.paymentMethod.toUpperCase();
  if (body.expectedDate !== undefined) data.expectedDate = body.expectedDate;
  if (body.employeeName !== undefined) data.employeeName = body.employeeName;
  if (body.employeeEmail !== undefined) data.employeeEmail = body.employeeEmail;
  if (body.departmentName !== undefined) data.departmentName = body.departmentName;
  if (body.position !== undefined) data.position = body.position;
  if (body.notes !== undefined) data.notes = body.notes;
  if (body.rejectionReason !== undefined) data.rejectionReason = body.rejectionReason;

  if (body.status === "APPROVED") {
    data.approvedAt = new Date().toISOString();
    if (!existing.approvedBy) data.approvedBy = "System";
  }
  if (body.status === "DISBURSED") {
    data.disbursedAt = new Date().toISOString();
    if (!existing.disbursedBy) data.disbursedBy = "System";
  }

  const request = await db.pettyCashRequest.update({
    where: { id },
    data,
  });

  return NextResponse.json({ request });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await db.pettyCashRequest.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  await db.pettyCashRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
