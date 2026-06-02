import { Role } from "@prisma/client";
import { db } from "@/src/lib/db";

export async function getPendingApprovals(approverId: string) {
  return db.approvalRequest.findMany({
    where: {
      approverId,
      status: "PENDING",
    },
    include: {
      requester: {
        select: { firstName: true, lastName: true, department: { select: { name: true } } },
      },
      steps: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getApprovalRequests(requesterId: string) {
  return db.approvalRequest.findMany({
    where: { requesterId },
    include: {
      steps: true,
      approver: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createApprovalRequest(data: {
  title: string;
  description?: string;
  type: string;
  requesterId: string;
  approverId: string;
  priority?: string;
  dueDate?: Date;
  steps?: { stepOrder: number; role: Role }[];
}) {
  return db.approvalRequest.create({
    data: {
      title: data.title,
      description: data.description,
      type: data.type,
      requesterId: data.requesterId,
      approverId: data.approverId,
      priority: data.priority ?? "NORMAL",
      dueDate: data.dueDate,
      steps: data.steps
        ? { create: data.steps.map((s) => ({ ...s })) }
        : undefined,
    },
    include: { steps: true },
  });
}

export async function approveRequest(id: string, comment?: string) {
  return db.approvalRequest.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedAt: new Date(),
      comments: comment,
    },
  });
}

export async function rejectRequest(id: string, comment?: string) {
  return db.approvalRequest.update({
    where: { id },
    data: {
      status: "REJECTED",
      comments: comment,
    },
  });
}
