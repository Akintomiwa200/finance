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
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import {
  FileText,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useSettingsSection, useSyncSectionData } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

export default function TaxCodesPage() {
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("tax");

  const [enableVAT, setEnableVAT] = useState(false);
  const [enableWithholdingTax, setEnableWithholdingTax] = useState(false);
  const [enableTaxReporting, setEnableTaxReporting] = useState(false);

  useSyncSectionData(data, settingsVersion, false, (section) => {
    setEnableVAT(Boolean(section.enableVAT));
    setEnableWithholdingTax(Boolean(section.enableWithholdingTax));
    setEnableTaxReporting(Boolean(section.enableTaxReporting));
  });

  const handleToggle = async (key: string, checked: boolean) => {
    await saveSection({ [key]: checked });
  };

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Tax Codes
        </h1>
        <p className="text-muted-foreground mt-1">
          Enable or disable tax types for your organization
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              VAT Configuration
            </span>
            <Badge variant={enableVAT ? "default" : "secondary"}>
              {enableVAT ? "Enabled" : "Disabled"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Enable VAT to apply value added tax on applicable transactions and invoices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableVAT">Enable VAT</Label>
              <p className="text-xs text-muted-foreground">
                Toggle VAT calculations on sales and purchase transactions
              </p>
            </div>
            <Switch
              id="enableVAT"
              checked={enableVAT}
              onCheckedChange={(checked) => {
                setEnableVAT(checked);
                handleToggle("enableVAT", checked);
              }}
            />
          </div>
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              When enabled, VAT will be calculated and applied to all eligible sales and purchase transactions. The VAT rate can be configured on the Tax Rates page.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Withholding Tax
            </span>
            <Badge variant={enableWithholdingTax ? "default" : "secondary"}>
              {enableWithholdingTax ? "Enabled" : "Disabled"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Enable withholding tax to deduct tax at source on eligible payments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableWHT">Enable Withholding Tax</Label>
              <p className="text-xs text-muted-foreground">
                Automatically calculate withholding tax on vendor and supplier payments
              </p>
            </div>
            <Switch
              id="enableWHT"
              checked={enableWithholdingTax}
              onCheckedChange={(checked) => {
                setEnableWithholdingTax(checked);
                handleToggle("enableWithholdingTax", checked);
              }}
            />
          </div>
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              When enabled, withholding tax will be automatically deducted at source on qualifying vendor and supplier payments. Configure the default rate on the Tax Rates page.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tax Reporting
            </span>
            <Badge variant={enableTaxReporting ? "default" : "secondary"}>
              {enableTaxReporting ? "Enabled" : "Disabled"}
            </Badge>
          </CardTitle>
          <CardDescription>
            Enable tax reporting to generate tax summaries and filing reports.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="enableReporting">Enable Tax Reporting</Label>
              <p className="text-xs text-muted-foreground">
                Generate tax liability reports and export data for filing
              </p>
            </div>
            <Switch
              id="enableReporting"
              checked={enableTaxReporting}
              onCheckedChange={(checked) => {
                setEnableTaxReporting(checked);
                handleToggle("enableTaxReporting", checked);
              }}
            />
          </div>
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              When enabled, you can generate tax liability summaries and export tax data in formats suitable for filing with tax authorities. Filing frequency is configured on the Tax Authorities page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
