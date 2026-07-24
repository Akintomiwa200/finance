"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ArrowLeft, Download, Printer, RefreshCw, Filter, TrendingDown, DollarSign, BarChart3, Package, Eye, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";
import { useAssetStore } from "@/src/store/asset-store";
import type { Asset } from "@/src/types/asset";

const categories = [
  { value: "all", label: "All Categories" }, { value: "IT_Equipment", label: "IT Equipment" },
  { value: "Office_Furniture", label: "Office Furniture" }, { value: "Vehicles", label: "Vehicles" },
  { value: "Machinery", label: "Machinery" }, { value: "Building", label: "Building" },
  { value: "Software", label: "Software" }, { value: "Other", label: "Other" },
];
const methods = [
  { value: "straight_line", label: "Straight Line" },
  { value: "declining_balance", label: "Declining Balance" },
  { value: "double_declining", label: "Double Declining" },
];
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];
const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";

export default function AssetsDepreciation() {
  const router = useRouter();
  const { assets, loading, fetchAssets } = useAssetStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<"summary" | "schedule" | "forecast">("summary");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  const filteredAssets = useMemo(() => {
    let result = [...assets];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a) => a.code.toLowerCase().includes(q) || a.name.toLowerCase().includes(q) || a.departmentName?.toLowerCase().includes(q));
    }
    if (categoryFilter !== "all") result = result.filter((a) => a.category === categoryFilter);
    if (methodFilter !== "all") result = result.filter((a) => a.depreciationMethod === methodFilter);
    return result;
  }, [assets, searchQuery, categoryFilter, methodFilter]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const stats = useMemo(() => {
    const totalCost = assets.reduce((s, a) => s + a.purchasePrice, 0);
    const totalCurrentValue = assets.reduce((s, a) => s + a.currentValue, 0);
    const totalDepreciation = assets.reduce((s, a) => s + a.accumulatedDepreciation, 0);
    const monthlyDepreciation = assets.reduce((s, a) => s + Number(a.monthlyDepreciation || 0), 0);
    const activeCount = assets.filter((a) => a.status === "active").length;
    const categoryData: Record<string, number> = {};
    assets.forEach((a) => {
      const label = categories.find((c) => c.value === a.category)?.label || a.category;
      categoryData[label] = (categoryData[label] || 0) + a.currentValue;
    });
    return { totalAssets: assets.length, totalCost, totalCurrentValue, totalDepreciation, monthlyDepreciation, annualDepreciation: monthlyDepreciation * 12, activeCount, depreciationRate: totalCost > 0 ? (totalDepreciation / totalCost) * 100 : 0, categoryData };
  }, [assets]);

  const categoryChartData = useMemo(() => Object.entries(stats.categoryData).map(([name, value]) => ({ name, value })), [stats.categoryData]);

  const monthlyTrendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, i) => ({ month, depreciation: stats.monthlyDepreciation, cumulative: stats.monthlyDepreciation * (i + 1) }));
  }, [stats.monthlyDepreciation]);

  const forecastData = useMemo(() => {
    const data = [];
    let cumDep = stats.totalDepreciation;
    let curVal = stats.totalCurrentValue;
    for (let y = 1; y <= 5; y++) {
      const yearlyDep = stats.annualDepreciation * (1 - (y - 1) * 0.1);
      cumDep += yearlyDep;
      curVal -= yearlyDep;
      data.push({ year: `Year ${y}`, depreciation: yearlyDep, cumulative: cumDep, bookValue: Math.max(curVal, 0) });
    }
    return data;
  }, [stats]);

  const generateSchedule = (asset: Asset) => {
    const schedule = [];
    const purchaseDate = new Date(asset.purchaseDate);
    const usefulLife = asset.usefulLife || 3;
    let currentValue = asset.purchasePrice;
    for (let year = 1; year <= Math.min(usefulLife, 5); year++) {
      let yearlyDep = 0;
      if (asset.depreciationMethod === "straight_line") {
        yearlyDep = (asset.purchasePrice - (asset.salvageValue || 0)) / usefulLife;
      } else {
        const rate = asset.depreciationMethod === "double_declining" ? 2 / usefulLife : 1 / usefulLife;
        yearlyDep = currentValue * rate;
      }
      yearlyDep = Math.min(yearlyDep, currentValue - (asset.salvageValue || 0));
      currentValue -= yearlyDep;
      const yearDate = new Date(purchaseDate);
      yearDate.setFullYear(purchaseDate.getFullYear() + year);
      schedule.push({ period: `${yearDate.getFullYear()}-Q${Math.ceil((yearDate.getMonth() + 1) / 3)}`, depreciationAmount: yearlyDep, accumulatedDepreciation: asset.accumulatedDepreciation + (asset.purchasePrice - currentValue), bookValue: Math.max(currentValue, asset.salvageValue || 0) });
      if (currentValue <= (asset.salvageValue || 0)) break;
    }
    return schedule;
  };

  const handleExport = () => {
    const headers = ["Asset Code", "Asset Name", "Category", "Purchase Cost", "Current Value", "Monthly Dep.", "Method", "Status"];
    const csvData = filteredAssets.map((a) => [a.code, a.name, a.category, a.purchasePrice.toString(), a.currentValue.toString(), String(a.monthlyDepreciation || 0), a.depreciationMethod || "", a.status]);
    const csv = [headers, ...csvData].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = `depreciation-schedule-${new Date().toISOString().split("T")[0]}.csv`; el.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 print:hidden"><ArrowLeft className="h-4 w-4" />Back</Button>
          <div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><TrendingDown className="h-6 w-6" />Depreciation Schedule</h1><p className="text-muted-foreground mt-1">Track asset depreciation and forecast future values</p></div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" />Print</Button>
          <Button variant="outline" onClick={() => { fetchAssets(); setSearchQuery(""); setCategoryFilter("all"); setMethodFilter("all"); setCurrentPage(1); }} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Assets</p><p className="text-2xl font-bold">{stats.totalAssets}</p></div><div className="p-3 bg-blue-50 rounded-xl"><Package className="h-5 w-5 text-blue-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total Current Value</p><p className="text-2xl font-bold text-green-600">{fmt(stats.totalCurrentValue)}</p></div><div className="p-3 bg-green-50 rounded-xl"><DollarSign className="h-5 w-5 text-green-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Monthly Depreciation</p><p className="text-2xl font-bold text-orange-600">{fmt(stats.monthlyDepreciation)}</p></div><div className="p-3 bg-orange-50 rounded-xl"><TrendingDown className="h-5 w-5 text-orange-600" /></div></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Depreciation Rate</p><p className="text-2xl font-bold text-purple-600">{stats.depreciationRate.toFixed(1)}%</p></div><div className="p-3 bg-purple-50 rounded-xl"><BarChart3 className="h-5 w-5 text-purple-600" /></div></div></CardContent></Card>
      </div>

      <Card><CardContent className="p-4"><div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" /></div>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select>
        <Select value={methodFilter} onValueChange={(v) => { setMethodFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[160px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Method" /></SelectTrigger><SelectContent><SelectItem value="all">All Methods</SelectItem>{methods.map((m) => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent></Select>
      </div></CardContent></Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 print:hidden"><TabsTrigger value="summary">Summary</TabsTrigger><TabsTrigger value="schedule">Charts</TabsTrigger><TabsTrigger value="forecast">Forecast</TabsTrigger></TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          <Card><CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Asset Code</TableHead><TableHead>Asset Name</TableHead><TableHead>Category</TableHead><TableHead>Purchase Date</TableHead><TableHead className="text-right">Purchase Cost</TableHead><TableHead className="text-right">Current Value</TableHead><TableHead className="text-right">Monthly Dep.</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead className="w-[50px]"></TableHead></TableRow></TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={10} className="text-center py-12">Loading...</TableCell></TableRow> :
                  paginatedAssets.length === 0 ? <TableRow><TableCell colSpan={10} className="text-center py-12"><Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No assets found</p></TableCell></TableRow> :
                  paginatedAssets.map((asset) => (
                    <TableRow key={asset.id}>
                      <TableCell className="font-mono text-xs">{asset.code}</TableCell>
                      <TableCell className="font-medium">{asset.name}</TableCell>
                      <TableCell>{categories.find((c) => c.value === asset.category)?.label || asset.category}</TableCell>
                      <TableCell>{fmtDate(asset.purchaseDate)}</TableCell>
                      <TableCell className="text-right">{fmt(asset.purchasePrice)}</TableCell>
                      <TableCell className="text-right font-medium text-blue-600">{fmt(asset.currentValue)}</TableCell>
                      <TableCell className="text-right">{fmt(Number(asset.monthlyDepreciation || 0))}</TableCell>
                      <TableCell className="capitalize">{methods.find((m) => m.value === asset.depreciationMethod)?.label || asset.depreciationMethod}</TableCell>
                      <TableCell><Badge className={asset.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>{asset.status === "active" ? "Active" : "Fully Depreciated"}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={() => { setSelectedAsset(asset); setIsScheduleModalOpen(true); }}><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredAssets.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Rows per page:</span><Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}><SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="5">5</SelectItem><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem></SelectContent></Select><span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAssets.length)} of {filteredAssets.length}</span></div>
                <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button><span className="text-sm mx-2">Page {currentPage} of {totalPages}</span><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button></div>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="text-lg">Asset Value by Category</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><RePieChart><Pie data={categoryChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{categoryChartData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => fmt(v as number)} /></RePieChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Monthly Depreciation Trend</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><AreaChart data={monthlyTrendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} /><Tooltip formatter={(v) => fmt(v as number)} /><Legend /><Area type="monotone" dataKey="depreciation" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} name="Monthly Depreciation" /><Area type="monotone" dataKey="cumulative" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Cumulative" /></AreaChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Depreciation Summary</CardTitle></CardHeader><CardContent><div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Annual Depreciation</span><span className="text-xl font-bold">{fmt(stats.annualDepreciation)}</span></div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Total Depreciation to Date</span><span className="text-xl font-bold text-orange-600">{fmt(stats.totalDepreciation)}</span></div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg"><span className="text-muted-foreground">Active Assets</span><span className="text-xl font-bold text-green-600">{stats.activeCount}</span></div>
            </div></CardContent></Card>
            <Card><CardHeader><CardTitle className="text-lg">Depreciation Methods</CardTitle></CardHeader><CardContent><div className="space-y-3">
              {methods.map((m) => { const count = assets.filter((a) => a.depreciationMethod === m.value).length; const pct = stats.totalAssets > 0 ? (count / stats.totalAssets) * 100 : 0; return (<div key={m.value}><div className="flex justify-between text-sm mb-1"><span>{m.label}</span><span>{count} ({pct.toFixed(0)}%)</span></div><div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${pct}%` }} /></div></div>); })}
            </div></CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4 mt-4">
          <Card><CardHeader><CardTitle className="text-lg">5-Year Depreciation Forecast</CardTitle></CardHeader><CardContent><ResponsiveContainer width="100%" height={400}><LineChart data={forecastData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} /><Tooltip formatter={(v) => fmt(v as number)} /><Legend /><Line type="monotone" dataKey="depreciation" stroke="#F59E0B" name="Annual Depreciation" strokeWidth={2} /><Line type="monotone" dataKey="cumulative" stroke="#3B82F6" name="Cumulative Depreciation" strokeWidth={2} /><Line type="monotone" dataKey="bookValue" stroke="#10B981" name="Remaining Book Value" strokeWidth={2} /></LineChart></ResponsiveContainer></CardContent></Card>
          <Card><CardHeader><CardTitle className="text-lg">Forecast Details</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Year</TableHead><TableHead className="text-right">Annual Depreciation</TableHead><TableHead className="text-right">Cumulative Depreciation</TableHead><TableHead className="text-right">Estimated Book Value</TableHead></TableRow></TableHeader><TableBody>{forecastData.map((d, i) => <TableRow key={i}><TableCell className="font-medium">{d.year}</TableCell><TableCell className="text-right text-orange-600">{fmt(d.depreciation)}</TableCell><TableCell className="text-right text-blue-600">{fmt(d.cumulative)}</TableCell><TableCell className="text-right text-green-600">{fmt(d.bookValue)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Depreciation Schedule: {selectedAsset?.name}</DialogTitle><DialogDescription>{selectedAsset?.code}</DialogDescription></DialogHeader>
          {selectedAsset && (<div className="space-y-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Purchase Cost</p><p className="text-lg font-bold">{fmt(selectedAsset.purchasePrice)}</p></div>
              <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Salvage Value</p><p className="text-lg font-bold">{fmt(selectedAsset.salvageValue || 0)}</p></div>
              <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Current Value</p><p className="text-lg font-bold text-blue-600">{fmt(selectedAsset.currentValue)}</p></div>
              <div className="p-3 bg-muted rounded-lg text-center"><p className="text-xs text-muted-foreground">Monthly Dep.</p><p className="text-lg font-bold">{fmt(Number(selectedAsset.monthlyDepreciation || 0))}</p></div>
            </div>
            <div className="border-t pt-4"><h3 className="font-semibold mb-3">Depreciation Projection</h3>
              <Table><TableHeader><TableRow><TableHead>Period</TableHead><TableHead className="text-right">Depreciation</TableHead><TableHead className="text-right">Accumulated</TableHead><TableHead className="text-right">Book Value</TableHead></TableRow></TableHeader><TableBody>{generateSchedule(selectedAsset).map((entry, i) => <TableRow key={i}><TableCell>{entry.period}</TableCell><TableCell className="text-right">{fmt(entry.depreciationAmount)}</TableCell><TableCell className="text-right">{fmt(entry.accumulatedDepreciation)}</TableCell><TableCell className="text-right font-medium text-blue-600">{fmt(entry.bookValue)}</TableCell></TableRow>)}</TableBody></Table>
            </div>
          </div>)}
        </DialogContent>
      </Dialog>
    </div>
  );
}
