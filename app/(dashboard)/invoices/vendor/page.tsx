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
import { Progress } from "@/src/components/ui/progress";
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
  ShoppingCart,
  Truck,
  Package,
  Shield,
} from "lucide-react";

// Types
interface VendorInvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  accountCode: string;
  category: string;
}

interface VendorPayment {
  id: number;
  amount: number;
  date: string;
  method: string;
  reference: string;
  notes?: string;
}

interface VendorInvoice {
  id: number;
  invoiceNumber: string;
  vendorInvoiceRef: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorAddress: string;
  vendorTaxId: string;
  purchaseOrderRef?: string;
  items: VendorInvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discount: number;
  discountType: "percentage" | "fixed";
  total: number;
  amountPaid: number;
  balanceDue: number;
  invoiceDate: string;
  dueDate: string;
  status:
    | "draft"
    | "pending"
    | "approved"
    | "partial"
    | "paid"
    | "overdue"
    | "cancelled";
  payments: VendorPayment[];
  department: string;
  approvedBy?: string;
  approvedDate?: string;
  paidDate?: string;
  notes?: string;
  terms?: string;
  paymentTerms: string;
}

// Initial Data
const initialInvoices: VendorInvoice[] = [
  {
    id: 1,
    invoiceNumber: "VEN-2026-001",
    vendorInvoiceRef: "TC-2026-0451",
    vendorName: "TechCorp Solutions",
    vendorEmail: "billing@techcorp.com",
    vendorPhone: "+234 800 111 2233",
    vendorAddress: "45 Awolowo Road, Ikoyi, Lagos",
    vendorTaxId: "VAT-12345678",
    purchaseOrderRef: "PO-2026-0089",
    items: [
      {
        id: 1,
        description: "Dell PowerEdge Server R750",
        quantity: 2,
        unitPrice: 450000,
        amount: 900000,
        taxRate: 7.5,
        taxAmount: 67500,
        accountCode: "EQUIP-001",
        category: "IT Equipment",
      },
      {
        id: 2,
        description: "Network Switch - 48 Port",
        quantity: 2,
        unitPrice: 120000,
        amount: 240000,
        taxRate: 7.5,
        taxAmount: 18000,
        accountCode: "EQUIP-002",
        category: "Networking",
      },
    ],
    subtotal: 1140000,
    taxTotal: 85500,
    discount: 25500,
    discountType: "fixed",
    total: 1200000,
    amountPaid: 1200000,
    balanceDue: 0,
    invoiceDate: "2026-05-10",
    dueDate: "2026-06-10",
    status: "paid",
    payments: [
      {
        id: 1,
        amount: 1200000,
        date: "2026-06-05",
        method: "Bank Transfer",
        reference: "TRF-20260605-001",
      },
    ],
    department: "IT",
    approvedBy: "Sarah Williams",
    approvedDate: "2026-05-12",
    paidDate: "2026-06-05",
    notes: "Server upgrade for Q3 projects",
    terms: "Net 30",
    paymentTerms: "Net 30",
  },
  {
    id: 2,
    invoiceNumber: "VEN-2026-002",
    vendorInvoiceRef: "OM-2026-1120",
    vendorName: "OfficeMart Supplies",
    vendorEmail: "accounts@officemart.com",
    vendorPhone: "+234 800 222 3344",
    vendorAddress: "78 Allen Avenue, Ikeja, Lagos",
    vendorTaxId: "VAT-87654321",
    purchaseOrderRef: "PO-2026-0105",
    items: [
      {
        id: 1,
        description: "Premium A4 Paper (Box of 5 Reams)",
        quantity: 20,
        unitPrice: 8500,
        amount: 170000,
        taxRate: 7.5,
        taxAmount: 12750,
        accountCode: "SUPP-001",
        category: "Office Supplies",
      },
      {
        id: 2,
        description: "HP Printer Ink Cartridge",
        quantity: 10,
        unitPrice: 12000,
        amount: 120000,
        taxRate: 7.5,
        taxAmount: 9000,
        accountCode: "SUPP-002",
        category: "Office Supplies",
      },
      {
        id: 3,
        description: "Desk Organizers",
        quantity: 15,
        unitPrice: 3500,
        amount: 52500,
        taxRate: 7.5,
        taxAmount: 3937.5,
        accountCode: "SUPP-003",
        category: "Office Supplies",
      },
    ],
    subtotal: 342500,
    taxTotal: 25687.5,
    discount: 28187.5,
    discountType: "fixed",
    total: 340000,
    amountPaid: 0,
    balanceDue: 340000,
    invoiceDate: "2026-05-18",
    dueDate: "2026-06-18",
    status: "pending",
    payments: [],
    department: "Administration",
    notes: "Monthly office supplies restock",
    terms: "Net 30",
    paymentTerms: "Net 30",
  },
  {
    id: 3,
    invoiceNumber: "VEN-2026-003",
    vendorInvoiceRef: "CS-2026-0890",
    vendorName: "CloudServ Technologies",
    vendorEmail: "finance@cloudserv.tech",
    vendorPhone: "+234 800 333 4455",
    vendorAddress: "12 Adeola Odeku, Victoria Island, Lagos",
    vendorTaxId: "VAT-56781234",
    purchaseOrderRef: "PO-2026-0120",
    items: [
      {
        id: 1,
        description: "Cloud Infrastructure - Q3 2026",
        quantity: 1,
        unitPrice: 1500000,
        amount: 1500000,
        taxRate: 7.5,
        taxAmount: 112500,
        accountCode: "CLOUD-001",
        category: "Cloud Services",
      },
      {
        id: 2,
        description: "Database Hosting - Premium",
        quantity: 1,
        unitPrice: 400000,
        amount: 400000,
        taxRate: 7.5,
        taxAmount: 30000,
        accountCode: "CLOUD-002",
        category: "Cloud Services",
      },
      {
        id: 3,
        description: "CDN & Security Services",
        quantity: 1,
        unitPrice: 200000,
        amount: 200000,
        taxRate: 7.5,
        taxAmount: 15000,
        accountCode: "CLOUD-003",
        category: "Cloud Services",
      },
    ],
    subtotal: 2100000,
    taxTotal: 157500,
    discount: 157500,
    discountType: "fixed",
    total: 2100000,
    amountPaid: 0,
    balanceDue: 2100000,
    invoiceDate: "2026-05-25",
    dueDate: "2026-06-25",
    status: "approved",
    payments: [],
    department: "Engineering",
    approvedBy: "Mike Brown",
    approvedDate: "2026-05-27",
    notes: "Quarterly cloud infrastructure renewal",
    terms: "Net 30",
    paymentTerms: "Net 30",
  },
  {
    id: 4,
    invoiceNumber: "VEN-2026-004",
    vendorInvoiceRef: "CP-2026-0330",
    vendorName: "ConsultPro Advisory",
    vendorEmail: "invoices@consultpro.com",
    vendorPhone: "+234 800 444 5566",
    vendorAddress: "90 Broad Street, Marina, Lagos",
    vendorTaxId: "VAT-43218765",
    purchaseOrderRef: "PO-2026-0095",
    items: [
      {
        id: 1,
        description: "Financial Advisory Services - May 2026",
        quantity: 1,
        unitPrice: 500000,
        amount: 500000,
        taxRate: 7.5,
        taxAmount: 37500,
        accountCode: "PROF-001",
        category: "Professional Services",
      },
      {
        id: 2,
        description: "Tax Consultation",
        quantity: 1,
        unitPrice: 250000,
        amount: 250000,
        taxRate: 7.5,
        taxAmount: 18750,
        accountCode: "PROF-002",
        category: "Professional Services",
      },
    ],
    subtotal: 750000,
    taxTotal: 56250,
    discount: 56250,
    discountType: "fixed",
    total: 750000,
    amountPaid: 250000,
    balanceDue: 500000,
    invoiceDate: "2026-05-01",
    dueDate: "2026-07-01",
    status: "overdue",
    payments: [
      {
        id: 1,
        amount: 250000,
        date: "2026-06-20",
        method: "Cheque",
        reference: "CHQ-009876",
      },
    ],
    department: "Finance",
    approvedBy: "Sarah Williams",
    approvedDate: "2026-05-03",
    notes: "Partial payment made. Balance overdue.",
    terms: "Net 60",
    paymentTerms: "Net 60",
  },
  {
    id: 5,
    invoiceNumber: "VEN-2026-005",
    vendorInvoiceRef: "SS-2026-1560",
    vendorName: "SecureShield Ltd",
    vendorEmail: "ap@secureshield.com",
    vendorPhone: "+234 800 555 6677",
    vendorAddress: "56 Mobolaji Bank Anthony, Ikeja, Lagos",
    vendorTaxId: "VAT-34567890",
    items: [
      {
        id: 1,
        description: "Annual Security Audit",
        quantity: 1,
        unitPrice: 800000,
        amount: 800000,
        taxRate: 7.5,
        taxAmount: 60000,
        accountCode: "SEC-001",
        category: "Security Services",
      },
      {
        id: 2,
        description: "Firewall Configuration",
        quantity: 1,
        unitPrice: 350000,
        amount: 350000,
        taxRate: 7.5,
        taxAmount: 26250,
        accountCode: "SEC-002",
        category: "Security Services",
      },
    ],
    subtotal: 1150000,
    taxTotal: 86250,
    discount: 0,
    discountType: "fixed",
    total: 1236250,
    amountPaid: 600000,
    balanceDue: 636250,
    invoiceDate: "2026-05-15",
    dueDate: "2026-06-15",
    status: "partial",
    payments: [
      {
        id: 1,
        amount: 600000,
        date: "2026-06-10",
        method: "Bank Transfer",
        reference: "TRF-20260610-003",
      },
    ],
    department: "IT",
    approvedBy: "Mike Brown",
    approvedDate: "2026-05-17",
    notes: "Remaining balance to be paid by month end",
    terms: "Net 30",
    paymentTerms: "Net 30",
  },
  {
    id: 6,
    invoiceNumber: "VEN-2026-006",
    vendorInvoiceRef: "FM-2026-2200",
    vendorName: "FacilityMasters Inc",
    vendorEmail: "billing@facilitymasters.com",
    vendorPhone: "+234 800 666 7788",
    vendorAddress: "23 Opebi Road, Ikeja, Lagos",
    vendorTaxId: "VAT-78901234",
    items: [
      {
        id: 1,
        description: "Office Cleaning Services - June",
        quantity: 1,
        unitPrice: 180000,
        amount: 180000,
        taxRate: 7.5,
        taxAmount: 13500,
        accountCode: "FAC-001",
        category: "Facility Management",
      },
      {
        id: 2,
        description: "Generator Maintenance",
        quantity: 1,
        unitPrice: 95000,
        amount: 95000,
        taxRate: 7.5,
        taxAmount: 7125,
        accountCode: "FAC-002",
        category: "Facility Management",
      },
      {
        id: 3,
        description: "Pest Control Service",
        quantity: 1,
        unitPrice: 65000,
        amount: 65000,
        taxRate: 7.5,
        taxAmount: 4875,
        accountCode: "FAC-003",
        category: "Facility Management",
      },
    ],
    subtotal: 340000,
    taxTotal: 25500,
    discount: 0,
    discountType: "fixed",
    total: 365500,
    amountPaid: 0,
    balanceDue: 365500,
    invoiceDate: "2026-06-01",
    dueDate: "2026-07-01",
    status: "draft",
    payments: [],
    department: "Administration",
    notes: "Monthly facility maintenance services",
    terms: "Net 30",
    paymentTerms: "Net 30",
  },
];

const expenseCategories = [
  "IT Equipment",
  "Networking",
  "Office Supplies",
  "Cloud Services",
  "Professional Services",
  "Security Services",
  "Facility Management",
  "Software Licenses",
  "Marketing",
  "Travel",
  "Utilities",
  "Other",
];

const departments = [
  "IT",
  "Administration",
  "Engineering",
  "Finance",
  "Marketing",
  "HR",
  "Sales",
  "Operations",
];
const paymentMethods = [
  "Bank Transfer",
  "Cheque",
  "Cash",
  "Direct Deposit",
  "Online Payment",
  "Wire Transfer",
];

export default function VendorInvoicesPage() {
  // State
  const [invoices, setInvoices] = useState<VendorInvoice[]>(initialInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof VendorInvoice;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<VendorInvoice | null>(
    null,
  );
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [formData, setFormData] = useState({
    vendorInvoiceRef: "",
    vendorName: "",
    vendorEmail: "",
    vendorPhone: "",
    vendorAddress: "",
    vendorTaxId: "",
    purchaseOrderRef: "",
    items: [] as VendorInvoiceItem[],
    discount: 0,
    discountType: "fixed" as "percentage" | "fixed",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    department: "",
    notes: "",
    paymentTerms: "Net 30",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalPayables = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
    const totalOutstanding = invoices.reduce(
      (sum, inv) => sum + inv.balanceDue,
      0,
    );
    const overdueAmount = invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((sum, inv) => sum + inv.balanceDue, 0);
    const dueNext30Days = invoices
      .filter((inv) => {
        const dueDate = new Date(inv.dueDate);
        const thirtyDays = new Date();
        thirtyDays.setDate(thirtyDays.getDate() + 30);
        return inv.status !== "paid" && dueDate <= thirtyDays;
      })
      .reduce((sum, inv) => sum + inv.balanceDue, 0);

    const pending = invoices.filter((inv) => inv.status === "pending").length;
    const approved = invoices.filter((inv) => inv.status === "approved").length;
    const paid = invoices.filter((inv) => inv.status === "paid").length;
    const overdue = invoices.filter((inv) => inv.status === "overdue").length;

    return {
      totalPayables,
      totalPaid,
      totalOutstanding,
      overdueAmount,
      dueNext30Days,
      pending,
      approved,
      paid,
      overdue,
      totalInvoices: invoices.length,
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
          inv.vendorInvoiceRef.toLowerCase().includes(query) ||
          inv.vendorName.toLowerCase().includes(query) ||
          inv.vendorEmail.toLowerCase().includes(query) ||
          inv.department.toLowerCase().includes(query) ||
          (inv.purchaseOrderRef &&
            inv.purchaseOrderRef.toLowerCase().includes(query)),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((inv) => inv.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter((inv) => inv.department === departmentFilter);
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

    // Default sort by due date ascending (closest due first)
    result.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );

    return result;
  }, [invoices, searchQuery, statusFilter, departmentFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Invoice number generator
  const generateInvoiceNumber = () => {
    const count = invoices.length + 1;
    return `VEN-2026-${String(count).padStart(3, "0")}`;
  };

  // Handlers
  const handleSort = (key: keyof VendorInvoice) => {
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
    const newItem: VendorInvoiceItem = {
      id: Date.now(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
      taxRate: 7.5,
      taxAmount: 0,
      accountCode: "",
      category: "",
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
    field: keyof VendorInvoiceItem,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id !== itemId) return item;

        const updated = { ...item, [field]: value };

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
    items: VendorInvoiceItem[],
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

    if (!formData.vendorName.trim())
      errors.vendorName = "Vendor name is required";
    if (!formData.vendorInvoiceRef.trim())
      errors.vendorInvoiceRef = "Vendor invoice reference is required";
    if (!formData.vendorEmail.trim()) {
      errors.vendorEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.vendorEmail)) {
      errors.vendorEmail = "Invalid email format";
    }
    if (!formData.department) errors.department = "Department is required";
    if (formData.items.length === 0)
      errors.items = "At least one item is required";
    if (!formData.invoiceDate) errors.invoiceDate = "Invoice date is required";
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

    const newInvoice: VendorInvoice = {
      id: Math.max(...invoices.map((inv) => inv.id), 0) + 1,
      invoiceNumber: generateInvoiceNumber(),
      vendorInvoiceRef: formData.vendorInvoiceRef,
      vendorName: formData.vendorName,
      vendorEmail: formData.vendorEmail,
      vendorPhone: formData.vendorPhone,
      vendorAddress: formData.vendorAddress,
      vendorTaxId: formData.vendorTaxId,
      purchaseOrderRef: formData.purchaseOrderRef || undefined,
      items: formData.items,
      subtotal: totals.subtotal,
      taxTotal: totals.taxTotal,
      discount: formData.discount,
      discountType: formData.discountType,
      total: totals.total,
      amountPaid: 0,
      balanceDue: totals.total,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      status: "draft",
      payments: [],
      department: formData.department,
      notes: formData.notes,
      paymentTerms: formData.paymentTerms,
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
              vendorInvoiceRef: formData.vendorInvoiceRef,
              vendorName: formData.vendorName,
              vendorEmail: formData.vendorEmail,
              vendorPhone: formData.vendorPhone,
              vendorAddress: formData.vendorAddress,
              vendorTaxId: formData.vendorTaxId,
              purchaseOrderRef: formData.purchaseOrderRef || undefined,
              items: formData.items,
              subtotal: totals.subtotal,
              taxTotal: totals.taxTotal,
              discount: formData.discount,
              discountType: formData.discountType,
              total: totals.total,
              balanceDue: totals.total - inv.amountPaid,
              invoiceDate: formData.invoiceDate,
              dueDate: formData.dueDate,
              department: formData.department,
              notes: formData.notes,
              paymentTerms: formData.paymentTerms,
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

  const handleApproveInvoice = () => {
    if (!selectedInvoice) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoice.id
          ? {
              ...inv,
              status: "approved" as const,
              approvedBy: "Admin User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : inv,
      ),
    );

    setIsApproveDialogOpen(false);
    setSelectedInvoice(null);
  };

  const handlePayInvoice = () => {
    if (!selectedInvoice || paymentAmount <= 0) return;

    const newPayment: VendorPayment = {
      id: (selectedInvoice.payments?.length || 0) + 1,
      amount: paymentAmount,
      date: paymentDate,
      method: paymentMethod,
      reference: paymentReference,
    };

    const newAmountPaid = selectedInvoice.amountPaid + paymentAmount;
    const newBalance = selectedInvoice.total - newAmountPaid;

    let newStatus: VendorInvoice["status"] = "partial";
    if (newBalance <= 0) {
      newStatus = "paid";
    } else if (
      new Date(selectedInvoice.dueDate) < new Date() &&
      newBalance > 0
    ) {
      newStatus = "overdue";
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

    resetPaymentForm();
    setIsPayDialogOpen(false);
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

  const openEditModal = (invoice: VendorInvoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      vendorInvoiceRef: invoice.vendorInvoiceRef,
      vendorName: invoice.vendorName,
      vendorEmail: invoice.vendorEmail,
      vendorPhone: invoice.vendorPhone,
      vendorAddress: invoice.vendorAddress,
      vendorTaxId: invoice.vendorTaxId,
      purchaseOrderRef: invoice.purchaseOrderRef || "",
      items: [...invoice.items],
      discount: invoice.discount,
      discountType: invoice.discountType,
      invoiceDate: invoice.invoiceDate,
      dueDate: invoice.dueDate,
      department: invoice.department,
      notes: invoice.notes || "",
      paymentTerms: invoice.paymentTerms,
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (invoice: VendorInvoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      vendorInvoiceRef: "",
      vendorName: "",
      vendorEmail: "",
      vendorPhone: "",
      vendorAddress: "",
      vendorTaxId: "",
      purchaseOrderRef: "",
      items: [],
      discount: 0,
      discountType: "fixed",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      department: "",
      notes: "",
      paymentTerms: "Net 30",
    });
    setFormErrors({});
  };

  const resetPaymentForm = () => {
    setPaymentAmount(0);
    setPaymentMethod("Bank Transfer");
    setPaymentReference("");
    setPaymentDate(new Date().toISOString().split("T")[0]);
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

  const getStatusBadge = (status: VendorInvoice["status"]) => {
    switch (status) {
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
            <FileText className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
            <FileCheck className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
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

  const getPaymentProgress = (invoice: VendorInvoice) => {
    return invoice.total > 0
      ? Math.round((invoice.amountPaid / invoice.total) * 100)
      : 0;
  };

  const canEdit = (status: string) => status === "draft";
  const canApprove = (status: string) => status === "pending";
  const canPay = (status: string) =>
    ["approved", "partial", "overdue"].includes(status);
  const canCancel = (status: string) => ["draft", "pending"].includes(status);
  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Purchase Invoices
          </h1>
          <p className="text-muted-foreground mt-1">
            Accounts Payable — vendor invoices and payments
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Vendor Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Vendor Invoice</DialogTitle>
              <DialogDescription>
                Enter the vendor invoice details and line items below.
              </DialogDescription>
            </DialogHeader>
            <VendorInvoiceForm
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
                <p className="text-sm text-muted-foreground">Total Payables</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalPayables)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
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
                <p className="text-sm text-muted-foreground">
                  Due Next 30 Days
                </p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.dueNext30Days)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Paid</p>
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
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice #, vendor, PO, department..."
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={(value) => {
                setDepartmentFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
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
          <CardTitle>All Vendor Invoices</CardTitle>
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
                  <TableHead>Vendor</TableHead>
                  <TableHead>Dept</TableHead>
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
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No vendor invoices found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInvoices.map((invoice) => (
                    <TableRow
                      key={invoice.id}
                      className={
                        isDueSoon(invoice.dueDate) && invoice.status !== "paid"
                          ? "bg-orange-50/50"
                          : ""
                      }
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {invoice.invoiceNumber}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.vendorInvoiceRef}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {invoice.vendorName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.vendorEmail}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {invoice.department}
                        </Badge>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {formatDate(invoice.dueDate)}
                          </span>
                          {isDueSoon(invoice.dueDate) &&
                            invoice.status !== "paid" && (
                              <Badge className="bg-orange-100 text-orange-700 text-xs">
                                Due Soon
                              </Badge>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-[80px] space-y-1">
                          <Progress
                            value={getPaymentProgress(invoice)}
                            className="h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {getPaymentProgress(invoice)}%
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
                              {canApprove(invoice.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setIsApproveDialogOpen(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                  Approve
                                </DropdownMenuItem>
                              )}
                              {canPay(invoice.status) && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedInvoice(invoice);
                                    setPaymentAmount(invoice.balanceDue);
                                    setIsPayDialogOpen(true);
                                  }}
                                >
                                  <Banknote className="h-4 w-4 mr-2 text-blue-600" />
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
            <DialogTitle>Vendor Invoice Details</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoiceNumber} - {selectedInvoice?.vendorName}
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
                  <p className="text-sm text-muted-foreground">
                    Vendor Ref: {selectedInvoice.vendorInvoiceRef}
                  </p>
                  {selectedInvoice.purchaseOrderRef && (
                    <p className="text-sm text-muted-foreground">
                      PO: {selectedInvoice.purchaseOrderRef}
                    </p>
                  )}
                </div>
                {getStatusBadge(selectedInvoice.status)}
              </div>

              {/* Vendor & Invoice Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    Vendor
                  </p>
                  <p className="font-semibold">{selectedInvoice.vendorName}</p>
                  <p className="text-sm">{selectedInvoice.vendorEmail}</p>
                  <p className="text-sm">{selectedInvoice.vendorPhone}</p>
                  <p className="text-sm">{selectedInvoice.vendorAddress}</p>
                  <p className="text-sm text-muted-foreground">
                    Tax ID: {selectedInvoice.vendorTaxId}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    Invoice Details
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Invoice Date:</span>
                      <span className="font-medium">
                        {formatDate(selectedInvoice.invoiceDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span className="font-medium">
                        {formatDate(selectedInvoice.dueDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Department:</span>
                      <span className="font-medium">
                        {selectedInvoice.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Terms:</span>
                      <span className="font-medium">
                        {selectedInvoice.paymentTerms}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <p className="font-medium mb-2">Line Items</p>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Tax</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="text-sm">{item.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.accountCode}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {formatCurrency(item.unitPrice)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(item.taxAmount)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(item.amount + item.taxAmount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex justify-end mt-4">
                  <div className="w-72 space-y-2">
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

              {/* Approval Info */}
              {selectedInvoice.approvedBy && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Approved by</p>
                  <p className="font-medium">{selectedInvoice.approvedBy}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(selectedInvoice.approvedDate || "")}
                  </p>
                </div>
              )}

              {selectedInvoice.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedInvoice.notes}</p>
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
            {selectedInvoice && canPay(selectedInvoice.status) && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  setPaymentAmount(selectedInvoice.balanceDue);
                  setIsPayDialogOpen(true);
                }}
              >
                <Banknote className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Vendor Invoice</DialogTitle>
            <DialogDescription>
              Update invoice details and line items.
            </DialogDescription>
          </DialogHeader>
          <VendorInvoiceForm
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

      {/* Pay Invoice Dialog */}
      <Dialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              {selectedInvoice?.invoiceNumber} - {selectedInvoice?.vendorName}
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
              <Label>Amount *</Label>
              <Input
                type="number"
                value={paymentAmount || ""}
                onChange={(e) =>
                  setPaymentAmount(parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Date</Label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
              <Label>Reference #</Label>
              <Input
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder="e.g., TRF-20260610-001"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPayDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePayInvoice}>
              <Banknote className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Confirmation */}
      <AlertDialog
        open={isApproveDialogOpen}
        onOpenChange={setIsApproveDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Vendor Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Approve invoice <strong>{selectedInvoice?.invoiceNumber}</strong>{" "}
              from <strong>{selectedInvoice?.vendorName}</strong> for{" "}
              <strong>
                {selectedInvoice && formatCurrency(selectedInvoice.total)}
              </strong>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproveInvoice}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
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

// Vendor Invoice Form Component
function VendorInvoiceForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
}: {
  formData: {
    vendorInvoiceRef: string;
    vendorName: string;
    vendorEmail: string;
    vendorPhone: string;
    vendorAddress: string;
    vendorTaxId: string;
    purchaseOrderRef: string;
    items: VendorInvoiceItem[];
    discount: number;
    discountType: "percentage" | "fixed";
    invoiceDate: string;
    dueDate: string;
    department: string;
    notes: string;
    paymentTerms: string;
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
    field: keyof VendorInvoiceItem,
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
      {/* Vendor Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vendorName">Vendor Name *</Label>
          <Input
            id="vendorName"
            name="vendorName"
            value={formData.vendorName}
            onChange={onInputChange}
            placeholder="TechCorp Solutions"
          />
          {formErrors.vendorName && (
            <p className="text-sm text-red-500">{formErrors.vendorName}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendorEmail">Vendor Email *</Label>
          <Input
            id="vendorEmail"
            name="vendorEmail"
            type="email"
            value={formData.vendorEmail}
            onChange={onInputChange}
            placeholder="billing@vendor.com"
          />
          {formErrors.vendorEmail && (
            <p className="text-sm text-red-500">{formErrors.vendorEmail}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendorInvoiceRef">Vendor Invoice Ref *</Label>
          <Input
            id="vendorInvoiceRef"
            name="vendorInvoiceRef"
            value={formData.vendorInvoiceRef}
            onChange={onInputChange}
            placeholder="TC-2026-0451"
          />
          {formErrors.vendorInvoiceRef && (
            <p className="text-sm text-red-500">
              {formErrors.vendorInvoiceRef}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="purchaseOrderRef">Purchase Order Ref</Label>
          <Input
            id="purchaseOrderRef"
            name="purchaseOrderRef"
            value={formData.purchaseOrderRef}
            onChange={onInputChange}
            placeholder="PO-2026-0089"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendorPhone">Phone</Label>
          <Input
            id="vendorPhone"
            name="vendorPhone"
            value={formData.vendorPhone}
            onChange={onInputChange}
            placeholder="+234 800 111 2233"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vendorTaxId">Tax ID</Label>
          <Input
            id="vendorTaxId"
            name="vendorTaxId"
            value={formData.vendorTaxId}
            onChange={onInputChange}
            placeholder="VAT-12345678"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="vendorAddress">Address</Label>
          <Input
            id="vendorAddress"
            name="vendorAddress"
            value={formData.vendorAddress}
            onChange={onInputChange}
            placeholder="123 Main St, City, State"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => onSelectChange("department", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.department && (
            <p className="text-sm text-red-500">{formErrors.department}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="invoiceDate">Invoice Date *</Label>
          <Input
            id="invoiceDate"
            name="invoiceDate"
            type="date"
            value={formData.invoiceDate}
            onChange={onInputChange}
          />
          {formErrors.invoiceDate && (
            <p className="text-sm text-red-500">{formErrors.invoiceDate}</p>
          )}
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
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select
            value={formData.paymentTerms}
            onValueChange={(value) => onSelectChange("paymentTerms", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Net 15">Net 15</SelectItem>
              <SelectItem value="Net 30">Net 30</SelectItem>
              <SelectItem value="Net 45">Net 45</SelectItem>
              <SelectItem value="Net 60">Net 60</SelectItem>
              <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
            </SelectContent>
          </Select>
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
            <Package className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
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
                <div className="col-span-12 sm:col-span-3">
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
                <div className="col-span-6 sm:col-span-2">
                  <Label className="text-xs">Category</Label>
                  <Select
                    value={item.category}
                    onValueChange={(value) =>
                      onUpdateItem(item.id, "category", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <div className="col-span-6 sm:col-span-2">
                  <Label className="text-xs">Account Code</Label>
                  <Input
                    value={item.accountCode}
                    onChange={(e) =>
                      onUpdateItem(item.id, "accountCode", e.target.value)
                    }
                    placeholder="ACC-001"
                    className="mt-1"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <Label className="text-xs">Amount</Label>
                  <div className="mt-1 p-2 bg-muted rounded font-medium text-sm">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    }).format(item.amount + item.taxAmount)}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-1 flex items-end justify-end">
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
