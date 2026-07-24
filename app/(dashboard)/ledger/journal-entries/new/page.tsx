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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Edit,
  Trash2,
  PlusCircle,
  MinusCircle,
  AlertCircle,
} from "lucide-react";
import { useLedgerStore } from "@/src/store/ledger-store";
import type { JournalLine } from "@/src/types/ledger";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function NewJournalEntryPage() {
  const router = useRouter();
  const accounts = useLedgerStore((s) => s.accounts);
  const fetchAccounts = useLedgerStore((s) => s.fetchAccounts);
  const fetchJournalEntries = useLedgerStore((s) => s.fetchJournalEntries);
  const addJournalEntry = useLedgerStore((s) => s.addJournalEntry);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "general",
    description: "",
    reference: "",
    notes: "",
  });

  const [lines, setLines] = useState<Omit<JournalLine, "id">[]>([]);
  const [lineErrors, setLineErrors] = useState<string | null>(null);

  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [editingLineIndex, setEditingLineIndex] = useState<number | null>(null);
  const [lineForm, setLineForm] = useState({
    accountId: "",
    description: "",
    debit: 0,
    credit: 0,
  });

  useEffect(() => {
    if (accounts.length === 0) fetchAccounts();
  }, [accounts.length, fetchAccounts]);

  const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const openAddLine = () => {
    setEditingLineIndex(null);
    setLineForm({ accountId: "", description: "", debit: 0, credit: 0 });
    setIsLineModalOpen(true);
  };

  const openEditLine = (index: number) => {
    setEditingLineIndex(index);
    const line = lines[index];
    setLineForm({
      accountId: line.accountId,
      description: line.description || "",
      debit: line.debit,
      credit: line.credit,
    });
    setIsLineModalOpen(true);
  };

  const handleSaveLine = () => {
    if (!lineForm.accountId) return;
    const account = accounts.find((a) => a.id === lineForm.accountId);
    if (!account) return;

    const newLine: Omit<JournalLine, "id"> = {
      accountId: lineForm.accountId,
      accountCode: account.accountCode,
      accountName: account.name,
      description: lineForm.description,
      debit: lineForm.debit || 0,
      credit: lineForm.credit || 0,
    };

    if (editingLineIndex !== null) {
      setLines((prev) => prev.map((l, i) => (i === editingLineIndex ? newLine : l)));
    } else {
      setLines((prev) => [...prev, newLine]);
    }
    setIsLineModalOpen(false);
  };

  const handleRemoveLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.description) {
      setError("Description is required");
      return;
    }
    if (lines.length === 0) {
      setLineErrors("At least one journal line is required");
      return;
    }
    if (!isBalanced) {
      setLineErrors("Debits must equal credits");
      return;
    }

    setSubmitting(true);
    setError(null);
    setLineErrors(null);

    try {
      const result = await addJournalEntry({
        date: formData.date,
        type: formData.type.toUpperCase(),
        status: "DRAFT",
        description: formData.description,
        reference: formData.reference || null,
        totalDebit,
        totalCredit,
        lines: lines.map((l) => ({
          accountId: l.accountId,
          description: l.description || null,
          debit: l.debit || 0,
          credit: l.credit || 0,
        })),
      });
      if (result) {
        await fetchJournalEntries();
        router.push("/ledger/journal-entries");
        router.refresh();
      } else {
        setError("Failed to create journal entry");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">New Journal Entry</h1>
          <p className="text-muted-foreground mt-1">Create a new journal entry</p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Entry Details</CardTitle>
          <CardDescription>Fill in the journal entry header information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData((prev) => ({ ...prev, type: v }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="adjusting">Adjusting</SelectItem>
                  <SelectItem value="closing">Closing</SelectItem>
                  <SelectItem value="reversing">Reversing</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reference</Label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))}
                placeholder="e.g., Invoice #1234"
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label>Description *</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Journal entry description"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={2}
              placeholder="Additional notes..."
              className="mt-1.5"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Journal Lines</CardTitle>
            <CardDescription>Add debit and credit lines</CardDescription>
          </div>
          <Button size="sm" onClick={openAddLine} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Line
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {lineErrors && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {lineErrors}
            </div>
          )}

          {lines.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MinusCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
              <p>No lines added yet. Click &quot;Add Line&quot; to start.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span className="font-mono text-xs">{line.accountCode}</span>
                          <span className="ml-2 text-sm">{line.accountName}</span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{line.description}</TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEditLine(index)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveLine(index)}>
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-8 pt-2 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Debit: </span>
                  <span className="font-bold text-blue-600">{formatCurrency(totalDebit)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Total Credit: </span>
                  <span className="font-bold text-green-600">{formatCurrency(totalCredit)}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Difference: </span>
                  <span className={`font-bold ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(Math.abs(totalDebit - totalCredit))}
                  </span>
                  {!isBalanced && <span className="ml-1 text-red-500 text-xs">(Unbalanced)</span>}
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => router.back()} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || !isBalanced || lines.length === 0} className="gap-2">
              {submitting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
              ) : (
                <><Save className="h-4 w-4" /> Create Entry</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isLineModalOpen} onOpenChange={setIsLineModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLineIndex !== null ? "Edit Line" : "Add Line"}</DialogTitle>
            <DialogDescription>Select an account and enter debit or credit amount</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>Account *</Label>
              <Select value={lineForm.accountId} onValueChange={(v) => setLineForm((prev) => ({ ...prev, accountId: v }))}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.accountCode} - {a.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={lineForm.description}
                onChange={(e) => setLineForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Line description"
                className="mt-1.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Debit (₦)</Label>
                <Input
                  type="number"
                  value={lineForm.debit || ""}
                  onChange={(e) => setLineForm((prev) => ({ ...prev, debit: parseFloat(e.target.value) || 0, credit: 0 }))}
                  className="mt-1.5"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div>
                <Label>Credit (₦)</Label>
                <Input
                  type="number"
                  value={lineForm.credit || ""}
                  onChange={(e) => setLineForm((prev) => ({ ...prev, credit: parseFloat(e.target.value) || 0, debit: 0 }))}
                  className="mt-1.5"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLineModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLine} disabled={!lineForm.accountId}>
              {editingLineIndex !== null ? "Update Line" : "Add Line"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
