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
import { Switch } from "@/src/components/ui/switch";
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
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
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
  Euro,
  PoundSterling,
  Landmark,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Globe,
  Save,
  Send,
  Printer,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type CurrencyStatus = "active" | "inactive";
type ExchangeRateType = "buying" | "selling" | "mid";

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  flag: string;
  isBase: boolean;
  status: CurrencyStatus;
  exchangeRates: ExchangeRate[];
  decimalPlaces: number;
  thousandSeparator: string;
  decimalSeparator: string;
  createdAt: string;
  updatedAt: string;
}

interface ExchangeRate {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  type: ExchangeRateType;
  effectiveDate: string;
  isAutomatic: boolean;
  notes?: string;
}

// Mock Data
const mockCurrencies: Currency[] = [
  {
    id: 1,
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    flag: "🇳🇬",
    isBase: true,
    status: "active",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    exchangeRates: [],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    isBase: false,
    status: "active",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    exchangeRates: [
      {
        id: 1,
        fromCurrency: "USD",
        toCurrency: "NGN",
        rate: 1450,
        type: "buying",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
      {
        id: 2,
        fromCurrency: "USD",
        toCurrency: "NGN",
        rate: 1460,
        type: "selling",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
      {
        id: 3,
        fromCurrency: "USD",
        toCurrency: "NGN",
        rate: 1455,
        type: "mid",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2026-03-15",
  },
  {
    id: 3,
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    isBase: false,
    status: "active",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    exchangeRates: [
      {
        id: 4,
        fromCurrency: "EUR",
        toCurrency: "NGN",
        rate: 1580,
        type: "buying",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
      {
        id: 5,
        fromCurrency: "EUR",
        toCurrency: "NGN",
        rate: 1595,
        type: "selling",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
      {
        id: 6,
        fromCurrency: "EUR",
        toCurrency: "NGN",
        rate: 1587.5,
        type: "mid",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2026-03-15",
  },
  {
    id: 4,
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    isBase: false,
    status: "active",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    exchangeRates: [
      {
        id: 7,
        fromCurrency: "GBP",
        toCurrency: "NGN",
        rate: 1850,
        type: "buying",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
      {
        id: 8,
        fromCurrency: "GBP",
        toCurrency: "NGN",
        rate: 1870,
        type: "selling",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
      {
        id: 9,
        fromCurrency: "GBP",
        toCurrency: "NGN",
        rate: 1860,
        type: "mid",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
    ],
    createdAt: "2024-01-01",
    updatedAt: "2026-03-15",
  },
  {
    id: 5,
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    flag: "🇨🇦",
    isBase: false,
    status: "inactive",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    exchangeRates: [
      {
        id: 10,
        fromCurrency: "CAD",
        toCurrency: "NGN",
        rate: 1080,
        type: "mid",
        effectiveDate: "2026-03-15",
        isAutomatic: false,
      },
    ],
    createdAt: "2024-06-01",
    updatedAt: "2024-12-01",
  },
];

const availableCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
];

// Helper functions
const formatCurrency = (amount: number, symbol: string = "₦") => {
  return `${symbol}${amount.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: CurrencyStatus) => {
  if (status === "active") {
    return (
      <Badge className="bg-green-100 text-green-700">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    );
  }
  return (
    <Badge className="bg-gray-100 text-gray-700">
      <XCircle className="h-3 w-3 mr-1" />
      Inactive
    </Badge>
  );
};

export default function Currencies() {
  const router = useRouter();

  // State
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Currency;
    direction: "asc" | "desc";
  }>({ key: "code", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"currencies" | "rates">(
    "currencies",
  );

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    symbol: "",
    decimalPlaces: 2,
    thousandSeparator: ",",
    decimalSeparator: ".",
    status: "active" as CurrencyStatus,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [rateData, setRateData] = useState({
    rate: 0,
    type: "mid" as ExchangeRateType,
    effectiveDate: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [rateErrors, setRateErrors] = useState<Record<string, string>>({});

  // Filter and sort
  const filteredCurrencies = useMemo(() => {
    let result = [...currencies];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.code.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
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
  }, [currencies, searchQuery, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredCurrencies.length / itemsPerPage);
  const paginatedCurrencies = filteredCurrencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Base currency
  const baseCurrency = currencies.find((c) => c.isBase);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.code) errors.code = "Currency code is required";
    if (!formData.name) errors.name = "Currency name is required";
    if (!formData.symbol) errors.symbol = "Currency symbol is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRate = () => {
    const errors: Record<string, string> = {};
    if (rateData.rate <= 0)
      errors.rate = "Exchange rate must be greater than 0";
    if (!rateData.effectiveDate)
      errors.effectiveDate = "Effective date is required";
    setRateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCurrency = () => {
    if (!validateForm()) return;

    const newCurrency: Currency = {
      id: Math.max(...currencies.map((c) => c.id), 0) + 1,
      code: formData.code,
      name: formData.name,
      symbol: formData.symbol,
      flag: getFlagForCode(formData.code),
      isBase: currencies.length === 0,
      status: formData.status,
      decimalPlaces: formData.decimalPlaces,
      thousandSeparator: formData.thousandSeparator,
      decimalSeparator: formData.decimalSeparator,
      exchangeRates: [],
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setCurrencies((prev) => [...prev, newCurrency]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateCurrency = () => {
    if (!validateForm() || !selectedCurrency) return;

    const updatedCurrency: Currency = {
      ...selectedCurrency,
      code: formData.code,
      name: formData.name,
      symbol: formData.symbol,
      status: formData.status,
      decimalPlaces: formData.decimalPlaces,
      thousandSeparator: formData.thousandSeparator,
      decimalSeparator: formData.decimalSeparator,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setCurrencies((prev) =>
      prev.map((c) => (c.id === selectedCurrency.id ? updatedCurrency : c)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedCurrency(null);
  };

  const handleAddExchangeRate = () => {
    if (!validateRate() || !selectedCurrency) return;

    const newRate: ExchangeRate = {
      id:
        Math.max(
          ...(selectedCurrency.exchangeRates.map((r) => r.id) || [0]),
          0,
        ) + 1,
      fromCurrency: selectedCurrency.code,
      toCurrency: baseCurrency?.code || "NGN",
      rate: rateData.rate,
      type: rateData.type,
      effectiveDate: rateData.effectiveDate,
      isAutomatic: false,
      notes: rateData.notes,
    };

    setCurrencies((prev) =>
      prev.map((c) =>
        c.id === selectedCurrency.id
          ? {
              ...c,
              exchangeRates: [...c.exchangeRates, newRate],
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : c,
      ),
    );

    setRateData({
      rate: 0,
      type: "mid",
      effectiveDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setIsRateModalOpen(false);
  };

  const handleSetBaseCurrency = (currency: Currency) => {
    setCurrencies((prev) =>
      prev.map((c) => ({
        ...c,
        isBase: c.id === currency.id,
      })),
    );
  };

  const handleDeleteCurrency = () => {
    if (!selectedCurrency) return;
    setCurrencies((prev) => prev.filter((c) => c.id !== selectedCurrency.id));
    setIsDeleteDialogOpen(false);
    setSelectedCurrency(null);
  };

  const getFlagForCode = (code: string): string => {
    const currency = availableCurrencies.find((c) => c.code === code);
    return currency?.flag || "🌍";
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      symbol: "",
      decimalPlaces: 2,
      thousandSeparator: ",",
      decimalSeparator: ".",
      status: "active",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Code",
      "Name",
      "Symbol",
      "Status",
      "Base Currency",
      "Exchange Rates",
    ];
    const csvData = filteredCurrencies.map((c) => [
      c.code,
      c.name,
      c.symbol,
      c.status,
      c.isBase ? "Yes" : "No",
      c.exchangeRates.map((r) => `${r.type}: ${r.rate}`).join("; "),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `currencies-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRefresh = () => {
    setCurrencies([...mockCurrencies]);
    setSearchQuery("");
    setStatusFilter("all");
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
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Globe className="h-6 w-6" />
              Currencies
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage supported currencies and exchange rates
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
            Add Currency
          </Button>
        </div>
      </div>

      {/* Base Currency Banner */}
      {baseCurrency && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Landmark className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-blue-700">Base Currency</p>
                  <p className="text-sm text-blue-600">
                    {baseCurrency.code} - {baseCurrency.name} (
                    {baseCurrency.symbol})
                  </p>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Base Currency</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by code or name..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
        </TabsList>

        <TabsContent value="currencies" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("code")}
                        >
                          Code
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Flag</TableHead>
                      <TableHead>
                        <button
                          className="flex items-center gap-1 hover:text-foreground"
                          onClick={() => handleSort("name")}
                        >
                          Name
                          <ArrowUpDown className="h-3 w-3" />
                        </button>
                      </TableHead>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Base</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCurrencies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Globe className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No currencies found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedCurrencies.map((currency) => (
                        <TableRow key={currency.id}>
                          <TableCell className="font-mono font-medium">
                            {currency.code}
                          </TableCell>
                          <TableCell className="text-2xl">
                            {currency.flag}
                          </TableCell>
                          <TableCell>{currency.name}</TableCell>
                          <TableCell>{currency.symbol}</TableCell>
                          <TableCell>
                            {currency.isBase ? (
                              <Badge className="bg-blue-100 text-blue-700">
                                Base
                              </Badge>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetBaseCurrency(currency)}
                              >
                                Set as Base
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(currency.status)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(currency.updatedAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  setFormData({
                                    code: currency.code,
                                    name: currency.name,
                                    symbol: currency.symbol,
                                    decimalPlaces: currency.decimalPlaces,
                                    thousandSeparator:
                                      currency.thousandSeparator,
                                    decimalSeparator: currency.decimalSeparator,
                                    status: currency.status,
                                  });
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!currency.isBase && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedCurrency(currency);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
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

              {/* Pagination */}
              {filteredCurrencies.length > 0 && (
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
                        filteredCurrencies.length,
                      )}{" "}
                      of {filteredCurrencies.length}
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

        <TabsContent value="rates" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Exchange Rates</CardTitle>
                  <CardDescription>
                    Manage currency exchange rates
                  </CardDescription>
                </div>
                <Button
                  onClick={() => {
                    if (selectedCurrency) {
                      setIsRateModalOpen(true);
                    } else {
                      // Select first non-base currency
                      const firstNonBase = currencies.find((c) => !c.isBase);
                      if (firstNonBase) {
                        setSelectedCurrency(firstNonBase);
                        setIsRateModalOpen(true);
                      }
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Exchange Rate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {currencies.filter((c) => !c.isBase && c.exchangeRates.length > 0)
                .length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p>No exchange rates configured</p>
                  <p className="text-sm">
                    Click "Add Exchange Rate" to set up rates for foreign
                    currencies
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {currencies
                    .filter((c) => !c.isBase && c.exchangeRates.length > 0)
                    .map((currency) => (
                      <Card key={currency.id}>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <span className="text-2xl">{currency.flag}</span>
                            {currency.code} - {currency.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>
                                  Rate (1 {currency.code} to{" "}
                                  {baseCurrency?.code})
                                </TableHead>
                                <TableHead>Effective Date</TableHead>
                                <TableHead>Notes</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {currency.exchangeRates.map((rate) => (
                                <TableRow key={rate.id}>
                                  <TableCell className="capitalize">
                                    {rate.type}
                                  </TableCell>
                                  <TableCell className="font-mono">
                                    {rate.rate.toFixed(4)}
                                  </TableCell>
                                  <TableCell>
                                    {formatDate(rate.effectiveDate)}
                                  </TableCell>
                                  <TableCell>{rate.notes || "-"}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Currency Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedCurrency?.flag}</span>
              {selectedCurrency?.name} ({selectedCurrency?.code})
            </DialogTitle>
          </DialogHeader>
          {selectedCurrency && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Currency Code</p>
                  <p className="font-mono text-lg">{selectedCurrency.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Symbol</p>
                  <p className="text-lg">{selectedCurrency.symbol}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedCurrency.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Currency</p>
                  <Badge
                    className={
                      selectedCurrency.isBase
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100"
                    }
                  >
                    {selectedCurrency.isBase ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Decimal Places
                  </p>
                  <p>{selectedCurrency.decimalPlaces}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Format</p>
                  <p>
                    {selectedCurrency.thousandSeparator}
                    {selectedCurrency.decimalSeparator}
                  </p>
                </div>
              </div>

              {selectedCurrency.exchangeRates.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Exchange Rates</h3>
                  <div className="space-y-2">
                    {selectedCurrency.exchangeRates.map((rate) => (
                      <div
                        key={rate.id}
                        className="flex justify-between items-center p-2 bg-muted rounded"
                      >
                        <span className="capitalize">{rate.type}</span>
                        <span className="font-mono">
                          1 {selectedCurrency.code} = {rate.rate.toFixed(4)}{" "}
                          {baseCurrency?.code}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(rate.effectiveDate)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Currency Modal */}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen ? "Add Currency" : "Edit Currency"}
            </DialogTitle>
            <DialogDescription>
              {isCreateModalOpen
                ? "Add a new currency to the system"
                : "Edit currency details"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Currency Code *</Label>
              <Select
                value={formData.code}
                onValueChange={(v) => {
                  const currency = availableCurrencies.find(
                    (c) => c.code === v,
                  );
                  setFormData((prev) => ({
                    ...prev,
                    code: v,
                    name: currency?.name || "",
                    symbol: currency?.symbol || "",
                  }));
                }}
                disabled={isEditModalOpen}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.flag} {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.code && (
                <p className="text-sm text-red-500 mt-1">{formErrors.code}</p>
              )}
            </div>
            <div>
              <Label>Currency Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1"
                disabled
              />
            </div>
            <div>
              <Label>Symbol *</Label>
              <Input
                value={formData.symbol}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, symbol: e.target.value }))
                }
                className="mt-1"
                placeholder="₦"
              />
              {formErrors.symbol && (
                <p className="text-sm text-red-500 mt-1">{formErrors.symbol}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Decimal Places</Label>
                <Input
                  type="number"
                  value={formData.decimalPlaces}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      decimalPlaces: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Thousand Separator</Label>
                <Input
                  value={formData.thousandSeparator}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thousandSeparator: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder=","
                />
              </div>
              <div>
                <Label>Decimal Separator</Label>
                <Input
                  value={formData.decimalSeparator}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      decimalSeparator: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="."
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, status: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
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
                isCreateModalOpen ? handleCreateCurrency : handleUpdateCurrency
              }
            >
              {isCreateModalOpen ? "Add Currency" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exchange Rate Modal */}
      <Dialog open={isRateModalOpen} onOpenChange={setIsRateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Exchange Rate</DialogTitle>
            <DialogDescription>
              Set exchange rate for {selectedCurrency?.code} to{" "}
              {baseCurrency?.code}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Exchange Rate Type</Label>
              <Select
                value={rateData.type}
                onValueChange={(v: any) =>
                  setRateData((prev) => ({ ...prev, type: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buying">Buying Rate</SelectItem>
                  <SelectItem value="selling">Selling Rate</SelectItem>
                  <SelectItem value="mid">Mid Market Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Exchange Rate *</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  1 {selectedCurrency?.code} =
                </span>
                <Input
                  type="number"
                  value={rateData.rate || ""}
                  onChange={(e) =>
                    setRateData((prev) => ({
                      ...prev,
                      rate: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="pl-28"
                  placeholder="0.00"
                  step="0.0001"
                />
              </div>
              {rateErrors.rate && (
                <p className="text-sm text-red-500 mt-1">{rateErrors.rate}</p>
              )}
            </div>
            <div>
              <Label>Effective Date *</Label>
              <Input
                type="date"
                value={rateData.effectiveDate}
                onChange={(e) =>
                  setRateData((prev) => ({
                    ...prev,
                    effectiveDate: e.target.value,
                  }))
                }
                className="mt-1"
              />
              {rateErrors.effectiveDate && (
                <p className="text-sm text-red-500 mt-1">
                  {rateErrors.effectiveDate}
                </p>
              )}
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={rateData.notes}
                onChange={(e) =>
                  setRateData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1"
                rows={2}
                placeholder="Additional notes..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddExchangeRate}>Add Rate</Button>
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
            <AlertDialogTitle>Delete Currency</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCurrency?.name} (
              {selectedCurrency?.code})? This action cannot be undone.
              {selectedCurrency?.exchangeRates?.length ? (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  This currency has {selectedCurrency.exchangeRates.length}{" "}
                  exchange rate(s) configured. Deleting will remove all
                  associated rates.
                </div>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCurrency}
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
