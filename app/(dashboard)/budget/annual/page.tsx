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
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  LineChart,
  Wallet,
  Target,
  Flag,
  Settings,
  Copy,
  Printer,
  Save,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  BarChart as ReBarChart,
  Bar,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

// Types
type BudgetCategory =
  | "revenue"
  | "cost_of_sales"
  | "operating_expenses"
  | "admin_expenses"
  | "marketing"
  | "rnd"
  | "capital_expenditure";

type BudgetStatus = "draft" | "pending_approval" | "approved" | "rejected";

interface BudgetItem {
  id: number;
  category: BudgetCategory;
  subcategory: string;
  accountCode: string;
  description: string;
  january: number;
  february: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  august: number;
  september: number;
  october: number;
  november: number;
  december: number;
  total: number;
  notes?: string;
}

interface AnnualBudget {
  id: number;
  year: number;
  status: BudgetStatus;
  items: BudgetItem[];
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  createdBy: string;
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

// Mock Data
const mockBudgetItems: BudgetItem[] = [
  // Revenue
  {
    id: 1,
    category: "revenue",
    subcategory: "Product Sales",
    accountCode: "4000",
    description: "Core product revenue",
    january: 12500000,
    february: 13000000,
    march: 13500000,
    april: 14000000,
    may: 14500000,
    june: 15000000,
    july: 15500000,
    august: 16000000,
    september: 16500000,
    october: 17000000,
    november: 17500000,
    december: 18000000,
    total: 183000000,
    notes: "Based on sales forecast",
  },
  {
    id: 2,
    category: "revenue",
    subcategory: "Service Revenue",
    accountCode: "4100",
    description: "Consulting and support services",
    january: 5000000,
    february: 5200000,
    march: 5400000,
    april: 5600000,
    may: 5800000,
    june: 6000000,
    july: 6200000,
    august: 6400000,
    september: 6600000,
    october: 6800000,
    november: 7000000,
    december: 7200000,
    total: 74200000,
    notes: "Growing services revenue",
  },

  // Cost of Sales
  {
    id: 3,
    category: "cost_of_sales",
    subcategory: "Raw Materials",
    accountCode: "5000",
    description: "Direct material costs",
    january: 3500000,
    february: 3600000,
    march: 3700000,
    april: 3800000,
    may: 3900000,
    june: 4000000,
    july: 4100000,
    august: 4200000,
    september: 4300000,
    october: 4400000,
    november: 4500000,
    december: 4600000,
    total: 49600000,
    notes: "40% of product revenue",
  },
  {
    id: 4,
    category: "cost_of_sales",
    subcategory: "Direct Labor",
    accountCode: "5100",
    description: "Production staff salaries",
    january: 2000000,
    february: 2000000,
    march: 2000000,
    april: 2100000,
    may: 2100000,
    june: 2100000,
    july: 2200000,
    august: 2200000,
    september: 2200000,
    october: 2300000,
    november: 2300000,
    december: 2300000,
    total: 25800000,
    notes: "Includes benefits",
  },

  // Operating Expenses
  {
    id: 5,
    category: "operating_expenses",
    subcategory: "Sales & Marketing",
    accountCode: "6000",
    description: "Marketing campaigns and advertising",
    january: 1500000,
    february: 1500000,
    march: 2000000,
    april: 1500000,
    may: 1500000,
    june: 2000000,
    july: 1500000,
    august: 1500000,
    september: 2000000,
    october: 2500000,
    november: 2000000,
    december: 2000000,
    total: 21500000,
    notes: "Seasonal campaigns",
  },
  {
    id: 6,
    category: "operating_expenses",
    subcategory: "Rent & Utilities",
    accountCode: "6100",
    description: "Office rent, electricity, water",
    january: 1200000,
    february: 1200000,
    march: 1200000,
    april: 1200000,
    may: 1200000,
    june: 1200000,
    july: 1200000,
    august: 1200000,
    september: 1200000,
    october: 1200000,
    november: 1200000,
    december: 1200000,
    total: 14400000,
    notes: "Fixed costs",
  },
  {
    id: 7,
    category: "operating_expenses",
    subcategory: "Salaries & Wages",
    accountCode: "6200",
    description: "Staff salaries and benefits",
    january: 3000000,
    february: 3000000,
    march: 3000000,
    april: 3100000,
    may: 3100000,
    june: 3100000,
    july: 3200000,
    august: 3200000,
    september: 3200000,
    october: 3300000,
    november: 3300000,
    december: 3300000,
    total: 37800000,
    notes: "Annual increments in April",
  },
  {
    id: 8,
    category: "operating_expenses",
    subcategory: "IT & Software",
    accountCode: "6300",
    description: "Software licenses, IT support",
    january: 500000,
    february: 500000,
    march: 500000,
    april: 500000,
    may: 500000,
    june: 500000,
    july: 500000,
    august: 500000,
    september: 500000,
    october: 500000,
    november: 500000,
    december: 500000,
    total: 6000000,
    notes: "Monthly subscriptions",
  },

  // Admin Expenses
  {
    id: 9,
    category: "admin_expenses",
    subcategory: "Professional Fees",
    accountCode: "7000",
    description: "Legal, accounting, consulting",
    january: 300000,
    february: 300000,
    march: 300000,
    april: 300000,
    may: 300000,
    june: 300000,
    july: 300000,
    august: 300000,
    september: 300000,
    october: 300000,
    november: 300000,
    december: 300000,
    total: 3600000,
    notes: "Retainers",
  },
  {
    id: 10,
    category: "admin_expenses",
    subcategory: "Insurance",
    accountCode: "7100",
    description: "Business insurance premiums",
    january: 200000,
    february: 200000,
    march: 200000,
    april: 200000,
    may: 200000,
    june: 200000,
    july: 200000,
    august: 200000,
    september: 200000,
    october: 200000,
    november: 200000,
    december: 200000,
    total: 2400000,
    notes: "Annual policy",
  },

  // R&D
  {
    id: 11,
    category: "rnd",
    subcategory: "Product Development",
    accountCode: "8000",
    description: "New product R&D",
    january: 500000,
    february: 500000,
    march: 500000,
    april: 500000,
    may: 500000,
    june: 500000,
    july: 500000,
    august: 500000,
    september: 500000,
    october: 500000,
    november: 500000,
    december: 500000,
    total: 6000000,
    notes: "Ongoing development",
  },

  // Capital Expenditure
  {
    id: 12,
    category: "capital_expenditure",
    subcategory: "Equipment",
    accountCode: "9000",
    description: "New computers and servers",
    january: 0,
    february: 0,
    march: 2000000,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 1500000,
    october: 0,
    november: 0,
    december: 0,
    total: 3500000,
    notes: "Planned upgrades",
  },
];

const categories = [
  { value: "revenue", label: "Revenue", color: "bg-green-100 text-green-700" },
  {
    value: "cost_of_sales",
    label: "Cost of Sales",
    color: "bg-red-100 text-red-700",
  },
  {
    value: "operating_expenses",
    label: "Operating Expenses",
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "admin_expenses",
    label: "Admin Expenses",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "marketing",
    label: "Marketing",
    color: "bg-pink-100 text-pink-700",
  },
  { value: "rnd", label: "R&D", color: "bg-indigo-100 text-indigo-700" },
  {
    value: "capital_expenditure",
    label: "Capital Expenditure",
    color: "bg-blue-100 text-blue-700",
  },
];

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const monthLabels = [
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

// Helper functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatNumber = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getCategoryBadge = (category: BudgetCategory) => {
  const config = categories.find((c) => c.value === category);
  return <Badge className={config?.color}>{config?.label}</Badge>;
};

export default function AnnualBudget() {
  const router = useRouter();

  // State
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(mockBudgetItems);
  const [year, setYear] = useState(2026);
  const [status, setStatus] = useState<BudgetStatus>("approved");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "summary" | "details" | "analysis"
  >("summary");

  // Form state
  const [formData, setFormData] = useState({
    category: "revenue" as BudgetCategory,
    subcategory: "",
    accountCode: "",
    description: "",
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Calculate totals by category
  const totals = useMemo(() => {
    const revenue = budgetItems
      .filter((i) => i.category === "revenue")
      .reduce((sum, i) => sum + i.total, 0);
    const costOfSales = budgetItems
      .filter((i) => i.category === "cost_of_sales")
      .reduce((sum, i) => sum + i.total, 0);
    const operatingExpenses = budgetItems
      .filter((i) => i.category === "operating_expenses")
      .reduce((sum, i) => sum + i.total, 0);
    const adminExpenses = budgetItems
      .filter((i) => i.category === "admin_expenses")
      .reduce((sum, i) => sum + i.total, 0);
    const marketing = budgetItems
      .filter((i) => i.category === "marketing")
      .reduce((sum, i) => sum + i.total, 0);
    const rnd = budgetItems
      .filter((i) => i.category === "rnd")
      .reduce((sum, i) => sum + i.total, 0);
    const capex = budgetItems
      .filter((i) => i.category === "capital_expenditure")
      .reduce((sum, i) => sum + i.total, 0);

    const grossProfit = revenue - costOfSales;
    const totalExpenses = operatingExpenses + adminExpenses + marketing + rnd;
    const operatingProfit = grossProfit - totalExpenses;
    const netProfit = operatingProfit - capex;

    // Monthly totals
    const monthlyTotals = months.map((month, index) => ({
      month: monthLabels[index],
      revenue: budgetItems
        .filter((i) => i.category === "revenue")
        .reduce((sum, i) => sum + (i[month as keyof BudgetItem] as number), 0),
      expenses: budgetItems
        .filter(
          (i) =>
            i.category !== "revenue" && i.category !== "capital_expenditure",
        )
        .reduce((sum, i) => sum + (i[month as keyof BudgetItem] as number), 0),
      profit:
        budgetItems
          .filter((i) => i.category === "revenue")
          .reduce(
            (sum, i) => sum + (i[month as keyof BudgetItem] as number),
            0,
          ) -
        budgetItems
          .filter(
            (i) =>
              i.category !== "revenue" && i.category !== "capital_expenditure",
          )
          .reduce(
            (sum, i) => sum + (i[month as keyof BudgetItem] as number),
            0,
          ),
    }));

    return {
      revenue,
      costOfSales,
      grossProfit,
      operatingExpenses,
      adminExpenses,
      marketing,
      rnd,
      totalExpenses,
      operatingProfit,
      capex,
      netProfit,
      monthlyTotals,
      profitMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
    };
  }, [budgetItems]);

  // Category breakdown for charts
  const categoryChartData = useMemo(() => {
    return [
      { name: "Revenue", value: totals.revenue, color: "#10B981" },
      { name: "Cost of Sales", value: totals.costOfSales, color: "#EF4444" },
      {
        name: "Operating Expenses",
        value: totals.operatingExpenses,
        color: "#F59E0B",
      },
      { name: "Admin Expenses", value: totals.adminExpenses, color: "#8B5CF6" },
      { name: "R&D", value: totals.rnd, color: "#6366F1" },
      { name: "Capex", value: totals.capex, color: "#3B82F6" },
    ];
  }, [totals]);

  // Filter budget items
  const filteredItems = useMemo(() => {
    let result = [...budgetItems];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.subcategory.toLowerCase().includes(query) ||
          i.description.toLowerCase().includes(query) ||
          i.accountCode.toLowerCase().includes(query),
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter((i) => i.category === categoryFilter);
    }

    return result;
  }, [budgetItems, searchQuery, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleViewItem = (item: BudgetItem) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const handleEditItem = (item: BudgetItem) => {
    setSelectedItem(item);
    setFormData({
      category: item.category,
      subcategory: item.subcategory,
      accountCode: item.accountCode,
      description: item.description,
      january: item.january,
      february: item.february,
      march: item.march,
      april: item.april,
      may: item.may,
      june: item.june,
      july: item.july,
      august: item.august,
      september: item.september,
      october: item.october,
      november: item.november,
      december: item.december,
      notes: item.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.subcategory) errors.subcategory = "Subcategory is required";
    if (!formData.accountCode) errors.accountCode = "Account code is required";
    if (!formData.description) errors.description = "Description is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateItem = () => {
    if (!validateForm()) return;

    const total = months.reduce(
      (sum, month) =>
        sum + (formData[month as keyof typeof formData] as number),
      0,
    );

    const newItem: BudgetItem = {
      id: Math.max(...budgetItems.map((i) => i.id), 0) + 1,
      category: formData.category,
      subcategory: formData.subcategory,
      accountCode: formData.accountCode,
      description: formData.description,
      january: formData.january,
      february: formData.february,
      march: formData.march,
      april: formData.april,
      may: formData.may,
      june: formData.june,
      july: formData.july,
      august: formData.august,
      september: formData.september,
      october: formData.october,
      november: formData.november,
      december: formData.december,
      total,
      notes: formData.notes,
    };

    setBudgetItems((prev) => [...prev, newItem]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateItem = () => {
    if (!validateForm() || !selectedItem) return;

    const total = months.reduce(
      (sum, month) =>
        sum + (formData[month as keyof typeof formData] as number),
      0,
    );

    const updatedItem: BudgetItem = {
      ...selectedItem,
      category: formData.category,
      subcategory: formData.subcategory,
      accountCode: formData.accountCode,
      description: formData.description,
      january: formData.january,
      february: formData.february,
      march: formData.march,
      april: formData.april,
      may: formData.may,
      june: formData.june,
      july: formData.july,
      august: formData.august,
      september: formData.september,
      october: formData.october,
      november: formData.november,
      december: formData.december,
      total,
      notes: formData.notes,
    };

    setBudgetItems((prev) =>
      prev.map((i) => (i.id === selectedItem.id ? updatedItem : i)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;
    setBudgetItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const resetForm = () => {
    setFormData({
      category: "revenue",
      subcategory: "",
      accountCode: "",
      description: "",
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Category",
      "Subcategory",
      "Account Code",
      "Description",
      ...monthLabels,
      "Total",
    ];
    const csvData = filteredItems.map((i) => [
      categories.find((c) => c.value === i.category)?.label || i.category,
      i.subcategory,
      i.accountCode,
      i.description,
      ...months.map((m) => (i[m as keyof BudgetItem] ?? 0).toString()),
      i.total.toString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `annual-budget-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setBudgetItems([...mockBudgetItems]);
    setSearchQuery("");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  const COLORS = [
    "#10B981",
    "#EF4444",
    "#F59E0B",
    "#8B5CF6",
    "#6366F1",
    "#3B82F6",
  ];

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
              <Target className="h-6 w-6" />
              Annual Budget {year}
            </h1>
            <p className="text-muted-foreground mt-1">
              Financial plan and budget allocation for the year
            </p>
          </div>
        </div>
        <div className="flex gap-2 print:hidden">
          <div className="flex items-center gap-2">
            <Select
              value={year.toString()}
              onValueChange={(v) => setYear(parseInt(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </Select>
            <Badge
              className={
                status === "approved"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            >
              {status === "approved" ? "Approved" : "Draft"}
            </Badge>
          </div>
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
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totals.revenue)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totals.totalExpenses + totals.costOfSales)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Profit</p>
                <p
                  className={`text-2xl font-bold ${totals.netProfit >= 0 ? "text-blue-600" : "text-red-600"}`}
                >
                  {formatCurrency(Math.abs(totals.netProfit))}
                  {totals.netProfit < 0 && " (Loss)"}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totals.profitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <PieChart className="h-5 w-5 text-purple-600" />
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
                placeholder="Search by subcategory, description..."
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
          <TabsTrigger value="details">Budget Details</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-4 mt-4">
          {/* Monthly Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Monthly Revenue vs Expenses
              </CardTitle>
              <CardDescription>Comparison throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ReBarChart data={totals.monthlyTotals}>
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
                  <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                  <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                </ReBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Budget Category Breakdown
                </CardTitle>
                <CardDescription>Distribution by category</CardDescription>
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
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatCurrency(value as number)}
                    />
                  </RePieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Profit Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profit Analysis</CardTitle>
                <CardDescription>Key financial metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Gross Profit</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(totals.grossProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">
                      Operating Profit
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(totals.operatingProfit)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Net Profit</span>
                    <span
                      className={`text-xl font-bold ${totals.netProfit >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(Math.abs(totals.netProfit))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Profit Margin</span>
                    <span className="text-xl font-bold text-purple-600">
                      {totals.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Summary</CardTitle>
              <CardDescription>Budget totals by category</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Budget Amount</TableHead>
                    <TableHead className="text-right">% of Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Revenue</TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatCurrency(totals.revenue)}
                    </TableCell>
                    <TableCell className="text-right">100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Cost of Sales</TableCell>
                    <TableCell className="text-right text-red-600">
                      {formatCurrency(totals.costOfSales)}
                    </TableCell>
                    <TableCell className="text-right">
                      {((totals.costOfSales / totals.revenue) * 100).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="font-medium">Gross Profit</TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatCurrency(totals.grossProfit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {((totals.grossProfit / totals.revenue) * 100).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium pl-4">
                      Operating Expenses
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totals.operatingExpenses)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (totals.operatingExpenses / totals.revenue) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium pl-4">
                      Admin Expenses
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totals.adminExpenses)}
                    </TableCell>
                    <TableCell className="text-right">
                      {((totals.adminExpenses / totals.revenue) * 100).toFixed(
                        1,
                      )}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium pl-4">
                      Marketing
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totals.marketing)}
                    </TableCell>
                    <TableCell className="text-right">
                      {((totals.marketing / totals.revenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium pl-4">R&D</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totals.rnd)}
                    </TableCell>
                    <TableCell className="text-right">
                      {((totals.rnd / totals.revenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t">
                    <TableCell className="font-medium">
                      Operating Profit
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-600">
                      {formatCurrency(totals.operatingProfit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (totals.operatingProfit / totals.revenue) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      Capital Expenditure
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(totals.capex)}
                    </TableCell>
                    <TableCell className="text-right">
                      {((totals.capex / totals.revenue) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-t-2">
                    <TableCell className="font-bold">Net Profit</TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatCurrency(totals.netProfit)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {totals.profitMargin.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Subcategory</TableHead>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Description</TableHead>
                      {monthLabels.map((month) => (
                        <TableHead key={month} className="text-right">
                          {month}
                        </TableHead>
                      ))}
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={16} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Target className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No budget items found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            {getCategoryBadge(item.category)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.subcategory}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.accountCode}
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {item.description}
                          </TableCell>
                          {months.map((month) => (
                            <TableCell key={month} className="text-right">
                              {formatCurrency(
                                item[month as keyof BudgetItem] as number,
                              )}
                            </TableCell>
                          ))}
                          <TableCell className="text-right font-bold">
                            {formatCurrency(item.total)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewItem(item)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditItem(item)}
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
              {filteredItems.length > 0 && (
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
                        filteredItems.length,
                      )}{" "}
                      of {filteredItems.length}
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

        <TabsContent value="analysis" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Profit Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Profit Trend</CardTitle>
                <CardDescription>Profit/Loss by month</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={totals.monthlyTotals}>
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
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.3}
                      name="Profit"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Expense Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expense Analysis</CardTitle>
                <CardDescription>
                  Breakdown of expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Operating Expenses</span>
                      <span className="font-medium">
                        {formatCurrency(totals.operatingExpenses)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${(totals.operatingExpenses / totals.totalExpenses) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Admin Expenses</span>
                      <span className="font-medium">
                        {formatCurrency(totals.adminExpenses)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${(totals.adminExpenses / totals.totalExpenses) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Marketing</span>
                      <span className="font-medium">
                        {formatCurrency(totals.marketing)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full"
                        style={{
                          width: `${(totals.marketing / totals.totalExpenses) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>R&D</span>
                      <span className="font-medium">
                        {formatCurrency(totals.rnd)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{
                          width: `${(totals.rnd / totals.totalExpenses) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Ratios */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Financial Ratios</CardTitle>
                <CardDescription>Performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Gross Margin</span>
                    <span className="text-xl font-bold">
                      {((totals.grossProfit / totals.revenue) * 100).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">
                      Operating Margin
                    </span>
                    <span className="text-xl font-bold">
                      {(
                        (totals.operatingProfit / totals.revenue) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Expense Ratio</span>
                    <span className="text-xl font-bold">
                      {((totals.totalExpenses / totals.revenue) * 100).toFixed(
                        1,
                      )}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <span className="text-muted-foreground">Capex Ratio</span>
                    <span className="text-xl font-bold">
                      {((totals.capex / totals.revenue) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quarterly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quarterly Summary</CardTitle>
                <CardDescription>Performance by quarter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((quarter) => {
                    const quarterMonths = months.slice(
                      quarter * 3,
                      (quarter + 1) * 3,
                    );
                    const quarterRevenue = budgetItems
                      .filter((i) => i.category === "revenue")
                      .reduce(
                        (sum, i) =>
                          sum +
                          quarterMonths.reduce(
                            (s, m) => s + (i[m as keyof BudgetItem] as number),
                            0,
                          ),
                        0,
                      );
                    const quarterExpenses = budgetItems
                      .filter((i) => i.category !== "revenue")
                      .reduce(
                        (sum, i) =>
                          sum +
                          quarterMonths.reduce(
                            (s, m) => s + (i[m as keyof BudgetItem] as number),
                            0,
                          ),
                        0,
                      );
                    const quarterProfit = quarterRevenue - quarterExpenses;

                    return (
                      <div
                        key={quarter}
                        className="p-3 border rounded-lg text-center"
                      >
                        <p className="text-sm font-semibold">Q{quarter + 1}</p>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(quarterRevenue)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Profit
                        </p>
                        <p
                          className={`text-sm font-medium ${quarterProfit >= 0 ? "text-blue-600" : "text-red-600"}`}
                        >
                          {formatCurrency(Math.abs(quarterProfit))}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Item Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Budget Item Details</DialogTitle>
            <DialogDescription>{selectedItem?.subcategory}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  {getCategoryBadge(selectedItem.category)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Code</p>
                  <p className="font-mono">{selectedItem.accountCode}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedItem.description}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Monthly Breakdown</h3>
                <div className="grid grid-cols-3 gap-3">
                  {months.map((month, index) => (
                    <div
                      key={month}
                      className="flex justify-between p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{monthLabels[index]}</span>
                      <span className="font-medium">
                        {formatCurrency(
                          selectedItem[month as keyof BudgetItem] as number,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between font-bold">
                  <span>Total Annual</span>
                  <span>{formatCurrency(selectedItem.total)}</span>
                </div>
              </div>
              {selectedItem.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedItem.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Item Modal */}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen ? "Add Budget Item" : "Edit Budget Item"}
            </DialogTitle>
            <DialogDescription>Enter budget item details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label>Subcategory *</Label>
                <Input
                  value={formData.subcategory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subcategory: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="e.g., Product Sales"
                />
                {formErrors.subcategory && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.subcategory}
                  </p>
                )}
              </div>
              <div>
                <Label>Account Code *</Label>
                <Input
                  value={formData.accountCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountCode: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="e.g., 4000"
                />
                {formErrors.accountCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.accountCode}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Description *</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Brief description"
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.description}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Monthly Budget (₦)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {months.map((month, index) => (
                  <div key={month}>
                    <Label>{monthLabels[index]}</Label>
                    <Input
                      type="number"
                      value={
                        (formData[month as keyof typeof formData] as number) ||
                        ""
                      }
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [month]: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="mt-1"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Notes (Optional)</Label>
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
              onClick={isCreateModalOpen ? handleCreateItem : handleUpdateItem}
            >
              {isCreateModalOpen ? "Add Item" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
