"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSettingsSection } from "@/src/hooks/use-settings-section";
import { useToast } from "@/src/components/ui/use-toast";

export interface OrganizationInfo {
  name: string;
  legalName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  employeeCount: number;
  foundedYear: number;
  description: string;
}

export interface Branding {
  logo: string;
  logoAlt: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  darkMode: boolean;
}

export interface Localization {
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  currencySymbol: string;
  language: string;
  firstDayOfWeek: number;
  fiscalYearStart: string;
  numberFormat: string;
}

export interface FiscalYearSettings {
  fiscalYear: string;
  startMonth: string;
  endMonth: string;
  startDay: number;
  periods: number;
  periodType: "monthly" | "quarterly";
  currentPeriod: number;
}

export interface SecuritySettings {
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireNumber: boolean;
  passwordRequireSpecial: boolean;
  passwordExpiryDays: number;
  sessionTimeout: number;
  mfaEnabled: boolean;
  ipRestriction: string;
  loginAttempts: number;
  lockoutDuration: number;
}

function num(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function useOrganizationSettings() {
  const { toast } = useToast();
  const orgHook = useSettingsSection("organization");
  const brandingHook = useSettingsSection("branding");
  const regionalHook = useSettingsSection("regional");
  const fiscalHook = useSettingsSection("fiscalYear");
  const securityHook = useSettingsSection("security");

  const isLoading =
    orgHook.isLoading ||
    brandingHook.isLoading ||
    regionalHook.isLoading ||
    fiscalHook.isLoading ||
    securityHook.isLoading;

  const error =
    orgHook.error ||
    brandingHook.error ||
    regionalHook.error ||
    fiscalHook.error ||
    securityHook.error;

  const [orgInfo, setOrgInfo] = useState<OrganizationInfo>({
    name: "",
    legalName: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    registrationNumber: "",
    taxId: "",
    industry: "",
    employeeCount: 0,
    foundedYear: 0,
    description: "",
  });

  const [branding, setBranding] = useState<Branding>({
    logo: "",
    logoAlt: "",
    favicon: "",
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    accentColor: "#F59E0B",
    fontFamily: "Inter",
    darkMode: false,
  });

  const [localization, setLocalization] = useState<Localization>({
    timezone: "UTC",
    dateFormat: "YYYY-MM-DD",
    timeFormat: "12h",
    currency: "USD",
    currencySymbol: "$",
    language: "en",
    firstDayOfWeek: 1,
    fiscalYearStart: "January",
    numberFormat: "1,234,567.89",
  });

  const [fiscalYear, setFiscalYear] = useState<FiscalYearSettings>({
    fiscalYear: "FY 2026",
    startMonth: "January",
    endMonth: "December",
    startDay: 1,
    periods: 12,
    periodType: "monthly",
    currentPeriod: 1,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
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
  });

  const [savingSection, setSavingSection] = useState<string | null>(null);
  const initialized = useRef(false);
  const dirtyRef = useRef(false);

  const hydrateFromStore = useCallback(() => {
    const org = orgHook.org;
    const orgSection = orgHook.data;
    const brandingSection = brandingHook.data;
    const regionalSection = regionalHook.data;
    const fiscalSection = fiscalHook.data;
    const securitySection = securityHook.data;

    if (!orgSection || !brandingSection || !regionalSection || !fiscalSection || !securitySection) {
      return;
    }

    setOrgInfo({
      name: org?.name || "",
      legalName: (orgSection.legalName as string) || "",
      email: org?.email || "",
      phone: org?.phone || "",
      website: (orgSection.website as string) || "",
      address: org?.address || "",
      city: (orgSection.city as string) || "",
      state: (orgSection.state as string) || "",
      country: (orgSection.country as string) || "",
      postalCode: (orgSection.postalCode as string) || "",
      registrationNumber: (orgSection.registrationNumber as string) || "",
      taxId: (orgSection.taxId as string) || "",
      industry: (orgSection.industry as string) || "",
      employeeCount: num(orgSection.employeeCount, 0),
      foundedYear: num(orgSection.foundedYear, 0),
      description: (orgSection.description as string) || "",
    });

    setBranding({
      logo: org?.logo || "",
      logoAlt: (brandingSection.logoAlt as string) || "",
      favicon: (brandingSection.favicon as string) || "",
      primaryColor: (brandingSection.primaryColor as string) || "#3B82F6",
      secondaryColor: (brandingSection.secondaryColor as string) || "#1E40AF",
      accentColor: (brandingSection.accentColor as string) || "#F59E0B",
      fontFamily: (brandingSection.fontFamily as string) || "Inter",
      darkMode: Boolean(brandingSection.darkMode),
    });

    setLocalization({
      timezone: (regionalSection.timezone as string) || "UTC",
      dateFormat: (regionalSection.dateFormat as string) || "YYYY-MM-DD",
      timeFormat: (regionalSection.timeFormat as string) || "12h",
      currency: (regionalSection.currency as string) || "USD",
      currencySymbol: (regionalSection.currencySymbol as string) || "$",
      language: (regionalSection.language as string) || "en",
      firstDayOfWeek: num(regionalSection.firstDayOfWeek, 1),
      fiscalYearStart: (regionalSection.fiscalYearStart as string) || "January",
      numberFormat: "1,234,567.89",
    });

    setFiscalYear({
      fiscalYear: (fiscalSection.fiscalYear as string) || "FY 2026",
      startMonth: (fiscalSection.startMonth as string) || "January",
      endMonth: (fiscalSection.endMonth as string) || "December",
      startDay: num(fiscalSection.startDay, 1),
      periods: num(fiscalSection.periods, 12),
      periodType: (fiscalSection.periodType as "monthly" | "quarterly") || "monthly",
      currentPeriod: num(fiscalSection.currentPeriod, 1),
    });

    setSecurity({
      passwordMinLength: num(securitySection.passwordMinLength, 8),
      passwordRequireUppercase: Boolean(securitySection.passwordRequireUppercase),
      passwordRequireNumber: Boolean(securitySection.passwordRequireNumber),
      passwordRequireSpecial: Boolean(securitySection.passwordRequireSpecial),
      passwordExpiryDays: num(securitySection.passwordExpiryDays, 90),
      sessionTimeout: num(securitySection.sessionTimeout, 30),
      mfaEnabled: Boolean(securitySection.mfaEnabled),
      ipRestriction: (securitySection.ipRestriction as string) || "",
      loginAttempts: num(securitySection.loginAttempts, 5),
      lockoutDuration: num(securitySection.lockoutDuration, 30),
    });
  }, [orgHook.org, orgHook.data, brandingHook.data, regionalHook.data, fiscalHook.data, securityHook.data]);

  useEffect(() => {
    if (isLoading) return;
    if (!orgHook.data) return;

    if (!initialized.current || !dirtyRef.current) {
      hydrateFromStore();
      initialized.current = true;
      dirtyRef.current = false;
    }
  }, [
    isLoading,
    orgHook.data,
    orgHook.settingsVersion,
    brandingHook.settingsVersion,
    regionalHook.settingsVersion,
    fiscalHook.settingsVersion,
    securityHook.settingsVersion,
    hydrateFromStore,
  ]);

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  const saveGeneral = useCallback(async () => {
    setSavingSection("general");
    try {
      const ok = await orgHook.saveSection(
        {
          legalName: orgInfo.legalName,
          registrationNumber: orgInfo.registrationNumber,
          taxId: orgInfo.taxId,
          industry: orgInfo.industry,
          employeeCount: String(orgInfo.employeeCount),
          foundedYear: String(orgInfo.foundedYear),
          description: orgInfo.description,
          website: orgInfo.website,
          city: orgInfo.city,
          state: orgInfo.state,
          country: orgInfo.country,
          postalCode: orgInfo.postalCode,
          mobile: orgInfo.phone,
        },
        {
          org: {
            name: orgInfo.name,
            email: orgInfo.email,
            phone: orgInfo.phone,
            address: orgInfo.address,
          },
        },
      );
      if (ok) dirtyRef.current = false;
      return ok;
    } finally {
      setSavingSection(null);
    }
  }, [orgHook, orgInfo]);

  const saveBranding = useCallback(async () => {
    setSavingSection("branding");
    try {
      const ok = await brandingHook.saveSection(
        {
          logoAlt: branding.logoAlt,
          favicon: branding.favicon,
          primaryColor: branding.primaryColor,
          secondaryColor: branding.secondaryColor,
          accentColor: branding.accentColor,
          fontFamily: branding.fontFamily,
          darkMode: branding.darkMode,
          logo: branding.logo,
        },
        { org: { logo: branding.logo } },
      );
      if (ok) dirtyRef.current = false;
      return ok;
    } finally {
      setSavingSection(null);
    }
  }, [brandingHook, branding]);

  const saveLocalization = useCallback(async () => {
    setSavingSection("localization");
    try {
      const ok = await regionalHook.saveSection({
        timezone: localization.timezone,
        dateFormat: localization.dateFormat,
        timeFormat: localization.timeFormat,
        currency: localization.currency,
        currencySymbol: localization.currencySymbol,
        language: localization.language,
        firstDayOfWeek: localization.firstDayOfWeek,
        fiscalYearStart: localization.fiscalYearStart,
        locale: localization.language === "en" ? "en-US" : localization.language,
      });
      if (ok) dirtyRef.current = false;
      return ok;
    } finally {
      setSavingSection(null);
    }
  }, [regionalHook, localization]);

  const saveFiscalYear = useCallback(async () => {
    setSavingSection("fiscal-year");
    try {
      const [fiscalOk] = await Promise.all([
        fiscalHook.saveSection({ ...fiscalYear }),
        regionalHook.saveSection({ fiscalYearStart: fiscalYear.startMonth }),
      ]);
      if (fiscalOk) dirtyRef.current = false;
      return fiscalOk;
    } finally {
      setSavingSection(null);
    }
  }, [fiscalHook, regionalHook, fiscalYear]);

  const saveSecurity = useCallback(async () => {
    setSavingSection("security");
    try {
      const ok = await securityHook.saveSection({ ...security });
      if (ok) dirtyRef.current = false;
      return ok;
    } finally {
      setSavingSection(null);
    }
  }, [securityHook, security]);

  const isSaving = useMemo(
    () => Boolean(savingSection) || orgHook.isSaving,
    [savingSection, orgHook.isSaving],
  );

  return {
    orgInfo,
    setOrgInfo,
    branding,
    setBranding,
    localization,
    setLocalization,
    fiscalYear,
    setFiscalYear,
    security,
    setSecurity,
    isLoading,
    isSaving,
    savingSection,
    error,
    markDirty,
    saveGeneral,
    saveBranding,
    saveLocalization,
    saveFiscalYear,
    saveSecurity,
  };
}
