import { useSessionSettingsStore, type SessionTimeoutMinutes } from "@/src/store/session-settings-store";

export function normalizeSessionTimeout(value: unknown, fallback = 30): SessionTimeoutMinutes {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return fallback as SessionTimeoutMinutes;
  return parsed as SessionTimeoutMinutes;
}

export function applySessionTimeoutFromSettings(
  sessionData: Record<string, unknown> | null | undefined,
  securityData?: Record<string, unknown> | null | undefined,
) {
  const fromSession = sessionData?.inactivityTimeoutMinutes;
  const fromSecurity = securityData?.sessionTimeout;
  const minutes = normalizeSessionTimeout(
    fromSession ?? fromSecurity ?? useSessionSettingsStore.getState().inactivityTimeoutMinutes,
  );
  useSessionSettingsStore.getState().setInactivityTimeout(minutes);
  return minutes;
}
