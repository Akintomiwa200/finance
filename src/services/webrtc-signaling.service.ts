import type { WebRtcSignalState } from "@/src/types/remote-desktop";

const signals = new Map<string, WebRtcSignalState>();

function emptyState(sessionId: string): WebRtcSignalState {
  return {
    sessionId,
    offer: null,
    answer: null,
    hostIce: [],
    viewerIce: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getSignalState(sessionId: string): WebRtcSignalState {
  if (!signals.has(sessionId)) {
    signals.set(sessionId, emptyState(sessionId));
  }
  return { ...signals.get(sessionId)! };
}

export function setSignalOffer(sessionId: string, offer: RTCSessionDescriptionInit) {
  const state = getSignalState(sessionId);
  state.offer = offer;
  state.answer = null;
  state.hostIce = [];
  state.viewerIce = [];
  state.updatedAt = new Date().toISOString();
  signals.set(sessionId, state);
  return { ...state };
}

export function setSignalAnswer(sessionId: string, answer: RTCSessionDescriptionInit) {
  const state = getSignalState(sessionId);
  state.answer = answer;
  state.updatedAt = new Date().toISOString();
  signals.set(sessionId, state);
  return { ...state };
}

export function addIceCandidate(
  sessionId: string,
  from: "host" | "viewer",
  candidate: RTCIceCandidateInit,
) {
  const state = getSignalState(sessionId);
  if (from === "host") state.hostIce.push(candidate);
  else state.viewerIce.push(candidate);
  state.updatedAt = new Date().toISOString();
  signals.set(sessionId, state);
  return { ...state };
}

export function clearSignalState(sessionId: string) {
  signals.delete(sessionId);
}
