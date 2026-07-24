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
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { account: { contains: search, mode: "insensitive" } },
      { merchant: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
    ];
  }
  if (type) where.type = type.toUpperCase();
  if (status) where.status = status.toUpperCase();
  if (category) where.category = { contains: category, mode: "insensitive" };

  const [transactions, total] = await Promise.all([
    db.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.transaction.count({ where }),
  ]);

  const mapped = transactions.map((t) => ({
    ...t,
    amount: Number(t.amount),
  }));

  return NextResponse.json({ transactions: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();

  const transaction = await db.transaction.create({
    data: {
      title: body.title,
      description: body.description || null,
      amount: body.amount,
      type: body.type.toUpperCase(),
      category: body.category,
      status: (body.status || "COMPLETED").toUpperCase(),
      date: new Date(body.date || new Date()),
      account: body.account || null,
      merchant: body.merchant || null,
      reference: body.reference || null,
      notes: body.notes || null,
      receipt: body.receipt || null,
      employeeId: body.employeeId || null,
      organizationId: session.user.organizationId,
    },
  });

  return NextResponse.json({
    transaction: { ...transaction, amount: Number(transaction.amount) },
  }, { status: 201 });
}
