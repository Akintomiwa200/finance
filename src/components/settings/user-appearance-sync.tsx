"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/store/auth-store";
import { useUserAppearanceStore } from "@/src/store/user-appearance-store";

export function UserAppearanceSync() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const _hydrated = useAuthStore((s) => s._hydrated);
  const setUserId = useUserAppearanceStore((s) => s.setUserId);
  const startPolling = useUserAppearanceStore((s) => s.startPolling);
  const stopPolling = useUserAppearanceStore((s) => s.stopPolling);

  useEffect(() => {
    if (!_hydrated) return;

    if (isAuthenticated && userId) {
      setUserId(userId);
      startPolling();
      return () => stopPolling();
    }

    setUserId(null);
    stopPolling();
  }, [_hydrated, isAuthenticated, userId, setUserId, startPolling, stopPolling]);

  return null;
}
