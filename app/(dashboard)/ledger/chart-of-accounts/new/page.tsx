"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useLedgerStore } from "@/src/store/ledger-store";
import type {
  AccountType,
  AccountCategory,
  NormalBalance,
} from "@/src/types/ledger";
import {
  ACCOUNT_TYPE_OPTIONS,
  ACCOUNT_CATEGORY_OPTIONS,
} from "@/src/types/ledger";

const departments = [
  "Finance",
  "Operations",
  "Sales",
  "Marketing",
  "Engineering",
  "HR",
  "IT",
];

export default function NewAccountPage() {
  const router = useRouter();
  const accounts = useLedgerStore((s) => s.accounts);
  const fetchAccounts = useLedgerStore((s) => s.fetchAccounts);
  const addAccount = useLedgerStore((s) => s.addAccount);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    accountCode: "",
    name: "",
    type: "asset" as AccountType,
    category: "current" as AccountCategory,
    parentAccountId: null as string | null,
    normalBalance: "debit" as NormalBalance,
    openingBalance: 0,
    description: "",
    department: "",
    taxRelated: false,
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
  }, [accounts.length, fetchAccounts]);

  const topAccounts = accounts.filter((a) => !a.parentAccountId);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.accountCode) errors.accountCode = "Account code is required";
    if (!formData.name) errors.name = "Account name is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await addAccount({
        accountCode: formData.accountCode,
        name: formData.name,
        type: formData.type.toUpperCase(),
        category: formData.category.toUpperCase(),
        parentAccountId: formData.parentAccountId || null,
        normalBalance: formData.normalBalance.toUpperCase(),
        openingBalance: formData.openingBalance,
        currentBalance: formData.openingBalance,
        closingBalance: formData.openingBalance,
        description: formData.description || null,
        department: formData.department || null,
        taxRelated: formData.taxRelated,
        notes: formData.notes || null,
      });
      if (result) {
        router.push("/ledger/chart-of-accounts");
        router.refresh();
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            New Account
          </h1>
          <p className="text-muted-foreground mt-1">
            Add a new account to the chart of accounts
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>
            Fill in the details below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Account Code *</Label>
              <Input
                value={formData.accountCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    accountCode: e.target.value,
                  }))
                }
                placeholder="e.g., 1000"
                className="mt-1.5 font-mono"
              />
              {formErrors.accountCode && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.accountCode}
                </p>
              )}
            </div>

            <div>
              <Label>Account Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Cash - Operating"
                className="mt-1.5"
              />
              {formErrors.name && (
                <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <Label>Account Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, type: v as AccountType }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: v as AccountCategory,
                  }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_CATEGORY_OPTIONS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Parent Account</Label>
              <Select
                value={formData.parentAccountId || ""}
                onValueChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    parentAccountId: v || null,
                  }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="None (Top Level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Top Level)</SelectItem>
                  {topAccounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.accountCode} - {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Normal Balance</Label>
              <Select
                value={formData.normalBalance}
                onValueChange={(v) =>
                  setFormData((prev) => ({
                    ...prev,
                    normalBalance: v as NormalBalance,
                  }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Opening Balance (₦)</Label>
              <Input
                type="number"
                value={formData.openingBalance || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    openingBalance: parseFloat(e.target.value) || 0,
                  }))
                }
                className="mt-1.5"
                placeholder="0"
              />
            </div>

            <div>
              <Label>Department</Label>
              <Select
                value={formData.department}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, department: v }))
                }
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Label>Tax Related</Label>
              <Switch
                checked={formData.taxRelated}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, taxRelated: checked }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              placeholder="Account description..."
            />
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              rows={3}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
