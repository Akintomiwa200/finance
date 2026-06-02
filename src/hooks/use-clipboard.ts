"use client";

import { useState, useCallback } from "react";

export function useClipboard({ timeout = 2000 } = {}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }
        setCopied(true);
        setError(null);
        setTimeout(() => setCopied(false), timeout);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to copy");
        setCopied(false);
      }
    },
    [timeout]
  );

  return { copy, copied, error };
}
