"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { useExpenseStore } from "@/src/store/expense-store";
import {
  EXPENSE_CATEGORY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "@/src/types/expense";

export default function NewReimbursementPage() {
  const router = useRouter();
  const { addReimbursement, reports, fetchReports } = useExpenseStore();
  const [submitting, setSubmitting] = useState(false);

  const [expenseReportId, setExpenseReportId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("company_card");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const selectedReport = reports.find((r) => r.id === expenseReportId);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!expenseReportId) e.expenseReportId = "Expense report is required";
    if (!employeeId.trim()) e.employeeId = "Employee ID is required";
    if (!category) e.category = "Category is required";
    if (!amount || amount <= 0) e.amount = "Amount must be greater than 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addReimbursement({
      expenseReportId,
      employeeId,
      category,
      amount,
      description: description || null,
      paymentMethod,
    });
    setSubmitting(false);
    if (result) router.push("/expenses/reimbursements");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Expenses</span>
        <span>/</span>
        <button onClick={() => router.push("/expenses/reimbursements")} className="hover:text-foreground">Reimbursements</button>
        <span>/</span>
        <span className="text-foreground">New Reimbursement</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/expenses/reimbursements")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Reimbursement</h1>
          <p className="text-muted-foreground mt-1">Create a new reimbursement request</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reimbursement Details</CardTitle>
          <CardDescription>Fill in the details for the reimbursement request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Expense Report *</Label>
              <Select value={expenseReportId} onValueChange={(v) => setExpenseReportId(v)}>
                <SelectTrigger><SelectValue placeholder="Select expense report" /></SelectTrigger>
                <SelectContent>
                  {reports.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.expenseReportId && <p className="text-sm text-destructive">{errors.expenseReportId}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input id="employeeId" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} placeholder="e.g. EMP-001" />
              {errors.employeeId && <p className="text-sm text-destructive">{errors.employeeId}</p>}
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={category} onValueChange={(v) => setCategory(v)}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input id="amount" type="number" min={0} step={0.01} value={amount || ""} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} placeholder="0.00" />
              {errors.amount && <p className="text-sm text-destructive">{errors.amount}</p>}
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHOD_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedReport && (
              <div className="space-y-2">
                <Label>Report Employee</Label>
                <Input value={selectedReport.employeeName} disabled />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional notes for this reimbursement..." rows={3} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/expenses/reimbursements")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Reimbursement"}
        </Button>
      </div>
    </div>
  );
}
