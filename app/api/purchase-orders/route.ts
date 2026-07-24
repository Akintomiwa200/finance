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
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const vendorId = searchParams.get("vendorId") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { poNumber: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
      { vendor: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (vendorId) where.vendorId = vendorId;

  const [orders, total] = await Promise.all([
    db.purchaseOrder.findMany({
      where,
      include: { lines: true, vendor: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.purchaseOrder.count({ where }),
  ]);

  const mapped = orders.map((o) => ({
    ...o,
    vendorName: o.vendor.name,
    subtotal: Number(o.subtotal),
    taxAmount: Number(o.taxAmount),
    totalAmount: Number(o.totalAmount),
    taxRate: o.taxRate ? Number(o.taxRate) : null,
    lines: o.lines.map((l) => ({
      ...l,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      receivedQuantity: Number(l.receivedQuantity),
      amount: Number(l.amount),
    })),
  }));

  return NextResponse.json({ orders: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const lastPO = await db.purchaseOrder.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { poNumber: true },
  });
  let nextNumber = "PO-0001";
  if (lastPO?.poNumber) {
    const num = parseInt(lastPO.poNumber.replace("PO-", "")) + 1;
    nextNumber = `PO-${String(num).padStart(4, "0")}`;
  }

  const vendor = await db.vendor.findFirst({
    where: { id: body.vendorId, organizationId },
  });
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const subtotal = body.lines.reduce((s: number, l: { amount: number }) => s + l.amount, 0);
  const taxAmount = body.taxRate ? subtotal * (body.taxRate / 100) : 0;
  const totalAmount = subtotal + taxAmount;

  const order = await db.purchaseOrder.create({
    data: {
      poNumber: nextNumber,
      status: "DRAFT",
      priority: (body.priority || "medium").toUpperCase(),
      orderDate: new Date(body.orderDate),
      expectedDeliveryDate: new Date(body.expectedDeliveryDate),
      deliveryMethod: (body.deliveryMethod || "delivery").toUpperCase(),
      deliveryAddress: body.deliveryAddress || null,
      deliveryNotes: body.deliveryNotes || null,
      subtotal,
      taxRate: body.taxRate || null,
      taxAmount,
      totalAmount,
      notes: body.notes || null,
      vendorId: body.vendorId,
      organizationId,
      lines: {
        create: body.lines.map((l: { description: string; quantity: number; unitPrice: number; amount: number; accountCode?: string; accountName?: string }) => ({
          description: l.description,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          amount: l.amount,
          accountCode: l.accountCode || null,
          accountName: l.accountName || null,
        })),
      },
    },
    include: { lines: true },
  });

  return NextResponse.json({ order }, { status: 201 });
}
