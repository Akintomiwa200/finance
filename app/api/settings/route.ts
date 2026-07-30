import { NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { db } from "@/src/lib/db";

const DEFAULT_SETTINGS = {
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
  regional: {
    timezone: "UTC",
    dateFormat: "YYYY-MM-DD",
    locale: "en-US",
    currency: "USD",
    fiscalYearStart: "01",
  },
  notifications: {
    emailEnabled: true,
    desktopEnabled: false,
    soundEnabled: true,
    payrollAlerts: true,
    expenseAlerts: true,
    approvalAlerts: true,
    budgetAlerts: true,
    invoiceAlerts: true,
  },
  organization: {
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
    socialMedia: { twitter: "", linkedin: "", facebook: "", instagram: "", youtube: "" },
    bankDetails: { bankName: "", accountName: "", accountNumber: "", sortCode: "", swiftCode: "" },
    taxDetails: { taxOffice: "", taxType: "", filingFrequency: "Monthly" },
  },
  accounting: {
    defaultAccountType: "ASSET",
    enableAutoJournal: true,
    enableMultiCurrency: false,
    baseCurrency: "USD",
    decimalPlaces: 2,
    enableBudgetTracking: true,
    enableDepartmentAllocations: true,
    enableCostCenters: true,
  },
  payroll: {
    payFrequency: "MONTHLY",
    overtimeRate: 1.5,
    enableAutoPayslip: true,
    enableLeaveDeductions: true,
    taxCalculation: "AUTOMATIC",
    enableLoanTracking: true,
    defaultPaymentMethod: "BANK_TRANSFER",
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
    enableBankFeed: false,
    bankProvider: "",
    enableAPIAccess: false,
    apiKey: "",
    rateLimit: 1000,
  },
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const org = await db.organization.findUnique({
      where: { id: session.user.organizationId },
      select: { settings: true, name: true, email: true, phone: true, address: true, logo: true },
    });

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const stored = (org.settings as Record<string, unknown>) || {};

    const merged = {
      general: { ...DEFAULT_SETTINGS.general, ...(stored.general as Record<string, unknown> || {}) },
      session: { ...DEFAULT_SETTINGS.session, ...(stored.session as Record<string, unknown> || {}) },
      regional: { ...DEFAULT_SETTINGS.regional, ...(stored.regional as Record<string, unknown> || {}) },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...(stored.notifications as Record<string, unknown> || {}) },
      organization: { ...DEFAULT_SETTINGS.organization, ...(stored.organization as Record<string, unknown> || {}) },
      accounting: { ...DEFAULT_SETTINGS.accounting, ...(stored.accounting as Record<string, unknown> || {}) },
      payroll: { ...DEFAULT_SETTINGS.payroll, ...(stored.payroll as Record<string, unknown> || {}) },
      tax: { ...DEFAULT_SETTINGS.tax, ...(stored.tax as Record<string, unknown> || {}) },
      integrations: { ...DEFAULT_SETTINGS.integrations, ...(stored.integrations as Record<string, unknown> || {}) },
      org: {
        name: org.name,
        email: org.email,
        phone: org.phone,
        address: org.address,
        logo: org.logo,
      },
    };

    return NextResponse.json(merged);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.organizationId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowedSections = [
    "general", "session", "regional", "notifications",
    "organization", "accounting", "payroll", "tax", "integrations",
  ];

  const sectionsToUpdate: Record<string, unknown> = {};
  for (const section of allowedSections) {
    if (body[section] && typeof body[section] === "object") {
      sectionsToUpdate[section] = body[section];
    }
  }

  if (Object.keys(sectionsToUpdate).length === 0) {
    return NextResponse.json({ error: "No valid settings to update" }, { status: 400 });
  }

  try {
    const org = await db.organization.findUnique({
      where: { id: session.user.organizationId },
      select: { settings: true },
    });

    const currentSettings = (org?.settings as Record<string, unknown>) || {};

    const mergedSettings: Record<string, unknown> = { ...currentSettings };
    for (const [section, value] of Object.entries(sectionsToUpdate)) {
      mergedSettings[section] = {
        ...(currentSettings[section] as Record<string, unknown> || {}),
        ...(value as Record<string, unknown>),
      };
    }

    const orgUpdateData: Record<string, unknown> = {};
    if (sectionsToUpdate.organization && typeof sectionsToUpdate.organization === "object") {
      const orgFields = sectionsToUpdate.organization as Record<string, unknown>;
      if (orgFields.name !== undefined) orgUpdateData.name = orgFields.name;
      if (orgFields.email !== undefined) orgUpdateData.email = orgFields.email;
      if (orgFields.phone !== undefined) orgUpdateData.phone = orgFields.phone;
    }

    const updateData: Record<string, unknown> = { settings: mergedSettings };
    if (Object.keys(orgUpdateData).length > 0) {
      Object.assign(updateData, orgUpdateData);
    }

    const updated = await db.organization.update({
      where: { id: session.user.organizationId },
      data: updateData,
      select: { settings: true },
    });

    const updatedSettings = (updated.settings as Record<string, unknown>) || {};

    return NextResponse.json({
      success: true,
      settings: {
        general: { ...DEFAULT_SETTINGS.general, ...(updatedSettings.general as Record<string, unknown> || {}) },
        session: { ...DEFAULT_SETTINGS.session, ...(updatedSettings.session as Record<string, unknown> || {}) },
        regional: { ...DEFAULT_SETTINGS.regional, ...(updatedSettings.regional as Record<string, unknown> || {}) },
        notifications: { ...DEFAULT_SETTINGS.notifications, ...(updatedSettings.notifications as Record<string, unknown> || {}) },
        organization: { ...DEFAULT_SETTINGS.organization, ...(updatedSettings.organization as Record<string, unknown> || {}) },
        accounting: { ...DEFAULT_SETTINGS.accounting, ...(updatedSettings.accounting as Record<string, unknown> || {}) },
        payroll: { ...DEFAULT_SETTINGS.payroll, ...(updatedSettings.payroll as Record<string, unknown> || {}) },
        tax: { ...DEFAULT_SETTINGS.tax, ...(updatedSettings.tax as Record<string, unknown> || {}) },
        integrations: { ...DEFAULT_SETTINGS.integrations, ...(updatedSettings.integrations as Record<string, unknown> || {}) },
      },
    });
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
