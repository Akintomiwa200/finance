import { create } from "zustand";
import { persist } from "zustand/middleware";

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
    currencySymbol?: string;
    language?: string;
    timeFormat?: string;
    firstDayOfWeek?: number;
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
    city: string;
    state: string;
    country: string;
    postalCode: string;
    socialMedia: Record<string, string>;
    bankDetails: Record<string, string>;
    taxDetails: Record<string, string>;
  };
  branding: {
    logoAlt: string;
    favicon: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
    darkMode: boolean;
  };
  fiscalYear: {
    fiscalYear: string;
    startMonth: string;
    endMonth: string;
    startDay: number;
    periods: number;
    periodType: "monthly" | "quarterly";
    currentPeriod: number;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumber: boolean;
    passwordRequireSpecial: boolean;
    passwordExpiryDays: number;
    sessionTimeout: number;
    mfaEnabled: boolean;
    ipRestriction: string;
    loginAttempts: number;
    lockoutDuration: number;
  };
  accounting: Record<string, unknown>;
  payroll: Record<string, unknown>;
  tax: Record<string, unknown>;
  integrations: Record<string, unknown>;
  backup: {
    autoBackupEnabled: boolean;
    backupFrequency: string;
    retentionDays: number;
    includeAttachments: boolean;
    lastBackupAt: string | null;
  };
  org: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo: string | null;
  };
  updatedAt?: string;
}

interface TenantSettingsState {
  organizationId: string | null;
  settings: TenantSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hydrated: boolean;
  settingsVersion: number;
  _polling: ReturnType<typeof setInterval> | null;
  _realtimeSince: string;

  setOrganizationId: (organizationId: string | null) => void;
  setHydrated: () => void;
  fetchSettings: (force?: boolean) => Promise<void>;
  updateSettings: (section: string, data: Record<string, unknown>, extra?: Record<string, unknown>) => Promise<boolean>;
  startPolling: () => void;
  stopPolling: () => void;
  pollRealtime: () => Promise<void>;
}

const POLL_INTERVAL = 30000;
const REALTIME_POLL_INTERVAL = 12000;

export const useTenantSettingsStore = create<TenantSettingsState>()(
  persist(
    (set, get) => ({
      organizationId: null,
      settings: null,
      isLoading: false,
      isSaving: false,
      error: null,
      hydrated: false,
      settingsVersion: 0,
      _polling: null,
      _realtimeSince: new Date(0).toISOString(),

      setOrganizationId: (organizationId) => {
        if (get().organizationId === organizationId) return;
        set({ organizationId });
        if (organizationId) {
          get().fetchSettings(true);
        }
      },

      setHydrated: () => set({ hydrated: true }),

      fetchSettings: async (force = false) => {
        const { organizationId, isLoading } = get();
        if (!organizationId) return;
        if (isLoading && !force) return;

        try {
          set({ isLoading: get().settings === null, error: null });
          const res = await fetch("/api/settings");
          if (!res.ok) throw new Error("Failed to fetch settings");
          const data = (await res.json()) as TenantSettings;

          const current = get().settings;
          const serverIsNewer =
            !current?.updatedAt ||
            new Date(data.updatedAt || 0).getTime() > new Date(current.updatedAt || 0).getTime();

          if (serverIsNewer || force) {
            set({
              settings: data,
              isLoading: false,
              error: null,
              settingsVersion: get().settingsVersion + 1,
            });
          } else {
            set({ isLoading: false, error: null });
          }
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : "Failed to fetch settings",
          });
        }
      },

      updateSettings: async (section, data, extra = {}) => {
        try {
          set({ isSaving: true, error: null });
          const res = await fetch("/api/settings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [section]: data, ...extra }),
          });
          if (!res.ok) throw new Error("Failed to update settings");
          const result = await res.json();
          if (result.settings) {
            set({
              settings: result.settings,
              isSaving: false,
              settingsVersion: get().settingsVersion + 1,
            });
          } else {
            set({ isSaving: false });
          }
          return true;
        } catch (err) {
          set({
            isSaving: false,
            error: err instanceof Error ? err.message : "Failed to update settings",
          });
          return false;
        }
      },

      pollRealtime: async () => {
        const { organizationId } = get();
        if (!organizationId) return;

        try {
          const since = get()._realtimeSince;
          const res = await fetch(`/api/realtime/poll?since=${encodeURIComponent(since)}`);
          if (!res.ok) return;

          const payload = await res.json();
          const events = (payload.events ?? payload.messages ?? []) as Array<{
            entity: string;
            event: string;
            data: { organizationId?: string; updatedAt?: string };
            timestamp: string;
          }>;

          if (payload.timestamp) {
            set({ _realtimeSince: payload.timestamp });
          }

          const relevant = events.find(
            (event) =>
              event.entity === "tenant_settings" &&
              event.event === "update" &&
              event.data?.organizationId === organizationId,
          );

          if (relevant) {
            await get().fetchSettings(true);
          }
        } catch {
          // silent polling failure
        }
      },

      startPolling: () => {
        const { _polling, organizationId, fetchSettings, pollRealtime } = get();
        if (_polling || !organizationId) return;

        fetchSettings(true);
        pollRealtime();

        const interval = setInterval(() => {
          fetchSettings();
          pollRealtime();
        }, Math.min(POLL_INTERVAL, REALTIME_POLL_INTERVAL));

        set({ _polling: interval });
      },

      stopPolling: () => {
        const { _polling } = get();
        if (_polling) {
          clearInterval(_polling);
          set({ _polling: null });
        }
      },
    }),
    {
      name: "faas-tenant-settings",
      partialize: (state) => ({
        organizationId: state.organizationId,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
