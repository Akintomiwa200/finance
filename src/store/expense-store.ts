"use client";

import { create } from "zustand";
import type {
  ExpenseReport,
  ExpenseItem,
  Reimbursement,
} from "@/src/types/expense";

interface ExpenseState {
  reports: ExpenseReport[];
  reimbursements: Reimbursement[];
  loading: boolean;
  _pollInterval: ReturnType<typeof setInterval> | null;

  fetchReports: (params?: Record<string, string>) => Promise<void>;
  fetchReimbursements: (params?: Record<string, string>) => Promise<void>;

  getReportById: (id: string) => ExpenseReport | undefined;
  getReimbursementById: (id: string) => Reimbursement | undefined;

  addReport: (data: Record<string, unknown>) => Promise<ExpenseReport | null>;
  updateReport: (id: string, data: Record<string, unknown>) => Promise<ExpenseReport | null>;
  deleteReport: (id: string) => Promise<boolean>;

  addReimbursement: (data: Record<string, unknown>) => Promise<Reimbursement | null>;
  updateReimbursement: (id: string, data: Record<string, unknown>) => Promise<Reimbursement | null>;
  deleteReimbursement: (id: string) => Promise<boolean>;
  startPolling: () => void;
  stopPolling: () => void;
}

function mapReport(raw: Record<string, unknown>): ExpenseReport {
  return {
    id: raw.id as string,
    title: raw.title as string,
    description: raw.description as string | null,
    department: raw.department as string | null,
    totalAmount: Number(raw.totalAmount),
    status: (raw.status as string).toLowerCase() as ExpenseReport["status"],
    submittedAt: raw.submittedAt as string | null,
    approvedAt: raw.approvedAt as string | null,
    approvedBy: raw.approvedBy as string | null,
    rejectedReason: raw.rejectedReason as string | null,
    reimbursedAt: raw.reimbursedAt as string | null,
    receiptUrl: raw.receiptUrl as string | null,
    notes: raw.notes as string | null,
    employeeId: raw.employeeId as string,
    employeeName: (raw.employeeName as string) || "",
    employeeEmail: (raw.employeeEmail as string) || "",
    organizationId: raw.organizationId as string,
    items: ((raw.items as Array<Record<string, unknown>>) || []).map((i) => ({
      id: i.id as string,
      category: i.category as string,
      description: i.description as string,
      amount: Number(i.amount),
      receiptUrl: i.receiptUrl as string | null,
      expenseDate: i.expenseDate as string,
      paymentMethod: (i.paymentMethod as string || "COMPANY_CARD").toLowerCase() as ExpenseItem["paymentMethod"],
      isReimbursable: Boolean(i.isReimbursable),
      merchant: i.merchant as string | null,
      expenseReportId: i.expenseReportId as string,
      createdAt: i.createdAt as string,
      updatedAt: i.updatedAt as string,
    })),
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapReimbursement(raw: Record<string, unknown>): Reimbursement {
  return {
    id: raw.id as string,
    amount: Number(raw.amount),
    status: (raw.status as string).toLowerCase() as Reimbursement["status"],
    description: raw.description as string | null,
    submittedAt: raw.submittedAt as string,
    approvedAt: raw.approvedAt as string | null,
    approvedBy: raw.approvedBy as string | null,
    paidAt: raw.paidAt as string | null,
    rejectionReason: raw.rejectionReason as string | null,
    category: raw.category as string | null,
    paymentMethod: raw.paymentMethod ? (raw.paymentMethod as string).toLowerCase() as Reimbursement["paymentMethod"] : null,
    employeeName: (raw.employeeName as string) || "",
    employeeEmail: (raw.employeeEmail as string) || "",
    department: raw.department as string | null,
    expenseReportId: raw.expenseReportId as string,
    expenseReportTitle: (raw.expenseReportTitle as string) || "",
    employeeId: raw.employeeId as string,
    organizationId: raw.organizationId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const useExpenseStore = create<ExpenseState>()((set, get) => ({
  reports: [],
  reimbursements: [],
  loading: false,
  _pollInterval: null,

  startPolling: () => {
    const state = get();
    if (state._pollInterval) return;
    state.fetchReports();
    state.fetchReimbursements();
    const id = setInterval(() => {
      get().fetchReports();
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

  fetchReports: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/expense-reports?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch expense reports");
      const data = await res.json();
      set({ reports: data.reports.map(mapReport), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchReimbursements: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/reimbursements?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch reimbursements");
      const data = await res.json();
      set({ reimbursements: data.reimbursements.map(mapReimbursement), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getReportById: (id) => get().reports.find((r) => r.id === id),
  getReimbursementById: (id) => get().reimbursements.find((r) => r.id === id),

  addReport: async (data) => {
    try {
      const res = await fetch("/api/expense-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { report } = await res.json();
      const mapped = mapReport(report);
      set({ reports: [mapped, ...get().reports] });
      return mapped;
    } catch { return null; }
  },

  updateReport: async (id, data) => {
    try {
      const res = await fetch(`/api/expense-reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const { report } = await res.json();
      const mapped = mapReport(report);
      set({ reports: get().reports.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },

  deleteReport: async (id) => {
    try {
      const res = await fetch(`/api/expense-reports/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ reports: get().reports.filter((r) => r.id !== id) });
      return true;
    } catch { return false; }
  },

  addReimbursement: async (data) => {
    try {
      const res = await fetch("/api/reimbursements", {
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
      const res = await fetch(`/api/reimbursements/${id}`, {
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
      const res = await fetch(`/api/reimbursements/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ reimbursements: get().reimbursements.filter((r) => r.id !== id) });
      return true;
    } catch { return false; }
  },
}));
