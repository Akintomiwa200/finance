"use client";

import { useEffect, useRef } from "react";
import { realtime } from "@/src/services/realtime.service";
import { useRealtime } from "@/src/hooks/use-realtime";

export function useAdminRealtime(onEvent?: () => void) {
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  useRealtime({
    onMessage: () => {
      onEventRef.current?.();
    },
  });

  useEffect(() => {
    realtime.startPolling("/api/realtime/poll", 5000);
    return () => {
      realtime.disconnect();
    };
  }, []);
}
