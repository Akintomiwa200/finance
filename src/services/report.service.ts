import { db } from "@/src/lib/db";

export async function getDashboardSummary(organizationId: string, fiscalYear?: number) {
  const year = fiscalYear ?? new Date().getFullYear();

  const [employeeCount, payrollRuns, expenseReports, budgets, invoices] =
    await Promise.all([
      db.employee.count({ where: { organizationId, isActive: true } }),
      db.payrollRun.findMany({
        where: { organizationId, status: "PAID" },
        orderBy: { createdAt: "desc" },
        take: 1,
      }),
      db.expenseReport.aggregate({
        where: { employee: { organizationId } },
        _sum: { totalAmount: true },
      }),
      db.budget.aggregate({
        where: { organizationId, fiscalYear: year },
        _sum: { totalAmount: true, spentAmount: true },
      }),
      db.customerInvoice.findMany({
        where: { organizationId, status: "OVERDUE" },
        select: { totalAmount: true },
      }),
    ]);

  const overdueAmount = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const totalExpenses = Number(expenseReports._sum.totalAmount ?? 0);
  const totalBudget = Number(budgets._sum.totalAmount ?? 0);
  const totalSpent = Number(budgets._sum.spentAmount ?? 0);

  return {
    employeeCount,
    lastPayrollTotal: payrollRuns[0] ? Number(payrollRuns[0].totalAmount) : 0,
    totalExpenses,
    totalBudget,
    totalSpent,
    budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
    overdueInvoices: overdueAmount,
  };
}

export async function getMonthlyPayrollSummary(organizationId: string, year: number) {
  const runs = await db.payrollRun.findMany({
    where: {
      organizationId,
      periodStart: { gte: new Date(`${year}-01-01`) },
      periodEnd: { lte: new Date(`${year}-12-31`) },
      status: "PAID",
    },
    include: { items: true },
  });

  const monthlyData = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    totalGross: 0,
    totalDeductions: 0,
    totalNet: 0,
    employeeCount: 0,
  }));

  for (const run of runs) {
    const month = new Date(run.periodStart).getMonth();
    for (const item of run.items) {
      monthlyData[month].totalGross += Number(item.grossPay);
      monthlyData[month].totalDeductions += Number(item.deductions);
      monthlyData[month].totalNet += Number(item.netPay);
    }
    monthlyData[month].employeeCount += run.items.length;
  }

  return monthlyData;
}

export async function getDepartmentExpenseSummary(
  organizationId: string,
  fiscalYear: number
) {
  const departments = await db.department.findMany({
    where: { organizationId },
    include: {
      budgets: { where: { fiscalYear } },
      employees: {
        include: {
          expenseReports: {
            where: { status: "APPROVED" },
            select: { totalAmount: true },
          },
        },
      },
    },
  });

  return departments.map((dept) => {
    const budgetTotal = dept.budgets.reduce((sum, b) => sum + Number(b.totalAmount), 0);
    const expenseTotal = dept.employees.reduce(
      (sum, emp) =>
        sum + emp.expenseReports.reduce((s, e) => s + Number(e.totalAmount), 0),
      0
    );

    return {
      department: dept.name,
      budget: budgetTotal,
      expenses: expenseTotal,
      variance: budgetTotal - expenseTotal,
      utilization: budgetTotal > 0 ? (expenseTotal / budgetTotal) * 100 : 0,
    };
  });
}
