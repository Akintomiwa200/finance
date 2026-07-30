import { db } from "@/src/lib/db";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import {
  appearanceFromOrgGeneral,
  DEFAULT_USER_APPEARANCE,
  normalizeUserAppearance,
  type UserAppearanceSettings,
} from "@/src/types/user-appearance";

type StoredPreferences = {
  appearance?: Partial<UserAppearanceSettings>;
};

function readStoredAppearance(raw: unknown): UserAppearanceSettings | null {
  if (!raw || typeof raw !== "object") return null;
  const appearance = (raw as StoredPreferences).appearance;
  if (!appearance || typeof appearance !== "object") return null;
  return normalizeUserAppearance(appearance);
}

export async function getUserAppearance(
  userId: string,
  organizationId?: string | null,
): Promise<UserAppearanceSettings> {
  const employee = await db.employee.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  const stored = readStoredAppearance(employee?.preferences);
  if (stored) return stored;

  if (organizationId) {
    const org = await db.organization.findUnique({
      where: { id: organizationId },
      select: { settings: true },
    });
    const general = (org?.settings as Record<string, unknown> | null)?.general;
    if (general && typeof general === "object") {
      return appearanceFromOrgGeneral(general as Record<string, unknown>);
    }
  }

  return { ...DEFAULT_USER_APPEARANCE };
}

export async function updateUserAppearance(
  userId: string,
  patch: Partial<UserAppearanceSettings>,
): Promise<UserAppearanceSettings> {
  const current = await getUserAppearance(userId);
  const next = normalizeUserAppearance(
    {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    },
    current,
  );

  const employee = await db.employee.findUnique({
    where: { id: userId },
    select: { preferences: true },
  });

  const preferences =
    employee?.preferences && typeof employee.preferences === "object"
      ? { ...(employee.preferences as StoredPreferences) }
      : {};

  preferences.appearance = next;

  await db.employee.update({
    where: { id: userId },
    data: { preferences },
  });

  pushRealtimeEvent({
    entity: "user-appearance",
    event: "update",
    data: { userId, appearance: next },
  });

  return next;
}
