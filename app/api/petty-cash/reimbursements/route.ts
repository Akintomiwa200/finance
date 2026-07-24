import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  const where: Record<string, unknown> = {
    organizationId: session.user.organizationId,
  };

  if (status) where.status = status.toUpperCase();
  if (search) {
    where.OR = [
      { employeeName: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  const reimbursements = await db.pettyCashReimbursement.findMany({
    where,
    include: { request: { select: { requestNumber: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reimbursements });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const reimbursement = await db.pettyCashReimbursement.create({
    data: {
      amount: Number(body.amount) || 0,
      status: "PENDING",
      description: body.description || null,
      category: body.category || null,
      submittedAt: new Date().toISOString(),
      employeeName: body.employeeName || null,
      employeeEmail: body.employeeEmail || null,
      departmentName: body.departmentName || null,
      requestId: body.requestId || null,
      organizationId: session.user.organizationId,
    },
    include: { request: { select: { requestNumber: true } } },
  });

  return NextResponse.json({ reimbursement }, { status: 201 });
}
