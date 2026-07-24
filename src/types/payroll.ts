export type PayrollStatus = "DRAFT" | "PROCESSING" | "COMPLETED" | "CANCELLED";

export interface PayrollRun {
  id: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  status: PayrollStatus;
  processedAt: string | null;
  processedBy: string | null;
  notes: string | null;
  itemCount: number;
  organizationId: string;
  items: PayrollItem[];
  createdAt: string;
  updatedAt: string;
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
  employeeName: string;
  employeeEmail: string;
  departmentName: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export const PAYROLL_STATUS_OPTIONS: { value: PayrollStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];
