"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useOnScreen(options?: IntersectionObserverInit) {
  const [isVisible, setIsVisible] = useState(false);
  const [wasEverVisible, setWasEverVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) setWasEverVisible(true);
      },
      { threshold: 0, ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return { ref: setRef, isVisible, wasEverVisible };
}
