import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const payment = await db.billPayment.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { bill: { select: { billNumber: true, vendor: { select: { name: true } } } } },
  });
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  return NextResponse.json({
    payment: {
      ...payment,
      amount: Number(payment.amount),
      billNumber: payment.bill.billNumber,
      vendorName: payment.bill.vendor.name,
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
  const existing = await db.billPayment.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  if (body.status) {
    const newStatus = body.status.toUpperCase();
    if (existing.status === "COMPLETED" || existing.status === "CANCELLED" || existing.status === "FAILED") {
      return NextResponse.json({ error: `Cannot modify a ${existing.status.toLowerCase()} payment` }, { status: 400 });
    }
    body._newStatus = newStatus;
  }

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body._newStatus;
  if (body.notes !== undefined) data.notes = body.notes || null;
  if (body.reference !== undefined) data.reference = body.reference || null;

  if (body._newStatus === "PROCESSING") {
    data.processedBy = session.user.name || session.user.email || "system";
    data.processedAt = new Date();
  }
  if (body._newStatus === "COMPLETED") {
    data.confirmedBy = session.user.name || session.user.email || "system";
    data.confirmedAt = new Date();
  }

  const payment = await db.billPayment.update({
    where: { id },
    data,
    include: { bill: { select: { billNumber: true, vendor: { select: { name: true } } } } },
  });

  if (body._newStatus === "COMPLETED") {
    const bill = await db.vendorBill.findFirst({ where: { id: payment.billId } });
    if (bill) {
      const newAmountPaid = Number(bill.amountPaid) + Number(existing.amount);
      const newBalanceDue = Number(bill.totalAmount) - newAmountPaid;
      await db.vendorBill.update({
        where: { id: payment.billId },
        data: {
          amountPaid: newAmountPaid,
          balanceDue: Math.max(0, newBalanceDue),
          status: newBalanceDue <= 0 ? "PAID" : bill.status,
        },
      });
    }
  }

  if (body._newStatus === "CANCELLED" || body._newStatus === "FAILED") {
    const bill = await db.vendorBill.findFirst({ where: { id: payment.billId } });
    if (bill && existing.status === "PENDING") {
      const newAmountPaid = Math.max(0, Number(bill.amountPaid));
      const newBalanceDue = Number(bill.totalAmount) - newAmountPaid;
      await db.vendorBill.update({
        where: { id: payment.billId },
        data: {
          amountPaid: newAmountPaid,
          balanceDue: newBalanceDue,
          status: newBalanceDue > 0 && bill.status === "PAID" ? "APPROVED" : bill.status,
        },
      });
    }
  }

  return NextResponse.json({
    payment: {
      ...payment,
      amount: Number(payment.amount),
      billNumber: payment.bill.billNumber,
      vendorName: payment.bill.vendor.name,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.billPayment.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending payments can be deleted" }, { status: 400 });
  }

  await db.billPayment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
