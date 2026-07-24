"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
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
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Download,
  AlertCircle,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { useApprovalStore } from "@/src/store/approval-store";
import {
  APPROVAL_STATUS_OPTIONS,
  APPROVAL_PRIORITY_OPTIONS,
  type ApprovalStatusType,
  type ApprovalPriority,
} from "@/src/types/approval";

const STATUS_COLORS: Record<ApprovalStatusType, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const PRIORITY_COLORS: Record<ApprovalPriority, string> = {
  LOW: "bg-gray-100 text-gray-600",
  NORMAL: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-200 text-red-800",
};

const ITEMS_PER_PAGE_OPTIONS = ["5", "10", "20", "50"];

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export default function ApprovalsPage() {
  const router = useRouter();
  const { approvals, loading, fetchApprovals, approveRequest, rejectRequest } = useApprovalStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tab, setTab] = useState("PENDING");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"title" | "createdAt" | "priority">("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveComment, setApproveComment] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const stats = useMemo(() => {
    const total = approvals.length;
    const pending = approvals.filter((a) => a.status === "PENDING").length;
    const approved = approvals.filter((a) => a.status === "APPROVED").length;
    const rejected = approvals.filter((a) => a.status === "REJECTED").length;
    return { total, pending, approved, rejected };
  }, [approvals]);

  const effectiveStatus = tab === "all" ? statusFilter : tab;

  const filtered = useMemo(() => {
    let result = [...approvals];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.requesterName.toLowerCase().includes(q) ||
          a.type.toLowerCase().includes(q) ||
          a.departmentName.toLowerCase().includes(q)
      );
    }
    if (effectiveStatus !== "all") result = result.filter((a) => a.status === effectiveStatus);
    if (typeFilter !== "all") result = result.filter((a) => a.type === typeFilter);
    if (priorityFilter !== "all") result = result.filter((a) => a.priority === priorityFilter);

    const priorityOrder = { URGENT: 0, HIGH: 1, NORMAL: 2, LOW: 3 };
    result.sort((a, b) => {
      if (sortKey === "priority") {
        const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
        return sortDir === "asc" ? diff : -diff;
      }
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
    return result;
  }, [approvals, search, effectiveStatus, typeFilter, priorityFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
    setCurrentPage(1);
  };

  const handleApprove = async () => {
    if (!selectedApproval) return;
    setActionLoading(true);
    await approveRequest(selectedApproval, approveComment || undefined);
    setActionLoading(false);
    setApproveDialogOpen(false);
    setSelectedApproval(null);
    setApproveComment("");
  };

  const handleReject = async () => {
    if (!selectedApproval || !rejectReason.trim()) return;
    setActionLoading(true);
    await rejectRequest(selectedApproval, rejectReason);
    setActionLoading(false);
    setRejectDialogOpen(false);
    setSelectedApproval(null);
    setRejectReason("");
  };

  const handleExport = () => {
    const headers = ["Title", "Type", "Requester", "Department", "Priority", "Status", "Created"];
    const rows = filtered.map((a) => [
      a.title, a.type, a.requesterName, a.departmentName, a.priority, a.status, a.createdAt,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `approvals-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uniqueTypes = useMemo(() => [...new Set(approvals.map((a) => a.type))], [approvals]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Approvals
          </h1>
          <p className="text-muted-foreground mt-1">Review and manage approval requests</p>
        </div>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <ClipboardList className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v); setCurrentPage(1); }} className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="PENDING">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="APPROVED">Approved ({stats.approved})</TabsTrigger>
          <TabsTrigger value="REJECTED">Rejected ({stats.rejected})</TabsTrigger>
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, requester, type..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {APPROVAL_PRIORITY_OPTIONS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("title")}>
                      Title <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Requester</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => handleSort("createdAt")}>
                      Date <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="text-muted-foreground">Loading approvals...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <ClipboardList className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No approvals found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{a.title}</p>
                          {a.description && <p className="text-xs text-muted-foreground line-clamp-1">{a.description}</p>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{a.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{a.requesterName}</p>
                          <p className="text-xs text-muted-foreground">{a.departmentName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={PRIORITY_COLORS[a.priority]}>
                          {a.priority.charAt(0) + a.priority.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[a.status]}>
                          {a.status.charAt(0) + a.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(a.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/approvals/${a.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {a.status === "PENDING" && (
                            <>
                              <Button
                                variant="ghost" size="sm"
                                className="text-green-600"
                                onClick={() => { setSelectedApproval(a.id); setApproveComment(""); setApproveDialogOpen(true); }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost" size="sm"
                                className="text-destructive"
                                onClick={() => { setSelectedApproval(a.id); setRejectReason(""); setRejectDialogOpen(true); }}
                              >
                                <XCircle className="h-4 w-4" />
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

          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select value={perPage.toString()} onValueChange={(v) => { setPerPage(parseInt(v)); setCurrentPage(1); }}>
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={n}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>
                  Showing {(currentPage - 1) * perPage + 1}-
                  {Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm mx-2">Page {currentPage} of {totalPages}</span>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Request</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to approve this request?</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Comment (optional)</Label>
            <Textarea
              value={approveComment}
              onChange={(e) => setApproveComment(e.target.value)}
              placeholder="Add a comment..."
              className="mt-2"
              rows={2}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
              {actionLoading ? "Approving..." : "Approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Request</AlertDialogTitle>
            <AlertDialogDescription>Please provide a reason for rejection.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Rejection Reason *</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              className="mt-2"
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={actionLoading || !rejectReason.trim()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {actionLoading ? "Rejecting..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
