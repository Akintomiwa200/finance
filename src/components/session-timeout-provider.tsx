"use client";

import { useInactivityTimeout } from "@/src/hooks/use-inactivity-timeout";
import { useSessionSettingsStore } from "@/src/store/session-settings-store";

function TimeoutWatcher() {
  useInactivityTimeout();
  return null;
}

export function SessionTimeoutProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useSessionSettingsStore.persist?.hasHydrated?.() ?? true;
  return (
    <>
      {hydrated && <TimeoutWatcher />}
      {children}
    </>
  );
}
