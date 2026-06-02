import { create } from "zustand";

interface FinanceState {
  selectedFiscalYear: number;
  setSelectedFiscalYear: (year: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  selectedFiscalYear: new Date().getFullYear(),
  setSelectedFiscalYear: (year) => set({ selectedFiscalYear: year }),
  activeTab: "overview",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
