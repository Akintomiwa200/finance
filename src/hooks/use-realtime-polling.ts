"use client";
import { useEffect, useCallback } from "react";

export function useRealtimePolling(callback: () => void | Promise<void>, intervalMs: number = 30000) {
  const stableCallback = useCallback(() => {
    callback();
  }, [callback]);

  useEffect(() => {
    stableCallback();

    const interval = setInterval(stableCallback, intervalMs);

    const handleFocus = () => stableCallback();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [stableCallback, intervalMs]);
}
