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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  Calendar,
  Filter,
  TrendingDown,
  DollarSign,
  Building2,
  Eye,
  BarChart3,
  PieChart,
  LineChart,
  Package,
  Laptop,
  Car,
  Home,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Wrench,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
} from "recharts";

// Types
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

interface DepreciableAsset {
  id: number;
  assetCode: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  purchaseCost: number;
  salvageValue: number;
  usefulLife: number;
  depreciationMethod: DepreciationMethod;
  accumulatedDepreciation: number;
  currentBookValue: number;
  monthlyDepreciation: number;
  status: "active" | "fully_depreciated" | "disposed";
  department: string;
  location: string;
}

interface DepreciationEntry {
  period: string;
  depreciationAmount: number;
  accumulatedDepreciation: number;
  bookValue: number;
}

// Mock Assets Data
const mockAssets: DepreciableAsset[] = [
  {
    id: 1,
    assetCode: "AST-IT-001",
    name: "Dell XPS Laptop",
    category: "IT_Equipment",
    purchaseDate: "2024-01-15",
    purchaseCost: 1500000,
    salvageValue: 150000,
    usefulLife: 3,
    depreciationMethod: "straight_line",
    accumulatedDepreciation: 416667,
    currentBookValue: 1083333,
    monthlyDepreciation: 41667,
    status: "active",
    department: "Engineering",
    location: "Engineering Dept",
  },
  {
    id: 2,
    assetCode: "AST-IT-002",
    name: "MacBook Pro 16",
    category: "IT_Equipment",
    purchaseDate: "2024-02-10",
    purchaseCost: 2800000,
    salvageValue: 280000,
    usefulLife: 4,
    depreciationMethod: "straight_line",
    accumulatedDepreciation: 525000,
    currentBookValue: 2275000,
    monthlyDepreciation: 52500,
    status: "active",
    department: "Design",
    location: "Design Dept",
  },
  {
    id: 3,
    assetCode: "AST-VEH-001",
    name: "Toyota Camry",
    category: "Vehicles",
    purchaseDate: "2023-06-01",
    purchaseCost: 35000000,
    salvageValue: 5000000,
    usefulLife: 5,
    depreciationMethod: "declining_balance",
    accumulatedDepreciation: 12000000,
    currentBookValue: 23000000,
    monthlyDepreciation: 200000,
    status: "active",
    department: "Sales",
    location: "Sales Dept",
  },
  {
    id: 4,
    assetCode: "AST-FURN-001",
    name: "Office Desks (Set of 20)",
    category: "Office_Furniture",
    purchaseDate: "2023-01-10",
    purchaseCost: 5000000,
    salvageValue: 500000,
    usefulLife: 7,
    depreciationMethod: "straight_line",
    accumulatedDepreciation: 2035714,
    currentBookValue: 2964286,
    monthlyDepreciation: 53571,
    status: "active",
    department: "Operations",
    location: "Head Office",
  },
  {
    id: 5,
    assetCode: "AST-IT-003",
    name: "Server Rack",
    category: "IT_Equipment",
    purchaseDate: "2022-09-15",
    purchaseCost: 12000000,
    salvageValue: 1000000,
    usefulLife: 5,
    depreciationMethod: "double_declining",
    accumulatedDepreciation: 7200000,
    currentBookValue: 4800000,
    monthlyDepreciation: 120000,
    status: "active",
    department: "IT",
    location: "Data Center",
  },
  {
    id: 6,
    assetCode: "AST-IT-004",
    name: "NanoStation M5",
    category: "IT_Equipment",
    purchaseDate: "2021-03-20",
    purchaseCost: 250000,
    salvageValue: 25000,
    usefulLife: 3,
    depreciationMethod: "straight_line",
    accumulatedDepreciation: 225000,
    currentBookValue: 25000,
    monthlyDepreciation: 6250,
    status: "fully_depreciated",
    department: "IT",
    location: "Network Room",
  },
  {
    id: 7,
    assetCode: "AST-AC-001",
    name: "Air Conditioning Units (10)",
    category: "Other",
    purchaseDate: "2023-11-05",
    purchaseCost: 8000000,
    salvageValue: 800000,
    usefulLife: 8,
    depreciationMethod: "straight_line",
    accumulatedDepreciation: 600000,
    currentBookValue: 7400000,
    monthlyDepreciation: 75000,
    status: "active",
    department: "Facilities",
    location: "Head Office",
  },
  {
    id: 8,
    assetCode: "AST-SW-001",
    name: "Microsoft Licenses (50 seats)",
    category: "Software",
    purchaseDate: "2024-01-01",
    purchaseCost: 3000000,
    salvageValue: 0,
    usefulLife: 2,
    depreciationMethod: "straight_line",
    accumulatedDepreciation: 1250000,
    currentBookValue: 1750000,
    monthlyDepreciation: 125000,
    status: "active",
    department: "IT",
    location: "Cloud",
  },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "IT_Equipment", label: "IT Equipment", icon: Laptop },
  { value: "Office_Furniture", label: "Office Furniture", icon: Package },
  { value: "Vehicles", label: "Vehicles", icon: Car },
  { value: "Machinery", label: "Machinery", icon: Wrench },
  { value: "Building", label: "Building", icon: Home },
  { value: "Software", label: "Software", icon: Package },
  { value: "Other", label: "Other", icon: Package },
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
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getCategoryIcon = (category: AssetCategory) => {
  const config = categories.find((c) => c.value === category);
  if (config?.icon) {
    const Icon = config.icon;
    return <Icon className="h-4 w-4" />;
  }
  return <Package className="h-4 w-4" />;
};

const getMethodLabel = (method: DepreciationMethod) => {
  return depreciationMethods.find((m) => m.value === method)?.label || method;
};

// Generate depreciation schedule for an asset
const generateDepreciationSchedule = (
  asset: DepreciableAsset,
): DepreciationEntry[] => {
  const schedule: DepreciationEntry[] = [];
  const purchaseDate = new Date(asset.purchaseDate);
  const currentDate = new Date();
  const yearsToShow = Math.min(asset.usefulLife, 5);

  let currentValue = asset.purchaseCost;
  let accumulatedDep = 0;

  for (let year = 1; year <= yearsToShow; year++) {
    let yearlyDepreciation = 0;

    switch (asset.depreciationMethod) {
      case "straight_line":
        yearlyDepreciation =
          (asset.purchaseCost - asset.salvageValue) / asset.usefulLife;
        break;
      case "declining_balance":
        const rate = 1 / asset.usefulLife;
        yearlyDepreciation = currentValue * rate;
        break;
      case "double_declining":
        const dblRate = 2 / asset.usefulLife;
        yearlyDepreciation = currentValue * dblRate;
        break;
    }

    // Ensure we don't depreciate below salvage value
    const maxDepreciation = currentValue - asset.salvageValue;
    yearlyDepreciation = Math.min(yearlyDepreciation, maxDepreciation);

    accumulatedDep += yearlyDepreciation;
    currentValue -= yearlyDepreciation;

    const yearDate = new Date(purchaseDate);
    yearDate.setFullYear(purchaseDate.getFullYear() + year);

    schedule.push({
      period: `${yearDate.getFullYear()}-Q${Math.ceil((yearDate.getMonth() + 1) / 3)}`,
      depreciationAmount: yearlyDepreciation,
      accumulatedDepreciation: accumulatedDep,
      bookValue: Math.max(currentValue, asset.salvageValue),
    });

    if (currentValue <= asset.salvageValue) break;
  }

  return schedule;
};

export default function AssetsDepreciation() {
  const router = useRouter();

  // State
  const [assets] = useState<DepreciableAsset[]>(mockAssets);
  const [selectedAsset, setSelectedAsset] = useState<DepreciableAsset | null>(
    null,
  );
  const [depreciationSchedule, setDepreciationSchedule] = useState<
    DepreciationEntry[]
  >([]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState<
    "summary" | "schedule" | "forecast"
  >("summary");

  // Filtered assets
  const filteredAssets = useMemo(() => {
    let result = [...assets];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.assetCode.toLowerCase().includes(query) ||
          a.name.toLowerCase().includes(query) ||
          a.department.toLowerCase().includes(query),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((a) => a.category === categoryFilter);
    }

    if (methodFilter !== "all") {
      result = result.filter((a) => a.depreciationMethod === methodFilter);
    }

    return result;
  }, [assets, searchQuery, categoryFilter, methodFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Statistics
  const stats = useMemo(() => {
    const totalAssets = assets.length;
    const totalCost = assets.reduce((sum, a) => sum + a.purchaseCost, 0);
    const totalCurrentValue = assets.reduce(
      (sum, a) => sum + a.currentBookValue,
      0,
    );
    const totalDepreciation = assets.reduce(
      (sum, a) => sum + a.accumulatedDepreciation,
      0,
    );
    const monthlyDepreciation = assets.reduce(
      (sum, a) => sum + a.monthlyDepreciation,
      0,
    );
    const activeCount = assets.filter((a) => a.status === "active").length;
    const fullyDepreciatedCount = assets.filter(
      (a) => a.status === "fully_depreciated",
    ).length;

    const categoryData: Record<string, number> = {};
    assets.forEach((asset) => {
      const categoryLabel =
        categories.find((c) => c.value === asset.category)?.label ||
        asset.category;
      categoryData[categoryLabel] =
        (categoryData[categoryLabel] || 0) + asset.currentBookValue;
    });

    return {
      totalAssets,
      totalCost,
      totalCurrentValue,
      totalDepreciation,
      monthlyDepreciation,
      annualDepreciation: monthlyDepreciation * 12,
      activeCount,
      fullyDepreciatedCount,
      depreciationRate:
        totalCost > 0 ? (totalDepreciation / totalCost) * 100 : 0,
      categoryData,
    };
  }, [assets]);

  // Chart data
  const categoryChartData = useMemo(() => {
    return Object.entries(stats.categoryData).map(([name, value]) => ({
      name,
      value,
    }));
  }, [stats.categoryData]);

  const monthlyTrendData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month, index) => ({
      month,
      depreciation: stats.monthlyDepreciation,
      cumulative: stats.monthlyDepreciation * (index + 1),
    }));
  }, [stats.monthlyDepreciation]);

  const forecastData = useMemo(() => {
    const data = [];
    let cumulativeDep = stats.totalDepreciation;
    let currentValue = stats.totalCurrentValue;

    for (let year = 1; year <= 5; year++) {
      const yearlyDep = stats.annualDepreciation * (1 - (year - 1) * 0.1);
      cumulativeDep += yearlyDep;
      currentValue -= yearlyDep;

      data.push({
        year: `Year ${year}`,
        depreciation: yearlyDep,
        cumulative: cumulativeDep,
        bookValue: Math.max(currentValue, 0),
      });
    }
    return data;
  }, [stats]);

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

  // Handlers
  const handleViewSchedule = (asset: DepreciableAsset) => {
    setSelectedAsset(asset);
    const schedule = generateDepreciationSchedule(asset);
    setDepreciationSchedule(schedule);
    setIsScheduleModalOpen(true);
  };

  const handleExport = () => {
    const headers = [
      "Asset Code",
      "Asset Name",
      "Category",
      "Purchase Date",
      "Purchase Cost",
      "Current Value",
      "Monthly Depreciation",
      "Accumulated Depreciation",
      "Method",
      "Status",
    ];
    const csvData = filteredAssets.map((a) => [
      a.assetCode,
      a.name,
      categories.find((c) => c.value === a.category)?.label || a.category,
      formatDate(a.purchaseDate),
      a.purchaseCost.toString(),
      a.currentBookValue.toString(),
      a.monthlyDepreciation.toString(),
      a.accumulatedDepreciation.toString(),
      getMethodLabel(a.depreciationMethod),
      a.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `depreciation-schedule-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setMethodFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <TrendingDown className="h-6 w-6" />
              Depreciation Schedule
            </h1>
            <p className="text-muted-foreground mt-1">
              Track asset depreciation and forecast future values
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
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
                <p className="text-sm text-muted-foreground">
                  Total Current Value
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalCurrentValue)}
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
                  Monthly Depreciation
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.monthlyDepreciation)}
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
                <p className="text-sm text-muted-foreground">
                  Depreciation Rate
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.depreciationRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <BarChart3 className="h-5 w-5 text-purple-600" />
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
                placeholder="Search by asset code, name, department..."
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
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
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
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {depreciationMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
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
        <TabsList className="grid w-full grid-cols-3 print:hidden">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="schedule">Depreciation Schedule</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          {/* Assets Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset Code</TableHead>
                      <TableHead>Asset Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Purchase Date</TableHead>
                      <TableHead className="text-right">
                        Purchase Cost
                      </TableHead>
                      <TableHead className="text-right">
                        Current Value
                      </TableHead>
                      <TableHead className="text-right">Monthly Dep.</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAssets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={10} className="text-center py-12">
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
                          <TableCell className="font-mono text-xs">
                            {asset.assetCode}
                          </TableCell>
                          <TableCell className="font-medium">
                            {asset.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(asset.category)}
                              <span>
                                {
                                  categories.find(
                                    (c) => c.value === asset.category,
                                  )?.label
                                }
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(asset.purchaseDate)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(asset.purchaseCost)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-blue-600">
                            {formatCurrency(asset.currentBookValue)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(asset.monthlyDepreciation)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {getMethodLabel(asset.depreciationMethod)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                asset.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }
                            >
                              {asset.status === "active"
                                ? "Active"
                                : "Fully Depreciated"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewSchedule(asset)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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

        <TabsContent value="schedule" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Asset Value by Category
                </CardTitle>
                <CardDescription>
                  Current book value distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RePieChart>
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
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Depreciation Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Monthly Depreciation Trend
                </CardTitle>
                <CardDescription>
                  Estimated monthly depreciation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value) =>
                        `${(value / 1000000).toFixed(0)}M`
                      }
                    />
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="depreciation"
                      stackId="1"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.3}
                      name="Monthly Depreciation"
                    />
                    <Area
                      type="monotone"
                      dataKey="cumulative"
                      stackId="2"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      name="Cumulative"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Depreciation Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Depreciation Summary</CardTitle>
                <CardDescription>Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">
                      Annual Depreciation
                    </span>
                    <span className="text-xl font-bold">
                      {formatCurrency(stats.annualDepreciation)}
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
                    <span className="text-muted-foreground">Active Assets</span>
                    <span className="text-xl font-bold text-green-600">
                      {stats.activeCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span className="text-muted-foreground">
                      Fully Depreciated
                    </span>
                    <span className="text-xl font-bold text-gray-600">
                      {stats.fullyDepreciatedCount}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Depreciation Methods Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Depreciation Methods</CardTitle>
                <CardDescription>Usage by method type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {depreciationMethods.map((method) => {
                    const count = assets.filter(
                      (a) => a.depreciationMethod === method.value,
                    ).length;
                    const percentage =
                      stats.totalAssets > 0
                        ? (count / stats.totalAssets) * 100
                        : 0;
                    return (
                      <div key={method.value}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{method.label}</span>
                          <span>
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-blue-600"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                5-Year Depreciation Forecast
              </CardTitle>
              <CardDescription>
                Projected depreciation and book values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ReLineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="depreciation"
                    stroke="#F59E0B"
                    name="Annual Depreciation"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#3B82F6"
                    name="Cumulative Depreciation"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookValue"
                    stroke="#10B981"
                    name="Remaining Book Value"
                    strokeWidth={2}
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Forecast Details</CardTitle>
              <CardDescription>Year-by-year breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">
                        Annual Depreciation
                      </TableHead>
                      <TableHead className="text-right">
                        Cumulative Depreciation
                      </TableHead>
                      <TableHead className="text-right">
                        Estimated Book Value
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecastData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {data.year}
                        </TableCell>
                        <TableCell className="text-right text-orange-600">
                          {formatCurrency(data.depreciation)}
                        </TableCell>
                        <TableCell className="text-right text-blue-600">
                          {formatCurrency(data.cumulative)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(data.bookValue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Depreciation Schedule Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Depreciation Schedule: {selectedAsset?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedAsset?.assetCode} -{" "}
              {getMethodLabel(
                selectedAsset?.depreciationMethod || "straight_line",
              )}{" "}
              Method
            </DialogDescription>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Purchase Cost</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedAsset.purchaseCost)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Salvage Value</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedAsset.salvageValue)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Current Value</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(selectedAsset.currentBookValue)}
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Monthly Dep.</p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedAsset.monthlyDepreciation)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Depreciation Projection</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">
                          Depreciation
                        </TableHead>
                        <TableHead className="text-right">
                          Accumulated
                        </TableHead>
                        <TableHead className="text-right">Book Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {depreciationSchedule.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.period}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(entry.depreciationAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(entry.accumulatedDepreciation)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-blue-600">
                            {formatCurrency(entry.bookValue)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
