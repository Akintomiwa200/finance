"use client";

import { useState, useEffect, useCallback } from "react";

export function useNetwork() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const checkConnection = useCallback(async () => {
    try {
      const res = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-store",
      });
      setIsOnline(res.ok);
      return res.ok;
    } catch {
      setIsOnline(false);
      return false;
    }
  }, []);

  return { isOnline, wasOffline, checkConnection };
}
