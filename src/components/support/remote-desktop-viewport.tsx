"use client";

import { useRef } from "react";
import { getVideoNormalizedCoords } from "@/src/lib/remote-control";
import type { RemoteControlMessage } from "@/src/types/remote-desktop";
import { MousePointer2 } from "lucide-react";

interface RemoteDesktopViewportProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  controlEnabled: boolean;
  onControl: (message: RemoteControlMessage) => void;
  label?: string;
}

export function RemoteDesktopViewport({
  videoRef,
  controlEnabled,
  onControl,
  label = "Remote desktop",
}: RemoteDesktopViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  function emitFromEvent(
    type: RemoteControlMessage["type"],
    clientX: number,
    clientY: number,
    extra?: Partial<RemoteControlMessage>,
  ) {
    const video = videoRef.current;
    if (!video) return;
    const coords = getVideoNormalizedCoords(video, clientX, clientY);
    if (!coords) return;
    onControl({ type, ...coords, ...extra } as RemoteControlMessage);
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${controlEnabled ? "cursor-none" : ""}`}
      onMouseMove={(e) => {
        if (!controlEnabled) return;
        emitFromEvent("mousemove", e.clientX, e.clientY);
      }}
      onClick={(e) => {
        if (!controlEnabled) return;
        e.preventDefault();
        emitFromEvent("click", e.clientX, e.clientY, { button: e.button });
      }}
      onDoubleClick={(e) => {
        if (!controlEnabled) return;
        e.preventDefault();
        emitFromEvent("dblclick", e.clientX, e.clientY);
      }}
      onWheel={(e) => {
        if (!controlEnabled) return;
        const video = videoRef.current;
        if (!video) return;
        const coords = getVideoNormalizedCoords(video, e.clientX, e.clientY);
        if (!coords) return;
        onControl({ type: "scroll", ...coords, deltaY: e.deltaY });
      }}
      onKeyDown={(e) => {
        if (!controlEnabled) return;
        onControl({ type: "keydown", key: e.key, x: 0, y: 0 });
      }}
      tabIndex={controlEnabled ? 0 : -1}
      role="application"
      aria-label={label}
    >
      {controlEnabled && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg bg-brand-600/90 px-2.5 py-1 text-[11px] font-medium text-white">
          <MousePointer2 className="h-3 w-3" />
          Controlling device
        </div>
      )}
    </div>
  );
}

interface RemoteCursorOverlayProps {
  cursor: { x: number; y: number } | null;
}

export function RemoteCursorOverlay({ cursor }: RemoteCursorOverlayProps) {
  if (!cursor) return null;

  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: `${cursor.x * 100}vw`,
        top: `${cursor.y * 100}vh`,
        transform: "translate(-2px, -2px)",
      }}
    >
      <MousePointer2 className="h-5 w-5 text-brand-500 drop-shadow-md" fill="currentColor" />
    </div>
  );
}
