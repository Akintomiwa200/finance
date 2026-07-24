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
import { Textarea } from "@/src/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useEmployeeStore } from "@/src/store/employee-store";

export default function NewDepartmentPage() {
  const router = useRouter();
  const { addDepartment } = useEmployeeStore();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    costCenter: "",
    budgetAmount: 0,
    head: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Department name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addDepartment({
      name: form.name,
      code: form.code || undefined,
      description: form.description || null,
      costCenter: form.costCenter || null,
      budgetAmount: form.budgetAmount,
      head: form.head || null,
    });
    setSubmitting(false);
    if (result) router.push("/departments");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Departments</span>
        <span>/</span>
        <span className="text-foreground">New Department</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/departments")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Department</h1>
          <p className="text-muted-foreground mt-1">Create a new department</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
          <CardDescription>Basic department details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Engineering" />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Department Code</Label>
              <Input id="code" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="e.g. DEPT-001" />
              <p className="text-xs text-muted-foreground">Leave blank to auto-generate</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="head">Department Head</Label>
              <Input id="head" value={form.head} onChange={(e) => set("head", e.target.value)} placeholder="e.g. John Smith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costCenter">Cost Center</Label>
              <Input id="costCenter" value={form.costCenter} onChange={(e) => set("costCenter", e.target.value)} placeholder="e.g. CC-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget Amount</Label>
              <Input id="budgetAmount" type="number" min={0} value={form.budgetAmount || ""} onChange={(e) => set("budgetAmount", parseFloat(e.target.value) || 0)} placeholder="0" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Department description..." rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/departments")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Department"}
        </Button>
      </div>
    </div>
  );
}
