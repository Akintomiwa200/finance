import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const creditNote = await db.creditNote.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      invoice: { select: { invoiceNumber: true } },
      customer: { select: { name: true } },
    },
  });
  if (!creditNote) return NextResponse.json({ error: "Credit note not found" }, { status: 404 });

  return NextResponse.json({
    creditNote: {
      ...creditNote,
      subtotal: Number(creditNote.subtotal),
      taxAmount: Number(creditNote.taxAmount),
      totalAmount: Number(creditNote.totalAmount),
      remainingAmount: Number(creditNote.remainingAmount),
      taxRate: creditNote.taxRate ? Number(creditNote.taxRate) : null,
      invoiceNumber: creditNote.invoice?.invoiceNumber || null,
      customerName: creditNote.customer.name,
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
  const existing = await db.creditNote.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Credit note not found" }, { status: 404 });

  if (body.status) {
    const currentStatus = existing.status;
    const newStatus = body.status.toUpperCase();
    if (currentStatus === "APPLIED" || currentStatus === "CANCELLED") {
      return NextResponse.json({ error: `Cannot modify a ${currentStatus.toLowerCase()} credit note` }, { status: 400 });
    }
    body._newStatus = newStatus;
  }

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body._newStatus;
  if (body.subtotal !== undefined) data.subtotal = body.subtotal;
  if (body.taxRate !== undefined) data.taxRate = body.taxRate || null;
  if (body.taxAmount !== undefined) data.taxAmount = body.taxAmount || 0;
  if (body.totalAmount !== undefined) data.totalAmount = body.totalAmount;
  if (body.remainingAmount !== undefined) data.remainingAmount = body.remainingAmount;
  if (body.reason !== undefined) data.reason = (body.reason || "OTHER").toUpperCase();
  if (body.reasonDescription !== undefined) data.reasonDescription = body.reasonDescription || null;
  if (body.issueDate !== undefined) data.issueDate = new Date(body.issueDate);
  if (body.expiryDate !== undefined) data.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
  if (body.notes !== undefined) data.notes = body.notes || null;

  if (body._newStatus === "APPROVED" || body._newStatus === "ISSUED") {
    data.approvedBy = session.user.name || session.user.email || "system";
    data.approvedAt = new Date();
  }

  const creditNote = await db.creditNote.update({
    where: { id },
    data,
    include: {
      invoice: { select: { invoiceNumber: true } },
      customer: { select: { name: true } },
    },
  });

  return NextResponse.json({
    creditNote: {
      ...creditNote,
      subtotal: Number(creditNote.subtotal),
      taxAmount: Number(creditNote.taxAmount),
      totalAmount: Number(creditNote.totalAmount),
      remainingAmount: Number(creditNote.remainingAmount),
      taxRate: creditNote.taxRate ? Number(creditNote.taxRate) : null,
      invoiceNumber: creditNote.invoice?.invoiceNumber || null,
      customerName: creditNote.customer.name,
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.creditNote.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Credit note not found" }, { status: 404 });
  if (existing.status !== "DRAFT" && existing.status !== "CANCELLED") {
    return NextResponse.json({ error: "Only draft or cancelled credit notes can be deleted" }, { status: 400 });
  }

  await db.creditNote.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
