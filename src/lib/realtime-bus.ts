import type { RealtimeMessage } from "@/src/types/common";

const MAX_EVENTS = 500;
const events: RealtimeMessage[] = [];

export function pushRealtimeEvent(message: Omit<RealtimeMessage, "timestamp">) {
  const entry: RealtimeMessage = {
    ...message,
    timestamp: new Date().toISOString(),
  };

  events.unshift(entry);
  if (events.length > MAX_EVENTS) {
    events.length = MAX_EVENTS;
  }

  return entry;
}

export function pollRealtimeEvents(since?: string): RealtimeMessage[] {
  if (!since) return [...events];

  const sinceTime = new Date(since).getTime();
  return events.filter((event) => new Date(event.timestamp).getTime() > sinceTime);
}

export function getLatestEventTimestamp(): string {
  return events[0]?.timestamp ?? new Date(0).toISOString();
}
