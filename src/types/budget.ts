export interface Budget {
  id: string;
  fiscalYear: number;
  totalAmount: number;
  spentAmount: number;
  status: "ACTIVE" | "CLOSED" | "CANCELLED";
  departmentId: string | null;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  organizationId: string;
  lineItems?: BudgetLineItem[];
  createdAt: string;
}

export interface BudgetLineItem {
  id: string;
  category: string;
  description: string | null;
  allocated: number;
  spent: number;
  budgetId: string;
}

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  utilizationPercentage: number;
}
