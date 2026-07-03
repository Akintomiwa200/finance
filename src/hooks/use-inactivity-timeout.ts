"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useSessionSettingsStore } from "@/src/store/session-settings-store";

const ACTIVITY_EVENTS = ["mousemove", "mousedown", "click", "keydown", "scroll", "touchstart", "wheel"];

export function useInactivityTimeout() {
  const timeoutMinutes = useSessionSettingsStore((s) => s.inactivityTimeoutMinutes);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timeoutMinutes === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, timeoutMinutes * 60 * 1000);
    };

    reset();

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, reset, { passive: true });
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, reset);
      }
    };
  }, [timeoutMinutes]);
}
