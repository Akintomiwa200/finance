export interface PayrollRun {
  id: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number | null;
  status: "DRAFT" | "COMPUTED" | "APPROVED" | "PAID" | "CANCELLED";
  processedAt: string | null;
  processedBy: string | null;
  notes: string | null;
  organizationId: string;
  createdAt: string;
  items?: PayrollItem[];
}

export interface PayrollItem {
  id: string;
  grossPay: number;
  deductions: number;
  taxAmount: number;
  netPay: number;
  allowances: number;
  bonus: number;
  loanDeduction: number;
  overtimePay: number;
  payrollRunId: string;
  employeeId: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    employeeCode: string;
    department?: { name: string };
  };
  createdAt: string;
}

export interface Payslip {
  employeeName: string;
  employeeCode: string;
  department: string;
  periodStart: string;
  periodEnd: string;
  earnings: {
    basic: number;
    allowances: number;
    bonus: number;
    overtime: number;
    totalEarnings: number;
  };
  deductions: {
    tax: number;
    pension: number;
    loan: number;
    other: number;
    totalDeductions: number;
  };
  netPay: number;
}
