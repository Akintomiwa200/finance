import type { RealtimeEvent, RealtimeMessage } from "@/src/types/common";

type MessageHandler<T = unknown> = (message: RealtimeMessage<T>) => void;
type ConnectionHandler = () => void;

interface Subscription {
  entity?: string;
  event?: RealtimeEvent;
  handler: MessageHandler;
}

/* ───────── Event Bus (in-memory, works with any transport) ───────── */

class RealtimeService {
  private subscriptions = new Map<string, Subscription[]>();
  private ws: WebSocket | null = null;
  private sse: EventSource | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private baseDelay = 1000;
  private isConnected = false;
  private onConnectHandlers: ConnectionHandler[] = [];
  private onDisconnectHandlers: ConnectionHandler[] = [];
  private transport: "websocket" | "sse" | "polling" = "polling";
  private pollingTimer: ReturnType<typeof setInterval> | null = null;
  private pollingEndpoint = "/api/realtime/poll";
  private lastPollId = "";

  /* ───────── Connection ───────── */

  connectWebSocket(url: string) {
    this.transport = "websocket";
    this.disconnect();
    this.initWebSocket(url);
  }

  connectSSE(url: string) {
    this.transport = "sse";
    this.disconnect();
    this.initSSE(url);
  }

  startPolling(endpoint?: string, intervalMs = 5000) {
    this.transport = "polling";
    if (endpoint) this.pollingEndpoint = endpoint;
    this.disconnect();
    this.startPollingLoop(intervalMs);
  }

  disconnect() {
    this.ws?.close();
    this.ws = null;
    this.sse?.close();
    this.sse = null;
    if (this.pollingTimer) clearInterval(this.pollingTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.isConnected = false;
  }

  onConnect(handler: ConnectionHandler) {
    this.onConnectHandlers.push(handler);
  }

  onDisconnect(handler: ConnectionHandler) {
    this.onDisconnectHandlers.push(handler);
  }

  /* ───────── Pub/Sub ───────── */

  subscribe(entity: string, event: RealtimeEvent | "*", handler: MessageHandler): () => void {
    const key = this.subKey(entity, event);
    const existing = this.subscriptions.get(key) ?? [];
    const sub: Subscription = { entity, event: event === "*" ? undefined : event, handler };
    existing.push(sub);
    this.subscriptions.set(key, existing);

    return () => {
      const subs = this.subscriptions.get(key) ?? [];
      this.subscriptions.set(
        key,
        subs.filter((s) => s !== sub)
      );
    };
  }

  subscribeAll(handler: MessageHandler): () => void {
    return this.subscribe("*", "*", handler);
  }

  emit(event: RealtimeEvent, entity: string, data: unknown) {
    const message: RealtimeMessage = {
      event,
      entity,
      data,
      timestamp: new Date().toISOString(),
    };

    /* Notify wildcard subscribers */
    this.dispatch("*", "*", message);
    this.dispatch(entity, "*", message);
    this.dispatch(entity, event, message);
  }

  /* ───────── Transport Implementations ───────── */

  private initWebSocket(url: string) {
    try {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnectHandlers.forEach((h) => h());
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as RealtimeMessage;
          this.dispatch(message.entity, message.event, message);
          this.dispatch(message.entity, "*", message);
          this.dispatch("*", "*", message);
        } catch { /* ignore malformed */ }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.onDisconnectHandlers.forEach((h) => h());
        this.scheduleReconnect(() => this.initWebSocket(url));
      };

      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch {
      this.scheduleReconnect(() => this.initWebSocket(url));
    }
  }

  private initSSE(url: string) {
    try {
      this.sse = new EventSource(url);

      this.sse.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.onConnectHandlers.forEach((h) => h());
      };

      this.sse.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as RealtimeMessage;
          this.dispatch(message.entity, message.event, message);
          this.dispatch("*", "*", message);
        } catch { /* ignore */ }
      };

      this.sse.onerror = () => {
        this.isConnected = false;
        this.onDisconnectHandlers.forEach((h) => h());
        this.sse?.close();
        this.scheduleReconnect(() => this.initSSE(url));
      };
    } catch {
      this.scheduleReconnect(() => this.initSSE(url));
    }
  }

  private startPollingLoop(intervalMs: number) {
    this.isConnected = true;
    this.onConnectHandlers.forEach((h) => h());

    this.pollingTimer = setInterval(async () => {
      try {
        const since = this.lastPollId || "";
        const res = await fetch(
          `${this.pollingEndpoint}?since=${encodeURIComponent(since)}&after=${encodeURIComponent(since)}`,
        );
        const data = await res.json();
        const messages: RealtimeMessage[] = Array.isArray(data.events)
          ? data.events
          : Array.isArray(data.messages)
            ? data.messages
            : [];
        for (const msg of messages) {
          this.lastPollId = msg.timestamp;
          this.dispatch(msg.entity, msg.event, msg);
          this.dispatch("*", "*", msg);
        }
      } catch { /* polling error */ }
    }, intervalMs);
  }

  /* ───────── Internals ───────── */

  private subKey(entity: string, event: RealtimeEvent | string): string {
    return `${entity}:${event}`;
  }

  private dispatch(entity: string, event: string, message: RealtimeMessage) {
    const subs = this.subscriptions.get(this.subKey(entity, event)) ?? [];
    for (const sub of subs) {
      try {
        sub.handler(message);
      } catch { /* handler error */ }
    }
  }

  private scheduleReconnect(fn: () => void) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;
    const delay = Math.min(
      this.baseDelay * Math.pow(2, this.reconnectAttempts),
      30_000
    );
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(fn, delay);
  }
}

export const realtime = new RealtimeService();
