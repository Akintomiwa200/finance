import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionTimeout = 15 | 30 | 60 | 120 | 180 | 0;

interface SessionSettingsState {
  inactivityTimeoutMinutes: SessionTimeout;
  setInactivityTimeout: (minutes: SessionTimeout) => void;
}

export const useSessionSettingsStore = create<SessionSettingsState>()(
  persist(
    (set) => ({
      inactivityTimeoutMinutes: 60,
      setInactivityTimeout: (minutes) => set({ inactivityTimeoutMinutes: minutes }),
    }),
    {
      name: "faas-session-settings",
      partialize: (state) => ({
        inactivityTimeoutMinutes: state.inactivityTimeoutMinutes,
      }),
    },
  ),
);
