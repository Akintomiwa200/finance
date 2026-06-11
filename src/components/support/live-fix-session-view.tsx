"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { StatusBadge } from "@/src/components/ui/status-badge";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Dialog, DialogContent } from "@/src/components/ui/dialog";
import { Label } from "@/src/components/ui/label";
import { useLiveFixMedia } from "@/src/hooks/use-live-fix-media";
import { useRemoteDesktop } from "@/src/hooks/use-remote-desktop";
import {
  RemoteDesktopViewport,
  RemoteCursorOverlay,
} from "@/src/components/support/remote-desktop-viewport";
import { useToast } from "@/src/components/ui/use-toast";
import { api } from "@/src/lib/api";
import type { LiveFixSession, LiveFixChatMessage, LiveFixSessionState } from "@/src/types/admin";
import {
  Monitor,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  ScreenShare,
  Settings,
  Copy,
  Check,
  Loader2,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Wifi,
  Clipboard,
  Download,
  Hand,
  Send,
  Laptop,
  MousePointer2,
} from "lucide-react";

interface LiveFixSessionViewProps {
  session: LiveFixSession | undefined;
  mode: "admin" | "customer";
  breadcrumbs: { label: string; href?: string }[];
  onEndSession?: () => void;
  isEnding?: boolean;
}

function buildSystemInfo(session: LiveFixSession | undefined) {
  return {
    sessionId: session?.id,
    sessionCode: session?.sessionCode,
    organization: session?.organizationName,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${window.screen.width}x${window.screen.height}`,
    pixelRatio: window.devicePixelRatio,
    online: navigator.onLine,
    capturedAt: new Date().toISOString(),
  };
}

export function LiveFixSessionView({
  session,
  mode,
  onEndSession,
  isEnding,
}: LiveFixSessionViewProps) {
  const { toast } = useToast();
  const router = useRouter();
  const sessionId = session?.id ?? "";
  const apiBase =
    mode === "admin"
      ? `/api/admin/support/live-fix/${sessionId}`
      : `/api/support/live-fix/${sessionId}`;

  const [isConnected, setIsConnected] = useState(session?.status === "active");
  const [copied, setCopied] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<LiveFixChatMessage[]>([]);
  const [peerState, setPeerState] = useState<LiveFixSessionState | null>(null);
  const [sendingChat, setSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const media = useLiveFixMedia({
    enabled: isConnected,
    startWithCamera: isConnected,
  });

  const controlGranted = peerState?.remoteControlGranted ?? false;

  const remoteDesktop = useRemoteDesktop({
    sessionId,
    apiBase,
    role: mode === "admin" ? "viewer" : "host",
    enabled: isConnected,
    controlGranted: mode === "customer" ? controlGranted : false,
    onNavigate: mode === "customer" ? (path) => router.push(path) : undefined,
  });

  const coBrowseRoutes = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Support", path: "/support" },
    { label: "Transactions", path: "/dashboard/transactions" },
    { label: "Settings", path: "/settings" },
  ];

  const handleNavigateCustomer = (path: string) => {
    if (!controlGranted) {
      toast({
        title: "Control not granted",
        description: "Customer must approve remote control first",
        variant: "destructive",
      });
      return;
    }
    remoteDesktop.sendControl({ type: "navigate", path });
    toast({ title: "Navigating customer", description: `Opening ${path} on their screen` });
  };

  useEffect(() => {
    if (session?.status === "active") {
      const timer = setTimeout(() => setIsConnected(true), 800);
      return () => clearTimeout(timer);
    }
    setIsConnected(false);
  }, [session?.status]);

  const syncState = useCallback(
    async (patch: Partial<LiveFixSessionState>) => {
      if (!sessionId) return;
      await api.patch(`${apiBase}/state`, patch);
    },
    [apiBase, sessionId],
  );

  const fetchChat = useCallback(async () => {
    if (!sessionId) return;
    const result = await api.get<LiveFixChatMessage[]>(`${apiBase}/chat`);
    if (result.success && result.data) setMessages(result.data);
  }, [apiBase, sessionId]);

  const fetchState = useCallback(async () => {
    if (!sessionId) return;
    const result = await api.get<LiveFixSessionState>(`${apiBase}/state`);
    if (result.success && result.data) setPeerState(result.data);
  }, [apiBase, sessionId]);

  useEffect(() => {
    if (!sessionId || !isConnected) return;
    void fetchChat();
    void fetchState();
    const interval = setInterval(() => {
      void fetchChat();
      void fetchState();
    }, 2000);
    return () => clearInterval(interval);
  }, [sessionId, isConnected, fetchChat, fetchState]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isConnected) return;
    void syncState({
      isMuted: media.isMuted,
      isVideoOff: media.isVideoOff,
      isSharing: remoteDesktop.isSharing,
      activeRemoteTool: remoteDesktop.isSharing || remoteDesktop.hasRemoteStream ? "Built-in Remote Desktop" : null,
    });
  }, [
    media.isMuted,
    media.isVideoOff,
    remoteDesktop.isSharing,
    remoteDesktop.hasRemoteStream,
    isConnected,
    syncState,
  ]);

  const sessionCode = session?.sessionCode ?? "------";
  const adminControlling = mode === "admin" && controlGranted && remoteDesktop.hasRemoteStream;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied", description: "Session code copied to clipboard" });
  };

  const handleToggleMute = () => {
    const willMute = !media.isMuted;
    media.toggleMute();
    toast({
      title: willMute ? "Microphone muted" : "Microphone on",
      description: willMute ? "You are muted" : "Your mic is now live",
    });
  };

  const handleToggleVideo = async () => {
    const willTurnOff = !media.isVideoOff;
    await media.toggleVideo();
    toast({
      title: willTurnOff ? "Camera off" : "Camera on",
      description: willTurnOff ? "Camera disabled" : "Camera is live",
    });
  };

  const handleToggleScreenShare = async () => {
    if (mode === "admin") {
      toast({
        title: "Customer must share",
        description: "Ask the customer to start screen sharing from their session",
      });
      return;
    }
    const started = await remoteDesktop.toggleSharing();
    await syncState({ isSharing: started });
    toast({
      title: started ? "Screen sharing" : "Screen share stopped",
      description: started
        ? "Your screen is now streamed to the support agent"
        : "Remote desktop session ended",
    });
  };

  const handleSendChat = async () => {
    const content = chatInput.trim();
    if (!content || !sessionId) return;
    setSendingChat(true);
    const result = await api.post(`${apiBase}/chat`, { content });
    if (result.success) {
      setChatInput("");
      await fetchChat();
    } else {
      toast({
        title: "Failed to send",
        description: result.error ?? "Could not send message",
        variant: "destructive",
      });
    }
    setSendingChat(false);
  };

  const handleRemoteControl = async () => {
    if (mode === "admin") {
      await syncState({ remoteControlRequested: true });
      toast({
        title: "Control requested",
        description: "Customer must approve before you can operate their device",
      });
    } else {
      const granted = !controlGranted;
      await syncState({ remoteControlGranted: granted, remoteControlRequested: false });
      toast({
        title: granted ? "Control granted" : "Control revoked",
        description: granted
          ? "Agent can now control your shared screen in-app"
          : "Remote control disabled",
      });
    }
  };

  const handleCopySystemInfo = async () => {
    const info = buildSystemInfo(session);
    await navigator.clipboard.writeText(JSON.stringify(info, null, 2));
    toast({ title: "Copied", description: "System info copied to clipboard" });
  };

  const handleDownloadLogs = () => {
    const payload = {
      session,
      system: buildSystemInfo(session),
      media: {
        isMuted: media.isMuted,
        isVideoOff: media.isVideoOff,
        isSharing: remoteDesktop.isSharing,
        connectionQuality: media.connectionQuality,
        remoteDesktopStatus: remoteDesktop.status,
      },
      peerState,
      messages,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `live-fix-${sessionCode}-diagnostics.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded", description: "Diagnostic logs saved" });
  };

  const desktopStatusLabel = (() => {
    if (remoteDesktop.status === "connected") return "Connected";
    if (remoteDesktop.status === "connecting") return "Connecting";
    if (remoteDesktop.isSharing || remoteDesktop.hasRemoteStream) return "Active";
    return "Ready";
  })();

  return (
    <>
      {mode === "customer" && controlGranted && (
        <RemoteCursorOverlay cursor={remoteDesktop.remoteCursor} />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center relative overflow-hidden">
                {isConnected ? (
                  <>
                    {mode === "admin" && remoteDesktop.hasRemoteStream ? (
                      <>
                        <video
                          ref={remoteDesktop.remoteVideoRef}
                          autoPlay
                          playsInline
                          className="absolute inset-0 h-full w-full object-contain bg-black"
                        />
                        <RemoteDesktopViewport
                          videoRef={remoteDesktop.remoteVideoRef}
                          controlEnabled={adminControlling}
                          onControl={remoteDesktop.sendControl}
                        />
                      </>
                    ) : mode === "customer" && remoteDesktop.isSharing ? (
                      <video
                        ref={remoteDesktop.localPreviewRef}
                        autoPlay
                        playsInline
                        muted
                        className="absolute inset-0 h-full w-full object-contain bg-black"
                      />
                    ) : (
                      <div className="relative z-10 text-center px-6">
                        <Monitor className="h-20 w-20 text-slate-500 mb-4 mx-auto" />
                        <p className="text-slate-300 text-sm font-medium">
                          {mode === "admin"
                            ? "Waiting for customer screen"
                            : "Share your screen with support"}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                          {mode === "admin"
                            ? "Customer must click screen share to begin remote desktop"
                            : "Click the screen share button to start in-app remote desktop"}
                        </p>
                        {remoteDesktop.status === "connecting" && (
                          <Loader2 className="h-6 w-6 animate-spin text-slate-400 mx-auto mt-4" />
                        )}
                      </div>
                    )}

                    <div className="absolute bottom-4 right-4 w-40 aspect-video bg-slate-700 rounded-lg border border-slate-600 overflow-hidden shadow-lg z-20">
                      {media.isVideoOff ? (
                        <div className="w-full h-full flex items-center justify-center bg-slate-800">
                          <VideoOff className="h-6 w-6 text-slate-400" />
                        </div>
                      ) : (
                        <video
                          ref={media.cameraVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="h-full w-full object-cover"
                          style={{ transform: "scaleX(-1)" }}
                        />
                      )}
                    </div>

                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs z-20">
                      {media.connectionQuality === "excellent" && (
                        <SignalHigh className="h-3.5 w-3.5 text-success" />
                      )}
                      {media.connectionQuality === "good" && (
                        <SignalMedium className="h-3.5 w-3.5 text-info" />
                      )}
                      {media.connectionQuality === "poor" && (
                        <SignalLow className="h-3.5 w-3.5 text-warning" />
                      )}
                      <span className="capitalize">{media.connectionQuality}</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-muted-foreground">Live · Encrypted</span>
                    </div>

                    {adminControlling && (
                      <div className="absolute top-4 right-4 bg-brand-600/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 z-20">
                        <MousePointer2 className="h-3.5 w-3.5" />
                        You are controlling this device
                      </div>
                    )}

                    {peerState?.remoteControlRequested && mode === "customer" && !controlGranted && (
                      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                        <div className="bg-amber-500/90 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                          <Hand className="h-3.5 w-3.5" />
                          Agent requesting control
                        </div>
                        <Button size="sm" onClick={() => void handleRemoteControl()}>
                          Approve remote control
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center px-6">
                    <Loader2 className="h-12 w-12 animate-spin text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-300">
                      {session?.status === "waiting"
                        ? "Waiting for support agent to join..."
                        : "Session ended"}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Share code <span className="font-mono font-bold">{sessionCode}</span> with your agent
                    </p>
                  </div>
                )}
              </div>
              {(media.mediaError || remoteDesktop.error) && (
                <p className="px-4 py-2 text-xs text-destructive bg-destructive/10">
                  {remoteDesktop.error ?? media.mediaError}
                </p>
              )}
            </CardContent>
          </Card>

          {isConnected && (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button
                variant={media.isMuted ? "danger" : "outline"}
                size="icon"
                onClick={handleToggleMute}
                className="h-12 w-12 rounded-full"
                title={media.isMuted ? "Unmute" : "Mute"}
              >
                {media.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                variant={media.isVideoOff ? "danger" : "outline"}
                size="icon"
                onClick={handleToggleVideo}
                className="h-12 w-12 rounded-full"
                title={media.isVideoOff ? "Turn camera on" : "Turn camera off"}
              >
                {media.isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
              </Button>
              {mode === "customer" && (
                <Button
                  variant={remoteDesktop.isSharing ? "primary" : "outline"}
                  size="icon"
                  onClick={() => void handleToggleScreenShare()}
                  className="h-12 w-12 rounded-full"
                  title={remoteDesktop.isSharing ? "Stop sharing" : "Share screen"}
                >
                  <ScreenShare className="h-5 w-5" />
                </Button>
              )}
              {onEndSession && (
                <Button
                  variant="danger"
                  size="icon"
                  onClick={onEndSession}
                  loading={isEnding}
                  className="h-14 w-14 rounded-full"
                  title="End session"
                >
                  <Phone className="h-6 w-6 rotate-[135deg]" />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => {
                  void media.refreshDevices();
                  setSettingsOpen(true);
                }}
                title="Session settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          )}

          <Card className="border-brand-200 bg-brand-50/50 dark:border-brand-900 dark:bg-brand-950/20">
            <CardContent className="p-4 space-y-2 text-sm">
              <p className="font-medium text-foreground">Browser remote assist (no desktop app)</p>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                {mode === "customer" ? (
                  <>
                    <li>
                      When sharing, choose <strong className="text-foreground">This tab</strong> (not
                      Entire screen) so the agent can click buttons in your app.
                    </li>
                    <li>Keep this live-fix tab open while the session runs.</li>
                    <li>Approve control only when you trust the support agent.</li>
                  </>
                ) : (
                  <>
                    <li>Ask the customer to share <strong className="text-foreground">this browser tab</strong>.</li>
                    <li>Request control, then click directly on their live view.</li>
                    <li>
                      Or use <strong className="text-foreground">Co-browse</strong> below to open pages on
                      their session without pixel-perfect clicks.
                    </li>
                  </>
                )}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Session Code</p>
                  <p className="text-xs text-muted-foreground">
                    {mode === "admin"
                      ? "Use this code to verify the customer session"
                      : "Share this code with your support agent"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-mono font-bold tracking-wider">{sessionCode}</code>
                  <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                    {copied ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <span className="text-muted-foreground block mb-1">Status</span>
                <StatusBadge status={session?.status || "waiting"} />
              </div>
              {session?.organizationName && (
                <div>
                  <span className="text-muted-foreground block mb-1">Company</span>
                  <p className="font-medium">{session.organizationName}</p>
                </div>
              )}
              {session?.requestedBy && (
                <div>
                  <span className="text-muted-foreground block mb-1">Requested By</span>
                  <p>{session.requestedBy}</p>
                </div>
              )}
              <div>
                <span className="text-muted-foreground block mb-1">Connection</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-warning"}`}
                  />
                  <span>
                    {remoteDesktop.status === "connected"
                      ? "WebRTC · Live"
                      : isConnected
                        ? "Peer-to-peer · Live"
                        : "Waiting..."}
                  </span>
                </div>
              </div>
              {controlGranted && (
                <div>
                  <span className="text-muted-foreground block mb-1">Remote Control</span>
                  <Badge variant="success">Granted · In-app</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Built-in Remote Desktop</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                  <Laptop className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">In-app remote assist</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    TeamViewer-style screen view and control, fully inside this app via WebRTC.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant={desktopStatusLabel === "Connected" ? "success" : "secondary"}>
                      {desktopStatusLabel}
                    </Badge>
                    {remoteDesktop.hasRemoteStream && mode === "admin" && (
                      <Badge variant="default">Viewing screen</Badge>
                    )}
                    {remoteDesktop.isSharing && mode === "customer" && (
                      <Badge variant="default">Sharing screen</Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {mode === "admin"
                  ? "Works fully in the browser — no TeamViewer install required."
                  : "Share this tab so the agent can help inside the app in real time."}
              </p>
            </CardContent>
          </Card>

          {mode === "admin" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Co-browse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">
                  Open a page on the customer&apos;s browser (best when control is granted).
                </p>
                {coBrowseRoutes.map((route) => (
                  <Button
                    key={route.path}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    disabled={!remoteDesktop.hasRemoteStream}
                    onClick={() => handleNavigateCustomer(route.path)}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Open {route.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => void handleRemoteControl()}
              >
                <Monitor className="h-4 w-4 mr-2" />
                {mode === "admin" ? "Request Control" : controlGranted ? "Revoke Control" : "Allow Remote Control"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => void handleCopySystemInfo()}
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Copy System Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={handleDownloadLogs}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Diagnostic Logs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Session Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-36 overflow-y-auto space-y-3 text-sm pr-1">
                {messages.length === 0 ? (
                  <div className="text-xs text-muted-foreground text-center py-4">No messages yet</div>
                ) : (
                  messages.map((msg) => {
                    const isSelf =
                      (mode === "admin" && msg.author === "admin") ||
                      (mode === "customer" && msg.author === "customer");
                    return (
                      <div
                        key={msg.id}
                        className={`rounded-lg p-2.5 ${isSelf ? "bg-muted" : "bg-brand-50 dark:bg-brand-950/40 ml-2"}`}
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          {isSelf ? "You" : msg.authorName}
                        </p>
                        <p>{msg.content}</p>
                      </div>
                    );
                  })
                )}
                <div ref={chatEndRef} />
              </div>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleSendChat();
                }}
              >
                <Input
                  placeholder="Type a message..."
                  className="h-8 text-sm"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={!isConnected || sendingChat}
                />
                <Button size="sm" type="submit" disabled={!chatInput.trim() || sendingChat || !isConnected}>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen} title="Session Settings">
          <DialogContent className="max-w-md">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Microphone</Label>
                <select
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                  value={media.selectedAudioId}
                  onChange={(e) => media.setSelectedAudioId(e.target.value)}
                >
                  <option value="">Default microphone</option>
                  {media.audioDevices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Camera</Label>
                <select
                  className="w-full h-9 rounded-md border border-border bg-background px-3 text-sm"
                  value={media.selectedVideoId}
                  onChange={(e) => media.setSelectedVideoId(e.target.value)}
                >
                  <option value="">Default camera</option>
                  {media.videoDevices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => void media.startCamera()}
              >
                Apply devices
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export function LiveFixSessionHeader({
  session,
  isConnected,
}: {
  session: LiveFixSession | undefined;
  isConnected: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <Badge variant="success" className="animate-pulse">
          <Wifi className="h-3 w-3 mr-1" /> Live
        </Badge>
      ) : (
        <Badge variant="warning">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />{" "}
          {session?.status === "ended" ? "Ended" : "Connecting"}
        </Badge>
      )}
    </div>
  );
}
