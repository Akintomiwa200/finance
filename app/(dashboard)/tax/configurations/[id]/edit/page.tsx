"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useTaxStore } from "@/src/store/tax-store";

export default function EditTaxConfigurationPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { configurations, loading, fetchConfigurations, getConfigurationById, updateConfiguration } = useTaxStore();
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { if (!configurations.length) fetchConfigurations(); }, [configurations.length, fetchConfigurations]);

  const config = getConfigurationById(id);

  const [form, setForm] = useState({
    name: "",
    rate: 0,
    threshold: "",
    isActive: true,
  });

  useEffect(() => {
    if (config && !initialized) {
      setForm({
        name: config.name,
        rate: config.rate,
        threshold: config.threshold?.toString() ?? "",
        isActive: config.isActive,
      });
      setInitialized(true);
    }
  }, [config, initialized]);

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
    const result = await updateConfiguration(id, {
      name: form.name,
      rate: form.rate,
      threshold: form.threshold !== "" ? parseFloat(form.threshold) : null,
      isActive: form.isActive,
    });
    setSubmitting(false);
    if (result) router.push(`/tax/configurations/${id}`);
  };

  if (loading && !config) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/tax/configurations")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Configurations
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Configuration not found</p>
              <p className="text-muted-foreground">The tax configuration you are trying to edit does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Tax</span>
        <span>/</span>
        <button onClick={() => router.push("/tax/configurations")} className="hover:text-foreground">Configurations</button>
        <span>/</span>
        <button onClick={() => router.push(`/tax/configurations/${id}`)} className="hover:text-foreground">{config.name}</button>
        <span>/</span>
        <span className="text-foreground">Edit</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/tax/configurations/${id}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Tax Configuration</h1>
          <p className="text-muted-foreground mt-1">Update {config.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration Details</CardTitle>
          <CardDescription>Update the tax configuration information below</CardDescription>
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
        <Button variant="outline" onClick={() => router.push(`/tax/configurations/${id}`)} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
