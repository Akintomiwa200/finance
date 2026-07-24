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
  const customerId = searchParams.get("customerId") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (customerId) where.customerId = customerId;

  const [invoices, total] = await Promise.all([
    db.salesInvoice.findMany({
      where,
      include: { lines: true, customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.salesInvoice.count({ where }),
  ]);

  const mapped = invoices.map((inv) => ({
    ...inv,
    customerName: inv.customer.name,
    subtotal: Number(inv.subtotal),
    taxAmount: Number(inv.taxAmount),
    discountAmount: Number(inv.discountAmount),
    totalAmount: Number(inv.totalAmount),
    amountPaid: Number(inv.amountPaid),
    balanceDue: Number(inv.balanceDue),
    taxRate: inv.taxRate ? Number(inv.taxRate) : null,
    discountRate: inv.discountRate ? Number(inv.discountRate) : null,
    lines: inv.lines.map((l) => ({
      ...l,
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      amount: Number(l.amount),
    })),
  }));

  return NextResponse.json({ invoices: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const now = new Date();
  const year = now.getFullYear();
  const lastInvoice = await db.salesInvoice.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { invoiceNumber: true },
  });
  let nextNumber = `INV-${year}-0001`;
  if (lastInvoice?.invoiceNumber) {
    const parts = lastInvoice.invoiceNumber.split("-");
    const lastNum = parseInt(parts[parts.length - 1]) + 1;
    nextNumber = `INV-${year}-${String(lastNum).padStart(4, "0")}`;
  }

  const customer = await db.customer.findFirst({
    where: { id: body.customerId, organizationId },
  });
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const subtotal = body.lines.reduce((s: number, l: { amount: number }) => s + l.amount, 0);
  const taxAmount = body.taxRate ? subtotal * (body.taxRate / 100) : 0;
  const discountAmount = body.discountRate ? subtotal * (body.discountRate / 100) : 0;
  const totalAmount = subtotal + taxAmount - discountAmount;

  const invoice = await db.salesInvoice.create({
    data: {
      invoiceNumber: nextNumber,
      status: "DRAFT",
      invoiceDate: new Date(body.invoiceDate || body.issueDate),
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
      customerId: body.customerId,
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
    include: { lines: true, customer: { select: { name: true } } },
  });

  return NextResponse.json({ invoice: { ...invoice, customerName: invoice.customer.name } }, { status: 201 });
}
