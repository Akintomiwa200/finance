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
  const status = searchParams.get("status") || "";
  const year = searchParams.get("year") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = { organizationId };
  if (status) where.status = status.toUpperCase();
  if (year) where.fiscalYear = parseInt(year);

  const [budgets, total] = await Promise.all([
    db.budget.findMany({
      where,
      include: {
        department: { select: { name: true, code: true } },
        lineItems: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.budget.count({ where }),
  ]);

  const mapped = budgets.map((b) => ({
    ...b,
    totalAmount: Number(b.totalAmount),
    spentAmount: Number(b.spentAmount),
    departmentName: b.department?.name || null,
    departmentCode: b.department?.code || null,
    lineItems: b.lineItems.map((li) => ({
      ...li,
      allocated: Number(li.allocated),
      spent: Number(li.spent),
    })),
  }));

  return NextResponse.json({ budgets: mapped, total, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const organizationId = session.user.organizationId;
  const body = await req.json();

  const budget = await db.$transaction(async (tx) => {
    const created = await tx.budget.create({
      data: {
        fiscalYear: body.fiscalYear,
        totalAmount: body.totalAmount || 0,
        spentAmount: 0,
        status: (body.status || "ACTIVE").toUpperCase(),
        departmentId: body.departmentId || null,
        organizationId,
      },
    });

    if (body.lineItems && body.lineItems.length > 0) {
      await tx.budgetLineItem.createMany({
        data: body.lineItems.map((item: Record<string, unknown>) => ({
          category: item.category as string,
          description: (item.description as string) || null,
          allocated: Number(item.allocated) || 0,
          spent: 0,
          budgetId: created.id,
        })),
      });
    }

    return tx.budget.findUnique({
      where: { id: created.id },
      include: {
        department: { select: { name: true, code: true } },
        lineItems: true,
      },
    });
  });

  return NextResponse.json({
    budget: {
      ...budget!,
      totalAmount: Number(budget!.totalAmount),
      spentAmount: Number(budget!.spentAmount),
      departmentName: budget!.department?.name || null,
      departmentCode: budget!.department?.code || null,
      lineItems: budget!.lineItems.map((li) => ({
        ...li,
        allocated: Number(li.allocated),
        spent: Number(li.spent),
      })),
    },
  }, { status: 201 });
}
