export type PettyCashRequestStatus = "pending" | "approved" | "rejected" | "disbursed" | "cancelled";
export type PettyCashPriority = "low" | "medium" | "high";
export type PettyCashPaymentMethod = "cash" | "bank_transfer" | "cheque";
export type PettyCashReimbursementStatus = "pending" | "approved" | "rejected" | "paid";

export interface PettyCashRequest {
  id: string;
  requestNumber: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  priority: PettyCashPriority;
  status: PettyCashRequestStatus;
  paymentMethod: PettyCashPaymentMethod;
  requestDate: string;
  expectedDate: string | null;
  employeeName: string;
  employeeEmail: string | null;
  departmentName: string | null;
  position: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  disbursedBy: string | null;
  disbursedAt: string | null;
  rejectionReason: string | null;
  notes: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PettyCashReimbursement {
  id: string;
  amount: number;
  status: PettyCashReimbursementStatus;
  description: string | null;
  category: string | null;
  submittedAt: string;
  approvedAt: string | null;
  approvedBy: string | null;
  paidAt: string | null;
  rejectionReason: string | null;
  employeeName: string | null;
  employeeEmail: string | null;
  departmentName: string | null;
  requestId: string | null;
  requestNumber: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
