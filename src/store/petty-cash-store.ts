"use client";

import { create } from "zustand";
import type { PettyCashRequest, PettyCashReimbursement } from "@/src/types/petty-cash";

interface PettyCashState {
  requests: PettyCashRequest[];
  reimbursements: PettyCashReimbursement[];
  loading: boolean;
  _pollInterval: ReturnType<typeof setInterval> | null;

  fetchRequests: (params?: Record<string, string>) => Promise<void>;
  fetchReimbursements: (params?: Record<string, string>) => Promise<void>;
  getRequestById: (id: string) => PettyCashRequest | undefined;
  getReimbursementById: (id: string) => PettyCashReimbursement | undefined;

  addRequest: (data: Record<string, unknown>) => Promise<PettyCashRequest | null>;
  updateRequest: (id: string, data: Record<string, unknown>) => Promise<PettyCashRequest | null>;
  deleteRequest: (id: string) => Promise<boolean>;
  approveRequest: (id: string) => Promise<PettyCashRequest | null>;
  rejectRequest: (id: string, reason: string) => Promise<PettyCashRequest | null>;
  disburseRequest: (id: string) => Promise<PettyCashRequest | null>;

  addReimbursement: (data: Record<string, unknown>) => Promise<PettyCashReimbursement | null>;
  updateReimbursement: (id: string, data: Record<string, unknown>) => Promise<PettyCashReimbursement | null>;
  deleteReimbursement: (id: string) => Promise<boolean>;

  startPolling: () => void;
  stopPolling: () => void;
}

function mapRequest(raw: Record<string, unknown>): PettyCashRequest {
  return {
    id: raw.id as string,
    requestNumber: raw.requestNumber as string,
    title: raw.title as string,
    description: raw.description as string | null,
    amount: Number(raw.amount),
    category: raw.category as string,
    priority: (raw.priority as string).toLowerCase() as PettyCashRequest["priority"],
    status: (raw.status as string).toLowerCase() as PettyCashRequest["status"],
    paymentMethod: (raw.paymentMethod as string).toLowerCase() as PettyCashRequest["paymentMethod"],
    requestDate: raw.requestDate as string,
    expectedDate: raw.expectedDate as string | null,
    employeeName: raw.employeeName as string,
    employeeEmail: raw.employeeEmail as string | null,
    departmentName: raw.departmentName as string | null,
    position: raw.position as string | null,
    approvedBy: raw.approvedBy as string | null,
    approvedAt: raw.approvedAt as string | null,
    disbursedBy: raw.disbursedBy as string | null,
    disbursedAt: raw.disbursedAt as string | null,
    rejectionReason: raw.rejectionReason as string | null,
    notes: raw.notes as string | null,
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapReimbursement(raw: Record<string, unknown>): PettyCashReimbursement {
  return {
    id: raw.id as string,
    amount: Number(raw.amount),
    status: (raw.status as string).toLowerCase() as PettyCashReimbursement["status"],
    description: raw.description as string | null,
    category: raw.category as string | null,
    submittedAt: raw.submittedAt as string,
    approvedAt: raw.approvedAt as string | null,
    approvedBy: raw.approvedBy as string | null,
    paidAt: raw.paidAt as string | null,
    rejectionReason: raw.rejectionReason as string | null,
    employeeName: raw.employeeName as string | null,
    employeeEmail: raw.employeeEmail as string | null,
    departmentName: raw.departmentName as string | null,
    requestId: raw.requestId as string | null,
    requestNumber: (raw.request as Record<string, unknown> | undefined)?.requestNumber as string | null,
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const usePettyCashStore = create<PettyCashState>()((set, get) => ({
  requests: [],
  reimbursements: [],
  loading: false,
  _pollInterval: null,

  startPolling: () => {
    const state = get();
    if (state._pollInterval) return;
    state.fetchRequests();
    state.fetchReimbursements();
    const id = setInterval(() => {
      get().fetchRequests();
      get().fetchReimbursements();
    }, 30000);
    set({ _pollInterval: id });
  },
  stopPolling: () => {
    const state = get();
    if (state._pollInterval) {
      clearInterval(state._pollInterval);
      set({ _pollInterval: null });
    }
  },

  fetchRequests: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/petty-cash/requests?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      set({ requests: (data.requests || []).map(mapRequest), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchReimbursements: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/petty-cash/reimbursements?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reimbursements");
      const data = await res.json();
      set({ reimbursements: (data.reimbursements || []).map(mapReimbursement), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getRequestById: (id) => get().requests.find((r) => r.id === id),
  getReimbursementById: (id) => get().reimbursements.find((r) => r.id === id),

  addRequest: async (data) => {
    try {
      const res = await fetch("/api/petty-cash/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { request } = await res.json();
      const mapped = mapRequest(request);
      set({ requests: [mapped, ...get().requests] });
      return mapped;
    } catch { return null; }
  },

  updateRequest: async (id, data) => {
    try {
      const res = await fetch(`/api/petty-cash/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { request } = await res.json();
      const mapped = mapRequest(request);
      set({ requests: get().requests.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },

  deleteRequest: async (id) => {
    try {
      const res = await fetch(`/api/petty-cash/requests/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ requests: get().requests.filter((r) => r.id !== id) });
      return true;
    } catch { return false; }
  },

  approveRequest: async (id) => {
    try {
      const res = await fetch(`/api/petty-cash/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { request } = await res.json();
      const mapped = mapRequest(request);
      set({ requests: get().requests.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },

  rejectRequest: async (id, reason) => {
    try {
      const res = await fetch(`/api/petty-cash/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", rejectionReason: reason }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { request } = await res.json();
      const mapped = mapRequest(request);
      set({ requests: get().requests.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },

  disburseRequest: async (id) => {
    try {
      const res = await fetch(`/api/petty-cash/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "disbursed" }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { request } = await res.json();
      const mapped = mapRequest(request);
      set({ requests: get().requests.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },

  addReimbursement: async (data) => {
    try {
      const res = await fetch("/api/petty-cash/reimbursements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { reimbursement } = await res.json();
      const mapped = mapReimbursement(reimbursement);
      set({ reimbursements: [mapped, ...get().reimbursements] });
      return mapped;
    } catch { return null; }
  },

  updateReimbursement: async (id, data) => {
    try {
      const res = await fetch(`/api/petty-cash/reimbursements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { reimbursement } = await res.json();
      const mapped = mapReimbursement(reimbursement);
      set({ reimbursements: get().reimbursements.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },

  deleteReimbursement: async (id) => {
    try {
      const res = await fetch(`/api/petty-cash/reimbursements/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ reimbursements: get().reimbursements.filter((r) => r.id !== id) });
      return true;
    } catch { return false; }
  },
}));
