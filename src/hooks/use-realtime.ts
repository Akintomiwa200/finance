"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { realtime } from "@/src/services/realtime.service";
import type { RealtimeEvent, RealtimeMessage } from "@/src/types/common";

interface UseRealtimeOptions {
  entity?: string;
  event?: RealtimeEvent | "*";
  onMessage?: (msg: RealtimeMessage) => void;
}

export function useRealtime({ entity, event, onMessage }: UseRealtimeOptions = {}) {
  const [lastMessage, setLastMessage] = useState<RealtimeMessage | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const handler = (msg: RealtimeMessage) => {
      setLastMessage(msg);
      onMessageRef.current?.(msg);
    };

    if (entity && event) {
      return realtime.subscribe(entity, event, handler);
    }

    if (entity) {
      return realtime.subscribe(entity, "*", handler);
    }

    return realtime.subscribeAll(handler);
  }, [entity, event]);

  const connectWebSocket = useCallback((url: string) => {
    realtime.connectWebSocket(url);
  }, []);

  const connectSSE = useCallback((url: string) => {
    realtime.connectSSE(url);
  }, []);

  const startPolling = useCallback((endpoint?: string, intervalMs?: number) => {
    realtime.startPolling(endpoint, intervalMs);
  }, []);

  const disconnect = useCallback(() => {
    realtime.disconnect();
  }, []);

  return { lastMessage, connectWebSocket, connectSSE, startPolling, disconnect };
}

/* ───────── Hook for real-time list updates ───────── */

export function useReactiveList<T extends { id: string }>(
  entity: string,
  initialData: T[]
) {
  const [items, setItems] = useState<T[]>(initialData);

  useEffect(() => {
    setItems(initialData);
  }, [initialData]);

  const handleMessage = useCallback((msg: RealtimeMessage) => {
    if (msg.entity !== entity) return;

    setItems((current) => {
      switch (msg.event) {
        case "create":
          return [msg.data as T, ...current];
        case "update": {
          const updated = msg.data as T;
          return current.map((item) => (item.id === updated.id ? updated : item));
        }
        case "delete":
          return current.filter((item) => item.id !== (msg.data as { id: string }).id);
        default:
          return current;
      }
    });
  }, [entity]);

  useEffect(() => {
    return realtime.subscribe(entity, "*", handleMessage);
  }, [entity, handleMessage]);

  return items;
}
