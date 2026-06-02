"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  Building2,
  Globe,
  Upload,
  Save,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  Globe2,
  Calendar,
  Clock,
  Shield,
  Key,
  Lock,
  Bell,
  Palette,
  Image,
  FileText,
  Users,
  DollarSign,
  Languages,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";

// Types
interface OrganizationInfo {
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

interface Branding {
  logo: string;
  logoAlt: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  darkMode: boolean;
}

interface Localization {
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

interface FiscalYearSettings {
  fiscalYear: string;
  startMonth: string;
  endMonth: string;
  startDay: number;
  periods: number;
  periodType: "monthly" | "quarterly";
  currentPeriod: number;
}

interface SecuritySettings {
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

// Initial Data
const initialOrgInfo: OrganizationInfo = {
  name: "Acme Corp",
  legalName: "Acme Corporation Ltd",
  email: "finance@acmecorp.com",
  phone: "+234 800 000 0000",
  website: "https://www.acmecorp.com",
  address: "123 Business District",
  city: "Lagos",
  state: "Lagos State",
  country: "Nigeria",
  postalCode: "100001",
  registrationNumber: "RC-1234567",
  taxId: "TIN-12345678-0001",
  industry: "Technology",
  employeeCount: 156,
  foundedYear: 2018,
  description:
    "Leading technology solutions provider specializing in enterprise software and digital transformation services.",
};

const initialBranding: Branding = {
  logo: "https://via.placeholder.com/200x60/3B82F6/FFFFFF?text=Acme+Corp",
  logoAlt: "Acme Corp Logo",
  favicon: "",
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  accentColor: "#F59E0B",
  fontFamily: "Inter",
  darkMode: false,
};

const initialLocalization: Localization = {
  timezone: "Africa/Lagos",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12h",
  currency: "NGN",
  currencySymbol: "₦",
  language: "en",
  firstDayOfWeek: 1,
  fiscalYearStart: "01-01",
  numberFormat: "1,234,567.89",
};

const initialFiscalYear: FiscalYearSettings = {
  fiscalYear: "FY 2026",
  startMonth: "January",
  endMonth: "December",
  startDay: 1,
  periods: 12,
  periodType: "monthly",
  currentPeriod: 6,
};

const initialSecurity: SecuritySettings = {
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireNumber: true,
  passwordRequireSpecial: true,
  passwordExpiryDays: 90,
  sessionTimeout: 30,
  mfaEnabled: true,
  ipRestriction: "",
  loginAttempts: 5,
  lockoutDuration: 30,
};

const timezones = [
  "Africa/Lagos",
  "Africa/Nairobi",
  "Africa/Johannesburg",
  "Africa/Cairo",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Pacific/Auckland",
];

const currencies = [
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
];

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Manufacturing",
  "Retail",
  "Construction",
  "Energy",
  "Agriculture",
  "Transportation",
  "Telecommunications",
  "Media",
  "Hospitality",
  "Real Estate",
  "Consulting",
];

const fonts = [
  "Inter",
  "Roboto",
  "Poppins",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Nunito",
];
const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
];

export default function OrganizationSettingsPage() {
  // State
  const [orgInfo, setOrgInfo] = useState<OrganizationInfo>(initialOrgInfo);
  const [branding, setBranding] = useState<Branding>(initialBranding);
  const [localization, setLocalization] =
    useState<Localization>(initialLocalization);
  const [fiscalYear, setFiscalYear] =
    useState<FiscalYearSettings>(initialFiscalYear);
  const [security, setSecurity] = useState<SecuritySettings>(initialSecurity);
  const [activeTab, setActiveTab] = useState("general");
  const [saveMessage, setSaveMessage] = useState("");

  const showSaveMessage = (section: string) => {
    setSaveMessage(`${section} settings saved successfully!`);
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleOrgChange = (
    field: keyof OrganizationInfo,
    value: string | number,
  ) => {
    setOrgInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleBrandingChange = (
    field: keyof Branding,
    value: string | boolean,
  ) => {
    setBranding((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocalizationChange = (
    field: keyof Localization,
    value: string | number,
  ) => {
    setLocalization((prev) => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (
    field: keyof SecuritySettings,
    value: string | boolean | number,
  ) => {
    setSecurity((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Organization Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your organization profile and branding
          </p>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" />
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full sm:w-auto flex-wrap">
          <TabsTrigger value="general">
            <Building2 className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding">
            <Palette className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="localization">
            <Globe className="h-4 w-4 mr-2" />
            Localization
          </TabsTrigger>
          <TabsTrigger value="fiscal-year">
            <Calendar className="h-4 w-4 mr-2" />
            Fiscal Year
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>
                Basic organization details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name *</Label>
                  <Input
                    value={orgInfo.name}
                    onChange={(e) => handleOrgChange("name", e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Legal Name</Label>
                  <Input
                    value={orgInfo.legalName}
                    onChange={(e) =>
                      handleOrgChange("legalName", e.target.value)
                    }
                    placeholder="Acme Corporation Ltd"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={orgInfo.email}
                    onChange={(e) => handleOrgChange("email", e.target.value)}
                    placeholder="finance@acmecorp.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone *</Label>
                  <Input
                    value={orgInfo.phone}
                    onChange={(e) => handleOrgChange("phone", e.target.value)}
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input
                    value={orgInfo.website}
                    onChange={(e) => handleOrgChange("website", e.target.value)}
                    placeholder="https://www.acmecorp.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Select
                    value={orgInfo.industry}
                    onValueChange={(v) => handleOrgChange("industry", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((ind) => (
                        <SelectItem key={ind} value={ind}>
                          {ind}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Registration Number</Label>
                  <Input
                    value={orgInfo.registrationNumber}
                    onChange={(e) =>
                      handleOrgChange("registrationNumber", e.target.value)
                    }
                    placeholder="RC-1234567"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax ID (TIN)</Label>
                  <Input
                    value={orgInfo.taxId}
                    onChange={(e) => handleOrgChange("taxId", e.target.value)}
                    placeholder="TIN-12345678-0001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Number of Employees</Label>
                  <Input
                    type="number"
                    value={orgInfo.employeeCount}
                    onChange={(e) =>
                      handleOrgChange(
                        "employeeCount",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Founded Year</Label>
                  <Input
                    type="number"
                    value={orgInfo.foundedYear}
                    onChange={(e) =>
                      handleOrgChange(
                        "foundedYear",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address</Label>
                <Input
                  value={orgInfo.address}
                  onChange={(e) => handleOrgChange("address", e.target.value)}
                  placeholder="123 Business District"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    value={orgInfo.city}
                    onChange={(e) => handleOrgChange("city", e.target.value)}
                    placeholder="Lagos"
                  />
                </div>
                <div className="space-y-2">
                  <Label>State/Province</Label>
                  <Input
                    value={orgInfo.state}
                    onChange={(e) => handleOrgChange("state", e.target.value)}
                    placeholder="Lagos State"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input
                    value={orgInfo.postalCode}
                    onChange={(e) =>
                      handleOrgChange("postalCode", e.target.value)
                    }
                    placeholder="100001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={orgInfo.country}
                    onValueChange={(v) => handleOrgChange("country", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Kenya">Kenya</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="United States">
                        United States
                      </SelectItem>
                      <SelectItem value="United Kingdom">
                        United Kingdom
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={orgInfo.description}
                  onChange={(e) =>
                    handleOrgChange("description", e.target.value)
                  }
                  placeholder="Organization description..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => showSaveMessage("General information")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding Tab */}
        <TabsContent value="branding" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize your organization's visual identity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div className="space-y-3">
                <Label>Organization Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="w-48 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted">
                    {branding.logo ? (
                      <img
                        src={branding.logo}
                        alt={branding.logoAlt}
                        className="max-w-full max-h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Image className="h-8 w-8 mx-auto mb-1" />
                        <span className="text-xs">No logo</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Logo URL</Label>
                      <Input
                        value={branding.logo}
                        onChange={(e) =>
                          handleBrandingChange("logo", e.target.value)
                        }
                        placeholder="https://example.com/logo.png"
                        className="w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                </div>
              </div>

              {/* Favicon */}
              <div className="space-y-2">
                <Label>Favicon URL</Label>
                <Input
                  value={branding.favicon}
                  onChange={(e) =>
                    handleBrandingChange("favicon", e.target.value)
                  }
                  placeholder="https://example.com/favicon.ico"
                />
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <Label>Color Scheme</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: branding.primaryColor }}
                      />
                      <Input
                        value={branding.primaryColor}
                        onChange={(e) =>
                          handleBrandingChange("primaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: branding.secondaryColor }}
                      />
                      <Input
                        value={branding.secondaryColor}
                        onChange={(e) =>
                          handleBrandingChange("secondaryColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Accent Color</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: branding.accentColor }}
                      />
                      <Input
                        value={branding.accentColor}
                        onChange={(e) =>
                          handleBrandingChange("accentColor", e.target.value)
                        }
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Font */}
              <div className="space-y-2">
                <Label>Font Family</Label>
                <Select
                  value={branding.fontFamily}
                  onValueChange={(v) => handleBrandingChange("fontFamily", v)}
                >
                  <SelectTrigger className="w-full sm:w-[250px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fonts.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dark Mode */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Enable dark mode by default
                  </p>
                </div>
                <button
                  onClick={() =>
                    handleBrandingChange("darkMode", !branding.darkMode)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    branding.darkMode ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      branding.darkMode ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Preview */}
              <div
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: branding.darkMode ? "#1a1a2e" : "#ffffff",
                }}
              >
                <p
                  className="text-sm font-medium mb-3"
                  style={{
                    color: branding.darkMode
                      ? "#ffffff"
                      : branding.primaryColor,
                  }}
                >
                  Preview
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      A
                    </div>
                    <div>
                      <div
                        className="h-3 w-32 rounded"
                        style={{
                          backgroundColor: branding.primaryColor,
                          opacity: 0.8,
                        }}
                      />
                      <div
                        className="h-2 w-24 rounded mt-1"
                        style={{
                          backgroundColor: branding.secondaryColor,
                          opacity: 0.5,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="h-8 w-20 rounded"
                      style={{ backgroundColor: branding.primaryColor }}
                    />
                    <div
                      className="h-8 w-20 rounded"
                      style={{ backgroundColor: branding.accentColor }}
                    />
                    <div
                      className="h-8 w-20 rounded"
                      style={{ backgroundColor: branding.secondaryColor }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => showSaveMessage("Branding")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Branding
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Localization Tab */}
        <TabsContent value="localization" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>
                Configure regional settings, formats, and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select
                    value={localization.timezone}
                    onValueChange={(v) =>
                      handleLocalizationChange("timezone", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select
                    value={localization.language}
                    onValueChange={(v) =>
                      handleLocalizationChange("language", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select
                    value={localization.currency}
                    onValueChange={(v) => {
                      handleLocalizationChange("currency", v);
                      const currency = currencies.find((c) => c.code === v);
                      if (currency)
                        handleLocalizationChange(
                          "currencySymbol",
                          currency.symbol,
                        );
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((cur) => (
                        <SelectItem key={cur.code} value={cur.code}>
                          {cur.symbol} {cur.code} - {cur.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency Symbol</Label>
                  <Input
                    value={localization.currencySymbol}
                    onChange={(e) =>
                      handleLocalizationChange("currencySymbol", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select
                    value={localization.dateFormat}
                    onValueChange={(v) =>
                      handleLocalizationChange("dateFormat", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      <SelectItem value="DD MMM YYYY">DD MMM YYYY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select
                    value={localization.timeFormat}
                    onValueChange={(v) =>
                      handleLocalizationChange("timeFormat", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                      <SelectItem value="24h">24-hour (14:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>First Day of Week</Label>
                  <Select
                    value={localization.firstDayOfWeek.toString()}
                    onValueChange={(v) =>
                      handleLocalizationChange("firstDayOfWeek", parseInt(v))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fiscal Year Start</Label>
                  <Input
                    type="text"
                    value={localization.fiscalYearStart}
                    onChange={(e) =>
                      handleLocalizationChange(
                        "fiscalYearStart",
                        e.target.value,
                      )
                    }
                    placeholder="01-01"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => showSaveMessage("Localization")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Localization
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fiscal Year Tab */}
        <TabsContent value="fiscal-year" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fiscal Year Settings</CardTitle>
              <CardDescription>
                Configure fiscal year periods and current period
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Current Fiscal Year</Label>
                  <Input
                    value={fiscalYear.fiscalYear}
                    onChange={(e) =>
                      setFiscalYear({
                        ...fiscalYear,
                        fiscalYear: e.target.value,
                      })
                    }
                    placeholder="FY 2026"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period Type</Label>
                  <Select
                    value={fiscalYear.periodType}
                    onValueChange={(v) =>
                      setFiscalYear({
                        ...fiscalYear,
                        periodType: v as "monthly" | "quarterly",
                        periods: v === "monthly" ? 12 : 4,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">
                        Monthly (12 periods)
                      </SelectItem>
                      <SelectItem value="quarterly">
                        Quarterly (4 periods)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Month</Label>
                  <Select
                    value={fiscalYear.startMonth}
                    onValueChange={(v) =>
                      setFiscalYear({ ...fiscalYear, startMonth: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>End Month</Label>
                  <Select
                    value={fiscalYear.endMonth}
                    onValueChange={(v) =>
                      setFiscalYear({ ...fiscalYear, endMonth: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December",
                      ].map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current Period (1-{fiscalYear.periods})</Label>
                  <Input
                    type="number"
                    min={1}
                    max={fiscalYear.periods}
                    value={fiscalYear.currentPeriod}
                    onChange={(e) =>
                      setFiscalYear({
                        ...fiscalYear,
                        currentPeriod: Math.min(
                          fiscalYear.periods,
                          Math.max(1, parseInt(e.target.value) || 1),
                        ),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Day</Label>
                  <Input
                    type="number"
                    min={1}
                    max={28}
                    value={fiscalYear.startDay}
                    onChange={(e) =>
                      setFiscalYear({
                        ...fiscalYear,
                        startDay: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              {/* Fiscal Year Summary */}
              <div className="p-4 bg-blue-50 rounded-lg mt-4">
                <p className="font-medium text-blue-900 mb-2">
                  Fiscal Year Summary
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>
                    <span className="opacity-75">Year:</span>{" "}
                    {fiscalYear.fiscalYear}
                  </div>
                  <div>
                    <span className="opacity-75">Periods:</span>{" "}
                    {fiscalYear.periods} ({fiscalYear.periodType})
                  </div>
                  <div>
                    <span className="opacity-75">Range:</span>{" "}
                    {fiscalYear.startMonth} - {fiscalYear.endMonth}
                  </div>
                  <div>
                    <span className="opacity-75">Current:</span> Period{" "}
                    {fiscalYear.currentPeriod}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => showSaveMessage("Fiscal year")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Fiscal Year
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure password policies and session security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Policy */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password Policy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Minimum Length</Label>
                    <Input
                      type="number"
                      value={security.passwordMinLength}
                      onChange={(e) =>
                        handleSecurityChange(
                          "passwordMinLength",
                          parseInt(e.target.value) || 8,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Password Expiry (days)</Label>
                    <Input
                      type="number"
                      value={security.passwordExpiryDays}
                      onChange={(e) =>
                        handleSecurityChange(
                          "passwordExpiryDays",
                          parseInt(e.target.value) || 90,
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Require Uppercase Letter</Label>
                    <button
                      onClick={() =>
                        handleSecurityChange(
                          "passwordRequireUppercase",
                          !security.passwordRequireUppercase,
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        security.passwordRequireUppercase
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          security.passwordRequireUppercase
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require Number</Label>
                    <button
                      onClick={() =>
                        handleSecurityChange(
                          "passwordRequireNumber",
                          !security.passwordRequireNumber,
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        security.passwordRequireNumber
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          security.passwordRequireNumber
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Require Special Character</Label>
                    <button
                      onClick={() =>
                        handleSecurityChange(
                          "passwordRequireSpecial",
                          !security.passwordRequireSpecial,
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        security.passwordRequireSpecial
                          ? "bg-blue-600"
                          : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          security.passwordRequireSpecial
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <hr />

              {/* Session Security */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Session & Access Security
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) =>
                        handleSecurityChange(
                          "sessionTimeout",
                          parseInt(e.target.value) || 30,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={security.loginAttempts}
                      onChange={(e) =>
                        handleSecurityChange(
                          "loginAttempts",
                          parseInt(e.target.value) || 5,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lockout Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={security.lockoutDuration}
                      onChange={(e) =>
                        handleSecurityChange(
                          "lockoutDuration",
                          parseInt(e.target.value) || 30,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IP Restriction (optional)</Label>
                    <Input
                      value={security.ipRestriction}
                      onChange={(e) =>
                        handleSecurityChange("ipRestriction", e.target.value)
                      }
                      placeholder="192.168.1.0/24"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Multi-Factor Authentication (MFA)</Label>
                    <p className="text-xs text-muted-foreground">
                      Require MFA for all users
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleSecurityChange("mfaEnabled", !security.mfaEnabled)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      security.mfaEnabled ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        security.mfaEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={() => showSaveMessage("Security")}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
