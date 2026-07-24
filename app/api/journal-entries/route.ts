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
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const where: Prisma.JournalEntryWhereInput = {
    organizationId: session.user.organizationId,
  };

  if (search) {
    where.OR = [
      { entryNumber: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status) where.status = status.toUpperCase() as Prisma.EnumJournalStatusFilter["equals"];
  if (type) where.type = type.toUpperCase() as Prisma.EnumJournalTypeFilter["equals"];
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from);
    if (to) where.date.lte = new Date(to);
  }

  const orderBy: Prisma.JournalEntryOrderByWithRelationInput = { date: "desc" };

  const [entries, total] = await Promise.all([
    db.journalEntry.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        lines: {
          include: { account: { select: { id: true, accountCode: true, name: true } } },
        },
      },
    }),
    db.journalEntry.count({ where }),
  ]);

  return NextResponse.json({ entries, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();

  const totalDebit = body.lines.reduce((sum: number, l: { debit: number }) => sum + (l.debit || 0), 0);
  const totalCredit = body.lines.reduce((sum: number, l: { credit: number }) => sum + (l.credit || 0), 0);

  if (Math.abs(totalDebit - totalCredit) > 0.01) {
    return NextResponse.json(
      { error: "Debits must equal credits" },
      { status: 400 }
    );
  }

  const count = await db.journalEntry.count({
    where: { organizationId: session.user.organizationId },
  });
  const entryNumber = `JE-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;

  const entry = await db.journalEntry.create({
    data: {
      entryNumber,
      date: new Date(body.date || new Date()),
      type: (body.type || "general").toUpperCase(),
      status: (body.status || "draft").toUpperCase(),
      description: body.description || null,
      reference: body.reference || null,
      totalDebit,
      totalCredit,
      createdBy: session.user.name || session.user.email || "System",
      organizationId: session.user.organizationId,
      lines: {
        create: body.lines.map((line: {
          accountId: string;
          description?: string;
          debit?: number;
          credit?: number;
        }) => ({
          accountId: line.accountId,
          description: line.description || null,
          debit: line.debit || 0,
          credit: line.credit || 0,
        })),
      },
    },
    include: {
      lines: {
        include: { account: { select: { id: true, accountCode: true, name: true } } },
      },
    },
  });

  return NextResponse.json({ entry }, { status: 201 });
}
