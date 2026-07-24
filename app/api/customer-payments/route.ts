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
  const method = searchParams.get("method") || "";
  const customerId = searchParams.get("customerId") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { paymentNumber: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
      { invoice: { invoiceNumber: { contains: search, mode: "insensitive" } } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (method) where.paymentMethod = method.toUpperCase();
  if (customerId) where.customerId = customerId;

  const [payments, total] = await Promise.all([
    db.customerPayment.findMany({
      where,
      include: {
        invoice: { select: { invoiceNumber: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.customerPayment.count({ where }),
  ]);

  const mapped = payments.map((p) => ({
    ...p,
    amount: Number(p.amount),
    invoiceNumber: p.invoice?.invoiceNumber || null,
    customerName: p.customer.name,
  }));

  return NextResponse.json({ payments: mapped, total, page, limit });
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
  const lastPayment = await db.customerPayment.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { paymentNumber: true },
  });
  let nextNumber = `PAY-${year}-0001`;
  if (lastPayment?.paymentNumber) {
    const parts = lastPayment.paymentNumber.split("-");
    const lastNum = parseInt(parts[parts.length - 1]) + 1;
    nextNumber = `PAY-${year}-${String(lastNum).padStart(4, "0")}`;
  }

  const customer = await db.customer.findFirst({
    where: { id: body.customerId, organizationId },
  });
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  if (body.invoiceId) {
    const invoice = await db.salesInvoice.findFirst({
      where: { id: body.invoiceId, organizationId },
    });
    if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    if (Number(invoice.balanceDue) <= 0) {
      return NextResponse.json({ error: "Invoice is already fully paid" }, { status: 400 });
    }
    if (body.amount > Number(invoice.balanceDue)) {
      return NextResponse.json({ error: "Payment amount exceeds balance due" }, { status: 400 });
    }
  }

  const payment = await db.customerPayment.create({
    data: {
      paymentNumber: nextNumber,
      amount: body.amount,
      paymentDate: new Date(body.paymentDate),
      paymentMethod: (body.paymentMethod || "bank_transfer").toUpperCase(),
      status: "PENDING",
      reference: body.reference || null,
      notes: body.notes || null,
      bankName: body.bankName || null,
      bankAccountNumber: body.bankAccountNumber || null,
      chequeNumber: body.chequeNumber || null,
      cardLast4: body.cardLast4 || null,
      onlineReference: body.onlineReference || null,
      customerId: body.customerId,
      invoiceId: body.invoiceId || null,
      organizationId,
    },
    include: {
      invoice: { select: { invoiceNumber: true } },
      customer: { select: { name: true } },
    },
  });

  return NextResponse.json({
    payment: {
      ...payment,
      amount: Number(payment.amount),
      invoiceNumber: payment.invoice?.invoiceNumber || null,
      customerName: payment.customer.name,
    },
  }, { status: 201 });
}
