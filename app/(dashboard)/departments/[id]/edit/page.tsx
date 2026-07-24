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
import { Textarea } from "@/src/components/ui/textarea";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import { useEmployeeStore } from "@/src/store/employee-store";

export default function EditDepartmentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { departments, loading, fetchDepartments, getDepartmentById, updateDepartment } = useEmployeeStore();
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!departments.length) fetchDepartments();
  }, [departments.length, fetchDepartments]);

  const department = getDepartmentById(id);

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    costCenter: "",
    budgetAmount: 0,
    head: "",
  });

  useEffect(() => {
    if (department && !initialized) {
      setForm({
        name: department.name,
        code: department.code,
        description: department.description ?? "",
        costCenter: department.costCenter ?? "",
        budgetAmount: department.budgetAmount,
        head: department.head ?? "",
      });
      setInitialized(true);
    }
  }, [department, initialized]);

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
    const result = await updateDepartment(id, {
      name: form.name,
      description: form.description || null,
      costCenter: form.costCenter || null,
      budgetAmount: form.budgetAmount,
      head: form.head || null,
    });
    setSubmitting(false);
    if (result) router.push(`/departments/${id}`);
  };

  if (loading && !department) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/departments")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Departments
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Department not found</p>
              <p className="text-muted-foreground">The department you are trying to edit does not exist.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Departments</span>
        <span>/</span>
        <button onClick={() => router.push("/departments")} className="hover:text-foreground">Departments</button>
        <span>/</span>
        <button onClick={() => router.push(`/departments/${id}`)} className="hover:text-foreground">{department.name}</button>
        <span>/</span>
        <span className="text-foreground">Edit</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/departments/${id}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Department</h1>
          <p className="text-muted-foreground mt-1">Update {department.name}</p>
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
              <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Department Code</Label>
              <Input id="code" value={form.code} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Code cannot be changed</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="head">Department Head</Label>
              <Input id="head" value={form.head} onChange={(e) => set("head", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costCenter">Cost Center</Label>
              <Input id="costCenter" value={form.costCenter} onChange={(e) => set("costCenter", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budgetAmount">Budget Amount</Label>
              <Input id="budgetAmount" type="number" min={0} value={form.budgetAmount || ""} onChange={(e) => set("budgetAmount", parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push(`/departments/${id}`)} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
