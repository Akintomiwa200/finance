export type BudgetStatusType = "ACTIVE" | "CLOSED" | "CANCELLED";

export interface Budget {
  id: string;
  fiscalYear: number;
  totalAmount: number;
  spentAmount: number;
  status: BudgetStatusType;
  departmentId: string | null;
  departmentName: string | null;
  organizationId: string;
  lineItems: BudgetLineItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetLineItem {
  id: string;
  category: string;
  description: string | null;
  allocated: number;
  spent: number;
  budgetId: string;
  createdAt: string;
  updatedAt: string;
}

export const BUDGET_STATUS_OPTIONS: { value: BudgetStatusType; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "CLOSED", label: "Closed" },
  { value: "CANCELLED", label: "Cancelled" },
];
