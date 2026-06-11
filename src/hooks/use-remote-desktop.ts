"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/src/lib/api";
import { applyRemoteControlEvent, requestTabShare } from "@/src/lib/remote-control";
import type {
  RemoteControlMessage,
  RemoteDesktopRole,
  RemoteDesktopStatus,
  WebRtcSignalState,
} from "@/src/types/remote-desktop";

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

interface UseRemoteDesktopOptions {
  sessionId: string;
  apiBase: string;
  role: RemoteDesktopRole;
  enabled: boolean;
  controlGranted: boolean;
  onNavigate?: (path: string) => void;
}

export function useRemoteDesktop({
  sessionId,
  apiBase,
  role,
  enabled,
  controlGranted,
  onNavigate,
}: UseRemoteDesktopOptions) {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localPreviewRef = useRef<HTMLVideoElement>(null);
  const appliedIceHost = useRef(0);
  const appliedIceViewer = useRef(0);
  const makingOfferRef = useRef(false);

  const [status, setStatus] = useState<RemoteDesktopStatus>("idle");
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remoteCursor, setRemoteCursor] = useState<{ x: number; y: number } | null>(null);
  const [hasRemoteStream, setHasRemoteStream] = useState(false);

  const cleanup = useCallback(() => {
    dataChannelRef.current?.close();
    dataChannelRef.current = null;
    pcRef.current?.close();
    pcRef.current = null;
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (localPreviewRef.current) localPreviewRef.current.srcObject = null;
    appliedIceHost.current = 0;
    appliedIceViewer.current = 0;
    makingOfferRef.current = false;
    setHasRemoteStream(false);
    setIsSharing(false);
    setStatus("idle");
  }, []);

  const postSignal = useCallback(
    async (payload: Record<string, unknown>) => {
      await api.post(`${apiBase}/signal`, payload);
    },
    [apiBase],
  );

  const fetchSignal = useCallback(async (): Promise<WebRtcSignalState | null> => {
    const result = await api.get<WebRtcSignalState>(`${apiBase}/signal`);
    return result.success && result.data ? result.data : null;
  }, [apiBase]);

  const sendControl = useCallback((message: RemoteControlMessage) => {
    const channel = dataChannelRef.current;
    if (!channel || channel.readyState !== "open") return;
    channel.send(JSON.stringify(message));
  }, []);

  const setupDataChannel = useCallback(
    (channel: RTCDataChannel) => {
      dataChannelRef.current = channel;

      channel.onmessage = (ev) => {
        try {
          const message = JSON.parse(String(ev.data)) as RemoteControlMessage;
          const cursor = applyRemoteControlEvent(message, controlGranted, { onNavigate });
          if (cursor) setRemoteCursor(cursor);
        } catch {
          /* ignore malformed */
        }
      };
    },
    [controlGranted, onNavigate],
  );

  const createPeer = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    pcRef.current = pc;

    pc.onicecandidate = (ev) => {
      if (!ev.candidate) return;
      void postSignal({
        type: "ice",
        candidate: ev.candidate.toJSON(),
      });
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      if (state === "connected") setStatus("connected");
      else if (state === "connecting") setStatus("connecting");
      else if (state === "failed") {
        setStatus("failed");
        setError("WebRTC connection failed");
      } else if (state === "disconnected" || state === "closed") {
        setStatus("disconnected");
        setHasRemoteStream(false);
      }
    };

    pc.ontrack = (ev) => {
      const stream = ev.streams[0] ?? new MediaStream([ev.track]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
        void remoteVideoRef.current.play().catch(() => {});
      }
      setHasRemoteStream(true);
      setStatus("connected");
    };

    pc.ondatachannel = (ev) => setupDataChannel(ev.channel);

    return pc;
  }, [postSignal, setupDataChannel]);

  const applyRemoteIce = useCallback(
    async (pc: RTCPeerConnection, state: WebRtcSignalState) => {
      const iceList = role === "host" ? state.viewerIce : state.hostIce;
      const start = role === "host" ? appliedIceViewer.current : appliedIceHost.current;

      for (let i = start; i < iceList.length; i++) {
        try {
          await pc.addIceCandidate(iceList[i]);
        } catch {
          /* ignore duplicate/stale */
        }
      }

      if (role === "host") appliedIceViewer.current = iceList.length;
      else appliedIceHost.current = iceList.length;
    },
    [role],
  );

  const stopSharing = useCallback(async () => {
    if (role === "host") {
      await postSignal({ type: "reset" });
    }
    cleanup();
    setStatus("idle");
  }, [role, postSignal, cleanup]);

  const startSharing = useCallback(async () => {
    if (role !== "host" || !enabled || !sessionId) return false;
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setError("Screen sharing is not supported in this browser");
      return false;
    }

    try {
      cleanup();
      setStatus("connecting");
      setError(null);

      const displayStream =
        (await requestTabShare()) ??
        (await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        }));

      displayStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        void stopSharing();
      });

      screenStreamRef.current = displayStream;
      if (localPreviewRef.current) {
        localPreviewRef.current.srcObject = displayStream;
        void localPreviewRef.current.play().catch(() => {});
      }

      const pc = createPeer();
      const controlChannel = pc.createDataChannel("control", { ordered: true });
      setupDataChannel(controlChannel);

      displayStream.getTracks().forEach((track) => pc.addTrack(track, displayStream));

      makingOfferRef.current = true;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await postSignal({ type: "offer", sdp: pc.localDescription });
      makingOfferRef.current = false;

      setIsSharing(true);
      setStatus("connecting");
      return true;
    } catch {
      setError("Screen share permission denied");
      cleanup();
      return false;
    }
  }, [role, enabled, sessionId, cleanup, createPeer, setupDataChannel, postSignal, stopSharing]);

  const connectAsViewer = useCallback(
    async (state: WebRtcSignalState) => {
      if (role !== "viewer" || !state.offer || makingOfferRef.current) return;

      let pc = pcRef.current;
      if (!pc) {
        pc = createPeer();
      }

      if (!pc.currentRemoteDescription) {
        await pc.setRemoteDescription(state.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await postSignal({ type: "answer", sdp: pc.localDescription });
      }

      await applyRemoteIce(pc, state);
    },
    [role, createPeer, postSignal, applyRemoteIce],
  );

  const pollSignaling = useCallback(async () => {
    if (!enabled || !sessionId) return;
    const state = await fetchSignal();
    if (!state) return;

    const pc = pcRef.current;

    if (role === "host" && pc) {
      if (state.answer && !pc.currentRemoteDescription) {
        await pc.setRemoteDescription(state.answer);
        setStatus("connecting");
      }
      await applyRemoteIce(pc, state);
    }

    if (role === "viewer" && state.offer) {
      await connectAsViewer(state);
    }
  }, [enabled, sessionId, fetchSignal, role, applyRemoteIce, connectAsViewer]);

  useEffect(() => {
    if (!enabled || !sessionId) return;
    void pollSignaling();
    const interval = setInterval(() => void pollSignaling(), 1500);
    return () => clearInterval(interval);
  }, [enabled, sessionId, pollSignaling]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const toggleSharing = useCallback(async () => {
    if (isSharing) {
      await stopSharing();
      return false;
    }
    return startSharing();
  }, [isSharing, stopSharing, startSharing]);

  return {
    remoteVideoRef,
    localPreviewRef,
    status,
    isSharing,
    hasRemoteStream,
    error,
    remoteCursor,
    sendControl,
    startSharing,
    stopSharing,
    toggleSharing,
  };
}
