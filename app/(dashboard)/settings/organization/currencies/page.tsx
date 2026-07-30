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
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import { ArrowLeft, Globe, Save, RotateCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettingsSection } from "@/src/hooks/use-settings-section";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const BASE_CURRENCIES = [
  { code: "USD", name: "US Dollar", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "EUR", name: "Euro", flag: "\u{1F1EA}\u{1F1FA}" },
  { code: "GBP", name: "British Pound", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "NGN", name: "Nigerian Naira", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "JPY", name: "Japanese Yen", flag: "\u{1F1EF}\u{1F1F5}" },
  { code: "CAD", name: "Canadian Dollar", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "AUD", name: "Australian Dollar", flag: "\u{1F1E6}\u{1F1FA}" },
];

const SUPPORTED_CURRENCIES = [
  { code: "USD", flag: "\u{1F1FA}\u{1F1F8}", name: "US Dollar", symbol: "$", rate: 1.0 },
  { code: "EUR", flag: "\u{1F1EA}\u{1F1FA}", name: "Euro", symbol: "\u20AC", rate: 0.92 },
  { code: "GBP", flag: "\u{1F1EC}\u{1F1E7}", name: "British Pound", symbol: "\u00A3", rate: 0.79 },
  { code: "NGN", flag: "\u{1F1F3}\u{1F1EC}", name: "Nigerian Naira", symbol: "\u20A6", rate: 1500.0 },
  { code: "JPY", flag: "\u{1F1EF}\u{1F1F5}", name: "Japanese Yen", symbol: "\u00A5", rate: 149.5 },
  { code: "CAD", flag: "\u{1F1E8}\u{1F1E6}", name: "Canadian Dollar", symbol: "C$", rate: 1.36 },
  { code: "AUD", flag: "\u{1F1E6}\u{1F1FA}", name: "Australian Dollar", symbol: "A$", rate: 1.52 },
  { code: "CHF", flag: "\u{1F1E8}\u{1F1ED}", name: "Swiss Franc", symbol: "Fr", rate: 0.88 },
  { code: "CNY", flag: "\u{1F1E8}\u{1F1F3}", name: "Chinese Yuan", symbol: "\u00A5", rate: 7.25 },
  { code: "INR", flag: "\u{1F1EE}\u{1F1F3}", name: "Indian Rupee", symbol: "\u20B9", rate: 83.5 },
  { code: "ZAR", flag: "\u{1F1FF}\u{1F1E6}", name: "South African Rand", symbol: "R", rate: 18.2 },
  { code: "GHS", flag: "\u{1F1EC}\u{1F1ED}", name: "Ghanaian Cedi", symbol: "\u20B5", rate: 15.2 },
];

interface AccountingForm {
  enableMultiCurrency: boolean;
  baseCurrency: string;
  decimalPlaces: string;
  exchangeRatePrecision: string;
  enabledCurrencies: string[];
}

const emptyForm: AccountingForm = {
  enableMultiCurrency: false,
  baseCurrency: "USD",
  decimalPlaces: "2",
  exchangeRatePrecision: "4",
  enabledCurrencies: ["USD", "EUR", "GBP", "NGN", "JPY", "CAD", "AUD"],
};

function mapAccounting(data: Record<string, unknown> | null): AccountingForm {
  if (!data) return { ...emptyForm };
  return {
    enableMultiCurrency: (data.enableMultiCurrency as boolean) ?? false,
    baseCurrency: (data.baseCurrency as string) || "USD",
    decimalPlaces: String((data.decimalPlaces as number) ?? 2),
    exchangeRatePrecision: String((data.exchangeRatePrecision as number) ?? 4),
    enabledCurrencies: (data.enabledCurrencies as string[]) || ["USD", "EUR", "GBP", "NGN", "JPY", "CAD", "AUD"],
  };
}

export default function CurrenciesSettings() {
  const router = useRouter();
  const { data, isLoading, error, saveSection, settingsVersion } = useSettingsSection("accounting");

  const [form, setForm] = useState<AccountingForm>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const initialized = useRef(false);
  const snapshotRef = useRef<AccountingForm>({ ...emptyForm });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!data || initialized.current) return;
    const mapped = mapAccounting(data);
    setForm(mapped);
    snapshotRef.current = { ...mapped };
    initialized.current = true;
  }, [data]);

  useEffect(() => {
    if (!data || !initialized.current) return;
    if (hasChanges) return;
    const mapped = mapAccounting(data);
    setForm(mapped);
    snapshotRef.current = { ...mapped };
  }, [data, settingsVersion, hasChanges]);

  useEffect(() => {
    if (!initialized.current) return;
    setHasChanges(JSON.stringify(form) !== JSON.stringify(snapshotRef.current));
  }, [form]);

  const updateField = useCallback((field: keyof AccountingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleMultiCurrency = useCallback(() => {
    setForm((prev) => ({ ...prev, enableMultiCurrency: !prev.enableMultiCurrency }));
  }, []);

  const toggleCurrency = useCallback((code: string) => {
    setForm((prev) => {
      const enabled = prev.enabledCurrencies.includes(code)
        ? prev.enabledCurrencies.filter((c) => c !== code)
        : [...prev.enabledCurrencies, code];
      return { ...prev, enabledCurrencies: enabled };
    });
  }, []);

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

  const baseInfo = BASE_CURRENCIES.find((c) => c.code === form.baseCurrency) || BASE_CURRENCIES[0];
  const previewDecimalPlaces = parseInt(form.decimalPlaces) || 2;
  const previewPrecision = parseInt(form.exchangeRatePrecision) || 4;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Currency Settings
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure base currency, multi-currency, and exchange rate precision
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
        {/* Base Currency */}
        <Card>
          <CardHeader>
            <CardTitle>Base Currency</CardTitle>
            <CardDescription>
              The primary currency used for all accounting entries and financial
              reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm">
              <Label>Select Base Currency</Label>
              <Select value={form.baseCurrency} onValueChange={(v) => updateField("baseCurrency", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {BASE_CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.flag} {c.code} — {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-3 rounded-lg border p-3 bg-muted/50 flex items-center gap-3">
                <span className="text-3xl">{baseInfo.flag}</span>
                <div>
                  <p className="font-semibold">
                    {baseInfo.code} — {baseInfo.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All other currencies will be compared against this base.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Currency */}
        <Card>
          <CardHeader>
            <CardTitle>Multi-Currency Support</CardTitle>
            <CardDescription>
              Enable transactions in multiple currencies. When enabled, you can
              record and track amounts in currencies other than your base currency.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between max-w-sm">
              <div className="space-y-0.5">
                <Label htmlFor="multi-currency-switch">Enable Multi-Currency</Label>
                <p className="text-sm text-muted-foreground">
                  {form.enableMultiCurrency
                    ? "Multi-currency is enabled"
                    : "Only base currency transactions are supported"}
                </p>
              </div>
              <Switch
                id="multi-currency-switch"
                checked={form.enableMultiCurrency}
                onCheckedChange={toggleMultiCurrency}
              />
            </div>
          </CardContent>
        </Card>

        {/* Exchange Rate Precision */}
        <Card>
          <CardHeader>
            <CardTitle>Exchange Rate Precision</CardTitle>
            <CardDescription>
              Control the number of decimal places used for exchange rate values.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-w-sm">
              <Label>Decimal Places</Label>
              <Select
                value={form.exchangeRatePrecision}
                onValueChange={(v) => updateField("exchangeRatePrecision", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select precision" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} decimal{n !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border p-3 bg-muted/50 max-w-md">
              <p className="text-sm text-muted-foreground mb-1">Preview</p>
              <p className="font-mono text-lg">
                1 {form.baseCurrency} = {"1.0".padEnd(previewPrecision + 2, "0").slice(0, previewPrecision + 1)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Exchange rates will be stored with {previewPrecision} decimal place{previewPrecision !== 1 ? "s" : ""}.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Supported Currencies */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Currencies</CardTitle>
            <CardDescription>
              Currencies available for use in the system. Toggle to enable or
              disable individual currencies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Flag</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SUPPORTED_CURRENCIES.map((currency) => {
                  const isBase = currency.code === form.baseCurrency;
                  const isEnabled = form.enabledCurrencies.includes(currency.code);
                  return (
                    <TableRow key={currency.code}>
                      <TableCell>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={() => toggleCurrency(currency.code)}
                          disabled={isBase}
                        />
                      </TableCell>
                      <TableCell className="text-2xl">{currency.flag}</TableCell>
                      <TableCell className="font-mono font-medium">
                        {currency.code}
                      </TableCell>
                      <TableCell>{currency.name}</TableCell>
                      <TableCell>{currency.symbol}</TableCell>
                      <TableCell className="text-right font-mono">
                        {currency.rate.toFixed(
                          parseInt(form.exchangeRatePrecision) || 4,
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {isBase ? (
                          <Badge className="bg-blue-100 text-blue-700">Base</Badge>
                        ) : isEnabled ? (
                          <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                        ) : (
                          <Badge variant="secondary">Disabled</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
