import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SummaryMetric } from "@/src/types/common";

interface FilterState {
  departmentId: string | null;
  fiscalYear: number;
  status: string | null;
  search: string;
  dateRange: { from: string | null; to: string | null };
}

interface FinanceState {
  selectedFiscalYear: number;
  activeTab: string;
  dashboardMetrics: SummaryMetric[];
  filters: FilterState;

  setSelectedFiscalYear: (year: number) => void;
  setActiveTab: (tab: string) => void;
  setDashboardMetrics: (metrics: SummaryMetric[]) => void;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  departmentId: null,
  fiscalYear: new Date().getFullYear(),
  status: null,
  search: "",
  dateRange: { from: null, to: null },
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      selectedFiscalYear: new Date().getFullYear(),
      activeTab: "overview",
      dashboardMetrics: [],
      filters: { ...defaultFilters },

      setSelectedFiscalYear: (year) =>
        set({ selectedFiscalYear: year, filters: { ...defaultFilters, fiscalYear: year } }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      setDashboardMetrics: (metrics) => set({ dashboardMetrics: metrics }),

      setFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),

      resetFilters: () => set({ filters: { ...defaultFilters, fiscalYear: new Date().getFullYear() } }),
    }),
    {
      name: "faas-finance",
      partialize: (state) => ({
        selectedFiscalYear: state.selectedFiscalYear,
        filters: state.filters,
      }),
    }
  )
);
