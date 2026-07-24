import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const invoice = await db.salesInvoice.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { lines: true, customer: { select: { name: true } } },
  });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const mapped = {
    ...invoice,
    customerName: invoice.customer.name,
    subtotal: Number(invoice.subtotal),
    taxAmount: Number(invoice.taxAmount),
    discountAmount: Number(invoice.discountAmount),
    totalAmount: Number(invoice.totalAmount),
    amountPaid: Number(invoice.amountPaid),
    balanceDue: Number(invoice.balanceDue),
    taxRate: invoice.taxRate ? Number(invoice.taxRate) : null,
    discountRate: invoice.discountRate ? Number(invoice.discountRate) : null,
    lines: invoice.lines.map((l) => ({
      ...l,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      amount: Number(l.amount),
    })),
  };

  return NextResponse.json({ invoice: mapped });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.salesInvoice.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  if (body.status) {
    const currentStatus = existing.status;
    const newStatus = body.status.toUpperCase();
    if (currentStatus === "PAID" || currentStatus === "CANCELLED") {
      return NextResponse.json({ error: `Cannot modify a ${currentStatus.toLowerCase()} invoice` }, { status: 400 });
    }
    body._newStatus = newStatus;
  }

  if (body.lines) {
    await db.salesInvoiceLineItem.deleteMany({ where: { invoiceId: id } });
  }

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body._newStatus;
  if (body.invoiceDate !== undefined || body.issueDate !== undefined) data.invoiceDate = new Date(body.invoiceDate || body.issueDate);
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

  const invoice = await db.salesInvoice.update({
    where: { id },
    data,
    include: {
      lines: body.lines ? true : undefined,
      customer: { select: { name: true } },
    },
  });

  if (body.lines) {
    await db.salesInvoiceLineItem.createMany({
      data: body.lines.map((l: { description: string; quantity: number; unitPrice: number; amount: number; discount?: number; tax?: number; accountCode?: string; accountName?: string }) => ({
        invoiceId: id,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        amount: l.amount,
        discount: l.discount || 0,
        tax: l.tax || 0,
        accountCode: l.accountCode || null,
        accountName: l.accountName || null,
      })),
    });
  }

  const result = await db.salesInvoice.findFirst({
    where: { id },
    include: { lines: true, customer: { select: { name: true } } },
  });

  return NextResponse.json({ invoice: result });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.salesInvoice.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  if (existing.status !== "DRAFT" && existing.status !== "CANCELLED") {
    return NextResponse.json({ error: "Only draft or cancelled invoices can be deleted" }, { status: 400 });
  }

  await db.salesInvoiceLineItem.deleteMany({ where: { invoiceId: id } });
  await db.salesInvoice.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
