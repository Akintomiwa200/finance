"use client";

import { useEffect } from "react";
import { useRealtime } from "@/src/hooks/use-realtime";

export function useAdminRealtime(onEvent?: () => void) {
  const { startPolling } = useRealtime({
    onMessage: () => onEvent?.(),
  });

  useEffect(() => {
    startPolling("/api/realtime/poll", 5000);
    return () => {};
  }, [startPolling]);

  return { startPolling };
}
