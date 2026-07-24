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
  const type = searchParams.get("type") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = {
    requester: { organizationId },
  };
  if (status) where.status = status.toUpperCase();
  if (type) where.type = { contains: type, mode: "insensitive" };

  const [requests, total] = await Promise.all([
    db.approvalRequest.findMany({
      where,
      include: {
        requester: { select: { firstName: true, lastName: true, email: true } },
        approver: { select: { firstName: true, lastName: true, email: true } },
        steps: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.approvalRequest.count({ where }),
  ]);

  const mapped = requests.map((r) => ({
    ...r,
    requesterName: `${r.requester.firstName} ${r.requester.lastName}`,
    requesterEmail: r.requester.email,
    approverName: r.approver ? `${r.approver.firstName} ${r.approver.lastName}` : null,
    approverEmail: r.approver?.email || null,
  }));

  return NextResponse.json({ approvals: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const approvalRequest = await db.approvalRequest.create({
    data: {
      title: body.title,
      description: body.description || null,
      type: body.type,
      status: "PENDING",
      priority: (body.priority || "NORMAL").toUpperCase(),
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      requesterId: body.requesterId,
      approverId: body.approverId || null,
      comments: body.comments || null,
    },
    include: {
      requester: { select: { firstName: true, lastName: true, email: true } },
      approver: { select: { firstName: true, lastName: true, email: true } },
      steps: true,
    },
  });

  return NextResponse.json({
    approval: {
      ...approvalRequest,
      requesterName: `${approvalRequest.requester.firstName} ${approvalRequest.requester.lastName}`,
      requesterEmail: approvalRequest.requester.email,
      approverName: approvalRequest.approver ? `${approvalRequest.approver.firstName} ${approvalRequest.approver.lastName}` : null,
      approverEmail: approvalRequest.approver?.email || null,
    },
  }, { status: 201 });
}
