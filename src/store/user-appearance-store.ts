"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { applyPlatformPersonalization } from "@/src/lib/apply-platform-personalization";
import { usePlatformSettingsStore } from "@/src/store/platform-settings-store";
import {
  DEFAULT_USER_APPEARANCE,
  normalizeUserAppearance,
  type UserAppearanceSettings,
} from "@/src/types/user-appearance";

interface UserAppearanceState {
  userId: string | null;
  appearance: UserAppearanceSettings;
  savedAppearance: UserAppearanceSettings;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  hydrated: boolean;
  _polling: ReturnType<typeof setInterval> | null;
  _realtimeSince: string;

  setUserId: (userId: string | null) => void;
  setHydrated: () => void;
  fetchAppearance: (force?: boolean) => Promise<void>;
  previewAppearance: (patch: Partial<UserAppearanceSettings>) => void;
  saveAppearance: (patch?: Partial<UserAppearanceSettings>) => Promise<boolean>;
  resetDraft: () => void;
  applyAppearance: (appearance: UserAppearanceSettings) => void;
  startPolling: () => void;
  stopPolling: () => void;
  pollRealtime: () => Promise<void>;
}

const POLL_INTERVAL = 30000;
const REALTIME_POLL_INTERVAL = 12000;

function syncPlatformStore(appearance: UserAppearanceSettings) {
  usePlatformSettingsStore.getState().setSettings({
    theme: appearance.theme,
    accentColor: appearance.accentColor,
    fontSize: appearance.fontSize,
    fontFamily: appearance.fontFamily,
    compactNav: appearance.compactNav,
  });
}

function applyToDocument(appearance: UserAppearanceSettings) {
  if (typeof window === "undefined") return;
  applyPlatformPersonalization({
    theme: appearance.theme,
    accentColor: appearance.accentColor,
    compactNav: appearance.compactNav,
    fontSize: appearance.fontSize,
    fontFamily: appearance.fontFamily,
  });
}

export const useUserAppearanceStore = create<UserAppearanceState>()(
  persist(
    (set, get) => ({
      userId: null,
      appearance: { ...DEFAULT_USER_APPEARANCE },
      savedAppearance: { ...DEFAULT_USER_APPEARANCE },
      isLoading: false,
      isSaving: false,
      error: null,
      hydrated: false,
      _polling: null,
      _realtimeSince: new Date(0).toISOString(),

      setUserId: (userId) => {
        const current = get().userId;
        if (current === userId) return;

        if (userId && current && userId !== current) {
          set({
            userId,
            appearance: { ...DEFAULT_USER_APPEARANCE },
            savedAppearance: { ...DEFAULT_USER_APPEARANCE },
          });
        } else {
          set({ userId });
        }

        if (userId) {
          get().fetchAppearance(true);
        }
      },

      setHydrated: () => set({ hydrated: true }),

      applyAppearance: (appearance) => {
        const normalized = normalizeUserAppearance(appearance);
        set({ appearance: normalized });
        applyToDocument(normalized);
        syncPlatformStore(normalized);
      },

      fetchAppearance: async (force = false) => {
        const { userId, isLoading, savedAppearance } = get();
        if (!userId) return;
        if (isLoading && !force) return;

        try {
          set({ isLoading: true, error: null });
          const res = await fetch("/api/profile/appearance");
          if (!res.ok) throw new Error("Failed to fetch appearance settings");
          const data = await res.json();
          const next = normalizeUserAppearance(data.appearance, savedAppearance);

          const currentSaved = get().savedAppearance;
          const serverIsNewer =
            new Date(next.updatedAt).getTime() > new Date(currentSaved.updatedAt).getTime();

          if (serverIsNewer || force) {
            set({
              appearance: next,
              savedAppearance: next,
              isLoading: false,
              error: null,
            });
            applyToDocument(next);
            syncPlatformStore(next);
          } else {
            set({ isLoading: false, error: null });
          }
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : "Failed to fetch appearance settings",
          });
        }
      },

      previewAppearance: (patch) => {
        const next = normalizeUserAppearance({ ...get().appearance, ...patch });
        set({ appearance: next });
        applyToDocument(next);
        syncPlatformStore(next);
      },

      saveAppearance: async (patch) => {
        const { userId, appearance, isSaving } = get();
        if (!userId || isSaving) return false;

        const payload = normalizeUserAppearance({ ...appearance, ...patch });

        try {
          set({ isSaving: true, error: null });
          const res = await fetch("/api/profile/appearance", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              theme: payload.theme,
              accentColor: payload.accentColor,
              fontSize: payload.fontSize,
              fontFamily: payload.fontFamily,
              compactNav: payload.compactNav,
            }),
          });

          if (!res.ok) throw new Error("Failed to save appearance settings");

          const data = await res.json();
          const saved = normalizeUserAppearance(data.appearance, payload);

          set({
            appearance: saved,
            savedAppearance: saved,
            isSaving: false,
            error: null,
          });
          applyToDocument(saved);
          syncPlatformStore(saved);
          return true;
        } catch (err) {
          set({
            isSaving: false,
            error: err instanceof Error ? err.message : "Failed to save appearance settings",
          });
          return false;
        }
      },

      resetDraft: () => {
        const saved = get().savedAppearance;
        set({ appearance: saved });
        applyToDocument(saved);
        syncPlatformStore(saved);
      },

      pollRealtime: async () => {
        const { userId } = get();
        if (!userId) return;

        try {
          const since = get()._realtimeSince;
          const res = await fetch(`/api/realtime/poll?since=${encodeURIComponent(since)}`);
          if (!res.ok) return;

          const data = await res.json();
          const events = (data.events ?? data.messages ?? []) as Array<{
            entity: string;
            event: string;
            data: { userId?: string; appearance?: UserAppearanceSettings };
            timestamp: string;
          }>;

          if (data.timestamp) {
            set({ _realtimeSince: data.timestamp });
          }

          const relevant = events.find(
            (event) =>
              event.entity === "user-appearance" &&
              event.event === "update" &&
              event.data?.userId === userId &&
              event.data?.appearance,
          );

          if (relevant?.data?.appearance) {
            const next = normalizeUserAppearance(relevant.data.appearance);
            set({ appearance: next, savedAppearance: next });
            applyToDocument(next);
            syncPlatformStore(next);
          }
        } catch {
          // polling should stay silent
        }
      },

      startPolling: () => {
        const { _polling, userId, fetchAppearance, pollRealtime } = get();
        if (_polling || !userId) return;

        fetchAppearance(true);
        pollRealtime();

        const interval = setInterval(() => {
          fetchAppearance();
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
      name: "faas-user-appearance",
      partialize: (state) => ({
        userId: state.userId,
        appearance: state.appearance,
        savedAppearance: state.savedAppearance,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.appearance) {
          applyToDocument(state.appearance);
          syncPlatformStore(state.appearance);
        }
        state?.setHydrated();
      },
    },
  ),
);
