import { create } from "zustand";

export interface TenantSettings {
  general: {
    theme: string;
    accentColor: string;
    fontSize: string;
    fontFamily: string;
    compactNav: boolean;
    defaultView: string;
    autoSave: boolean;
    animationsEnabled: boolean;
    reducedMotion: boolean;
  };
  session: {
    inactivityTimeoutMinutes: number;
  };
  regional: {
    timezone: string;
    dateFormat: string;
    locale: string;
    currency: string;
    fiscalYearStart: string;
  };
  notifications: {
    emailEnabled: boolean;
    desktopEnabled: boolean;
    soundEnabled: boolean;
    payrollAlerts: boolean;
    expenseAlerts: boolean;
    approvalAlerts: boolean;
    budgetAlerts: boolean;
    invoiceAlerts: boolean;
  };
  organization: {
    legalName: string;
    registrationNumber: string;
    taxId: string;
    vatNumber: string;
    mobile: string;
    website: string;
    industry: string;
    description: string;
    foundedYear: string;
    employeeCount: string;
    socialMedia: Record<string, string>;
    bankDetails: Record<string, string>;
    taxDetails: Record<string, string>;
  };
  accounting: Record<string, unknown>;
  payroll: Record<string, unknown>;
  tax: Record<string, unknown>;
  integrations: Record<string, unknown>;
  org: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo: string | null;
  };
}

interface TenantSettingsState {
  settings: TenantSettings | null;
  isLoading: boolean;
  error: string | null;
  _polling: ReturnType<typeof setInterval> | null;

  fetchSettings: () => Promise<void>;
  updateSettings: (section: string, data: Record<string, unknown>) => Promise<boolean>;
  startPolling: () => void;
  stopPolling: () => void;
}

const POLL_INTERVAL = 60000;

export const useTenantSettingsStore = create<TenantSettingsState>()((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,
  _polling: null,

  fetchSettings: async () => {
    try {
      set({ isLoading: get().settings === null, error: null });
      const res = await fetch("/api/settings");
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      set({ settings: data, isLoading: false, error: null });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to fetch settings",
      });
    }
  },

  updateSettings: async (section, data) => {
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [section]: data }),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      const result = await res.json();
      if (result.settings) {
        set({ settings: result.settings });
      }
      return true;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to update settings",
      });
      return false;
    }
  },

  startPolling: () => {
    const { _polling, fetchSettings } = get();
    if (_polling) return;
    fetchSettings();
    const interval = setInterval(fetchSettings, POLL_INTERVAL);
    set({ _polling: interval });
  },

  stopPolling: () => {
    const { _polling } = get();
    if (_polling) {
      clearInterval(_polling);
      set({ _polling: null });
    }
  },
}));
