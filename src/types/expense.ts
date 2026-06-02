export interface ExpenseReport {
  id: string;
  title: string;
  description: string | null;
  totalAmount: number;
  status: "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "REIMBURSED";
  submittedAt: string | null;
  approvedAt: string | null;
  receiptUrl: string | null;
  employeeId: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  items?: ExpenseItem[];
  createdAt: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  receiptUrl: string | null;
  expenseDate: string;
  expenseReportId: string;
}
