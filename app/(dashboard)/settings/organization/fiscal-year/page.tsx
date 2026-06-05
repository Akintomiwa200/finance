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
import { Switch } from "@/src/components/ui/switch";
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
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Save,
  Send,
  Lock,
  Unlock,
  Copy,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type PeriodStatus = "open" | "closed" | "locked";
type PeriodType = "month" | "quarter" | "half_year";

interface FiscalPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  type: PeriodType;
  status: PeriodStatus;
  isAdjustmentPeriod: boolean;
  closedAt?: string;
  closedBy?: string;
  notes?: string;
}

interface FiscalYear {
  id: number;
  year: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: "draft" | "active" | "closed";
  periods: FiscalPeriod[];
  closingDate?: string;
  closedBy?: string;
  notes?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
}

// Mock Data
const mockFiscalYears: FiscalYear[] = [
  {
    id: 1,
    year: 2024,
    name: "Fiscal Year 2024",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: false,
    status: "closed",
    periods: [
      {
        id: 1,
        name: "January 2024",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-02-10",
        closedBy: "Admin",
      },
      {
        id: 2,
        name: "February 2024",
        startDate: "2024-02-01",
        endDate: "2024-02-29",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-03-10",
        closedBy: "Admin",
      },
      {
        id: 3,
        name: "March 2024",
        startDate: "2024-03-01",
        endDate: "2024-03-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-04-10",
        closedBy: "Admin",
      },
      {
        id: 4,
        name: "April 2024",
        startDate: "2024-04-01",
        endDate: "2024-04-30",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-05-10",
        closedBy: "Admin",
      },
      {
        id: 5,
        name: "May 2024",
        startDate: "2024-05-01",
        endDate: "2024-05-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-06-10",
        closedBy: "Admin",
      },
      {
        id: 6,
        name: "June 2024",
        startDate: "2024-06-01",
        endDate: "2024-06-30",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-07-10",
        closedBy: "Admin",
      },
      {
        id: 7,
        name: "July 2024",
        startDate: "2024-07-01",
        endDate: "2024-07-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-08-10",
        closedBy: "Admin",
      },
      {
        id: 8,
        name: "August 2024",
        startDate: "2024-08-01",
        endDate: "2024-08-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-09-10",
        closedBy: "Admin",
      },
      {
        id: 9,
        name: "September 2024",
        startDate: "2024-09-01",
        endDate: "2024-09-30",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-10-10",
        closedBy: "Admin",
      },
      {
        id: 10,
        name: "October 2024",
        startDate: "2024-10-01",
        endDate: "2024-10-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-11-10",
        closedBy: "Admin",
      },
      {
        id: 11,
        name: "November 2024",
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2024-12-10",
        closedBy: "Admin",
      },
      {
        id: 12,
        name: "December 2024",
        startDate: "2024-12-01",
        endDate: "2024-12-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2025-01-10",
        closedBy: "Admin",
      },
    ],
    closingDate: "2025-01-15",
    closedBy: "Admin",
    notes: "Fiscal year closed successfully",
    createdAt: "2023-12-01",
    createdBy: "System",
    updatedAt: "2025-01-15",
  },
  {
    id: 2,
    year: 2025,
    name: "Fiscal Year 2025",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    isActive: false,
    status: "closed",
    periods: [],
    closingDate: "2026-01-15",
    closedBy: "Admin",
    createdAt: "2024-12-01",
    createdBy: "System",
    updatedAt: "2026-01-15",
  },
  {
    id: 3,
    year: 2026,
    name: "Fiscal Year 2026",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    isActive: true,
    status: "active",
    periods: [
      {
        id: 13,
        name: "January 2026",
        startDate: "2026-01-01",
        endDate: "2026-01-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2026-02-10",
        closedBy: "Admin",
      },
      {
        id: 14,
        name: "February 2026",
        startDate: "2026-02-01",
        endDate: "2026-02-28",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2026-03-10",
        closedBy: "Admin",
      },
      {
        id: 15,
        name: "March 2026",
        startDate: "2026-03-01",
        endDate: "2026-03-31",
        type: "month",
        status: "closed",
        isAdjustmentPeriod: false,
        closedAt: "2026-04-10",
        closedBy: "Admin",
      },
      {
        id: 16,
        name: "April 2026",
        startDate: "2026-04-01",
        endDate: "2026-04-30",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
      {
        id: 17,
        name: "May 2026",
        startDate: "2026-05-01",
        endDate: "2026-05-31",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
      {
        id: 18,
        name: "June 2026",
        startDate: "2026-06-01",
        endDate: "2026-06-30",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
      {
        id: 19,
        name: "July 2026",
        startDate: "2026-07-01",
        endDate: "2026-07-31",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
      {
        id: 20,
        name: "August 2026",
        startDate: "2026-08-01",
        endDate: "2026-08-31",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
      {
        id: 21,
        name: "September 2026",
        startDate: "2026-09-01",
        endDate: "2026-09-30",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
      {
        id: 22,
        name: "October 2026",
        startDate: "2026-10-01",
        endDate: "2026-10-31",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
      {
        id: 23,
        name: "November 2026",
        startDate: "2026-11-01",
        endDate: "2026-11-30",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
      {
        id: 24,
        name: "December 2026",
        startDate: "2026-12-01",
        endDate: "2026-12-31",
        type: "month",
        status: "open",
        isAdjustmentPeriod: false,
      },
    ],
    createdAt: "2025-12-01",
    createdBy: "System",
    updatedAt: "2026-04-10",
  },
];

const statusColors = {
  open: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
  locked: "bg-red-100 text-red-700",
};

const statusIcons = {
  open: <Clock className="h-3 w-3 mr-1" />,
  closed: <CheckCircle className="h-3 w-3 mr-1" />,
  locked: <Lock className="h-3 w-3 mr-1" />,
};

// Helper functions
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: PeriodStatus) => {
  return (
    <Badge className={statusColors[status] + " flex items-center w-fit"}>
      {statusIcons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function FiscalYearConfig() {
  const router = useRouter();

  // State
  const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>(mockFiscalYears);
  const [selectedYear, setSelectedYear] = useState<FiscalYear | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCloseYearDialogOpen, setIsCloseYearDialogOpen] = useState(false);
  const [isClosePeriodDialogOpen, setIsClosePeriodDialogOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<FiscalPeriod | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Form state
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    startDate: `${new Date().getFullYear()}-01-01`,
    endDate: `${new Date().getFullYear()}-12-31`,
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Get active fiscal year
  const activeFiscalYear = fiscalYears.find((fy) => fy.isActive);

  // Filtered fiscal years
  const filteredFiscalYears = useMemo(() => {
    let result = [...fiscalYears];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (fy) =>
          fy.name.toLowerCase().includes(query) ||
          fy.year.toString().includes(query),
      );
    }
    return result;
  }, [fiscalYears, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredFiscalYears.length / itemsPerPage);
  const paginatedFiscalYears = filteredFiscalYears.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.year) errors.year = "Year is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      errors.endDate = "End date must be after start date";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateFiscalYear = () => {
    if (!validateForm()) return;

    const newFiscalYear: FiscalYear = {
      id: Math.max(...fiscalYears.map((fy) => fy.id), 0) + 1,
      year: formData.year,
      name: `Fiscal Year ${formData.year}`,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: fiscalYears.length === 0,
      status: "draft",
      periods: [],
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setFiscalYears((prev) => [...prev, newFiscalYear]);
    resetForm();
    setIsCreateDialogOpen(false);
  };

  const handleCloseFiscalYear = () => {
    if (!selectedYear) return;

    setFiscalYears((prev) =>
      prev.map((fy) =>
        fy.id === selectedYear.id
          ? {
              ...fy,
              status: "closed",
              isActive: false,
              closingDate: new Date().toISOString().split("T")[0],
              closedBy: "Current User",
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : fy,
      ),
    );
    setIsCloseYearDialogOpen(false);
    setSelectedYear(null);
  };

  const handleClosePeriod = () => {
    if (!selectedYear || !selectedPeriod) return;

    setFiscalYears((prev) =>
      prev.map((fy) =>
        fy.id === selectedYear.id
          ? {
              ...fy,
              periods: fy.periods.map((p) =>
                p.id === selectedPeriod.id
                  ? {
                      ...p,
                      status: "closed",
                      closedAt: new Date().toISOString().split("T")[0],
                      closedBy: "Current User",
                    }
                  : p,
              ),
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : fy,
      ),
    );
    setIsClosePeriodDialogOpen(false);
    setSelectedPeriod(null);
  };

  const handleSetActiveFiscalYear = (fiscalYear: FiscalYear) => {
    setFiscalYears((prev) =>
      prev.map((fy) => ({
        ...fy,
        isActive: fy.id === fiscalYear.id,
      })),
    );
  };

  const resetForm = () => {
    setFormData({
      year: new Date().getFullYear(),
      startDate: `${new Date().getFullYear()}-01-01`,
      endDate: `${new Date().getFullYear()}-12-31`,
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Year",
      "Name",
      "Start Date",
      "End Date",
      "Status",
      "Active",
      "Periods Count",
    ];
    const csvData = filteredFiscalYears.map((fy) => [
      fy.year.toString(),
      fy.name,
      formatDate(fy.startDate),
      formatDate(fy.endDate),
      fy.status,
      fy.isActive ? "Yes" : "No",
      fy.periods.length.toString(),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fiscal-years-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setFiscalYears([...mockFiscalYears]);
    setSearchQuery("");
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
              <Calendar className="h-6 w-6" />
              Fiscal Year Configuration
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage fiscal years and accounting periods
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
          <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Fiscal Year
          </Button>
        </div>
      </div>

      {/* Active Fiscal Year Banner */}
      {activeFiscalYear && (
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-700">
                    Active Fiscal Year
                  </p>
                  <p className="text-sm text-green-600">
                    {activeFiscalYear.name} (
                    {formatDate(activeFiscalYear.startDate)} -{" "}
                    {formatDate(activeFiscalYear.endDate)})
                  </p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700">Active</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search fiscal years..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Fiscal Years List */}
      <div className="space-y-4">
        {paginatedFiscalYears.map((fiscalYear) => (
          <Card
            key={fiscalYear.id}
            className={fiscalYear.isActive ? "border-2 border-green-500" : ""}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {fiscalYear.name}
                    {fiscalYear.isActive && (
                      <Badge className="bg-green-100 text-green-700">
                        Active
                      </Badge>
                    )}
                    {fiscalYear.status === "closed" && (
                      <Badge className="bg-gray-100 text-gray-700">
                        Closed
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {formatDate(fiscalYear.startDate)} -{" "}
                    {formatDate(fiscalYear.endDate)}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {!fiscalYear.isActive && fiscalYear.status !== "closed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetActiveFiscalYear(fiscalYear)}
                    >
                      Set Active
                    </Button>
                  )}
                  {fiscalYear.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600"
                      onClick={() => {
                        setSelectedYear(fiscalYear);
                        setIsCloseYearDialogOpen(true);
                      }}
                    >
                      Close Year
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fiscalYear.periods.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No periods configured. Generate periods from fiscal
                          year dates.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fiscalYear.periods.map((period) => (
                        <TableRow key={period.id}>
                          <TableCell className="font-medium">
                            {period.name}
                          </TableCell>
                          <TableCell>{formatDate(period.startDate)}</TableCell>
                          <TableCell>{formatDate(period.endDate)}</TableCell>
                          <TableCell>{getStatusBadge(period.status)}</TableCell>
                          <TableCell>
                            {period.status === "open" &&
                              fiscalYear.status === "active" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedYear(fiscalYear);
                                    setSelectedPeriod(period);
                                    setIsClosePeriodDialogOpen(true);
                                  }}
                                  className="text-red-600"
                                >
                                  Close Period
                                </Button>
                              )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {fiscalYear.notes && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Notes:</p>
                  <p className="text-sm">{fiscalYear.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {filteredFiscalYears.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
              </SelectContent>
            </Select>
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredFiscalYears.length)}{" "}
              of {filteredFiscalYears.length}
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Create Fiscal Year Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Fiscal Year</DialogTitle>
            <DialogDescription>Set up a new fiscal year</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Year *</Label>
              <Input
                type="number"
                value={formData.year || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    year: parseInt(e.target.value),
                  }))
                }
                className="mt-1"
                placeholder="2026"
              />
              {formErrors.year && (
                <p className="text-sm text-red-500 mt-1">{formErrors.year}</p>
              )}
            </div>
            <div>
              <Label>Start Date *</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="mt-1"
              />
              {formErrors.startDate && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.startDate}
                </p>
              )}
            </div>
            <div>
              <Label>End Date *</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                }
                className="mt-1"
              />
              {formErrors.endDate && (
                <p className="text-sm text-red-500 mt-1">
                  {formErrors.endDate}
                </p>
              )}
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateFiscalYear}>Create Fiscal Year</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Fiscal Year Dialog */}
      <AlertDialog
        open={isCloseYearDialogOpen}
        onOpenChange={setIsCloseYearDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Fiscal Year</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close this fiscal year?
              {selectedYear && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Closing a fiscal year will prevent any further changes to
                  transactions in this period. This action cannot be undone.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseFiscalYear}
              className="bg-red-600 hover:bg-red-700"
            >
              Close Fiscal Year
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Close Period Dialog */}
      <AlertDialog
        open={isClosePeriodDialogOpen}
        onOpenChange={setIsClosePeriodDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close Period</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to close this accounting period?
              {selectedPeriod && (
                <div className="mt-2 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  Closing the period will prevent any further changes to
                  transactions in {selectedPeriod.name}. This action cannot be
                  undone.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClosePeriod}
              className="bg-red-600 hover:bg-red-700"
            >
              Close Period
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
