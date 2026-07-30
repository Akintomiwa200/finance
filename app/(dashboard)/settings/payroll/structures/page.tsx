"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  Clock,
  Calculator,
  Eye,
  Save,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Badge } from "@/src/components/ui/badge";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { useSettingsSection } from "@/src/hooks/use-settings-section";

const PAY_FREQUENCY_OPTIONS = [
  { value: "weekly", label: "Weekly", description: "52 pay periods per year" },
  { value: "bi-weekly", label: "Bi-Weekly", description: "26 pay periods per year" },
  { value: "semi-monthly", label: "Semi-Monthly", description: "24 pay periods per year (1st & 15th)" },
  { value: "monthly", label: "Monthly", description: "12 pay periods per year" },
];

const TAX_CALCULATION_OPTIONS = [
  { value: "AUTOMATIC", label: "Automatic", description: "System calculates tax based on current tax brackets and employee W-4 info" },
  { value: "MANUAL", label: "Manual", description: "Manually enter tax amounts per employee each pay period" },
];

export default function PayrollStructuresPage() {
  const { data, isLoading, saveSection } = useSettingsSection("payroll");

  const [payFrequency, setPayFrequency] = useState("monthly");
  const [overtimeRate, setOvertimeRate] = useState("1.5");
  const [taxCalculation, setTaxCalculation] = useState("AUTOMATIC");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (data) {
      setPayFrequency((data.payFrequency as string) || "monthly");
      setOvertimeRate(String(data.overtimeRate ?? "1.5"));
      setTaxCalculation((data.taxCalculation as string) || "AUTOMATIC");
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const changed =
      payFrequency !== (data.payFrequency || "monthly") ||
      overtimeRate !== String(data.overtimeRate ?? "1.5") ||
      taxCalculation !== (data.taxCalculation || "AUTOMATIC");
    setHasChanges(changed);
  }, [payFrequency, overtimeRate, taxCalculation, data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection({ payFrequency, overtimeRate: Number(overtimeRate), taxCalculation });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (data) {
      setPayFrequency((data.payFrequency as string) || "monthly");
      setOvertimeRate(String(data.overtimeRate ?? "1.5"));
      setTaxCalculation((data.taxCalculation as string) || "AUTOMATIC");
    }
  };

  const selectedFrequency = useMemo(
    () => PAY_FREQUENCY_OPTIONS.find((o) => o.value === payFrequency),
    [payFrequency]
  );

  const selectedTax = useMemo(
    () => TAX_CALCULATION_OPTIONS.find((o) => o.value === taxCalculation),
    [taxCalculation]
  );

  const previewSalary = 5000;
  const previewOvertimeHours = 10;
  const previewOvertimePay = previewOvertimeHours * (previewSalary / 173.33) * Number(overtimeRate);
  const previewTax = taxCalculation === "AUTOMATIC" ? previewSalary * 0.22 : 0;

  if (isLoading) return <SettingsPageSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8 text-primary" />
            Salary Structures
          </h1>
          <p className="text-muted-foreground">
            Define salary grades, pay frequency, and tax rules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!hasChanges || isSaving}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Pay Frequency</CardTitle>
              <CardDescription>
                How often employees are paid — determines the number of pay periods per year
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Frequency</Label>
            <Select value={payFrequency} onValueChange={setPayFrequency}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {PAY_FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedFrequency && (
            <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              {selectedFrequency.description}. Employees on this schedule will receive{' '}
              <span className="font-medium text-foreground">{selectedFrequency.label.toLowerCase()}</span> pay.
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Overtime Rate</CardTitle>
              <CardDescription>
                Multiplier applied to the hourly rate for overtime hours worked beyond the standard schedule
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Rate Multiplier</Label>
            <div className="flex items-center gap-3 max-w-md">
              <Input
                type="number"
                min={1.0}
                max={3.0}
                step={0.25}
                value={overtimeRate}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || (Number(val) >= 1.0 && Number(val) <= 3.0)) {
                    setOvertimeRate(val);
                  }
                }}
                className="w-24"
              />
              <span className="text-lg font-medium text-muted-foreground">×</span>
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={1.0}
              max={3.0}
              step={0.25}
              value={overtimeRate || 1.0}
              onChange={(e) => setOvertimeRate(e.target.value)}
              className="w-full max-w-md accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground max-w-md">
              <span>1.0× (No premium)</span>
              <span>1.5× (Time & half)</span>
              <span>2.0× (Double)</span>
              <span>3.0×</span>
            </div>
          </div>
          <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
            At <span className="font-medium text-foreground">{Number(overtimeRate).toFixed(2)}×</span>,
            an employee earning $5,000/month ($28.85/hr) would receive{' '}
            <span className="font-medium text-foreground">
              ${(28.85 * Number(overtimeRate)).toFixed(2)}/hr
            </span>{' '}
            for overtime work.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Tax Calculation</CardTitle>
              <CardDescription>
                Method used to calculate employee tax withholdings each pay period
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Calculation Method</Label>
            <Select value={taxCalculation} onValueChange={setTaxCalculation}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {TAX_CALCULATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <div className="flex flex-col">
                      <span>{opt.label}</span>
                      <span className="text-xs text-muted-foreground">{opt.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedTax && (
            <div className="rounded-md bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
              {selectedTax.description}.
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Payslip Preview</CardTitle>
              <CardDescription>
                Preview of how a payslip would look with current structure settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border bg-background p-6 space-y-4 max-w-lg">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-semibold">ACME Corporation</p>
                <p className="text-sm text-muted-foreground">Payslip — Sample Employee</p>
              </div>
              <Badge variant="outline">{selectedFrequency?.label}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Salary</span>
                <span className="font-medium">${previewSalary.toLocaleString()}.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Overtime ({previewOvertimeHours}h × {Number(overtimeRate)}×)</span>
                <span className="font-medium">${previewOvertimePay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-destructive">
                <span>Tax Withholding ({taxCalculation === "AUTOMATIC" ? "Auto 22%" : "Manual"})</span>
                <span className="font-medium">
                  {taxCalculation === "AUTOMATIC" ? `-$${previewTax.toFixed(2)}` : "—"}
                </span>
              </div>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="font-semibold">Net Pay</span>
              <span className="font-semibold text-lg">
                ${(previewSalary + previewOvertimePay - previewTax).toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
