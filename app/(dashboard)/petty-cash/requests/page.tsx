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
import { ArrowLeft, Plus, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, DollarSign, User, Building2, Receipt, FileText, AlertCircle, Wallet, Flag, Printer, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePettyCashStore } from "@/src/store/petty-cash-store";
import type { PettyCashRequest } from "@/src/types/petty-cash";

const categories = ["Office Supplies", "Cleaning Supplies", "IT Equipment", "Staff Welfare", "Entertainment", "Petty Cash", "Software", "Transport", "Medical", "Other"];
const departments = ["Marketing", "Operations", "IT", "HR", "Sales", "Finance", "Engineering"];
const statusOptions = ["all", "pending", "approved", "rejected", "disbursed", "cancelled"];
const priorityOptions = ["all", "low", "medium", "high"];

const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";
const fmtDateTime = (d: string) => new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const statusStyles: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", approved: "bg-blue-100 text-blue-700", rejected: "bg-red-100 text-red-700", disbursed: "bg-green-100 text-green-700", cancelled: "bg-gray-100 text-gray-700" };
const priorityStyles: Record<string, string> = { low: "bg-gray-100 text-gray-700", medium: "bg-blue-100 text-blue-700", high: "bg-red-100 text-red-700" };

export default function CashRequests() {
  const router = useRouter();
  const { requests, loading, fetchRequests, addRequest, updateRequest, deleteRequest, approveRequest, rejectRequest, disburseRequest } = usePettyCashStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRequest, setSelectedRequest] = useState<PettyCashRequest | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDisburseDialogOpen, setIsDisburseDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "balance">("requests");

  const [formData, setFormData] = useState({
    title: "", employeeName: "", employeeEmail: "", departmentName: "",
    amount: 0, description: "", category: "", priority: "medium" as PettyCashRequest["priority"],
    paymentMethod: "cash" as PettyCashRequest["paymentMethod"], expectedDate: "", notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const pettyCashBalance = useMemo(() => {
    const disbursedRequests = requests.filter((r) => r.status === "disbursed");
    const totalDisbursed = disbursedRequests.reduce((sum, r) => sum + r.amount, 0);
    const pendingRequests = requests.filter((r) => r.status === "pending").length;
    return { fundName: "Main Petty Cash Fund", currentBalance: 250000 - totalDisbursed, totalDisbursed, totalRequests: requests.length, pendingRequests, lastReplenishment: "2026-02-28", replenishmentThreshold: 50000 };
  }, [requests]);

  const stats = useMemo(() => {
    const totalAmount = requests.reduce((sum, r) => sum + r.amount, 0);
    return {
      totalRequests: requests.length,
      pendingCount: requests.filter((r) => r.status === "pending").length,
      approvedCount: requests.filter((r) => r.status === "approved").length,
      disbursedCount: requests.filter((r) => r.status === "disbursed").length,
      rejectedCount: requests.filter((r) => r.status === "rejected").length,
      totalAmount,
      disbursedAmount: requests.filter((r) => r.status === "disbursed").reduce((sum, r) => sum + r.amount, 0),
    };
  }, [requests]);

  const filteredRequests = useMemo(() => {
    let result = [...requests];
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter((r) => r.requestNumber.toLowerCase().includes(q) || r.employeeName?.toLowerCase().includes(q) || r.title?.toLowerCase().includes(q) || r.category?.toLowerCase().includes(q)); }
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter);
    if (categoryFilter !== "all") result = result.filter((r) => r.category === categoryFilter);
    if (departmentFilter !== "all") result = result.filter((r) => r.departmentName === departmentFilter);
    if (priorityFilter !== "all") result = result.filter((r) => r.priority === priorityFilter);
    return result;
  }, [requests, searchQuery, statusFilter, categoryFilter, departmentFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetForm = () => { setFormData({ title: "", employeeName: "", employeeEmail: "", departmentName: "", amount: 0, description: "", category: "", priority: "medium", paymentMethod: "cash", expectedDate: "", notes: "" }); setFormErrors({}); };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.employeeName) errors.employeeName = "Requester name is required";
    if (!formData.amount || formData.amount <= 0) errors.amount = "Valid amount is required";
    if (!formData.description) errors.description = "Purpose is required";
    if (!formData.category) errors.category = "Category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateRequest = async () => {
    if (!validateForm()) return;
    const result = await addRequest({
      title: formData.description, employeeName: formData.employeeName, employeeEmail: formData.employeeEmail,
      departmentName: formData.departmentName, amount: formData.amount, description: formData.description,
      category: formData.category, priority: formData.priority, paymentMethod: formData.paymentMethod,
      requestDate: new Date().toISOString().split("T")[0], expectedDate: formData.expectedDate || null,
      position: null, notes: formData.notes || null,
    });
    if (result) { resetForm(); setIsCreateModalOpen(false); fetchRequests(); }
  };

  const handleApproveRequest = async () => { if (!selectedRequest) return; await approveRequest(selectedRequest.id); setIsApproveDialogOpen(false); setSelectedRequest(null); fetchRequests(); };
  const handleRejectRequest = async () => { if (!selectedRequest || !rejectionReason) return; await rejectRequest(selectedRequest.id, rejectionReason); setIsRejectDialogOpen(false); setSelectedRequest(null); setRejectionReason(""); fetchRequests(); };
  const handleDisburseRequest = async () => { if (!selectedRequest) return; await disburseRequest(selectedRequest.id); setIsDisburseDialogOpen(false); setSelectedRequest(null); fetchRequests(); };
  const handleDeleteRequest = async () => { if (!selectedRequest) return; await deleteRequest(selectedRequest.id); setIsDeleteDialogOpen(false); setSelectedRequest(null); fetchRequests(); };

  const handleExport = () => {
    const headers = ["Request #", "Date", "Requester", "Department", "Amount", "Category", "Priority", "Status", "Purpose"];
    const csvData = filteredRequests.map((r) => [r.requestNumber, fmtDate(r.requestDate), r.employeeName || "", r.departmentName || "", r.amount.toString(), r.category || "", r.priority, r.status, r.description || ""]);
    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `cash-requests-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 print:hidden"><ArrowLeft className="h-4 w-4" />Back</Button>
          <div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Wallet className="h-6 w-6" />Petty Cash Book</h1><p className="text-muted-foreground mt-1">Submit and manage petty cash requests</p></div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" />Print</Button>
          <Button variant="outline" onClick={() => { fetchRequests(); setSearchQuery(""); setStatusFilter("all"); setCategoryFilter("all"); setDepartmentFilter("all"); setPriorityFilter("all"); setCurrentPage(1); }} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2"><Plus className="h-4 w-4" />New Request</Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl"><Wallet className="h-6 w-6 text-white" /></div>
              <div><p className="text-sm text-muted-foreground">Petty Cash Fund</p><p className="text-2xl font-bold text-blue-600">{fmt(pettyCashBalance.currentBalance)}</p><p className="text-xs text-muted-foreground">Last replenishment: {fmtDate(pettyCashBalance.lastReplenishment)}</p></div>
            </div>
            <div className="flex gap-6">
              <div className="text-center"><p className="text-sm text-muted-foreground">Total Disbursed</p><p className="text-lg font-semibold text-orange-600">{fmt(pettyCashBalance.totalDisbursed)}</p></div>
              <div className="text-center"><p className="text-sm text-muted-foreground">Pending Requests</p><p className="text-lg font-semibold text-yellow-600">{pettyCashBalance.pendingRequests}</p></div>
              <div className="text-center"><p className="text-sm text-muted-foreground">Total Requests</p><p className="text-lg font-semibold">{pettyCashBalance.totalRequests}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Requests</p><p className="text-2xl font-bold">{stats.totalRequests}</p></div><div className="p-3 bg-blue-50 rounded-xl"><FileText className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Pending</p><p className="text-2xl font-bold text-yellow-600">{stats.pendingCount}</p></div><div className="p-3 bg-yellow-50 rounded-xl"><Clock className="h-5 w-5 text-yellow-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Disbursed</p><p className="text-2xl font-bold text-green-600">{stats.disbursedCount}</p></div><div className="p-3 bg-green-50 rounded-xl"><CheckCircle className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Amount</p><p className="text-2xl font-bold text-purple-600">{fmt(stats.totalAmount)}</p></div><div className="p-3 bg-purple-50 rounded-xl"><DollarSign className="h-5 w-5 text-purple-600" /></div></div></CardContent></Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 print:hidden"><TabsTrigger value="requests">Cash Requests</TabsTrigger><TabsTrigger value="balance">Balance & History</TabsTrigger></TabsList>

        <TabsContent value="requests" className="space-y-4 mt-4">
          <Card><CardContent className="p-4"><div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by request #, requester, purpose..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{statusOptions.map((s) => <SelectItem key={s} value={s}>{s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent></Select>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[150px]"><Building2 className="h-4 w-4 mr-2" /><SelectValue placeholder="Dept" /></SelectTrigger><SelectContent><SelectItem value="all">All Depts</SelectItem>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
            <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[130px]"><Flag className="h-4 w-4 mr-2" /><SelectValue placeholder="Priority" /></SelectTrigger><SelectContent>{priorityOptions.map((p) => <SelectItem key={p} value={p}>{p === "all" ? "All Priority" : p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent></Select>
          </div></CardContent></Card>

          <Card><CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Request #</TableHead><TableHead>Date</TableHead><TableHead>Requester</TableHead><TableHead>Department</TableHead>
                  <TableHead>Amount</TableHead><TableHead>Category</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead className="w-[100px]">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={9} className="text-center py-12">Loading...</TableCell></TableRow> :
                  paginatedRequests.length === 0 ? <TableRow><TableCell colSpan={9} className="text-center py-12"><Receipt className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No cash requests found</p></TableCell></TableRow> :
                  paginatedRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-mono text-xs font-medium">{request.requestNumber}</TableCell>
                      <TableCell>{fmtDate(request.requestDate)}</TableCell>
                      <TableCell><div className="flex flex-col"><span className="text-sm font-medium">{request.employeeName}</span><span className="text-xs text-muted-foreground">{request.employeeEmail}</span></div></TableCell>
                      <TableCell>{request.departmentName || "-"}</TableCell>
                      <TableCell className="font-medium">{fmt(request.amount)}</TableCell>
                      <TableCell>{request.category || "-"}</TableCell>
                      <TableCell><Badge className={(priorityStyles[request.priority] || "") + " flex items-center gap-1 w-fit"}>{request.priority === "high" && <AlertCircle className="h-3 w-3" />}{request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}</Badge></TableCell>
                      <TableCell><Badge className={(statusStyles[request.status] || "bg-gray-100 text-gray-700") + " flex items-center gap-1 w-fit"}>
                        {(request.status === "pending") && <Clock className="h-3 w-3" />}
                        {(request.status === "approved" || request.status === "disbursed") && <CheckCircle className="h-3 w-3" />}
                        {(request.status === "rejected" || request.status === "cancelled") && <XCircle className="h-3 w-3" />}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge></TableCell>
                      <TableCell><div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedRequest(request); setIsViewModalOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {request.status === "pending" && <><Button variant="ghost" size="sm" onClick={() => { setSelectedRequest(request); setIsApproveDialogOpen(true); }} className="text-green-600"><CheckCircle className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => { setSelectedRequest(request); setIsRejectDialogOpen(true); }} className="text-red-600"><XCircle className="h-4 w-4" /></Button></>}
                        {request.status === "approved" && <Button variant="ghost" size="sm" onClick={() => { setSelectedRequest(request); setIsDisburseDialogOpen(true); }} className="text-blue-600"><DollarSign className="h-4 w-4" /></Button>}
                      </div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredRequests.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Rows per page:</span><Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}><SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select><span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredRequests.length)} of {filteredRequests.length}</span></div>
                <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button><span className="text-sm mx-2">Page {currentPage} of {totalPages}</span><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button></div>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="balance" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle>Petty Cash Balance History</CardTitle><CardDescription>Track balance changes and replenishment history</CardDescription></CardHeader><CardContent>
            <div className="text-center py-12"><Wallet className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">Balance history coming soon</p><p className="text-sm text-muted-foreground mt-1">Current balance: {fmt(pettyCashBalance.currentBalance)}</p></div>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center justify-between"><span>Cash Request Details</span>{selectedRequest && <Badge className={(statusStyles[selectedRequest.status] || "") + " flex items-center w-fit ml-2"}>{selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}</Badge>}</DialogTitle><DialogDescription>{selectedRequest?.requestNumber}</DialogDescription></DialogHeader>
          {selectedRequest && (<div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-sm text-muted-foreground">Request Date</p><p>{fmtDate(selectedRequest.requestDate)}</p></div>
              <div><p className="text-sm text-muted-foreground">Amount</p><p className="text-2xl font-bold">{fmt(selectedRequest.amount)}</p></div>
              <div><p className="text-sm text-muted-foreground">Category</p><p>{selectedRequest.category || "-"}</p></div>
              <div><p className="text-sm text-muted-foreground">Priority</p><Badge className={(priorityStyles[selectedRequest.priority] || "") + " flex items-center gap-1 w-fit"}>{selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}</Badge></div>
              <div className="md:col-span-2"><p className="text-sm text-muted-foreground">Purpose</p><p>{selectedRequest.description || selectedRequest.title}</p></div>
            </div>
            <div className="border-t pt-4"><h3 className="font-semibold mb-3">Requester Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-sm text-muted-foreground">Name</p><p>{selectedRequest.employeeName}</p></div>
              <div><p className="text-sm text-muted-foreground">Email</p><p>{selectedRequest.employeeEmail || "-"}</p></div>
              <div><p className="text-sm text-muted-foreground">Department</p><p>{selectedRequest.departmentName || "-"}</p></div>
            </div></div>
            {(selectedRequest.approvedBy || selectedRequest.disbursedBy || selectedRequest.rejectionReason) && (
              <div className="border-t pt-4"><h3 className="font-semibold mb-3">Processing Information</h3><div className="space-y-2">
                {selectedRequest.approvedBy && <div className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-600" /><span>Approved by {selectedRequest.approvedBy} on {fmtDateTime(selectedRequest.approvedAt!)}</span></div>}
                {selectedRequest.disbursedBy && <div className="flex items-center gap-2 text-sm"><DollarSign className="h-4 w-4 text-blue-600" /><span>Disbursed by {selectedRequest.disbursedBy} on {fmtDateTime(selectedRequest.disbursedAt!)}</span></div>}
                {selectedRequest.rejectionReason && <div className="flex items-start gap-2 text-sm text-red-600"><XCircle className="h-4 w-4 mt-0.5" /><div><span className="font-medium">Rejection Reason:</span><p>{selectedRequest.rejectionReason}</p></div></div>}
              </div></div>
            )}
            {selectedRequest.notes && <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Additional Notes</p><p className="text-sm mt-1">{selectedRequest.notes}</p></div>}
          </div>)}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => { if (!open) { setIsCreateModalOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Cash Request</DialogTitle><DialogDescription>Submit a request for petty cash disbursement</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Requester Name *</Label><Input value={formData.employeeName} onChange={(e) => setFormData((prev) => ({ ...prev, employeeName: e.target.value }))} className="mt-1" placeholder="Full name" />{formErrors.employeeName && <p className="text-sm text-red-500 mt-1">{formErrors.employeeName}</p>}</div>
              <div><Label>Requester Email</Label><Input type="email" value={formData.employeeEmail} onChange={(e) => setFormData((prev) => ({ ...prev, employeeEmail: e.target.value }))} className="mt-1" placeholder="email@company.com" /></div>
              <div><Label>Department</Label><Select value={formData.departmentName} onValueChange={(v) => setFormData((prev) => ({ ...prev, departmentName: v }))}><SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Amount (₦) *</Label><Input type="number" value={formData.amount || ""} onChange={(e) => setFormData((prev) => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))} className="mt-1" placeholder="0" />{formErrors.amount && <p className="text-sm text-red-500 mt-1">{formErrors.amount}</p>}</div>
              <div><Label>Category *</Label><Select value={formData.category} onValueChange={(v) => setFormData((prev) => ({ ...prev, category: v }))}><SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>{formErrors.category && <p className="text-sm text-red-500 mt-1">{formErrors.category}</p>}</div>
              <div><Label>Priority</Label><Select value={formData.priority} onValueChange={(v: any) => setFormData((prev) => ({ ...prev, priority: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem></SelectContent></Select></div>
              <div><Label>Payment Method</Label><Select value={formData.paymentMethod} onValueChange={(v: any) => setFormData((prev) => ({ ...prev, paymentMethod: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank_transfer">Bank Transfer</SelectItem><SelectItem value="cheque">Cheque</SelectItem></SelectContent></Select></div>
              <div><Label>Expected Date</Label><Input type="date" value={formData.expectedDate} onChange={(e) => setFormData((prev) => ({ ...prev, expectedDate: e.target.value }))} className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Purpose *</Label><Textarea value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} className="mt-1" rows={3} placeholder="Describe the purpose of this cash request..." />{formErrors.description && <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>}</div>
              <div className="md:col-span-2"><Label>Notes (Optional)</Label><Textarea value={formData.notes || ""} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} className="mt-1" rows={2} placeholder="Additional notes..." /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button><Button onClick={handleCreateRequest}>Submit Request</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Approve Cash Request</AlertDialogTitle><AlertDialogDescription>Are you sure you want to approve this cash request?
          {selectedRequest && <div className="mt-2 p-3 bg-muted rounded-lg"><p className="font-medium">{selectedRequest.requestNumber}</p><p className="text-sm">Amount: {fmt(selectedRequest.amount)}</p><p className="text-sm">Purpose: {selectedRequest.description || selectedRequest.title}</p></div>}
        </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleApproveRequest} className="bg-green-600 hover:bg-green-700">Approve</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Reject Cash Request</AlertDialogTitle><AlertDialogDescription>Please provide a reason for rejecting this request.
          {selectedRequest && <div className="mt-2 p-3 bg-muted rounded-lg"><p className="font-medium">{selectedRequest.requestNumber}</p><p className="text-sm">Amount: {fmt(selectedRequest.amount)}</p></div>}
        </AlertDialogDescription></AlertDialogHeader>
          <div className="py-4"><Label>Rejection Reason *</Label><Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="mt-2" rows={3} placeholder="Please explain why this request is being rejected..." required /></div>
        <AlertDialogFooter><AlertDialogCancel onClick={() => setRejectionReason("")}>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleRejectRequest} className="bg-red-600 hover:bg-red-700">Reject</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>

      {/* Disburse Dialog */}
      <AlertDialog open={isDisburseDialogOpen} onOpenChange={setIsDisburseDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Disburse Cash</AlertDialogTitle><AlertDialogDescription>Confirm disbursement of approved cash request.
          {selectedRequest && <div className="mt-2 p-3 bg-muted rounded-lg"><p className="font-medium">{selectedRequest.requestNumber}</p><p className="text-lg font-bold">{fmt(selectedRequest.amount)}</p><p className="text-sm">To: {selectedRequest.employeeName}</p></div>}
        </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDisburseRequest} className="bg-blue-600 hover:bg-blue-700">Confirm Disbursement</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Request</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this request?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteRequest} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
