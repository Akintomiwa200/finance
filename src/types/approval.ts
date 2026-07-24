export type ApprovalStatusType = "PENDING" | "APPROVED" | "REJECTED";
export type ApprovalPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: ApprovalStatusType;
  priority: ApprovalPriority;
  dueDate: string | null;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  departmentName: string;
  approverId: string | null;
  approverName: string | null;
  approvedAt: string | null;
  comments: string | null;
  organizationId: string;
  steps: ApprovalStep[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStep {
  id: string;
  stepOrder: number;
  role: string;
  status: ApprovalStatusType;
  comment: string | null;
  requestId: string;
  createdAt: string;
  updatedAt: string;
}

export const APPROVAL_STATUS_OPTIONS: { value: ApprovalStatusType; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export const APPROVAL_PRIORITY_OPTIONS: { value: ApprovalPriority; label: string }[] = [
  { value: "LOW", label: "Low" },
  { value: "NORMAL", label: "Normal" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];
