import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const transaction = await db.transaction.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!transaction) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  return NextResponse.json({
    transaction: { ...transaction, amount: Number(transaction.amount) },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.transaction.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description || null;
  if (body.amount !== undefined) data.amount = body.amount;
  if (body.type !== undefined) data.type = body.type.toUpperCase();
  if (body.category !== undefined) data.category = body.category;
  if (body.status !== undefined) data.status = body.status.toUpperCase();
  if (body.date !== undefined) data.date = new Date(body.date);
  if (body.account !== undefined) data.account = body.account || null;
  if (body.merchant !== undefined) data.merchant = body.merchant || null;
  if (body.reference !== undefined) data.reference = body.reference || null;
  if (body.notes !== undefined) data.notes = body.notes || null;
  if (body.receipt !== undefined) data.receipt = body.receipt || null;
  if (body.employeeId !== undefined) data.employeeId = body.employeeId || null;

  const transaction = await db.transaction.update({
    where: { id },
    data,
  });

  return NextResponse.json({
    transaction: { ...transaction, amount: Number(transaction.amount) },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.transaction.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

  await db.transaction.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
