"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface MediaDeviceOption {
  deviceId: string;
  label: string;
}

interface UseLiveFixMediaOptions {
  enabled: boolean;
  startWithCamera?: boolean;
}

export function useLiveFixMedia({ enabled, startWithCamera = true }: UseLiveFixMediaOptions) {
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceOption[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceOption[]>([]);
  const [selectedAudioId, setSelectedAudioId] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor">("good");

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const devices = await navigator.mediaDevices.enumerateDevices();
    setAudioDevices(
      devices
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Microphone" })),
    );
    setVideoDevices(
      devices
        .filter((d) => d.kind === "videoinput")
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Camera" })),
    );
  }, []);

  const attachCameraStream = useCallback((stream: MediaStream) => {
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current = stream;
    if (cameraVideoRef.current) {
      cameraVideoRef.current.srcObject = stream;
      void cameraVideoRef.current.play().catch(() => {});
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError("Camera not supported in this browser");
      return;
    }
    try {
      const constraints: MediaStreamConstraints = {
        audio: selectedAudioId ? { deviceId: { exact: selectedAudioId } } : true,
        video: selectedVideoId
          ? { deviceId: { exact: selectedVideoId }, width: { ideal: 1280 }, height: { ideal: 720 } }
          : { width: { ideal: 1280 }, height: { ideal: 720 } },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      attachCameraStream(stream);
      setIsVideoOff(false);
      setMediaError(null);
      await refreshDevices();
    } catch {
      setMediaError("Camera or microphone permission denied");
    }
  }, [attachCameraStream, refreshDevices, selectedAudioId, selectedVideoId]);

  const stopCamera = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current = null;
    if (cameraVideoRef.current) cameraVideoRef.current.srcObject = null;
  }, []);

  const toggleMute = useCallback(() => {
    const stream = cameraStreamRef.current;
    if (!stream) return;
    const next = !isMuted;
    stream.getAudioTracks().forEach((t) => {
      t.enabled = !next;
    });
    setIsMuted(next);
  }, [isMuted]);

  const toggleVideo = useCallback(async () => {
    if (isVideoOff) {
      await startCamera();
      return;
    }
    cameraStreamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = false;
    });
    setIsVideoOff(true);
  }, [isVideoOff, startCamera]);

  const startScreenShare = useCallback(async () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setMediaError("Screen sharing not supported in this browser");
      return false;
    }
    try {
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" } as MediaTrackConstraints,
        audio: false,
      });
      screenStreamRef.current = stream;
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = stream;
        void screenVideoRef.current.play().catch(() => {});
      }
      stream.getVideoTracks()[0]?.addEventListener("ended", () => {
        setIsSharing(false);
        screenStreamRef.current = null;
        if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
      });
      setIsSharing(true);
      setMediaError(null);
      return true;
    } catch {
      setMediaError("Screen share permission denied");
      return false;
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
    setIsSharing(false);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (isSharing) {
      stopScreenShare();
      return false;
    }
    return startScreenShare();
  }, [isSharing, startScreenShare, stopScreenShare]);

  useEffect(() => {
    if (!enabled || !startWithCamera) return;
    void startCamera();
  }, [enabled, startWithCamera, startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
      stopScreenShare();
    };
  }, [stopCamera, stopScreenShare]);

  useEffect(() => {
    const conn = (
      navigator as Navigator & {
        connection?: EventTarget & { effectiveType?: string };
      }
    ).connection;
    if (!conn) return;

    const updateQuality = () => {
      const type = conn.effectiveType;
      if (type === "4g") setConnectionQuality("excellent");
      else if (type === "3g") setConnectionQuality("good");
      else setConnectionQuality("poor");
    };

    updateQuality();
    conn.addEventListener("change", updateQuality);
    return () => conn.removeEventListener("change", updateQuality);
  }, []);

  return {
    cameraVideoRef,
    screenVideoRef,
    isMuted,
    isVideoOff,
    isSharing,
    mediaError,
    connectionQuality,
    audioDevices,
    videoDevices,
    selectedAudioId,
    selectedVideoId,
    setSelectedAudioId,
    setSelectedVideoId,
    refreshDevices,
    startCamera,
    toggleMute,
    toggleVideo,
    toggleScreenShare,
    stopScreenShare,
    stopCamera,
  };
}
