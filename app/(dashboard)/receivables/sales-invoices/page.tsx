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
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type InvoiceStatus =
  | "draft"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "cancelled";
type InvoiceType = "standard" | "proforma" | "credit_note" | "debit_note";

interface InvoiceLineItem {
  id: number;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

interface SalesInvoice {
  id: number;
  invoiceNumber: string;
  customer: {
    id: number;
    name: string;
    code: string;
    email: string;
    phone: string;
    taxId: string;
  };
  invoiceDate: string;
  dueDate: string;
  type: InvoiceType;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  notes?: string;
  terms?: string;
  createdBy: {
    id: number;
    name: string;
  };
  approvedBy?: {
    id: number;
    name: string;
    date: string;
  };
  sentDate?: string;
  paidDate?: string;
  paymentHistory?: {
    id: number;
    date: string;
    amount: number;
    method: string;
    reference: string;
  }[];
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
    taxId: "RC-1234567",
  },
  {
    id: 2,
    name: "MTN Nigeria",
    code: "CUST-002",
    email: "accounts@mtn.ng",
    phone: "+234 700 123 4567",
    taxId: "RC-7654321",
  },
  {
    id: 3,
    name: "Lagos State Government",
    code: "CUST-003",
    email: "procurement@lagosstate.gov.ng",
    phone: "+234 800 456 7890",
    taxId: "GOV-001",
  },
  {
    id: 4,
    name: "Access Bank Plc",
    code: "CUST-004",
    email: "supplier@accessbank.com",
    phone: "+234 800 789 0123",
    taxId: "RC-1122334",
  },
];

// Mock Invoices
const mockInvoices: SalesInvoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2026-0001",
    customer: mockCustomers[0],
    invoiceDate: "2026-03-01",
    dueDate: "2026-04-15",
    type: "standard",
    status: "paid",
    lineItems: [
      {
        id: 1,
        itemCode: "SVC-001",
        description: "Consulting Services",
        quantity: 1,
        unitPrice: 5000000,
        discount: 0,
        tax: 7.5,
        total: 5375000,
      },
      {
        id: 2,
        itemCode: "PRD-001",
        description: "Software License",
        quantity: 5,
        unitPrice: 250000,
        discount: 0,
        tax: 7.5,
        total: 1343750,
      },
    ],
    subtotal: 6250000,
    discountTotal: 0,
    taxTotal: 468750,
    totalAmount: 6718750,
    amountPaid: 6718750,
    balanceDue: 0,
    currency: "NGN",
    notes: "Thank you for your business",
    terms: "Payment due within 45 days",
    createdBy: { id: 1, name: "John Smith" },
    approvedBy: { id: 2, name: "Sales Manager", date: "2026-03-01T10:00:00" },
    sentDate: "2026-03-01T11:00:00",
    paidDate: "2026-03-28",
    paymentHistory: [
      {
        id: 1,
        date: "2026-03-28",
        amount: 6718750,
        method: "Bank Transfer",
        reference: "TRF-2026-0456",
      },
    ],
    createdAt: "2026-03-01T09:00:00",
    updatedAt: "2026-03-28T14:00:00",
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-0002",
    customer: mockCustomers[1],
    invoiceDate: "2026-03-05",
    dueDate: "2026-04-04",
    type: "standard",
    status: "partially_paid",
    lineItems: [
      {
        id: 3,
        itemCode: "SVC-002",
        description: "IT Support Services",
        quantity: 1,
        unitPrice: 3500000,
        discount: 0,
        tax: 7.5,
        total: 3762500,
      },
      {
        id: 4,
        itemCode: "PRD-002",
        description: "Hardware Equipment",
        quantity: 10,
        unitPrice: 150000,
        discount: 5,
        tax: 7.5,
        total: 1612500,
      },
    ],
    subtotal: 5000000,
    discountTotal: 75000,
    taxTotal: 369375,
    totalAmount: 5309375,
    amountPaid: 2500000,
    balanceDue: 2809375,
    currency: "NGN",
    notes: "Please process payment by due date",
    terms: "Net 30 days",
    createdBy: { id: 1, name: "Alice Johnson" },
    approvedBy: { id: 2, name: "Sales Director", date: "2026-03-05T14:00:00" },
    sentDate: "2026-03-05T15:00:00",
    paymentHistory: [
      {
        id: 2,
        date: "2026-03-20",
        amount: 2500000,
        method: "Bank Transfer",
        reference: "TRF-2026-0789",
      },
    ],
    createdAt: "2026-03-05T11:00:00",
    updatedAt: "2026-03-20T10:00:00",
  },
  {
    id: 3,
    invoiceNumber: "INV-2026-0003",
    customer: mockCustomers[2],
    invoiceDate: "2026-03-10",
    dueDate: "2026-05-09",
    type: "standard",
    status: "sent",
    lineItems: [
      {
        id: 5,
        itemCode: "SVC-003",
        description: "Consulting Services - Q1",
        quantity: 1,
        unitPrice: 8000000,
        discount: 0,
        tax: 7.5,
        total: 8600000,
      },
    ],
    subtotal: 8000000,
    discountTotal: 0,
    taxTotal: 600000,
    totalAmount: 8600000,
    amountPaid: 0,
    balanceDue: 8600000,
    currency: "NGN",
    notes: "Government contract - Q1 2026",
    terms: "Net 60 days",
    createdBy: { id: 1, name: "Bid Manager" },
    approvedBy: {
      id: 2,
      name: "Finance Director",
      date: "2026-03-10T09:00:00",
    },
    sentDate: "2026-03-10T10:00:00",
    createdAt: "2026-03-10T08:00:00",
    updatedAt: "2026-03-10T10:00:00",
  },
  {
    id: 4,
    invoiceNumber: "INV-2026-0004",
    customer: mockCustomers[3],
    invoiceDate: "2026-03-12",
    dueDate: "2026-04-11",
    type: "standard",
    status: "draft",
    lineItems: [
      {
        id: 6,
        itemCode: "SVC-004",
        description: "Software Development",
        quantity: 1,
        unitPrice: 12000000,
        discount: 0,
        tax: 7.5,
        total: 12900000,
      },
      {
        id: 7,
        itemCode: "PRD-003",
        description: "Database Licenses",
        quantity: 3,
        unitPrice: 500000,
        discount: 0,
        tax: 7.5,
        total: 1612500,
      },
    ],
    subtotal: 13500000,
    discountTotal: 0,
    taxTotal: 1012500,
    totalAmount: 14512500,
    amountPaid: 0,
    balanceDue: 14512500,
    currency: "NGN",
    notes: "Draft - awaiting approval",
    terms: "Net 30 days",
    createdBy: { id: 1, name: "Project Manager" },
    createdAt: "2026-03-12T14:00:00",
    updatedAt: "2026-03-12T14:00:00",
  },
  {
    id: 5,
    invoiceNumber: "INV-2026-0005",
    customer: mockCustomers[1],
    invoiceDate: "2026-03-15",
    dueDate: "2026-03-29",
    type: "standard",
    status: "overdue",
    lineItems: [
      {
        id: 8,
        itemCode: "PRD-004",
        description: "Network Equipment",
        quantity: 5,
        unitPrice: 300000,
        discount: 0,
        tax: 7.5,
        total: 1612500,
      },
    ],
    subtotal: 1500000,
    discountTotal: 0,
    taxTotal: 112500,
    totalAmount: 1612500,
    amountPaid: 0,
    balanceDue: 1612500,
    currency: "NGN",
    notes: "Payment overdue - follow up required",
    terms: "Net 14 days",
    createdBy: { id: 1, name: "Sales Rep" },
    approvedBy: { id: 2, name: "Sales Manager", date: "2026-03-15T09:00:00" },
    sentDate: "2026-03-15T10:00:00",
    createdAt: "2026-03-15T08:00:00",
    updatedAt: "2026-03-30T09:00:00",
  },
];

const invoiceStatuses = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  { value: "sent", label: "Sent", color: "bg-blue-100 text-blue-700" },
  {
    value: "partially_paid",
    label: "Partially Paid",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-700" },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-700" },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700",
  },
];

const invoiceTypes = [
  { value: "standard", label: "Standard Invoice" },
  { value: "proforma", label: "Proforma Invoice" },
  { value: "credit_note", label: "Credit Note" },
  { value: "debit_note", label: "Debit Note" },
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

const getStatusBadge = (status: InvoiceStatus) => {
  const config = invoiceStatuses.find((s) => s.value === status);
  const icons = {
    draft: <FileText className="h-3 w-3 mr-1" />,
    sent: <Send className="h-3 w-3 mr-1" />,
    partially_paid: <Clock className="h-3 w-3 mr-1" />,
    paid: <CheckCircle className="h-3 w-3 mr-1" />,
    overdue: <AlertCircle className="h-3 w-3 mr-1" />,
    cancelled: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

export default function SalesInvoices() {
  const router = useRouter();

  // State
  const [invoices, setInvoices] = useState<SalesInvoice[]>(mockInvoices);
  const [customers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof SalesInvoice;
    direction: "asc" | "desc";
  }>({ key: "invoiceDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"invoices" | "analytics">(
    "invoices",
  );

  // Form state
  const [formData, setFormData] = useState({
    customerId: 0,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    type: "standard" as InvoiceType,
    lineItems: [] as InvoiceLineItem[],
    notes: "",
    terms: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingItem, setEditingItem] = useState<InvoiceLineItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");

  // Statistics
  const stats = useMemo(() => {
    const totalInvoices = invoices.length;
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const outstandingAmount = invoices.reduce(
      (sum, inv) => sum + inv.balanceDue,
      0,
    );
    const paidCount = invoices.filter((inv) => inv.status === "paid").length;
    const overdueCount = invoices.filter(
      (inv) => inv.status === "overdue",
    ).length;
    const partiallyPaidCount = invoices.filter(
      (inv) => inv.status === "partially_paid",
    ).length;

    return {
      totalInvoices,
      totalAmount,
      outstandingAmount,
      paidCount,
      overdueCount,
      partiallyPaidCount,
      collectionRate:
        totalAmount > 0
          ? ((totalAmount - outstandingAmount) / totalAmount) * 100
          : 0,
    };
  }, [invoices]);

  // Filter and sort
  const filteredInvoices = useMemo(() => {
    let result = [...invoices];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(query) ||
          inv.customer.name.toLowerCase().includes(query) ||
          inv.customer.code.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    if (customerFilter !== "all") {
      result = result.filter(
        (inv) => inv.customer.id === parseInt(customerFilter),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((inv) => inv.type === typeFilter);
    }

    if (dateRange.from) {
      result = result.filter((inv) => inv.invoiceDate >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((inv) => inv.invoiceDate <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "invoiceDate" || sortConfig.key === "dueDate") {
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
    invoices,
    searchQuery,
    statusFilter,
    customerFilter,
    typeFilter,
    dateRange,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate line item totals
  const calculateItemTotal = (item: InvoiceLineItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = discountedSubtotal * (item.tax / 100);
    return discountedSubtotal + taxAmount;
  };

  const calculateInvoiceTotals = (items: InvoiceLineItem[]) => {
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
  const handleSort = (key: keyof SalesInvoice) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewInvoice = (invoice: SalesInvoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handleEditInvoice = (invoice: SalesInvoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      customerId: invoice.customer.id,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      type: invoice.type,
      lineItems: [...invoice.lineItems],
      notes: invoice.notes || "",
      terms: invoice.terms || "",
    });
    setIsEditModalOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: InvoiceLineItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<InvoiceLineItem>) => {
    if (editingItem) {
      setFormData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item) =>
          item.id === editingItem.id
            ? ({ ...item, ...itemData } as InvoiceLineItem)
            : item,
        ),
      }));
    } else {
      const newItem: InvoiceLineItem = {
        id: Date.now(),
        itemCode: itemData.itemCode || "",
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
    if (!formData.invoiceDate) errors.invoiceDate = "Invoice date is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    if (formData.lineItems.length === 0)
      errors.lineItems = "At least one line item is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateInvoice = () => {
    if (!validateForm()) return;

    const selectedCustomer = customers.find(
      (c) => c.id === formData.customerId,
    );
    const { subtotal, discountTotal, taxTotal } = calculateInvoiceTotals(
      formData.lineItems,
    );
    const totalAmount = subtotal - discountTotal + taxTotal;

    const newInvoice: SalesInvoice = {
      id: Math.max(...invoices.map((inv) => inv.id), 0) + 1,
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, "0")}`,
      customer: selectedCustomer!,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      type: formData.type,
      status: "draft",
      lineItems: formData.lineItems.map((item) => ({
        ...item,
        total: calculateItemTotal(item),
      })),
      subtotal,
      discountTotal,
      taxTotal,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      currency: "NGN",
      notes: formData.notes,
      terms: formData.terms,
      createdBy: { id: 1, name: "Current User" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateInvoice = () => {
    if (!validateForm() || !selectedInvoice) return;

    const selectedCustomer = customers.find(
      (c) => c.id === formData.customerId,
    );
    const { subtotal, discountTotal, taxTotal } = calculateInvoiceTotals(
      formData.lineItems,
    );
    const totalAmount = subtotal - discountTotal + taxTotal;

    const updatedInvoice: SalesInvoice = {
      ...selectedInvoice,
      customer: selectedCustomer!,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      type: formData.type,
      lineItems: formData.lineItems.map((item) => ({
        ...item,
        total: calculateItemTotal(item),
      })),
      subtotal,
      discountTotal,
      taxTotal,
      totalAmount,
      balanceDue: totalAmount - selectedInvoice.amountPaid,
      notes: formData.notes,
      terms: formData.terms,
      updatedAt: new Date().toISOString(),
    };

    setInvoices((prev) =>
      prev.map((inv) => (inv.id === selectedInvoice.id ? updatedInvoice : inv)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleSendInvoice = () => {
    if (!selectedInvoice) return;
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              status: "sent",
              sentDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : inv,
      ),
    );
    setIsSendDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleRecordPayment = () => {
    if (!selectedInvoice || paymentAmount <= 0) return;

    const newAmountPaid = selectedInvoice.amountPaid + paymentAmount;
    const newBalanceDue = selectedInvoice.totalAmount - newAmountPaid;
    let newStatus: InvoiceStatus = selectedInvoice.status;

    if (newBalanceDue <= 0) {
      newStatus = "paid";
    } else if (newAmountPaid > 0) {
      newStatus = "partially_paid";
    }

    const paymentRecord = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      amount: paymentAmount,
      method: paymentMethod,
      reference: paymentReference,
    };

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              amountPaid: newAmountPaid,
              balanceDue: newBalanceDue,
              status: newStatus,
              paidDate:
                newBalanceDue <= 0
                  ? new Date().toISOString().split("T")[0]
                  : inv.paidDate,
              paymentHistory: [...(inv.paymentHistory || []), paymentRecord],
              updatedAt: new Date().toISOString(),
            }
          : inv,
      ),
    );
    setIsRecordPaymentOpen(false);
    setSelectedInvoice(null);
    setPaymentAmount(0);
    setPaymentReference("");
  };

  const handleDeleteInvoice = () => {
    if (!selectedInvoice) return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== selectedInvoice.id));
    setIsDeleteDialogOpen(false);
    setSelectedInvoice(null);
  };

  const resetForm = () => {
    setFormData({
      customerId: 0,
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      type: "standard",
      lineItems: [],
      notes: "",
      terms: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Invoice #",
      "Date",
      "Due Date",
      "Customer",
      "Amount",
      "Paid",
      "Balance",
      "Status",
    ];
    const csvData = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      formatDate(inv.invoiceDate),
      formatDate(inv.dueDate),
      inv.customer.name,
      inv.totalAmount.toString(),
      inv.amountPaid.toString(),
      inv.balanceDue.toString(),
      inv.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales-invoices-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setInvoices([...mockInvoices]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setCustomerFilter("all");
    setTypeFilter("all");
    setDateRange({ from: "", to: "" });
  };

  // Item Modal Component
  const ItemModal = () => {
    const [itemData, setItemData] = useState<Partial<InvoiceLineItem>>(
      editingItem || {
        itemCode: "",
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
              Enter invoice line item details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Item Code</Label>
              <Input
                value={itemData.itemCode || ""}
                onChange={(e) =>
                  setItemData((prev) => ({ ...prev, itemCode: e.target.value }))
                }
                className="mt-1"
                placeholder="e.g., SVC-001"
              />
            </div>
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
              <Receipt className="h-6 w-6" />
              Sales Invoices
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage customer invoices
            </p>
          </div>
        </div>
        <div className="flex gap-2">
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
            New Invoice
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{stats.totalInvoices}</p>
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
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.outstandingAmount)}
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
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.collectionRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {stats.paidCount} paid, {stats.overdueCount} overdue
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
                placeholder="Search by invoice #, customer..."
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
                {invoiceStatuses.map((status) => (
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
                {invoiceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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

      {/* Invoices Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("invoiceNumber")}
                    >
                      Invoice #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("invoiceDate")}
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("dueDate")}
                    >
                      Due Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("totalAmount")}
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No invoices found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {invoice.invoiceNumber}
                      </TableCell>
                      <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {invoice.customer.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {invoice.customer.code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            new Date(invoice.dueDate) < new Date() &&
                            invoice.status !== "paid"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {formatDate(invoice.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.totalAmount)}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(invoice.amountPaid)}
                      </TableCell>
                      <TableCell className="font-medium text-orange-600">
                        {formatCurrency(invoice.balanceDue)}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {invoice.status === "draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditInvoice(invoice)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setIsSendDialogOpen(true);
                                }}
                                className="text-blue-600"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {(invoice.status === "sent" ||
                            invoice.status === "partially_paid" ||
                            invoice.status === "overdue") &&
                            invoice.balanceDue > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setPaymentAmount(invoice.balanceDue);
                                  setIsRecordPaymentOpen(true);
                                }}
                                className="text-green-600"
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
          {filteredInvoices.length > 0 && (
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
                    filteredInvoices.length,
                  )}{" "}
                  of {filteredInvoices.length}
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

      {/* View Invoice Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Invoice #{selectedInvoice?.invoiceNumber}</span>
              {selectedInvoice && getStatusBadge(selectedInvoice.status)}
            </DialogTitle>
            <DialogDescription>
              Customer: {selectedInvoice?.customer.name} | Date:{" "}
              {selectedInvoice && formatDate(selectedInvoice.invoiceDate)}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p
                    className={
                      new Date(selectedInvoice.dueDate) < new Date() &&
                      selectedInvoice.status !== "paid"
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {formatDate(selectedInvoice.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Type</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedInvoice.type}
                  </Badge>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Customer Name
                    </p>
                    <p className="font-medium">
                      {selectedInvoice.customer.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Customer Code
                    </p>
                    <p>{selectedInvoice.customer.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedInvoice.customer.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedInvoice.customer.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax ID</p>
                    <p>{selectedInvoice.customer.taxId}</p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Line Items</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">
                          {item.itemCode}
                        </TableCell>
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
                      <TableHead colSpan={6} className="text-right">
                        Subtotal:
                      </TableHead>
                      <TableHead className="text-right">
                        {formatCurrency(selectedInvoice.subtotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={6} className="text-right">
                        Discount:
                      </TableHead>
                      <TableHead className="text-right text-red-600">
                        -{formatCurrency(selectedInvoice.discountTotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={6} className="text-right">
                        Tax:
                      </TableHead>
                      <TableHead className="text-right">
                        {formatCurrency(selectedInvoice.taxTotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={6} className="text-right font-bold">
                        Total:
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        {formatCurrency(selectedInvoice.totalAmount)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={6} className="text-right">
                        Amount Paid:
                      </TableHead>
                      <TableHead className="text-right text-green-600">
                        {formatCurrency(selectedInvoice.amountPaid)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={6} className="text-right font-bold">
                        Balance Due:
                      </TableHead>
                      <TableHead className="text-right font-bold text-orange-600">
                        {formatCurrency(selectedInvoice.balanceDue)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Payment History */}
              {selectedInvoice.paymentHistory &&
                selectedInvoice.paymentHistory.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Payment History</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Reference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInvoice.paymentHistory.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell className="font-medium text-green-600">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell className="font-mono text-xs">
                              {payment.reference}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

              {selectedInvoice.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedInvoice.notes}</p>
                </div>
              )}

              {selectedInvoice.terms && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    Terms & Conditions
                  </p>
                  <p className="text-sm mt-1">{selectedInvoice.terms}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedInvoice && selectedInvoice.status === "draft" && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditInvoice(selectedInvoice);
                }}
              >
                Edit Invoice
              </Button>
            )}
            {selectedInvoice &&
              selectedInvoice.balanceDue > 0 &&
              (selectedInvoice.status === "sent" ||
                selectedInvoice.status === "partially_paid" ||
                selectedInvoice.status === "overdue") && (
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedInvoice(selectedInvoice);
                    setPaymentAmount(selectedInvoice.balanceDue);
                    setIsRecordPaymentOpen(true);
                  }}
                >
                  Record Payment
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Invoice Modal */}
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
              {isCreateModalOpen ? "Create Invoice" : "Edit Invoice"}
            </DialogTitle>
            <DialogDescription>
              Create a new sales invoice for your customer
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
                <Label>Invoice Type</Label>
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
                    {invoiceTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Invoice Date *</Label>
                <Input
                  type="date"
                  value={formData.invoiceDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      invoiceDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
                {formErrors.invoiceDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.invoiceDate}
                  </p>
                )}
              </div>
              <div>
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
                {formErrors.dueDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.dueDate}
                  </p>
                )}
              </div>
            </div>

            {/* Line Items */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Line Items</h3>
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
                      <TableHead>Item Code</TableHead>
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
                        <TableCell className="font-mono text-xs">
                          {item.itemCode}
                        </TableCell>
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
                  <p className="text-muted-foreground">No line items added</p>
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

            {/* Notes and Terms */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Notes (Optional)</Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    className="mt-1"
                    rows={3}
                    placeholder="Thank you for your business..."
                  />
                </div>
                <div>
                  <Label>Terms & Conditions (Optional)</Label>
                  <Textarea
                    value={formData.terms}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        terms: e.target.value,
                      }))
                    }
                    className="mt-1"
                    rows={3}
                    placeholder="Payment terms, delivery terms, etc..."
                  />
                </div>
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
                isCreateModalOpen ? handleCreateInvoice : handleUpdateInvoice
              }
            >
              {isCreateModalOpen ? "Create Invoice" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Invoice Dialog */}
      <AlertDialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this invoice to the customer?
              {selectedInvoice && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                  <p>Customer: {selectedInvoice.customer.name}</p>
                  <p>Amount: {formatCurrency(selectedInvoice.totalAmount)}</p>
                  <p>Email: {selectedInvoice.customer.email}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendInvoice}>
              <Send className="h-4 w-4 mr-2" />
              Send Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Record Payment Dialog */}
      <AlertDialog
        open={isRecordPaymentOpen}
        onOpenChange={setIsRecordPaymentOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Record payment for this invoice.
              {selectedInvoice && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedInvoice.invoiceNumber}</p>
                  <p>Customer: {selectedInvoice.customer.name}</p>
                  <p>
                    Total Amount: {formatCurrency(selectedInvoice.totalAmount)}
                  </p>
                  <p>
                    Outstanding Balance:{" "}
                    {formatCurrency(selectedInvoice.balanceDue)}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Payment Amount *</Label>
              <Input
                type="number"
                value={paymentAmount || ""}
                onChange={(e) =>
                  setPaymentAmount(parseFloat(e.target.value) || 0)
                }
                className="mt-1"
                placeholder="0"
                max={selectedInvoice?.balanceDue}
              />
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Cheque">Cheque</SelectItem>
                  <SelectItem value="Credit Card">Credit Card</SelectItem>
                  <SelectItem value="Online Payment">Online Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reference / Transaction ID</Label>
              <Input
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="mt-1"
                placeholder="Transaction reference"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setPaymentAmount(0);
                setPaymentReference("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRecordPayment}
              disabled={
                paymentAmount <= 0 ||
                paymentAmount > (selectedInvoice?.balanceDue || 0)
              }
            >
              Record Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Item Modal */}
      <ItemModal />
    </div>
  );
}
