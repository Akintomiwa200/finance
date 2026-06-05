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
  FileText,
  DollarSign,
  Calendar,
  Building2,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Receipt,
  Send,
  Printer,
  MoreHorizontal,
  PlusCircle,
  MinusCircle,
  Mail,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Package,
  FileCode,
  BadgeDollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type CreditNoteStatus = "draft" | "issued" | "applied" | "cancelled";
type CreditNoteReason =
  | "product_return"
  | "price_adjustment"
  | "damaged_goods"
  | "service_issue"
  | "billing_error"
  | "goodwill"
  | "other";

interface CreditNoteLineItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  originalInvoiceItemId?: number;
}

interface CreditNote {
  id: number;
  creditNoteNumber: string;
  customer: {
    id: number;
    name: string;
    code: string;
    email: string;
    phone: string;
  };
  originalInvoice?: {
    id: number;
    invoiceNumber: string;
    date: string;
    amount: number;
  };
  issueDate: string;
  expiryDate?: string;
  reason: CreditNoteReason;
  reasonDescription?: string;
  status: CreditNoteStatus;
  lineItems: CreditNoteLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  remainingAmount: number;
  currency: string;
  appliedToInvoices?: {
    id: number;
    invoiceNumber: string;
    amount: number;
    date: string;
  }[];
  createdBy: {
    id: number;
    name: string;
  };
  approvedBy?: {
    id: number;
    name: string;
    date: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock Customers
const mockCustomers = [
  {
    id: 1,
    name: "Nigerian Breweries PLC",
    code: "CUST-001",
    email: "accounts@nbplc.com",
    phone: "+234 800 123 4567",
  },
  {
    id: 2,
    name: "MTN Nigeria",
    code: "CUST-002",
    email: "accounts@mtn.ng",
    phone: "+234 700 123 4567",
  },
  {
    id: 3,
    name: "Lagos State Government",
    code: "CUST-003",
    email: "procurement@lagosstate.gov.ng",
    phone: "+234 800 456 7890",
  },
  {
    id: 4,
    name: "Access Bank Plc",
    code: "CUST-004",
    email: "supplier@accessbank.com",
    phone: "+234 800 789 0123",
  },
];

// Mock Invoices
const mockInvoices = [
  {
    id: 1,
    invoiceNumber: "INV-2026-0001",
    customer: mockCustomers[0],
    date: "2026-03-01",
    amount: 6718750,
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-0002",
    customer: mockCustomers[1],
    date: "2026-03-05",
    amount: 5309375,
  },
  {
    id: 3,
    invoiceNumber: "INV-2026-0003",
    customer: mockCustomers[2],
    date: "2026-03-10",
    amount: 8600000,
  },
  {
    id: 4,
    invoiceNumber: "INV-2026-0004",
    customer: mockCustomers[3],
    date: "2026-03-12",
    amount: 14512500,
  },
];

// Mock Credit Notes
const mockCreditNotes: CreditNote[] = [
  {
    id: 1,
    creditNoteNumber: "CN-2026-0001",
    customer: mockCustomers[0],
    originalInvoice: mockInvoices[0],
    issueDate: "2026-03-15",
    expiryDate: "2026-06-15",
    reason: "product_return",
    reasonDescription: "Return of damaged goods",
    status: "issued",
    lineItems: [
      {
        id: 1,
        description: "Damaged product return",
        quantity: 2,
        unitPrice: 50000,
        discount: 0,
        tax: 7.5,
        total: 107500,
      },
    ],
    subtotal: 100000,
    discountTotal: 0,
    taxTotal: 7500,
    totalAmount: 107500,
    remainingAmount: 107500,
    currency: "NGN",
    createdBy: { id: 1, name: "John Smith" },
    approvedBy: { id: 2, name: "Finance Manager", date: "2026-03-15T10:00:00" },
    notes: "Customer returned damaged products",
    createdAt: "2026-03-15T09:00:00",
    updatedAt: "2026-03-15T10:00:00",
  },
  {
    id: 2,
    creditNoteNumber: "CN-2026-0002",
    customer: mockCustomers[1],
    originalInvoice: mockInvoices[1],
    issueDate: "2026-03-20",
    expiryDate: "2026-06-20",
    reason: "price_adjustment",
    reasonDescription: "Price adjustment for bulk purchase",
    status: "applied",
    lineItems: [
      {
        id: 2,
        description: "Price adjustment - bulk discount",
        quantity: 1,
        unitPrice: 250000,
        discount: 0,
        tax: 7.5,
        total: 268750,
      },
    ],
    subtotal: 250000,
    discountTotal: 0,
    taxTotal: 18750,
    totalAmount: 268750,
    remainingAmount: 100000,
    currency: "NGN",
    appliedToInvoices: [
      {
        id: 2,
        invoiceNumber: "INV-2026-0002",
        amount: 168750,
        date: "2026-03-21",
      },
    ],
    createdBy: { id: 1, name: "Alice Johnson" },
    approvedBy: { id: 2, name: "Sales Manager", date: "2026-03-20T14:00:00" },
    notes: "Volume discount adjustment",
    createdAt: "2026-03-20T11:00:00",
    updatedAt: "2026-03-21T09:00:00",
  },
  {
    id: 3,
    creditNoteNumber: "CN-2026-0003",
    customer: mockCustomers[2],
    issueDate: "2026-03-25",
    reason: "service_issue",
    reasonDescription: "Service delivery delay compensation",
    status: "draft",
    lineItems: [
      {
        id: 3,
        description: "Service credit for delayed delivery",
        quantity: 1,
        unitPrice: 500000,
        discount: 0,
        tax: 7.5,
        total: 537500,
      },
    ],
    subtotal: 500000,
    discountTotal: 0,
    taxTotal: 37500,
    totalAmount: 537500,
    remainingAmount: 537500,
    currency: "NGN",
    createdBy: { id: 1, name: "Bid Manager" },
    notes: "Pending approval",
    createdAt: "2026-03-25T09:00:00",
    updatedAt: "2026-03-25T09:00:00",
  },
  {
    id: 4,
    creditNoteNumber: "CN-2026-0004",
    customer: mockCustomers[3],
    originalInvoice: mockInvoices[3],
    issueDate: "2026-03-18",
    expiryDate: "2026-06-18",
    reason: "billing_error",
    reasonDescription: "Incorrect billing amount",
    status: "applied",
    lineItems: [
      {
        id: 4,
        description: "Billing correction",
        quantity: 1,
        unitPrice: 150000,
        discount: 0,
        tax: 7.5,
        total: 161250,
      },
    ],
    subtotal: 150000,
    discountTotal: 0,
    taxTotal: 11250,
    totalAmount: 161250,
    remainingAmount: 0,
    currency: "NGN",
    appliedToInvoices: [
      {
        id: 4,
        invoiceNumber: "INV-2026-0004",
        amount: 161250,
        date: "2026-03-19",
      },
    ],
    createdBy: { id: 1, name: "Finance Officer" },
    approvedBy: {
      id: 2,
      name: "Finance Director",
      date: "2026-03-18T15:00:00",
    },
    notes: "Corrected billing amount",
    createdAt: "2026-03-18T14:00:00",
    updatedAt: "2026-03-19T10:00:00",
  },
];

const creditNoteStatuses = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  { value: "issued", label: "Issued", color: "bg-blue-100 text-blue-700" },
  { value: "applied", label: "Applied", color: "bg-green-100 text-green-700" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
];

const creditNoteReasons = [
  { value: "product_return", label: "Product Return" },
  { value: "price_adjustment", label: "Price Adjustment" },
  { value: "damaged_goods", label: "Damaged Goods" },
  { value: "service_issue", label: "Service Issue" },
  { value: "billing_error", label: "Billing Error" },
  { value: "goodwill", label: "Goodwill" },
  { value: "other", label: "Other" },
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

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: CreditNoteStatus) => {
  const config = creditNoteStatuses.find((s) => s.value === status);
  const icons = {
    draft: <FileText className="h-3 w-3 mr-1" />,
    issued: <Send className="h-3 w-3 mr-1" />,
    applied: <CheckCircle className="h-3 w-3 mr-1" />,
    cancelled: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getReasonLabel = (reason: CreditNoteReason) => {
  return creditNoteReasons.find((r) => r.value === reason)?.label || reason;
};

export default function CreditNotes() {
  const router = useRouter();

  // State
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>(mockCreditNotes);
  const [customers] = useState(mockCustomers);
  const [invoices] = useState(mockInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [reasonFilter, setReasonFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CreditNote;
    direction: "asc" | "desc";
  }>({ key: "issueDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCreditNote, setSelectedCreditNote] =
    useState<CreditNote | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"credit_notes" | "analytics">(
    "credit_notes",
  );

  // Form state
  const [formData, setFormData] = useState({
    customerId: 0,
    invoiceId: 0,
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    reason: "product_return" as CreditNoteReason,
    reasonDescription: "",
    lineItems: [] as CreditNoteLineItem[],
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingItem, setEditingItem] = useState<CreditNoteLineItem | null>(
    null,
  );
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [applyToInvoiceId, setApplyToInvoiceId] = useState<number | null>(null);
  const [applyAmount, setApplyAmount] = useState(0);

  // Statistics
  const stats = useMemo(() => {
    const totalCreditNotes = creditNotes.length;
    const totalAmount = creditNotes.reduce(
      (sum, cn) => sum + cn.totalAmount,
      0,
    );
    const remainingAmount = creditNotes.reduce(
      (sum, cn) => sum + cn.remainingAmount,
      0,
    );
    const appliedAmount = totalAmount - remainingAmount;
    const issuedCount = creditNotes.filter(
      (cn) => cn.status === "issued",
    ).length;
    const appliedCount = creditNotes.filter(
      (cn) => cn.status === "applied",
    ).length;
    const draftCount = creditNotes.filter((cn) => cn.status === "draft").length;

    return {
      totalCreditNotes,
      totalAmount,
      remainingAmount,
      appliedAmount,
      issuedCount,
      appliedCount,
      draftCount,
      utilizationRate:
        totalAmount > 0 ? (appliedAmount / totalAmount) * 100 : 0,
    };
  }, [creditNotes]);

  // Filter and sort
  const filteredCreditNotes = useMemo(() => {
    let result = [...creditNotes];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (cn) =>
          cn.creditNoteNumber.toLowerCase().includes(query) ||
          cn.customer.name.toLowerCase().includes(query) ||
          cn.reasonDescription?.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((cn) => cn.status === statusFilter);
    }

    if (customerFilter !== "all") {
      result = result.filter(
        (cn) => cn.customer.id === parseInt(customerFilter),
      );
    }

    if (reasonFilter !== "all") {
      result = result.filter((cn) => cn.reason === reasonFilter);
    }

    if (dateRange.from) {
      result = result.filter((cn) => cn.issueDate >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((cn) => cn.issueDate <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "issueDate") {
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
    creditNotes,
    searchQuery,
    statusFilter,
    customerFilter,
    reasonFilter,
    dateRange,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredCreditNotes.length / itemsPerPage);
  const paginatedCreditNotes = filteredCreditNotes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate line item totals
  const calculateItemTotal = (item: CreditNoteLineItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = discountedSubtotal * (item.tax / 100);
    return discountedSubtotal + taxAmount;
  };

  const calculateCreditNoteTotals = (items: CreditNoteLineItem[]) => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const discountTotal = items.reduce(
      (sum, item) =>
        sum + item.quantity * item.unitPrice * (item.discount / 100),
      0,
    );
    const discountedSubtotal = subtotal - discountTotal;
    const taxTotal = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice;
      const itemDiscount = itemSubtotal * (item.discount / 100);
      return sum + (itemSubtotal - itemDiscount) * (item.tax / 100);
    }, 0);
    return { subtotal, discountTotal, taxTotal };
  };

  // Handlers
  const handleSort = (key: keyof CreditNote) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewCreditNote = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setIsViewModalOpen(true);
  };

  const handleEditCreditNote = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setFormData({
      customerId: creditNote.customer.id,
      invoiceId: creditNote.originalInvoice?.id || 0,
      issueDate: creditNote.issueDate,
      expiryDate: creditNote.expiryDate || "",
      reason: creditNote.reason,
      reasonDescription: creditNote.reasonDescription || "",
      lineItems: [...creditNote.lineItems],
      notes: creditNote.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: CreditNoteLineItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<CreditNoteLineItem>) => {
    if (editingItem) {
      setFormData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item) =>
          item.id === editingItem.id
            ? ({ ...item, ...itemData } as CreditNoteLineItem)
            : item,
        ),
      }));
    } else {
      const newItem: CreditNoteLineItem = {
        id: Date.now(),
        description: itemData.description || "",
        quantity: itemData.quantity || 1,
        unitPrice: itemData.unitPrice || 0,
        discount: itemData.discount || 0,
        tax: itemData.tax || 7.5,
        total: 0,
      };
      setFormData((prev) => ({
        ...prev,
        lineItems: [...prev.lineItems, newItem],
      }));
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleRemoveItem = (itemId: number) => {
    setFormData((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== itemId),
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.customerId) errors.customerId = "Customer is required";
    if (!formData.issueDate) errors.issueDate = "Issue date is required";
    if (!formData.reason) errors.reason = "Reason is required";
    if (formData.lineItems.length === 0)
      errors.lineItems = "At least one line item is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCreditNote = () => {
    if (!validateForm()) return;

    const selectedCustomer = customers.find(
      (c) => c.id === formData.customerId,
    );
    const selectedInvoice = invoices.find((i) => i.id === formData.invoiceId);
    const { subtotal, discountTotal, taxTotal } = calculateCreditNoteTotals(
      formData.lineItems,
    );
    const totalAmount = subtotal - discountTotal + taxTotal;

    const newCreditNote: CreditNote = {
      id: Math.max(...creditNotes.map((cn) => cn.id), 0) + 1,
      creditNoteNumber: `CN-${new Date().getFullYear()}-${String(creditNotes.length + 1).padStart(4, "0")}`,
      customer: selectedCustomer!,
      originalInvoice: selectedInvoice,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      reason: formData.reason,
      reasonDescription: formData.reasonDescription,
      status: "draft",
      lineItems: formData.lineItems.map((item) => ({
        ...item,
        total: calculateItemTotal(item),
      })),
      subtotal,
      discountTotal,
      taxTotal,
      totalAmount,
      remainingAmount: totalAmount,
      currency: "NGN",
      createdBy: { id: 1, name: "Current User" },
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCreditNotes((prev) => [newCreditNote, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateCreditNote = () => {
    if (!validateForm() || !selectedCreditNote) return;

    const selectedCustomer = customers.find(
      (c) => c.id === formData.customerId,
    );
    const selectedInvoice = invoices.find((i) => i.id === formData.invoiceId);
    const { subtotal, discountTotal, taxTotal } = calculateCreditNoteTotals(
      formData.lineItems,
    );
    const totalAmount = subtotal - discountTotal + taxTotal;

    const updatedCreditNote: CreditNote = {
      ...selectedCreditNote,
      customer: selectedCustomer!,
      originalInvoice: selectedInvoice,
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      reason: formData.reason,
      reasonDescription: formData.reasonDescription,
      lineItems: formData.lineItems.map((item) => ({
        ...item,
        total: calculateItemTotal(item),
      })),
      subtotal,
      discountTotal,
      taxTotal,
      totalAmount,
      remainingAmount:
        totalAmount -
        (selectedCreditNote.totalAmount - selectedCreditNote.remainingAmount),
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    };

    setCreditNotes((prev) =>
      prev.map((cn) =>
        cn.id === selectedCreditNote.id ? updatedCreditNote : cn,
      ),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedCreditNote(null);
  };

  const handleApplyCreditNote = () => {
    if (!selectedCreditNote || !applyToInvoiceId || applyAmount <= 0) return;

    const newRemainingAmount = selectedCreditNote.remainingAmount - applyAmount;
    const newStatus = newRemainingAmount <= 0 ? "applied" : "issued";

    const appliedInvoice = invoices.find((i) => i.id === applyToInvoiceId);

    const updatedCreditNote: CreditNote = {
      ...selectedCreditNote,
      remainingAmount: newRemainingAmount,
      status: newStatus,
      appliedToInvoices: [
        ...(selectedCreditNote.appliedToInvoices || []),
        {
          id: applyToInvoiceId,
          invoiceNumber: appliedInvoice?.invoiceNumber || "",
          amount: applyAmount,
          date: new Date().toISOString().split("T")[0],
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    setCreditNotes((prev) =>
      prev.map((cn) =>
        cn.id === selectedCreditNote.id ? updatedCreditNote : cn,
      ),
    );
    setIsApplyDialogOpen(false);
    setSelectedCreditNote(null);
    setApplyToInvoiceId(null);
    setApplyAmount(0);
  };

  const handleDeleteCreditNote = () => {
    if (!selectedCreditNote) return;
    setCreditNotes((prev) =>
      prev.filter((cn) => cn.id !== selectedCreditNote.id),
    );
    setIsDeleteDialogOpen(false);
    setSelectedCreditNote(null);
  };

  const handleIssueCreditNote = (creditNote: CreditNote) => {
    setCreditNotes((prev) =>
      prev.map((cn) =>
        cn.id === creditNote.id
          ? {
              ...cn,
              status: "issued",
              approvedBy: {
                id: 1,
                name: "Approver",
                date: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : cn,
      ),
    );
  };

  const resetForm = () => {
    setFormData({
      customerId: 0,
      invoiceId: 0,
      issueDate: new Date().toISOString().split("T")[0],
      expiryDate: "",
      reason: "product_return",
      reasonDescription: "",
      lineItems: [],
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Credit Note #",
      "Date",
      "Customer",
      "Reason",
      "Amount",
      "Remaining",
      "Status",
    ];
    const csvData = filteredCreditNotes.map((cn) => [
      cn.creditNoteNumber,
      formatDate(cn.issueDate),
      cn.customer.name,
      getReasonLabel(cn.reason),
      cn.totalAmount.toString(),
      cn.remainingAmount.toString(),
      cn.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `credit-notes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setCreditNotes([...mockCreditNotes]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setCustomerFilter("all");
    setReasonFilter("all");
    setDateRange({ from: "", to: "" });
  };

  // Item Modal Component
  const ItemModal = () => {
    const [itemData, setItemData] = useState<Partial<CreditNoteLineItem>>(
      editingItem || {
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 7.5,
      },
    );

    const handleSave = () => {
      if (!itemData.description || !itemData.quantity || !itemData.unitPrice) {
        return;
      }
      handleSaveItem(itemData);
    };

    return (
      <Dialog open={isItemModalOpen} onOpenChange={setIsItemModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Line Item" : "Add Line Item"}
            </DialogTitle>
            <DialogDescription>
              Enter credit note line item details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Description *</Label>
              <Input
                value={itemData.description || ""}
                onChange={(e) =>
                  setItemData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="Item description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Quantity *</Label>
                <Input
                  type="number"
                  value={itemData.quantity || ""}
                  onChange={(e) =>
                    setItemData((prev) => ({
                      ...prev,
                      quantity: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <Label>Unit Price (₦) *</Label>
                <Input
                  type="number"
                  value={itemData.unitPrice || ""}
                  onChange={(e) =>
                    setItemData((prev) => ({
                      ...prev,
                      unitPrice: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={itemData.discount || ""}
                  onChange={(e) =>
                    setItemData((prev) => ({
                      ...prev,
                      discount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Tax (%)</Label>
                <Input
                  type="number"
                  value={itemData.tax || ""}
                  onChange={(e) =>
                    setItemData((prev) => ({
                      ...prev,
                      tax: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="mt-1"
                  placeholder="7.5"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsItemModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Item</Button>
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
              <FileCode className="h-6 w-6" />
              Credit Notes
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage customer credit notes and adjustments
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
            New Credit Note
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
                  Total Credit Notes
                </p>
                <p className="text-2xl font-bold">{stats.totalCreditNotes}</p>
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
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalAmount)}
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
                  Remaining Credit
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.remainingAmount)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <BadgeDollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Utilization Rate
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.utilizationRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.appliedCount} applied, {stats.issuedCount} issued
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
                placeholder="Search by credit note #, customer..."
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
                {creditNoteStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={customerFilter}
              onValueChange={(v) => {
                setCustomerFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={reasonFilter}
              onValueChange={(v) => {
                setReasonFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reasons</SelectItem>
                {creditNoteReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
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

      {/* Credit Notes Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("creditNoteNumber")}
                    >
                      Credit Note #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("issueDate")}
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("totalAmount")}
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCreditNotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <FileCode className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No credit notes found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCreditNotes.map((creditNote) => (
                    <TableRow key={creditNote.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {creditNote.creditNoteNumber}
                      </TableCell>
                      <TableCell>{formatDate(creditNote.issueDate)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {creditNote.customer.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {creditNote.customer.code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getReasonLabel(creditNote.reason)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(creditNote.totalAmount)}
                      </TableCell>
                      <TableCell className="font-medium text-orange-600">
                        {formatCurrency(creditNote.remainingAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(creditNote.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCreditNote(creditNote)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {creditNote.status === "draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCreditNote(creditNote)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleIssueCreditNote(creditNote)
                                }
                                className="text-blue-600"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {creditNote.status === "issued" &&
                            creditNote.remainingAmount > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCreditNote(creditNote);
                                  setIsApplyDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
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
          {filteredCreditNotes.length > 0 && (
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
                    filteredCreditNotes.length,
                  )}{" "}
                  of {filteredCreditNotes.length}
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

      {/* View Credit Note Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Credit Note #{selectedCreditNote?.creditNoteNumber}</span>
              {selectedCreditNote && getStatusBadge(selectedCreditNote.status)}
            </DialogTitle>
            <DialogDescription>
              Customer: {selectedCreditNote?.customer.name} | Date:{" "}
              {selectedCreditNote && formatDate(selectedCreditNote.issueDate)}
            </DialogDescription>
          </DialogHeader>
          {selectedCreditNote && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reason</p>
                  <p className="font-medium">
                    {getReasonLabel(selectedCreditNote.reason)}
                  </p>
                  {selectedCreditNote.reasonDescription && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCreditNote.reasonDescription}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p>
                    {selectedCreditNote.expiryDate
                      ? formatDate(selectedCreditNote.expiryDate)
                      : "No expiry"}
                  </p>
                </div>
                {selectedCreditNote.originalInvoice && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Original Invoice
                      </p>
                      <p className="font-mono text-sm">
                        {selectedCreditNote.originalInvoice.invoiceNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Original Amount
                      </p>
                      <p>
                        {formatCurrency(
                          selectedCreditNote.originalInvoice.amount,
                        )}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Line Items */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Credit Note Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCreditNote.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.discount}%
                        </TableCell>
                        <TableCell className="text-right">
                          {item.tax}%
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableHeader>
                    <TableRow className="border-t-2">
                      <TableHead colSpan={5} className="text-right">
                        Subtotal:
                      </TableHead>
                      <TableHead className="text-right">
                        {formatCurrency(selectedCreditNote.subtotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right">
                        Discount:
                      </TableHead>
                      <TableHead className="text-right text-red-600">
                        -{formatCurrency(selectedCreditNote.discountTotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right">
                        Tax:
                      </TableHead>
                      <TableHead className="text-right">
                        {formatCurrency(selectedCreditNote.taxTotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right font-bold">
                        Total Credit:
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        {formatCurrency(selectedCreditNote.totalAmount)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right">
                        Remaining Credit:
                      </TableHead>
                      <TableHead className="text-right font-medium text-orange-600">
                        {formatCurrency(selectedCreditNote.remainingAmount)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Applied To Invoices */}
              {selectedCreditNote.appliedToInvoices &&
                selectedCreditNote.appliedToInvoices.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Applied To Invoices</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">
                            Amount Applied
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCreditNote.appliedToInvoices.map(
                          (applied, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-mono text-xs">
                                {applied.invoiceNumber}
                              </TableCell>
                              <TableCell>{formatDate(applied.date)}</TableCell>
                              <TableCell className="text-right text-green-600">
                                {formatCurrency(applied.amount)}
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}

              {selectedCreditNote.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedCreditNote.notes}</p>
                </div>
              )}

              {/* Approval Info */}
              {selectedCreditNote.approvedBy && (
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>
                      Approved by {selectedCreditNote.approvedBy.name} on{" "}
                      {formatDateTime(selectedCreditNote.approvedBy.date)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedCreditNote &&
              selectedCreditNote.status === "issued" &&
              selectedCreditNote.remainingAmount > 0 && (
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedCreditNote(selectedCreditNote);
                    setIsApplyDialogOpen(true);
                  }}
                >
                  Apply to Invoice
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Credit Note Modal */}
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
              {isCreateModalOpen ? "Create Credit Note" : "Edit Credit Note"}
            </DialogTitle>
            <DialogDescription>
              Issue a credit note to a customer
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Customer *</Label>
                <Select
                  value={formData.customerId?.toString() || ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      customerId: parseInt(v),
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                      >
                        {customer.name} ({customer.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.customerId && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.customerId}
                  </p>
                )}
              </div>
              <div>
                <Label>Related Invoice (Optional)</Label>
                <Select
                  value={formData.invoiceId?.toString() || ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, invoiceId: parseInt(v) }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select invoice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {invoices
                      .filter((i) => i.customer.id === formData.customerId)
                      .map((invoice) => (
                        <SelectItem
                          key={invoice.id}
                          value={invoice.id.toString()}
                        >
                          {invoice.invoiceNumber} -{" "}
                          {formatCurrency(invoice.amount)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Issue Date *</Label>
                <Input
                  type="date"
                  value={formData.issueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      issueDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
                {formErrors.issueDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.issueDate}
                  </p>
                )}
              </div>
              <div>
                <Label>Expiry Date (Optional)</Label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiryDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Reason *</Label>
                <Select
                  value={formData.reason}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, reason: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {creditNoteReasons.map((reason) => (
                      <SelectItem key={reason.value} value={reason.value}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.reason && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.reason}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <Label>Reason Description</Label>
                <Textarea
                  value={formData.reasonDescription}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      reasonDescription: e.target.value,
                    }))
                  }
                  className="mt-1"
                  rows={2}
                  placeholder="Detailed explanation of the credit note reason..."
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Credit Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {formData.lineItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {formData.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.discount}%
                        </TableCell>
                        <TableCell className="text-right">
                          {item.tax}%
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(calculateItemTotal(item))}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">No credit items added</p>
                  <Button variant="link" onClick={handleAddItem}>
                    Add your first item
                  </Button>
                </div>
              )}
              {formErrors.lineItems && (
                <p className="text-sm text-red-500 mt-2">
                  {formErrors.lineItems}
                </p>
              )}
            </div>

            {/* Notes */}
            <div className="border-t pt-4">
              <Label>Notes (Optional)</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                className="mt-1"
                rows={3}
                placeholder="Internal notes about this credit note..."
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
                  ? handleCreateCreditNote
                  : handleUpdateCreditNote
              }
            >
              {isCreateModalOpen ? "Create Credit Note" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Apply to Invoice Dialog */}
      <AlertDialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apply Credit Note</AlertDialogTitle>
            <AlertDialogDescription>
              Apply this credit note to an outstanding invoice.
              {selectedCreditNote && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">
                    {selectedCreditNote.creditNoteNumber}
                  </p>
                  <p>
                    Available Credit:{" "}
                    {formatCurrency(selectedCreditNote.remainingAmount)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Select Invoice *</Label>
              <Select
                value={applyToInvoiceId?.toString() || ""}
                onValueChange={(v) => setApplyToInvoiceId(parseInt(v))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select invoice to apply credit" />
                </SelectTrigger>
                <SelectContent>
                  {invoices
                    .filter(
                      (i) =>
                        i.customer.id === selectedCreditNote?.customer.id &&
                        i.amount > 0,
                    )
                    .map((invoice) => (
                      <SelectItem
                        key={invoice.id}
                        value={invoice.id.toString()}
                      >
                        {invoice.invoiceNumber} -{" "}
                        {formatCurrency(invoice.amount)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount to Apply *</Label>
              <Input
                type="number"
                value={applyAmount || ""}
                onChange={(e) =>
                  setApplyAmount(parseFloat(e.target.value) || 0)
                }
                className="mt-1"
                placeholder="0"
                max={selectedCreditNote?.remainingAmount}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Max: {formatCurrency(selectedCreditNote?.remainingAmount || 0)}
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setApplyToInvoiceId(null);
                setApplyAmount(0);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApplyCreditNote}
              disabled={
                !applyToInvoiceId ||
                applyAmount <= 0 ||
                applyAmount > (selectedCreditNote?.remainingAmount || 0)
              }
            >
              Apply Credit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Item Modal */}
      <ItemModal />
    </div>
  );
}
