"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { ArrowLeft, Save, Plus, Trash2, AlertCircle } from "lucide-react";
import { useBudgetStore } from "@/src/store/budget-store";
import { BUDGET_STATUS_OPTIONS, type BudgetStatusType } from "@/src/types/budget";

interface LineItem {
  id?: string;
  category: string;
  description: string;
  allocated: number;
  spent: number;
}

const BUDGET_CATEGORIES = [
  "Salaries", "Equipment", "Software", "Training", "Travel", "Advertising",
  "Events", "Content", "PR", "Entertainment", "Tools", "Recruitment",
  "Benefits", "Consulting", "Infrastructure", "Security", "Support",
  "Utilities", "Rent", "Insurance", "Other",
];

const emptyItem: LineItem = { category: "", description: "", allocated: 0, spent: 0 };

export default function EditBudgetPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { budgets, loading, fetchBudgets, getBudgetById, updateBudget } = useBudgetStore();
  const [submitting, setSubmitting] = useState(false);

  const [fiscalYear, setFiscalYear] = useState(0);
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState<BudgetStatusType>("ACTIVE");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!budgets.length) fetchBudgets();
  }, [budgets.length, fetchBudgets]);

  useEffect(() => {
    const budget = getBudgetById(id);
    if (budget) {
      setFiscalYear(budget.fiscalYear);
      setDepartmentId(budget.departmentId ?? "");
      setStatus(budget.status);
      setItems(budget.lineItems.map((li) => ({
        id: li.id,
        category: li.category,
        description: li.description ?? "",
        allocated: li.allocated,
        spent: li.spent,
      })));
    }
  }, [budgets, id, getBudgetById]);

  const budget = getBudgetById(id);

  const totalAmount = items.reduce((s, i) => s + (i.allocated || 0), 0);

  const setItem = (index: number, field: keyof LineItem, value: unknown) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fiscalYear) e.fiscalYear = "Fiscal year is required";
    if (items.length === 0) e.items = "At least one line item is required";
    items.forEach((item, i) => {
      if (!item.category) e[`item_${i}_category`] = "Category is required";
      if (!item.allocated || item.allocated <= 0) e[`item_${i}_allocated`] = "Amount must be greater than 0";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await updateBudget(id, {
      fiscalYear,
      totalAmount,
      status,
      departmentId: departmentId || null,
      notes: notes || null,
      lineItems: items.map((item) => ({
        ...(item.id ? { id: item.id } : {}),
        category: item.category,
        description: item.description || null,
        allocated: item.allocated,
        spent: item.spent,
      })),
    });
    setSubmitting(false);
    if (result) router.push(`/budgets/${id}`);
  };

  if (loading && !budget) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Button variant="ghost" onClick={() => router.push("/budgets")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center gap-3 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-lg font-medium">Budget not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Budgets</span>
        <span>/</span>
        <button onClick={() => router.push("/budgets")} className="hover:text-foreground">Budgets</button>
        <span>/</span>
        <span className="text-foreground">Edit</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push(`/budgets/${id}`)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Edit Budget</h1>
          <p className="text-muted-foreground mt-1">Update budget allocations</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Details</CardTitle>
          <CardDescription>Basic information about the budget</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscalYear">Fiscal Year *</Label>
              <Input id="fiscalYear" type="number" min={2020} max={2030} value={fiscalYear || ""} onChange={(e) => setFiscalYear(parseInt(e.target.value) || 0)} />
              {errors.fiscalYear && <p className="text-sm text-destructive">{errors.fiscalYear}</p>}
            </div>
            <div className="space-y-2">
              <Label>Department ID (optional)</Label>
              <Input value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} placeholder="Department ID" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as BudgetStatusType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BUDGET_STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Budget notes..." rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Update budget allocation items</CardDescription>
            </div>
            <Button variant="outline" onClick={addItem} className="gap-2">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Item {index + 1}</h3>
                {items.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeItem(index)} className="text-destructive gap-1">
                    <Trash2 className="h-3 w-3" /> Remove
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={item.category} onValueChange={(v) => setItem(index, "category", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {BUDGET_CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`item_${index}_category`] && <p className="text-sm text-destructive">{errors[`item_${index}_category`]}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={item.description} onChange={(e) => setItem(index, "description", e.target.value)} placeholder="Description" />
                </div>
                <div className="space-y-2">
                  <Label>Allocated Amount *</Label>
                  <Input type="number" min={0} value={item.allocated || ""} onChange={(e) => setItem(index, "allocated", parseFloat(e.target.value) || 0)} placeholder="0" />
                  {errors[`item_${index}_allocated`] && <p className="text-sm text-destructive">{errors[`item_${index}_allocated`]}</p>}
                </div>
              </div>
            </div>
          ))}
          {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}

          <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Allocated</p>
              <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push(`/budgets/${id}`)} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
