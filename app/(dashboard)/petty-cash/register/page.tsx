"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { ArrowLeft, Search, Filter, Download, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, DollarSign, Calendar, Building2, Receipt, FileText, AlertCircle, Wallet, TrendingUp, TrendingDown, Printer, Calculator, Landmark, CreditCard, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RePieChart, Pie, Cell } from "recharts";
import { usePettyCashStore } from "@/src/store/petty-cash-store";

const categories = ["all", "Office Supplies", "Cleaning Supplies", "IT Equipment", "Staff Welfare", "Entertainment", "Transport", "Medical", "Other"];
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];
const fmt = (n: number) => new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-";

export default function PettyCashRegister() {
  const router = useRouter();
  const { requests, reimbursements, loading, fetchRequests, fetchReimbursements } = usePettyCashStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [activeTab, setActiveTab] = useState<"register" | "analytics">("register");

  useEffect(() => { fetchRequests(); fetchReimbursements(); }, [fetchRequests, fetchReimbursements]);

  const transactions = useMemo(() => {
    const items: { id: string; date: string; type: string; category: string; description: string; amount: number; employee: string; department: string; status: string; }[] = [];
    requests.forEach((r) => {
      if (r.status === "disbursed" || r.status === "approved") {
        items.push({ id: r.id, date: r.requestDate, type: "disbursement", category: r.category || "Other", description: r.title || r.description || "", amount: r.amount, employee: r.employeeName || "", department: r.departmentName || "", status: r.status });
      }
    });
    reimbursements.forEach((r) => {
      items.push({ id: r.id, date: r.submittedAt, type: "reimbursement", category: r.category || "Other", description: r.description || "", amount: r.amount, employee: r.employeeName || "", department: r.departmentName || "", status: r.status });
    });
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [requests, reimbursements]);

  const fund = useMemo(() => {
    const disbursed = requests.filter((r) => r.status === "disbursed").reduce((s, r) => s + r.amount, 0);
    const paidReimbursements = reimbursements.filter((r) => r.status === "paid").reduce((s, r) => s + r.amount, 0);
    const initialBalance = 250000;
    const currentBalance = initialBalance - disbursed - paidReimbursements;
    return { initialBalance, currentBalance, totalDisbursements: disbursed, totalReimbursements: paidReimbursements, totalTransactions: transactions.length };
  }, [requests, reimbursements, transactions]);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter((t) => t.description.toLowerCase().includes(q) || t.employee.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)); }
    if (categoryFilter !== "all") result = result.filter((t) => t.category === categoryFilter);
    return result;
  }, [transactions, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const categoryChartData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter((t) => t.type === "disbursement").forEach((t) => { data[t.category] = (data[t.category] || 0) + t.amount; });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, i) => {
      const month = i;
      const disbursements = transactions.filter((t) => t.type === "disbursement" && new Date(t.date).getMonth() === month).reduce((s, t) => s + t.amount, 0);
      const reimbursementsAmt = transactions.filter((t) => t.type === "reimbursement" && new Date(t.date).getMonth() === month).reduce((s, t) => s + t.amount, 0);
      return { month: m, disbursements, reimbursements: reimbursementsAmt };
    });
  }, [transactions]);

  const handleExport = () => {
    const headers = ["Date", "Type", "Category", "Description", "Employee", "Department", "Amount", "Status"];
    const csvData = filteredTransactions.map((t) => [fmtDate(t.date), t.type, t.category, t.description, t.employee, t.department, t.amount.toString(), t.status]);
    const csv = [headers, ...csvData].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `petty-cash-register-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2 print:hidden"><ArrowLeft className="h-4 w-4" />Back</Button>
          <div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Landmark className="h-6 w-6" />Petty Cash Register</h1><p className="text-muted-foreground mt-1">Track all petty cash transactions</p></div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" />Print</Button>
          <Button variant="outline" onClick={() => { fetchRequests(); fetchReimbursements(); setSearchQuery(""); setCategoryFilter("all"); setCurrentPage(1); }} className="gap-2"><RefreshCw className="h-4 w-4" />Refresh</Button>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl"><Wallet className="h-6 w-6 text-white" /></div>
              <div><p className="text-sm text-muted-foreground">Current Balance</p><p className="text-2xl font-bold text-blue-600">{fmt(fund.currentBalance)}</p><p className="text-xs text-muted-foreground">Initial fund: {fmt(fund.initialBalance)}</p></div>
            </div>
            <div className="flex gap-6">
              <div className="text-center"><p className="text-sm text-muted-foreground">Disbursements</p><p className="text-lg font-semibold text-orange-600">{fmt(fund.totalDisbursements)}</p></div>
              <div className="text-center"><p className="text-sm text-muted-foreground">Reimbursements</p><p className="text-lg font-semibold text-green-600">{fmt(fund.totalReimbursements)}</p></div>
              <div className="text-center"><p className="text-sm text-muted-foreground">Transactions</p><p className="text-lg font-semibold">{fund.totalTransactions}</p></div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 print:hidden"><TabsTrigger value="register">Register</TabsTrigger><TabsTrigger value="analytics">Analytics</TabsTrigger></TabsList>

        <TabsContent value="register" className="space-y-4 mt-4">
          <Card><CardContent className="p-4"><div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input placeholder="Search by description, employee, category..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="pl-9" /></div>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}><SelectTrigger className="w-full sm:w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Category" /></SelectTrigger><SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All Categories" : c}</SelectItem>)}</SelectContent></Select>
          </div></CardContent></Card>

          <Card><CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead>Description</TableHead><TableHead>Employee</TableHead><TableHead>Department</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {loading ? <TableRow><TableCell colSpan={8} className="text-center py-12">Loading...</TableCell></TableRow> :
                  paginatedTransactions.length === 0 ? <TableRow><TableCell colSpan={8} className="text-center py-12"><Receipt className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" /><p className="text-muted-foreground">No transactions found</p></TableCell></TableRow> :
                  paginatedTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{fmtDate(t.date)}</TableCell>
                      <TableCell><Badge className={t.type === "disbursement" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}>{t.type === "disbursement" ? "Disbursement" : "Reimbursement"}</Badge></TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{t.description}</TableCell>
                      <TableCell>{t.employee || "-"}</TableCell>
                      <TableCell>{t.department || "-"}</TableCell>
                      <TableCell className="text-right font-medium">{fmt(t.amount)}</TableCell>
                      <TableCell><Badge className={t.status === "disbursed" || t.status === "paid" || t.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>{t.status.charAt(0).toUpperCase() + t.status.slice(1)}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredTransactions.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><span>Rows per page:</span><Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}><SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="15">15</SelectItem><SelectItem value="25">25</SelectItem><SelectItem value="50">50</SelectItem></SelectContent></Select><span>Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length}</span></div>
                <div className="flex items-center gap-2"><Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button><span className="text-sm mx-2">Page {currentPage} of {totalPages}</span><Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button></div>
              </div>
            )}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card><CardHeader><h3 className="font-semibold">Category Breakdown</h3></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><RePieChart><Pie data={categoryChartData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="value">{categoryChartData.map((_, i) => <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => fmt(v as number)} /></RePieChart></ResponsiveContainer></CardContent></Card>
            <Card><CardHeader><h3 className="font-semibold">Monthly Activity</h3></CardHeader><CardContent><ResponsiveContainer width="100%" height={300}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} /><Tooltip formatter={(v) => fmt(v as number)} /><Legend /><Bar dataKey="disbursements" fill="#F59E0B" name="Disbursements" /><Bar dataKey="reimbursements" fill="#10B981" name="Reimbursements" /></BarChart></ResponsiveContainer></CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
