"use client";

import { create } from "zustand";
import type { PayrollRun, PayrollItem } from "@/src/types/payroll";

interface PayrollState {
  payrollRuns: PayrollRun[];
  loading: boolean;
  _pollInterval: ReturnType<typeof setInterval> | null;

  fetchPayrollRuns: (params?: Record<string, string>) => Promise<void>;
  getPayrollRunById: (id: string) => PayrollRun | undefined;
  addPayrollRun: (data: Record<string, unknown>) => Promise<PayrollRun | null>;
  updatePayrollRun: (id: string, data: Record<string, unknown>) => Promise<PayrollRun | null>;
  deletePayrollRun: (id: string) => Promise<boolean>;
  processPayrollRun: (id: string) => Promise<PayrollRun | null>;
  completePayrollRun: (id: string) => Promise<PayrollRun | null>;
  startPolling: () => void;
  stopPolling: () => void;
}

function mapPayrollItem(raw: Record<string, unknown>): PayrollItem {
  return {
    id: raw.id as string,
    grossPay: Number(raw.grossPay),
    deductions: Number(raw.deductions),
    taxAmount: Number(raw.taxAmount),
    netPay: Number(raw.netPay),
    allowances: Number(raw.allowances),
    bonus: Number(raw.bonus),
    loanDeduction: Number(raw.loanDeduction),
    overtimePay: Number(raw.overtimePay),
    payrollRunId: raw.payrollRunId as string,
    employeeId: raw.employeeId as string,
    employeeName: raw.employeeName as string,
    employeeEmail: raw.employeeEmail as string,
    departmentName: raw.departmentName as string,
    position: raw.position as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapPayrollRun(raw: Record<string, unknown>): PayrollRun {
  return {
    id: raw.id as string,
    periodStart: raw.periodStart as string,
    periodEnd: raw.periodEnd as string,
    totalAmount: Number(raw.totalAmount),
    status: (raw.status as string) as PayrollRun["status"],
    processedAt: raw.processedAt as string | null,
    processedBy: raw.processedBy as string | null,
    notes: raw.notes as string | null,
    itemCount: Number(raw.itemCount) || 0,
    organizationId: raw.organizationId as string,
    items: ((raw.items as Array<Record<string, unknown>>) || []).map(mapPayrollItem),
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const usePayrollStore = create<PayrollState>()((set, get) => ({
  payrollRuns: [],
  loading: false,
  _pollInterval: null,

  startPolling: () => {
    const state = get();
    if (state._pollInterval) return;
    state.fetchPayrollRuns();
    const id = setInterval(() => {
      get().fetchPayrollRuns();
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

  fetchPayrollRuns: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/payroll-runs?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch payroll runs");
      const data = await res.json();
      const raw = data.payrollRuns ?? data.data ?? data;
      set({ payrollRuns: Array.isArray(raw) ? raw.map(mapPayrollRun) : [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getPayrollRunById: (id) => get().payrollRuns.find((r) => r.id === id),

  addPayrollRun: async (data) => {
    try {
      const res = await fetch("/api/payroll-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapPayrollRun(json.payrollRun ?? json.data);
      set({ payrollRuns: [mapped, ...get().payrollRuns] });
      return mapped;
    } catch { return null; }
  },

  updatePayrollRun: async (id, data) => {
    try {
      const res = await fetch(`/api/payroll-runs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapPayrollRun(json.payrollRun ?? json.data);
      set({ payrollRuns: get().payrollRuns.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },

  deletePayrollRun: async (id) => {
    try {
      const res = await fetch(`/api/payroll-runs/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ payrollRuns: get().payrollRuns.filter((r) => r.id !== id) });
      return true;
    } catch { return false; }
  },

  processPayrollRun: async (id) => {
    try {
      const res = await fetch(`/api/payroll-runs/${id}/process`, { method: "POST" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapPayrollRun(json.payrollRun ?? json.data);
      set({ payrollRuns: get().payrollRuns.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },

  completePayrollRun: async (id) => {
    try {
      const res = await fetch(`/api/payroll-runs/${id}/complete`, { method: "POST" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapPayrollRun(json.payrollRun ?? json.data);
      set({ payrollRuns: get().payrollRuns.map((r) => (r.id === id ? mapped : r)) });
      return mapped;
    } catch { return null; }
  },
}));
