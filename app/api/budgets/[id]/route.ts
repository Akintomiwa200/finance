import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const budget = await db.budget.findFirst({
    where: { id, organizationId: session.user.organizationId },
    include: {
      department: { select: { name: true, code: true } },
      lineItems: true,
    },
  });
  if (!budget) return NextResponse.json({ error: "Budget not found" }, { status: 404 });

  return NextResponse.json({
    budget: {
      ...budget,
      totalAmount: Number(budget.totalAmount),
      spentAmount: Number(budget.spentAmount),
      departmentName: budget.department?.name || null,
      departmentCode: budget.department?.code || null,
      lineItems: budget.lineItems.map((li) => ({
        ...li,
        allocated: Number(li.allocated),
        spent: Number(li.spent),
      })),
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const existing = await db.budget.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Budget not found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (body.fiscalYear !== undefined) data.fiscalYear = body.fiscalYear;
  if (body.totalAmount !== undefined) data.totalAmount = body.totalAmount;
  if (body.spentAmount !== undefined) data.spentAmount = body.spentAmount;
  if (body.status !== undefined) data.status = body.status.toUpperCase();
  if (body.departmentId !== undefined) data.departmentId = body.departmentId || null;

  if (body.lineItems && Array.isArray(body.lineItems)) {
    await db.budgetLineItem.deleteMany({ where: { budgetId: id } });
    if (body.lineItems.length > 0) {
      await db.budgetLineItem.createMany({
        data: body.lineItems.map((item: Record<string, unknown>) => ({
          category: item.category as string,
          description: (item.description as string) || null,
          allocated: Number(item.allocated) || 0,
          spent: Number(item.spent) || 0,
          budgetId: id,
        })),
      });
    }
  }

  const budget = await db.budget.update({
    where: { id },
    data,
    include: {
      department: { select: { name: true, code: true } },
      lineItems: true,
    },
  });

  return NextResponse.json({
    budget: {
      ...budget,
      totalAmount: Number(budget.totalAmount),
      spentAmount: Number(budget.spentAmount),
      departmentName: budget.department?.name || null,
      departmentCode: budget.department?.code || null,
      lineItems: budget.lineItems.map((li) => ({
        ...li,
        allocated: Number(li.allocated),
        spent: Number(li.spent),
      })),
    },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const existing = await db.budget.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!existing) return NextResponse.json({ error: "Budget not found" }, { status: 404 });

  await db.budgetLineItem.deleteMany({ where: { budgetId: id } });
  await db.budget.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
