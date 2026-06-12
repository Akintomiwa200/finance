import type { PlatformGeneralSettings } from "@/src/types/platform-settings";
import { DEFAULT_PLATFORM_SETTINGS } from "@/src/types/platform-settings";

export interface SecuritySettings {
  sessionTimeout: string;
  require2FA: boolean;
  forcePasswordReset: boolean;
  passwordMinLength: string;
  passwordRequireSpecialChar: boolean;
  passwordRequireNumber: boolean;
  maxLoginAttempts: string;
  lockoutDuration: string;
  rateLimiting: boolean;
  maxRequestsPerMinute: string;
  enableCORS: boolean;
  allowedOrigins: string;
  ipWhitelisting: boolean;
  sessionIdleTimeout: string;
}

export interface NotificationSettings {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  fromAddress: string;
  fromName: string;
  encryption: "tls" | "ssl" | "none";
  newCompanyAlerts: boolean;
  supportTicketAlerts: boolean;
  billingFailureAlerts: boolean;
  userSignupAlerts: boolean;
  systemDigestEnabled: boolean;
  weeklyReportEnabled: boolean;
  webhookEnabled: boolean;
  webhookUrl: string;
  webhookSecret: string;
}

export interface IntegrationSettings {
  stripeEnabled: boolean;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  stripePublishableKey: string;
  sendgridEnabled: boolean;
  sendgridApiKey: string;
  slackEnabled: boolean;
  slackWebhookUrl: string;
  githubEnabled: boolean;
  githubToken: string;
  githubOrganization: string;
  jiraEnabled: boolean;
  jiraBaseUrl: string;
  jiraEmail: string;
  jiraApiToken: string;
}

export interface TenantAccessSettings {
  ssoEnabled: boolean;
  ssoProvider: "okta" | "azure" | "google" | "custom";
  ssoMetadataUrl: string;
  autoProvisionUsers: boolean;
  defaultRole: string;
  inviteExpiryDays: string;
  allowSelfSignup: boolean;
  requireEmailVerification: boolean;
  apiKeysEnabled: boolean;
  maxApiKeysPerUser: string;
}

export interface PrivacySettings {
  dataRetentionDays: string;
  auditLogRetentionDays: string;
  autoDeleteInactiveAccounts: boolean;
  inactiveAccountDays: string;
  gdprEnabled: boolean;
  ccpaEnabled: boolean;
  allowDataExport: boolean;
  allowAccountDeletion: boolean;
  encryptionAtRest: boolean;
  encryptBackups: boolean;
  privacyPolicyUrl: string;
  dpoEmail: string;
}

export interface PerformanceSettings {
  cachingEnabled: boolean;
  cacheTtlSeconds: string;
  cacheStrategy: "memory" | "redis" | "edge";
  cdnEnabled: boolean;
  cdnProvider: "cloudflare" | "fastly" | "aws" | "custom";
  cdnUrl: string;
  gzipEnabled: boolean;
  imageOptimization: boolean;
  lazyLoadAssets: boolean;
  prefetchRoutes: boolean;
  maxUploadSizeMb: string;
}

export interface ApiDeveloperSettings {
  publicApiEnabled: boolean;
  apiVersion: "v1" | "v2";
  docsUrl: string;
  requireSignedRequests: boolean;
  globalRateLimit: string;
  burstLimit: string;
  ipAllowlist: string;
  webhookSigningSecret: string;
  corsOrigins: string;
}

export interface PlatformAdminSettings {
  general: PlatformGeneralSettings;
  security: SecuritySettings;
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
  users: TenantAccessSettings;
  privacy: PrivacySettings;
  performance: PerformanceSettings;
  api: ApiDeveloperSettings;
}

export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  sessionTimeout: "60",
  require2FA: true,
  forcePasswordReset: false,
  passwordMinLength: "8",
  passwordRequireSpecialChar: true,
  passwordRequireNumber: true,
  maxLoginAttempts: "5",
  lockoutDuration: "30",
  rateLimiting: true,
  maxRequestsPerMinute: "100",
  enableCORS: false,
  allowedOrigins: "",
  ipWhitelisting: false,
  sessionIdleTimeout: "15",
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  smtpHost: "smtp.sendgrid.net",
  smtpPort: "587",
  smtpUser: "apikey",
  smtpPassword: "",
  fromAddress: "noreply@uifry.com",
  fromName: "Uifry Platform",
  encryption: "tls",
  newCompanyAlerts: true,
  supportTicketAlerts: true,
  billingFailureAlerts: true,
  userSignupAlerts: false,
  systemDigestEnabled: true,
  weeklyReportEnabled: false,
  webhookEnabled: false,
  webhookUrl: "",
  webhookSecret: "",
};

export const DEFAULT_INTEGRATION_SETTINGS: IntegrationSettings = {
  stripeEnabled: true,
  stripeSecretKey: "",
  stripeWebhookSecret: "",
  stripePublishableKey: "",
  sendgridEnabled: false,
  sendgridApiKey: "",
  slackEnabled: false,
  slackWebhookUrl: "",
  githubEnabled: false,
  githubToken: "",
  githubOrganization: "",
  jiraEnabled: false,
  jiraBaseUrl: "",
  jiraEmail: "",
  jiraApiToken: "",
};

export const DEFAULT_TENANT_ACCESS_SETTINGS: TenantAccessSettings = {
  ssoEnabled: false,
  ssoProvider: "google",
  ssoMetadataUrl: "",
  autoProvisionUsers: true,
  defaultRole: "EMPLOYEE",
  inviteExpiryDays: "7",
  allowSelfSignup: false,
  requireEmailVerification: true,
  apiKeysEnabled: true,
  maxApiKeysPerUser: "5",
};

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  dataRetentionDays: "365",
  auditLogRetentionDays: "730",
  autoDeleteInactiveAccounts: false,
  inactiveAccountDays: "180",
  gdprEnabled: true,
  ccpaEnabled: false,
  allowDataExport: true,
  allowAccountDeletion: true,
  encryptionAtRest: true,
  encryptBackups: true,
  privacyPolicyUrl: "",
  dpoEmail: "",
};

export const DEFAULT_PERFORMANCE_SETTINGS: PerformanceSettings = {
  cachingEnabled: true,
  cacheTtlSeconds: "300",
  cacheStrategy: "memory",
  cdnEnabled: false,
  cdnProvider: "cloudflare",
  cdnUrl: "",
  gzipEnabled: true,
  imageOptimization: true,
  lazyLoadAssets: true,
  prefetchRoutes: true,
  maxUploadSizeMb: "25",
};

export const DEFAULT_API_DEVELOPER_SETTINGS: ApiDeveloperSettings = {
  publicApiEnabled: true,
  apiVersion: "v1",
  docsUrl: "",
  requireSignedRequests: true,
  globalRateLimit: "1000",
  burstLimit: "50",
  ipAllowlist: "",
  webhookSigningSecret: "",
  corsOrigins: "",
};

export const DEFAULT_PLATFORM_ADMIN_SETTINGS: PlatformAdminSettings = {
  general: DEFAULT_PLATFORM_SETTINGS,
  security: DEFAULT_SECURITY_SETTINGS,
  notifications: DEFAULT_NOTIFICATION_SETTINGS,
  integrations: DEFAULT_INTEGRATION_SETTINGS,
  users: DEFAULT_TENANT_ACCESS_SETTINGS,
  privacy: DEFAULT_PRIVACY_SETTINGS,
  performance: DEFAULT_PERFORMANCE_SETTINGS,
  api: DEFAULT_API_DEVELOPER_SETTINGS,
};
