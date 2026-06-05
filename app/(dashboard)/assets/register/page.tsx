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
  Building2,
  Calendar,
  DollarSign,
  Tag,
  MapPin,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  Laptop,
  Car,
  Truck,
  Home,
  Wrench,
  HardDrive,
  Printer,
  Shield,
  TrendingDown,
  BarChart3,
  FileText,
  MoreHorizontal,
  Copy,
  QrCode,
  Scan,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Types
type AssetStatus = "active" | "maintenance" | "disposed" | "retired";
type DepreciationMethod =
  | "straight_line"
  | "declining_balance"
  | "double_declining";
type AssetCategory =
  | "IT_Equipment"
  | "Office_Furniture"
  | "Vehicles"
  | "Machinery"
  | "Building"
  | "Software"
  | "Other";

interface Asset {
  id: number;
  assetCode: string;
  serialNumber?: string;
  name: string;
  category: AssetCategory;
  description: string;
  purchaseDate: string;
  purchaseCost: number;
  usefulLife: number;
  salvageValue: number;
  depreciationMethod: DepreciationMethod;
  currentValue: number;
  accumulatedDepreciation: number;
  monthlyDepreciation: number;
  status: AssetStatus;
  location: string;
  department: string;
  assignedTo?: string;
  supplier?: string;
  warrantyExpiry?: string;
  maintenanceSchedule?: string;
  lastValuation?: string;
  notes?: string;
  barcode?: string;
  qrCode?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock Data
const mockAssets: Asset[] = [
  {
    id: 1,
    assetCode: "AST-IT-001",
    serialNumber: "DL-2024-001234",
    name: "Dell XPS Laptop",
    category: "IT_Equipment",
    description: "High-performance development laptop",
    purchaseDate: "2024-01-15",
    purchaseCost: 1500000,
    usefulLife: 3,
    salvageValue: 150000,
    depreciationMethod: "straight_line",
    currentValue: 1083333,
    accumulatedDepreciation: 416667,
    monthlyDepreciation: 41667,
    status: "active",
    location: "Engineering Dept",
    department: "Engineering",
    assignedTo: "John Doe",
    supplier: "Dell Technologies",
    warrantyExpiry: "2026-01-15",
    notes: "Primary development machine",
    createdAt: "2024-01-15",
    updatedAt: "2026-03-01",
    createdBy: "IT Admin",
  },
  {
    id: 2,
    assetCode: "AST-IT-002",
    serialNumber: "MPB-2024-005678",
    name: "MacBook Pro 16",
    category: "IT_Equipment",
    description: "Design team laptop",
    purchaseDate: "2024-02-10",
    purchaseCost: 2800000,
    usefulLife: 4,
    salvageValue: 280000,
    depreciationMethod: "straight_line",
    currentValue: 2275000,
    accumulatedDepreciation: 525000,
    monthlyDepreciation: 52500,
    status: "active",
    location: "Design Dept",
    department: "Design",
    assignedTo: "Jane Smith",
    supplier: "Apple Inc.",
    warrantyExpiry: "2027-02-10",
    createdAt: "2024-02-10",
    updatedAt: "2026-03-01",
    createdBy: "IT Admin",
  },
  {
    id: 3,
    assetCode: "AST-VEH-001",
    serialNumber: "TC-2023-789012",
    name: "Toyota Camry",
    category: "Vehicles",
    description: "Company car for sales team",
    purchaseDate: "2023-06-01",
    purchaseCost: 35000000,
    usefulLife: 5,
    salvageValue: 5000000,
    depreciationMethod: "declining_balance",
    currentValue: 23000000,
    accumulatedDepreciation: 12000000,
    monthlyDepreciation: 200000,
    status: "active",
    location: "Sales Dept",
    department: "Sales",
    assignedTo: "Sales Team",
    supplier: "Toyota Nigeria",
    warrantyExpiry: "2026-06-01",
    maintenanceSchedule: "Every 5000km",
    notes: "Fleet vehicle for client visits",
    createdAt: "2023-06-01",
    updatedAt: "2026-03-01",
    createdBy: "Fleet Manager",
  },
  {
    id: 4,
    assetCode: "AST-FURN-001",
    name: "Office Desks (Set of 20)",
    category: "Office_Furniture",
    description: "Workstation desks for open office",
    purchaseDate: "2023-01-10",
    purchaseCost: 5000000,
    usefulLife: 7,
    salvageValue: 500000,
    depreciationMethod: "straight_line",
    currentValue: 2964286,
    accumulatedDepreciation: 2035714,
    monthlyDepreciation: 53571,
    status: "active",
    location: "Head Office",
    department: "Operations",
    supplier: "IKEA",
    notes: "New office setup",
    createdAt: "2023-01-10",
    updatedAt: "2026-03-01",
    createdBy: "Facilities Manager",
  },
  {
    id: 5,
    assetCode: "AST-IT-003",
    serialNumber: "SR-2022-345678",
    name: "Server Rack",
    category: "IT_Equipment",
    description: "Data center server infrastructure",
    purchaseDate: "2022-09-15",
    purchaseCost: 12000000,
    usefulLife: 5,
    salvageValue: 1000000,
    depreciationMethod: "double_declining",
    currentValue: 4800000,
    accumulatedDepreciation: 7200000,
    monthlyDepreciation: 120000,
    status: "active",
    location: "Data Center",
    department: "IT",
    assignedTo: "IT Team",
    supplier: "Dell EMC",
    warrantyExpiry: "2025-09-15",
    createdAt: "2022-09-15",
    updatedAt: "2026-03-01",
    createdBy: "IT Admin",
  },
  {
    id: 6,
    assetCode: "AST-IT-004",
    serialNumber: "NAN-2021-001",
    name: "NanoStation M5",
    category: "IT_Equipment",
    description: "Network infrastructure",
    purchaseDate: "2021-03-20",
    purchaseCost: 250000,
    usefulLife: 3,
    salvageValue: 25000,
    depreciationMethod: "straight_line",
    currentValue: 25000,
    accumulatedDepreciation: 225000,
    monthlyDepreciation: 6250,
    status: "retired",
    location: "Network Room",
    department: "IT",
    assignedTo: "Network Team",
    supplier: "Ubiquiti",
    notes: "End of life - replaced",
    createdAt: "2021-03-20",
    updatedAt: "2024-03-20",
    createdBy: "IT Admin",
  },
  {
    id: 7,
    assetCode: "AST-AC-001",
    name: "Air Conditioning Units (10)",
    category: "Other",
    description: "Office air conditioning system",
    purchaseDate: "2023-11-05",
    purchaseCost: 8000000,
    usefulLife: 8,
    salvageValue: 800000,
    depreciationMethod: "straight_line",
    currentValue: 7400000,
    accumulatedDepreciation: 600000,
    monthlyDepreciation: 75000,
    status: "active",
    location: "Head Office",
    department: "Facilities",
    supplier: "LG Electronics",
    warrantyExpiry: "2027-11-05",
    maintenanceSchedule: "Quarterly service",
    createdAt: "2023-11-05",
    updatedAt: "2026-03-01",
    createdBy: "Facilities Manager",
  },
  {
    id: 8,
    assetCode: "AST-SW-001",
    name: "Microsoft Licenses (50 seats)",
    category: "Software",
    description: "Enterprise software licenses",
    purchaseDate: "2024-01-01",
    purchaseCost: 3000000,
    usefulLife: 2,
    salvageValue: 0,
    depreciationMethod: "straight_line",
    currentValue: 1750000,
    accumulatedDepreciation: 1250000,
    monthlyDepreciation: 125000,
    status: "active",
    location: "Cloud",
    department: "IT",
    supplier: "Microsoft",
    notes: "Annual subscription",
    createdAt: "2024-01-01",
    updatedAt: "2026-03-01",
    createdBy: "IT Admin",
  },
];

const categories = [
  { value: "IT_Equipment", label: "IT Equipment", icon: Laptop },
  { value: "Office_Furniture", label: "Office Furniture", icon: Package },
  { value: "Vehicles", label: "Vehicles", icon: Car },
  { value: "Machinery", label: "Machinery", icon: Wrench },
  { value: "Building", label: "Building", icon: Home },
  { value: "Software", label: "Software", icon: HardDrive },
  { value: "Other", label: "Other", icon: Tag },
];

const departments = [
  "Engineering",
  "Design",
  "Sales",
  "Operations",
  "IT",
  "Facilities",
  "Finance",
  "HR",
];
const statuses = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-700" },
  {
    value: "maintenance",
    label: "Maintenance",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "disposed", label: "Disposed", color: "bg-red-100 text-red-700" },
  { value: "retired", label: "Retired", color: "bg-gray-100 text-gray-700" },
];

const depreciationMethods = [
  { value: "straight_line", label: "Straight Line" },
  { value: "declining_balance", label: "Declining Balance" },
  { value: "double_declining", label: "Double Declining" },
];

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: AssetStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    active: <CheckCircle className="h-3 w-3 mr-1" />,
    maintenance: <Wrench className="h-3 w-3 mr-1" />,
    disposed: <XCircle className="h-3 w-3 mr-1" />,
    retired: <AlertCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getCategoryIcon = (category: AssetCategory) => {
  const config = categories.find((c) => c.value === category);
  if (config?.icon) {
    const Icon = config.icon;
    return <Icon className="h-4 w-4" />;
  }
  return <Tag className="h-4 w-4" />;
};

export default function AssetRegister() {
  const router = useRouter();

  // State
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Asset;
    direction: "asc" | "desc";
  }>({ key: "assetCode", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"register" | "analytics">(
    "register",
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "IT_Equipment" as AssetCategory,
    serialNumber: "",
    description: "",
    purchaseDate: "",
    purchaseCost: 0,
    usefulLife: 3,
    salvageValue: 0,
    depreciationMethod: "straight_line" as DepreciationMethod,
    location: "",
    department: "",
    assignedTo: "",
    supplier: "",
    warrantyExpiry: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics and Chart Data
  const stats = useMemo(() => {
    const totalAssets = assets.length;
    const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalCost = assets.reduce((sum, a) => sum + a.purchaseCost, 0);
    const totalDepreciation = assets.reduce(
      (sum, a) => sum + a.accumulatedDepreciation,
      0,
    );
    const activeCount = assets.filter((a) => a.status === "active").length;
    const maintenanceCount = assets.filter(
      (a) => a.status === "maintenance",
    ).length;

    const categoryData: Record<string, number> = {};
    assets.forEach((asset) => {
      const categoryLabel =
        categories.find((c) => c.value === asset.category)?.label ||
        asset.category;
      categoryData[categoryLabel] =
        (categoryData[categoryLabel] || 0) + asset.currentValue;
    });

    return {
      totalAssets,
      totalValue,
      totalCost,
      totalDepreciation,
      activeCount,
      maintenanceCount,
      depreciationRate:
        totalCost > 0 ? (totalDepreciation / totalCost) * 100 : 0,
      categoryData,
    };
  }, [assets]);

  const categoryChartData = useMemo(() => {
    return Object.entries(stats.categoryData).map(([name, value]) => ({
      name,
      value,
    }));
  }, [stats.categoryData]);

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  // Filter and sort
  const filteredAssets = useMemo(() => {
    let result = [...assets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.assetCode.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query) ||
          a.serialNumber?.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((a) => a.category === categoryFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter((a) => a.department === departmentFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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
    assets,
    searchQuery,
    categoryFilter,
    departmentFilter,
    statusFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof Asset) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setFormData({
      name: asset.name,
      category: asset.category,
      serialNumber: asset.serialNumber || "",
      description: asset.description,
      purchaseDate: asset.purchaseDate,
      purchaseCost: asset.purchaseCost,
      usefulLife: asset.usefulLife,
      salvageValue: asset.salvageValue,
      depreciationMethod: asset.depreciationMethod,
      location: asset.location,
      department: asset.department,
      assignedTo: asset.assignedTo || "",
      supplier: asset.supplier || "",
      warrantyExpiry: asset.warrantyExpiry || "",
      notes: asset.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const calculateMonthlyDepreciation = (
    cost: number,
    salvage: number,
    life: number,
    method: DepreciationMethod,
  ): number => {
    switch (method) {
      case "straight_line":
        return (cost - salvage) / (life * 12);
      case "declining_balance":
        const rate = 1 / life;
        const avgValue = (cost + salvage) / 2;
        return (avgValue * rate) / 12;
      case "double_declining":
        const dblRate = 2 / life;
        const avgValueDbl = (cost + salvage) / 2;
        return (avgValueDbl * dblRate) / 12;
      default:
        return 0;
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "Asset name is required";
    if (!formData.purchaseDate)
      errors.purchaseDate = "Purchase date is required";
    if (formData.purchaseCost <= 0)
      errors.purchaseCost = "Purchase cost must be greater than 0";
    if (formData.usefulLife <= 0)
      errors.usefulLife = "Useful life must be greater than 0";
    if (!formData.location) errors.location = "Location is required";
    if (!formData.department) errors.department = "Department is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateAsset = () => {
    if (!validateForm()) return;

    const monthlyDepreciation = calculateMonthlyDepreciation(
      formData.purchaseCost,
      formData.salvageValue,
      formData.usefulLife,
      formData.depreciationMethod,
    );

    const purchaseDate = new Date(formData.purchaseDate);
    const monthsOwned = Math.floor(
      (new Date().getTime() - purchaseDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30),
    );
    const accumulatedDepreciation = Math.min(
      monthlyDepreciation * monthsOwned,
      formData.purchaseCost - formData.salvageValue,
    );
    const currentValue = formData.purchaseCost - accumulatedDepreciation;

    const newAsset: Asset = {
      id: Math.max(...assets.map((a) => a.id), 0) + 1,
      assetCode: `AST-${formData.category.substring(0, 3)}-${String(assets.length + 1).padStart(3, "0")}`,
      name: formData.name,
      category: formData.category,
      serialNumber: formData.serialNumber,
      description: formData.description,
      purchaseDate: formData.purchaseDate,
      purchaseCost: formData.purchaseCost,
      usefulLife: formData.usefulLife,
      salvageValue: formData.salvageValue,
      depreciationMethod: formData.depreciationMethod,
      currentValue,
      accumulatedDepreciation,
      monthlyDepreciation,
      status: "active",
      location: formData.location,
      department: formData.department,
      assignedTo: formData.assignedTo,
      supplier: formData.supplier,
      warrantyExpiry: formData.warrantyExpiry,
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
    };

    setAssets((prev) => [newAsset, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateAsset = () => {
    if (!validateForm() || !selectedAsset) return;

    const monthlyDepreciation = calculateMonthlyDepreciation(
      formData.purchaseCost,
      formData.salvageValue,
      formData.usefulLife,
      formData.depreciationMethod,
    );

    const purchaseDate = new Date(formData.purchaseDate);
    const monthsOwned = Math.floor(
      (new Date().getTime() - purchaseDate.getTime()) /
        (1000 * 60 * 60 * 24 * 30),
    );
    const accumulatedDepreciation = Math.min(
      monthlyDepreciation * monthsOwned,
      formData.purchaseCost - formData.salvageValue,
    );
    const currentValue = formData.purchaseCost - accumulatedDepreciation;

    const updatedAsset: Asset = {
      ...selectedAsset,
      name: formData.name,
      category: formData.category,
      serialNumber: formData.serialNumber,
      description: formData.description,
      purchaseDate: formData.purchaseDate,
      purchaseCost: formData.purchaseCost,
      usefulLife: formData.usefulLife,
      salvageValue: formData.salvageValue,
      depreciationMethod: formData.depreciationMethod,
      currentValue,
      accumulatedDepreciation,
      monthlyDepreciation,
      location: formData.location,
      department: formData.department,
      assignedTo: formData.assignedTo,
      supplier: formData.supplier,
      warrantyExpiry: formData.warrantyExpiry,
      notes: formData.notes,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setAssets((prev) =>
      prev.map((a) => (a.id === selectedAsset.id ? updatedAsset : a)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedAsset(null);
  };

  const handleDeleteAsset = () => {
    if (!selectedAsset) return;
    setAssets((prev) => prev.filter((a) => a.id !== selectedAsset.id));
    setIsDeleteDialogOpen(false);
    setSelectedAsset(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "IT_Equipment",
      serialNumber: "",
      description: "",
      purchaseDate: "",
      purchaseCost: 0,
      usefulLife: 3,
      salvageValue: 0,
      depreciationMethod: "straight_line",
      location: "",
      department: "",
      assignedTo: "",
      supplier: "",
      warrantyExpiry: "",
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Asset Code",
      "Name",
      "Category",
      "Serial Number",
      "Purchase Date",
      "Purchase Cost",
      "Current Value",
      "Depreciation",
      "Status",
      "Location",
      "Department",
    ];
    const csvData = filteredAssets.map((a) => [
      a.assetCode,
      a.name,
      categories.find((c) => c.value === a.category)?.label || a.category,
      a.serialNumber || "",
      formatDate(a.purchaseDate),
      a.purchaseCost.toString(),
      a.currentValue.toString(),
      a.accumulatedDepreciation.toString(),
      a.status,
      a.location,
      a.department,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asset-register-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setAssets([...mockAssets]);
    setCurrentPage(1);
    setSearchQuery("");
    setCategoryFilter("all");
    setDepartmentFilter("all");
    setStatusFilter("all");
  };

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
              <Package className="h-6 w-6" />
              Asset Register
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete listing of all fixed assets
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
            Add Asset
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{stats.totalAssets}</p>
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
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalValue)}
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
                <p className="text-sm text-muted-foreground">
                  Total Depreciation
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.totalDepreciation)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <TrendingDown className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Assets</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="h-5 w-5 text-green-600" />
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
                placeholder="Search by code, name, serial number..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={departmentFilter}
              onValueChange={(v) => {
                setDepartmentFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="register">Asset Register</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="register" className="space-y-4 mt-4">
          {/* Assets Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("assetCode")}
                        >
                          Asset Code
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("name")}
                        >
                          Asset Name
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Serial Number</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("purchaseCost")}
                        >
                          Purchase Cost
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("currentValue")}
                        >
                          Current Value
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No assets found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAssets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-mono text-xs font-medium">
                            {asset.assetCode}
                          </TableCell>
                          <TableCell className="font-medium">
                            {asset.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(asset.category)}
                              <span>
                                {categories.find(
                                  (c) => c.value === asset.category,
                                )?.label || asset.category}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {asset.serialNumber || "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(asset.purchaseCost)}
                          </TableCell>
                          <TableCell className="font-medium text-blue-600">
                            {formatCurrency(asset.currentValue)}
                          </TableCell>
                          <TableCell>{asset.department}</TableCell>
                          <TableCell>{getStatusBadge(asset.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewAsset(asset)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditAsset(asset)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredAssets.length > 0 && (
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
                        filteredAssets.length,
                      )}{" "}
                      of {filteredAssets.length}
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
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Value by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Asset Value by Category
                </CardTitle>
                <CardDescription>Distribution of asset values</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Depreciation Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Depreciation Summary</CardTitle>
                <CardDescription>Overall depreciation metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">
                      Depreciation Rate
                    </span>
                    <span className="text-2xl font-bold">
                      {stats.depreciationRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">
                      Total Depreciation to Date
                    </span>
                    <span className="text-xl font-bold text-orange-600">
                      {formatCurrency(stats.totalDepreciation)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">
                      Assets Under Maintenance
                    </span>
                    <span className="text-xl font-bold text-yellow-600">
                      {stats.maintenanceCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Asset Status Distribution
                </CardTitle>
                <CardDescription>Breakdown by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statuses.map((status) => {
                    const count = assets.filter(
                      (a) => a.status === status.value,
                    ).length;
                    const percentage =
                      stats.totalAssets > 0
                        ? (count / stats.totalAssets) * 100
                        : 0;
                    return (
                      <div key={status.value}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{status.label}</span>
                          <span>
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${status.color.replace("text", "bg").replace("-700", "")}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Statistics</CardTitle>
                <CardDescription>Key asset metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold">{stats.totalAssets}</p>
                    <p className="text-sm text-muted-foreground">
                      Total Assets
                    </p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold">
                      {assets.filter((a) => a.status === "active").length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Active Assets
                    </p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold">
                      {
                        assets.filter(
                          (a) =>
                            a.warrantyExpiry &&
                            new Date(a.warrantyExpiry) > new Date(),
                        ).length
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Under Warranty
                    </p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold">
                      {stats.totalValue > 0
                        ? formatCurrency(stats.totalValue / stats.totalAssets)
                        : "N/A"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Average Asset Value
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Asset Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedAsset?.name}</span>
              {selectedAsset && getStatusBadge(selectedAsset.status)}
            </DialogTitle>
            <DialogDescription>{selectedAsset?.assetCode}</DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getCategoryIcon(selectedAsset.category)}
                    <span>
                      {
                        categories.find(
                          (c) => c.value === selectedAsset.category,
                        )?.label
                      }
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Serial Number</p>
                  <p className="font-mono text-sm">
                    {selectedAsset.serialNumber || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Date</p>
                  <p>{formatDate(selectedAsset.purchaseDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchase Cost</p>
                  <p className="font-bold">
                    {formatCurrency(selectedAsset.purchaseCost)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(selectedAsset.currentValue)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Accumulated Depreciation
                  </p>
                  <p className="text-orange-600">
                    {formatCurrency(selectedAsset.accumulatedDepreciation)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Monthly Depreciation
                  </p>
                  <p>{formatCurrency(selectedAsset.monthlyDepreciation)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Depreciation Method
                  </p>
                  <p className="capitalize">
                    {selectedAsset.depreciationMethod.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>{selectedAsset.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p>{selectedAsset.department}</p>
                </div>
                {selectedAsset.assignedTo && (
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <p>{selectedAsset.assignedTo}</p>
                  </div>
                )}
                {selectedAsset.supplier && (
                  <div>
                    <p className="text-sm text-muted-foreground">Supplier</p>
                    <p>{selectedAsset.supplier}</p>
                  </div>
                )}
                {selectedAsset.warrantyExpiry && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Warranty Expiry
                    </p>
                    <p
                      className={
                        new Date(selectedAsset.warrantyExpiry) < new Date()
                          ? "text-red-600"
                          : "text-green-600"
                      }
                    >
                      {formatDate(selectedAsset.warrantyExpiry)}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm mt-1">{selectedAsset.description}</p>
              </div>

              {selectedAsset.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedAsset.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewModalOpen(false);
                handleEditAsset(selectedAsset!);
              }}
            >
              Edit Asset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Asset Modal */}
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
              {isCreateModalOpen ? "Add New Asset" : "Edit Asset"}
            </DialogTitle>
            <DialogDescription>
              Enter asset details for the register
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Asset Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1"
                  placeholder="e.g., Dell XPS Laptop"
                />
                {formErrors.name && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.name}</p>
                )}
              </div>
              <div>
                <Label>Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, category: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Serial Number</Label>
                <Input
                  value={formData.serialNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      serialNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Serial number"
                />
              </div>
              <div>
                <Label>Purchase Date *</Label>
                <Input
                  type="date"
                  value={formData.purchaseDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      purchaseDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
                {formErrors.purchaseDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.purchaseDate}
                  </p>
                )}
              </div>
              <div>
                <Label>Purchase Cost (₦) *</Label>
                <Input
                  type="number"
                  value={formData.purchaseCost || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      purchaseCost: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
                {formErrors.purchaseCost && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.purchaseCost}
                  </p>
                )}
              </div>
              <div>
                <Label>Useful Life (years) *</Label>
                <Input
                  type="number"
                  value={formData.usefulLife || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      usefulLife: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="3"
                />
                {formErrors.usefulLife && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.usefulLife}
                  </p>
                )}
              </div>
              <div>
                <Label>Salvage Value (₦)</Label>
                <Input
                  type="number"
                  value={formData.salvageValue || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      salvageValue: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Depreciation Method</Label>
                <Select
                  value={formData.depreciationMethod}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, depreciationMethod: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {depreciationMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Location *</Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="e.g., Head Office"
                />
                {formErrors.location && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.location}
                  </p>
                )}
              </div>
              <div>
                <Label>Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, department: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.department && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.department}
                  </p>
                )}
              </div>
              <div>
                <Label>Assigned To</Label>
                <Input
                  value={formData.assignedTo}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      assignedTo: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Employee name"
                />
              </div>
              <div>
                <Label>Supplier</Label>
                <Input
                  value={formData.supplier}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      supplier: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Supplier name"
                />
              </div>
              <div>
                <Label>Warranty Expiry</Label>
                <Input
                  type="date"
                  value={formData.warrantyExpiry}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      warrantyExpiry: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1"
                  rows={2}
                  placeholder="Asset description..."
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
                isCreateModalOpen ? handleCreateAsset : handleUpdateAsset
              }
            >
              {isCreateModalOpen ? "Add Asset" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Asset</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete "{selectedAsset?.name}"? This action cannot be
              undone.
              {selectedAsset && selectedAsset.currentValue > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  This asset still has a book value of{" "}
                  {formatCurrency(selectedAsset.currentValue)}.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAsset}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
