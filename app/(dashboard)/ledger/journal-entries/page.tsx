"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FileText,
  CheckCircle,
  Clock,
  Send,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";
import { useLedgerStore } from "@/src/store/ledger-store";
import type { JournalEntry, JournalStatus } from "@/src/types/ledger";

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "posted", label: "Posted" },
  { value: "rejected", label: "Rejected" },
];

const typeOptions = [
  { value: "all", label: "All Types" },
  { value: "general", label: "General" },
  { value: "adjusting", label: "Adjusting" },
  { value: "closing", label: "Closing" },
  { value: "reversing", label: "Reversing" },
  { value: "payroll", label: "Payroll" },
  { value: "sales", label: "Sales" },
  { value: "purchase", label: "Purchase" },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string) {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getStatusBadge(status: JournalStatus) {
  const styles: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    pending_approval: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    posted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  const labels: Record<string, string> = {
    draft: "Draft",
    pending_approval: "Pending Approval",
    approved: "Approved",
    posted: "Posted",
    rejected: "Rejected",
  };
  return <Badge className={styles[status] || ""}>{labels[status] || status}</Badge>;
}

export default function JournalEntriesPage() {
  const router = useRouter();

  const entries = useLedgerStore((s) => s.journalEntries);
  const loading = useLedgerStore((s) => s.loading);
  const fetchJournalEntries = useLedgerStore((s) => s.fetchJournalEntries);
  const deleteJournalEntry = useLedgerStore((s) => s.deleteJournalEntry);

  useEffect(() => {
    fetchJournalEntries();
  }, [fetchJournalEntries]);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof JournalEntry;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const postedEntries = entries.filter((e) => e.status === "posted").length;
    const draftEntries = entries.filter((e) => e.status === "draft").length;
    const totalDebit = entries.reduce((sum, e) => sum + e.totalDebit, 0);
    const totalCredit = entries.reduce((sum, e) => sum + e.totalCredit, 0);
    return { totalEntries, postedEntries, draftEntries, totalDebit, totalCredit, isBalanced: totalDebit === totalCredit };
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = [...entries];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.entryNumber.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.reference?.toLowerCase().includes(q),
      );
    }
    if (typeFilter !== "all") result = result.filter((e) => e.type === typeFilter);
    if (statusFilter !== "all") result = result.filter((e) => e.status === statusFilter);
    if (dateFrom) result = result.filter((e) => e.date >= dateFrom);
    if (dateTo) result = result.filter((e) => e.date <= dateTo);
    if (sortConfig.key) result.sort((a, b) => compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.direction));
    return result;
  }, [entries, searchQuery, typeFilter, statusFilter, dateFrom, dateTo, sortConfig]);

  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSort = (key: keyof JournalEntry) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteJournalEntry(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = () => {
    const headers = ["Entry #", "Date", "Type", "Status", "Description", "Reference", "Total Debit", "Total Credit", "Created By"];
    const csvData = filteredEntries.map((e) => [
      e.entryNumber, e.date, e.type, e.status, e.description, e.reference || "",
      e.totalDebit.toString(), e.totalCredit.toString(), e.createdBy,
    ]);
    const csv = [headers, ...csvData].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-entries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              Journal Entries
              <Badge variant="secondary" className="ml-2">{stats.totalEntries}</Badge>
            </h1>
            <p className="text-muted-foreground mt-1">Record and manage all journal entries</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push("/ledger/journal-entries/new")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Entries</p>
            <p className="text-2xl font-bold">{stats.totalEntries}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Posted</p>
            <p className="text-2xl font-bold text-green-600">{stats.postedEntries}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="text-2xl font-bold text-amber-600">{stats.draftEntries}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Debits</p>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalDebit)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by entry #, description, reference..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-[150px]"
              placeholder="From"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-[150px]"
              placeholder="To"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>
            {filteredEntries.length} entr{filteredEntries.length !== 1 ? "ies" : "y"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("entryNumber")}>
                      Entry #<ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("date")}>
                      Date<ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("totalDebit")}>
                      Debit<ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && entries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-muted-foreground">Loading entries...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileText className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No journal entries found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-sm font-medium">{entry.entryNumber}</TableCell>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{entry.type}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">{entry.description}</TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="text-right font-medium text-blue-600">{formatCurrency(entry.totalDebit)}</TableCell>
                      <TableCell className="text-right font-medium text-green-600">{formatCurrency(entry.totalCredit)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/ledger/journal-entries/${entry.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {entry.status === "draft" && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => router.push(`/ledger/journal-entries/${entry.id}/edit`)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(entry.id)}
                                disabled={deletingId === entry.id}
                              >
                                {deletingId === entry.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredEntries.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(parseInt(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[70px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredEntries.length)} of {filteredEntries.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm mx-2">Page {currentPage} of {totalPages || 1}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages || 1)} disabled={currentPage === totalPages || totalPages === 0}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
