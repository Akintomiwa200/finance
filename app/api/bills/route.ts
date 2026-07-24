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
      { billNumber: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { vendor: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (vendorId) where.vendorId = vendorId;

  const [bills, total] = await Promise.all([
    db.vendorBill.findMany({
      where,
      include: { lines: true, vendor: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.vendorBill.count({ where }),
  ]);

  const mapped = bills.map((b) => ({
    ...b,
    vendorName: b.vendor.name,
    subtotal: Number(b.subtotal),
    taxAmount: Number(b.taxAmount),
    discountAmount: Number(b.discountAmount),
    totalAmount: Number(b.totalAmount),
    amountPaid: Number(b.amountPaid),
    balanceDue: Number(b.balanceDue),
    taxRate: b.taxRate ? Number(b.taxRate) : null,
    discountRate: b.discountRate ? Number(b.discountRate) : null,
    lines: b.lines.map((l) => ({
      ...l,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      amount: Number(l.amount),
    })),
  }));

  return NextResponse.json({ bills: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const lastBill = await db.vendorBill.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { billNumber: true },
  });
  let nextNumber = "BILL-0001";
  if (lastBill?.billNumber) {
    const num = parseInt(lastBill.billNumber.replace("BILL-", "")) + 1;
    nextNumber = `BILL-${String(num).padStart(4, "0")}`;
  }

  const vendor = await db.vendor.findFirst({
    where: { id: body.vendorId, organizationId },
  });
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const subtotal = body.lines.reduce((s: number, l: { amount: number }) => s + l.amount, 0);
  const taxAmount = body.taxRate ? subtotal * (body.taxRate / 100) : 0;
  const discountAmount = body.discountRate ? subtotal * (body.discountRate / 100) : 0;
  const totalAmount = subtotal + taxAmount - discountAmount;

  const bill = await db.vendorBill.create({
    data: {
      billNumber: nextNumber,
      type: (body.type || "purchase").toUpperCase(),
      status: "DRAFT",
      issueDate: new Date(body.issueDate),
      dueDate: new Date(body.dueDate),
      description: body.description || null,
      subtotal,
      taxRate: body.taxRate || null,
      taxAmount,
      discountRate: body.discountRate || null,
      discountAmount,
      totalAmount,
      balanceDue: totalAmount,
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

  return NextResponse.json({ bill }, { status: 201 });
}
