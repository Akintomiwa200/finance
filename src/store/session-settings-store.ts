import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionTimeoutMinutes = number;

interface SessionSettingsState {
  inactivityTimeoutMinutes: SessionTimeoutMinutes;
  hydrated: boolean;
  setInactivityTimeout: (minutes: SessionTimeoutMinutes) => void;
  setHydrated: () => void;
}

export const useSessionSettingsStore = create<SessionSettingsState>()(
  persist(
    (set) => ({
      inactivityTimeoutMinutes: 30,
      hydrated: false,
      setInactivityTimeout: (minutes) => set({ inactivityTimeoutMinutes: minutes }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "faas-session-settings",
      partialize: (state) => ({
        inactivityTimeoutMinutes: state.inactivityTimeoutMinutes,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
