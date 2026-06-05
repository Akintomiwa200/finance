"use client";

import { useState, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  DollarSign,
  Calendar,
  Building2,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Package,
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  Printer,
  Send,
  Receipt,
  Landmark,
  Truck,
  Trash,
  RefreshCcw,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type DisposalMethod = "sale" | "scrap" | "donation" | "trade_in" | "write_off";
type DisposalStatus = "pending" | "approved" | "completed" | "rejected";

interface Asset {
  id: number;
  assetCode: string;
  name: string;
  category: string;
  purchaseDate: string;
  purchaseCost: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  location: string;
  department: string;
  status: string;
}

interface AssetDisposal {
  id: number;
  disposalNumber: string;
  asset: Asset;
  disposalDate: string;
  disposalMethod: DisposalMethod;
  saleAmount: number;
  disposalCost: number;
  netProceeds: number;
  bookValueAtDisposal: number;
  gainLoss: number;
  gainLossType: "gain" | "loss";
  status: DisposalStatus;
  buyerName?: string;
  buyerContact?: string;
  reason: string;
  approvedBy?: string;
  approvedDate?: string;
  processedBy?: string;
  processedDate?: string;
  reference?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
  createdBy: string;
}

// Mock Assets
const mockAssets: Asset[] = [
  {
    id: 1,
    assetCode: "AST-IT-001",
    name: "Dell XPS Laptop",
    category: "IT Equipment",
    purchaseDate: "2024-01-15",
    purchaseCost: 1500000,
    accumulatedDepreciation: 416667,
    currentBookValue: 1083333,
    location: "Engineering Dept",
    department: "Engineering",
    status: "active",
  },
  {
    id: 2,
    assetCode: "AST-IT-002",
    name: "MacBook Pro 16",
    category: "IT Equipment",
    purchaseDate: "2024-02-10",
    purchaseCost: 2800000,
    accumulatedDepreciation: 525000,
    currentBookValue: 2275000,
    location: "Design Dept",
    department: "Design",
    status: "active",
  },
  {
    id: 3,
    assetCode: "AST-VEH-001",
    name: "Toyota Camry",
    category: "Vehicles",
    purchaseDate: "2023-06-01",
    purchaseCost: 35000000,
    accumulatedDepreciation: 12000000,
    currentBookValue: 23000000,
    location: "Sales Dept",
    department: "Sales",
    status: "active",
  },
  {
    id: 4,
    assetCode: "AST-FURN-001",
    name: "Office Desks (Set of 20)",
    category: "Furniture",
    purchaseDate: "2023-01-10",
    purchaseCost: 5000000,
    accumulatedDepreciation: 2035714,
    currentBookValue: 2964286,
    location: "Head Office",
    department: "Operations",
    status: "active",
  },
  {
    id: 5,
    assetCode: "AST-IT-003",
    name: "Server Rack",
    category: "IT Equipment",
    purchaseDate: "2022-09-15",
    purchaseCost: 12000000,
    accumulatedDepreciation: 7200000,
    currentBookValue: 4800000,
    location: "Data Center",
    department: "IT",
    status: "active",
  },
  {
    id: 6,
    assetCode: "AST-IT-004",
    name: "NanoStation M5",
    category: "IT Equipment",
    purchaseDate: "2021-03-20",
    purchaseCost: 250000,
    accumulatedDepreciation: 225000,
    currentBookValue: 25000,
    location: "Network Room",
    department: "IT",
    status: "active",
  },
  {
    id: 7,
    assetCode: "AST-AC-001",
    name: "Air Conditioning Units (10)",
    category: "Equipment",
    purchaseDate: "2023-11-05",
    purchaseCost: 8000000,
    accumulatedDepreciation: 600000,
    currentBookValue: 7400000,
    location: "Head Office",
    department: "Facilities",
    status: "active",
  },
];

// Mock Disposals
const mockDisposals: AssetDisposal[] = [
  {
    id: 1,
    disposalNumber: "DIS-2026-0001",
    asset: mockAssets[5],
    disposalDate: "2026-02-15",
    disposalMethod: "sale",
    saleAmount: 50000,
    disposalCost: 5000,
    netProceeds: 45000,
    bookValueAtDisposal: 25000,
    gainLoss: 20000,
    gainLossType: "gain",
    status: "completed",
    buyerName: "Tech Solutions Ltd",
    buyerContact: "john@techsolutions.com",
    reason: "End of useful life - replaced with newer model",
    approvedBy: "Finance Manager",
    approvedDate: "2026-02-14T10:00:00",
    processedBy: "Asset Officer",
    processedDate: "2026-02-15T14:00:00",
    reference: "SALE-2026-045",
    notes: "Sold at fair market value",
    createdAt: "2026-02-10T09:00:00",
    createdBy: "Asset Manager",
  },
  {
    id: 2,
    disposalNumber: "DIS-2026-0002",
    asset: mockAssets[2],
    disposalDate: "2026-03-10",
    disposalMethod: "trade_in",
    saleAmount: 15000000,
    disposalCost: 500000,
    netProceeds: 14500000,
    bookValueAtDisposal: 23000000,
    gainLoss: -8500000,
    gainLossType: "loss",
    status: "pending",
    buyerName: "Toyota Nigeria",
    reason: "Trade-in for new vehicle",
    reference: "TRADE-2026-023",
    notes: "Awaiting approval",
    createdAt: "2026-03-08T11:00:00",
    createdBy: "Fleet Manager",
  },
  {
    id: 3,
    disposalNumber: "DIS-2026-0003",
    asset: mockAssets[0],
    disposalDate: "2026-03-20",
    disposalMethod: "scrap",
    saleAmount: 0,
    disposalCost: 10000,
    netProceeds: -10000,
    bookValueAtDisposal: 1083333,
    gainLoss: -1093333,
    gainLossType: "loss",
    status: "approved",
    reason: "Damaged beyond repair - water damage",
    approvedBy: "IT Manager",
    approvedDate: "2026-03-19T15:00:00",
    notes: "Asset was severely damaged in flooding",
    createdAt: "2026-03-15T10:00:00",
    createdBy: "IT Admin",
  },
];

const disposalMethods = [
  {
    value: "sale",
    label: "Sale",
    icon: DollarSign,
    color: "bg-green-100 text-green-700",
  },
  {
    value: "scrap",
    label: "Scrap",
    icon: Trash,
    color: "bg-red-100 text-red-700",
  },
  {
    value: "donation",
    label: "Donation",
    icon: Heart,
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "trade_in",
    label: "Trade-in",
    icon: RefreshCcw,
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "write_off",
    label: "Write-off",
    icon: FileText,
    color: "bg-yellow-100 text-yellow-700",
  },
];

const statuses = [
  { value: "all", label: "All Status" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
  {
    value: "completed",
    label: "Completed",
    color: "bg-green-100 text-green-700",
  },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: DisposalStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    pending: <Clock className="h-3 w-3 mr-1" />,
    approved: <CheckCircle className="h-3 w-3 mr-1" />,
    completed: <CheckCircle className="h-3 w-3 mr-1" />,
    rejected: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getDisposalMethodBadge = (method: DisposalMethod) => {
  const config = disposalMethods.find((m) => m.value === method);
  return (
    <Badge className={config?.color + " flex items-center gap-1 w-fit"}>
      {method === "sale" && <DollarSign className="h-3 w-3" />}
      {method === "scrap" && <Trash className="h-3 w-3" />}
      {method === "trade_in" && <RefreshCcw className="h-3 w-3" />}
      {method === "write_off" && <FileText className="h-3 w-3" />}
      {config?.label}
    </Badge>
  );
};

export default function AssetDisposal() {
  const router = useRouter();

  // State
  const [disposals, setDisposals] = useState<AssetDisposal[]>(mockDisposals);
  const [assets] = useState<Asset[]>(mockAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof AssetDisposal;
    direction: "asc" | "desc";
  }>({ key: "disposalDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedDisposal, setSelectedDisposal] =
    useState<AssetDisposal | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"disposals" | "analytics">(
    "disposals",
  );

  // Form state
  const [formData, setFormData] = useState({
    assetId: 0,
    disposalDate: new Date().toISOString().split("T")[0],
    disposalMethod: "sale" as DisposalMethod,
    saleAmount: 0,
    disposalCost: 0,
    buyerName: "",
    buyerContact: "",
    reason: "",
    reference: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calculate gain/loss when form changes
  const selectedAsset = assets.find((a) => a.id === formData.assetId);
  const bookValueAtDisposal = selectedAsset?.currentBookValue || 0;
  const netProceeds = formData.saleAmount - formData.disposalCost;
  const gainLoss = netProceeds - bookValueAtDisposal;
  const gainLossType = gainLoss >= 0 ? "gain" : "loss";

  // Statistics
  const stats = useMemo(() => {
    const totalDisposals = disposals.length;
    const completedDisposals = disposals.filter(
      (d) => d.status === "completed",
    ).length;
    const pendingDisposals = disposals.filter(
      (d) => d.status === "pending",
    ).length;
    const totalGainLoss = disposals.reduce((sum, d) => sum + d.gainLoss, 0);
    const totalProceeds = disposals.reduce((sum, d) => sum + d.netProceeds, 0);
    const totalBookValue = disposals.reduce(
      (sum, d) => sum + d.bookValueAtDisposal,
      0,
    );

    const byMethod: Record<string, number> = {};
    disposals.forEach((d) => {
      byMethod[d.disposalMethod] = (byMethod[d.disposalMethod] || 0) + 1;
    });

    return {
      totalDisposals,
      completedDisposals,
      pendingDisposals,
      totalGainLoss,
      totalProceeds,
      totalBookValue,
      byMethod,
    };
  }, [disposals]);

  // Filter and sort
  const filteredDisposals = useMemo(() => {
    let result = [...disposals];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.disposalNumber.toLowerCase().includes(query) ||
          d.asset.name.toLowerCase().includes(query) ||
          d.asset.assetCode.toLowerCase().includes(query) ||
          d.buyerName?.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((d) => d.status === statusFilter);
    }

    if (methodFilter !== "all") {
      result = result.filter((d) => d.disposalMethod === methodFilter);
    }

    if (dateRange.from) {
      result = result.filter((d) => d.disposalDate >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((d) => d.disposalDate <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "disposalDate") {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortConfig.direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortConfig.direction === "asc"
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return result;
  }, [
    disposals,
    searchQuery,
    statusFilter,
    methodFilter,
    dateRange,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredDisposals.length / itemsPerPage);
  const paginatedDisposals = filteredDisposals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof AssetDisposal) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewDisposal = (disposal: AssetDisposal) => {
    setSelectedDisposal(disposal);
    setIsViewModalOpen(true);
  };

  const handleEditDisposal = (disposal: AssetDisposal) => {
    setSelectedDisposal(disposal);
    setFormData({
      assetId: disposal.asset.id,
      disposalDate: disposal.disposalDate,
      disposalMethod: disposal.disposalMethod,
      saleAmount: disposal.saleAmount,
      disposalCost: disposal.disposalCost,
      buyerName: disposal.buyerName || "",
      buyerContact: disposal.buyerContact || "",
      reason: disposal.reason,
      reference: disposal.reference || "",
      notes: disposal.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.assetId) errors.assetId = "Please select an asset";
    if (!formData.disposalDate)
      errors.disposalDate = "Disposal date is required";
    if (!formData.reason) errors.reason = "Reason for disposal is required";
    if (formData.disposalMethod === "sale" && !formData.buyerName) {
      errors.buyerName = "Buyer name is required for sale";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateDisposal = () => {
    if (!validateForm() || !selectedAsset) return;

    const newDisposal: AssetDisposal = {
      id: Math.max(...disposals.map((d) => d.id), 0) + 1,
      disposalNumber: `DIS-${new Date().getFullYear()}-${String(disposals.length + 1).padStart(4, "0")}`,
      asset: selectedAsset,
      disposalDate: formData.disposalDate,
      disposalMethod: formData.disposalMethod,
      saleAmount: formData.saleAmount,
      disposalCost: formData.disposalCost,
      netProceeds,
      bookValueAtDisposal,
      gainLoss,
      gainLossType,
      status: "pending",
      buyerName: formData.buyerName,
      buyerContact: formData.buyerContact,
      reason: formData.reason,
      reference: formData.reference,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
    };

    setDisposals((prev) => [newDisposal, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateDisposal = () => {
    if (!validateForm() || !selectedDisposal || !selectedAsset) return;

    const updatedDisposal: AssetDisposal = {
      ...selectedDisposal,
      asset: selectedAsset,
      disposalDate: formData.disposalDate,
      disposalMethod: formData.disposalMethod,
      saleAmount: formData.saleAmount,
      disposalCost: formData.disposalCost,
      netProceeds,
      bookValueAtDisposal,
      gainLoss,
      gainLossType,
      buyerName: formData.buyerName,
      buyerContact: formData.buyerContact,
      reason: formData.reason,
      reference: formData.reference,
      notes: formData.notes,
    };

    setDisposals((prev) =>
      prev.map((d) => (d.id === selectedDisposal.id ? updatedDisposal : d)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedDisposal(null);
  };

  const handleApproveDisposal = () => {
    if (!selectedDisposal) return;

    setDisposals((prev) =>
      prev.map((d) =>
        d.id === selectedDisposal.id
          ? {
              ...d,
              status: "approved",
              approvedBy: "Approver",
              approvedDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : d,
      ),
    );
    setIsApproveDialogOpen(false);
    setSelectedDisposal(null);
  };

  const handleCompleteDisposal = () => {
    if (!selectedDisposal) return;

    setDisposals((prev) =>
      prev.map((d) =>
        d.id === selectedDisposal.id
          ? {
              ...d,
              status: "completed",
              processedBy: "Asset Officer",
              processedDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : d,
      ),
    );
    setIsCompleteDialogOpen(false);
    setSelectedDisposal(null);
  };

  const handleDeleteDisposal = () => {
    if (!selectedDisposal) return;
    setDisposals((prev) => prev.filter((d) => d.id !== selectedDisposal.id));
    setIsDeleteDialogOpen(false);
    setSelectedDisposal(null);
  };

  const resetForm = () => {
    setFormData({
      assetId: 0,
      disposalDate: new Date().toISOString().split("T")[0],
      disposalMethod: "sale",
      saleAmount: 0,
      disposalCost: 0,
      buyerName: "",
      buyerContact: "",
      reason: "",
      reference: "",
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Disposal #",
      "Date",
      "Asset",
      "Method",
      "Sale Amount",
      "Disposal Cost",
      "Net Proceeds",
      "Book Value",
      "Gain/Loss",
      "Status",
    ];
    const csvData = filteredDisposals.map((d) => [
      d.disposalNumber,
      formatDate(d.disposalDate),
      d.asset.name,
      d.disposalMethod,
      d.saleAmount.toString(),
      d.disposalCost.toString(),
      d.netProceeds.toString(),
      d.bookValueAtDisposal.toString(),
      `${d.gainLossType === "gain" ? "+" : "-"}${Math.abs(d.gainLoss)}`,
      d.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asset-disposals-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setDisposals([...mockDisposals]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setMethodFilter("all");
    setDateRange({ from: "", to: "" });
  };

  // Chart data for analytics
  const methodChartData = useMemo(() => {
    return Object.entries(stats.byMethod).map(([method, count]) => ({
      name: disposalMethods.find((m) => m.value === method)?.label || method,
      value: count,
    }));
  }, [stats.byMethod]);

  const COLORS = ["#10B981", "#EF4444", "#8B5CF6", "#3B82F6", "#F59E0B"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Trash className="h-6 w-6" />
              Asset Disposal
            </h1>
            <p className="text-muted-foreground mt-1">
              Record and track asset disposals
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Disposal
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Disposals</p>
                <p className="text-2xl font-bold">{stats.totalDisposals}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.completedDisposals}
                </p>
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
                <p className="text-sm text-muted-foreground">Net Proceeds</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalProceeds)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Gain/Loss</p>
                <p
                  className={`text-2xl font-bold ${stats.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {stats.totalGainLoss >= 0 ? "+" : "-"}
                  {formatCurrency(Math.abs(stats.totalGainLoss))}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by disposal #, asset, buyer..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={methodFilter}
              onValueChange={(v) => {
                setMethodFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {disposalMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 mt-3">
            <Input
              type="date"
              placeholder="From Date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="w-[150px]"
            />
            <Input
              type="date"
              placeholder="To Date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="w-[150px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Disposals Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("disposalNumber")}
                    >
                      Disposal #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("disposalDate")}
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Sale Amount</TableHead>
                  <TableHead className="text-right">Book Value</TableHead>
                  <TableHead className="text-right">Gain/Loss</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDisposals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Trash className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No disposals found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDisposals.map((disposal) => (
                    <TableRow key={disposal.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {disposal.disposalNumber}
                      </TableCell>
                      <TableCell>{formatDate(disposal.disposalDate)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {disposal.asset.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {disposal.asset.assetCode}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDisposalMethodBadge(disposal.disposalMethod)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(disposal.saleAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(disposal.bookValueAtDisposal)}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${disposal.gainLossType === "gain" ? "text-green-600" : "text-red-600"}`}
                      >
                        {disposal.gainLossType === "gain" ? "+" : "-"}
                        {formatCurrency(Math.abs(disposal.gainLoss))}
                      </TableCell>
                      <TableCell>{getStatusBadge(disposal.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDisposal(disposal)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {disposal.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditDisposal(disposal)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedDisposal(disposal);
                                  setIsApproveDialogOpen(true);
                                }}
                                className="text-blue-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {disposal.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedDisposal(disposal);
                                setIsCompleteDialogOpen(true);
                              }}
                              className="text-green-600"
                            >
                              <Send className="h-4 w-4" />
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

          {/* Pagination */}
          {filteredDisposals.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t px-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(v) => {
                    setItemsPerPage(parseInt(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredDisposals.length,
                  )}{" "}
                  of {filteredDisposals.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm mx-2">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Disposal Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Disposal Details</span>
              {selectedDisposal && getStatusBadge(selectedDisposal.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedDisposal?.disposalNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedDisposal && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Disposal Date</p>
                  <p>{formatDate(selectedDisposal.disposalDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Method</p>
                  {getDisposalMethodBadge(selectedDisposal.disposalMethod)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Asset</p>
                  <p className="font-medium">{selectedDisposal.asset.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedDisposal.asset.assetCode}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p>{selectedDisposal.asset.category}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Financial Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Sale Amount</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(selectedDisposal.saleAmount)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Disposal Cost
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(selectedDisposal.disposalCost)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Book Value</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedDisposal.bookValueAtDisposal)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Net Proceeds
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(selectedDisposal.netProceeds)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">
                    Gain/Loss on Disposal
                  </p>
                  <p
                    className={`text-2xl font-bold ${selectedDisposal.gainLossType === "gain" ? "text-green-600" : "text-red-600"}`}
                  >
                    {selectedDisposal.gainLossType === "gain" ? "+" : "-"}
                    {formatCurrency(Math.abs(selectedDisposal.gainLoss))}
                  </p>
                </div>
              </div>

              {selectedDisposal.buyerName && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Buyer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p>{selectedDisposal.buyerName}</p>
                    </div>
                    {selectedDisposal.buyerContact && (
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p>{selectedDisposal.buyerContact}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Reason for Disposal
                </p>
                <p className="text-sm mt-1">{selectedDisposal.reason}</p>
              </div>

              {selectedDisposal.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedDisposal.notes}</p>
                </div>
              )}

              {/* Approval Timeline */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Processing Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Created by {selectedDisposal.createdBy} on{" "}
                      {formatDateTime(selectedDisposal.createdAt)}
                    </span>
                  </div>
                  {selectedDisposal.approvedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>
                        Approved by {selectedDisposal.approvedBy} on{" "}
                        {formatDateTime(selectedDisposal.approvedDate!)}
                      </span>
                    </div>
                  )}
                  {selectedDisposal.processedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <Send className="h-4 w-4 text-green-600" />
                      <span>
                        Processed by {selectedDisposal.processedBy} on{" "}
                        {formatDateTime(selectedDisposal.processedDate!)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Disposal Modal */}
      <Dialog
        open={isCreateModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen ? "Record Asset Disposal" : "Edit Disposal"}
            </DialogTitle>
            <DialogDescription>Enter asset disposal details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Select Asset *</Label>
                <Select
                  value={formData.assetId?.toString() || ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, assetId: parseInt(v) }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets
                      .filter((a) => a.status === "active")
                      .map((asset) => (
                        <SelectItem key={asset.id} value={asset.id.toString()}>
                          {asset.assetCode} - {asset.name} (
                          {formatCurrency(asset.currentBookValue)})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {formErrors.assetId && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.assetId}
                  </p>
                )}
              </div>

              <div>
                <Label>Disposal Date *</Label>
                <Input
                  type="date"
                  value={formData.disposalDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      disposalDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
                {formErrors.disposalDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.disposalDate}
                  </p>
                )}
              </div>

              <div>
                <Label>Disposal Method *</Label>
                <Select
                  value={formData.disposalMethod}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, disposalMethod: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {disposalMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(formData.disposalMethod === "sale" ||
                formData.disposalMethod === "trade_in") && (
                <>
                  <div>
                    <Label>Sale Amount (₦)</Label>
                    <Input
                      type="number"
                      value={formData.saleAmount || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          saleAmount: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="mt-1"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Disposal Cost (₦)</Label>
                    <Input
                      type="number"
                      value={formData.disposalCost || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          disposalCost: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="mt-1"
                      placeholder="0"
                    />
                  </div>
                </>
              )}

              {(formData.disposalMethod === "sale" ||
                formData.disposalMethod === "trade_in") && (
                <>
                  <div>
                    <Label>Buyer Name</Label>
                    <Input
                      value={formData.buyerName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          buyerName: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Buyer name"
                    />
                    {formErrors.buyerName && (
                      <p className="text-sm text-red-500 mt-1">
                        {formErrors.buyerName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Buyer Contact</Label>
                    <Input
                      value={formData.buyerContact}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          buyerContact: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Email or phone"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <Label>Reason for Disposal *</Label>
                <Textarea
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  className="mt-1"
                  rows={3}
                  placeholder="Explain why this asset is being disposed..."
                />
                {formErrors.reason && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.reason}
                  </p>
                )}
              </div>

              <div>
                <Label>Reference Number</Label>
                <Input
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reference: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Sale reference, invoice #, etc."
                />
              </div>

              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className="mt-1"
                  rows={2}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {selectedAsset && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Financial Impact Preview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Book Value</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(bookValueAtDisposal)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">
                      Net Proceeds
                    </p>
                    <p className="text-lg font-bold">
                      {formatCurrency(netProceeds)}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Gain/Loss</p>
                    <p
                      className={`text-lg font-bold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {gainLoss >= 0 ? "+" : "-"}
                      {formatCurrency(Math.abs(gainLoss))}
                    </p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p
                      className={`text-lg font-bold ${gainLossType === "gain" ? "text-green-600" : "text-red-600"}`}
                    >
                      {gainLossType === "gain"
                        ? "Capital Gain"
                        : "Capital Loss"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                isCreateModalOpen ? handleCreateDisposal : handleUpdateDisposal
              }
            >
              {isCreateModalOpen ? "Create Disposal" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Disposal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this asset disposal?
              {selectedDisposal && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedDisposal.disposalNumber}
                  </p>
                  <p>Asset: {selectedDisposal.asset.name}</p>
                  <p>
                    Method:{" "}
                    {
                      disposalMethods.find(
                        (m) => m.value === selectedDisposal.disposalMethod,
                      )?.label
                    }
                  </p>
                  <p>
                    Gain/Loss:{" "}
                    {selectedDisposal.gainLossType === "gain" ? "+" : "-"}
                    {formatCurrency(Math.abs(selectedDisposal.gainLoss))}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveDisposal}>
              Approve Disposal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Dialog */}
      <AlertDialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Disposal</AlertDialogTitle>
            <AlertDialogDescription>
              Mark this disposal as completed? This will finalize the
              transaction.
              {selectedDisposal && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedDisposal.disposalNumber}
                  </p>
                  <p>Asset: {selectedDisposal.asset.name}</p>
                  <p>This action will remove the asset from active register.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCompleteDisposal}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Disposal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
