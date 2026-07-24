"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Switch } from "@/src/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import { useTaxStore } from "@/src/store/tax-store";

export default function NewTaxConfigurationPage() {
  const router = useRouter();
  const { addConfiguration } = useTaxStore();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    rate: 0,
    threshold: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Configuration name is required";
    if (form.rate <= 0 || form.rate > 100) e.rate = "Rate must be between 0 and 100";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addConfiguration({
      name: form.name,
      rate: form.rate,
      threshold: form.threshold !== "" ? parseFloat(form.threshold) : null,
      isActive: form.isActive,
    });
    setSubmitting(false);
    if (result) router.push("/tax/configurations");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Tax</span>
        <span>/</span>
        <button onClick={() => router.push("/tax/configurations")} className="hover:text-foreground">Configurations</button>
        <span>/</span>
        <span className="text-foreground">New Configuration</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/tax/configurations")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Tax Configuration</h1>
          <p className="text-muted-foreground mt-1">Add a new tax rate or rule</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Details</CardTitle>
          <CardDescription>Enter the tax configuration information below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Configuration Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. VAT, Withholding Tax" />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Rate (%) *</Label>
              <Input id="rate" type="number" min={0} max={100} step={0.01} value={form.rate || ""} onChange={(e) => set("rate", parseFloat(e.target.value) || 0)} placeholder="e.g. 7.5" />
              {errors.rate && <p className="text-sm text-destructive">{errors.rate}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold (Optional)</Label>
              <Input id="threshold" type="number" min={0} value={form.threshold} onChange={(e) => set("threshold", e.target.value)} placeholder="Minimum amount for tax to apply" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-3 pt-2">
                <Switch checked={form.isActive} onCheckedChange={(v) => set("isActive", v)} />
                <span className="text-sm">{form.isActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/tax/configurations")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Configuration"}
        </Button>
      </div>
    </div>
  );
}
