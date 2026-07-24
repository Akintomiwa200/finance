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
      { creditNoteNumber: { contains: search, mode: "insensitive" } },
      { reason: { contains: search, mode: "insensitive" } },
      { invoice: { invoiceNumber: { contains: search, mode: "insensitive" } } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (customerId) where.customerId = customerId;

  const [creditNotes, total] = await Promise.all([
    db.creditNote.findMany({
      where,
      include: {
        invoice: { select: { invoiceNumber: true } },
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.creditNote.count({ where }),
  ]);

  const mapped = creditNotes.map((cn) => ({
    ...cn,
    subtotal: Number(cn.subtotal),
    taxAmount: Number(cn.taxAmount),
    totalAmount: Number(cn.totalAmount),
    remainingAmount: Number(cn.remainingAmount),
    taxRate: cn.taxRate ? Number(cn.taxRate) : null,
    invoiceNumber: cn.invoice?.invoiceNumber || null,
    customerName: cn.customer.name,
  }));

  return NextResponse.json({ creditNotes: mapped, total, page, limit });
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
  const lastCN = await db.creditNote.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { creditNoteNumber: true },
  });
  let nextNumber = `CN-${year}-0001`;
  if (lastCN?.creditNoteNumber) {
    const parts = lastCN.creditNoteNumber.split("-");
    const lastNum = parseInt(parts[parts.length - 1]) + 1;
    nextNumber = `CN-${year}-${String(lastNum).padStart(4, "0")}`;
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
  }

  const creditNote = await db.creditNote.create({
    data: {
      creditNoteNumber: nextNumber,
      status: "DRAFT",
      reason: (body.reason || "OTHER").toUpperCase(),
      reasonDescription: body.reasonDescription || null,
      issueDate: new Date(body.issueDate),
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      subtotal: body.subtotal || 0,
      taxRate: body.taxRate || null,
      taxAmount: body.taxAmount || 0,
      totalAmount: body.totalAmount || 0,
      remainingAmount: body.remainingAmount || body.totalAmount || 0,
      notes: body.notes || null,
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
  }, { status: 201 });
}
