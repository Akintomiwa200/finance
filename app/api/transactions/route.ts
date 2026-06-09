import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { Prisma } from "@/generated/prisma/client";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const sort = searchParams.get("sort") || "date";
  const order = searchParams.get("order") || "desc";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const where: Prisma.TransactionWhereInput = {
    organizationId: session.user.organizationId,
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { account: { contains: search, mode: "insensitive" } },
      { merchant: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) where.category = { equals: category, mode: "insensitive" };
  if (status) where.status = status.toUpperCase() as any;
  if (type) where.type = type.toUpperCase() as any;
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const orderBy: Prisma.TransactionOrderByWithRelationInput =
    sort === "amount" ? { amount: order as "asc" | "desc" } : { date: order as "asc" | "desc" };

  const [transactions, total] = await Promise.all([
    db.transaction.findMany({ where, orderBy, skip, take: limit }),
    db.transaction.count({ where }),
  ]);

  return NextResponse.json({ transactions, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const transaction = await db.transaction.create({
    data: {
      title: body.title,
      description: body.description || null,
      amount: body.amount,
      type: body.type.toUpperCase(),
      category: body.category,
      status: (body.status || "completed").toUpperCase(),
      date: new Date(body.date || new Date()),
      account: body.account || null,
      merchant: body.merchant || null,
      reference: body.reference || null,
      notes: body.notes || null,
      receipt: body.receipt || null,
      organizationId: session.user.organizationId,
    },
  });

  return NextResponse.json({ transaction }, { status: 201 });
}
