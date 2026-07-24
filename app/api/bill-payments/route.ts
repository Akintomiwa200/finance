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
  const billId = searchParams.get("billId") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { paymentNumber: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
      { bill: { billNumber: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (status) where.status = status.toUpperCase();
  if (billId) where.billId = billId;

  const [payments, total] = await Promise.all([
    db.billPayment.findMany({
      where,
      include: { bill: { select: { billNumber: true, vendor: { select: { name: true } } } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.billPayment.count({ where }),
  ]);

  const mapped = payments.map((p) => ({
    ...p,
    amount: Number(p.amount),
    billNumber: p.bill.billNumber,
    vendorName: p.bill.vendor.name,
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

  const lastPayment = await db.billPayment.findFirst({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    select: { paymentNumber: true },
  });
  let nextNumber = "PAY-0001";
  if (lastPayment?.paymentNumber) {
    const num = parseInt(lastPayment.paymentNumber.replace("PAY-", "")) + 1;
    nextNumber = `PAY-${String(num).padStart(4, "0")}`;
  }

  const bill = await db.vendorBill.findFirst({
    where: { id: body.billId, organizationId },
    include: { vendor: { select: { name: true } } },
  });
  if (!bill) return NextResponse.json({ error: "Bill not found" }, { status: 404 });
  if (Number(bill.balanceDue) <= 0) {
    return NextResponse.json({ error: "Bill is already fully paid" }, { status: 400 });
  }
  if (body.amount > Number(bill.balanceDue)) {
    return NextResponse.json({ error: "Payment amount exceeds balance due" }, { status: 400 });
  }

  const payment = await db.billPayment.create({
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
      billId: body.billId,
      organizationId,
    },
    include: { bill: { select: { billNumber: true, vendor: { select: { name: true } } } } },
  });

  return NextResponse.json({ payment: { ...payment, billNumber: payment.bill.billNumber, vendorName: payment.bill.vendor.name } }, { status: 201 });
}
