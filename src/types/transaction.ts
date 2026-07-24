export type TransactionTypeValue = "INCOME" | "EXPENSE" | "TRANSFER";
export type TransactionStatusValue = "PENDING" | "COMPLETED" | "CANCELLED";

export interface Transaction {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  type: TransactionTypeValue;
  category: string;
  status: TransactionStatusValue;
  date: string;
  account: string | null;
  merchant: string | null;
  reference: string | null;
  notes: string | null;
  receipt: string | null;
  employeeId: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export const TRANSACTION_TYPE_OPTIONS: { value: TransactionTypeValue; label: string }[] = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
  { value: "TRANSFER", label: "Transfer" },
];

export const TRANSACTION_STATUS_OPTIONS: { value: TransactionStatusValue; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const TRANSACTION_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "salary", label: "Salary" },
  { value: "utilities", label: "Utilities" },
  { value: "rent", label: "Rent" },
  { value: "supplies", label: "Supplies" },
  { value: "travel", label: "Travel" },
  { value: "marketing", label: "Marketing" },
  { value: "consulting", label: "Consulting" },
  { value: "software", label: "Software" },
  { value: "equipment", label: "Equipment" },
  { value: "client_payment", label: "Client Payment" },
  { value: "other", label: "Other" },
];
