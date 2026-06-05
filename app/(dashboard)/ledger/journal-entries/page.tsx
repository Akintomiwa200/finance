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
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FileText,
  DollarSign,
  Calendar,
  User,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Copy,
  Printer,
  Mail,
  Send,
  Save,
  X,
  PlusCircle,
  MinusCircle,
  Calculator,
  Landmark,
  Receipt,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  PiggyBank,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";

// Types
type JournalStatus = "draft" | "posted" | "approved" | "rejected" | "cancelled";
type JournalType = "manual" | "system" | "recurring" | "adjustment" | "closing";

interface JournalEntry {
  id: number;
  journalNumber: string;
  date: string;
  type: JournalType;
  description: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: JournalStatus;
  reference?: string;
  source?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  postedBy?: string;
  postedAt?: string;
  notes?: string;
  attachments?: string[];
}

interface JournalLine {
  id: number;
  accountId: number;
  accountCode: string;
  accountName: string;
  accountType: string;
  debit: number;
  credit: number;
  description?: string;
  reference?: string;
  department?: string;
  costCenter?: string;
  project?: string;
}

interface Account {
  id: number;
  code: string;
  name: string;
  type: string;
  normalBalance: "debit" | "credit";
  category: string;
  department?: string;
}

// Mock Accounts
const mockAccounts: Account[] = [
  {
    id: 1,
    code: "1110",
    name: "Cash - Operating",
    type: "asset",
    normalBalance: "debit",
    category: "Current Asset",
    department: "Finance",
  },
  {
    id: 2,
    code: "1120",
    name: "Cash - Savings",
    type: "asset",
    normalBalance: "debit",
    category: "Current Asset",
    department: "Finance",
  },
  {
    id: 3,
    code: "1130",
    name: "Accounts Receivable",
    type: "asset",
    normalBalance: "debit",
    category: "Current Asset",
  },
  {
    id: 4,
    code: "1210",
    name: "Equipment",
    type: "asset",
    normalBalance: "debit",
    category: "Fixed Asset",
    department: "IT",
  },
  {
    id: 5,
    code: "2100",
    name: "Accounts Payable",
    type: "liability",
    normalBalance: "credit",
    category: "Current Liability",
  },
  {
    id: 6,
    code: "2200",
    name: "Bank Loans",
    type: "liability",
    normalBalance: "credit",
    category: "Long-term Liability",
  },
  {
    id: 7,
    code: "3100",
    name: "Share Capital",
    type: "equity",
    normalBalance: "credit",
    category: "Equity",
  },
  {
    id: 8,
    code: "3200",
    name: "Retained Earnings",
    type: "equity",
    normalBalance: "credit",
    category: "Equity",
  },
  {
    id: 9,
    code: "4100",
    name: "Sales Revenue",
    type: "revenue",
    normalBalance: "credit",
    category: "Revenue",
  },
  {
    id: 10,
    code: "5100",
    name: "Salaries Expense",
    type: "expense",
    normalBalance: "debit",
    category: "Operating Expense",
    department: "HR",
  },
  {
    id: 11,
    code: "5200",
    name: "Rent Expense",
    type: "expense",
    normalBalance: "debit",
    category: "Operating Expense",
    department: "Operations",
  },
  {
    id: 12,
    code: "5300",
    name: "Utilities Expense",
    type: "expense",
    normalBalance: "debit",
    category: "Operating Expense",
    department: "Operations",
  },
  {
    id: 13,
    code: "5400",
    name: "Office Supplies",
    type: "expense",
    normalBalance: "debit",
    category: "Operating Expense",
    department: "Operations",
  },
  {
    id: 14,
    code: "5500",
    name: "Depreciation Expense",
    type: "expense",
    normalBalance: "debit",
    category: "Non-operating Expense",
  },
];

// Mock Journal Entries
const mockJournalEntries: JournalEntry[] = [
  {
    id: 1,
    journalNumber: "JNL-2026-0001",
    date: "2026-03-01",
    type: "manual",
    description: "Salary payment for February 2026",
    lines: [
      {
        id: 1,
        accountId: 10,
        accountCode: "5100",
        accountName: "Salaries Expense",
        accountType: "expense",
        debit: 25000000,
        credit: 0,
        description: "February salaries",
        department: "HR",
      },
      {
        id: 2,
        accountId: 1,
        accountCode: "1110",
        accountName: "Cash - Operating",
        accountType: "asset",
        debit: 0,
        credit: 25000000,
        description: "Salary payment",
        department: "Finance",
      },
    ],
    totalDebit: 25000000,
    totalCredit: 25000000,
    status: "posted",
    reference: "PAY-2026-0023",
    source: "Payroll System",
    createdBy: "John Doe",
    createdAt: "2026-03-01T10:00:00",
    postedBy: "System",
    postedAt: "2026-03-01T10:00:00",
  },
  {
    id: 2,
    journalNumber: "JNL-2026-0002",
    date: "2026-03-05",
    type: "manual",
    description: "Office rent payment for March",
    lines: [
      {
        id: 3,
        accountId: 11,
        accountCode: "5200",
        accountName: "Rent Expense",
        accountType: "expense",
        debit: 12000000,
        credit: 0,
        description: "March rent",
        department: "Operations",
      },
      {
        id: 4,
        accountId: 1,
        accountCode: "1110",
        accountName: "Cash - Operating",
        accountType: "asset",
        debit: 0,
        credit: 12000000,
        description: "Rent payment",
        department: "Finance",
      },
    ],
    totalDebit: 12000000,
    totalCredit: 12000000,
    status: "posted",
    reference: "RENT-2026-03",
    source: "Accounts Payable",
    createdBy: "Jane Smith",
    createdAt: "2026-03-05T09:30:00",
    postedBy: "Jane Smith",
    postedAt: "2026-03-05T09:30:00",
  },
  {
    id: 3,
    journalNumber: "JNL-2026-0003",
    date: "2026-03-10",
    type: "manual",
    description: "Equipment purchase - Laptops",
    lines: [
      {
        id: 5,
        accountId: 4,
        accountCode: "1210",
        accountName: "Equipment",
        accountType: "asset",
        debit: 4500000,
        credit: 0,
        description: "10 Laptops",
        department: "IT",
      },
      {
        id: 6,
        accountId: 5,
        accountCode: "2100",
        accountName: "Accounts Payable",
        accountType: "liability",
        debit: 0,
        credit: 4500000,
        description: "Vendor invoice",
        department: "Finance",
      },
    ],
    totalDebit: 4500000,
    totalCredit: 4500000,
    status: "approved",
    reference: "PO-2026-045",
    source: "Procurement",
    createdBy: "Mike Johnson",
    createdAt: "2026-03-10T14:20:00",
    approvedBy: "Finance Manager",
    approvedAt: "2026-03-10T15:00:00",
  },
  {
    id: 4,
    journalNumber: "JNL-2026-0004",
    date: "2026-03-15",
    type: "adjustment",
    description: "Depreciation expense for March",
    lines: [
      {
        id: 7,
        accountId: 14,
        accountCode: "5500",
        accountName: "Depreciation Expense",
        accountType: "expense",
        debit: 1250000,
        credit: 0,
        description: "Monthly depreciation",
      },
      {
        id: 8,
        accountId: 8,
        accountCode: "3200",
        accountName: "Retained Earnings",
        accountType: "equity",
        debit: 0,
        credit: 1250000,
        description: "Accumulated depreciation",
      },
    ],
    totalDebit: 1250000,
    totalCredit: 1250000,
    status: "draft",
    reference: "DEP-2026-03",
    source: "Fixed Assets",
    createdBy: "Sarah Williams",
    createdAt: "2026-03-15T11:00:00",
  },
  {
    id: 5,
    journalNumber: "JNL-2026-0005",
    date: "2026-03-18",
    type: "manual",
    description: "Sales revenue - March sales",
    lines: [
      {
        id: 9,
        accountId: 3,
        accountCode: "1130",
        accountName: "Accounts Receivable",
        accountType: "asset",
        debit: 35000000,
        credit: 0,
        description: "Customer invoices",
        department: "Sales",
      },
      {
        id: 10,
        accountId: 9,
        accountCode: "4100",
        accountName: "Sales Revenue",
        accountType: "revenue",
        debit: 0,
        credit: 35000000,
        description: "March sales",
        department: "Sales",
      },
    ],
    totalDebit: 35000000,
    totalCredit: 35000000,
    status: "posted",
    reference: "INV-2026-03",
    source: "Sales System",
    createdBy: "Sales Team",
    createdAt: "2026-03-18T16:00:00",
    postedBy: "System",
    postedAt: "2026-03-18T16:00:00",
  },
  {
    id: 6,
    journalNumber: "JNL-2026-0006",
    date: "2026-03-20",
    type: "manual",
    description: "Utility bills payment",
    lines: [
      {
        id: 11,
        accountId: 12,
        accountCode: "5300",
        accountName: "Utilities Expense",
        accountType: "expense",
        debit: 850000,
        credit: 0,
        description: "Electricity & Water",
        department: "Operations",
      },
      {
        id: 12,
        accountId: 1,
        accountCode: "1110",
        accountName: "Cash - Operating",
        accountType: "asset",
        debit: 0,
        credit: 850000,
        description: "Utility payment",
        department: "Finance",
      },
    ],
    totalDebit: 850000,
    totalCredit: 850000,
    status: "posted",
    reference: "UTIL-2026-03",
    source: "Accounts Payable",
    createdBy: "Operations Team",
    createdAt: "2026-03-20T13:15:00",
    postedBy: "System",
    postedAt: "2026-03-20T13:15:00",
  },
  {
    id: 7,
    journalNumber: "JNL-2026-0007",
    date: "2026-03-22",
    type: "recurring",
    description: "Monthly loan repayment",
    lines: [
      {
        id: 13,
        accountId: 5,
        accountCode: "2100",
        accountName: "Accounts Payable",
        accountType: "liability",
        debit: 500000,
        credit: 0,
        description: "Loan principal",
      },
      {
        id: 14,
        accountId: 11,
        accountCode: "5200",
        accountName: "Rent Expense",
        accountType: "expense",
        debit: 200000,
        credit: 0,
        description: "Interest payment",
      },
      {
        id: 15,
        accountId: 1,
        accountCode: "1110",
        accountName: "Cash - Operating",
        accountType: "asset",
        debit: 0,
        credit: 700000,
        description: "Monthly repayment",
      },
    ],
    totalDebit: 700000,
    totalCredit: 700000,
    status: "approved",
    reference: "LOAN-2026-03",
    source: "Bank",
    createdBy: "System",
    createdAt: "2026-03-22T08:00:00",
    approvedBy: "Finance Manager",
    approvedAt: "2026-03-22T09:00:00",
  },
];

const journalTypes = [
  { value: "manual", label: "Manual Entry" },
  { value: "system", label: "System Generated" },
  { value: "recurring", label: "Recurring" },
  { value: "adjustment", label: "Adjustment" },
  { value: "closing", label: "Closing Entry" },
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
  { value: "posted", label: "Posted", color: "bg-green-100 text-green-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-yellow-100 text-yellow-700",
  },
];

export default function JournalEntries() {
  const router = useRouter();

  // State
  const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [accounts] = useState<Account[]>(mockAccounts);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof JournalEntry;
    direction: "asc" | "desc";
  }>({ key: "date", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);

  // Form state for journal entry
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "manual" as JournalType,
    description: "",
    reference: "",
    notes: "",
    lines: [] as JournalLine[],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingLine, setEditingLine] = useState<JournalLine | null>(null);
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const postedEntries = entries.filter((e) => e.status === "posted").length;
    const draftEntries = entries.filter((e) => e.status === "draft").length;
    const approvedEntries = entries.filter(
      (e) => e.status === "approved",
    ).length;
    const totalDebit = entries.reduce((sum, e) => sum + e.totalDebit, 0);
    const totalCredit = entries.reduce((sum, e) => sum + e.totalCredit, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthEntries = entries.filter((e) => {
      const entryDate = new Date(e.date);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    });
    const monthTotal = monthEntries.reduce((sum, e) => sum + e.totalDebit, 0);

    return {
      totalEntries,
      postedEntries,
      draftEntries,
      approvedEntries,
      totalDebit,
      totalCredit,
      monthEntries: monthEntries.length,
      monthTotal,
      isBalanced: totalDebit === totalCredit,
    };
  }, [entries]);

  // Filter and sort
  const filteredEntries = useMemo(() => {
    let result = [...entries];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.journalNumber.toLowerCase().includes(query) ||
          e.description.toLowerCase().includes(query) ||
          e.reference?.toLowerCase().includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((e) => e.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((e) => e.status === statusFilter);
    }

    if (dateRange.from) {
      result = result.filter((e) => e.date >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((e) => e.date <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue =
          sortConfig.key === "date"
            ? new Date(a.date).getTime()
            : a[sortConfig.key];
        const bValue =
          sortConfig.key === "date"
            ? new Date(b.date).getTime()
            : b[sortConfig.key];

        return compareValues(aValue, bValue, sortConfig.direction);
      });
    }

    return result;
  }, [entries, searchQuery, typeFilter, statusFilter, dateRange, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof JournalEntry) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsViewModalOpen(true);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setFormData({
      date: entry.date,
      type: entry.type,
      description: entry.description,
      reference: entry.reference || "",
      notes: entry.notes || "",
      lines: [...entry.lines],
    });
    setIsEditModalOpen(true);
  };

  const handleAddLine = () => {
    setEditingLine(null);
    setIsLineModalOpen(true);
  };

  const handleEditLine = (line: JournalLine) => {
    setEditingLine(line);
    setIsLineModalOpen(true);
  };

  const handleSaveLine = (lineData: Partial<JournalLine>) => {
    if (editingLine) {
      // Update existing line
      setFormData((prev) => ({
        ...prev,
        lines: prev.lines.map((l) =>
          l.id === editingLine.id ? ({ ...l, ...lineData } as JournalLine) : l,
        ),
      }));
    } else {
      // Add new line
      const newLine: JournalLine = {
        id: Date.now(),
        accountId: lineData.accountId!,
        accountCode: lineData.accountCode!,
        accountName: lineData.accountName!,
        accountType: lineData.accountType!,
        debit: lineData.debit || 0,
        credit: lineData.credit || 0,
        description: lineData.description,
        department: lineData.department,
      };
      setFormData((prev) => ({
        ...prev,
        lines: [...prev.lines, newLine],
      }));
    }
    setIsLineModalOpen(false);
    setEditingLine(null);
  };

  const handleRemoveLine = (lineId: number) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.filter((l) => l.id !== lineId),
    }));
  };

  const calculateTotals = () => {
    const totalDebit = formData.lines.reduce(
      (sum, line) => sum + line.debit,
      0,
    );
    const totalCredit = formData.lines.reduce(
      (sum, line) => sum + line.credit,
      0,
    );
    return { totalDebit, totalCredit, isBalanced: totalDebit === totalCredit };
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.description) errors.description = "Description is required";
    if (!formData.date) errors.date = "Date is required";
    if (formData.lines.length === 0)
      errors.lines = "At least one journal line is required";

    const { totalDebit, totalCredit, isBalanced } = calculateTotals();
    if (!isBalanced && formData.lines.length > 0) {
      errors.balance = `Debits (${formatCurrency(totalDebit)}) must equal Credits (${formatCurrency(totalCredit)})`;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateEntry = () => {
    if (!validateForm()) return;

    const { totalDebit, totalCredit } = calculateTotals();
    const newEntry: JournalEntry = {
      id: Math.max(...entries.map((e) => e.id), 0) + 1,
      journalNumber: `JNL-${new Date().getFullYear()}-${String(entries.length + 1).padStart(4, "0")}`,
      date: formData.date,
      type: formData.type,
      description: formData.description,
      lines: formData.lines,
      totalDebit,
      totalCredit,
      status: "draft",
      reference: formData.reference,
      source: "Manual Entry",
      createdBy: "Current User",
      createdAt: new Date().toISOString(),
      notes: formData.notes,
    };

    setEntries((prev) => [newEntry, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateEntry = () => {
    if (!validateForm() || !selectedEntry) return;

    const { totalDebit, totalCredit } = calculateTotals();
    const updatedEntry: JournalEntry = {
      ...selectedEntry,
      date: formData.date,
      type: formData.type,
      description: formData.description,
      lines: formData.lines,
      totalDebit,
      totalCredit,
      reference: formData.reference,
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    };

    setEntries((prev) =>
      prev.map((e) => (e.id === selectedEntry.id ? updatedEntry : e)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedEntry(null);
  };

  const handlePostEntry = () => {
    if (!selectedEntry) return;

    setEntries((prev) =>
      prev.map((e) =>
        e.id === selectedEntry.id
          ? {
              ...e,
              status: "posted",
              postedBy: "Current User",
              postedAt: new Date().toISOString(),
            }
          : e,
      ),
    );
    setIsPostDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleDeleteEntry = () => {
    if (!selectedEntry) return;
    setEntries((prev) => prev.filter((e) => e.id !== selectedEntry.id));
    setIsDeleteDialogOpen(false);
    setSelectedEntry(null);
  };

  const handleApproveEntry = (entry: JournalEntry) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id
          ? {
              ...e,
              status: "approved",
              approvedBy: "Current User",
              approvedAt: new Date().toISOString(),
            }
          : e,
      ),
    );
  };

  const handleRejectEntry = (entry: JournalEntry) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, status: "rejected" } : e)),
    );
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "manual",
      description: "",
      reference: "",
      notes: "",
      lines: [],
    });
    setFormErrors({});
  };

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: JournalStatus) => {
    const config = statuses.find((s) => s.value === status);
    return (
      <Badge className={config?.color || "bg-gray-100 text-gray-700"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeBadge = (type: JournalType) => {
    const styles = {
      manual: "bg-purple-100 text-purple-700",
      system: "bg-blue-100 text-blue-700",
      recurring: "bg-green-100 text-green-700",
      adjustment: "bg-orange-100 text-orange-700",
      closing: "bg-red-100 text-red-700",
    };

    const labels = {
      manual: "Manual",
      system: "System",
      recurring: "Recurring",
      adjustment: "Adjustment",
      closing: "Closing",
    };

    return <Badge className={styles[type]}>{labels[type]}</Badge>;
  };

  const handleExport = () => {
    const headers = [
      "Journal #",
      "Date",
      "Type",
      "Description",
      "Reference",
      "Total Debit",
      "Total Credit",
      "Status",
      "Created By",
      "Created At",
    ];
    const csvData = filteredEntries.map((e) => [
      e.journalNumber,
      formatDate(e.date),
      e.type,
      e.description,
      e.reference || "",
      e.totalDebit.toString(),
      e.totalCredit.toString(),
      e.status,
      e.createdBy,
      formatDateTime(e.createdAt),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `journal-entries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Journal Line Modal Component
  const JournalLineModal = () => {
    const [lineData, setLineData] = useState<Partial<JournalLine>>(
      editingLine || {
        accountId: 0,
        accountCode: "",
        accountName: "",
        accountType: "",
        debit: 0,
        credit: 0,
        description: "",
        department: "",
      },
    );

    const [selectedAccount, setSelectedAccount] = useState<Account | null>(
      null,
    );

    const handleAccountSelect = (accountId: string) => {
      const account = accounts.find((a) => a.id === parseInt(accountId));
      if (account) {
        setSelectedAccount(account);
        setLineData((prev) => ({
          ...prev,
          accountId: account.id,
          accountCode: account.code,
          accountName: account.name,
          accountType: account.type,
          department: account.department,
        }));
      }
    };

    const handleSave = () => {
      if (
        !lineData.accountId ||
        (lineData.debit === 0 && lineData.credit === 0)
      ) {
        return;
      }
      handleSaveLine(lineData);
    };

    return (
      <Dialog open={isLineModalOpen} onOpenChange={setIsLineModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingLine ? "Edit Journal Line" : "Add Journal Line"}
            </DialogTitle>
            <DialogDescription>Enter line item details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Account *</Label>
              <Select
                onValueChange={handleAccountSelect}
                value={lineData.accountId?.toString()}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.code} - {account.name} ({account.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Debit (₦)</Label>
                <Input
                  type="number"
                  value={lineData.debit || ""}
                  onChange={(e) =>
                    setLineData((prev) => ({
                      ...prev,
                      debit: parseFloat(e.target.value) || 0,
                      credit: 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Credit (₦)</Label>
                <Input
                  type="number"
                  value={lineData.credit || ""}
                  onChange={(e) =>
                    setLineData((prev) => ({
                      ...prev,
                      credit: parseFloat(e.target.value) || 0,
                      debit: 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={lineData.description || ""}
                onChange={(e) =>
                  setLineData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="Line description"
              />
            </div>
            {selectedAccount && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  Account Type: {selectedAccount.type}
                </p>
                <p className="text-xs text-muted-foreground">
                  Normal Balance: {selectedAccount.normalBalance}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLineModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Line</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const { totalDebit, totalCredit, isBalanced } = calculateTotals();

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
              Journal Entries
              <Badge variant="secondary" className="ml-2">
                {stats.totalEntries}
              </Badge>
            </h1>
            <p className="text-muted-foreground mt-1">
              Record and review double-entry journal entries
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Entry
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entries</p>
                <p className="text-2xl font-bold">{stats.totalEntries}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.monthEntries} this month
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.postedEntries}
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
                <p className="text-sm text-muted-foreground">Draft / Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.draftEntries + stats.approvedEntries}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Period Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(stats.monthTotal)}
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
                placeholder="Search by journal #, description, reference..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {journalTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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
              <SelectTrigger className="w-full sm:w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="posted">Posted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="From Date"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
              className="w-full sm:w-[150px]"
            />
            <Input
              type="date"
              placeholder="To Date"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
              className="w-full sm:w-[150px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>
            {filteredEntries.length} journal entr
            {filteredEntries.length !== 1 ? "ies" : "y"} found
            {!stats.isBalanced && (
              <span className="ml-2 text-red-600">
                ⚠️ Unbalanced entries detected
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("journalNumber")}
                    >
                      Journal #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("date")}
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Total Debit</TableHead>
                  <TableHead>Total Credit</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No journal entries found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {entry.journalNumber}
                      </TableCell>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>{getTypeBadge(entry.type)}</TableCell>
                      <TableCell
                        className="max-w-[200px] truncate"
                        title={entry.description}
                      >
                        {entry.description}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.reference || "-"}
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {formatCurrency(entry.totalDebit)}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(entry.totalCredit)}
                      </TableCell>
                      <TableCell>{getStatusBadge(entry.status)}</TableCell>
                      <TableCell className="text-sm">
                        {entry.createdBy}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewEntry(entry)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {entry.status === "draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditEntry(entry)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedEntry(entry);
                                  setIsPostDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {entry.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePostEntry()}
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
          {filteredEntries.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
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
                  {Math.min(currentPage * itemsPerPage, filteredEntries.length)}{" "}
                  of {filteredEntries.length}
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

      {/* View Journal Entry Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Journal Entry Details</span>
              {selectedEntry && getStatusBadge(selectedEntry.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedEntry?.journalNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedEntry.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <div>{getTypeBadge(selectedEntry.type)}</div>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p>{selectedEntry.description}</p>
                </div>
                {selectedEntry.reference && (
                  <div>
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <p className="font-mono text-sm">
                      {selectedEntry.reference}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p>{selectedEntry.source || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p>{selectedEntry.createdBy}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p>{formatDateTime(selectedEntry.createdAt)}</p>
                </div>
              </div>

              {/* Journal Lines */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Journal Lines</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Code</TableHead>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEntry.lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="font-mono text-xs">
                          {line.accountCode}
                        </TableCell>
                        <TableCell>{line.accountName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {line.accountType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {line.description || "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {line.credit > 0 ? formatCurrency(line.credit) : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableHeader>
                    <TableRow className="border-t-2">
                      <TableHead colSpan={4} className="text-right font-bold">
                        Totals:
                      </TableHead>
                      <TableHead className="text-right font-bold text-blue-600">
                        {formatCurrency(selectedEntry.totalDebit)}
                      </TableHead>
                      <TableHead className="text-right font-bold text-green-600">
                        {formatCurrency(selectedEntry.totalCredit)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {selectedEntry.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedEntry.notes}</p>
                </div>
              )}

              {/* Approval/Posting Info */}
              {(selectedEntry.approvedBy || selectedEntry.postedBy) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Audit Trail</h3>
                  <div className="space-y-2 text-sm">
                    {selectedEntry.approvedBy && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          Approved by {selectedEntry.approvedBy} on{" "}
                          {formatDateTime(selectedEntry.approvedAt!)}
                        </span>
                      </div>
                    )}
                    {selectedEntry.postedBy && (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-blue-600" />
                        <span>
                          Posted by {selectedEntry.postedBy} on{" "}
                          {formatDateTime(selectedEntry.postedAt!)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedEntry && selectedEntry.status === "draft" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditEntry(selectedEntry);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedEntry(selectedEntry);
                    setIsPostDialogOpen(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Post Entry
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Journal Entry Modal */}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreateModalOpen
                ? "Create Journal Entry"
                : "Edit Journal Entry"}
            </DialogTitle>
            <DialogDescription>
              Record a double-entry journal transaction
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="mt-1"
                />
                {formErrors.date && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.date}</p>
                )}
              </div>
              <div>
                <Label>Entry Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {journalTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Description *</Label>
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
                  placeholder="Describe the journal entry..."
                />
                {formErrors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.description}
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
                  placeholder="Invoice #, PO #, etc."
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

            {/* Journal Lines */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Journal Lines</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddLine}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Line
                </Button>
              </div>

              {formData.lines.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formData.lines.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell>
                            <div>
                              <span className="font-mono text-xs">
                                {line.accountCode}
                              </span>
                              <p className="text-sm">{line.accountName}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {line.description || "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium text-blue-600">
                            {line.debit > 0 ? formatCurrency(line.debit) : "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium text-green-600">
                            {line.credit > 0
                              ? formatCurrency(line.credit)
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditLine(line)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveLine(line.id)}
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableHeader>
                      <TableRow className="border-t-2">
                        <TableHead colSpan={2} className="text-right font-bold">
                          Totals:
                        </TableHead>
                        <TableHead className="text-right font-bold text-blue-600">
                          {formatCurrency(totalDebit)}
                        </TableHead>
                        <TableHead className="text-right font-bold text-green-600">
                          {formatCurrency(totalCredit)}
                        </TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                  </Table>
                  {!isBalanced && formData.lines.length > 0 && (
                    <div className="mt-2 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      Journal entry is unbalanced. Debits must equal credits.
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Calculator className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No journal lines added
                  </p>
                  <Button variant="link" onClick={handleAddLine}>
                    Add your first line
                  </Button>
                </div>
              )}
              {formErrors.lines && (
                <p className="text-sm text-red-500 mt-2">{formErrors.lines}</p>
              )}
              {formErrors.balance && (
                <p className="text-sm text-red-500 mt-2">
                  {formErrors.balance}
                </p>
              )}
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
                isCreateModalOpen ? handleCreateEntry : handleUpdateEntry
              }
              disabled={!isBalanced}
            >
              {isCreateModalOpen ? "Save as Draft" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Post Confirmation Dialog */}
      <AlertDialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post Journal Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to post this journal entry?
              {selectedEntry && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedEntry.journalNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedEntry.description}
                  </p>
                  <div className="mt-2 text-sm">
                    <span>
                      Total: {formatCurrency(selectedEntry.totalDebit)}
                    </span>
                  </div>
                </div>
              )}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-yellow-800">
                <AlertCircle className="h-4 w-4 inline mr-2" />
                Posting will update account balances and cannot be undone.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePostEntry}
              className="bg-green-600 hover:bg-green-700"
            >
              Post Entry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Journal Line Modal */}
      <JournalLineModal />
    </div>
  );
}
