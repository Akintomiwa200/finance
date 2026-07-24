"use client";

import { create } from "zustand";
import type { Budget, BudgetLineItem } from "@/src/types/budget";

interface BudgetState {
  budgets: Budget[];
  loading: boolean;
  _pollInterval: ReturnType<typeof setInterval> | null;

  fetchBudgets: (params?: Record<string, string>) => Promise<void>;
  getBudgetById: (id: string) => Budget | undefined;
  addBudget: (data: Record<string, unknown>) => Promise<Budget | null>;
  updateBudget: (id: string, data: Record<string, unknown>) => Promise<Budget | null>;
  deleteBudget: (id: string) => Promise<boolean>;
  startPolling: () => void;
  stopPolling: () => void;
}

function mapLineItem(raw: Record<string, unknown>): BudgetLineItem {
  return {
    id: raw.id as string,
    category: raw.category as string,
    description: raw.description as string | null,
    allocated: Number(raw.allocated),
    spent: Number(raw.spent),
    budgetId: raw.budgetId as string,
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

function mapBudget(raw: Record<string, unknown>): Budget {
  return {
    id: raw.id as string,
    fiscalYear: Number(raw.fiscalYear),
    totalAmount: Number(raw.totalAmount),
    spentAmount: Number(raw.spentAmount),
    status: (raw.status as string) as Budget["status"],
    departmentId: raw.departmentId as string | null,
    departmentName: raw.departmentName as string | null,
    organizationId: raw.organizationId as string,
    lineItems: ((raw.lineItems as Array<Record<string, unknown>>) || []).map(mapLineItem),
    createdAt: raw.createdAt as string,
    updatedAt: raw.updatedAt as string,
  };
}

export const useBudgetStore = create<BudgetState>()((set, get) => ({
  budgets: [],
  loading: false,
  _pollInterval: null,

  startPolling: () => {
    const state = get();
    if (state._pollInterval) return;
    state.fetchBudgets();
    const id = setInterval(() => {
      get().fetchBudgets();
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

  fetchBudgets: async (params) => {
    set({ loading: true });
    try {
      const sp = new URLSearchParams(params);
      const res = await fetch(`/api/budgets?${sp.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch budgets");
      const data = await res.json();
      const raw = data.budgets ?? data.data ?? data;
      set({ budgets: Array.isArray(raw) ? raw.map(mapBudget) : [], loading: false });
    } catch {
      set({ loading: false });
    }
  },

  getBudgetById: (id) => get().budgets.find((b) => b.id === id),

  addBudget: async (data) => {
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapBudget(json.budget ?? json.data);
      set({ budgets: [mapped, ...get().budgets] });
      return mapped;
    } catch { return null; }
  },

  updateBudget: async (id, data) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const json = await res.json();
      const mapped = mapBudget(json.budget ?? json.data);
      set({ budgets: get().budgets.map((b) => (b.id === id ? mapped : b)) });
      return mapped;
    } catch { return null; }
  },

  deleteBudget: async (id) => {
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      set({ budgets: get().budgets.filter((b) => b.id !== id) });
      return true;
    } catch { return false; }
  },
}));
