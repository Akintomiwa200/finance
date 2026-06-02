"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0, rootMargin = "0px", root = null, triggerOnce = false } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);
  const hasTriggered = useRef(false);

  const setRef = useCallback((node: HTMLDivElement | null) => {
    targetRef.current = node;
  }, []);

  useEffect(() => {
    const node = targetRef.current;
    if (!node) return;

    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        if (entry.isIntersecting && triggerOnce) {
          hasTriggered.current = true;
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin, root }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, root, triggerOnce]);

  return { ref: setRef, isIntersecting, entry };
}

/* ───────── Infinite scroll hook ───────── */

export function useInfiniteScroll(
  onLoadMore: () => void,
  options: UseIntersectionObserverOptions & { enabled?: boolean } = {}
) {
  const { enabled = true, ...observerOptions } = options;
  const { ref, isIntersecting } = useIntersectionObserver(observerOptions);

  useEffect(() => {
    if (isIntersecting && enabled) {
      onLoadMore();
    }
  }, [isIntersecting, onLoadMore, enabled]);

  return { sentinelRef: ref, isIntersecting };
}
