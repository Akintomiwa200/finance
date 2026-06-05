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
  CheckCircle,
  XCircle,
  Clock,
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
  User,
  Building2,
  Receipt,
  FileText,
  AlertCircle,
  Wallet,
  TrendingUp,
  Printer,
  Send,
  MessageSquare,
  Paperclip,
  Banknote,
  CreditCard,
  Landmark,
  Upload,
  File,
  Image,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";

// Types
type ReimbursementStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "paid"
  | "cancelled";
type ExpenseType =
  | "petty_cash"
  | "travel"
  | "supplies"
  | "entertainment"
  | "transport"
  | "medical"
  | "training"
  | "other";
type PaymentMethod = "cash" | "bank_transfer" | "cheque";

interface Reimbursement {
  id: number;
  reimbursementNumber: string;
  employee: {
    id: number;
    name: string;
    email: string;
    department: string;
    position: string;
    employeeCode: string;
  };
  requestDate: string;
  expenses: ExpenseItem[];
  totalAmount: number;
  status: ReimbursementStatus;
  paymentMethod: PaymentMethod;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  approvedBy?: string;
  approvedDate?: string;
  rejectedBy?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  paidBy?: string;
  paidDate?: string;
  transactionReference?: string;
  notes?: string;
  attachments?: {
    id: number;
    fileName: string;
    fileUrl: string;
    fileType: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface ExpenseItem {
  id: number;
  date: string;
  category: string;
  description: string;
  amount: number;
  receiptAttached: boolean;
  receiptNumber?: string;
  vendor?: string;
}

interface ReimbursementSummary {
  totalRequested: number;
  totalApproved: number;
  totalPaid: number;
  totalRejected: number;
  pendingCount: number;
  averageProcessingDays: number;
}

// Mock Data
const mockReimbursements: Reimbursement[] = [
  {
    id: 1,
    reimbursementNumber: "REIM-2026-0001",
    employee: {
      id: 101,
      name: "John Smith",
      email: "john.smith@company.com",
      department: "Marketing",
      position: "Marketing Coordinator",
      employeeCode: "EMP-001",
    },
    requestDate: "2026-03-01",
    expenses: [
      {
        id: 1,
        date: "2026-02-28",
        category: "petty_cash",
        description: "Office supplies for campaign",
        amount: 25000,
        receiptAttached: true,
        receiptNumber: "RC-2026-045",
        vendor: "Office Depot",
      },
      {
        id: 2,
        date: "2026-02-28",
        category: "transport",
        description: "Taxi to client meeting",
        amount: 8000,
        receiptAttached: true,
        receiptNumber: "TX-2026-123",
        vendor: "Uber",
      },
    ],
    totalAmount: 33000,
    status: "paid",
    paymentMethod: "bank_transfer",
    bankDetails: {
      bankName: "First Bank",
      accountNumber: "1234567890",
      accountName: "John Smith",
    },
    approvedBy: "Jane Manager",
    approvedDate: "2026-03-02T10:30:00",
    paidBy: "Finance Officer",
    paidDate: "2026-03-03T14:00:00",
    transactionReference: "TRF-2026-0456",
    notes: "Campaign materials and transportation",
    attachments: [
      { id: 1, fileName: "receipt1.pdf", fileUrl: "#", fileType: "pdf" },
      { id: 2, fileName: "receipt2.jpg", fileUrl: "#", fileType: "image" },
    ],
    createdAt: "2026-03-01T09:00:00",
    updatedAt: "2026-03-03T14:00:00",
  },
  {
    id: 2,
    reimbursementNumber: "REIM-2026-0002",
    employee: {
      id: 102,
      name: "Alice Johnson",
      email: "alice.johnson@company.com",
      department: "Sales",
      position: "Sales Executive",
      employeeCode: "EMP-002",
    },
    requestDate: "2026-03-02",
    expenses: [
      {
        id: 3,
        date: "2026-03-01",
        category: "entertainment",
        description: "Client lunch",
        amount: 45000,
        receiptAttached: true,
        receiptNumber: "INV-2026-789",
        vendor: "The Grand Hotel",
      },
    ],
    totalAmount: 45000,
    status: "approved",
    paymentMethod: "bank_transfer",
    bankDetails: {
      bankName: "GT Bank",
      accountNumber: "0987654321",
      accountName: "Alice Johnson",
    },
    approvedBy: "Sales Manager",
    approvedDate: "2026-03-03T09:00:00",
    notes: "Client entertainment for Q1 review",
    attachments: [
      { id: 3, fileName: "lunch_invoice.pdf", fileUrl: "#", fileType: "pdf" },
    ],
    createdAt: "2026-03-02T11:00:00",
    updatedAt: "2026-03-03T09:00:00",
  },
  {
    id: 3,
    reimbursementNumber: "REIM-2026-0003",
    employee: {
      id: 103,
      name: "Bob Williams",
      email: "bob.williams@company.com",
      department: "IT",
      position: "IT Support",
      employeeCode: "EMP-003",
    },
    requestDate: "2026-03-03",
    expenses: [
      {
        id: 4,
        date: "2026-03-02",
        category: "supplies",
        description: "Keyboard and mouse",
        amount: 15000,
        receiptAttached: true,
        receiptNumber: "RC-2026-089",
        vendor: "Computer Village",
      },
      {
        id: 5,
        date: "2026-03-02",
        category: "transport",
        description: "Delivery fee",
        amount: 2000,
        receiptAttached: false,
        vendor: "Local Courier",
      },
    ],
    totalAmount: 17000,
    status: "pending",
    paymentMethod: "cash",
    notes: "Emergency IT equipment replacement",
    createdAt: "2026-03-03T10:00:00",
    updatedAt: "2026-03-03T10:00:00",
  },
  {
    id: 4,
    reimbursementNumber: "REIM-2026-0004",
    employee: {
      id: 104,
      name: "Carol Davis",
      email: "carol.davis@company.com",
      department: "HR",
      position: "HR Assistant",
      employeeCode: "EMP-004",
    },
    requestDate: "2026-03-01",
    expenses: [
      {
        id: 6,
        date: "2026-02-28",
        category: "training",
        description: "Training materials",
        amount: 35000,
        receiptAttached: true,
        receiptNumber: "INV-2026-234",
        vendor: "Training Hub",
      },
    ],
    totalAmount: 35000,
    status: "rejected",
    paymentMethod: "bank_transfer",
    bankDetails: {
      bankName: "Zenith Bank",
      accountNumber: "5555555555",
      accountName: "Carol Davis",
    },
    rejectedBy: "HR Director",
    rejectedDate: "2026-03-02T15:00:00",
    rejectionReason:
      "Training budget exhausted for this quarter. Please resubmit next month.",
    createdAt: "2026-03-01T14:00:00",
    updatedAt: "2026-03-02T15:00:00",
  },
  {
    id: 5,
    reimbursementNumber: "REIM-2026-0005",
    employee: {
      id: 105,
      name: "David Brown",
      email: "david.brown@company.com",
      department: "Operations",
      position: "Operations Manager",
      employeeCode: "EMP-005",
    },
    requestDate: "2026-03-04",
    expenses: [
      {
        id: 7,
        date: "2026-03-03",
        category: "travel",
        description: "Flight to Lagos",
        amount: 120000,
        receiptAttached: true,
        receiptNumber: "TK-2026-567",
        vendor: "Air Peace",
      },
      {
        id: 8,
        date: "2026-03-03",
        category: "transport",
        description: "Airport transfer",
        amount: 15000,
        receiptAttached: true,
        receiptNumber: "RC-2026-123",
        vendor: "Taxi Service",
      },
      {
        id: 9,
        date: "2026-03-03",
        category: "petty_cash",
        description: "Meal allowance",
        amount: 10000,
        receiptAttached: false,
      },
    ],
    totalAmount: 145000,
    status: "pending",
    paymentMethod: "bank_transfer",
    bankDetails: {
      bankName: "UBA",
      accountNumber: "7777777777",
      accountName: "David Brown",
    },
    notes: "Business trip to Lagos for stakeholder meeting",
    attachments: [
      { id: 4, fileName: "flight_ticket.pdf", fileUrl: "#", fileType: "pdf" },
      { id: 5, fileName: "receipts.pdf", fileUrl: "#", fileType: "pdf" },
    ],
    createdAt: "2026-03-04T09:30:00",
    updatedAt: "2026-03-04T09:30:00",
  },
  {
    id: 6,
    reimbursementNumber: "REIM-2026-0006",
    employee: {
      id: 106,
      name: "Emma Wilson",
      email: "emma.wilson@company.com",
      department: "Finance",
      position: "Accountant",
      employeeCode: "EMP-006",
    },
    requestDate: "2026-03-05",
    expenses: [
      {
        id: 10,
        date: "2026-03-04",
        category: "medical",
        description: "First aid kit supplies",
        amount: 25000,
        receiptAttached: true,
        receiptNumber: "RX-2026-345",
        vendor: "Pharmacy Plus",
      },
    ],
    totalAmount: 25000,
    status: "approved",
    paymentMethod: "bank_transfer",
    bankDetails: {
      bankName: "Access Bank",
      accountNumber: "9999999999",
      accountName: "Emma Wilson",
    },
    approvedBy: "Finance Manager",
    approvedDate: "2026-03-05T14:30:00",
    notes: "Office first aid kit replenishment",
    createdAt: "2026-03-05T10:00:00",
    updatedAt: "2026-03-05T14:30:00",
  },
];

const expenseCategories = [
  { value: "petty_cash", label: "Petty Cash", icon: Wallet },
  { value: "travel", label: "Travel", icon: Landmark },
  { value: "supplies", label: "Supplies", icon: FileText },
  { value: "entertainment", label: "Entertainment", icon: CreditCard },
  { value: "transport", label: "Transport", icon: Banknote },
  { value: "medical", label: "Medical", icon: AlertCircle },
  { value: "training", label: "Training", icon: TrendingUp },
  { value: "other", label: "Other", icon: File },
];

const departments = [
  "all",
  "Marketing",
  "Sales",
  "IT",
  "HR",
  "Operations",
  "Finance",
];
const statuses = [
  "all",
  "pending",
  "approved",
  "rejected",
  "paid",
  "cancelled",
];
const paymentMethods = ["all", "cash", "bank_transfer", "cheque"];

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

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: ReimbursementStatus) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-blue-100 text-blue-700",
    rejected: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    paid: "Paid",
    cancelled: "Cancelled",
  };

  return (
    <Badge className={`${styles[status]} flex items-center gap-1 w-fit`}>
      {status === "pending" && <Clock className="h-3 w-3" />}
      {status === "approved" && <CheckCircle className="h-3 w-3" />}
      {status === "rejected" && <XCircle className="h-3 w-3" />}
      {status === "paid" && <CheckCircle className="h-3 w-3" />}
      {labels[status]}
    </Badge>
  );
};

const getExpenseCategoryLabel = (value: string) => {
  return expenseCategories.find((c) => c.value === value)?.label || value;
};

export default function Reimbursements() {
  const router = useRouter();

  // State
  const [reimbursements, setReimbursements] =
    useState<Reimbursement[]>(mockReimbursements);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Reimbursement;
    direction: "asc" | "desc";
  }>({ key: "requestDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedReimbursement, setSelectedReimbursement] =
    useState<Reimbursement | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [activeTab, setActiveTab] = useState<"requests" | "summary">(
    "requests",
  );

  // Form state
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeEmail: "",
    employeeDepartment: "",
    employeeCode: "",
    expenses: [] as ExpenseItem[],
    paymentMethod: "bank_transfer" as PaymentMethod,
    bankName: "",
    accountNumber: "",
    accountName: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null,
  );
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalRequested = reimbursements.reduce(
      (sum, r) => sum + r.totalAmount,
      0,
    );
    const totalApproved = reimbursements
      .filter((r) => r.status === "approved" || r.status === "paid")
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const totalPaid = reimbursements
      .filter((r) => r.status === "paid")
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const totalRejected = reimbursements
      .filter((r) => r.status === "rejected")
      .reduce((sum, r) => sum + r.totalAmount, 0);
    const pendingCount = reimbursements.filter(
      (r) => r.status === "pending",
    ).length;

    return {
      totalRequested,
      totalApproved,
      totalPaid,
      totalRejected,
      pendingCount,
      totalRequests: reimbursements.length,
    };
  }, [reimbursements]);

  // Filter and sort
  const filteredReimbursements = useMemo(() => {
    let result = [...reimbursements];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.reimbursementNumber.toLowerCase().includes(query) ||
          r.employee.name.toLowerCase().includes(query) ||
          r.employee.email.toLowerCase().includes(query) ||
          r.notes?.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter((r) => r.employee.department === departmentFilter);
    }

    if (paymentMethodFilter !== "all") {
      result = result.filter((r) => r.paymentMethod === paymentMethodFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue =
          sortConfig.key === "requestDate"
            ? new Date(a.requestDate).getTime()
            : a[sortConfig.key];
        const bValue =
          sortConfig.key === "requestDate"
            ? new Date(b.requestDate).getTime()
            : b[sortConfig.key];

        return compareValues(aValue, bValue, sortConfig.direction);
      });
    }

    return result;
  }, [
    reimbursements,
    searchQuery,
    statusFilter,
    departmentFilter,
    paymentMethodFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredReimbursements.length / itemsPerPage);
  const paginatedReimbursements = filteredReimbursements.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof Reimbursement) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewReimbursement = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement);
    setIsViewModalOpen(true);
  };

  const handleEditReimbursement = (reimbursement: Reimbursement) => {
    setSelectedReimbursement(reimbursement);
    setFormData({
      employeeName: reimbursement.employee.name,
      employeeEmail: reimbursement.employee.email,
      employeeDepartment: reimbursement.employee.department,
      employeeCode: reimbursement.employee.employeeCode,
      expenses: [...reimbursement.expenses],
      paymentMethod: reimbursement.paymentMethod,
      bankName: reimbursement.bankDetails?.bankName || "",
      accountNumber: reimbursement.bankDetails?.accountNumber || "",
      accountName: reimbursement.bankDetails?.accountName || "",
      notes: reimbursement.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleAddExpense = () => {
    setEditingExpense(null);
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (expenseData: Partial<ExpenseItem>) => {
    if (editingExpense) {
      setFormData((prev) => ({
        ...prev,
        expenses: prev.expenses.map((e) =>
          e.id === editingExpense.id
            ? ({ ...e, ...expenseData } as ExpenseItem)
            : e,
        ),
      }));
    } else {
      const newExpense: ExpenseItem = {
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
        category: "petty_cash",
        description: "",
        amount: 0,
        receiptAttached: false,
        ...expenseData,
      };
      setFormData((prev) => ({
        ...prev,
        expenses: [...prev.expenses, newExpense],
      }));
    }
    setIsExpenseModalOpen(false);
    setEditingExpense(null);
  };

  const handleRemoveExpense = (expenseId: number) => {
    setFormData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== expenseId),
    }));
  };

  const calculateTotalAmount = () => {
    return formData.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.employeeName)
      errors.employeeName = "Employee name is required";
    if (formData.expenses.length === 0)
      errors.expenses = "At least one expense is required";
    if (calculateTotalAmount() <= 0)
      errors.totalAmount = "Total amount must be greater than 0";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateReimbursement = () => {
    if (!validateForm()) return;

    const newReimbursement: Reimbursement = {
      id: Math.max(...reimbursements.map((r) => r.id), 0) + 1,
      reimbursementNumber: `REIM-${new Date().getFullYear()}-${String(reimbursements.length + 1).padStart(4, "0")}`,
      employee: {
        id: Date.now(),
        name: formData.employeeName,
        email: formData.employeeEmail,
        department: formData.employeeDepartment,
        position: "Employee",
        employeeCode: formData.employeeCode,
      },
      requestDate: new Date().toISOString().split("T")[0],
      expenses: formData.expenses,
      totalAmount: calculateTotalAmount(),
      status: "pending",
      paymentMethod: formData.paymentMethod,
      bankDetails:
        formData.paymentMethod === "bank_transfer"
          ? {
              bankName: formData.bankName,
              accountNumber: formData.accountNumber,
              accountName: formData.accountName,
            }
          : undefined,
      notes: formData.notes,
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReimbursements((prev) => [newReimbursement, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateReimbursement = () => {
    if (!validateForm() || !selectedReimbursement) return;

    const updatedReimbursement: Reimbursement = {
      ...selectedReimbursement,
      employee: {
        ...selectedReimbursement.employee,
        name: formData.employeeName,
        email: formData.employeeEmail,
        department: formData.employeeDepartment,
        employeeCode: formData.employeeCode,
      },
      expenses: formData.expenses,
      totalAmount: calculateTotalAmount(),
      paymentMethod: formData.paymentMethod,
      bankDetails:
        formData.paymentMethod === "bank_transfer"
          ? {
              bankName: formData.bankName,
              accountNumber: formData.accountNumber,
              accountName: formData.accountName,
            }
          : undefined,
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    };

    setReimbursements((prev) =>
      prev.map((r) =>
        r.id === selectedReimbursement.id ? updatedReimbursement : r,
      ),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedReimbursement(null);
  };

  const handleApproveReimbursement = () => {
    if (!selectedReimbursement) return;

    setReimbursements((prev) =>
      prev.map((r) =>
        r.id === selectedReimbursement.id
          ? {
              ...r,
              status: "approved",
              approvedBy: "Current Approver",
              approvedDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsApproveDialogOpen(false);
    setSelectedReimbursement(null);
  };

  const handleRejectReimbursement = () => {
    if (!selectedReimbursement) return;

    setReimbursements((prev) =>
      prev.map((r) =>
        r.id === selectedReimbursement.id
          ? {
              ...r,
              status: "rejected",
              rejectedBy: "Current Approver",
              rejectedDate: new Date().toISOString(),
              rejectionReason,
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsRejectDialogOpen(false);
    setSelectedReimbursement(null);
    setRejectionReason("");
  };

  const handlePayReimbursement = () => {
    if (!selectedReimbursement) return;

    setReimbursements((prev) =>
      prev.map((r) =>
        r.id === selectedReimbursement.id
          ? {
              ...r,
              status: "paid",
              paidBy: "Finance Officer",
              paidDate: new Date().toISOString(),
              transactionReference: transactionRef,
              updatedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setIsPayDialogOpen(false);
    setSelectedReimbursement(null);
    setTransactionRef("");
  };

  const handleDeleteReimbursement = () => {
    if (!selectedReimbursement) return;
    setReimbursements((prev) =>
      prev.filter((r) => r.id !== selectedReimbursement.id),
    );
    setIsDeleteDialogOpen(false);
    setSelectedReimbursement(null);
  };

  const resetForm = () => {
    setFormData({
      employeeName: "",
      employeeEmail: "",
      employeeDepartment: "",
      employeeCode: "",
      expenses: [],
      paymentMethod: "bank_transfer",
      bankName: "",
      accountNumber: "",
      accountName: "",
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Reimbursement #",
      "Date",
      "Employee",
      "Department",
      "Total Amount",
      "Status",
      "Payment Method",
      "Notes",
    ];
    const csvData = filteredReimbursements.map((r) => [
      r.reimbursementNumber,
      formatDate(r.requestDate),
      r.employee.name,
      r.employee.department,
      r.totalAmount.toString(),
      r.status,
      r.paymentMethod,
      r.notes || "",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reimbursements-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setReimbursements([...mockReimbursements]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setDepartmentFilter("all");
    setPaymentMethodFilter("all");
  };

  // Expense Modal Component
  const ExpenseModal = () => {
    const [expenseData, setExpenseData] = useState<Partial<ExpenseItem>>(
      editingExpense || {
        date: new Date().toISOString().split("T")[0],
        category: "petty_cash",
        description: "",
        amount: 0,
        receiptAttached: false,
        vendor: "",
      },
    );

    const handleSave = () => {
      if (
        !expenseData.description ||
        !expenseData.amount ||
        expenseData.amount <= 0
      ) {
        return;
      }
      handleSaveExpense(expenseData);
    };

    return (
      <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingExpense ? "Edit Expense" : "Add Expense"}
            </DialogTitle>
            <DialogDescription>Enter expense details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={expenseData.date}
                onChange={(e) =>
                  setExpenseData((prev) => ({ ...prev, date: e.target.value }))
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={expenseData.category}
                onValueChange={(v) =>
                  setExpenseData((prev) => ({ ...prev, category: v }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description *</Label>
              <Input
                value={expenseData.description}
                onChange={(e) =>
                  setExpenseData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="What was this expense for?"
              />
            </div>
            <div>
              <Label>Amount (₦) *</Label>
              <Input
                type="number"
                value={expenseData.amount || ""}
                onChange={(e) =>
                  setExpenseData((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                className="mt-1"
                placeholder="0"
              />
            </div>
            <div>
              <Label>Vendor</Label>
              <Input
                value={expenseData.vendor || ""}
                onChange={(e) =>
                  setExpenseData((prev) => ({
                    ...prev,
                    vendor: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="Vendor name"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={expenseData.receiptAttached}
                onChange={(e) =>
                  setExpenseData((prev) => ({
                    ...prev,
                    receiptAttached: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />
              <Label>Receipt Attached</Label>
            </div>
            {expenseData.receiptAttached && (
              <div>
                <Label>Receipt Number</Label>
                <Input
                  value={expenseData.receiptNumber || ""}
                  onChange={(e) =>
                    setExpenseData((prev) => ({
                      ...prev,
                      receiptNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Receipt/invoice number"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsExpenseModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
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
              <Receipt className="h-6 w-6" />
              Reimbursements
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage employee expense reimbursements
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
            New Request
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requested</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalRequested)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved/Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalApproved)}
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
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingCount}
                </p>
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
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{stats.totalRequests}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Receipt className="h-5 w-5 text-purple-600" />
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
                placeholder="Search by #, employee, notes..."
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
                  <SelectItem key={status} value={status}>
                    {status === "all"
                      ? "All Status"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
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
              <SelectTrigger className="w-full sm:w-[150px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Dept" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Depts" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={paymentMethodFilter}
              onValueChange={(v) => {
                setPaymentMethodFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <CreditCard className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method === "all"
                      ? "All Methods"
                      : method.replace("_", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reimbursements Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("reimbursementNumber")}
                    >
                      Reimbursement #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("requestDate")}
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("totalAmount")}
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedReimbursements.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No reimbursements found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedReimbursements.map((reimbursement) => (
                    <TableRow key={reimbursement.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {reimbursement.reimbursementNumber}
                      </TableCell>
                      <TableCell>
                        {formatDate(reimbursement.requestDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {reimbursement.employee.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {reimbursement.employee.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{reimbursement.employee.department}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(reimbursement.totalAmount)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reimbursement.status)}
                      </TableCell>
                      <TableCell className="capitalize">
                        {reimbursement.paymentMethod.replace("_", " ")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleViewReimbursement(reimbursement)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {reimbursement.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditReimbursement(reimbursement)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedReimbursement(reimbursement);
                                  setIsApproveDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedReimbursement(reimbursement);
                                  setIsRejectDialogOpen(true);
                                }}
                                className="text-red-600"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {reimbursement.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedReimbursement(reimbursement);
                                setIsPayDialogOpen(true);
                              }}
                              className="text-blue-600"
                            >
                              <DollarSign className="h-4 w-4" />
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
          {filteredReimbursements.length > 0 && (
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
                    filteredReimbursements.length,
                  )}{" "}
                  of {filteredReimbursements.length}
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

      {/* View Reimbursement Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Reimbursement Details</span>
              {selectedReimbursement &&
                getStatusBadge(selectedReimbursement.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedReimbursement?.reimbursementNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedReimbursement && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Request Date</p>
                  <p>{formatDate(selectedReimbursement.requestDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(selectedReimbursement.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Employee Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{selectedReimbursement.employee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedReimbursement.employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p>{selectedReimbursement.employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Employee Code
                    </p>
                    <p>{selectedReimbursement.employee.employeeCode}</p>
                  </div>
                </div>
              </div>

              {/* Expenses */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Expenses</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedReimbursement.expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell>
                          {getExpenseCategoryLabel(expense.category)}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.vendor || "-"}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Payment Details */}
              {selectedReimbursement.bankDetails && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Bank</p>
                      <p>{selectedReimbursement.bankDetails.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Number
                      </p>
                      <p>{selectedReimbursement.bankDetails.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Account Name
                      </p>
                      <p>{selectedReimbursement.bankDetails.accountName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Approval/Rejection/ Payment Info */}
              {(selectedReimbursement.approvedBy ||
                selectedReimbursement.rejectedBy ||
                selectedReimbursement.paidBy) && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Processing Information</h3>
                  <div className="space-y-2">
                    {selectedReimbursement.approvedBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          Approved by {selectedReimbursement.approvedBy} on{" "}
                          {formatDateTime(selectedReimbursement.approvedDate!)}
                        </span>
                      </div>
                    )}
                    {selectedReimbursement.paidBy && (
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span>
                          Paid by {selectedReimbursement.paidBy} on{" "}
                          {formatDateTime(selectedReimbursement.paidDate!)}
                        </span>
                        {selectedReimbursement.transactionReference && (
                          <span className="text-muted-foreground">
                            Ref: {selectedReimbursement.transactionReference}
                          </span>
                        )}
                      </div>
                    )}
                    {selectedReimbursement.rejectedBy && (
                      <div className="flex items-start gap-2 text-sm text-red-600">
                        <XCircle className="h-4 w-4 mt-0.5" />
                        <div>
                          <span>
                            Rejected by {selectedReimbursement.rejectedBy} on{" "}
                            {formatDateTime(
                              selectedReimbursement.rejectedDate!,
                            )}
                          </span>
                          <p className="text-sm mt-1">
                            {selectedReimbursement.rejectionReason}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedReimbursement.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedReimbursement.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedReimbursement &&
              selectedReimbursement.status === "pending" && (
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedReimbursement(selectedReimbursement);
                    setIsApproveDialogOpen(true);
                  }}
                >
                  Approve Request
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Reimbursement Modal */}
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
              {isCreateModalOpen
                ? "New Reimbursement Request"
                : "Edit Reimbursement"}
            </DialogTitle>
            <DialogDescription>
              Submit employee expense reimbursement request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Employee Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Employee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Employee Name *</Label>
                  <Input
                    value={formData.employeeName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeName: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Full name"
                  />
                  {formErrors.employeeName && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.employeeName}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Employee Email</Label>
                  <Input
                    type="email"
                    value={formData.employeeEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeEmail: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="email@company.com"
                  />
                </div>
                <div>
                  <Label>Department</Label>
                  <Select
                    value={formData.employeeDepartment}
                    onValueChange={(v) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeDepartment: v,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments
                        .filter((d) => d !== "all")
                        .map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Employee Code</Label>
                  <Input
                    value={formData.employeeCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employeeCode: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="EMP-XXX"
                  />
                </div>
              </div>
            </div>

            {/* Expenses */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Expenses</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddExpense}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>

              {formData.expenses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell>
                          {getExpenseCategoryLabel(expense.category)}
                        </TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditExpense(expense)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveExpense(expense.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2 font-bold">
                      <TableCell colSpan={3} className="text-right">
                        Total:
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(calculateTotalAmount())}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Receipt className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">No expenses added</p>
                  <Button variant="link" onClick={handleAddExpense}>
                    Add your first expense
                  </Button>
                </div>
              )}
              {formErrors.expenses && (
                <p className="text-sm text-red-500 mt-2">
                  {formErrors.expenses}
                </p>
              )}
            </div>

            {/* Payment Details */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(v: any) =>
                      setFormData((prev) => ({ ...prev, paymentMethod: v }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.paymentMethod === "bank_transfer" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label>Bank Name</Label>
                    <Input
                      value={formData.bankName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bankName: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Bank name"
                    />
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Account number"
                    />
                  </div>
                  <div>
                    <Label>Account Name</Label>
                    <Input
                      value={formData.accountName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          accountName: e.target.value,
                        }))
                      }
                      className="mt-1"
                      placeholder="Account holder name"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="border-t pt-4">
              <Label>Additional Notes</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1"
                rows={3}
                placeholder="Any additional information..."
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
              onClick={
                isCreateModalOpen
                  ? handleCreateReimbursement
                  : handleUpdateReimbursement
              }
            >
              {isCreateModalOpen ? "Submit Request" : "Save Changes"}
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
            <AlertDialogTitle>Approve Reimbursement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this reimbursement request?
              {selectedReimbursement && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedReimbursement.reimbursementNumber}
                  </p>
                  <p className="text-sm">
                    Amount: {formatCurrency(selectedReimbursement.totalAmount)}
                  </p>
                  <p className="text-sm">
                    Employee: {selectedReimbursement.employee.name}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveReimbursement}
              className="bg-green-600 hover:bg-green-700"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog
        open={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Reimbursement</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this request.
              {selectedReimbursement && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedReimbursement.reimbursementNumber}
                  </p>
                  <p className="text-sm">
                    Amount: {formatCurrency(selectedReimbursement.totalAmount)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Rejection Reason *</Label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              rows={3}
              placeholder="Please explain why this request is being rejected..."
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRejectionReason("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRejectReimbursement}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pay Dialog */}
      <AlertDialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Process Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm payment for this approved reimbursement.
              {selectedReimbursement && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedReimbursement.reimbursementNumber}
                  </p>
                  <p className="text-lg font-bold">
                    {formatCurrency(selectedReimbursement.totalAmount)}
                  </p>
                  <p className="text-sm">
                    To: {selectedReimbursement.employee.name}
                  </p>
                  {selectedReimbursement.bankDetails && (
                    <div className="mt-2 text-sm">
                      <p>Bank: {selectedReimbursement.bankDetails.bankName}</p>
                      <p>
                        Account:{" "}
                        {selectedReimbursement.bankDetails.accountNumber}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label>Transaction Reference</Label>
            <Input
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="mt-2"
              placeholder="Transaction ID / Reference number"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTransactionRef("")}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePayReimbursement}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirm Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Expense Modal */}
      <ExpenseModal />
    </div>
  );
}
