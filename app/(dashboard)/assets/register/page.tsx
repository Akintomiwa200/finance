"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ArrowLeft, Plus, Eye, Edit, Trash2, Search, Filter, Download, RefreshCw,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown,
  DollarSign, CheckCircle, XCircle, AlertCircle, Package, TrendingDown, BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import { useAssetStore } from "@/src/store/asset-store";
import type { Asset, AssetCategory, DepreciationMethod } from "@/src/types/asset";

const categories = [
  { value: "IT_Equipment", label: "IT Equipment" },
  { value: "Office_Furniture", label: "Office Furniture" },
  { value: "Vehicles", label: "Vehicles" },
  { value: "Machinery", label: "Machinery" },
  { value: "Building", label: "Building" },
  { value: "Software", label: "Software" },
  { value: "Other", label: "Other" },
];

const departments = ["Engineering", "Design", "Sales", "Operations", "IT", "Facilities", "Finance", "HR"];
const statuses = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-700" },
  { value: "maintenance", label: "Maintenance", color: "bg-yellow-100 text-yellow-700" },
  { value: "disposed", label: "Disposed", color: "bg-red-100 text-red-700" },
  { value: "retired", label: "Retired", color: "bg-gray-100 text-gray-700" },
];
const depreciationMethods = [
  { value: "straight_line", label: "Straight Line" },
  { value: "declining_balance", label: "Declining Balance" },
  { value: "double_declining", label: "Double Declining" },
];

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";

export default function AssetRegister() {
  const router = useRouter();
  const { assets, loading, fetchAssets, addAsset, updateAsset, deleteAsset } = useAssetStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Asset; direction: "asc" | "desc" }>({ key: "code", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"register" | "analytics">("register");

  const [formData, setFormData] = useState({
    name: "", category: "IT_Equipment" as AssetCategory, serialNumber: "", description: "",
    purchaseDate: "", purchaseCost: 0, usefulLife: 3, salvageValue: 0,
    depreciationMethod: "straight_line" as DepreciationMethod, location: "", department: "",
    assignedTo: "", supplier: "", warrantyExpiry: "", notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const stats = useMemo(() => {
    const totalAssets = assets.length;
    const totalValue = assets.reduce((s, a) => s + a.currentValue, 0);
    const totalCost = assets.reduce((s, a) => s + a.purchasePrice, 0);
    const totalDepreciation = assets.reduce((s, a) => s + a.accumulatedDepreciation, 0);
    const activeCount = assets.filter((a) => a.status === "active").length;
    const categoryData: Record<string, number> = {};
    assets.forEach((a) => {
      const label = categories.find((c) => c.value === a.category)?.label || a.category;
      categoryData[label] = (categoryData[label] || 0) + a.currentValue;
    });
    return { totalAssets, totalValue, totalCost, totalDepreciation, activeCount, depreciationRate: totalCost > 0 ? (totalDepreciation / totalCost) * 100 : 0, categoryData };
  }, [assets]);

  const categoryChartData = useMemo(() => Object.entries(stats.categoryData).map(([name, value]) => ({ name, value })), [stats.categoryData]);

  const filteredAssets = useMemo(() => {
    let result = [...assets];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.serialNumber?.toLowerCase().includes(q));
    }
    if (categoryFilter !== "all") result = result.filter((a) => a.category === categoryFilter);
    if (departmentFilter !== "all") result = result.filter((a) => a.departmentName === departmentFilter);
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter);
    if (sortConfig.key) {
      result.sort((a, b) => {
        const av = a[sortConfig.key], bv = b[sortConfig.key];
        if (typeof av === "string" && typeof bv === "string") return sortConfig.direction === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        if (typeof av === "number" && typeof bv === "number") return sortConfig.direction === "asc" ? av - bv : bv - av;
        return 0;
      });
    }
    return result;
  }, [assets, searchQuery, categoryFilter, departmentFilter, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (key: keyof Asset) => {
    setSortConfig((p) => ({ key, direction: p.key === key && p.direction === "asc" ? "desc" : "asc" }));
    setCurrentPage(1);
  };

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.name) e.name = "Required";
    if (!formData.purchaseDate) e.purchaseDate = "Required";
    if (formData.purchaseCost <= 0) e.purchaseCost = "Must be > 0";
    if (!formData.location) e.location = "Required";
    if (!formData.department) e.department = "Required";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreateAsset = async () => {
    if (!validateForm()) return;
    await addAsset({
      name: formData.name, category: formData.category, serialNumber: formData.serialNumber,
      description: formData.description, purchaseDate: formData.purchaseDate,
      purchasePrice: formData.purchaseCost, usefulLife: formData.usefulLife,
      salvageValue: formData.salvageValue, depreciationMethod: formData.depreciationMethod,
      location: formData.location, department: formData.department,
      assignedTo: formData.assignedTo, supplier: formData.supplier,
      warrantyExpiry: formData.warrantyExpiry, notes: formData.notes,
    });
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateAsset = async () => {
    if (!validateForm() || !selectedAsset) return;
    await updateAsset(selectedAsset.id, {
      name: formData.name, category: formData.category, serialNumber: formData.serialNumber,
      description: formData.description, purchaseDate: formData.purchaseDate,
      purchasePrice: formData.purchaseCost, usefulLife: formData.usefulLife,
      salvageValue: formData.salvageValue, depreciationMethod: formData.depreciationMethod,
      location: formData.location, department: formData.department,
      assignedTo: formData.assignedTo, supplier: formData.supplier,
      warrantyExpiry: formData.warrantyExpiry, notes: formData.notes,
    });
    resetForm();
    setIsEditModalOpen(false);
    setSelectedAsset(null);
  };

  const handleDeleteAsset = async () => {
    if (!selectedAsset) return;
    await deleteAsset(selectedAsset.id);
    setIsDeleteDialogOpen(false);
    setSelectedAsset(null);
  };

  const resetForm = () => {
    setFormData({ name: "", category: "IT_Equipment", serialNumber: "", description: "", purchaseDate: "", purchaseCost: 0, usefulLife: 3, salvageValue: 0, depreciationMethod: "straight_line", location: "", department: "", assignedTo: "", supplier: "", warrantyExpiry: "", notes: "" });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = ["Asset Code", "Name", "Category", "Serial Number", "Purchase Cost", "Current Value", "Status", "Location", "Department"];
    const csvData = filteredAssets.map((a) => [a.code, a.name, categories.find((c) => c.value === a.category)?.label || a.category, a.serialNumber || "", a.purchasePrice.toString(), a.currentValue.toString(), a.status, a.location || "", a.departmentName || ""]);
    const csv = [headers, ...csvData].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `asset-register-${new Date().toISOString().split("T")[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    fetchAssets();
    setCurrentPage(1);
    setSearchQuery("");
    setCategoryFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
  };

  const openEditModal = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name, category: asset.category, serialNumber: asset.serialNumber || "",
      description: asset.description || "", purchaseDate: asset.purchaseDate.split("T")[0],
      purchaseCost: asset.purchasePrice, usefulLife: asset.usefulLife || 3,
      salvageValue: asset.salvageValue || 0, depreciationMethod: asset.depreciationMethod || "straight_line",
      location: asset.location || "", department: asset.departmentName || "",
      assignedTo: asset.assignedTo || "", supplier: asset.supplier || "",
      warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.split("T")[0] : "",
      notes: asset.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const config = statuses.find((s) => s.value === status);
    if (!config) return <Badge>{status}</Badge>;
    const icons: Record<string, React.ReactNode> = { active: <CheckCircle className="h-3 w-3 mr-1" />, maintenance: <AlertCircle className="h-3 w-3 mr-1" />, disposed: <XCircle className="h-3 w-3 mr-1" />, retired: <AlertCircle className="h-3 w-3 mr-1" /> };
    return <Badge className={config.color + " flex items-center w-fit"}>{icons[status]}{config.label}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2"><ArrowLeft className="h-4 w-4" />Back</Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Package className="h-6 w-6" />Asset Register</h1>
            <p className="text-muted-foreground mt-1">Complete listing of all fixed assets</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Add Asset</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Assets</p><p className="text-2xl font-bold">{stats.totalAssets}</p></div><div className="p-3 bg-blue-50 rounded-xl"><Package className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Value</p><p className="text-2xl font-bold text-green-600">{fmt(stats.totalValue)}</p></div><div className="p-3 bg-green-50 rounded-xl"><DollarSign className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Depreciation</p><p className="text-2xl font-bold text-orange-600">{fmt(stats.totalDepreciation)}</p></div><div className="p-3 bg-orange-50 rounded-xl"><TrendingDown className="h-5 w-5 text-orange-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Active Assets</p><p className="text-2xl font-bold text-green-600">{stats.activeCount}</p></div><div className="p-3 bg-green-50 rounded-xl"><CheckCircle className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
      </div>

      <Card><CardContent className="p-4"><div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by code, name..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" /></div>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Category" /></SelectTrigger><SelectContent><SelectItem value="all">All Categories</SelectItem>{categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select>
        <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Department" /></SelectTrigger><SelectContent><SelectItem value="all">All Departments</SelectItem>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem>{statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select>
      </div></CardContent></Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="register">Asset Register</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>

        <TabsContent value="register" className="space-y-4 mt-4">
          <Card><CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("code")}>Asset Code<ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("name")}>Asset Name<ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("purchasePrice")}>Purchase Cost<ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead><button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("currentValue")}>Current Value<ArrowUpDown className="h-3 w-3" /></button></TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-12">Loading...</TableCell></TableRow>
                  ) : paginatedAssets.length === 0 ? (
                    <TableRow><TableCell colSpan={8} className="text-center py-12"><Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No assets found</p></TableCell></TableRow>
                  ) : paginatedAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono text-xs font-medium">{asset.code}</TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{categories.find((c) => c.value === asset.category)?.label || asset.category}</TableCell>
                      <TableCell className="font-medium">{fmt(asset.purchasePrice)}</TableCell>
                      <TableCell className="font-medium text-blue-600">{fmt(asset.currentValue)}</TableCell>
                      <TableCell>{asset.departmentName}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell><div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedAsset(asset); setIsViewModalOpen(true); }}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(asset)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedAsset(asset); setIsDeleteDialogOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                      </div></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredAssets.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Rows per page:</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}><SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select>
                  <span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAssets.length)} of {filteredAssets.length}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-sm mx-2">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-lg">Asset Value by Category</CardTitle><CardDescription>Distribution of asset values</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart><Pie data={categoryChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {categoryChartData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip formatter={(v) => fmt(v as number)} /></PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Depreciation Summary</CardTitle></CardHeader>
              <CardContent><div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Depreciation Rate</span><span className="text-2xl font-bold">{stats.depreciationRate.toFixed(1)}%</span></div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Total Depreciation to Date</span><span className="text-xl font-bold text-orange-600">{fmt(stats.totalDepreciation)}</span></div>
              </div></CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="flex items-center justify-between"><span>{selectedAsset?.name}</span>{selectedAsset && getStatusBadge(selectedAsset.status)}</DialogTitle><DialogDescription>{selectedAsset?.code}</DialogDescription></DialogHeader>
          {selectedAsset && (<div className="space-y-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div><p className="text-sm text-muted-foreground">Category</p><p>{categories.find((c) => c.value === selectedAsset.category)?.label}</p></div>
              <div><p className="text-sm text-muted-foreground">Serial Number</p><p className="font-mono text-sm">{selectedAsset.serialNumber || "-"}</p></div>
              <div><p className="text-sm text-muted-foreground">Purchase Date</p><p>{fmtDate(selectedAsset.purchaseDate)}</p></div>
              <div><p className="text-sm text-muted-foreground">Purchase Cost</p><p className="font-bold">{fmt(selectedAsset.purchasePrice)}</p></div>
              <div><p className="text-sm text-muted-foreground">Current Value</p><p className="text-xl font-bold text-blue-600">{fmt(selectedAsset.currentValue)}</p></div>
              <div><p className="text-sm text-muted-foreground">Accumulated Depreciation</p><p className="text-orange-600">{fmt(selectedAsset.accumulatedDepreciation)}</p></div>
              <div><p className="text-sm text-muted-foreground">Monthly Depreciation</p><p>{fmt(selectedAsset.monthlyDepreciation)}</p></div>
              <div><p className="text-sm text-muted-foreground">Location</p><p>{selectedAsset.location}</p></div>
              <div><p className="text-sm text-muted-foreground">Department</p><p>{selectedAsset.departmentName}</p></div>
            </div>
            {selectedAsset.description && <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Description</p><p className="text-sm mt-1">{selectedAsset.description}</p></div>}
            {selectedAsset.notes && <div className="border-t pt-4"><p className="text-sm text-muted-foreground">Notes</p><p className="text-sm mt-1">{selectedAsset.notes}</p></div>}
          </div>)}
          <DialogFooter><Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen || isEditModalOpen} onOpenChange={(open) => { if (!open) { setIsCreateModalOpen(false); setIsEditModalOpen(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{isCreateModalOpen ? "Add Asset" : "Edit Asset"}</DialogTitle><DialogDescription>Enter asset details</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Asset Name *</Label><Input value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="mt-1" />{formErrors.name && <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>}</div>
              <div><Label>Category *</Label><Select value={formData.category} onValueChange={(v: any) => setFormData((p) => ({ ...p, category: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Serial Number</Label><Input value={formData.serialNumber} onChange={(e) => setFormData((p) => ({ ...p, serialNumber: e.target.value }))} className="mt-1" /></div>
              <div><Label>Purchase Date *</Label><Input type="date" value={formData.purchaseDate} onChange={(e) => setFormData((p) => ({ ...p, purchaseDate: e.target.value }))} className="mt-1" />{formErrors.purchaseDate && <p className="text-sm text-red-500 mt-1">{formErrors.purchaseDate}</p>}</div>
              <div><Label>Purchase Cost (₦) *</Label><Input type="number" value={formData.purchaseCost || ""} onChange={(e) => setFormData((p) => ({ ...p, purchaseCost: parseFloat(e.target.value) || 0 }))} className="mt-1" />{formErrors.purchaseCost && <p className="text-sm text-red-500 mt-1">{formErrors.purchaseCost}</p>}</div>
              <div><Label>Useful Life (years)</Label><Input type="number" value={formData.usefulLife} onChange={(e) => setFormData((p) => ({ ...p, usefulLife: parseInt(e.target.value) || 3 }))} className="mt-1" /></div>
              <div><Label>Salvage Value (₦)</Label><Input type="number" value={formData.salvageValue} onChange={(e) => setFormData((p) => ({ ...p, salvageValue: parseFloat(e.target.value) || 0 }))} className="mt-1" /></div>
              <div><Label>Depreciation Method</Label><Select value={formData.depreciationMethod} onValueChange={(v: any) => setFormData((p) => ({ ...p, depreciationMethod: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{depreciationMethods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Location *</Label><Input value={formData.location} onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))} className="mt-1" />{formErrors.location && <p className="text-sm text-red-500 mt-1">{formErrors.location}</p>}</div>
              <div><Label>Department *</Label><Select value={formData.department} onValueChange={(v) => setFormData((p) => ({ ...p, department: v }))}><SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>{formErrors.department && <p className="text-sm text-red-500 mt-1">{formErrors.department}</p>}</div>
              <div><Label>Assigned To</Label><Input value={formData.assignedTo} onChange={(e) => setFormData((p) => ({ ...p, assignedTo: e.target.value }))} className="mt-1" /></div>
              <div><Label>Supplier</Label><Input value={formData.supplier} onChange={(e) => setFormData((p) => ({ ...p, supplier: e.target.value }))} className="mt-1" /></div>
              <div className="md:col-span-2"><Label>Description</Label><Textarea value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} className="mt-1" rows={2} /></div>
              <div className="md:col-span-2"><Label>Notes</Label><Textarea value={formData.notes} onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))} className="mt-1" rows={2} /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); setIsEditModalOpen(false); resetForm(); }}>Cancel</Button>
            <Button onClick={isCreateModalOpen ? handleCreateAsset : handleUpdateAsset}>{isCreateModalOpen ? "Create Asset" : "Save Changes"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent><DialogHeader><DialogTitle>Delete Asset</DialogTitle><DialogDescription>Are you sure you want to delete {selectedAsset?.name}? This action cannot be undone.</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button><Button variant="destructive" onClick={handleDeleteAsset}>Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
