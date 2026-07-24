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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useEmployeeStore } from "@/src/store/employee-store";
import { EMPLOYEE_ROLE_OPTIONS } from "@/src/types/employee";

export default function NewEmployeePage() {
  const router = useRouter();
  const { departments, fetchDepartments, addEmployee } = useEmployeeStore();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    employeeCode: "",
    email: "",
    phone: "",
    position: "",
    baseSalary: 0,
    departmentId: "",
    role: "EMPLOYEE",
    hireDate: "",
    bankName: "",
    bankAccount: "",
    bankCode: "",
    taxId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.departmentId) e.departmentId = "Department is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addEmployee({
      firstName: form.firstName,
      lastName: form.lastName,
      employeeCode: form.employeeCode || undefined,
      email: form.email,
      phone: form.phone || null,
      position: form.position || null,
      baseSalary: form.baseSalary,
      departmentId: form.departmentId,
      role: form.role,
      hireDate: form.hireDate || null,
      bankName: form.bankName || null,
      bankAccount: form.bankAccount || null,
      bankCode: form.bankCode || null,
      taxId: form.taxId || null,
    });
    setSubmitting(false);
    if (result) router.push("/employees");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Employees</span>
        <span>/</span>
        <span className="text-foreground">New Employee</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/employees")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Employee</h1>
          <p className="text-muted-foreground mt-1">Add a new employee to your organization</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic employee details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="John" />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Doe" />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeCode">Employee Code</Label>
              <Input id="employeeCode" value={form.employeeCode} onChange={(e) => set("employeeCode", e.target.value)} placeholder="e.g. EMP-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="john@company.com" />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input id="hireDate" type="date" value={form.hireDate} onChange={(e) => set("hireDate", e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
          <CardDescription>Position and department details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select value={form.departmentId} onValueChange={(v) => set("departmentId", v)}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input id="position" value={form.position} onChange={(e) => set("position", e.target.value)} placeholder="e.g. Senior Developer" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => set("role", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EMPLOYEE_ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Base Salary</Label>
              <Input id="baseSalary" type="number" min={0} value={form.baseSalary || ""} onChange={(e) => set("baseSalary", parseFloat(e.target.value) || 0)} placeholder="0" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bank & Tax Information</CardTitle>
          <CardDescription>Payment and tax details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name</Label>
              <Input id="bankName" value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="e.g. Chase Bank" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAccount">Bank Account</Label>
              <Input id="bankAccount" value={form.bankAccount} onChange={(e) => set("bankAccount", e.target.value)} placeholder="Account number" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankCode">Bank Code</Label>
              <Input id="bankCode" value={form.bankCode} onChange={(e) => set("bankCode", e.target.value)} placeholder="Routing code" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" value={form.taxId} onChange={(e) => set("taxId", e.target.value)} placeholder="Tax ID number" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/employees")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Employee"}
        </Button>
      </div>
    </div>
  );
}
