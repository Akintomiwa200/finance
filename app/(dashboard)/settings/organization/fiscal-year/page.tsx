"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import { ArrowLeft, Calendar, Save, RotateCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettingsSection } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const MONTHS = [
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
];

const DATE_FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

const TIMEZONES = [
  "Africa/Lagos",
  "Africa/Johannesburg",
  "Africa/Nairobi",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Australia/Sydney",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "UTC",
];

const LOCALES = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-NG", label: "English (Nigeria)" },
  { value: "fr-FR", label: "French (France)" },
  { value: "de-DE", label: "German (Germany)" },
  { value: "es-ES", label: "Spanish (Spain)" },
  { value: "pt-BR", label: "Portuguese (Brazil)" },
  { value: "zh-CN", label: "Chinese (Simplified)" },
  { value: "ja-JP", label: "Japanese (Japan)" },
  { value: "ar-SA", label: "Arabic (Saudi Arabia)" },
];

function computeFiscalPeriod(fiscalYearStart: string): string {
  const startIdx = MONTHS.indexOf(fiscalYearStart);
  if (startIdx === -1) return "Not configured";
  const now = new Date();
  const currentYear = now.getFullYear();
  const startMonth = startIdx;
  const endMonth = (startMonth + 11) % 12;
  const endYear = startMonth > endMonth ? currentYear + 1 : currentYear;
  return `${MONTHS[startMonth]} ${startYear(now, startMonth)} – ${MONTHS[endMonth]} ${currentYear + (startMonth > endMonth ? 1 : 0)}`;
}

function startYear(now: Date, startMonth: number): number {
  return now.getMonth() >= startMonth ? now.getFullYear() : now.getFullYear() - 1;
}

interface RegionalForm {
  timezone: string;
  dateFormat: string;
  locale: string;
  currency: string;
  fiscalYearStart: string;
}

const emptyForm: RegionalForm = {
  timezone: "",
  dateFormat: "",
  locale: "",
  currency: "",
  fiscalYearStart: "",
};

function mapRegional(data: Record<string, unknown> | null): RegionalForm {
  if (!data) return { ...emptyForm };
  return {
    timezone: (data.timezone as string) || "",
    dateFormat: (data.dateFormat as string) || "",
    locale: (data.locale as string) || "",
    currency: (data.currency as string) || "",
    fiscalYearStart: (data.fiscalYearStart as string) || "",
  };
}

export default function FiscalYearSettings() {
  const router = useRouter();
  const { data, isLoading, error, saveSection } = useSettingsSection("regional");

  const [form, setForm] = useState<RegionalForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const initialized = useRef(false);
  const snapshotRef = useRef<RegionalForm>({ ...emptyForm });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!data || initialized.current) return;
    const mapped = mapRegional(data);
    setForm(mapped);
    snapshotRef.current = { ...mapped };
    initialized.current = true;
  }, [data]);

  useEffect(() => {
    if (!initialized.current) return;
    setHasChanges(JSON.stringify(form) !== JSON.stringify(snapshotRef.current));
  }, [form]);

  const updateField = useCallback(
    (field: keyof RegionalForm, value: string) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await saveSection({ ...form });
      snapshotRef.current = { ...form };
      setHasChanges(false);
    } finally {
      setSaving(false);
    }
  }, [form, saveSection]);

  const handleReset = useCallback(() => {
    setForm({ ...snapshotRef.current });
    setHasChanges(false);
  }, []);

  if (isLoading) return <SettingsPageSkeleton />;

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="border-destructive">
          <CardContent className="py-10 text-center">
            <p className="text-destructive font-medium">Failed to load settings</p>
            <p className="text-muted-foreground text-sm mt-1">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
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
              <Calendar className="h-6 w-6" />
              Fiscal Year &amp; Regional Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure fiscal year, date format, timezone, and locale preferences
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges || saving} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Fiscal Year Start Month */}
        <Card>
          <CardHeader>
            <CardTitle>Fiscal Year Start Month</CardTitle>
            <CardDescription>
              The month your fiscal year begins. All financial reporting periods
              will be aligned to this start month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <Label>Select Month</Label>
              <Select value={form.fiscalYearStart} onValueChange={(v) => updateField("fiscalYearStart", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a month" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                For example, if set to April, your fiscal year runs April through March.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Fiscal Period */}
        <Card>
          <CardHeader>
            <CardTitle>Current Fiscal Period</CardTitle>
            <CardDescription>
              Based on your fiscal year start month, this shows the current fiscal
              period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Active Fiscal Year</p>
              <p className="text-lg font-semibold">
                {computeFiscalPeriod(form.fiscalYearStart)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Date Format */}
        <Card>
          <CardHeader>
            <CardTitle>Date Format</CardTitle>
            <CardDescription>
              Choose how dates are displayed throughout the application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <Label>Display Format</Label>
              <Select value={form.dateFormat} onValueChange={(v) => updateField("dateFormat", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FORMATS.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>
                      {fmt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-2">
                Example: {form.dateFormat === "DD/MM/YYYY" ? "25/07/2026" : form.dateFormat === "YYYY-MM-DD" ? "2026-07-25" : "07/25/2026"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timezone */}
        <Card>
          <CardHeader>
            <CardTitle>Timezone</CardTitle>
            <CardDescription>
              Set the default timezone for date and time operations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <Label>Timezone</Label>
              <Select value={form.timezone} onValueChange={(v) => updateField("timezone", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Locale */}
        <Card>
          <CardHeader>
            <CardTitle>Locale</CardTitle>
            <CardDescription>
              Set the language and regional formatting preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <Label>Language / Locale</Label>
              <Select value={form.locale} onValueChange={(v) => updateField("locale", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  {LOCALES.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
