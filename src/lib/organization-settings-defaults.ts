export const DEFAULT_ORGANIZATION_SECTION = {
  legalName: "",
  registrationNumber: "",
  taxId: "",
  vatNumber: "",
  mobile: "",
  website: "",
  industry: "",
  description: "",
  foundedYear: "",
  employeeCount: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  socialMedia: {
    twitter: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    youtube: "",
  },
  bankDetails: {
    bankName: "",
    accountName: "",
    accountNumber: "",
    sortCode: "",
    swiftCode: "",
  },
  taxDetails: {
    taxOffice: "",
    taxType: "",
    filingFrequency: "Monthly",
  },
};

export const DEFAULT_BRANDING_SECTION = {
  logoAlt: "",
  favicon: "",
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  accentColor: "#F59E0B",
  fontFamily: "Inter",
  darkMode: false,
};

export const DEFAULT_REGIONAL_SECTION = {
  timezone: "UTC",
  dateFormat: "YYYY-MM-DD",
  locale: "en-US",
  currency: "USD",
  currencySymbol: "$",
  language: "en",
  timeFormat: "12h",
  firstDayOfWeek: 1,
  fiscalYearStart: "January",
};

export const DEFAULT_FISCAL_YEAR_SECTION = {
  fiscalYear: "FY 2026",
  startMonth: "January",
  endMonth: "December",
  startDay: 1,
  periods: 12,
  periodType: "monthly" as "monthly" | "quarterly",
  currentPeriod: 1,
};

export const DEFAULT_SECURITY_SECTION = {
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumber: true,
  passwordRequireSpecial: true,
  passwordExpiryDays: 90,
  sessionTimeout: 30,
  mfaEnabled: false,
  ipRestriction: "",
  loginAttempts: 5,
  lockoutDuration: 30,
};

export const DEFAULT_ACCOUNTING_SECTION = {
  defaultAccountType: "ASSET",
  enableAutoJournal: true,
  enableMultiCurrency: false,
  baseCurrency: "USD",
  decimalPlaces: 2,
  exchangeRatePrecision: 4,
  enabledCurrencies: ["USD", "EUR", "GBP", "NGN", "JPY", "CAD", "AUD"],
  enableBudgetTracking: true,
  enableDepartmentAllocations: true,
  enableCostCenters: true,
};

export const DEFAULT_TENANT_SETTINGS = {
  general: {
    theme: "system",
    accentColor: "rose",
    fontSize: "medium",
    fontFamily: "sans",
    compactNav: false,
    defaultView: "dashboard",
    autoSave: true,
    animationsEnabled: true,
    reducedMotion: false,
  },
  session: {
    inactivityTimeoutMinutes: 30,
  },
  regional: { ...DEFAULT_REGIONAL_SECTION },
  notifications: {
    emailEnabled: true,
    desktopEnabled: false,
    soundEnabled: true,
    emailDigest: "realtime",
    payrollAlerts: true,
    expenseAlerts: true,
    approvalAlerts: true,
    budgetAlerts: true,
    invoiceAlerts: true,
  },
  organization: { ...DEFAULT_ORGANIZATION_SECTION },
  branding: { ...DEFAULT_BRANDING_SECTION },
  fiscalYear: { ...DEFAULT_FISCAL_YEAR_SECTION },
  security: { ...DEFAULT_SECURITY_SECTION },
  accounting: { ...DEFAULT_ACCOUNTING_SECTION },
  payroll: {
    payFrequency: "MONTHLY",
    overtimeRate: 1.5,
    enableAutoPayslip: true,
    enableLeaveDeductions: true,
    taxCalculation: "AUTOMATIC",
    enableLoanTracking: true,
    defaultPaymentMethod: "BANK_TRANSFER",
    annualLeaveQuota: 15,
    sickLeaveQuota: 10,
    personalLeaveQuota: 5,
  },
  tax: {
    enableVAT: true,
    defaultVATRate: 7.5,
    enableWithholdingTax: true,
    defaultWHTRate: 10,
    enableTaxReporting: true,
    filingFrequency: "MONTHLY",
    taxIdentificationNumber: "",
  },
  integrations: {
    enableWebhooks: false,
    webhookUrl: "",
    webhookSecret: "",
    webhookEvents: [] as string[],
    enableBankFeed: false,
    bankProvider: "",
    enableAPIAccess: false,
    apiKey: "",
    rateLimit: 1000,
  },
  backup: {
    autoBackupEnabled: true,
    backupFrequency: "daily",
    retentionDays: 30,
    includeAttachments: true,
    lastBackupAt: null as string | null,
  },
};

export type TenantSettingsKey = keyof typeof DEFAULT_TENANT_SETTINGS;

function mergeSection<T extends Record<string, unknown>>(
  defaults: T,
  stored: Record<string, unknown> | undefined | null,
): T {
  if (!stored || typeof stored !== "object") return { ...defaults };

  const merged = { ...defaults, ...stored } as T;

  for (const key of Object.keys(defaults)) {
    const defaultVal = defaults[key];
    const storedVal = stored[key];
    if (
      defaultVal &&
      typeof defaultVal === "object" &&
      !Array.isArray(defaultVal) &&
      storedVal &&
      typeof storedVal === "object" &&
      !Array.isArray(storedVal)
    ) {
      (merged as Record<string, unknown>)[key] = {
        ...(defaultVal as Record<string, unknown>),
        ...(storedVal as Record<string, unknown>),
      };
    }
  }

  return merged;
}

export function mergeTenantSettings(
  stored: Record<string, unknown> | null | undefined,
  org?: {
    name: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    logo: string | null;
  },
) {
  const source = stored || {};

  return {
    general: mergeSection(DEFAULT_TENANT_SETTINGS.general, source.general as Record<string, unknown>),
    session: mergeSection(DEFAULT_TENANT_SETTINGS.session, source.session as Record<string, unknown>),
    regional: mergeSection(DEFAULT_TENANT_SETTINGS.regional, source.regional as Record<string, unknown>),
    notifications: mergeSection(
      DEFAULT_TENANT_SETTINGS.notifications,
      source.notifications as Record<string, unknown>,
    ),
    organization: mergeSection(
      DEFAULT_TENANT_SETTINGS.organization,
      source.organization as Record<string, unknown>,
    ),
    branding: mergeSection(DEFAULT_TENANT_SETTINGS.branding, source.branding as Record<string, unknown>),
    fiscalYear: mergeSection(DEFAULT_TENANT_SETTINGS.fiscalYear, source.fiscalYear as Record<string, unknown>),
    security: mergeSection(DEFAULT_TENANT_SETTINGS.security, source.security as Record<string, unknown>),
    accounting: mergeSection(DEFAULT_TENANT_SETTINGS.accounting, source.accounting as Record<string, unknown>),
    payroll: mergeSection(DEFAULT_TENANT_SETTINGS.payroll, source.payroll as Record<string, unknown>),
    tax: mergeSection(DEFAULT_TENANT_SETTINGS.tax, source.tax as Record<string, unknown>),
    integrations: mergeSection(
      DEFAULT_TENANT_SETTINGS.integrations,
      source.integrations as Record<string, unknown>,
    ),
    backup: mergeSection(DEFAULT_TENANT_SETTINGS.backup, source.backup as Record<string, unknown>),
    org: {
      name: org?.name ?? "",
      email: org?.email ?? null,
      phone: org?.phone ?? null,
      address: org?.address ?? null,
      logo: org?.logo ?? null,
    },
    updatedAt:
      typeof source.updatedAt === "string" ? source.updatedAt : new Date(0).toISOString(),
  };
}
