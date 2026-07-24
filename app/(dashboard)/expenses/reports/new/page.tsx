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
import { Switch } from "@/src/components/ui/switch";
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
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useExpenseStore } from "@/src/store/expense-store";
import {
  EXPENSE_CATEGORY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "@/src/types/expense";

interface LineItem {
  category: string;
  description: string;
  amount: number;
  expenseDate: string;
  paymentMethod: string;
  isReimbursable: boolean;
  merchant: string;
}

const emptyItem: LineItem = {
  category: "",
  description: "",
  amount: 0,
  expenseDate: new Date().toISOString().split("T")[0],
  paymentMethod: "company_card",
  isReimbursable: true,
  merchant: "",
};

export default function NewExpenseReportPage() {
  const router = useRouter();
  const { addReport } = useExpenseStore();
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ ...emptyItem }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalAmount = items.reduce((s, i) => s + (i.amount || 0), 0);

  const setItem = (index: number, field: keyof LineItem, value: unknown) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addItem = () => setItems((prev) => [...prev, { ...emptyItem }]);
  const removeItem = (index: number) => setItems((prev) => prev.filter((_, i) => i !== index));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (items.length === 0) e.items = "At least one line item is required";
    items.forEach((item, i) => {
      if (!item.category) e[`item_${i}_category`] = "Category is required";
      if (!item.description.trim()) e[`item_${i}_description`] = "Description is required";
      if (!item.amount || item.amount <= 0) e[`item_${i}_amount`] = "Amount must be greater than 0";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    const result = await addReport({
      title,
      description: description || null,
      department: department || null,
      totalAmount,
      items: items.map((item) => ({
        category: item.category,
        description: item.description,
        amount: item.amount,
        expenseDate: item.expenseDate,
        paymentMethod: item.paymentMethod,
        isReimbursable: item.isReimbursable,
        merchant: item.merchant || null,
      })),
    });
    setSubmitting(false);
    if (result) router.push("/expenses/reports");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Expenses</span>
        <span>/</span>
        <button onClick={() => router.push("/expenses/reports")} className="hover:text-foreground">Expense Reports</button>
        <span>/</span>
        <span className="text-foreground">New Report</span>
      </nav>

      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.push("/expenses/reports")} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Expense Report</h1>
          <p className="text-muted-foreground mt-1">Create a new expense report with line items</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Details</CardTitle>
          <CardDescription>Basic information about the expense report</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Q1 Client Meeting Expenses" />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="e.g. Sales" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the expenses..." rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Add individual expense items to this report</CardDescription>
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
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORY_OPTIONS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors[`item_${index}_category`] && <p className="text-sm text-destructive">{errors[`item_${index}_category`]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`desc_${index}`}>Description *</Label>
                  <Input id={`desc_${index}`} value={item.description} onChange={(e) => setItem(index, "description", e.target.value)} placeholder="Item description" />
                  {errors[`item_${index}_description`] && <p className="text-sm text-destructive">{errors[`item_${index}_description`]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`amount_${index}`}>Amount *</Label>
                  <Input id={`amount_${index}`} type="number" min={0} step={0.01} value={item.amount || ""} onChange={(e) => setItem(index, "amount", parseFloat(e.target.value) || 0)} placeholder="0.00" />
                  {errors[`item_${index}_amount`] && <p className="text-sm text-destructive">{errors[`item_${index}_amount`]}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`date_${index}`}>Expense Date</Label>
                  <Input id={`date_${index}`} type="date" value={item.expenseDate} onChange={(e) => setItem(index, "expenseDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={item.paymentMethod} onValueChange={(v) => setItem(index, "paymentMethod", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {PAYMENT_METHOD_OPTIONS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`merchant_${index}`}>Merchant</Label>
                  <Input id={`merchant_${index}`} value={item.merchant} onChange={(e) => setItem(index, "merchant", e.target.value)} placeholder="Merchant name" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={item.isReimbursable} onCheckedChange={(v) => setItem(index, "isReimbursable", v)} />
                <Label className="text-sm">Reimbursable</Label>
              </div>
            </div>
          ))}
          {errors.items && <p className="text-sm text-destructive">{errors.items}</p>}

          <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(totalAmount)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/expenses/reports")} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
          <Save className="h-4 w-4" />
          {submitting ? "Creating..." : "Create Report"}
        </Button>
      </div>
    </div>
  );
}
