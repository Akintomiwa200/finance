import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const order = await db.purchaseOrder.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: { lines: true, vendor: { select: { name: true } } },
  });
  if (!order) return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });

  const mapped = {
    ...order,
    vendorName: order.vendor.name,
    subtotal: Number(order.subtotal),
    taxAmount: Number(order.taxAmount),
    totalAmount: Number(order.totalAmount),
    taxRate: order.taxRate ? Number(order.taxRate) : null,
    lines: order.lines.map((l) => ({
      ...l,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      receivedQuantity: Number(l.receivedQuantity),
      amount: Number(l.amount),
    })),
  };

  return NextResponse.json({ order: mapped });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.purchaseOrder.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });

  if (body.status) {
    const newStatus = body.status.toUpperCase();
    const terminal = ["FULLY_RECEIVED", "CANCELLED", "REJECTED"];
    if (terminal.includes(existing.status)) {
      return NextResponse.json({ error: `Cannot modify a ${existing.status.toLowerCase()} order` }, { status: 400 });
    }
    body._newStatus = newStatus;
  }

  if (body.lines) {
    await db.purchaseOrderLineItem.deleteMany({ where: { poId: id } });
  }

  const data: Record<string, unknown> = {};
  if (body.status !== undefined) data.status = body._newStatus;
  if (body.priority !== undefined) data.priority = body.priority.toUpperCase();
  if (body.orderDate !== undefined) data.orderDate = new Date(body.orderDate);
  if (body.expectedDeliveryDate !== undefined) data.expectedDeliveryDate = new Date(body.expectedDeliveryDate);
  if (body.actualDeliveryDate !== undefined) data.actualDeliveryDate = body.actualDeliveryDate ? new Date(body.actualDeliveryDate) : null;
  if (body.deliveryMethod !== undefined) data.deliveryMethod = body.deliveryMethod.toUpperCase();
  if (body.deliveryAddress !== undefined) data.deliveryAddress = body.deliveryAddress || null;
  if (body.deliveryNotes !== undefined) data.deliveryNotes = body.deliveryNotes || null;
  if (body.notes !== undefined) data.notes = body.notes || null;

  if (body.lines) {
    const subtotal = body.lines.reduce((s: number, l: { amount: number }) => s + l.amount, 0);
    const taxRate = body.taxRate !== undefined ? body.taxRate : existing.taxRate ? Number(existing.taxRate) : null;
    const taxAmount = taxRate ? subtotal * (taxRate / 100) : 0;
    const totalAmount = subtotal + taxAmount;
    data.subtotal = subtotal;
    data.taxRate = taxRate;
    data.taxAmount = taxAmount;
    data.totalAmount = totalAmount;
  }

  const statusActions: Record<string, { by: string; at: Date }> = {
    APPROVED: { by: session.user.name || session.user.email || "system", at: new Date() },
    ORDERED: { by: session.user.name || session.user.email || "system", at: new Date() },
    FULLY_RECEIVED: { by: session.user.name || session.user.email || "system", at: new Date() },
  };

  if (body._newStatus && statusActions[body._newStatus]) {
    const action = statusActions[body._newStatus];
    if (body._newStatus === "APPROVED") { data.approvedBy = action.by; data.approvedAt = action.at; }
    if (body._newStatus === "ORDERED") { data.orderedBy = action.by; data.orderedAt = action.at; }
    if (body._newStatus === "FULLY_RECEIVED") { data.receivedBy = action.by; data.receivedAt = action.at; data.actualDeliveryDate = new Date(); }
  }

  await db.purchaseOrder.update({ where: { id }, data });

  if (body.lines) {
    await db.purchaseOrderLineItem.createMany({
      data: body.lines.map((l: { description: string; quantity: number; unitPrice: number; receivedQuantity?: number; amount: number; accountCode?: string; accountName?: string }) => ({
        poId: id,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        receivedQuantity: l.receivedQuantity || 0,
        amount: l.amount,
        accountCode: l.accountCode || null,
        accountName: l.accountName || null,
      })),
    });
  }

  const result = await db.purchaseOrder.findFirst({
    where: { id },
    include: { lines: true, vendor: { select: { name: true } } },
  });

  return NextResponse.json({ order: result });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.purchaseOrder.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
  if (existing.status !== "DRAFT" && existing.status !== "CANCELLED" && existing.status !== "REJECTED") {
    return NextResponse.json({ error: "Only draft, cancelled, or rejected orders can be deleted" }, { status: 400 });
  }

  await db.purchaseOrderLineItem.deleteMany({ where: { poId: id } });
  await db.purchaseOrder.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
