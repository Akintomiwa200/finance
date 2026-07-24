"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, CheckCircle, XCircle, Clock, Search, Download, RefreshCw, DollarSign, AlertCircle, Wallet, TrendingDown, Printer, Calculator, Scale, Send, FileText, Banknote, Receipt } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePettyCashStore } from "@/src/store/petty-cash-store";

type VarianceType = "over" | "short" | "exact";
type TransactionStatus = "verified" | "unverified" | "disputed";

interface ReconciliationTransaction { id: string; date: string; description: string; voucherNumber: string; category: string; amount: number; status: TransactionStatus; notes?: string; }
interface Adjustment { id: number; description: string; amount: number; type: "addition" | "deduction"; reason: string; }

const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";

const statusStyles: Record<string, string> = { draft: "bg-gray-100 text-gray-700", in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700", approved: "bg-purple-100 text-purple-700" };

export default function PettyCashReconciliation() {
  const router = useRouter();
  const { requests, loading, fetchRequests } = usePettyCashStore();

  const [reconciliationStatus, setReconciliationStatus] = useState<"in_progress" | "completed" | "approved">("in_progress");
  const [physicalCount, setPhysicalCount] = useState(0);
  const [notes, setNotes] = useState("");
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"reconciliation" | "transactions" | "history">("reconciliation");
  const [adjustmentForm, setAdjustmentForm] = useState({ description: "", amount: 0, type: "addition" as "addition" | "deduction", reason: "" });
  const [adjustmentErrors, setAdjustmentErrors] = useState<Record<string, string>>({});

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const transactions: ReconciliationTransaction[] = useMemo(() => {
    let idx = 1;
    return requests.filter((r) => r.status === "disbursed" || r.status === "approved").map((r) => ({
      id: r.id, date: r.requestDate, description: r.title || r.description || "",
      voucherNumber: `V-${String(idx++).padStart(3, "0")}`, category: r.category || "Other",
      amount: r.amount, status: "verified" as TransactionStatus,
    }));
  }, [requests]);

  const startingBalance = 250000;
  const totalDisbursements = useMemo(() => transactions.reduce((s, t) => s + t.amount, 0), [transactions]);
  const verifiedTotal = useMemo(() => transactions.filter((t) => t.status === "verified").reduce((s, t) => s + t.amount, 0), [transactions]);
  const unverifiedTotal = useMemo(() => transactions.filter((t) => t.status === "unverified").reduce((s, t) => s + t.amount, 0), [transactions]);
  const totalAdjustments = useMemo(() => adjustments.reduce((s, a) => s + (a.type === "addition" ? a.amount : -a.amount), 0), [adjustments]);
  const calculatedBalance = useMemo(() => startingBalance - totalDisbursements + totalAdjustments, [startingBalance, totalDisbursements, totalAdjustments]);
  const variance = useMemo(() => physicalCount - calculatedBalance, [physicalCount, calculatedBalance]);
  const varianceType: VarianceType = variance > 0 ? "over" : variance < 0 ? "short" : "exact";

  useEffect(() => { if (transactions.length > 0 && physicalCount === 0) setPhysicalCount(calculatedBalance); }, [transactions, calculatedBalance, physicalCount]);

  const handleAddAdjustment = () => {
    if (!adjustmentForm.description || adjustmentForm.amount <= 0) { setAdjustmentErrors({ description: !adjustmentForm.description ? "Description is required" : "", amount: adjustmentForm.amount <= 0 ? "Valid amount is required" : "" }); return; }
    setAdjustments((prev) => [...prev, { id: Date.now(), ...adjustmentForm }]);
    setAdjustmentForm({ description: "", amount: 0, type: "addition", reason: "" });
    setIsAdjustmentModalOpen(false);
  };

  const handleRemoveAdjustment = (id: number) => setAdjustments((prev) => prev.filter((a) => a.id !== id));

  const handleComplete = () => { setReconciliationStatus("completed"); setIsCompleteDialogOpen(false); };
  const handleApprove = () => { setReconciliationStatus("approved"); setIsApproveDialogOpen(false); };

  const handleExport = () => {
    const headers = ["Voucher #", "Date", "Description", "Category", "Amount", "Status"];
    const csvData = transactions.map((t) => [t.voucherNumber, fmtDate(t.date), t.description, t.category, t.amount.toString(), t.status]);
    const csv = [headers, ...csvData].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `reconciliation-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 print:hidden"><ArrowLeft className="h-4 w-4" />Back</Button>
          <div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Scale className="h-6 w-6" />Petty Cash Reconciliation</h1><p className="text-muted-foreground mt-1">Reconcile petty cash records with physical count</p></div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" />Print</Button>
          {reconciliationStatus === "in_progress" && <Button onClick={() => setIsCompleteDialogOpen(true)} className="gap-2"><CheckCircle className="h-4 w-4" />Complete</Button>}
          {reconciliationStatus === "completed" && <Button onClick={() => setIsApproveDialogOpen(true)} className="gap-2 bg-purple-600 hover:bg-purple-700"><Send className="h-4 w-4" />Approve</Button>}
        </div>
      </div>

      <Card className={`border-l-4 ${reconciliationStatus === "approved" ? "border-l-green-500" : reconciliationStatus === "completed" ? "border-l-blue-500" : "border-l-yellow-500"}`}>
        <CardContent className="p-4"><div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className={(statusStyles[reconciliationStatus] || "") + " flex items-center gap-1 w-fit"}>
              {reconciliationStatus === "in_progress" && <Clock className="h-3 w-3" />}
              {reconciliationStatus === "completed" && <CheckCircle className="h-3 w-3" />}
              {reconciliationStatus === "approved" && <CheckCircle className="h-3 w-3" />}
              {reconciliationStatus === "in_progress" ? "In Progress" : reconciliationStatus.charAt(0).toUpperCase() + reconciliationStatus.slice(1)}
            </Badge>
          </div>
          {varianceType !== "exact" && reconciliationStatus === "in_progress" && <div className={`flex items-center gap-2 text-sm ${varianceType === "short" ? "text-red-600" : "text-orange-600"}`}><AlertCircle className="h-4 w-4" /><span>{varianceType === "short" ? "Shortage" : "Overage"} of {fmt(Math.abs(variance))} detected</span></div>}
        </div></CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Starting Balance</p><p className="text-2xl font-bold">{fmt(startingBalance)}</p></div><div className="p-3 bg-blue-50 rounded-xl"><Wallet className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Disbursements</p><p className="text-2xl font-bold text-red-600">{fmt(totalDisbursements)}</p></div><div className="p-3 bg-red-50 rounded-xl"><TrendingDown className="h-5 w-5 text-red-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Expected Balance</p><p className="text-2xl font-bold">{fmt(calculatedBalance)}</p></div><div className="p-3 bg-purple-50 rounded-xl"><Calculator className="h-5 w-5 text-purple-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Physical Count</p><Input type="number" value={physicalCount} onChange={(e) => setPhysicalCount(parseFloat(e.target.value) || 0)} className="text-2xl font-bold w-32 text-right" disabled={reconciliationStatus !== "in_progress"} /></div><div className="p-3 bg-green-50 rounded-xl"><Banknote className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
      </div>

      {variance !== 0 && reconciliationStatus === "in_progress" && (
        <Card className={`${varianceType === "short" ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
          <CardContent className="p-4"><div className="flex items-center gap-3">
            <AlertCircle className={`h-5 w-5 ${varianceType === "short" ? "text-red-600" : "text-orange-600"}`} />
            <div><p className={`font-semibold ${varianceType === "short" ? "text-red-600" : "text-orange-600"}`}>{varianceType === "short" ? "Cash Shortage Detected" : "Cash Overage Detected"}</p><p className="text-sm">Physical count shows {varianceType === "short" ? "less" : "more"} cash than expected by {fmt(Math.abs(variance))}.</p></div>
          </div></CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 print:hidden"><TabsTrigger value="reconciliation">Reconciliation Summary</TabsTrigger><TabsTrigger value="transactions">Transactions</TabsTrigger><TabsTrigger value="history">Adjustments & History</TabsTrigger></TabsList>

        <TabsContent value="reconciliation" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="text-lg">Reconciliation Calculation</CardTitle><CardDescription>Breakdown of expected vs actual balance</CardDescription></CardHeader><CardContent><div className="space-y-3">
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Starting Balance</span><span className="font-medium">{fmt(startingBalance)}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Total Disbursements</span><span className="font-medium text-red-600">- {fmt(totalDisbursements)}</span></div>
              {adjustments.map((adj) => <div key={adj.id} className="flex justify-between py-2 border-b pl-4"><span className="text-sm text-muted-foreground">{adj.description}</span><span className={`font-medium ${adj.type === "addition" ? "text-green-600" : "text-red-600"}`}>{adj.type === "addition" ? "+" : "-"} {fmt(adj.amount)}</span></div>)}
              <div className="flex justify-between py-2 border-b font-semibold"><span>Expected Balance</span><span>{fmt(calculatedBalance)}</span></div>
              <div className="flex justify-between py-2 border-b"><span className="text-muted-foreground">Physical Cash Count</span><span className="font-medium">{fmt(physicalCount)}</span></div>
              <div className={`flex justify-between py-2 ${varianceType !== "exact" ? "bg-muted p-3 rounded-lg -mx-3" : ""}`}><span className="font-semibold">Variance</span><span className={`font-bold ${varianceType === "short" ? "text-red-600" : varianceType === "over" ? "text-orange-600" : "text-green-600"}`}>{varianceType === "short" ? "-" : varianceType === "over" ? "+" : ""}{fmt(Math.abs(variance))}{varianceType !== "exact" && ` (${varianceType === "short" ? "Shortage" : "Overage"})`}</span></div>
            </div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Transaction Summary</CardTitle></CardHeader><CardContent><div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg"><div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /><span>Verified Transactions</span></div><div className="text-right"><p className="font-bold text-green-600">{fmt(verifiedTotal)}</p><p className="text-xs text-muted-foreground">{transactions.filter((t) => t.status === "verified").length} transactions</p></div></div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg"><div className="flex items-center gap-2"><AlertCircle className="h-4 w-4 text-yellow-600" /><span>Unverified Transactions</span></div><div className="text-right"><p className="font-bold text-yellow-600">{fmt(unverifiedTotal)}</p><p className="text-xs text-muted-foreground">{transactions.filter((t) => t.status === "unverified").length} transactions</p></div></div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg"><div className="flex items-center gap-2"><Calculator className="h-4 w-4 text-blue-600" /><span>Adjustments</span></div><div className="text-right"><p className={`font-bold ${totalAdjustments > 0 ? "text-green-600" : totalAdjustments < 0 ? "text-red-600" : ""}`}>{totalAdjustments > 0 ? "+" : ""}{fmt(totalAdjustments)}</p><p className="text-xs text-muted-foreground">{adjustments.length} adjustments</p></div></div>
            </div></CardContent></Card>
            <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-lg">Reconciliation Notes</CardTitle></CardHeader><CardContent><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about the reconciliation process..." rows={4} disabled={reconciliationStatus !== "in_progress"} className="resize-none" /></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 mt-4">
          <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Petty Cash Transactions</CardTitle><CardDescription>Review and verify each transaction</CardDescription></div>{reconciliationStatus === "in_progress" && <Button variant="outline" size="sm" onClick={() => setIsAdjustmentModalOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Adjustment</Button>}</div></CardHeader><CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Voucher #</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={6} className="text-center py-12">Loading...</TableCell></TableRow> :
                  transactions.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-12"><Receipt className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No transactions to reconcile</p></TableCell></TableRow> :
                  transactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">{t.voucherNumber}</TableCell>
                      <TableCell>{fmtDate(t.date)}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(t.amount)}</TableCell>
                      <TableCell><Badge className={t.status === "verified" ? "bg-green-100 text-green-700" : t.status === "unverified" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}>{t.status === "verified" && <CheckCircle className="h-3 w-3 mr-1" />}{t.status === "unverified" && <AlertCircle className="h-3 w-3 mr-1" />}{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="text-lg">Adjustments</CardTitle><CardDescription>Manual adjustments made during reconciliation</CardDescription></CardHeader><CardContent>
              {adjustments.length > 0 ? <div className="space-y-3">{adjustments.map((adj) => (
                <div key={adj.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div><p className="font-medium">{adj.description}</p><p className="text-sm text-muted-foreground">{adj.reason}</p></div>
                  <div className="text-right"><p className={`font-bold ${adj.type === "addition" ? "text-green-600" : "text-red-600"}`}>{adj.type === "addition" ? "+" : "-"} {fmt(adj.amount)}</p>
                    {reconciliationStatus === "in_progress" && <Button variant="ghost" size="sm" onClick={() => handleRemoveAdjustment(adj.id)} className="text-red-600"><Trash2 className="h-3 w-3" /></Button>}
                  </div>
                </div>
              ))}</div> : <div className="text-center py-8 text-muted-foreground"><Calculator className="h-12 w-12 mx-auto mb-2 text-muted-foreground/30" /><p>No adjustments recorded</p></div>}
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Audit Trail</CardTitle></CardHeader><CardContent><div className="space-y-4">
              <div className="flex items-start gap-3"><div className="p-2 bg-blue-100 rounded-lg"><FileText className="h-4 w-4 text-blue-600" /></div><div><p className="font-medium">Reconciliation Started</p><p className="text-sm text-muted-foreground">Today</p></div></div>
              {reconciliationStatus === "completed" && <div className="flex items-start gap-3"><div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="h-4 w-4 text-green-600" /></div><div><p className="font-medium">Reconciliation Completed</p><p className="text-sm text-muted-foreground">Current User</p></div></div>}
              {reconciliationStatus === "approved" && <div className="flex items-start gap-3"><div className="p-2 bg-purple-100 rounded-lg"><Send className="h-4 w-4 text-purple-600" /></div><div><p className="font-medium">Reconciliation Approved</p><p className="text-sm text-muted-foreground">Approver</p></div></div>}
            </div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Adjustment Modal */}
      <Dialog open={isAdjustmentModalOpen} onOpenChange={setIsAdjustmentModalOpen}>
        <DialogContent className="max-w-md"><DialogHeader><DialogTitle>Add Adjustment</DialogTitle><DialogDescription>Record a manual adjustment to balance the petty cash</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label>Adjustment Type</Label><Select value={adjustmentForm.type} onValueChange={(v: any) => setAdjustmentForm((prev) => ({ ...prev, type: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="addition">Addition (Cash Overage)</SelectItem><SelectItem value="deduction">Deduction (Cash Shortage)</SelectItem></SelectContent></Select></div>
            <div><Label>Description *</Label><Input value={adjustmentForm.description} onChange={(e) => setAdjustmentForm((prev) => ({ ...prev, description: e.target.value }))} className="mt-1" placeholder="e.g., Unrecorded cash receipt" />{adjustmentErrors.description && <p className="text-sm text-red-500 mt-1">{adjustmentErrors.description}</p>}</div>
            <div><Label>Amount (₦) *</Label><Input type="number" value={adjustmentForm.amount || ""} onChange={(e) => setAdjustmentForm((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} className="mt-1" placeholder="0" />{adjustmentErrors.amount && <p className="text-sm text-red-500 mt-1">{adjustmentErrors.amount}</p>}</div>
            <div><Label>Reason *</Label><Textarea value={adjustmentForm.reason} onChange={(e) => setAdjustmentForm((prev) => ({ ...prev, reason: e.target.value }))} className="mt-1" rows={3} placeholder="Explain why this adjustment is needed..." /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setIsAdjustmentModalOpen(false)}>Cancel</Button><Button onClick={handleAddAdjustment}>Add Adjustment</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Complete Reconciliation</AlertDialogTitle><AlertDialogDescription>Are you sure you want to complete this reconciliation?
          {variance !== 0 && <div className="mt-3 p-3 bg-yellow-50 rounded-lg text-yellow-800"><AlertCircle className="h-4 w-4 inline mr-2" />There is still a {varianceType === "short" ? "shortage" : "overage"} of {fmt(Math.abs(variance))}.</div>}
        </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleComplete} disabled={variance !== 0}>Complete Reconciliation</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>

      {/* Approve Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Approve Reconciliation</AlertDialogTitle><AlertDialogDescription>Confirm that you have reviewed and approve this reconciliation.
          <div className="mt-3 p-3 bg-muted rounded-lg"><p className="text-sm">Final Balance: {fmt(physicalCount)}</p><p className="text-sm">Variance: {fmt(Math.abs(variance))} ({varianceType === "short" ? "Shortage" : varianceType === "over" ? "Overage" : "Exact"})</p></div>
        </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleApprove}>Approve Reconciliation</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
