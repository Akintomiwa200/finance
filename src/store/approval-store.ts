"use client";

import { create } from "zustand";
import type { ApprovalRequest, ApprovalStep } from "@/src/types/approval";

interface ApprovalState {
  approvals: ApprovalRequest[];
  loading: boolean;

  fetchApprovals: (params?: Record<string, string>) => Promise<void>;
  getApprovalById: (id: string) => ApprovalRequest | undefined;
  addApproval: (data: Record<string, unknown>) => Promise<ApprovalRequest | null>;
  updateApproval: (id: string, data: Record<string, unknown>) => Promise<ApprovalRequest | null>;
  deleteApproval: (id: string) => Promise<boolean>;
  approveRequest: (id: string, comment?: string) => Promise<ApprovalRequest | null>;
  rejectRequest: (id: string, reason: string) => Promise<ApprovalRequest | null>;
}

function mapStep(raw: Record<string, unknown>): ApprovalStep {
  return {
    id: raw.id as string,
    stepOrder: Number(raw.stepOrder),
    role: raw.role as string,
    status: (raw.status as string) as ApprovalStep["status"],
    comment: raw.comment as string | null,
    requestId: raw.requestId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapApproval(raw: Record<string, unknown>): ApprovalRequest {
  return {
    id: raw.id as string,
    title: raw.title as string,
    description: raw.description as string | null,
    type: raw.type as string,
    status: (raw.status as string) as ApprovalRequest["status"],
    priority: (raw.priority as string) as ApprovalRequest["priority"],
    dueDate: raw.dueDate as string | null,
    requesterId: raw.requesterId as string,
    requesterName: raw.requesterName as string,
    requesterEmail: raw.requesterEmail as string,
    departmentName: raw.departmentName as string,
    approverId: raw.approverId as string | null,
    approverName: raw.approverName as string | null,
    approvedAt: raw.approvedAt as string | null,
    comments: raw.comments as string | null,
    organizationId: raw.organizationId as string,
    steps: ((raw.steps as Array<Record<string, unknown>>) || []).map(mapStep),
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const useApprovalStore = create<ApprovalState>()((set, get) => ({
  approvals: [],
  loading: false,

  fetchApprovals: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/approvals?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch approvals");
      const data = await res.json();
      const raw = data.approvals ?? data.data ?? data;
      set({ approvals: Array.isArray(raw) ? raw.map(mapApproval) : [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getApprovalById: (id) => get().approvals.find((a) => a.id === id),

  addApproval: async (data) => {
    try {
      const res = await fetch("/api/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapApproval(json.approval ?? json.data);
      set({ approvals: [mapped, ...get().approvals] });
      return mapped;
    } catch { return null; }
  },

  updateApproval: async (id, data) => {
    try {
      const res = await fetch(`/api/approvals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapApproval(json.approval ?? json.data);
      set({ approvals: get().approvals.map((a) => (a.id === id ? mapped : a)) });
      return mapped;
    } catch { return null; }
  },

  deleteApproval: async (id) => {
    try {
      const res = await fetch(`/api/approvals/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ approvals: get().approvals.filter((a) => a.id !== id) });
      return true;
    } catch { return false; }
  },

  approveRequest: async (id, comment) => {
    try {
      const res = await fetch(`/api/approvals/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment || "Approved" }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapApproval(json.approval ?? json.data);
      set({ approvals: get().approvals.map((a) => (a.id === id ? mapped : a)) });
      return mapped;
    } catch { return null; }
  },

  rejectRequest: async (id, reason) => {
    try {
      const res = await fetch(`/api/approvals/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapApproval(json.approval ?? json.data);
      set({ approvals: get().approvals.map((a) => (a.id === id ? mapped : a)) });
      return mapped;
    } catch { return null; }
  },
}));
