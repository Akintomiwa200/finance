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
import { ArrowLeft, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, DollarSign, Calendar, Building2, Receipt, FileText, AlertCircle, Wallet, TrendingUp, Printer, Send, Banknote } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePettyCashStore } from "@/src/store/petty-cash-store";
import type { PettyCashReimbursement } from "@/src/types/petty-cash";

const departments = ["Marketing", "Operations", "IT", "HR", "Sales", "Finance", "Engineering"];
const statusOptions = ["all", "pending", "approved", "rejected", "paid"];
const paymentMethods = ["cash", "bank_transfer", "cheque"];

const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";
const fmtDateTime = (d: string) => new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const statusStyles: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-blue-100 text-blue-700", rejected: "bg-red-100 text-red-700", paid: "bg-green-100 text-green-700", cancelled: "bg-gray-100 text-gray-700" };

export default function ReimbursementsPage() {
  const router = useRouter();
  const { reimbursements, loading, fetchReimbursements, addReimbursement, updateReimbursement, deleteReimbursement } = usePettyCashStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedReimbursement, setSelectedReimbursement] = useState<PettyCashReimbursement | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"reimbursements" | "analytics">("reimbursements");

  const [formData, setFormData] = useState({
    employeeName: "", employeeEmail: "", departmentName: "",
    amount: 0, description: "", category: "",
    paymentMethod: "bank_transfer" as "cash" | "bank_transfer" | "cheque",
    bankName: "", accountNumber: "", accountName: "", notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { fetchReimbursements(); }, [fetchReimbursements]);

  const stats = useMemo(() => {
    const totalRequested = reimbursements.reduce((sum, r) => sum + r.amount, 0);
    const totalApproved = reimbursements.filter((r) => r.status === "approved").reduce((sum, r) => sum + r.amount, 0);
    const totalPaid = reimbursements.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0);
    const totalRejected = reimbursements.filter((r) => r.status === "rejected").reduce((sum, r) => sum + r.amount, 0);
    return { totalRequested, totalApproved, totalPaid, totalRejected, pendingCount: reimbursements.filter((r) => r.status === "pending").length, totalRequests: reimbursements.length };
  }, [reimbursements]);

  const filteredReimbursements = useMemo(() => {
    let result = [...reimbursements];
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter((r) => r.employeeName?.toLowerCase().includes(q) || r.employeeEmail?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q)); }
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter);
    if (departmentFilter !== "all") result = result.filter((r) => r.departmentName === departmentFilter);
    return result;
  }, [reimbursements, searchQuery, statusFilter, departmentFilter]);

  const totalPages = Math.ceil(filteredReimbursements.length / itemsPerPage);
  const paginatedReimbursements = filteredReimbursements.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetForm = () => { setFormData({ employeeName: "", employeeEmail: "", departmentName: "", amount: 0, description: "", category: "", paymentMethod: "bank_transfer", bankName: "", accountNumber: "", accountName: "", notes: "" }); setFormErrors({}); };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.employeeName) errors.employeeName = "Employee name is required";
    if (formData.amount <= 0) errors.amount = "Amount must be greater than 0";
    if (!formData.description) errors.description = "Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateReimbursement = async () => {
    if (!validateForm()) return;
    const result = await addReimbursement({
      employeeName: formData.employeeName, employeeEmail: formData.employeeEmail, departmentName: formData.departmentName,
      amount: formData.amount, description: formData.description, category: formData.category,
      status: "pending", submittedAt: new Date().toISOString(),
    });
    if (result) { resetForm(); setIsCreateModalOpen(false); fetchReimbursements(); }
  };

  const handleDeleteReimbursement = async () => { if (!selectedReimbursement) return; await deleteReimbursement(selectedReimbursement.id); setIsDeleteDialogOpen(false); setSelectedReimbursement(null); fetchReimbursements(); };

  const handleExport = () => {
    const headers = ["Employee", "Department", "Amount", "Status", "Description", "Submitted"];
    const csvData = filteredReimbursements.map((r) => [r.employeeName || "", r.departmentName || "", r.amount.toString(), r.status, r.description || "", fmtDate(r.submittedAt)]);
    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `reimbursements-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 print:hidden"><ArrowLeft className="h-4 w-4" />Back</Button>
          <div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Receipt className="h-6 w-6" />Reimbursements</h1><p className="text-muted-foreground mt-1">Process and track employee reimbursements</p></div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" />Print</Button>
          <Button variant="outline" onClick={() => { fetchReimbursements(); setSearchQuery(""); setStatusFilter("all"); setDepartmentFilter("all"); setCurrentPage(1); }} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2"><Plus className="h-4 w-4" />New Reimbursement</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Requests</p><p className="text-2xl font-bold">{stats.totalRequests}</p></div><div className="p-3 bg-blue-50 rounded-xl"><FileText className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p></div><div className="p-3 bg-yellow-50 rounded-xl"><Clock className="h-5 w-5 text-yellow-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Paid</p><p className="text-2xl font-bold text-green-600">{fmt(stats.totalPaid)}</p></div><div className="p-3 bg-green-50 rounded-xl"><Banknote className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Rejected</p><p className="text-2xl font-bold text-red-600">{fmt(stats.totalRejected)}</p></div><div className="p-3 bg-red-50 rounded-xl"><XCircle className="h-5 w-5 text-red-600" /></div></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 print:hidden"><TabsTrigger value="reimbursements">Reimbursements</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>

        <TabsContent value="reimbursements" className="space-y-4 mt-4">
          <Card><CardContent className="p-4"><div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by employee, description..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{statusOptions.map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent></Select>
            <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[150px]"><Building2 className="h-4 w-4 mr-2" /><SelectValue placeholder="Dept" /></SelectTrigger><SelectContent><SelectItem value="all">All Depts</SelectItem>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          </div></CardContent></Card>

          <Card><CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead>Amount</TableHead><TableHead>Description</TableHead><TableHead>Submitted</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={7} className="text-center py-12">Loading...</TableCell></TableRow> :
                  paginatedReimbursements.length === 0 ? <TableRow><TableCell colSpan={7} className="text-center py-12"><Receipt className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No reimbursements found</p></TableCell></TableRow> :
                  paginatedReimbursements.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><div className="flex flex-col"><span className="text-sm font-medium">{r.employeeName}</span><span className="text-xs text-muted-foreground">{r.employeeEmail}</span></div></TableCell>
                      <TableCell>{r.departmentName || "-"}</TableCell>
                      <TableCell className="font-medium">{fmt(r.amount)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{r.description || "-"}</TableCell>
                      <TableCell>{fmtDate(r.submittedAt)}</TableCell>
                      <TableCell><Badge className={(statusStyles[r.status] || "bg-gray-100 text-gray-700") + " flex items-center gap-1 w-fit"}>
                        {(r.status === "pending") && <Clock className="h-3 w-3" />}
                        {(r.status === "approved" || r.status === "paid") && <CheckCircle className="h-3 w-3" />}
                        {(r.status === "rejected") && <XCircle className="h-3 w-3" />}
                        {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                      </Badge></TableCell>
                      <TableCell><div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedReimbursement(r); setIsViewModalOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {r.status === "pending" && <Button variant="ghost" size="sm" onClick={() => { setSelectedReimbursement(r); setIsDeleteDialogOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>}
                      </div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredReimbursements.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Rows per page:</span><Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}><SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem></SelectContent></Select><span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredReimbursements.length)} of {filteredReimbursements.length}</span></div>
                <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button><span className="text-sm mx-2">Page {currentPage} of {totalPages}</span><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button></div>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><h3 className="font-semibold">Reimbursement Summary</h3></CardHeader><CardContent><div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Total Requested</span><span className="text-lg font-bold">{fmt(stats.totalRequested)}</span></div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Total Approved</span><span className="text-lg font-bold text-blue-600">{fmt(stats.totalApproved)}</span></div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Total Paid</span><span className="text-lg font-bold text-green-600">{fmt(stats.totalPaid)}</span></div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Total Rejected</span><span className="text-lg font-bold text-red-600">{fmt(stats.totalRejected)}</span></div>
            </div></CardContent></Card>
            <Card><CardHeader><h3 className="font-semibold">By Department</h3></CardHeader><CardContent><div className="space-y-3">
              {departments.map((dept) => { const deptReimbursements = reimbursements.filter((r) => r.departmentName === dept); const total = deptReimbursements.reduce((s, r) => s + r.amount, 0); return deptReimbursements.length > 0 ? (
                <div key={dept}><div className="flex justify-between text-sm mb-1"><span>{dept}</span><span>{fmt(total)} ({deptReimbursements.length})</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${stats.totalRequested > 0 ? (total / stats.totalRequested) * 100 : 0}%` }} /></div></div>
              ) : null; })}
            </div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center justify-between"><span>Reimbursement Details</span>{selectedReimbursement && <Badge className={(statusStyles[selectedReimbursement.status] || "") + " flex items-center w-fit ml-2"}>{selectedReimbursement.status.charAt(0).toUpperCase() + selectedReimbursement.status.slice(1)}</Badge>}</DialogTitle></DialogHeader>
          {selectedReimbursement && (<div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-sm text-muted-foreground">Employee</p><p className="font-medium">{selectedReimbursement.employeeName}</p><p className="text-xs text-muted-foreground">{selectedReimbursement.employeeEmail}</p></div>
              <div><p className="text-sm text-muted-foreground">Department</p><p>{selectedReimbursement.departmentName || "-"}</p></div>
              <div><p className="text-sm text-muted-foreground">Amount</p><p className="text-2xl font-bold">{fmt(selectedReimbursement.amount)}</p></div>
              <div><p className="text-sm text-muted-foreground">Submitted</p><p>{fmtDate(selectedReimbursement.submittedAt)}</p></div>
              <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Description</p><p>{selectedReimbursement.description || "-"}</p></div>
            </div>
            {selectedReimbursement.approvedBy && <div className="border-t pt-4"><div className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-600" /><span>Approved by {selectedReimbursement.approvedBy} on {fmtDateTime(selectedReimbursement.approvedAt!)}</span></div></div>}
            {selectedReimbursement.rejectionReason && <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Rejection Reason</p><p className="text-sm mt-1 text-red-600">{selectedReimbursement.rejectionReason}</p></div>}
          </div>)}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => { if (!open) { setIsCreateModalOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Reimbursement Request</DialogTitle><DialogDescription>Submit a reimbursement request</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Employee Name *</Label><Input value={formData.employeeName} onChange={(e) => setFormData((prev) => ({ ...prev, employeeName: e.target.value }))} className="mt-1" placeholder="Full name" />{formErrors.employeeName && <p className="text-sm text-red-500 mt-1">{formErrors.employeeName}</p>}</div>
              <div><Label>Employee Email</Label><Input type="email" value={formData.employeeEmail} onChange={(e) => setFormData((prev) => ({ ...prev, employeeEmail: e.target.value }))} className="mt-1" placeholder="email@company.com" /></div>
              <div><Label>Department</Label><Select value={formData.departmentName} onValueChange={(v) => setFormData((prev) => ({ ...prev, departmentName: v }))}><SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Amount (₦) *</Label><Input type="number" value={formData.amount || ""} onChange={(e) => setFormData((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} className="mt-1" placeholder="0" />{formErrors.amount && <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>}</div>
              <div><Label>Category</Label><Input value={formData.category} onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} className="mt-1" placeholder="e.g. Transport, Supplies" /></div>
              <div><Label>Payment Method</Label><Select value={formData.paymentMethod} onValueChange={(v: any) => setFormData((prev) => ({ ...prev, paymentMethod: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="cheque">Cheque</SelectItem></SelectContent></Select></div>
              <div className="md:col-span-2"><Label>Description *</Label><Textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} className="mt-1" rows={3} placeholder="Describe the reimbursement..." />{formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}</div>
              <div className="md:col-span-2"><Label>Notes (Optional)</Label><Textarea value={formData.notes || ""} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} className="mt-1" rows={2} placeholder="Additional notes..." /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button><Button onClick={handleCreateReimbursement}>Submit Request</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Reimbursement</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this reimbursement request?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteReimbursement} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
