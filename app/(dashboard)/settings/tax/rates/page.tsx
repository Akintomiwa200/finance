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
  Percent,
  Save,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { useSettingsSection, useSyncSectionData } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

export default function TaxRatesPage() {
  const { data, isLoading, saveSection, settingsVersion } = useSettingsSection("tax");

  const [isSaving, setIsSaving] = useState(false);

  const [defaultVATRate, setDefaultVATRate] = useState("");
  const [defaultWHTRate, setDefaultWHTRate] = useState("");
  const [originalVATRate, setOriginalVATRate] = useState("");
  const [originalWHTRate, setOriginalWHTRate] = useState("");

  const hasChanges =
    defaultVATRate !== originalVATRate || defaultWHTRate !== originalWHTRate;

  useSyncSectionData(data, settingsVersion, hasChanges, (section) => {
    const vat = String(section.defaultVATRate ?? "");
    const wht = String(section.defaultWHTRate ?? "");
    setDefaultVATRate(vat);
    setDefaultWHTRate(wht);
    setOriginalVATRate(vat);
    setOriginalWHTRate(wht);
  });

  const vatRate = defaultVATRate === "" ? null : Number(defaultVATRate);
  const whtRate = defaultWHTRate === "" ? null : Number(defaultWHTRate);

  const isVATInvalid = vatRate !== null && (vatRate < 0 || vatRate > 100);
  const isWHTInvalid = whtRate !== null && (whtRate < 0 || whtRate > 100);
  const isInvalid = isVATInvalid || isWHTInvalid;

  const handleSave = async () => {
    if (isInvalid) return;
    setIsSaving(true);
    await saveSection({
      defaultVATRate: defaultVATRate === "" ? null : Number(defaultVATRate),
      defaultWHTRate: defaultWHTRate === "" ? null : Number(defaultWHTRate),
    });
    setOriginalVATRate(defaultVATRate);
    setOriginalWHTRate(defaultWHTRate);
    setIsSaving(false);
  };

  const handleReset = () => {
    setDefaultVATRate(originalVATRate);
    setDefaultWHTRate(originalWHTRate);
  };

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Percent className="h-6 w-6" />
            Tax Rates
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure default VAT and withholding tax rates
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
            disabled={isSaving || !hasChanges || isInvalid}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              VAT Rate
            </span>
            {vatRate !== null && !isVATInvalid && (
              <Badge variant="outline">{vatRate}%</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Set the default VAT rate applied to taxable transactions. Enter the rate as a percentage (e.g. 7.5 for 7.5%).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="vatRate">Default VAT Rate (%)</Label>
            <div className="relative">
              <Input
                id="vatRate"
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={defaultVATRate}
                onChange={(e) => setDefaultVATRate(e.target.value)}
                placeholder="e.g. 7.5"
                className={isVATInvalid ? "border-destructive" : ""}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={defaultVATRate === "" ? 0 : Math.min(Number(defaultVATRate), 30)}
              onChange={(e) => setDefaultVATRate(e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
            {isVATInvalid && (
              <p className="text-xs text-destructive">
                Rate must be between 0% and 100%.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This rate will be used as the default for all new VAT-eligible transactions.
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              The VAT rate is applied to the net amount of taxable transactions. Individual items or transactions can override this default rate.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Withholding Tax Rate
            </span>
            {whtRate !== null && !isWHTInvalid && (
              <Badge variant="outline">{whtRate}%</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Set the default withholding tax rate deducted at source. Enter the rate as a percentage (e.g. 10 for 10%).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="whtRate">Default WHT Rate (%)</Label>
            <div className="relative">
              <Input
                id="whtRate"
                type="number"
                min={0}
                max={100}
                step={0.01}
                value={defaultWHTRate}
                onChange={(e) => setDefaultWHTRate(e.target.value)}
                placeholder="e.g. 10"
                className={isWHTInvalid ? "border-destructive" : ""}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                %
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={defaultWHTRate === "" ? 0 : Math.min(Number(defaultWHTRate), 30)}
              onChange={(e) => setDefaultWHTRate(e.target.value)}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>15%</span>
              <span>30%</span>
            </div>
            {isWHTInvalid && (
              <p className="text-xs text-destructive">
                Rate must be between 0% and 100%.
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This rate will be applied by default on eligible vendor and supplier payments.
            </p>
          </div>
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Withholding tax is deducted from the gross payment amount before the vendor receives payment. Individual payment entries can override this default rate.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
