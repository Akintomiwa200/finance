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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
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
import { Progress } from "@/src/components/ui/progress";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Download,
  Send,
  Printer,
  FileText,
  Receipt,
  Banknote,
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileCheck,
  PlusCircle,
  MinusCircle,
  Percent,
  Hash,
  Wallet,
  PiggyBank,
} from "lucide-react";

// Types
interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
}

interface InvoicePayment {
  id: number;
  amount: number;
  date: string;
  method: string;
  reference: string;
  notes?: string;
}

interface CustomerInvoice {
  id: number;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discount: number;
  discountType: "percentage" | "fixed";
  total: number;
  amountPaid: number;
  balanceDue: number;
  issueDate: string;
  dueDate: string;
  status: "draft" | "sent" | "partial" | "paid" | "overdue" | "cancelled";
  payments: InvoicePayment[];
  notes?: string;
  terms?: string;
  sentDate?: string;
  paidDate?: string;
}

// Initial Data
const initialInvoices: CustomerInvoice[] = [
  {
    id: 1,
    invoiceNumber: "INV-2026-001",
    customerName: "Acme Corp",
    customerEmail: "accounts@acmecorp.com",
    customerPhone: "+234 800 123 4567",
    customerAddress: "123 Marina, Lagos Island, Lagos",
    items: [
      {
        id: 1,
        description: "Web Development Services",
        quantity: 1,
        unitPrice: 1500000,
        amount: 1500000,
        taxRate: 7.5,
        taxAmount: 112500,
      },
      {
        id: 2,
        description: "UI/UX Design",
        quantity: 1,
        unitPrice: 500000,
        amount: 500000,
        taxRate: 7.5,
        taxAmount: 37500,
      },
      {
        id: 3,
        description: "Server Setup & Configuration",
        quantity: 1,
        unitPrice: 300000,
        amount: 300000,
        taxRate: 7.5,
        taxAmount: 22500,
      },
    ],
    subtotal: 2300000,
    taxTotal: 172500,
    discount: 22500,
    discountType: "fixed",
    total: 2450000,
    amountPaid: 2450000,
    balanceDue: 0,
    issueDate: "2026-05-15",
    dueDate: "2026-06-15",
    status: "paid",
    payments: [
      {
        id: 1,
        amount: 2450000,
        date: "2026-06-10",
        method: "Bank Transfer",
        reference: "TRF-20260610-001",
      },
    ],
    notes: "Thank you for your business!",
    terms: "Payment due within 30 days",
    sentDate: "2026-05-15",
    paidDate: "2026-06-10",
  },
  {
    id: 2,
    invoiceNumber: "INV-2026-002",
    customerName: "Beta Ltd",
    customerEmail: "finance@betalimited.com",
    customerPhone: "+234 800 234 5678",
    customerAddress: "456 Victoria Island, Lagos",
    items: [
      {
        id: 1,
        description: "Mobile App Development - Phase 1",
        quantity: 1,
        unitPrice: 800000,
        amount: 800000,
        taxRate: 7.5,
        taxAmount: 60000,
      },
      {
        id: 2,
        description: "API Integration",
        quantity: 1,
        unitPrice: 30000,
        amount: 30000,
        taxRate: 7.5,
        taxAmount: 2250,
      },
    ],
    subtotal: 830000,
    taxTotal: 62250,
    discount: 2250,
    discountType: "fixed",
    total: 890000,
    amountPaid: 0,
    balanceDue: 890000,
    issueDate: "2026-05-20",
    dueDate: "2026-06-20",
    status: "sent",
    payments: [],
    notes: "Phase 2 to commence upon payment",
    terms: "Payment due within 30 days",
    sentDate: "2026-05-20",
  },
  {
    id: 3,
    invoiceNumber: "INV-2026-003",
    customerName: "Gamma Inc",
    customerEmail: "billing@gammainc.com",
    customerPhone: "+234 800 345 6789",
    customerAddress: "789 Ikoyi, Lagos",
    items: [
      {
        id: 1,
        description: "Enterprise Software License (Annual)",
        quantity: 5,
        unitPrice: 500000,
        amount: 2500000,
        taxRate: 7.5,
        taxAmount: 187500,
      },
      {
        id: 2,
        description: "Technical Support - Premium",
        quantity: 1,
        unitPrice: 400000,
        amount: 400000,
        taxRate: 7.5,
        taxAmount: 30000,
      },
      {
        id: 3,
        description: "Training & Onboarding",
        quantity: 1,
        unitPrice: 150000,
        amount: 150000,
        taxRate: 7.5,
        taxAmount: 11250,
      },
    ],
    subtotal: 3050000,
    taxTotal: 228750,
    discount: 78750,
    discountType: "fixed",
    total: 3200000,
    amountPaid: 1000000,
    balanceDue: 2200000,
    issueDate: "2026-05-05",
    dueDate: "2026-06-05",
    status: "overdue",
    payments: [
      {
        id: 1,
        amount: 1000000,
        date: "2026-05-25",
        method: "Bank Transfer",
        reference: "TRF-20260525-002",
      },
    ],
    notes: "Partial payment received. Balance overdue.",
    terms: "Payment due within 30 days",
    sentDate: "2026-05-05",
  },
  {
    id: 4,
    invoiceNumber: "INV-2026-004",
    customerName: "Delta Co",
    customerEmail: "ap@deltaco.com",
    customerPhone: "+234 800 456 7890",
    customerAddress: "321 Lekki Phase 1, Lagos",
    items: [
      {
        id: 1,
        description: "Cloud Migration Services",
        quantity: 1,
        unitPrice: 1000000,
        amount: 1000000,
        taxRate: 7.5,
        taxAmount: 75000,
      },
      {
        id: 2,
        description: "Data Backup Setup",
        quantity: 1,
        unitPrice: 25000,
        amount: 25000,
        taxRate: 7.5,
        taxAmount: 1875,
      },
    ],
    subtotal: 1025000,
    taxTotal: 76875,
    discount: 1875,
    discountType: "fixed",
    total: 1100000,
    amountPaid: 0,
    balanceDue: 1100000,
    issueDate: "2026-06-01",
    dueDate: "2026-06-30",
    status: "draft",
    payments: [],
    notes: "Awaiting client approval",
    terms: "Payment due within 30 days",
  },
  {
    id: 5,
    invoiceNumber: "INV-2026-005",
    customerName: "Epsilon Enterprises",
    customerEmail: "finance@epsilonent.com",
    customerPhone: "+234 800 567 8901",
    customerAddress: "654 Abuja CBD, Abuja",
    items: [
      {
        id: 1,
        description: "Security Audit",
        quantity: 1,
        unitPrice: 600000,
        amount: 600000,
        taxRate: 7.5,
        taxAmount: 45000,
      },
      {
        id: 2,
        description: "Penetration Testing",
        quantity: 1,
        unitPrice: 400000,
        amount: 400000,
        taxRate: 7.5,
        taxAmount: 30000,
      },
    ],
    subtotal: 1000000,
    taxTotal: 75000,
    discount: 50000,
    discountType: "percentage",
    total: 1025000,
    amountPaid: 500000,
    balanceDue: 525000,
    issueDate: "2026-05-10",
    dueDate: "2026-06-10",
    status: "partial",
    payments: [
      {
        id: 1,
        amount: 500000,
        date: "2026-06-01",
        method: "Cheque",
        reference: "CHQ-001234",
      },
    ],
    notes: "Remaining balance due immediately",
    terms: "50% upfront, 50% on completion",
    sentDate: "2026-05-10",
  },
  {
    id: 6,
    invoiceNumber: "INV-2026-006",
    customerName: "Zeta Solutions",
    customerEmail: "billing@zetasol.com",
    customerPhone: "+234 800 678 9012",
    customerAddress: "987 Port Harcourt, Rivers",
    items: [
      {
        id: 1,
        description: "Network Infrastructure Setup",
        quantity: 1,
        unitPrice: 2000000,
        amount: 2000000,
        taxRate: 7.5,
        taxAmount: 150000,
      },
    ],
    subtotal: 2000000,
    taxTotal: 150000,
    discount: 0,
    discountType: "fixed",
    total: 2150000,
    amountPaid: 0,
    balanceDue: 2150000,
    issueDate: "2026-05-01",
    dueDate: "2026-05-31",
    status: "overdue",
    payments: [],
    notes: "Multiple reminders sent. Escalation pending.",
    terms: "Payment due within 30 days",
    sentDate: "2026-05-01",
  },
];

const paymentMethods = [
  "Bank Transfer",
  "Cheque",
  "Cash",
  "POS",
  "Online Payment",
  "Direct Deposit",
];

export default function CustomerInvoicesPage() {
  // State
  const [invoices, setInvoices] = useState<CustomerInvoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CustomerInvoice;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<CustomerInvoice | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    method: "Bank Transfer",
    reference: "",
    notes: "",
  });
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    items: [] as InvoiceItem[],
    discount: 0,
    discountType: "fixed" as "percentage" | "fixed",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    notes: "",
    terms: "Payment due within 30 days",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalOutstanding = invoices.reduce(
      (sum, inv) => sum + inv.balanceDue,
      0,
    );
    const overdueAmount = invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.balanceDue, 0);

    const draft = invoices.filter((inv) => inv.status === "draft").length;
    const sent = invoices.filter((inv) => inv.status === "sent").length;
    const partial = invoices.filter((inv) => inv.status === "partial").length;
    const paid = invoices.filter((inv) => inv.status === "paid").length;
    const overdue = invoices.filter((inv) => inv.status === "overdue").length;

    return {
      totalInvoiced,
      totalPaid,
      totalOutstanding,
      overdueAmount,
      draft,
      sent,
      partial,
      paid,
      overdue,
      collectionRate:
        totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0,
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
          inv.customerName.toLowerCase().includes(query) ||
          inv.customerEmail.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

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

    // Default sort by issue date descending
    result.sort(
      (a, b) =>
        new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime(),
    );

    return result;
  }, [invoices, searchQuery, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Invoice number generator
  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear();
    const count = invoices.length + 1;
    return `INV-${year}-${String(count).padStart(3, "0")}`;
  };

  // Handlers
  const handleSort = (key: keyof CustomerInvoice) => {
    if (sortConfig && sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ key, direction: "asc" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discount" ? parseFloat(value) || 0 : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addInvoiceItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      taxRate: 7.5,
      taxAmount: 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeInvoiceItem = (itemId: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const updateInvoiceItem = (
    itemId: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== itemId) return item;

        const updated = { ...item, [field]: value };

        // Recalculate amount and tax
        if (field === "quantity" || field === "unitPrice") {
          updated.amount = updated.quantity * updated.unitPrice;
          updated.taxAmount = updated.amount * (updated.taxRate / 100);
        }
        if (field === "taxRate") {
          updated.taxAmount = updated.amount * (updated.taxRate / 100);
        }

        return updated;
      }),
    }));
  };

  const calculateTotals = (
    items: InvoiceItem[],
    discount: number,
    discountType: "percentage" | "fixed",
  ) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const taxTotal = items.reduce((sum, item) => sum + item.taxAmount, 0);
    const discountAmount =
      discountType === "percentage"
        ? (subtotal + taxTotal) * (discount / 100)
        : discount;
    const total = subtotal + taxTotal - discountAmount;

    return { subtotal, taxTotal, discountAmount, total };
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.customerName.trim())
      errors.customerName = "Customer name is required";
    if (!formData.customerEmail.trim()) {
      errors.customerEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.customerEmail = "Invalid email format";
    }
    if (formData.items.length === 0)
      errors.items = "At least one item is required";
    if (!formData.issueDate) errors.issueDate = "Issue date is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddInvoice = () => {
    if (!validateForm()) return;

    const totals = calculateTotals(
      formData.items,
      formData.discount,
      formData.discountType,
    );

    const newInvoice: CustomerInvoice = {
      id: Math.max(...invoices.map((inv) => inv.id), 0) + 1,
      invoiceNumber: generateInvoiceNumber(),
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      customerAddress: formData.customerAddress,
      items: formData.items,
      subtotal: totals.subtotal,
      taxTotal: totals.taxTotal,
      discount: formData.discount,
      discountType: formData.discountType,
      total: totals.total,
      amountPaid: 0,
      balanceDue: totals.total,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      status: "draft",
      payments: [],
      notes: formData.notes,
      terms: formData.terms,
    };

    setInvoices((prev) => [newInvoice, ...prev]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditInvoice = () => {
    if (!validateForm() || !selectedInvoice) return;

    const totals = calculateTotals(
      formData.items,
      formData.discount,
      formData.discountType,
    );

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              customerName: formData.customerName,
              customerEmail: formData.customerEmail,
              customerPhone: formData.customerPhone,
              customerAddress: formData.customerAddress,
              items: formData.items,
              subtotal: totals.subtotal,
              taxTotal: totals.taxTotal,
              discount: formData.discount,
              discountType: formData.discountType,
              total: totals.total,
              balanceDue: totals.total - inv.amountPaid,
              issueDate: formData.issueDate,
              dueDate: formData.dueDate,
              notes: formData.notes,
              terms: formData.terms,
            }
          : inv,
      ),
    );

    resetForm();
    setIsEditModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = () => {
    if (!selectedInvoice) return;

    setInvoices((prev) => prev.filter((inv) => inv.id !== selectedInvoice.id));
    setIsDeleteDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleSendInvoice = () => {
    if (!selectedInvoice) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              status: "sent" as const,
              sentDate: new Date().toISOString().split("T")[0],
            }
          : inv,
      ),
    );

    setIsSendDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handleRecordPayment = () => {
    if (!selectedInvoice || paymentForm.amount <= 0) return;

    const newPayment: InvoicePayment = {
      id: (selectedInvoice.payments?.length || 0) + 1,
      amount: paymentForm.amount,
      date: paymentForm.date,
      method: paymentForm.method,
      reference: paymentForm.reference,
      notes: paymentForm.notes,
    };

    const newAmountPaid = selectedInvoice.amountPaid + paymentForm.amount;
    const newBalance = selectedInvoice.total - newAmountPaid;

    let newStatus: CustomerInvoice["status"] = "partial";
    if (newBalance <= 0) {
      newStatus = "paid";
    } else if (
      new Date(selectedInvoice.dueDate) < new Date() &&
      newBalance > 0
    ) {
      newStatus = "overdue";
    } else if (newAmountPaid > 0) {
      newStatus = "partial";
    }

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              amountPaid: newAmountPaid,
              balanceDue: Math.max(0, newBalance),
              status: newStatus,
              payments: [...(inv.payments || []), newPayment],
              paidDate:
                newBalance <= 0
                  ? new Date().toISOString().split("T")[0]
                  : inv.paidDate,
            }
          : inv,
      ),
    );

    setPaymentForm({
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      method: "Bank Transfer",
      reference: "",
      notes: "",
    });
    setIsRecordPaymentOpen(false);
    setSelectedInvoice(null);
  };

  const handleCancelInvoice = () => {
    if (!selectedInvoice) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? { ...inv, status: "cancelled" as const }
          : inv,
      ),
    );

    setIsCancelDialogOpen(false);
    setSelectedInvoice(null);
  };

  const openEditModal = (invoice: CustomerInvoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      customerPhone: invoice.customerPhone,
      customerAddress: invoice.customerAddress,
      items: [...invoice.items],
      discount: invoice.discount,
      discountType: invoice.discountType,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      notes: invoice.notes || "",
      terms: invoice.terms || "",
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (invoice: CustomerInvoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      items: [],
      discount: 0,
      discountType: "fixed",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      notes: "",
      terms: "Payment due within 30 days",
    });
    setFormErrors({});
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

  const getStatusBadge = (status: CustomerInvoice["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "sent":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <Send className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        );
      case "paid":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case "overdue":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-gray-200 text-gray-600 hover:bg-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentStatus = (invoice: CustomerInvoice) => {
    const percentage =
      invoice.total > 0
        ? Math.round((invoice.amountPaid / invoice.total) * 100)
        : 0;
    return percentage;
  };

  const canEdit = (status: string) => status === "draft";
  const canSend = (status: string) => status === "draft";
  const canRecordPayment = (status: string) =>
    ["sent", "partial", "overdue"].includes(status);
  const canCancel = (status: string) => ["draft", "sent"].includes(status);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sales Invoices
          </h1>
          <p className="text-muted-foreground mt-1">
            Accounts Receivable — customer invoices and payments
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Sales Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Fill in the invoice details and add line items below.
              </DialogDescription>
            </DialogHeader>
            <InvoiceForm
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              onAddItem={addInvoiceItem}
              onRemoveItem={removeInvoiceItem}
              onUpdateItem={updateInvoiceItem}
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddInvoice}>Save Invoice</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invoiced</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalInvoiced)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Receipt className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collected</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalPaid)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Banknote className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.totalOutstanding)}
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
                <p className="text-sm text-muted-foreground">Collection Rate</p>
                <p className="text-2xl font-bold">{stats.collectionRate}%</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice #, customer name, email..."
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
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" title="Export">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customer Invoices</CardTitle>
          <CardDescription>
            {filteredInvoices.length} invoice
            {filteredInvoices.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("total")}
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("dueDate")}
                    >
                      Due Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No invoices found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <span className="font-medium text-sm">
                          {invoice.invoiceNumber}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {invoice.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.customerEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.total)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            invoice.balanceDue > 0
                              ? "text-red-600 font-medium"
                              : "text-green-600 font-medium"
                          }
                        >
                          {formatCurrency(invoice.balanceDue)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(invoice.dueDate)}
                      </TableCell>
                      <TableCell>
                        <div className="w-[80px] space-y-1">
                          <Progress
                            value={getPaymentStatus(invoice)}
                            className="h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {getPaymentStatus(invoice)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="View Details"
                            onClick={() => openViewModal(invoice)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => openViewModal(invoice)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              {canEdit(invoice.status) && (
                                <DropdownMenuItem
                                  onClick={() => openEditModal(invoice)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {canSend(invoice.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setIsSendDialogOpen(true);
                                  }}
                                >
                                  <Send className="h-4 w-4 mr-2" />
                                  Send to Customer
                                </DropdownMenuItem>
                              )}
                              {canRecordPayment(invoice.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setPaymentForm({
                                      amount: invoice.balanceDue,
                                      date: new Date()
                                        .toISOString()
                                        .split("T")[0],
                                      method: "Bank Transfer",
                                      reference: "",
                                      notes: "",
                                    });
                                    setIsRecordPaymentOpen(true);
                                  }}
                                >
                                  <Banknote className="h-4 w-4 mr-2 text-green-600" />
                                  Record Payment
                                </DropdownMenuItem>
                              )}
                              {(canEdit(invoice.status) ||
                                canCancel(invoice.status)) && (
                                <>
                                  <DropdownMenuSeparator />
                                  {canCancel(invoice.status) && (
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => {
                                        setSelectedInvoice(invoice);
                                        setIsCancelDialogOpen(true);
                                      }}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel Invoice
                                    </DropdownMenuItem>
                                  )}
                                  {canEdit(invoice.status) && (
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => {
                                        setSelectedInvoice(invoice);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6 py-4">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b">
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedInvoice.invoiceNumber}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Issued: {formatDate(selectedInvoice.issueDate)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Due: {formatDate(selectedInvoice.dueDate)}
                  </p>
                </div>
                {getStatusBadge(selectedInvoice.status)}
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">
                    Bill To
                  </p>
                  <p className="font-semibold">
                    {selectedInvoice.customerName}
                  </p>
                  <p className="text-sm">{selectedInvoice.customerEmail}</p>
                  <p className="text-sm">{selectedInvoice.customerPhone}</p>
                  <p className="text-sm">{selectedInvoice.customerAddress}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-1">
                    Amount
                  </p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(selectedInvoice.total)}
                  </p>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Paid:</span>
                      <span className="text-green-600 font-medium">
                        {formatCurrency(selectedInvoice.amountPaid)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Balance:</span>
                      <span className="text-red-600 font-medium">
                        {formatCurrency(selectedInvoice.balanceDue)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="font-medium mb-2">Line Items</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Tax</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell>{formatCurrency(item.taxAmount)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.amount + item.taxAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-end mt-4">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>{formatCurrency(selectedInvoice.taxTotal)}</span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(selectedInvoice.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payments */}
              {selectedInvoice.payments &&
                selectedInvoice.payments.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Payment History</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Method</TableHead>
                          <TableHead>Reference</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedInvoice.payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>{payment.reference}</TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              {formatCurrency(payment.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

              {/* Notes & Terms */}
              {(selectedInvoice.notes || selectedInvoice.terms) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {selectedInvoice.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm">{selectedInvoice.notes}</p>
                    </div>
                  )}
                  {selectedInvoice.terms && (
                    <div>
                      <p className="text-sm text-muted-foreground">Terms</p>
                      <p className="text-sm">{selectedInvoice.terms}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            {selectedInvoice && canRecordPayment(selectedInvoice.status) && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setPaymentForm({
                    amount: selectedInvoice.balanceDue,
                    date: new Date().toISOString().split("T")[0],
                    method: "Bank Transfer",
                    reference: "",
                    notes: "",
                  });
                  setIsRecordPaymentOpen(true);
                }}
              >
                <Banknote className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>
              Update invoice details and line items.
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm
            formData={formData}
            formErrors={formErrors}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            onAddItem={addInvoiceItem}
            onRemoveItem={removeInvoiceItem}
            onUpdateItem={updateInvoiceItem}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditInvoice}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Modal */}
      <Dialog open={isRecordPaymentOpen} onOpenChange={setIsRecordPaymentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoiceNumber} - {selectedInvoice?.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Due:</span>
                <span className="font-bold">
                  {selectedInvoice && formatCurrency(selectedInvoice.total)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Balance:</span>
                <span className="font-bold text-red-600">
                  {selectedInvoice &&
                    formatCurrency(selectedInvoice.balanceDue)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Amount *</Label>
              <Input
                id="paymentAmount"
                type="number"
                value={paymentForm.amount || ""}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    amount: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={paymentForm.date}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={paymentForm.method}
                onValueChange={(value) =>
                  setPaymentForm((prev) => ({ ...prev, method: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentReference">Reference #</Label>
              <Input
                id="paymentReference"
                value={paymentForm.reference}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    reference: e.target.value,
                  }))
                }
                placeholder="e.g., TRF-20260610-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentNotes">Notes</Label>
              <Textarea
                id="paymentNotes"
                value={paymentForm.notes}
                onChange={(e) =>
                  setPaymentForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Any additional notes..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRecordPaymentOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRecordPayment}>
              <Banknote className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation */}
      <AlertDialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Send invoice <strong>{selectedInvoice?.invoiceNumber}</strong> to{" "}
              <strong>{selectedInvoice?.customerName}</strong> at{" "}
              <strong>{selectedInvoice?.customerEmail}</strong>?
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

      {/* Cancel Confirmation */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel invoice{" "}
              <strong>{selectedInvoice?.invoiceNumber}</strong>? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invoice</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelInvoice}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete invoice{" "}
              <strong>{selectedInvoice?.invoiceNumber}</strong>. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvoice}
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

// Invoice Form Component
function InvoiceForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: {
  formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    items: InvoiceItem[];
    discount: number;
    discountType: "percentage" | "fixed";
    issueDate: string;
    dueDate: string;
    notes: string;
    terms: string;
  };
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  onAddItem: () => void;
  onRemoveItem: (itemId: number) => void;
  onUpdateItem: (
    itemId: number,
    field: keyof InvoiceItem,
    value: string | number,
  ) => void;
}) {
  const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
  const taxTotal = formData.items.reduce(
    (sum, item) => sum + item.taxAmount,
    0,
  );
  const discountAmount =
    formData.discountType === "percentage"
      ? (subtotal + taxTotal) * (formData.discount / 100)
      : formData.discount;
  const total = subtotal + taxTotal - discountAmount;

  return (
    <div className="space-y-6 py-4">
      {/* Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={onInputChange}
            placeholder="Acme Corp"
          />
          {formErrors.customerName && (
            <p className="text-sm text-red-500">{formErrors.customerName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Customer Email *</Label>
          <Input
            id="customerEmail"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={onInputChange}
            placeholder="accounts@acmecorp.com"
          />
          {formErrors.customerEmail && (
            <p className="text-sm text-red-500">{formErrors.customerEmail}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone</Label>
          <Input
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={onInputChange}
            placeholder="+234 800 123 4567"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date *</Label>
          <Input
            id="issueDate"
            name="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={onInputChange}
          />
          {formErrors.issueDate && (
            <p className="text-sm text-red-500">{formErrors.issueDate}</p>
          )}
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="customerAddress">Address</Label>
          <Input
            id="customerAddress"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={onInputChange}
            placeholder="123 Main St, City, State"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={onInputChange}
          />
          {formErrors.dueDate && (
            <p className="text-sm text-red-500">{formErrors.dueDate}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="terms">Payment Terms</Label>
          <Input
            id="terms"
            name="terms"
            value={formData.terms}
            onChange={onInputChange}
            placeholder="Payment due within 30 days"
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Line Items *</Label>
          <Button type="button" variant="outline" size="sm" onClick={onAddItem}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
        {formErrors.items && (
          <p className="text-sm text-red-500">{formErrors.items}</p>
        )}

        {formData.items.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <Receipt className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No items added yet</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onAddItem}
              className="mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add your first item
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-2 p-3 border rounded-lg bg-muted/30 items-end"
              >
                <div className="col-span-12 sm:col-span-4">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      onUpdateItem(item.id, "description", e.target.value)
                    }
                    placeholder="Item description"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    value={item.quantity || ""}
                    onChange={(e) =>
                      onUpdateItem(
                        item.id,
                        "quantity",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Label className="text-xs">Unit Price</Label>
                  <Input
                    type="number"
                    value={item.unitPrice || ""}
                    onChange={(e) =>
                      onUpdateItem(
                        item.id,
                        "unitPrice",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <Label className="text-xs">Tax %</Label>
                  <Input
                    type="number"
                    value={item.taxRate || ""}
                    onChange={(e) =>
                      onUpdateItem(
                        item.id,
                        "taxRate",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    className="mt-1"
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <Label className="text-xs">Amount</Label>
                  <div className="mt-1 p-2 bg-muted rounded font-medium text-sm">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(item.amount + item.taxAmount)}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-2 flex items-end justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full sm:w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(taxTotal)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={formData.discountType}
                    onValueChange={(value) =>
                      onSelectChange("discountType", value)
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="percentage">%</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    name="discount"
                    value={formData.discount || ""}
                    onChange={onInputChange}
                    placeholder="Discount"
                    className="flex-1"
                  />
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Discount</span>
                    <span>
                      -
                      {new Intl.NumberFormat("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      }).format(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={onInputChange}
          placeholder="Any additional notes..."
          rows={2}
        />
      </div>
    </div>
  );
}
