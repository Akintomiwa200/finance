export type RemoteDesktopRole = "host" | "viewer";

export interface WebRtcSignalState {
  sessionId: string;
  offer: RTCSessionDescriptionInit | null;
  answer: RTCSessionDescriptionInit | null;
  hostIce: RTCIceCandidateInit[];
  viewerIce: RTCIceCandidateInit[];
  updatedAt: string;
}

export type RemoteControlMessage =
  | { type: "mousemove"; x: number; y: number }
  | { type: "click"; x: number; y: number; button?: number }
  | { type: "dblclick"; x: number; y: number }
  | { type: "keydown"; key: string; x?: number; y?: number }
  | { type: "scroll"; x: number; y: number; deltaY: number }
  | { type: "navigate"; path: string };

export type RemoteDesktopStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "failed";
