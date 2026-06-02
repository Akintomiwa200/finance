import { db } from "@/src/lib/db";

export async function getBudgets(organizationId: string, fiscalYear?: number) {
  const where: Record<string, unknown> = { organizationId };
  if (fiscalYear) where.fiscalYear = fiscalYear;

  return db.budget.findMany({
    where,
    include: {
      lineItems: true,
      department: true,
    },
    orderBy: { fiscalYear: "desc" },
  });
}

export async function getBudgetById(id: string) {
  return db.budget.findUnique({
    where: { id },
    include: { lineItems: true, department: true },
  });
}

export async function createBudget(data: {
  fiscalYear: number;
  departmentId?: string;
  organizationId: string;
  lineItems: { category: string; description?: string; allocated: number }[];
}) {
  const totalAmount = data.lineItems.reduce((sum, item) => sum + item.allocated, 0);

  return db.budget.create({
    data: {
      fiscalYear: data.fiscalYear,
      departmentId: data.departmentId,
      organizationId: data.organizationId,
      totalAmount,
      lineItems: { create: data.lineItems },
    },
    include: { lineItems: true },
  });
}

export async function getBudgetSummary(organizationId: string, fiscalYear?: number) {
  const year = fiscalYear ?? new Date().getFullYear();
  const budgets = await db.budget.findMany({
    where: { organizationId, fiscalYear: year },
  });

  const totalBudget = budgets.reduce((sum, b) => sum + Number(b.totalAmount), 0);
  const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spentAmount), 0);

  return {
    totalBudget,
    totalSpent,
    remaining: totalBudget - totalSpent,
    utilizationPercentage: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
  };
}

export async function closeBudget(id: string) {
  return db.budget.update({
    where: { id },
    data: { status: "CLOSED" },
  });
}
