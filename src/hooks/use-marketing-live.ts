"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ApiListResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export function useMarketingLive<T>(endpoint: string, pollMs = 12000) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sinceRef = useRef<string | undefined>(undefined);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const json = (await res.json()) as ApiListResponse<T>;
      if (!res.ok || !json.success || json.data === undefined) {
        throw new Error(json.error ?? "Failed to load data");
      }
      setData(json.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  useEffect(() => {
    const pollRealtime = async () => {
      try {
        const qs = sinceRef.current ? `?since=${encodeURIComponent(sinceRef.current)}` : "";
        const res = await fetch(`/api/marketing/realtime/poll${qs}`, {
          cache: "no-store",
        });
        const json = await res.json();
        if (json.timestamp) {
          sinceRef.current = json.timestamp;
        }
        if (Array.isArray(json.events) && json.events.length > 0) {
          void fetchData();
        }
      } catch {
        // ignore poll errors
      }
    };

    const interval = setInterval(() => {
      void pollRealtime();
    }, pollMs);

    return () => clearInterval(interval);
  }, [fetchData, pollMs]);

  return { data, loading, error, refresh: fetchData };
}
