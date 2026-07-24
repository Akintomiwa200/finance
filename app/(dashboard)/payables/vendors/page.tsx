"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
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
  Building2,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Star,
  StarOff,
} from "lucide-react";
import { usePayableStore } from "@/src/store/payable-store";
import {
  VENDOR_TYPE_OPTIONS,
  PAYMENT_TERMS_OPTIONS,
  type Vendor,
  type VendorStatusType,
} from "@/src/types/payable";

const STATUS_OPTIONS: { value: VendorStatusType; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
  { value: "pending", label: "Pending" },
];

const STATUS_COLORS: Record<VendorStatusType, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-700",
  suspended: "bg-yellow-100 text-yellow-700",
  pending: "bg-blue-100 text-blue-700",
};

const ITEMS_PER_PAGE_OPTIONS = ["5", "10", "20", "50"];

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= full) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />);
    } else if (i === full + 1 && half) {
      stars.push(<Star key={i} className="h-3 w-3 fill-yellow-500/50 text-yellow-500" />);
    } else {
      stars.push(<StarOff key={i} className="h-3 w-3 text-gray-300" />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export default function VendorsPage() {
  const router = useRouter();
  const { vendors, loading, fetchVendors, deleteVendor } = usePayableStore();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<"name" | "code" | "rating" | "createdAt">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  const stats = useMemo(() => {
    const total = vendors.length;
    const active = vendors.filter((v) => v.status === "active").length;
    const pending = vendors.filter((v) => v.status === "pending").length;
    const avgRating = vendors.length ? vendors.reduce((s, v) => s + v.rating, 0) / vendors.length : 0;
    return { total, active, pending, avgRating };
  }, [vendors]);

  const filtered = useMemo(() => {
    let result = [...vendors];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ||
          v.code.toLowerCase().includes(q) ||
          v.email?.toLowerCase().includes(q) ||
          v.contactName?.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") result = result.filter((v) => v.type === typeFilter);
    if (statusFilter !== "all") result = result.filter((v) => v.status === statusFilter);

    result.sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });
    return result;
  }, [vendors, search, typeFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
    setCurrentPage(1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await deleteVendor(deleteId);
    setDeleting(false);
    setDeleteId(null);
  };

  const handleExport = () => {
    const headers = ["Code", "Name", "Type", "Status", "Payment Terms", "Rating", "Email", "Phone"];
    const rows = filtered.map((v) => [
      v.code, v.name, v.type, v.status, v.paymentTerms, v.rating.toString(), v.email ?? "", v.phone ?? "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendors-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSort = (key: typeof sortKey) => handleSort(key);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Vendors
          </h1>
          <p className="text-muted-foreground mt-1">Manage your vendors and suppliers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button onClick={() => router.push("/payables/vendors/new")} className="gap-2">
            <Plus className="h-4 w-4" /> Add Vendor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
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
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)} / 5</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, code, email..."
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
                {VENDOR_TYPE_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
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
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("code")}>
                      Code <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("name")}>
                      Name <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Terms</TableHead>
                  <TableHead>
                    <button className="flex items-center gap-1 hover:text-foreground" onClick={() => toggleSort("rating")}>
                      Rating <ArrowUpDown className="h-3 w-3" />
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
                        <p className="text-muted-foreground">Loading vendors...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">No vendors found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-xs">{v.code}</TableCell>
                      <TableCell className="font-medium">{v.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {VENDOR_TYPE_OPTIONS.find((t) => t.value === v.type)?.label ?? v.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[v.status]}>
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {PAYMENT_TERMS_OPTIONS.find((t) => t.value === v.paymentTerms)?.label ?? v.paymentTerms}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <StarRating rating={v.rating} />
                          <span className="text-xs text-muted-foreground ml-1">{v.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/payables/vendors/${v.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/payables/vendors/${v.id}/edit`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {v.status === "inactive" && (
                            <Button variant="ghost" size="sm" onClick={() => setDeleteId(v.id)} className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vendor? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
