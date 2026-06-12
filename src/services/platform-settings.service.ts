import type { PlatformGeneralSettings } from "@/src/types/platform-settings";
import { DEFAULT_PLATFORM_SETTINGS } from "@/src/types/platform-settings";
import type {
  ApiDeveloperSettings,
  IntegrationSettings,
  NotificationSettings,
  PerformanceSettings,
  PlatformAdminSettings,
  PrivacySettings,
  SecuritySettings,
  TenantAccessSettings,
} from "@/src/types/platform-admin-settings";
import {
  DEFAULT_API_DEVELOPER_SETTINGS,
  DEFAULT_INTEGRATION_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_PERFORMANCE_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_SECURITY_SETTINGS,
  DEFAULT_TENANT_ACCESS_SETTINGS,
} from "@/src/types/platform-admin-settings";

let settings: PlatformAdminSettings = {
  general: { ...DEFAULT_PLATFORM_SETTINGS },
  security: { ...DEFAULT_SECURITY_SETTINGS },
  notifications: { ...DEFAULT_NOTIFICATION_SETTINGS },
  integrations: { ...DEFAULT_INTEGRATION_SETTINGS },
  users: { ...DEFAULT_TENANT_ACCESS_SETTINGS },
  privacy: { ...DEFAULT_PRIVACY_SETTINGS },
  performance: { ...DEFAULT_PERFORMANCE_SETTINGS },
  api: { ...DEFAULT_API_DEVELOPER_SETTINGS },
};

export function getPlatformSettings(): PlatformGeneralSettings {
  return { ...settings.general };
}

export function updatePlatformSettings(
  patch: Partial<PlatformGeneralSettings>,
): PlatformGeneralSettings {
  settings.general = { ...settings.general, ...patch };
  return { ...settings.general };
}

export function getAllPlatformAdminSettings(): PlatformAdminSettings {
  return JSON.parse(JSON.stringify(settings)) as PlatformAdminSettings;
}

export function getSettingsOverview() {
  const { general, security, notifications, integrations, users, privacy, performance, api } =
    settings;
  const activeIntegrations = [
    integrations.stripeEnabled,
    integrations.sendgridEnabled,
    integrations.slackEnabled,
    integrations.githubEnabled,
    integrations.jiraEnabled,
  ].filter(Boolean).length;

  return {
    platformName: general.platformName,
    supportEmail: general.supportEmail,
    require2FA: security.require2FA,
    rateLimiting: security.rateLimiting,
    smtpConfigured: Boolean(notifications.smtpHost && notifications.fromAddress),
    webhookEnabled: notifications.webhookEnabled,
    activeIntegrations,
    ssoEnabled: users.ssoEnabled,
    gdprEnabled: privacy.gdprEnabled,
    cachingEnabled: performance.cachingEnabled,
    publicApiEnabled: api.publicApiEnabled,
  };
}

function getSection<K extends keyof PlatformAdminSettings>(key: K): PlatformAdminSettings[K] {
  return { ...settings[key] };
}

function updateSection<K extends keyof PlatformAdminSettings>(
  key: K,
  patch: Partial<PlatformAdminSettings[K]>,
): PlatformAdminSettings[K] {
  settings[key] = { ...settings[key], ...patch };
  return { ...settings[key] };
}

export const getSecuritySettings = () => getSection("security");
export const updateSecuritySettings = (patch: Partial<SecuritySettings>) =>
  updateSection("security", patch);

export const getNotificationSettings = () => getSection("notifications");
export const updateNotificationSettings = (patch: Partial<NotificationSettings>) =>
  updateSection("notifications", patch);

export const getIntegrationSettings = () => getSection("integrations");
export const updateIntegrationSettings = (patch: Partial<IntegrationSettings>) =>
  updateSection("integrations", patch);

export const getTenantAccessSettings = () => getSection("users");
export const updateTenantAccessSettings = (patch: Partial<TenantAccessSettings>) =>
  updateSection("users", patch);

export const getPrivacySettings = () => getSection("privacy");
export const updatePrivacySettings = (patch: Partial<PrivacySettings>) =>
  updateSection("privacy", patch);

export const getPerformanceSettings = () => getSection("performance");
export const updatePerformanceSettings = (patch: Partial<PerformanceSettings>) =>
  updateSection("performance", patch);

export const getApiDeveloperSettings = () => getSection("api");
export const updateApiDeveloperSettings = (patch: Partial<ApiDeveloperSettings>) =>
  updateSection("api", patch);
