"use client";

import { useEffect, useCallback, useRef } from "react";

type ShortcutHandler = (e: KeyboardEvent) => void;

interface Shortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: ShortcutHandler;
  enabled?: boolean;
}

export function useKeyboardShortcut(shortcuts: Shortcut | Shortcut[]) {
  const items = Array.isArray(shortcuts) ? shortcuts : [shortcuts];
  const handlersRef = useRef(items);

  useEffect(() => {
    handlersRef.current = items;
  }, [items]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    for (const { key, ctrl, meta, shift, alt, handler, enabled = true } of handlersRef.current) {
      if (!enabled) continue;

      const matchCtrl = ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
      const matchMeta = meta ? e.metaKey : true;
      const matchShift = shift ? e.shiftKey : !e.shiftKey;
      const matchAlt = alt ? e.altKey : !e.altKey;

      if (e.key.toLowerCase() === key.toLowerCase() && matchCtrl && matchMeta && matchShift && matchAlt) {
        e.preventDefault();
        e.stopPropagation();
        handler(e);
        return;
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/* ───────── Pre-built shortcuts ───────── */

export function useSaveShortcut(handler: ShortcutHandler, enabled = true) {
  useKeyboardShortcut({ key: "s", ctrl: true, handler, enabled });
}

export function useEscapeShortcut(handler: ShortcutHandler, enabled = true) {
  useKeyboardShortcut({ key: "Escape", handler, enabled });
}

export function useNewItemShortcut(handler: ShortcutHandler, enabled = true) {
  useKeyboardShortcut({ key: "n", ctrl: true, handler, enabled });
}

export function useSearchShortcut(handler: ShortcutHandler, enabled = true) {
  useKeyboardShortcut({ key: "k", ctrl: true, handler, enabled });
}
