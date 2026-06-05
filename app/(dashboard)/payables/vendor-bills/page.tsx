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
  CreditCard,
  Send,
  Printer,
  MoreHorizontal,
  PlusCircle,
  MinusCircle,
  Landmark,
  TrendingUp,
  TrendingDown,
  Wallet,
  Banknote,
  Upload,
  Paperclip,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type BillStatus =
  | "draft"
  | "pending"
  | "approved"
  | "paid"
  | "overdue"
  | "cancelled";
type BillType = "purchase" | "service" | "utility" | "rent" | "other";

interface BillLineItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  accountCode?: string;
  costCenter?: string;
}

interface Bill {
  id: number;
  billNumber: string;
  vendor: {
    id: number;
    name: string;
    code: string;
    contactPerson: string;
    email: string;
    phone: string;
    taxId: string;
  };
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  billDate: string;
  type: BillType;
  status: BillStatus;
  lineItems: BillLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  currency: string;
  notes?: string;
  attachments?: {
    id: number;
    name: string;
    url: string;
  }[];
  paymentHistory?: {
    id: number;
    date: string;
    amount: number;
    method: string;
    reference: string;
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
  createdAt: string;
  updatedAt: string;
}

// Mock Vendors
const mockVendors = [
  {
    id: 1,
    name: "Office Depot Nigeria",
    code: "VEN-001",
    contactPerson: "John Adeyemi",
    email: "john@officedepot.ng",
    phone: "+234 802 123 4567",
    taxId: "RC-1234567",
  },
  {
    id: 2,
    name: "Tech Solutions Ltd",
    code: "VEN-002",
    contactPerson: "Sarah Okafor",
    email: "sarah@techsolutions.ng",
    phone: "+234 803 456 7890",
    taxId: "RC-7654321",
  },
  {
    id: 3,
    name: "Power Utility Company",
    code: "VEN-003",
    contactPerson: "Customer Service",
    email: "billing@powerco.ng",
    phone: "+234 700 123 4567",
    taxId: "RC-9876543",
  },
  {
    id: 4,
    name: "Property Management Ltd",
    code: "VEN-004",
    contactPerson: "David Okonkwo",
    email: "david@property.ng",
    phone: "+234 805 678 9012",
    taxId: "RC-1122334",
  },
];

// Mock Bills
const mockBills: Bill[] = [
  {
    id: 1,
    billNumber: "BILL-2026-0001",
    vendor: mockVendors[0],
    invoiceNumber: "INV-2026-045",
    invoiceDate: "2026-02-28",
    dueDate: "2026-03-30",
    billDate: "2026-03-01",
    type: "purchase",
    status: "paid",
    lineItems: [
      {
        id: 1,
        description: "Office Supplies",
        quantity: 1,
        unitPrice: 250000,
        discount: 0,
        tax: 7.5,
        total: 268750,
        accountCode: "5100",
        costCenter: "Operations",
      },
      {
        id: 2,
        description: "Stationery",
        quantity: 1,
        unitPrice: 50000,
        discount: 0,
        tax: 7.5,
        total: 53750,
        accountCode: "5100",
        costCenter: "Operations",
      },
    ],
    subtotal: 300000,
    discountTotal: 0,
    taxTotal: 22500,
    totalAmount: 322500,
    amountPaid: 322500,
    balanceDue: 0,
    currency: "NGN",
    notes: "Monthly office supplies",
    createdBy: { id: 1, name: "John Smith" },
    approvedBy: { id: 2, name: "Jane Manager", date: "2026-03-01T10:00:00" },
    paymentHistory: [
      {
        id: 1,
        date: "2026-03-15",
        amount: 322500,
        method: "Bank Transfer",
        reference: "TRF-2026-0123",
      },
    ],
    createdAt: "2026-03-01T09:00:00",
    updatedAt: "2026-03-15T14:00:00",
  },
  {
    id: 2,
    billNumber: "BILL-2026-0002",
    vendor: mockVendors[1],
    invoiceNumber: "INV-2026-089",
    invoiceDate: "2026-03-05",
    dueDate: "2026-04-19",
    billDate: "2026-03-06",
    type: "service",
    status: "pending",
    lineItems: [
      {
        id: 3,
        description: "IT Support Services - March",
        quantity: 1,
        unitPrice: 500000,
        discount: 0,
        tax: 7.5,
        total: 537500,
        accountCode: "5200",
        costCenter: "IT",
      },
      {
        id: 4,
        description: "Cloud Hosting",
        quantity: 1,
        unitPrice: 250000,
        discount: 0,
        tax: 7.5,
        total: 268750,
        accountCode: "5200",
        costCenter: "IT",
      },
    ],
    subtotal: 750000,
    discountTotal: 0,
    taxTotal: 56250,
    totalAmount: 806250,
    amountPaid: 0,
    balanceDue: 806250,
    currency: "NGN",
    notes: "Monthly IT services and cloud hosting",
    createdBy: { id: 1, name: "Alice Johnson" },
    approvedBy: { id: 2, name: "Tech Director", date: "2026-03-06T14:30:00" },
    createdAt: "2026-03-06T11:00:00",
    updatedAt: "2026-03-06T14:30:00",
  },
  {
    id: 3,
    billNumber: "BILL-2026-0003",
    vendor: mockVendors[2],
    invoiceNumber: "UTIL-2026-03",
    invoiceDate: "2026-03-10",
    dueDate: "2026-03-25",
    billDate: "2026-03-12",
    type: "utility",
    status: "overdue",
    lineItems: [
      {
        id: 5,
        description: "Electricity Bill - February",
        quantity: 1,
        unitPrice: 185000,
        discount: 0,
        tax: 7.5,
        total: 198875,
        accountCode: "5300",
        costCenter: "Facilities",
      },
      {
        id: 6,
        description: "Water Bill - February",
        quantity: 1,
        unitPrice: 25000,
        discount: 0,
        tax: 7.5,
        total: 26875,
        accountCode: "5300",
        costCenter: "Facilities",
      },
    ],
    subtotal: 210000,
    discountTotal: 0,
    taxTotal: 15750,
    totalAmount: 225750,
    amountPaid: 0,
    balanceDue: 225750,
    currency: "NGN",
    notes: "Utility bills for February",
    createdBy: { id: 1, name: "Facilities Manager" },
    createdAt: "2026-03-12T09:00:00",
    updatedAt: "2026-03-12T09:00:00",
  },
  {
    id: 4,
    billNumber: "BILL-2026-0004",
    vendor: mockVendors[3],
    invoiceNumber: "RENT-2026-03",
    invoiceDate: "2026-03-01",
    dueDate: "2026-03-15",
    billDate: "2026-03-01",
    type: "rent",
    status: "approved",
    lineItems: [
      {
        id: 7,
        description: "Office Rent - March",
        quantity: 1,
        unitPrice: 1500000,
        discount: 0,
        tax: 7.5,
        total: 1612500,
        accountCode: "5200",
        costCenter: "Facilities",
      },
    ],
    subtotal: 1500000,
    discountTotal: 0,
    taxTotal: 112500,
    totalAmount: 1612500,
    amountPaid: 0,
    balanceDue: 1612500,
    currency: "NGN",
    notes: "Monthly office rent",
    createdBy: { id: 1, name: "Admin Manager" },
    approvedBy: {
      id: 2,
      name: "Finance Director",
      date: "2026-03-02T10:00:00",
    },
    createdAt: "2026-03-01T14:00:00",
    updatedAt: "2026-03-02T10:00:00",
  },
  {
    id: 5,
    billNumber: "BILL-2026-0005",
    vendor: mockVendors[0],
    invoiceNumber: "INV-2026-102",
    invoiceDate: "2026-03-12",
    dueDate: "2026-04-11",
    billDate: "2026-03-14",
    type: "purchase",
    status: "draft",
    lineItems: [
      {
        id: 8,
        description: "Filing Cabinets",
        quantity: 2,
        unitPrice: 75000,
        discount: 5,
        tax: 7.5,
        total: 161250,
        accountCode: "1210",
        costCenter: "Admin",
      },
    ],
    subtotal: 150000,
    discountTotal: 7500,
    taxTotal: 10687.5,
    totalAmount: 153187.5,
    amountPaid: 0,
    balanceDue: 153187.5,
    currency: "NGN",
    notes: "New filing cabinets for admin",
    createdBy: { id: 1, name: "Sarah Williams" },
    createdAt: "2026-03-14T11:00:00",
    updatedAt: "2026-03-14T11:00:00",
  },
];

const billStatuses = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  {
    value: "pending",
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-700" },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-700" },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700",
  },
];

const billTypes = [
  { value: "purchase", label: "Purchase" },
  { value: "service", label: "Service" },
  { value: "utility", label: "Utility" },
  { value: "rent", label: "Rent" },
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

const getStatusBadge = (status: BillStatus) => {
  const config = billStatuses.find((s) => s.value === status);
  const icons = {
    draft: <FileText className="h-3 w-3 mr-1" />,
    pending: <Clock className="h-3 w-3 mr-1" />,
    approved: <CheckCircle className="h-3 w-3 mr-1" />,
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

export default function VendorBills() {
  const router = useRouter();

  // State
  const [bills, setBills] = useState<Bill[]>(mockBills);
  const [vendors] = useState(mockVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Bill;
    direction: "asc" | "desc";
  }>({ key: "billDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isPayDialogOpen, setIsPayDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"bills" | "payments">("bills");

  // Form state
  const [formData, setFormData] = useState({
    vendorId: 0,
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    billDate: new Date().toISOString().split("T")[0],
    type: "purchase" as BillType,
    lineItems: [] as BillLineItem[],
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingItem, setEditingItem] = useState<BillLineItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentReference, setPaymentReference] = useState("");

  // Statistics
  const stats = useMemo(() => {
    const totalBills = bills.length;
    const totalOutstanding = bills.reduce(
      (sum, bill) => sum + bill.balanceDue,
      0,
    );
    const overdueCount = bills.filter(
      (bill) => bill.status === "overdue",
    ).length;
    const paidCount = bills.filter((bill) => bill.status === "paid").length;
    const pendingCount = bills.filter(
      (bill) => bill.status === "pending",
    ).length;
    const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

    return {
      totalBills,
      totalOutstanding,
      overdueCount,
      paidCount,
      pendingCount,
      totalAmount,
    };
  }, [bills]);

  // Filter and sort
  const filteredBills = useMemo(() => {
    let result = [...bills];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (bill) =>
          bill.billNumber.toLowerCase().includes(query) ||
          bill.vendor.name.toLowerCase().includes(query) ||
          bill.invoiceNumber.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((bill) => bill.status === statusFilter);
    }

    if (vendorFilter !== "all") {
      result = result.filter(
        (bill) => bill.vendor.id === parseInt(vendorFilter),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((bill) => bill.type === typeFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (
          sortConfig.key === "billDate" ||
          sortConfig.key === "invoiceDate" ||
          sortConfig.key === "dueDate"
        ) {
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
  }, [bills, searchQuery, statusFilter, vendorFilter, typeFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const paginatedBills = filteredBills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate line item totals
  const calculateItemTotal = (item: BillLineItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = discountedSubtotal * (item.tax / 100);
    return discountedSubtotal + taxAmount;
  };

  const calculateBillTotals = (items: BillLineItem[]) => {
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
  const handleSort = (key: keyof Bill) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewBill = (bill: Bill) => {
    setSelectedBill(bill);
    setIsViewModalOpen(true);
  };

  const handleEditBill = (bill: Bill) => {
    setSelectedBill(bill);
    setFormData({
      vendorId: bill.vendor.id,
      invoiceNumber: bill.invoiceNumber,
      invoiceDate: bill.invoiceDate,
      dueDate: bill.dueDate,
      billDate: bill.billDate,
      type: bill.type,
      lineItems: [...bill.lineItems],
      notes: bill.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: BillLineItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<BillLineItem>) => {
    if (editingItem) {
      setFormData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item) =>
          item.id === editingItem.id
            ? ({ ...item, ...itemData } as BillLineItem)
            : item,
        ),
      }));
    } else {
      const newItem: BillLineItem = {
        id: Date.now(),
        description: itemData.description || "",
        quantity: itemData.quantity || 1,
        unitPrice: itemData.unitPrice || 0,
        discount: itemData.discount || 0,
        tax: itemData.tax || 7.5,
        total: 0,
        accountCode: itemData.accountCode,
        costCenter: itemData.costCenter,
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
    if (!formData.vendorId) errors.vendorId = "Vendor is required";
    if (!formData.invoiceNumber)
      errors.invoiceNumber = "Invoice number is required";
    if (!formData.invoiceDate) errors.invoiceDate = "Invoice date is required";
    if (!formData.dueDate) errors.dueDate = "Due date is required";
    if (formData.lineItems.length === 0)
      errors.lineItems = "At least one line item is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateBill = () => {
    if (!validateForm()) return;

    const selectedVendor = vendors.find((v) => v.id === formData.vendorId);
    const { subtotal, discountTotal, taxTotal } = calculateBillTotals(
      formData.lineItems,
    );
    const totalAmount = subtotal - discountTotal + taxTotal;

    const newBill: Bill = {
      id: Math.max(...bills.map((b) => b.id), 0) + 1,
      billNumber: `BILL-${new Date().getFullYear()}-${String(bills.length + 1).padStart(4, "0")}`,
      vendor: selectedVendor!,
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      billDate: formData.billDate,
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
      createdBy: { id: 1, name: "Current User" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBills((prev) => [newBill, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateBill = () => {
    if (!validateForm() || !selectedBill) return;

    const selectedVendor = vendors.find((v) => v.id === formData.vendorId);
    const { subtotal, discountTotal, taxTotal } = calculateBillTotals(
      formData.lineItems,
    );
    const totalAmount = subtotal - discountTotal + taxTotal;

    const updatedBill: Bill = {
      ...selectedBill,
      vendor: selectedVendor!,
      invoiceNumber: formData.invoiceNumber,
      invoiceDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      billDate: formData.billDate,
      type: formData.type,
      lineItems: formData.lineItems.map((item) => ({
        ...item,
        total: calculateItemTotal(item),
      })),
      subtotal,
      discountTotal,
      taxTotal,
      totalAmount,
      balanceDue: totalAmount - selectedBill.amountPaid,
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    };

    setBills((prev) =>
      prev.map((b) => (b.id === selectedBill.id ? updatedBill : b)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedBill(null);
  };

  const handleApproveBill = () => {
    if (!selectedBill) return;
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === selectedBill.id
          ? {
              ...bill,
              status: "approved",
              approvedBy: {
                id: 1,
                name: "Approver",
                date: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : bill,
      ),
    );
    setIsApproveDialogOpen(false);
    setSelectedBill(null);
  };

  const handlePayBill = () => {
    if (!selectedBill || paymentAmount <= 0) return;

    const newAmountPaid = selectedBill.amountPaid + paymentAmount;
    const newBalanceDue = selectedBill.totalAmount - newAmountPaid;
    const newStatus = newBalanceDue <= 0 ? "paid" : selectedBill.status;

    const paymentRecord = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      amount: paymentAmount,
      method: paymentMethod,
      reference: paymentReference,
    };

    setBills((prev) =>
      prev.map((bill) =>
        bill.id === selectedBill.id
          ? {
              ...bill,
              amountPaid: newAmountPaid,
              balanceDue: newBalanceDue,
              status: newStatus,
              paymentHistory: [...(bill.paymentHistory || []), paymentRecord],
              updatedAt: new Date().toISOString(),
            }
          : bill,
      ),
    );
    setIsPayDialogOpen(false);
    setSelectedBill(null);
    setPaymentAmount(0);
    setPaymentReference("");
  };

  const handleDeleteBill = () => {
    if (!selectedBill) return;
    setBills((prev) => prev.filter((b) => b.id !== selectedBill.id));
    setIsDeleteDialogOpen(false);
    setSelectedBill(null);
  };

  const resetForm = () => {
    setFormData({
      vendorId: 0,
      invoiceNumber: "",
      invoiceDate: "",
      dueDate: "",
      billDate: new Date().toISOString().split("T")[0],
      type: "purchase",
      lineItems: [],
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Bill #",
      "Date",
      "Vendor",
      "Invoice #",
      "Due Date",
      "Amount",
      "Paid",
      "Balance",
      "Status",
    ];
    const csvData = filteredBills.map((bill) => [
      bill.billNumber,
      formatDate(bill.billDate),
      bill.vendor.name,
      bill.invoiceNumber,
      formatDate(bill.dueDate),
      bill.totalAmount.toString(),
      bill.amountPaid.toString(),
      bill.balanceDue.toString(),
      bill.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendor-bills-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setBills([...mockBills]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setVendorFilter("all");
    setTypeFilter("all");
  };

  // Item Modal Component
  const ItemModal = () => {
    const [itemData, setItemData] = useState<Partial<BillLineItem>>(
      editingItem || {
        description: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 7.5,
        accountCode: "",
        costCenter: "",
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
            <DialogDescription>Enter bill line item details</DialogDescription>
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
            <div>
              <Label>Account Code</Label>
              <Input
                value={itemData.accountCode || ""}
                onChange={(e) =>
                  setItemData((prev) => ({
                    ...prev,
                    accountCode: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="e.g., 5100"
              />
            </div>
            <div>
              <Label>Cost Center</Label>
              <Input
                value={itemData.costCenter || ""}
                onChange={(e) =>
                  setItemData((prev) => ({
                    ...prev,
                    costCenter: e.target.value,
                  }))
                }
                className="mt-1"
                placeholder="e.g., IT, Operations"
              />
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
              Vendor Bills
            </h1>
            <p className="text-muted-foreground mt-1">
              Record and track vendor invoices and payments
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
            New Bill
          </Button>
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bills</p>
                <p className="text-2xl font-bold">{stats.totalBills}</p>
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
                <p className="text-sm text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(stats.totalOutstanding)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-orange-600" />
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
                <p className="text-sm text-muted-foreground">
                  Pending Approval
                </p>
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
      </div>
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by bill #, vendor, invoice #..."
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
                {billStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={vendorFilter}
              onValueChange={(v) => {
                setVendorFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id.toString()}>
                    {vendor.name}
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
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {billTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      {/* Bills Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("billNumber")}
                    >
                      Bill #
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("billDate")}
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Invoice #</TableHead>
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
                {paginatedBills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Receipt className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No vendor bills found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {bill.billNumber}
                      </TableCell>
                      <TableCell>{formatDate(bill.billDate)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {bill.vendor.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {bill.vendor.code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {bill.invoiceNumber}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            new Date(bill.dueDate) < new Date() &&
                            bill.status !== "paid"
                              ? "text-red-600 font-medium"
                              : ""
                          }
                        >
                          {formatDate(bill.dueDate)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(bill.totalAmount)}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {formatCurrency(bill.amountPaid)}
                      </TableCell>
                      <TableCell className="font-medium text-orange-600">
                        {formatCurrency(bill.balanceDue)}
                      </TableCell>
                      <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBill(bill)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {bill.status === "draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditBill(bill)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setIsApproveDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {(bill.status === "approved" ||
                            bill.status === "pending" ||
                            bill.status === "overdue") &&
                            bill.balanceDue > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setPaymentAmount(bill.balanceDue);
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
          {filteredBills.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredBills.length)}{" "}
                  of {filteredBills.length}
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
      {/* View Bill Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Bill #{selectedBill?.billNumber}</span>
              {selectedBill && getStatusBadge(selectedBill.status)}
            </DialogTitle>
            <DialogDescription>
              Vendor: {selectedBill?.vendor.name} | Invoice:{" "}
              {selectedBill?.invoiceNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedBill && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bill Date</p>
                  <p>{formatDate(selectedBill.billDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Date</p>
                  <p>{formatDate(selectedBill.invoiceDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p
                    className={
                      new Date(selectedBill.dueDate) < new Date() &&
                      selectedBill.status !== "paid"
                        ? "text-red-600 font-medium"
                        : ""
                    }
                  >
                    {formatDate(selectedBill.dueDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bill Type</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedBill.type}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Vendor Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Vendor Name</p>
                    <p className="font-medium">{selectedBill.vendor.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Contact Person
                    </p>
                    <p>{selectedBill.vendor.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedBill.vendor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedBill.vendor.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax ID</p>
                    <p>{selectedBill.vendor.taxId}</p>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Line Items</h3>
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
                    {selectedBill.lineItems.map((item) => (
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
                        {formatCurrency(selectedBill.subtotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right">
                        Discount:
                      </TableHead>
                      <TableHead className="text-right text-red-600">
                        -{formatCurrency(selectedBill.discountTotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right">
                        Tax:
                      </TableHead>
                      <TableHead className="text-right">
                        {formatCurrency(selectedBill.taxTotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right font-bold">
                        Total:
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        {formatCurrency(selectedBill.totalAmount)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right">
                        Amount Paid:
                      </TableHead>
                      <TableHead className="text-right text-green-600">
                        {formatCurrency(selectedBill.amountPaid)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={5} className="text-right font-bold">
                        Balance Due:
                      </TableHead>
                      <TableHead className="text-right font-bold text-orange-600">
                        {formatCurrency(selectedBill.balanceDue)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Payment History */}
              {selectedBill.paymentHistory &&
                selectedBill.paymentHistory.length > 0 && (
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
                        {selectedBill.paymentHistory.map((payment) => (
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

              {selectedBill.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedBill.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedBill &&
              (selectedBill.status === "draft" ||
                selectedBill.status === "pending") && (
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleEditBill(selectedBill);
                  }}
                >
                  Edit Bill
                </Button>
              )}
            {selectedBill &&
              selectedBill.balanceDue > 0 &&
              (selectedBill.status === "approved" ||
                selectedBill.status === "pending" ||
                selectedBill.status === "overdue") && (
                <Button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedBill(selectedBill);
                    setPaymentAmount(selectedBill.balanceDue);
                    setIsPayDialogOpen(true);
                  }}
                >
                  Make Payment
                </Button>
              )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create/Edit Bill Modal */}
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
              {isCreateModalOpen ? "Create Vendor Bill" : "Edit Vendor Bill"}
            </DialogTitle>
            <DialogDescription>Enter vendor invoice details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Vendor *</Label>
                <Select
                  value={formData.vendorId?.toString() || ""}
                  onValueChange={(v) =>
                    setFormData((prev) => ({ ...prev, vendorId: parseInt(v) }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id.toString()}>
                        {vendor.name} ({vendor.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.vendorId && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.vendorId}
                  </p>
                )}
              </div>
              <div>
                <Label>Invoice Number *</Label>
                <Input
                  value={formData.invoiceNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      invoiceNumber: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="INV-001"
                />
                {formErrors.invoiceNumber && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.invoiceNumber}
                  </p>
                )}
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
              <div>
                <Label>Bill Date</Label>
                <Input
                  type="date"
                  value={formData.billDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      billDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Bill Type</Label>
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
                    {billTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  <Receipt className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
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

            {/* Notes */}
            <div className="border-t pt-4">
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
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsEditModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isCreateModalOpen ? handleCreateBill : handleUpdateBill}
            >
              {isCreateModalOpen ? "Create Bill" : "Save Changes"}
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
            <AlertDialogTitle>Approve Bill</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this bill?
              {selectedBill && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedBill.billNumber}</p>
                  <p>Vendor: {selectedBill.vendor.name}</p>
                  <p>Amount: {formatCurrency(selectedBill.totalAmount)}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApproveBill}>
              Approve Bill
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Pay Dialog */}
      <AlertDialog open={isPayDialogOpen} onOpenChange={setIsPayDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Record payment for this bill.
              {selectedBill && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedBill.billNumber}</p>
                  <p>Vendor: {selectedBill.vendor.name}</p>
                  <p>
                    Total Amount: {formatCurrency(selectedBill.totalAmount)}
                  </p>
                  <p>
                    Outstanding Balance:{" "}
                    {formatCurrency(selectedBill.balanceDue)}
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
                max={selectedBill?.balanceDue}
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
              onClick={handlePayBill}
              disabled={
                paymentAmount <= 0 ||
                paymentAmount > (selectedBill?.balanceDue || 0)
              }
            >
              Record Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      );
      {/* Item Modal */}
      <ItemModal />
    </div>
  );
}
