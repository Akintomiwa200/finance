import { db } from "@/src/lib/db";
import { pushRealtimeEvent } from "@/src/lib/realtime-bus";
import {
  DEFAULT_TENANT_SETTINGS,
  mergeTenantSettings,
  type TenantSettingsKey,
} from "@/src/lib/organization-settings-defaults";

const ALLOWED_SECTIONS: TenantSettingsKey[] = [
  "general",
  "session",
  "regional",
  "notifications",
  "organization",
  "branding",
  "fiscalYear",
  "security",
  "accounting",
  "payroll",
  "tax",
  "integrations",
  "backup",
];

export async function getTenantSettings(organizationId: string) {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: {
      settings: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      logo: true,
      updatedAt: true,
    },
  });

  if (!org) return null;

  const stored = (org.settings as Record<string, unknown>) || {};
  const merged = mergeTenantSettings(
    {
      ...stored,
      updatedAt: org.updatedAt.toISOString(),
    },
    {
      name: org.name,
      email: org.email,
      phone: org.phone,
      address: org.address,
      logo: org.logo,
    },
  );

  return merged;
}

function extractOrgTableUpdates(body: Record<string, unknown>) {
  const orgUpdate: Record<string, string | null> = {};

  if (body.org && typeof body.org === "object") {
    const org = body.org as Record<string, unknown>;
    if (org.name !== undefined) orgUpdate.name = String(org.name);
    if (org.email !== undefined) orgUpdate.email = org.email ? String(org.email) : null;
    if (org.phone !== undefined) orgUpdate.phone = org.phone ? String(org.phone) : null;
    if (org.address !== undefined) orgUpdate.address = org.address ? String(org.address) : null;
    if (org.logo !== undefined) orgUpdate.logo = org.logo ? String(org.logo) : null;
  }

  if (body.organization && typeof body.organization === "object") {
    const orgSection = body.organization as Record<string, unknown>;
    if (orgSection.name !== undefined) orgUpdate.name = String(orgSection.name);
    if (orgSection.email !== undefined) orgUpdate.email = orgSection.email ? String(orgSection.email) : null;
    if (orgSection.phone !== undefined) orgUpdate.phone = orgSection.phone ? String(orgSection.phone) : null;
    if (orgSection.address !== undefined) orgUpdate.address = orgSection.address ? String(orgSection.address) : null;
  }

  if (body.branding && typeof body.branding === "object") {
    const branding = body.branding as Record<string, unknown>;
    if (branding.logo !== undefined) orgUpdate.logo = branding.logo ? String(branding.logo) : null;
  }

  return orgUpdate;
}

export async function updateTenantSettings(
  organizationId: string,
  body: Record<string, unknown>,
  actorUserId?: string,
) {
  const org = await db.organization.findUnique({
    where: { id: organizationId },
    select: { settings: true },
  });

  const currentSettings = (org?.settings as Record<string, unknown>) || {};
  const sectionsToUpdate: Record<string, unknown> = {};

  for (const section of ALLOWED_SECTIONS) {
    if (body[section] && typeof body[section] === "object") {
      sectionsToUpdate[section] = body[section];
    }
  }

  if (Object.keys(sectionsToUpdate).length === 0 && !body.org) {
    throw new Error("No valid settings to update");
  }

  const mergedSettings: Record<string, unknown> = { ...currentSettings };

  for (const [section, value] of Object.entries(sectionsToUpdate)) {
    const defaults = DEFAULT_TENANT_SETTINGS[section as TenantSettingsKey];
    mergedSettings[section] = {
      ...(defaults as Record<string, unknown>),
      ...(currentSettings[section] as Record<string, unknown> | undefined),
      ...(value as Record<string, unknown>),
    };
  }

  const now = new Date().toISOString();
  mergedSettings.updatedAt = now;

  const orgTableUpdate = extractOrgTableUpdates(body);

  if (sectionsToUpdate.security?.sessionTimeout !== undefined) {
    mergedSettings.session = {
      ...DEFAULT_TENANT_SETTINGS.session,
      ...(mergedSettings.session as Record<string, unknown> | undefined),
      inactivityTimeoutMinutes: Number(
        (sectionsToUpdate.security as Record<string, unknown>).sessionTimeout,
      ),
    };
  }

  const updated = await db.organization.update({
    where: { id: organizationId },
    data: {
      settings: mergedSettings,
      ...orgTableUpdate,
    },
    select: {
      settings: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      logo: true,
      updatedAt: true,
    },
  });

  const settings = mergeTenantSettings(
    {
      ...(updated.settings as Record<string, unknown>),
      updatedAt: updated.updatedAt.toISOString(),
    },
    {
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      logo: updated.logo,
    },
  );

  pushRealtimeEvent({
    entity: "tenant_settings",
    event: "update",
    data: { organizationId, updatedAt: now, sections: Object.keys(sectionsToUpdate) },
    userId: actorUserId,
  });

  return settings;
}
