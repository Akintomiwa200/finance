"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/src/components/ui/card";
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
import { ArrowLeft, Plus, Eye, Edit, Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, DollarSign, CheckCircle, XCircle, Clock, Package, TrendingUp, Trash, RefreshCcw, FileText, Heart, Send, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAssetStore } from "@/src/store/asset-store";
import type { Asset, AssetDisposal } from "@/src/types/asset";

const disposalMethods = [
  { value: "sale", label: "Sale", color: "bg-green-100 text-green-700" },
  { value: "scrap", label: "Scrap", color: "bg-red-100 text-red-700" },
  { value: "donation", label: "Donation", color: "bg-purple-100 text-purple-700" },
  { value: "trade_in", label: "Trade-in", color: "bg-blue-100 text-blue-700" },
  { value: "write_off", label: "Write-off", color: "bg-yellow-100 text-yellow-700" },
];
const statuses = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];
const COLORS = ["#10B981", "#EF4444", "#8B5CF6", "#3B82F6", "#F59E0B"];
const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(n));
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";
const fmtDateTime = (d: string) => new Date(d).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

export default function AssetDisposal() {
  const router = useRouter();
  const { assets, disposals, loading, fetchAssets, fetchDisposals, addDisposal, approveDisposal, completeDisposal, deleteDisposal } = useAssetStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: "", to: "" });
  const [sortConfig, setSortConfig] = useState<{ key: keyof AssetDisposal; direction: "asc" | "desc" }>({ key: "disposalDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedDisposal, setSelectedDisposal] = useState<AssetDisposal | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"disposals" | "analytics">("disposals");

  const [formData, setFormData] = useState({
    assetId: "",
    disposalDate: new Date().toISOString().split("T")[0],
    disposalMethod: "sale" as AssetDisposal["disposalMethod"],
    saleAmount: 0,
    disposalCost: 0,
    buyerName: "",
    buyerContact: "",
    reason: "",
    reference: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { fetchAssets(); fetchDisposals(); }, [fetchAssets, fetchDisposals]);

  const selectedAsset = assets.find((a) => a.id === formData.assetId);
  const bookValueAtDisposal = selectedAsset?.currentValue || 0;
  const netProceeds = formData.saleAmount - formData.disposalCost;
  const gainLoss = netProceeds - bookValueAtDisposal;
  const gainLossType = gainLoss >= 0 ? "gain" : "loss";

  const stats = useMemo(() => {
    const totalDisposals = disposals.length;
    const completedDisposals = disposals.filter((d) => d.status === "completed").length;
    const pendingDisposals = disposals.filter((d) => d.status === "pending").length;
    const totalGainLoss = disposals.reduce((sum, d) => sum + d.gainLoss, 0);
    const totalProceeds = disposals.reduce((sum, d) => sum + d.netProceeds, 0);
    const byMethod: Record<string, number> = {};
    disposals.forEach((d) => { byMethod[d.disposalMethod] = (byMethod[d.disposalMethod] || 0) + 1; });
    return { totalDisposals, completedDisposals, pendingDisposals, totalGainLoss, totalProceeds, byMethod };
  }, [disposals]);

  const filteredDisposals = useMemo(() => {
    let result = [...disposals];
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter((d) => d.disposalNumber.toLowerCase().includes(q) || d.assetName?.toLowerCase().includes(q) || d.assetCode?.toLowerCase().includes(q) || d.buyerName?.toLowerCase().includes(q)); }
    if (statusFilter !== "all") result = result.filter((d) => d.status === statusFilter);
    if (methodFilter !== "all") result = result.filter((d) => d.disposalMethod === methodFilter);
    if (dateRange.from) result = result.filter((d) => d.disposalDate >= dateRange.from);
    if (dateRange.to) result = result.filter((d) => d.disposalDate <= dateRange.to);
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key]; let bVal = b[sortConfig.key];
        if (sortConfig.key === "disposalDate") { aVal = new Date(aVal as string).getTime(); bVal = new Date(bVal as string).getTime(); }
        if (typeof aVal === "string" && typeof bVal === "string") return sortConfig.direction === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        if (typeof aVal === "number" && typeof bVal === "number") return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        return 0;
      });
    }
    return result;
  }, [disposals, searchQuery, statusFilter, methodFilter, dateRange, sortConfig]);

  const totalPages = Math.ceil(filteredDisposals.length / itemsPerPage);
  const paginatedDisposals = filteredDisposals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const methodChartData = useMemo(() => Object.entries(stats.byMethod).map(([method, count]) => ({ name: disposalMethods.find((m) => m.value === method)?.label || method, value: count })), [stats.byMethod]);

  const handleSort = (key: keyof AssetDisposal) => { setSortConfig((prev) => ({ key, direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc" })); setCurrentPage(1); };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.assetId) errors.assetId = "Please select an asset";
    if (!formData.disposalDate) errors.disposalDate = "Disposal date is required";
    if (!formData.reason) errors.reason = "Reason for disposal is required";
    if (formData.disposalMethod === "sale" && !formData.buyerName) errors.buyerName = "Buyer name is required for sale";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => { setFormData({ assetId: "", disposalDate: new Date().toISOString().split("T")[0], disposalMethod: "sale", saleAmount: 0, disposalCost: 0, buyerName: "", buyerContact: "", reason: "", reference: "", notes: "" }); setFormErrors({}); };

  const handleCreateDisposal = async () => {
    if (!validateForm()) return;
    const result = await addDisposal({
      assetId: formData.assetId, disposalDate: formData.disposalDate, disposalMethod: formData.disposalMethod,
      saleAmount: formData.saleAmount, disposalCost: formData.disposalCost, buyerName: formData.buyerName,
      buyerContact: formData.buyerContact, reason: formData.reason, reference: formData.reference, notes: formData.notes,
    });
    if (result) { resetForm(); setIsCreateModalOpen(false); fetchDisposals(); }
  };

  const handleApproveDisposal = async () => { if (!selectedDisposal) return; await approveDisposal(selectedDisposal.id); setIsApproveDialogOpen(false); setSelectedDisposal(null); fetchDisposals(); };
  const handleCompleteDisposal = async () => { if (!selectedDisposal) return; await completeDisposal(selectedDisposal.id); setIsCompleteDialogOpen(false); setSelectedDisposal(null); fetchDisposals(); };
  const handleDeleteDisposal = async () => { if (!selectedDisposal) return; await deleteDisposal(selectedDisposal.id); setIsDeleteDialogOpen(false); setSelectedDisposal(null); fetchDisposals(); };

  const handleExport = () => {
    const headers = ["Disposal #", "Date", "Asset", "Method", "Sale Amount", "Disposal Cost", "Net Proceeds", "Book Value", "Gain/Loss", "Status"];
    const csvData = filteredDisposals.map((d) => [d.disposalNumber, fmtDate(d.disposalDate), d.assetName || "", d.disposalMethod, d.saleAmount.toString(), d.disposalCost.toString(), d.netProceeds.toString(), d.bookValueAtDisposal.toString(), `${d.gainLossType === "gain" ? "+" : "-"}${Math.abs(d.gainLoss)}`, d.status]);
    const csv = [headers, ...csvData].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `asset-disposals-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 print:hidden"><ArrowLeft className="h-4 w-4" />Back</Button>
          <div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Trash className="h-6 w-6" />Asset Disposal</h1><p className="text-muted-foreground mt-1">Record and track asset disposals</p></div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" />Print</Button>
          <Button variant="outline" onClick={() => { fetchAssets(); fetchDisposals(); setSearchQuery(""); setStatusFilter("all"); setMethodFilter("all"); setCurrentPage(1); }} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2"><Plus className="h-4 w-4" />New Disposal</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Disposals</p><p className="text-2xl font-bold">{stats.totalDisposals}</p></div><div className="p-3 bg-blue-50 rounded-xl"><Package className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">{stats.completedDisposals}</p></div><div className="p-3 bg-green-50 rounded-xl"><CheckCircle className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Net Proceeds</p><p className="text-2xl font-bold text-green-600">{fmt(stats.totalProceeds)}</p></div><div className="p-3 bg-green-50 rounded-xl"><DollarSign className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Net Gain/Loss</p><p className={`text-2xl font-bold ${stats.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>{stats.totalGainLoss >= 0 ? "+" : "-"}{fmt(stats.totalGainLoss)}</p></div><div className="p-3 bg-purple-50 rounded-xl"><TrendingUp className="h-5 w-5 text-purple-600" /></div></div></CardContent></Card>
      </div>

      <Card><CardContent className="p-4"><div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by disposal #, asset, buyer..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" /></div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[150px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger><SelectContent>{statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select>
        <Select value={methodFilter} onValueChange={(v) => { setMethodFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[140px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Method" /></SelectTrigger><SelectContent><SelectItem value="all">All Methods</SelectItem>{disposalMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent></Select>
      </div>
      <div className="flex gap-3 mt-3">
        <Input type="date" placeholder="From Date" value={dateRange.from} onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))} className="w-[150px]" />
        <Input type="date" placeholder="To Date" value={dateRange.to} onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))} className="w-[150px]" />
      </div></CardContent></Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 print:hidden"><TabsTrigger value="disposals">Disposals</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>

        <TabsContent value="disposals" className="space-y-4 mt-4">
          <Card><CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("disposalNumber")}>Disposal #<ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("disposalDate")}>Date<ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead>Asset</TableHead><TableHead>Method</TableHead>
                  <TableHead className="text-right">Sale Amount</TableHead><TableHead className="text-right">Book Value</TableHead><TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead>Status</TableHead><TableHead className="w-[100px]">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={9} className="text-center py-12">Loading...</TableCell></TableRow> :
                  paginatedDisposals.length === 0 ? <TableRow><TableCell colSpan={9} className="text-center py-12"><Trash className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No disposals found</p></TableCell></TableRow> :
                  paginatedDisposals.map((disposal) => (
                    <TableRow key={disposal.id}>
                      <TableCell className="font-mono text-xs font-medium">{disposal.disposalNumber}</TableCell>
                      <TableCell>{fmtDate(disposal.disposalDate)}</TableCell>
                      <TableCell><div className="flex flex-col"><span className="font-medium">{disposal.assetName}</span><span className="text-xs text-muted-foreground">{disposal.assetCode}</span></div></TableCell>
                      <TableCell><Badge className={disposalMethods.find((m) => m.value === disposal.disposalMethod)?.color + " flex items-center gap-1 w-fit"}>{disposalMethods.find((m) => m.value === disposal.disposalMethod)?.label}</Badge></TableCell>
                      <TableCell className="text-right font-medium">{fmt(disposal.saleAmount)}</TableCell>
                      <TableCell className="text-right">{fmt(disposal.bookValueAtDisposal)}</TableCell>
                      <TableCell className={`text-right font-medium ${disposal.gainLossType === "gain" ? "text-green-600" : "text-red-600"}`}>{disposal.gainLossType === "gain" ? "+" : "-"}{fmt(disposal.gainLoss)}</TableCell>
                      <TableCell><Badge className={(statuses.find((s) => s.value === disposal.status)?.color || "bg-gray-100 text-gray-700") + " flex items-center w-fit"}>
                        {disposal.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                        {disposal.status === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {disposal.status === "completed" && <CheckCircle className="h-3 w-3 mr-1" />}
                        {disposal.status === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                        {statuses.find((s) => s.value === disposal.status)?.label}
                      </Badge></TableCell>
                      <TableCell><div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedDisposal(disposal); setIsViewModalOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        {disposal.status === "pending" && <><Button variant="ghost" size="sm" onClick={() => { setSelectedDisposal(disposal); setIsApproveDialogOpen(true); }} className="text-blue-600"><CheckCircle className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => { setSelectedDisposal(disposal); setIsDeleteDialogOpen(true); }} className="text-red-600"><XCircle className="h-4 w-4" /></Button></>}
                        {disposal.status === "approved" && <Button variant="ghost" size="sm" onClick={() => { setSelectedDisposal(disposal); setIsCompleteDialogOpen(true); }} className="text-green-600"><Send className="h-4 w-4" /></Button>}
                      </div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredDisposals.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Rows per page:</span><Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}><SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select><span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredDisposals.length)} of {filteredDisposals.length}</span></div>
                <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button><span className="text-sm mx-2">Page {currentPage} of {totalPages}</span><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button></div>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><h3 className="font-semibold">Disposals by Method</h3></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={methodChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{methodChartData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><h3 className="font-semibold">Summary</h3></CardHeader><CardContent><div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Total Book Value Disposed</span><span className="text-lg font-bold">{fmt(disposals.reduce((s, d) => s + d.bookValueAtDisposal, 0))}</span></div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Total Proceeds</span><span className="text-lg font-bold text-green-600">{fmt(stats.totalProceeds)}</span></div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Net Gain/Loss</span><span className={`text-lg font-bold ${stats.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>{stats.totalGainLoss >= 0 ? "+" : "-"}{fmt(stats.totalGainLoss)}</span></div>
            </div></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between"><span>Disposal Details</span>{selectedDisposal && <Badge className={(statuses.find((s) => s.value === selectedDisposal.status)?.color || "") + " flex items-center w-fit ml-2"}>{statuses.find((s) => s.value === selectedDisposal.status)?.label}</Badge>}</DialogTitle>
            <DialogDescription>{selectedDisposal?.disposalNumber}</DialogDescription>
          </DialogHeader>
          {selectedDisposal && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><p className="text-sm text-muted-foreground">Disposal Date</p><p>{fmtDate(selectedDisposal.disposalDate)}</p></div>
                <div><p className="text-sm text-muted-foreground">Method</p><Badge className={disposalMethods.find((m) => m.value === selectedDisposal.disposalMethod)?.color + " flex items-center gap-1 w-fit"}>{disposalMethods.find((m) => m.value === selectedDisposal.disposalMethod)?.label}</Badge></div>
                <div><p className="text-sm text-muted-foreground">Asset</p><p className="font-medium">{selectedDisposal.assetName}</p><p className="text-xs text-muted-foreground">{selectedDisposal.assetCode}</p></div>
              </div>
              <div className="border-t pt-4"><h3 className="font-semibold mb-3">Financial Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Sale Amount</p><p className="text-lg font-bold text-green-600">{fmt(selectedDisposal.saleAmount)}</p></div>
                  <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Disposal Cost</p><p className="text-lg font-bold text-red-600">{fmt(selectedDisposal.disposalCost)}</p></div>
                  <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Book Value</p><p className="text-lg font-bold">{fmt(selectedDisposal.bookValueAtDisposal)}</p></div>
                  <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Net Proceeds</p><p className="text-lg font-bold">{fmt(selectedDisposal.netProceeds)}</p></div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg text-center"><p className="text-sm text-muted-foreground">Gain/Loss on Disposal</p><p className={`text-2xl font-bold ${selectedDisposal.gainLossType === "gain" ? "text-green-600" : "text-red-600"}`}>{selectedDisposal.gainLossType === "gain" ? "+" : "-"}{fmt(selectedDisposal.gainLoss)}</p></div>
              </div>
              {selectedDisposal.buyerName && <div className="border-t pt-4"><h3 className="font-semibold mb-3">Buyer Information</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><p className="text-sm text-muted-foreground">Name</p><p>{selectedDisposal.buyerName}</p></div>{selectedDisposal.buyerContact && <div><p className="text-sm text-muted-foreground">Contact</p><p>{selectedDisposal.buyerContact}</p></div>}</div></div>}
              <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Reason for Disposal</p><p className="text-sm mt-1">{selectedDisposal.reason}</p></div>
              {selectedDisposal.notes && <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Notes</p><p className="text-sm mt-1">{selectedDisposal.notes}</p></div>}
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => { if (!open) { setIsCreateModalOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Record Asset Disposal</DialogTitle><DialogDescription>Enter asset disposal details</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Select Asset *</Label><Select value={formData.assetId} onValueChange={(v) => setFormData((prev) => ({ ...prev, assetId: v }))}><SelectTrigger className="mt-1"><SelectValue placeholder="Select asset" /></SelectTrigger><SelectContent>{assets.filter((a) => a.status === "active").map((a) => <SelectItem key={a.id} value={a.id}>{a.code} - {a.name} ({fmt(a.currentValue)})</SelectItem>)}</SelectContent></Select>{formErrors.assetId && <p className="text-sm text-red-500 mt-1">{formErrors.assetId}</p>}</div>
              <div><Label>Disposal Date *</Label><Input type="date" value={formData.disposalDate} onChange={(e) => setFormData((prev) => ({ ...prev, disposalDate: e.target.value }))} className="mt-1" /></div>
              <div><Label>Disposal Method *</Label><Select value={formData.disposalMethod} onValueChange={(v: any) => setFormData((prev) => ({ ...prev, disposalMethod: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{disposalMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent></Select></div>
              {(formData.disposalMethod === "sale" || formData.disposalMethod === "trade_in") && <>
                <div><Label>Sale Amount (₦)</Label><Input type="number" value={formData.saleAmount || ""} onChange={(e) => setFormData((prev) => ({ ...prev, saleAmount: parseFloat(e.target.value) || 0 }))} className="mt-1" placeholder="0" /></div>
                <div><Label>Disposal Cost (₦)</Label><Input type="number" value={formData.disposalCost || ""} onChange={(e) => setFormData((prev) => ({ ...prev, disposalCost: parseFloat(e.target.value) || 0 }))} className="mt-1" placeholder="0" /></div>
                <div><Label>Buyer Name</Label><Input value={formData.buyerName} onChange={(e) => setFormData((prev) => ({ ...prev, buyerName: e.target.value }))} className="mt-1" placeholder="Buyer name" />{formErrors.buyerName && <p className="text-sm text-red-500 mt-1">{formErrors.buyerName}</p>}</div>
                <div><Label>Buyer Contact</Label><Input value={formData.buyerContact} onChange={(e) => setFormData((prev) => ({ ...prev, buyerContact: e.target.value }))} className="mt-1" placeholder="Email or phone" /></div>
              </>}
              <div className="md:col-span-2"><Label>Reason for Disposal *</Label><Textarea value={formData.reason} onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))} className="mt-1" rows={3} placeholder="Explain why this asset is being disposed..." />{formErrors.reason && <p className="text-sm text-red-500 mt-1">{formErrors.reason}</p>}</div>
              <div><Label>Reference Number</Label><Input value={formData.reference} onChange={(e) => setFormData((prev) => ({ ...prev, reference: e.target.value }))} className="mt-1" placeholder="Sale reference, invoice #, etc." /></div>
              <div className="md:col-span-2"><Label>Notes</Label><Textarea value={formData.notes} onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))} className="mt-1" rows={2} placeholder="Additional notes..." /></div>
            </div>
            {selectedAsset && <div className="border-t pt-4"><h3 className="font-semibold mb-3">Financial Impact Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Book Value</p><p className="text-lg font-bold">{fmt(bookValueAtDisposal)}</p></div>
                <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Net Proceeds</p><p className="text-lg font-bold">{fmt(netProceeds)}</p></div>
                <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Gain/Loss</p><p className={`text-lg font-bold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>{gainLoss >= 0 ? "+" : "-"}{fmt(Math.abs(gainLoss))}</p></div>
                <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Type</p><p className={`text-lg font-bold ${gainLossType === "gain" ? "text-green-600" : "text-red-600"}`}>{gainLossType === "gain" ? "Capital Gain" : "Capital Loss"}</p></div>
              </div>
            </div>}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>Cancel</Button><Button onClick={handleCreateDisposal}>Create Disposal</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Approve Disposal</AlertDialogTitle><AlertDialogDescription>Are you sure you want to approve this asset disposal?
          {selectedDisposal && <div className="mt-2 p-3 bg-muted rounded-lg"><p className="font-medium">{selectedDisposal.disposalNumber}</p><p>Asset: {selectedDisposal.assetName}</p><p>Gain/Loss: {selectedDisposal.gainLossType === "gain" ? "+" : "-"}{fmt(selectedDisposal.gainLoss)}</p></div>}
        </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleApproveDisposal}>Approve Disposal</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>

      {/* Complete Dialog */}
      <AlertDialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Complete Disposal</AlertDialogTitle><AlertDialogDescription>Mark this disposal as completed? This will finalize the transaction.
          {selectedDisposal && <div className="mt-2 p-3 bg-muted rounded-lg"><p className="font-medium">{selectedDisposal.disposalNumber}</p><p>Asset: {selectedDisposal.assetName}</p><p>This action will remove the asset from active register.</p></div>}
        </AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleCompleteDisposal} className="bg-green-600 hover:bg-green-700">Complete Disposal</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Disposal</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this disposal record?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteDisposal} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
