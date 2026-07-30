"use client";

import { useState, useCallback } from "react";
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
import { Badge } from "@/src/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Building2,
  Save,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { useSettingsSection, useSyncSectionData } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const FILING_FREQUENCY_OPTIONS = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi-annually", label: "Semi-Annually" },
  { value: "annually", label: "Annually" },
];

function getCurrentTaxPeriod(frequency: string): { period: string; dueDate: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (frequency) {
    case "monthly": {
      const monthName = now.toLocaleString("default", { month: "long" });
      const dueDate = new Date(year, month + 1, 0);
      return {
        period: `${monthName} ${year}`,
        dueDate: dueDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };
    }
    case "quarterly": {
      const quarter = Math.floor(month / 3) + 1;
      const quarterStart = (quarter - 1) * 3;
      const quarterEnd = quarterStart + 2;
      const dueDate = new Date(year, quarterEnd + 1, 0);
      return {
        period: `Q${quarter} ${year} (Months ${quarterStart + 1}-${quarterEnd + 1})`,
        dueDate: dueDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };
    }
    case "semi-annually": {
      const half = month < 6 ? 1 : 2;
      const dueDate = half === 1 ? new Date(year, 6, 31) : new Date(year + 1, 0, 31);
      return {
        period: `H${half} ${year}`,
        dueDate: dueDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };
    }
    case "annually": {
      return {
        period: `FY ${year}`,
        dueDate: new Date(year, 11, 31).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };
    }
    default:
      return { period: "Not configured", dueDate: "N/A" };
  }
}

export default function TaxAuthoritiesPage() {
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("tax");

  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const [filingFrequency, setFilingFrequency] = useState("");
  const [taxIdentificationNumber, setTaxIdentificationNumber] = useState("");
  const [originalFrequency, setOriginalFrequency] = useState("");
  const [originalTIN, setOriginalTIN] = useState("");

  const hasChanges =
    filingFrequency !== originalFrequency ||
    taxIdentificationNumber !== originalTIN;

  useSyncSectionData(data, settingsVersion, hasChanges, (section) => {
    const freq = String(section.filingFrequency ?? "");
    const tin = String(section.taxIdentificationNumber ?? "");
    setFilingFrequency(freq);
    setTaxIdentificationNumber(tin);
    setOriginalFrequency(freq);
    setOriginalTIN(tin);
  });

  const handleSave = async () => {
    setIsSaving(true);
    await saveSection({ filingFrequency, taxIdentificationNumber });
    setOriginalFrequency(filingFrequency);
    setOriginalTIN(taxIdentificationNumber);
    setIsSaving(false);
  };

  const handleReset = () => {
    setFilingFrequency(originalFrequency);
    setTaxIdentificationNumber(originalTIN);
  };

  const handleCopyTIN = async () => {
    if (!taxIdentificationNumber) return;
    await navigator.clipboard.writeText(taxIdentificationNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const taxPeriod = getCurrentTaxPeriod(filingFrequency);

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Tax Authorities
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure tax authority registration and filing details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || isSaving}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Tax Identification Number
          </CardTitle>
          <CardDescription>
            Enter your organization&apos;s tax identification number (TIN) issued by the relevant tax authority.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md space-y-2">
            <Label htmlFor="tin">Tax Identification Number (TIN)</Label>
            <div className="flex gap-2">
              <Input
                id="tin"
                value={taxIdentificationNumber}
                onChange={(e) => setTaxIdentificationNumber(e.target.value)}
                placeholder="e.g. 12345678-0001"
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyTIN}
                disabled={!taxIdentificationNumber}
                title="Copy TIN"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              This number will appear on invoices, tax returns, and filing documents.
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Ensure your TIN matches the one registered with your national tax authority. An incorrect TIN may result in filing rejections or penalties.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Filing Frequency
          </CardTitle>
          <CardDescription>
            Select how often your organization files tax returns with the authorities.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md space-y-2">
            <Label>Filing Frequency</Label>
            <Select value={filingFrequency} onValueChange={setFilingFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select filing frequency" />
              </SelectTrigger>
              <SelectContent>
                {FILING_FREQUENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {filingFrequency === "monthly"
                ? "Returns are due on the last day of each month."
                : filingFrequency === "quarterly"
                  ? "Returns are due at the end of each fiscal quarter."
                  : filingFrequency === "semi-annually"
                    ? "Returns are due twice per year."
                    : filingFrequency === "annually"
                      ? "Returns are due once per year."
                      : "Select a frequency to see the filing schedule."}
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Changing the filing frequency will affect when tax returns are generated and which periods are included in reports.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Current Tax Period
          </CardTitle>
          <CardDescription>
            Based on your filing frequency, here is the current tax period information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-md space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Current Period
                </p>
                <p className="text-sm font-semibold">
                  {filingFrequency ? taxPeriod.period : "Not configured"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Filing Due Date
                </p>
                <p className="text-sm font-semibold">
                  {filingFrequency ? taxPeriod.dueDate : "N/A"}
                </p>
              </div>
            </div>
            {filingFrequency && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {FILING_FREQUENCY_OPTIONS.find((o) => o.value === filingFrequency)?.label ?? "Not set"}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
