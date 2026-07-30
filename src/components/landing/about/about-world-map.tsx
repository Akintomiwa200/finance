"use client";

import { useEffect, useState } from "react";

type DottedMapInstance = {
  addPin: (pin: {
    lat: number;
    lng: number;
    svgOptions?: { color?: string; radius?: number };
  }) => void;
  getSVG: (options: {
    shape?: "circle" | "hexagon";
    backgroundColor?: string;
    color?: string;
    radius?: number;
  }) => string;
};

type DottedMapConstructor = new (settings: {
  height?: number;
  grid?: "vertical" | "diagonal";
}) => DottedMapInstance;

function resolveDottedMapConstructor(mod: unknown): DottedMapConstructor {
  const record = mod as { default?: unknown };

  if (typeof record.default === "function") {
    return record.default as DottedMapConstructor;
  }

  if (
    record.default &&
    typeof record.default === "object" &&
    typeof (record.default as { default?: unknown }).default === "function"
  ) {
    return (record.default as { default: DottedMapConstructor }).default;
  }

  if (typeof mod === "function") {
    return mod as DottedMapConstructor;
  }

  throw new Error("Could not resolve DottedMap constructor from dotted-map");
}

const TEAM_LOCATIONS = [
  { lat: 40.7128, lng: -74.006, color: "#111111" },
  { lat: 37.7749, lng: -122.4194, color: "#22c55e" },
  { lat: 51.5074, lng: -0.1278, color: "#a855f7" },
  { lat: 52.52, lng: 13.405, color: "#f97316" },
  { lat: 6.5244, lng: 3.3792, color: "#22c55e" },
  { lat: 25.2048, lng: 55.2708, color: "#a855f7" },
  { lat: 1.3521, lng: 103.8198, color: "#111111" },
  { lat: -33.8688, lng: 151.2093, color: "#f97316" },
  { lat: 43.6532, lng: -79.3832, color: "#22c55e" },
  { lat: -23.5505, lng: -46.6333, color: "#a855f7" },
  { lat: 19.076, lng: 72.8777, color: "#f97316" },
  { lat: 35.6762, lng: 139.6503, color: "#111111" },
];

function buildMapSvg(DottedMap: DottedMapConstructor, dotColor: string) {
  const map = new DottedMap({ height: 80, grid: "diagonal" });

  for (const location of TEAM_LOCATIONS) {
    map.addPin({
      lat: location.lat,
      lng: location.lng,
      svgOptions: { color: location.color, radius: 1.15 },
    });
  }

  return map.getSVG({
    shape: "circle",
    backgroundColor: "transparent",
    color: dotColor,
    radius: 0.32,
  });
}

function useIsDarkTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}

export function AboutWorldMap() {
  const isDark = useIsDarkTheme();
  const dotColor = isDark ? "#404040" : "#d8d8d8";
  const [svgMap, setSvgMap] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    import("dotted-map")
      .then((mod) => {
        if (cancelled) return;

        const DottedMap = resolveDottedMapConstructor(mod);
        setSvgMap(buildMapSvg(DottedMap, dotColor));
      })
      .catch((error) => {
        console.error("Failed to load dotted-map:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [dotColor]);

  if (!svgMap) {
    return (
      <div
        className="h-[280px] animate-pulse rounded-[20px] bg-[var(--lp-card-alt)] md:h-[380px]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="w-full transition-opacity duration-300 [&>svg]:mx-auto [&>svg]:block [&>svg]:h-auto [&>svg]:w-full [&>svg]:max-w-[1100px]"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svgMap }}
    />
  );
}
