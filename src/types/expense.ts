export type ExpenseStatusType = "draft" | "submitted" | "approved" | "rejected" | "reimbursed";
export type ReimbursementStatusType = "pending" | "approved" | "rejected" | "paid";
export type PaymentMethodType = "cash" | "bank_transfer" | "credit_card" | "debit_card" | "mobile_payment" | "company_card";

export interface ExpenseReport {
  id: string;
  title: string;
  description: string | null;
  department: string | null;
  totalAmount: number;
  status: ExpenseStatusType;
  submittedAt: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  rejectedReason: string | null;
  reimbursedAt: string | null;
  receiptUrl: string | null;
  notes: string | null;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  organizationId: string;
  items: ExpenseItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  receiptUrl: string | null;
  expenseDate: string;
  paymentMethod: PaymentMethodType;
  isReimbursable: boolean;
  merchant: string | null;
  expenseReportId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reimbursement {
  id: string;
  amount: number;
  status: ReimbursementStatusType;
  description: string | null;
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  paidAt: string | null;
  rejectionReason: string | null;
  category: string | null;
  paymentMethod: PaymentMethodType | null;
  employeeName: string;
  employeeEmail: string;
  department: string | null;
  expenseReportId: string;
  expenseReportTitle: string;
  employeeId: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export const EXPENSE_STATUS_OPTIONS: { value: ExpenseStatusType; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "reimbursed", label: "Reimbursed" },
];

export const REIMBURSEMENT_STATUS_OPTIONS: { value: ReimbursementStatusType; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "paid", label: "Paid" },
];

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethodType; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "credit_card", label: "Credit Card" },
  { value: "debit_card", label: "Debit Card" },
  { value: "mobile_payment", label: "Mobile Payment" },
  { value: "company_card", label: "Company Card" },
];

export const EXPENSE_CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "travel", label: "Travel & Transport" },
  { value: "lodging", label: "Lodging" },
  { value: "meals", label: "Meals & Entertainment" },
  { value: "office_supplies", label: "Office Supplies" },
  { value: "software", label: "Software & Subscriptions" },
  { value: "equipment", label: "Equipment" },
  { value: "telecommunications", label: "Telecommunications" },
  { value: "professional_development", label: "Professional Development" },
  { value: "marketing", label: "Marketing & Advertising" },
  { value: "utilities", label: "Utilities" },
  { value: "insurance", label: "Insurance" },
  { value: "maintenance", label: "Maintenance & Repairs" },
  { value: "other", label: "Other" },
];
