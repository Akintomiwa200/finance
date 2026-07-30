"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  CreditCard,
  FileText,
  Save,
  Camera,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettingsSection } from "@/src/hooks/use-settings-section";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

interface FormState {
  legalName: string;
  registrationNumber: string;
  taxId: string;
  vatNumber: string;
  mobile: string;
  website: string;
  industry: string;
  description: string;
  foundedYear: string;
  employeeCount: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  socialMedia: { twitter: string; linkedin: string; facebook: string; instagram: string; youtube: string };
  bankDetails: { bankName: string; accountName: string; accountNumber: string; sortCode: string; swiftCode: string };
  taxDetails: { taxOffice: string; taxType: string; filingFrequency: string };
}

const emptyForm: FormState = {
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
  socialMedia: { twitter: "", linkedin: "", facebook: "", instagram: "", youtube: "" },
  bankDetails: { bankName: "", accountName: "", accountNumber: "", sortCode: "", swiftCode: "" },
  taxDetails: { taxOffice: "", taxType: "", filingFrequency: "" },
};

function mapOrgSection(data: Record<string, unknown> | null): FormState {
  if (!data) return { ...emptyForm };
  const sm = (data.socialMedia || {}) as Record<string, string>;
  const bd = (data.bankDetails || {}) as Record<string, string>;
  const td = (data.taxDetails || {}) as Record<string, string>;
  return {
    legalName: (data.legalName as string) || "",
    registrationNumber: (data.registrationNumber as string) || "",
    taxId: (data.taxId as string) || "",
    vatNumber: (data.vatNumber as string) || "",
    mobile: (data.mobile as string) || "",
    website: (data.website as string) || "",
    industry: (data.industry as string) || "",
    description: (data.description as string) || "",
    foundedYear: (data.foundedYear as string) || "",
    employeeCount: (data.employeeCount as string) || "",
    city: (data.city as string) || "",
    state: (data.state as string) || "",
    country: (data.country as string) || "",
    postalCode: (data.postalCode as string) || "",
    socialMedia: { twitter: (sm.twitter) || "", linkedin: (sm.linkedin) || "", facebook: (sm.facebook) || "", instagram: (sm.instagram) || "", youtube: (sm.youtube) || "" },
    bankDetails: { bankName: (bd.bankName) || "", accountName: (bd.accountName) || "", accountNumber: (bd.accountNumber) || "", sortCode: (bd.sortCode) || "", swiftCode: (bd.swiftCode) || "" },
    taxDetails: { taxOffice: (td.taxOffice) || "", taxType: (td.taxType) || "", filingFrequency: (td.filingFrequency) || "" },
  };
}

const filingOptions = ["Monthly", "Quarterly", "Semi-Annually", "Annually"];

export default function OrganizationProfile() {
  const router = useRouter();
  const { data: orgSection, isLoading: orgLoading, error: orgError, saveSection: saveOrg } = useSettingsSection("organization");
  const { data: regionalSection, isLoading: regionalLoading, error: regionalError, saveSection: saveRegional } = useSettingsSection("regional");
  const org = useTenantSettingsStore((s) => s.settings?.org);

  const isLoading = orgLoading || regionalLoading;
  const error = orgError || regionalError;

  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [regional, setRegional] = useState({ timezone: "", dateFormat: "", locale: "", currency: "", fiscalYearStart: "" });
  const initialized = useRef(false);
  const [savingTab, setSavingTab] = useState<string | null>(null);

  const [hasChanges, setHasChanges] = useState({
    general: false,
    contact: false,
    financial: false,
    social: false,
  });

  const snapshotRef = useRef<FormState>({ ...emptyForm });
  const regionalSnapshotRef = useRef({ timezone: "", dateFormat: "", locale: "", currency: "", fiscalYearStart: "" });

  useEffect(() => {
    if (!orgSection || initialized.current) return;
    const mapped = mapOrgSection(orgSection);
    setForm(mapped);
    snapshotRef.current = { ...mapped };

    if (regionalSection) {
      const r = regionalSection as Record<string, unknown>;
      const reg = {
        timezone: (r.timezone as string) || "",
        dateFormat: (r.dateFormat as string) || "",
        locale: (r.locale as string) || "",
        currency: (r.currency as string) || "",
        fiscalYearStart: (r.fiscalYearStart as string) || "",
      };
      setRegional(reg);
      regionalSnapshotRef.current = { ...reg };
    }

    initialized.current = true;
  }, [orgSection, regionalSection]);

  useEffect(() => {
    if (!regionalSection || !initialized.current) return;
    const r = regionalSection as Record<string, unknown>;
    const reg = {
      timezone: (r.timezone as string) || "",
      dateFormat: (r.dateFormat as string) || "",
      locale: (r.locale as string) || "",
      currency: (r.currency as string) || "",
      fiscalYearStart: (r.fiscalYearStart as string) || "",
    };
    setRegional(reg);
    regionalSnapshotRef.current = { ...reg };
  }, [regionalSection]);

  const computeChanges = useCallback(
    (snapshot: FormState, current: FormState) => {
      return JSON.stringify(snapshot) !== JSON.stringify(current);
    },
    []
  );

  const computeRegionalChanges = useCallback(
    (snapshot: typeof regional, current: typeof regional) => {
      return JSON.stringify(snapshot) !== JSON.stringify(current);
    },
    []
  );

  useEffect(() => {
    const generalChanged =
      form.legalName !== snapshotRef.current.legalName ||
      form.registrationNumber !== snapshotRef.current.registrationNumber ||
      form.taxId !== snapshotRef.current.taxId ||
      form.vatNumber !== snapshotRef.current.vatNumber ||
      form.industry !== snapshotRef.current.industry ||
      form.employeeCount !== snapshotRef.current.employeeCount ||
      form.foundedYear !== snapshotRef.current.foundedYear ||
      form.description !== snapshotRef.current.description;

    const contactChanged =
      form.mobile !== snapshotRef.current.mobile ||
      form.website !== snapshotRef.current.website ||
      form.city !== snapshotRef.current.city ||
      form.state !== snapshotRef.current.state ||
      form.country !== snapshotRef.current.country ||
      form.postalCode !== snapshotRef.current.postalCode;

    const financialChanged =
      JSON.stringify(form.bankDetails) !== JSON.stringify(snapshotRef.current.bankDetails) ||
      JSON.stringify(form.taxDetails) !== JSON.stringify(snapshotRef.current.taxDetails);

    const socialChanged =
      JSON.stringify(form.socialMedia) !== JSON.stringify(snapshotRef.current.socialMedia);

    setHasChanges({ general: generalChanged, contact: contactChanged, financial: financialChanged, social: socialChanged });
  }, [form]);

  const updateField = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateNested = useCallback(
    (group: "socialMedia" | "bankDetails" | "taxDetails", field: string, value: string) => {
      setForm((prev) => ({ ...prev, [group]: { ...prev[group], [field]: value } }));
    },
    []
  );

  const updateRegional = useCallback((field: string, value: string) => {
    setRegional((prev) => ({ ...prev, [field]: value }));
  }, []);

  const saveTab = useCallback(
    async (tab: string) => {
      setSavingTab(tab);
      try {
        if (tab === "general") {
          const { socialMedia, bankDetails, taxDetails, ...generalData } = form;
          await saveOrg(generalData);
          snapshotRef.current = { ...form };
        } else if (tab === "contact") {
          const { socialMedia, bankDetails, taxDetails, legalName, registrationNumber, taxId, vatNumber, industry, description, foundedYear, employeeCount, ...contactData } = form;
          await saveOrg({ legalName: form.legalName, registrationNumber: form.registrationNumber, taxId: form.taxId, vatNumber: form.vatNumber, industry: form.industry, description: form.description, foundedYear: form.foundedYear, employeeCount: form.employeeCount, ...contactData });
          snapshotRef.current = { ...form };
        } else if (tab === "financial") {
          await saveOrg({ bankDetails: form.bankDetails, taxDetails: form.taxDetails });
          snapshotRef.current = { ...form };
        } else if (tab === "social") {
          await saveOrg({ socialMedia: form.socialMedia });
          snapshotRef.current = { ...form };
        }
      } finally {
        setSavingTab(null);
      }
    },
    [form, saveOrg]
  );

  const saveRegionalTab = useCallback(async () => {
    setSavingTab("regional");
    try {
      await saveRegional(regional);
      regionalSnapshotRef.current = { ...regional };
    } finally {
      setSavingTab(null);
    }
  }, [regional, saveRegional]);

  const initials = useMemo(() => {
    const name = org?.name || "";
    return name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() || "?";
  }, [org?.name]);

  if (isLoading) return <SettingsPageSkeleton />;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="border-destructive">
          <CardContent className="py-10 text-center">
            <p className="text-destructive font-medium">Failed to load settings</p>
            <p className="text-muted-foreground text-sm mt-1">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-6 w-6" />
              {org?.name || "Organization Profile"}
            </h1>
            <p className="text-muted-foreground mt-1">Manage your organization&apos;s profile information</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General Info</TabsTrigger>
            <TabsTrigger value="contact">Contact & Address</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {org?.logo && <AvatarImage src={org.logo} alt={org.name} />}
                      <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">{initials}</AvatarFallback>
                    </Avatar>
                    <Button variant="secondary" size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full border-2 border-background shadow-md">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <p className="font-medium">{org?.name}</p>
                    <p className="text-sm text-muted-foreground">Click the camera icon to upload a new logo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic company information and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input value={org?.name || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Legal Name</Label>
                    <Input value={form.legalName} onChange={(e) => updateField("legalName", e.target.value)} placeholder="Enter legal name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Registration Number</Label>
                    <Input value={form.registrationNumber} onChange={(e) => updateField("registrationNumber", e.target.value)} placeholder="e.g. RC123456" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax ID</Label>
                    <Input value={form.taxId} onChange={(e) => updateField("taxId", e.target.value)} placeholder="e.g. 12345678-0001" />
                  </div>
                  <div className="space-y-2">
                    <Label>VAT Number</Label>
                    <Input value={form.vatNumber} onChange={(e) => updateField("vatNumber", e.target.value)} placeholder="VAT registration number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Industry</Label>
                    <Input value={form.industry} onChange={(e) => updateField("industry", e.target.value)} placeholder="e.g. Technology, Finance" />
                  </div>
                  <div className="space-y-2">
                    <Label>Employee Count</Label>
                    <Input value={form.employeeCount} onChange={(e) => updateField("employeeCount", e.target.value)} placeholder="e.g. 50" />
                  </div>
                  <div className="space-y-2">
                    <Label>Founded Year</Label>
                    <Input value={form.foundedYear} onChange={(e) => updateField("foundedYear", e.target.value)} placeholder="e.g. 2020" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => updateField("description", e.target.value)} placeholder="Brief description of your organization" rows={4} className="resize-none" />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => saveTab("general")} disabled={!hasChanges.general || savingTab === "general"}>
                    {savingTab === "general" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save General Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Phone numbers, email, and website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Mail className="h-4 w-4" /> Email</Label>
                    <Input type="email" value={org?.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</Label>
                    <Input value={org?.phone || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile</Label>
                    <Input value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)} placeholder="Additional mobile number" />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Globe className="h-4 w-4" /> Website</Label>
                    <Input value={form.website} onChange={(e) => updateField("website", e.target.value)} placeholder="https://example.com" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Company address details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input value={org?.address || ""} disabled />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <Label>State / Province</Label>
                    <Input value={form.state} onChange={(e) => updateField("state", e.target.value)} placeholder="State or province" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value={form.country} onChange={(e) => updateField("country", e.target.value)} placeholder="Country" />
                  </div>
                  <div className="space-y-2">
                    <Label>Postal Code</Label>
                    <Input value={form.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="Postal code" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => saveTab("contact")} disabled={!hasChanges.contact || savingTab === "contact"}>
                    {savingTab === "contact" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Contact & Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5" /> Bank Details</CardTitle>
                <CardDescription>Company banking information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input value={form.bankDetails.bankName} onChange={(e) => updateNested("bankDetails", "bankName", e.target.value)} placeholder="e.g. First Bank" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input value={form.bankDetails.accountName} onChange={(e) => updateNested("bankDetails", "accountName", e.target.value)} placeholder="Account holder name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input value={form.bankDetails.accountNumber} onChange={(e) => updateNested("bankDetails", "accountNumber", e.target.value)} placeholder="Account number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sort Code</Label>
                    <Input value={form.bankDetails.sortCode} onChange={(e) => updateNested("bankDetails", "sortCode", e.target.value)} placeholder="Sort code" />
                  </div>
                  <div className="space-y-2">
                    <Label>SWIFT Code</Label>
                    <Input value={form.bankDetails.swiftCode} onChange={(e) => updateNested("bankDetails", "swiftCode", e.target.value)} placeholder="SWIFT / BIC code" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Tax Details</CardTitle>
                <CardDescription>Tax registration and filing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tax Office</Label>
                    <Input value={form.taxDetails.taxOffice} onChange={(e) => updateNested("taxDetails", "taxOffice", e.target.value)} placeholder="Tax authority name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Tax Type</Label>
                    <Input value={form.taxDetails.taxType} onChange={(e) => updateNested("taxDetails", "taxType", e.target.value)} placeholder="e.g. Corporate Income Tax" />
                  </div>
                  <div className="space-y-2">
                    <Label>Filing Frequency</Label>
                    <Select value={form.taxDetails.filingFrequency} onValueChange={(val) => updateNested("taxDetails", "filingFrequency", val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {filingOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Locale, currency, and date preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Input value={regional.timezone} onChange={(e) => updateRegional("timezone", e.target.value)} placeholder="e.g. Africa/Lagos" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Input value={regional.dateFormat} onChange={(e) => updateRegional("dateFormat", e.target.value)} placeholder="e.g. DD/MM/YYYY" />
                  </div>
                  <div className="space-y-2">
                    <Label>Locale</Label>
                    <Input value={regional.locale} onChange={(e) => updateRegional("locale", e.target.value)} placeholder="e.g. en-NG" />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Input value={regional.currency} onChange={(e) => updateRegional("currency", e.target.value)} placeholder="e.g. NGN" />
                  </div>
                  <div className="space-y-2">
                    <Label>Fiscal Year Start</Label>
                    <Input value={regional.fiscalYearStart} onChange={(e) => updateRegional("fiscalYearStart", e.target.value)} placeholder="e.g. January" />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button onClick={saveRegionalTab} disabled={!computeRegionalChanges(regionalSnapshotRef.current, regional) || savingTab === "regional"}>
                    {savingTab === "regional" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Regional Settings
                  </Button>
                  <Button onClick={() => saveTab("financial")} disabled={!hasChanges.financial || savingTab === "financial"}>
                    {savingTab === "financial" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Financial Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>Connect your organization&apos;s social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Twitter / X</Label>
                    <Input value={form.socialMedia.twitter} onChange={(e) => updateNested("socialMedia", "twitter", e.target.value)} placeholder="https://twitter.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input value={form.socialMedia.linkedin} onChange={(e) => updateNested("socialMedia", "linkedin", e.target.value)} placeholder="https://linkedin.com/company/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input value={form.socialMedia.facebook} onChange={(e) => updateNested("socialMedia", "facebook", e.target.value)} placeholder="https://facebook.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input value={form.socialMedia.instagram} onChange={(e) => updateNested("socialMedia", "instagram", e.target.value)} placeholder="https://instagram.com/..." />
                  </div>
                  <div className="space-y-2">
                    <Label>YouTube</Label>
                    <Input value={form.socialMedia.youtube} onChange={(e) => updateNested("socialMedia", "youtube", e.target.value)} placeholder="https://youtube.com/..." />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => saveTab("social")} disabled={!hasChanges.social || savingTab === "social"}>
                    {savingTab === "social" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Social Media
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
