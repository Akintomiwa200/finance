import { db } from "@/src/lib/db";

export async function getExpenseReports(employeeId?: string) {
  const where = employeeId ? { employeeId } : {};
  return db.expenseReport.findMany({
    where,
    include: {
      items: true,
      employee: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getExpenseReportById(id: string) {
  return db.expenseReport.findUnique({
    where: { id },
    include: {
      items: true,
      employee: true,
    },
  });
}

export async function createExpenseReport(data: {
  title: string;
  description?: string;
  employeeId: string;
  items: { category: string; description: string; amount: number; expenseDate: Date }[];
}) {
  const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0);

  return db.expenseReport.create({
    data: {
      title: data.title,
      description: data.description,
      totalAmount,
      employeeId: data.employeeId,
      status: "DRAFT",
      items: {
        create: data.items,
      },
    },
    include: { items: true },
  });
}

export async function submitExpenseReport(id: string) {
  return db.expenseReport.update({
    where: { id },
    data: { status: "SUBMITTED", submittedAt: new Date() },
  });
}

export async function approveExpenseReport(id: string) {
  return db.expenseReport.update({
    where: { id },
    data: { status: "APPROVED", approvedAt: new Date() },
  });
}

export async function rejectExpenseReport(id: string) {
  return db.expenseReport.update({
    where: { id },
    data: { status: "REJECTED" },
  });
}

export async function reimburseExpenseReport(id: string) {
  return db.expenseReport.update({
    where: { id },
    data: { status: "REIMBURSED" },
  });
}
