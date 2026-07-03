import type { ModuleId } from "@/src/lib/permissions";

export type SettingsFeatureId =
  | "general"
  | "profile"
  | "appearance"
  | "organization"
  | "accounting"
  | "tax"
  | "payroll"
  | "notifications"
  | "roles"
  | "integrations"
  | "preferences";

interface SettingsFeature {
  id: SettingsFeatureId;
  label: string;
  href: string;
  premium: boolean;
  requiredModule?: ModuleId;
}

export const SETTINGS_FEATURES: SettingsFeature[] = [
  { id: "general", label: "General", href: "/settings/general", premium: false },
  { id: "profile", label: "Profile", href: "/settings/profile", premium: false },
  { id: "appearance", label: "Appearance", href: "/settings/appearance", premium: false },
  { id: "organization", label: "Organization", href: "/settings/organization", premium: false },
  { id: "accounting", label: "Accounting", href: "/settings/accounting", premium: false, requiredModule: "ledger" },
  { id: "tax", label: "Tax Configuration", href: "/settings/tax", premium: false, requiredModule: "tax" },
  { id: "payroll", label: "Payroll Settings", href: "/settings/payroll", premium: false, requiredModule: "payroll" },
  { id: "notifications", label: "Notifications", href: "/settings/notifications", premium: false },
  { id: "roles", label: "Roles & Permissions", href: "/settings/roles", premium: true },
  { id: "integrations", label: "Integrations", href: "/settings/integrations", premium: true },
  { id: "preferences", label: "System Preferences", href: "/settings/preferences", premium: false },
];

export function isPremiumSettingsPath(pathname: string): boolean {
  const feature = SETTINGS_FEATURES.find((f) => pathname === f.href || pathname.startsWith(`${f.href}/`));
  return feature?.premium ?? false;
}

export function getSettingsFeatureByPath(pathname: string): SettingsFeature | undefined {
  return SETTINGS_FEATURES.find((f) => pathname === f.href || pathname.startsWith(`${f.href}/`));
}

export function isSettingsFeatureAccessible(
  feature: SettingsFeature,
  planModuleIds: ModuleId[],
): boolean {
  if (!feature.premium) return true;
  return planModuleIds.length === 0 || planModuleIds.length >= 17;
}
