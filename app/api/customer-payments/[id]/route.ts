import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const payment = await db.customerPayment.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      invoice: { select: { invoiceNumber: true } },
      customer: { select: { name: true } },
    },
  });
  if (!payment) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  return NextResponse.json({
    payment: {
      ...payment,
      amount: Number(payment.amount),
      invoiceNumber: payment.invoice?.invoiceNumber || null,
      customerName: payment.customer.name,
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
  const existing = await db.customerPayment.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Payment not found" }, { status: 404 });

  if (body.status) {
    const newStatus = body.status.toUpperCase();
    if (existing.status === "COMPLETED" || existing.status === "FAILED") {
      return NextResponse.json({ error: `Cannot modify a ${existing.status.toLowerCase()} payment` }, { status: 400 });
    }
    body._newStatus = newStatus;
  }

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body._newStatus;
  if (body.notes !== undefined) data.notes = body.notes || null;
  if (body.reference !== undefined) data.reference = body.reference || null;

  if (body._newStatus === "COMPLETED") {
    data.approvedBy = session.user.name || session.user.email || "system";
    data.approvedAt = new Date();
  }

  const payment = await db.customerPayment.update({
    where: { id },
    data,
    include: {
      invoice: { select: { invoiceNumber: true } },
      customer: { select: { name: true } },
    },
  });

  if (body._newStatus === "COMPLETED" && payment.invoiceId) {
    const invoice = await db.salesInvoice.findFirst({ where: { id: payment.invoiceId } });
    if (invoice) {
      const newAmountPaid = Number(invoice.amountPaid) + Number(existing.amount);
      const newBalanceDue = Number(invoice.totalAmount) - newAmountPaid;
      await db.salesInvoice.update({
        where: { id: payment.invoiceId },
        data: {
          amountPaid: newAmountPaid,
          balanceDue: Math.max(0, newBalanceDue),
          status: newBalanceDue <= 0 ? "PAID" : newBalanceDue < Number(invoice.totalAmount) ? "PARTIALLY_PAID" : invoice.status,
        },
      });
    }
  }

  if (body._newStatus === "REFUNDED" || body._newStatus === "FAILED") {
    if (payment.invoiceId && existing.status === "PENDING") {
      const invoice = await db.salesInvoice.findFirst({ where: { id: payment.invoiceId } });
      if (invoice) {
        const newAmountPaid = Math.max(0, Number(invoice.amountPaid));
        const newBalanceDue = Number(invoice.totalAmount) - newAmountPaid;
        await db.salesInvoice.update({
          where: { id: payment.invoiceId },
          data: {
            amountPaid: newAmountPaid,
            balanceDue: newBalanceDue,
            status: newBalanceDue > 0 && invoice.status === "PAID" ? "PARTIALLY_PAID" : invoice.status,
          },
        });
      }
    }
  }

  return NextResponse.json({
    payment: {
      ...payment,
      amount: Number(payment.amount),
      invoiceNumber: payment.invoice?.invoiceNumber || null,
      customerName: payment.customer.name,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.customerPayment.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  if (existing.status !== "PENDING") {
    return NextResponse.json({ error: "Only pending payments can be deleted" }, { status: 400 });
  }

  await db.customerPayment.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
