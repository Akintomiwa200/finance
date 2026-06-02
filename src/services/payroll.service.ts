import { db } from "@/src/lib/db";

export async function getPayrollRuns(organizationId: string) {
  return db.payrollRun.findMany({
    where: { organizationId },
    include: {
      items: {
        include: { employee: { select: { firstName: true, lastName: true, employeeCode: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPayrollRunById(id: string) {
  return db.payrollRun.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          employee: {
            include: { department: true },
          },
        },
      },
    },
  });
}

export async function createPayrollRun(data: {
  periodStart: Date;
  periodEnd: Date;
  organizationId: string;
  processedBy: string;
  employeeIds: string[];
}) {
  const employees = await db.employee.findMany({
    where: {
      id: { in: data.employeeIds },
      isActive: true,
    },
  });

  const payrollRun = await db.payrollRun.create({
    data: {
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      organizationId: data.organizationId,
      processedBy: data.processedBy,
      status: "DRAFT",
      items: {
        create: employees.map((emp) => ({
          employeeId: emp.id,
          grossPay: emp.baseSalary?.toNumber() ?? 0,
          deductions: 0,
          taxAmount: 0,
          allowances: 0,
          bonus: 0,
          loanDeduction: 0,
          overtimePay: 0,
          netPay: emp.baseSalary?.toNumber() ?? 0,
        })),
      },
    },
    include: { items: true },
  });

  return payrollRun;
}

export async function computePayrollRun(id: string) {
  const run = await db.payrollRun.findUnique({
    where: { id },
    include: { items: { include: { employee: true } } },
  });

  if (!run) throw new Error("Payroll run not found");

  const taxBrackets = [
    { threshold: 300000, rate: 0.01 },
    { threshold: 300000, rate: 0.025 },
    { threshold: 500000, rate: 0.05 },
    { threshold: 500000, rate: 0.075 },
    { threshold: 1600000, rate: 0.1 },
    { threshold: Infinity, rate: 0.15 },
  ];

  let totalAmount = 0;

  for (const item of run.items) {
    const grossPay = Number(item.grossPay) + Number(item.allowances) + Number(item.bonus) + Number(item.overtimePay);
    let remaining = grossPay;
    let taxAmount = 0;

    for (const bracket of taxBrackets) {
      if (remaining <= 0) break;
      const taxable = Math.min(remaining, bracket.threshold);
      taxAmount += taxable * bracket.rate;
      remaining -= taxable;
    }

    const pensionDeduction = Number(item.grossPay) * 0.08;
    const totalDeductions = taxAmount + pensionDeduction + Number(item.loanDeduction);
    const netPay = grossPay - totalDeductions;

    await db.payrollItem.update({
      where: { id: item.id },
      data: {
        taxAmount,
        deductions: totalDeductions,
        netPay,
      },
    });

    totalAmount += netPay;
  }

  return db.payrollRun.update({
    where: { id },
    data: { totalAmount, status: "COMPUTED" },
    include: { items: true },
  });
}

export async function approvePayrollRun(id: string) {
  return db.payrollRun.update({
    where: { id },
    data: { status: "APPROVED" },
  });
}

export async function processPayrollRun(id: string) {
  return db.payrollRun.update({
    where: { id },
    data: {
      status: "PAID",
      processedAt: new Date(),
    },
  });
}

export async function getPayslipData(employeeId: string, payrollRunId: string) {
  const item = await db.payrollItem.findFirst({
    where: {
      employeeId,
      payrollRunId,
    },
    include: {
      employee: { include: { department: true } },
      payrollRun: true,
    },
  });

  if (!item) return null;

  return {
    employeeName: `${item.employee.firstName} ${item.employee.lastName}`,
    employeeCode: item.employee.employeeCode,
    department: item.employee.department.name,
    periodStart: item.payrollRun.periodStart.toISOString(),
    periodEnd: item.payrollRun.periodEnd.toISOString(),
    earnings: {
      basic: Number(item.grossPay),
      allowances: Number(item.allowances),
      bonus: Number(item.bonus),
      overtime: Number(item.overtimePay),
      totalEarnings: Number(item.grossPay) + Number(item.allowances) + Number(item.bonus) + Number(item.overtimePay),
    },
    deductions: {
      tax: Number(item.taxAmount),
      pension: Number(item.grossPay) * 0.08,
      loan: Number(item.loanDeduction),
      other: 0,
      totalDeductions: Number(item.deductions),
    },
    netPay: Number(item.netPay),
  };
}
