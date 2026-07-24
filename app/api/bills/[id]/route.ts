import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const bill = await db.vendorBill.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { lines: true, vendor: { select: { name: true } } },
  });
  if (!bill) return NextResponse.json({ error: "Bill not found" }, { status: 404 });

  const mapped = {
    ...bill,
    vendorName: bill.vendor.name,
    subtotal: Number(bill.subtotal),
    taxAmount: Number(bill.taxAmount),
    discountAmount: Number(bill.discountAmount),
    totalAmount: Number(bill.totalAmount),
    amountPaid: Number(bill.amountPaid),
    balanceDue: Number(bill.balanceDue),
    taxRate: bill.taxRate ? Number(bill.taxRate) : null,
    discountRate: bill.discountRate ? Number(bill.discountRate) : null,
    lines: bill.lines.map((l) => ({
      ...l,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      amount: Number(l.amount),
    })),
  };

  return NextResponse.json({ bill: mapped });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.vendorBill.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Bill not found" }, { status: 404 });

  if (body.status) {
    const currentStatus = existing.status;
    const newStatus = body.status.toUpperCase();
    if (currentStatus === "PAID" || currentStatus === "CANCELLED") {
      return NextResponse.json({ error: `Cannot modify a ${currentStatus.toLowerCase()} bill` }, { status: 400 });
    }
    body._newStatus = newStatus;
  }

  if (body.lines) {
    await db.billLineItem.deleteMany({ where: { billId: id } });
  }

  const data: Record<string, unknown> = {};
  if (body.type !== undefined) data.type = body.type.toUpperCase();
  if (body.status !== undefined) data.status = body._newStatus;
  if (body.issueDate !== undefined) data.issueDate = new Date(body.issueDate);
  if (body.dueDate !== undefined) data.dueDate = new Date(body.dueDate);
  if (body.description !== undefined) data.description = body.description || null;
  if (body.notes !== undefined) data.notes = body.notes || null;

  if (body.lines) {
    const subtotal = body.lines.reduce((s: number, l: { amount: number }) => s + l.amount, 0);
    const taxRate = body.taxRate ?? existing.taxRate ? Number(body.taxRate ?? existing.taxRate) : null;
    const discountRate = body.discountRate ?? existing.discountRate ? Number(body.discountRate ?? existing.discountRate) : null;
    const taxAmount = taxRate ? subtotal * (taxRate / 100) : 0;
    const discountAmount = discountRate ? subtotal * (discountRate / 100) : 0;
    const totalAmount = subtotal + taxAmount - discountAmount;
    data.subtotal = subtotal;
    data.taxRate = taxRate;
    data.taxAmount = taxAmount;
    data.discountRate = discountRate;
    data.discountAmount = discountAmount;
    data.totalAmount = totalAmount;
    data.balanceDue = totalAmount - Number(existing.amountPaid);
  }

  if (body.status === "APPROVED") {
    data.approvedBy = session.user.name || session.user.email || "system";
    data.approvedAt = new Date();
  }

  const bill = await db.vendorBill.update({
    where: { id },
    data,
    include: {
      lines: body.lines ? true : undefined,
      vendor: { select: { name: true } },
    },
  });

  if (body.lines) {
    await db.billLineItem.createMany({
      data: body.lines.map((l: { description: string; quantity: number; unitPrice: number; amount: number; accountCode?: string; accountName?: string }) => ({
        billId: id,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        amount: l.amount,
        accountCode: l.accountCode || null,
        accountName: l.accountName || null,
      })),
    });
  }

  const result = await db.vendorBill.findFirst({
    where: { id },
    include: { lines: true, vendor: { select: { name: true } } },
  });

  return NextResponse.json({ bill: result });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.vendorBill.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  if (existing.status !== "DRAFT" && existing.status !== "CANCELLED") {
    return NextResponse.json({ error: "Only draft or cancelled bills can be deleted" }, { status: 400 });
  }

  await db.billLineItem.deleteMany({ where: { billId: id } });
  await db.vendorBill.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
