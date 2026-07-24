"use client";

import { create } from "zustand";
import type { TaxConfiguration } from "@/src/types/tax";

interface TaxState {
  configurations: TaxConfiguration[];
  loading: boolean;
  _pollInterval: ReturnType<typeof setInterval> | null;
  fetchConfigurations: (params?: Record<string, string>) => Promise<void>;
  getConfigurationById: (id: string) => TaxConfiguration | undefined;
  addConfiguration: (data: Record<string, unknown>) => Promise<TaxConfiguration | null>;
  updateConfiguration: (id: string, data: Record<string, unknown>) => Promise<TaxConfiguration | null>;
  deleteConfiguration: (id: string) => Promise<boolean>;
  startPolling: () => void;
  stopPolling: () => void;
}

const MOCK_CONFIGS: TaxConfiguration[] = [
  {
    id: "tax-001",
    name: "VAT",
    rate: 7.5,
    threshold: null,
    isActive: true,
    organizationId: "org-1",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "tax-002",
    name: "Withholding Tax - Companies",
    rate: 10,
    threshold: 100000,
    isActive: true,
    organizationId: "org-1",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "tax-003",
    name: "Withholding Tax - Individuals",
    rate: 10,
    threshold: 300000,
    isActive: true,
    organizationId: "org-1",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "tax-004",
    name: "Stamp Duty",
    rate: 1.5,
    threshold: 50000,
    isActive: true,
    organizationId: "org-1",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "tax-005",
    name: "Capital Gains Tax",
    rate: 10,
    threshold: null,
    isActive: false,
    organizationId: "org-1",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "tax-006",
    name: "Education Tax",
    rate: 2,
    threshold: null,
    isActive: true,
    organizationId: "org-1",
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];

export const useTaxStore = create<TaxState>((set, get) => ({
  configurations: [],
  loading: false,
  _pollInterval: null,

  startPolling: () => {
    const state = get();
    if (state._pollInterval) return;
    state.fetchConfigurations();
    const id = setInterval(() => {
      get().fetchConfigurations();
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

  fetchConfigurations: async () => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    set({ configurations: MOCK_CONFIGS, loading: false });
  },

  getConfigurationById: (id: string) => {
    return get().configurations.find((c) => c.id === id);
  },

  addConfiguration: async (data) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    const newConfig: TaxConfiguration = {
      id: `tax-${Date.now()}`,
      name: data.name as string,
      rate: Number(data.rate),
      threshold: data.threshold !== undefined && data.threshold !== null ? Number(data.threshold) : null,
      isActive: Boolean(data.isActive),
      organizationId: "org-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ configurations: [newConfig, ...s.configurations], loading: false }));
    return newConfig;
  },

  updateConfiguration: async (id, data) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    let updated: TaxConfiguration | null = null;
    set((s) => ({
      configurations: s.configurations.map((c) => {
        if (c.id !== id) return c;
        updated = {
          ...c,
          name: (data.name as string) ?? c.name,
          rate: data.rate !== undefined ? Number(data.rate) : c.rate,
          threshold: data.threshold !== undefined ? (data.threshold !== null ? Number(data.threshold) : null) : c.threshold,
          isActive: data.isActive !== undefined ? Boolean(data.isActive) : c.isActive,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      }),
      loading: false,
    }));
    return updated;
  },

  deleteConfiguration: async (id) => {
    set({ loading: true });
    await new Promise((r) => setTimeout(r, 300));
    set((s) => ({
      configurations: s.configurations.filter((c) => c.id !== id),
      loading: false,
    }));
    return true;
  },
}));
