import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const approval = await db.approvalRequest.findFirst({
    where: { id, requester: { organizationId: session.user.organizationId } },
    include: {
      requester: { select: { firstName: true, lastName: true, email: true } },
      approver: { select: { firstName: true, lastName: true, email: true } },
      steps: true,
    },
  });
  if (!approval) return NextResponse.json({ error: "Approval request not found" }, { status: 404 });

  return NextResponse.json({
    approval: {
      ...approval,
      requesterName: `${approval.requester.firstName} ${approval.requester.lastName}`,
      requesterEmail: approval.requester.email,
      approverName: approval.approver ? `${approval.approver.firstName} ${approval.approver.lastName}` : null,
      approverEmail: approval.approver?.email || null,
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
  const existing = await db.approvalRequest.findFirst({
    where: { id, requester: { organizationId: session.user.organizationId } },
  });
  if (!existing) return NextResponse.json({ error: "Approval request not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.type !== undefined) data.type = body.type;
  if (body.priority !== undefined) data.priority = body.priority.toUpperCase();
  if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  if (body.comments !== undefined) data.comments = body.comments || null;

  if (body.status) {
    const newStatus = body.status.toUpperCase();
    if (newStatus === "APPROVED") {
      data.status = "APPROVED";
      data.approvedAt = new Date();
      data.approverId = body.approverId || null;
    } else if (newStatus === "REJECTED") {
      data.status = "REJECTED";
      data.comments = body.rejectionReason || body.comments || null;
    } else if (newStatus === "CANCELLED") {
      data.status = "CANCELLED";
    } else {
      data.status = newStatus;
    }
  }

  if (body.approverId !== undefined) data.approverId = body.approverId || null;

  const approval = await db.approvalRequest.update({
    where: { id },
    data,
    include: {
      requester: { select: { firstName: true, lastName: true, email: true } },
      approver: { select: { firstName: true, lastName: true, email: true } },
      steps: true,
    },
  });

  return NextResponse.json({
    approval: {
      ...approval,
      requesterName: `${approval.requester.firstName} ${approval.requester.lastName}`,
      requesterEmail: approval.requester.email,
      approverName: approval.approver ? `${approval.approver.firstName} ${approval.approver.lastName}` : null,
      approverEmail: approval.approver?.email || null,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.approvalRequest.findFirst({
    where: { id, requester: { organizationId: session.user.organizationId } },
  });
  if (!existing) return NextResponse.json({ error: "Approval request not found" }, { status: 404 });

  if (existing.status === "APPROVED") {
    return NextResponse.json({ error: "Cannot delete an approved request" }, { status: 400 });
  }

  await db.approvalStep.deleteMany({ where: { requestId: id } });
  await db.approvalRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
