import type { RemoteControlMessage } from "@/src/types/remote-desktop";

interface RemoteControlHandlers {
  onNavigate?: (path: string) => void;
}

export function applyRemoteControlEvent(
  event: RemoteControlMessage,
  controlGranted: boolean,
  handlers?: RemoteControlHandlers,
): { x: number; y: number } | null {
  if (event.type === "mousemove") {
    return { x: event.x, y: event.y };
  }

  if (!controlGranted) return null;

  if (event.type === "navigate" && handlers?.onNavigate) {
    handlers.onNavigate(event.path);
    return null;
  }

  if (event.type === "keydown") {
    const active = document.activeElement as HTMLElement | null;
    active?.dispatchEvent(
      new KeyboardEvent("keydown", { key: event.key, bubbles: true, cancelable: true }),
    );
    return null;
  }

  if (event.type === "scroll") {
    window.scrollBy({ top: event.deltaY, behavior: "auto" });
    return null;
  }

  if (event.type !== "click" && event.type !== "dblclick") return null;

  const px = Math.round(event.x * window.innerWidth);
  const py = Math.round(event.y * window.innerHeight);

  if (event.type === "click" || event.type === "dblclick") {
    const target = document.elementFromPoint(px, py) as HTMLElement | null;
    if (!target) return null;

    const init: MouseEventInit = {
      bubbles: true,
      cancelable: true,
      clientX: px,
      clientY: py,
      button: event.type === "click" ? (event.button ?? 0) : 0,
      view: window,
    };

    target.dispatchEvent(new MouseEvent("mousedown", init));
    target.dispatchEvent(new MouseEvent("mouseup", init));
    target.dispatchEvent(
      new MouseEvent(event.type === "dblclick" ? "dblclick" : "click", init),
    );
    target.focus?.();
    return { x: event.x, y: event.y };
  }

  return null;
}

/** Best-effort prompt: share this tab so clicks map to the live page. */
export async function requestTabShare(): Promise<MediaStream | null> {
  if (!navigator.mediaDevices?.getDisplayMedia) return null;

  try {
    return await navigator.mediaDevices.getDisplayMedia({
      video: {
        displaySurface: "browser",
      } as MediaTrackConstraints,
      audio: false,
      // Chrome: prefer sharing the tab the user is on
      preferCurrentTab: true,
    } as DisplayMediaStreamOptions);
  } catch {
    return null;
  }
}

export function getVideoNormalizedCoords(
  video: HTMLVideoElement,
  clientX: number,
  clientY: number,
): { x: number; y: number } | null {
  const rect = video.getBoundingClientRect();
  const videoW = video.videoWidth || rect.width;
  const videoH = video.videoHeight || rect.height;
  if (!videoW || !videoH) return null;

  const scale = Math.min(rect.width / videoW, rect.height / videoH);
  const displayW = videoW * scale;
  const displayH = videoH * scale;
  const offsetX = (rect.width - displayW) / 2;
  const offsetY = (rect.height - displayH) / 2;
  const x = (clientX - rect.left - offsetX) / displayW;
  const y = (clientY - rect.top - offsetY) / displayH;

  if (x < 0 || x > 1 || y < 0 || y > 1) return null;
  return { x, y };
}
