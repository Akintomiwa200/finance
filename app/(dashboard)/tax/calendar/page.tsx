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
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Filter,
  Calendar,
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  DollarSign,
  Landmark,
  Building2,
  Eye,
  TrendingUp,
  TrendingDown,
  Mail,
  MessageSquare,
  Star,
  StarOff,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type TaxType = "vat" | "cit" | "wht" | "paye" | "edt" | "nit";
type FilingFrequency = "monthly" | "quarterly" | "annually" | "bi_annual";
type ReminderStatus = "pending" | "sent" | "dismissed";

interface TaxDeadline {
  id: number;
  taxType: TaxType;
  title: string;
  description: string;
  dueDate: string;
  filingFrequency: FilingFrequency;
  period: string;
  estimatedAmount?: number;
  status: "upcoming" | "overdue" | "completed";
  reminderSent: boolean;
  reminderDate?: string;
  notes?: string;
  filingStatus?: "not_started" | "in_progress" | "filed";
  paymentStatus?: "unpaid" | "paid";
}

interface TaxFiling {
  id: number;
  taxType: TaxType;
  period: string;
  dueDate: string;
  filingDate?: string;
  amount: number;
  status: "filed" | "pending" | "overdue";
  paymentStatus: "paid" | "unpaid";
  reference?: string;
}

// Mock Data
const mockDeadlines: TaxDeadline[] = [
  {
    id: 1,
    taxType: "vat",
    title: "VAT Return - January 2026",
    description: "Monthly Value Added Tax return filing and payment",
    dueDate: "2026-02-20",
    filingFrequency: "monthly",
    period: "January 2026",
    estimatedAmount: 492375,
    status: "completed",
    reminderSent: true,
    reminderDate: "2026-02-15",
    filingStatus: "filed",
    paymentStatus: "paid",
  },
  {
    id: 2,
    taxType: "vat",
    title: "VAT Return - February 2026",
    description: "Monthly Value Added Tax return filing and payment",
    dueDate: "2026-03-20",
    filingFrequency: "monthly",
    period: "February 2026",
    estimatedAmount: 366000,
    status: "upcoming",
    reminderSent: false,
    filingStatus: "in_progress",
    paymentStatus: "unpaid",
  },
  {
    id: 3,
    taxType: "vat",
    title: "VAT Return - March 2026",
    description: "Monthly Value Added Tax return filing and payment",
    dueDate: "2026-04-20",
    filingFrequency: "monthly",
    period: "March 2026",
    estimatedAmount: 127500,
    status: "upcoming",
    reminderSent: false,
    filingStatus: "not_started",
    paymentStatus: "unpaid",
  },
  {
    id: 4,
    taxType: "cit",
    title: "Company Income Tax - Q1 2026",
    description: "Quarterly CIT installment payment",
    dueDate: "2026-03-31",
    filingFrequency: "quarterly",
    period: "Q1 2026",
    estimatedAmount: 7812500,
    status: "upcoming",
    reminderSent: false,
    filingStatus: "not_started",
    paymentStatus: "unpaid",
  },
  {
    id: 5,
    taxType: "wht",
    title: "Withholding Tax - January 2026",
    description: "Monthly WHT return and payment",
    dueDate: "2026-02-28",
    filingFrequency: "monthly",
    period: "January 2026",
    estimatedAmount: 250000,
    status: "completed",
    reminderSent: true,
    reminderDate: "2026-02-20",
    filingStatus: "filed",
    paymentStatus: "paid",
  },
  {
    id: 6,
    taxType: "wht",
    title: "Withholding Tax - February 2026",
    description: "Monthly WHT return and payment",
    dueDate: "2026-03-28",
    filingFrequency: "monthly",
    period: "February 2026",
    estimatedAmount: 350000,
    status: "upcoming",
    reminderSent: true,
    reminderDate: "2026-03-20",
    filingStatus: "in_progress",
    paymentStatus: "unpaid",
  },
  {
    id: 7,
    taxType: "paye",
    title: "PAYE - January 2026",
    description: "Pay As You Earn monthly remittance",
    dueDate: "2026-02-10",
    filingFrequency: "monthly",
    period: "January 2026",
    estimatedAmount: 2250000,
    status: "completed",
    reminderSent: true,
    reminderDate: "2026-02-05",
    filingStatus: "filed",
    paymentStatus: "paid",
  },
  {
    id: 8,
    taxType: "paye",
    title: "PAYE - February 2026",
    description: "Pay As You Earn monthly remittance",
    dueDate: "2026-03-10",
    filingFrequency: "monthly",
    period: "February 2026",
    estimatedAmount: 2250000,
    status: "overdue",
    reminderSent: true,
    reminderDate: "2026-03-05",
    filingStatus: "not_started",
    paymentStatus: "unpaid",
    notes: "Payment overdue - follow up required",
  },
  {
    id: 9,
    taxType: "edt",
    title: "Education Tax - Annual 2025",
    description: "Education Tax annual return",
    dueDate: "2026-06-30",
    filingFrequency: "annually",
    period: "2025 Tax Year",
    estimatedAmount: 3125000,
    status: "upcoming",
    reminderSent: false,
    filingStatus: "not_started",
    paymentStatus: "unpaid",
  },
  {
    id: 10,
    taxType: "nit",
    title: "NITDEF - Annual 2025",
    description: "National Information Technology Development Fund levy",
    dueDate: "2026-05-31",
    filingFrequency: "annually",
    period: "2025 Tax Year",
    estimatedAmount: 1250000,
    status: "upcoming",
    reminderSent: false,
    filingStatus: "not_started",
    paymentStatus: "unpaid",
  },
];

const mockFilings: TaxFiling[] = [
  {
    id: 1,
    taxType: "vat",
    period: "January 2026",
    dueDate: "2026-02-20",
    filingDate: "2026-02-15",
    amount: 492375,
    status: "filed",
    paymentStatus: "paid",
    reference: "VAT-2026-001",
  },
  {
    id: 2,
    taxType: "wht",
    period: "January 2026",
    dueDate: "2026-02-28",
    filingDate: "2026-02-25",
    amount: 250000,
    status: "filed",
    paymentStatus: "paid",
    reference: "WHT-2026-001",
  },
  {
    id: 3,
    taxType: "paye",
    period: "January 2026",
    dueDate: "2026-02-10",
    filingDate: "2026-02-05",
    amount: 2250000,
    status: "filed",
    paymentStatus: "paid",
    reference: "PAYE-2026-001",
  },
];

const taxTypes = [
  {
    value: "vat",
    label: "Value Added Tax (VAT)",
    color: "bg-blue-100 text-blue-700",
    icon: TrendingUp,
  },
  {
    value: "cit",
    label: "Company Income Tax (CIT)",
    color: "bg-green-100 text-green-700",
    icon: Building2,
  },
  {
    value: "wht",
    label: "Withholding Tax (WHT)",
    color: "bg-purple-100 text-purple-700",
    icon: DollarSign,
  },
  {
    value: "paye",
    label: "PAYE",
    color: "bg-orange-100 text-orange-700",
    icon: Users,
  },
  {
    value: "edt",
    label: "Education Tax (EDT)",
    color: "bg-red-100 text-red-700",
    icon: Landmark,
  },
  {
    value: "nit",
    label: "NITDEF",
    color: "bg-indigo-100 text-indigo-700",
    icon: FileText,
  },
];

const frequencies = [
  { value: "all", label: "All Frequencies" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "bi_annual", label: "Bi-Annual" },
  { value: "annually", label: "Annual" },
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "upcoming":
      return (
        <Badge className="bg-blue-100 text-blue-700">
          <Clock className="h-3 w-3 mr-1" />
          Upcoming
        </Badge>
      );
    case "overdue":
      return (
        <Badge className="bg-red-100 text-red-700">
          <AlertCircle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>
      );
    case "completed":
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      );
    default:
      return null;
  }
};

const getTaxTypeBadge = (type: TaxType) => {
  const config = taxTypes.find((t) => t.value === type);
  return <Badge className={config?.color}>{config?.label}</Badge>;
};

const getDaysRemaining = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function TaxCalendar() {
  const router = useRouter();

  // State
  const [deadlines, setDeadlines] = useState<TaxDeadline[]>(mockDeadlines);
  const [filings] = useState<TaxFiling[]>(mockFilings);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [frequencyFilter, setFrequencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDeadline, setSelectedDeadline] = useState<TaxDeadline | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"calendar" | "filings">(
    "calendar",
  );

  // Filter deadlines
  const filteredDeadlines = useMemo(() => {
    let result = [...deadlines];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.period.toLowerCase().includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((d) => d.taxType === typeFilter);
    }

    if (frequencyFilter !== "all") {
      result = result.filter((d) => d.filingFrequency === frequencyFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((d) => d.status === statusFilter);
    }

    return result;
  }, [deadlines, searchQuery, typeFilter, frequencyFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const upcomingCount = deadlines.filter(
      (d) => d.status === "upcoming",
    ).length;
    const overdueCount = deadlines.filter((d) => d.status === "overdue").length;
    const completedCount = deadlines.filter(
      (d) => d.status === "completed",
    ).length;
    const totalEstimatedTax = deadlines.reduce(
      (sum, d) => sum + (d.estimatedAmount || 0),
      0,
    );
    const upcomingEstimatedTax = deadlines
      .filter((d) => d.status === "upcoming")
      .reduce((sum, d) => sum + (d.estimatedAmount || 0), 0);

    const byType: Record<string, number> = {};
    deadlines.forEach((d) => {
      byType[d.taxType] = (byType[d.taxType] || 0) + (d.estimatedAmount || 0);
    });

    return {
      upcomingCount,
      overdueCount,
      completedCount,
      totalEstimatedTax,
      upcomingEstimatedTax,
      byType,
    };
  }, [deadlines]);

  // Calendar days
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayDeadlines = deadlines.filter((d) => {
        const dueDate = new Date(d.dueDate);
        return (
          dueDate.getDate() === i &&
          dueDate.getMonth() === month &&
          dueDate.getFullYear() === year
        );
      });
      days.push({ date, day: i, deadlines: dayDeadlines });
    }
    return days;
  }, [currentMonth, deadlines]);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
    );
  };

  const handleViewDeadline = (deadline: TaxDeadline) => {
    setSelectedDeadline(deadline);
    setIsDetailModalOpen(true);
  };

  const handleSendReminder = (deadline: TaxDeadline) => {
    setDeadlines((prev) =>
      prev.map((d) =>
        d.id === deadline.id
          ? { ...d, reminderSent: true, reminderDate: new Date().toISOString() }
          : d,
      ),
    );
  };

  const handleExport = () => {
    const headers = [
      "Tax Type",
      "Title",
      "Period",
      "Due Date",
      "Status",
      "Estimated Amount",
      "Filing Status",
      "Payment Status",
    ];
    const csvData = filteredDeadlines.map((d) => [
      taxTypes.find((t) => t.value === d.taxType)?.label || d.taxType,
      d.title,
      d.period,
      formatDate(d.dueDate),
      d.status,
      (d.estimatedAmount || 0).toString(),
      d.filingStatus || "",
      d.paymentStatus || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tax-calendar-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setDeadlines([...mockDeadlines]);
    setSearchQuery("");
    setTypeFilter("all");
    setFrequencyFilter("all");
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
            className="gap-2 print:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Tax Calendar
            </h1>
            <p className="text-muted-foreground mt-1">
              Track important tax deadlines and filing dates
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
                <p className="text-sm text-muted-foreground">
                  Upcoming Deadlines
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.upcomingCount}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.overdueCount}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600" />
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
                  {stats.completedCount}
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
                <p className="text-sm text-muted-foreground">
                  Estimated Tax Due
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.upcomingEstimatedTax)}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-purple-600" />
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
                placeholder="Search by title, description, period..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tax Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tax Types</SelectItem>
                {taxTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent>
                {frequencies.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
        <TabsList className="grid w-full grid-cols-2 print:hidden">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="filings">Filing History</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-4 mt-4">
          {/* Calendar Navigation */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={handlePrevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {currentMonth.toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <Button variant="outline" size="sm" onClick={handleNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 gap-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center font-semibold p-2 text-sm"
                    >
                      {day}
                    </div>
                  ),
                )}
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border rounded-lg ${day ? "hover:bg-muted" : "bg-muted/30"}`}
                  >
                    {day && (
                      <>
                        <div className="font-medium text-sm">{day.day}</div>
                        <div className="space-y-1 mt-1">
                          {day.deadlines.map((deadline) => (
                            <button
                              key={deadline.id}
                              onClick={() => handleViewDeadline(deadline)}
                              className={`w-full text-left text-xs p-1 rounded ${
                                deadline.status === "overdue"
                                  ? "bg-red-100 text-red-700"
                                  : deadline.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-blue-100 text-blue-700"
                              } hover:opacity-80 transition-opacity`}
                            >
                              <div className="truncate">{deadline.title}</div>
                              {deadline.estimatedAmount && (
                                <div className="text-xs font-medium">
                                  {formatCurrency(deadline.estimatedAmount)}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deadlines List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              <CardDescription>List of all tax deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Type</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Days Left</TableHead>
                      <TableHead>Est. Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeadlines.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <Calendar className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No deadlines found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDeadlines.map((deadline) => {
                        const daysLeft = getDaysRemaining(deadline.dueDate);
                        return (
                          <TableRow key={deadline.id}>
                            <TableCell>
                              {getTaxTypeBadge(deadline.taxType)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {deadline.title}
                            </TableCell>
                            <TableCell>{deadline.period}</TableCell>
                            <TableCell
                              className={daysLeft < 0 ? "text-red-600" : ""}
                            >
                              {formatDate(deadline.dueDate)}
                            </TableCell>
                            <TableCell>
                              {deadline.status === "completed" ? (
                                <span className="text-green-600">
                                  Completed
                                </span>
                              ) : daysLeft < 0 ? (
                                <span className="text-red-600">
                                  Overdue by {Math.abs(daysLeft)} days
                                </span>
                              ) : (
                                <span
                                  className={
                                    daysLeft <= 7
                                      ? "text-orange-600 font-medium"
                                      : ""
                                  }
                                >
                                  {daysLeft} days
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {deadline.estimatedAmount
                                ? formatCurrency(deadline.estimatedAmount)
                                : "-"}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(deadline.status)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDeadline(deadline)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filing History</CardTitle>
              <CardDescription>Record of filed tax returns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tax Type</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Filing Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="h-12 w-12 text-muted-foreground/30" />
                            <p className="text-muted-foreground">
                              No filing history found
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filings.map((filing) => (
                        <TableRow key={filing.id}>
                          <TableCell>
                            {getTaxTypeBadge(filing.taxType)}
                          </TableCell>
                          <TableCell>{filing.period}</TableCell>
                          <TableCell>{formatDate(filing.dueDate)}</TableCell>
                          <TableCell className="text-green-600">
                            {formatDate(filing.filingDate!)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(filing.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700">
                              Filed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-700">
                              Paid
                            </Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {filing.reference}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deadline Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Tax Deadline Details</span>
              {selectedDeadline && getStatusBadge(selectedDeadline.status)}
            </DialogTitle>
          </DialogHeader>
          {selectedDeadline && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-sm text-muted-foreground">Tax Type</p>
                <div className="mt-1">
                  {getTaxTypeBadge(selectedDeadline.taxType)}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Title</p>
                <p className="font-medium">{selectedDeadline.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{selectedDeadline.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Period</p>
                <p>{selectedDeadline.period}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Due Date</p>
                <p
                  className={
                    getDaysRemaining(selectedDeadline.dueDate) < 0
                      ? "text-red-600"
                      : ""
                  }
                >
                  {formatDate(selectedDeadline.dueDate)}
                  {getDaysRemaining(selectedDeadline.dueDate) < 0 &&
                    ` (Overdue by ${Math.abs(getDaysRemaining(selectedDeadline.dueDate))} days)`}
                </p>
              </div>
              {selectedDeadline.estimatedAmount && (
                <div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Amount
                  </p>
                  <p className="text-xl font-bold">
                    {formatCurrency(selectedDeadline.estimatedAmount)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Filing Status</p>
                <Badge
                  className={
                    selectedDeadline.filingStatus === "filed"
                      ? "bg-green-100 text-green-700"
                      : selectedDeadline.filingStatus === "in_progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                  }
                >
                  {selectedDeadline.filingStatus === "filed"
                    ? "Filed"
                    : selectedDeadline.filingStatus === "in_progress"
                      ? "In Progress"
                      : "Not Started"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <Badge
                  className={
                    selectedDeadline.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {selectedDeadline.paymentStatus === "paid"
                    ? "Paid"
                    : "Unpaid"}
                </Badge>
              </div>
              {selectedDeadline.reminderSent && (
                <div>
                  <p className="text-sm text-muted-foreground">Reminder Sent</p>
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <Bell className="h-3 w-3" />
                    {formatDate(selectedDeadline.reminderDate!)}
                  </p>
                </div>
              )}
              {selectedDeadline.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedDeadline.notes}</p>
                </div>
              )}
              {selectedDeadline.status !== "completed" &&
                !selectedDeadline.reminderSent && (
                  <Button
                    onClick={() => handleSendReminder(selectedDeadline)}
                    className="w-full"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Send Reminder
                  </Button>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
