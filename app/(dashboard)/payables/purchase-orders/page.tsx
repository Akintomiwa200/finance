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
  Package,
  Truck,
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  DollarSign,
  Calendar,
  Building2,
  User,
  FileText,
  Send,
  Printer,
  Copy,
  MoreHorizontal,
  PlusCircle,
  MinusCircle,
  Receipt,
  CreditCard,
  Landmark,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type POStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "ordered"
  | "partially_received"
  | "fully_received"
  | "cancelled"
  | "rejected";
type PUPriority = "low" | "medium" | "high" | "urgent";
type DeliveryMethod = "pickup" | "delivery" | "courier";

interface POLineItem {
  id: number;
  itemCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  receivedQuantity: number;
  notes?: string;
}

interface PurchaseOrder {
  id: number;
  poNumber: string;
  vendor: {
    id: number;
    name: string;
    code: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  orderDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  status: POStatus;
  priority: PUPriority;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
  lineItems: POLineItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  shippingCost: number;
  totalAmount: number;
  currency: string;
  paymentTerms: string;
  shippingTerms: string;
  createdBy: {
    id: number;
    name: string;
    department: string;
  };
  approvedBy?: {
    id: number;
    name: string;
    date: string;
  };
  orderedBy?: {
    id: number;
    name: string;
    date: string;
  };
  receivedBy?: {
    id: number;
    name: string;
    date: string;
  };
  notes?: string;
  attachments?: string[];
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
  },
  {
    id: 2,
    name: "Tech Solutions Ltd",
    code: "VEN-002",
    contactPerson: "Sarah Okafor",
    email: "sarah@techsolutions.ng",
    phone: "+234 803 456 7890",
  },
  {
    id: 3,
    name: "Global Logistics",
    code: "VEN-003",
    contactPerson: "Michael Eze",
    email: "michael@globallogistics.ng",
    phone: "+234 805 678 9012",
  },
];

// Mock Purchase Orders
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    poNumber: "PO-2026-0001",
    vendor: mockVendors[0],
    orderDate: "2026-03-01",
    expectedDeliveryDate: "2026-03-10",
    actualDeliveryDate: "2026-03-08",
    status: "fully_received",
    priority: "medium",
    deliveryMethod: "delivery",
    deliveryAddress: "Head Office, 123 Main Street, Lagos",
    lineItems: [
      {
        id: 1,
        itemCode: "OS-001",
        description: "A4 Paper (500 sheets)",
        quantity: 50,
        unitPrice: 3000,
        discount: 0,
        tax: 7.5,
        total: 161250,
        receivedQuantity: 50,
      },
      {
        id: 2,
        itemCode: "OS-002",
        description: "Pens (Box of 50)",
        quantity: 20,
        unitPrice: 5000,
        discount: 5,
        tax: 7.5,
        total: 102125,
        receivedQuantity: 20,
      },
    ],
    subtotal: 250000,
    discountTotal: 5000,
    taxTotal: 18375,
    shippingCost: 5000,
    totalAmount: 268375,
    currency: "NGN",
    paymentTerms: "Net 30",
    shippingTerms: "FOB Destination",
    createdBy: { id: 1, name: "John Smith", department: "Procurement" },
    approvedBy: { id: 2, name: "Jane Manager", date: "2026-03-02T10:00:00" },
    orderedBy: {
      id: 3,
      name: "Procurement Officer",
      date: "2026-03-03T09:00:00",
    },
    receivedBy: { id: 4, name: "Store Keeper", date: "2026-03-08T14:00:00" },
    notes: "Urgent office supplies needed",
    createdAt: "2026-03-01T08:00:00",
    updatedAt: "2026-03-08T14:00:00",
  },
  {
    id: 2,
    poNumber: "PO-2026-0002",
    vendor: mockVendors[1],
    orderDate: "2026-03-05",
    expectedDeliveryDate: "2026-03-15",
    status: "approved",
    priority: "high",
    deliveryMethod: "delivery",
    deliveryAddress: "IT Department, 123 Main Street, Lagos",
    lineItems: [
      {
        id: 3,
        itemCode: "IT-001",
        description: "Laptop Dell XPS",
        quantity: 5,
        unitPrice: 850000,
        discount: 0,
        tax: 7.5,
        total: 4568750,
        receivedQuantity: 0,
      },
      {
        id: 4,
        itemCode: "IT-002",
        description: "Monitor 24 inch",
        quantity: 5,
        unitPrice: 150000,
        discount: 0,
        tax: 7.5,
        total: 806250,
        receivedQuantity: 0,
      },
    ],
    subtotal: 5000000,
    discountTotal: 0,
    taxTotal: 375000,
    shippingCost: 25000,
    totalAmount: 5400000,
    currency: "NGN",
    paymentTerms: "Net 45",
    shippingTerms: "FOB Shipping Point",
    createdBy: { id: 1, name: "Alice Johnson", department: "IT" },
    approvedBy: { id: 2, name: "Tech Director", date: "2026-03-06T14:30:00" },
    notes: "New equipment for development team",
    createdAt: "2026-03-05T11:00:00",
    updatedAt: "2026-03-06T14:30:00",
  },
  {
    id: 3,
    poNumber: "PO-2026-0003",
    vendor: mockVendors[2],
    orderDate: "2026-03-10",
    expectedDeliveryDate: "2026-03-20",
    status: "pending_approval",
    priority: "urgent",
    deliveryMethod: "courier",
    deliveryAddress: "Warehouse, 456 Industrial Area, Lagos",
    lineItems: [
      {
        id: 5,
        itemCode: "LOG-001",
        description: "International Shipping Service",
        quantity: 1,
        unitPrice: 2500000,
        discount: 0,
        tax: 7.5,
        total: 2687500,
        receivedQuantity: 0,
      },
    ],
    subtotal: 2500000,
    discountTotal: 0,
    taxTotal: 187500,
    shippingCost: 0,
    totalAmount: 2687500,
    currency: "NGN",
    paymentTerms: "Prepaid",
    shippingTerms: "EXW",
    createdBy: { id: 1, name: "Operations Manager", department: "Operations" },
    notes: "Urgent shipment for client order",
    createdAt: "2026-03-10T09:00:00",
    updatedAt: "2026-03-10T09:00:00",
  },
  {
    id: 4,
    poNumber: "PO-2026-0004",
    vendor: mockVendors[0],
    orderDate: "2026-03-08",
    expectedDeliveryDate: "2026-03-18",
    status: "draft",
    priority: "low",
    deliveryMethod: "pickup",
    deliveryAddress: "Head Office, 123 Main Street, Lagos",
    lineItems: [
      {
        id: 6,
        itemCode: "OS-003",
        description: "Filing Cabinets",
        quantity: 3,
        unitPrice: 75000,
        discount: 10,
        tax: 7.5,
        total: 241875,
        receivedQuantity: 0,
      },
    ],
    subtotal: 225000,
    discountTotal: 22500,
    taxTotal: 16875,
    shippingCost: 0,
    totalAmount: 219375,
    currency: "NGN",
    paymentTerms: "Net 30",
    shippingTerms: "Pickup",
    createdBy: { id: 1, name: "Sarah Williams", department: "Admin" },
    createdAt: "2026-03-08T15:00:00",
    updatedAt: "2026-03-08T15:00:00",
  },
  {
    id: 5,
    poNumber: "PO-2026-0005",
    vendor: mockVendors[1],
    orderDate: "2026-03-12",
    expectedDeliveryDate: "2026-03-22",
    status: "partially_received",
    priority: "high",
    deliveryMethod: "delivery",
    deliveryAddress: "IT Department, 123 Main Street, Lagos",
    lineItems: [
      {
        id: 7,
        itemCode: "SW-001",
        description: "Microsoft Office License",
        quantity: 10,
        unitPrice: 45000,
        discount: 0,
        tax: 7.5,
        total: 483750,
        receivedQuantity: 10,
      },
      {
        id: 8,
        itemCode: "SW-002",
        description: "Adobe Creative Cloud",
        quantity: 5,
        unitPrice: 120000,
        discount: 0,
        tax: 7.5,
        total: 645000,
        receivedQuantity: 3,
      },
    ],
    subtotal: 1050000,
    discountTotal: 0,
    taxTotal: 78750,
    shippingCost: 0,
    totalAmount: 1128750,
    currency: "NGN",
    paymentTerms: "Net 15",
    shippingTerms: "Digital Delivery",
    createdBy: { id: 1, name: "Design Lead", department: "Design" },
    approvedBy: { id: 2, name: "IT Manager", date: "2026-03-13T10:00:00" },
    orderedBy: { id: 3, name: "Procurement", date: "2026-03-13T11:00:00" },
    receivedBy: { id: 4, name: "IT Support", date: "2026-03-14T09:00:00" },
    notes: "Software licenses for design team",
    createdAt: "2026-03-12T08:00:00",
    updatedAt: "2026-03-14T09:00:00",
  },
];

const statuses = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-700" },
  {
    value: "pending_approval",
    label: "Pending Approval",
    color: "bg-yellow-100 text-yellow-700",
  },
  { value: "approved", label: "Approved", color: "bg-blue-100 text-blue-700" },
  {
    value: "ordered",
    label: "Ordered",
    color: "bg-purple-100 text-purple-700",
  },
  {
    value: "partially_received",
    label: "Partially Received",
    color: "bg-orange-100 text-orange-700",
  },
  {
    value: "fully_received",
    label: "Fully Received",
    color: "bg-green-100 text-green-700",
  },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-700" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
];

const priorities = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
  { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-700" },
  { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700" },
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

const getStatusBadge = (status: POStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    draft: <FileText className="h-3 w-3 mr-1" />,
    pending_approval: <Clock className="h-3 w-3 mr-1" />,
    approved: <CheckCircle className="h-3 w-3 mr-1" />,
    ordered: <Send className="h-3 w-3 mr-1" />,
    partially_received: <Package className="h-3 w-3 mr-1" />,
    fully_received: <CheckCircle className="h-3 w-3 mr-1" />,
    cancelled: <XCircle className="h-3 w-3 mr-1" />,
    rejected: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getPriorityBadge = (priority: PUPriority) => {
  const config = priorities.find((p) => p.value === priority);
  return <Badge className={config?.color}>{config?.label}</Badge>;
};

export default function PurchaseOrders() {
  const router = useRouter();

  // State
  const [purchaseOrders, setPurchaseOrders] =
    useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [vendors] = useState(mockVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: "",
    to: "",
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PurchaseOrder;
    direction: "asc" | "desc";
  }>({ key: "orderDate", direction: "desc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"purchase_orders" | "analytics">(
    "purchase_orders",
  );

  // Form state
  const [formData, setFormData] = useState({
    vendorId: 0,
    orderDate: new Date().toISOString().split("T")[0],
    expectedDeliveryDate: "",
    priority: "medium" as PUPriority,
    deliveryMethod: "delivery" as DeliveryMethod,
    deliveryAddress: "",
    paymentTerms: "Net 30",
    shippingTerms: "FOB Destination",
    notes: "",
    lineItems: [] as POLineItem[],
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [editingItem, setEditingItem] = useState<POLineItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Statistics
  const stats = useMemo(() => {
    const totalPOs = purchaseOrders.length;
    const totalAmount = purchaseOrders.reduce(
      (sum, po) => sum + po.totalAmount,
      0,
    );
    const pendingApproval = purchaseOrders.filter(
      (po) => po.status === "pending_approval",
    ).length;
    const fullyReceived = purchaseOrders.filter(
      (po) => po.status === "fully_received",
    ).length;
    const overdue = purchaseOrders.filter(
      (po) =>
        po.status !== "fully_received" &&
        po.status !== "cancelled" &&
        new Date(po.expectedDeliveryDate) < new Date(),
    ).length;

    return {
      totalPOs,
      totalAmount,
      pendingApproval,
      fullyReceived,
      overdue,
    };
  }, [purchaseOrders]);

  // Filter and sort
  const filteredPOs = useMemo(() => {
    let result = [...purchaseOrders];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (po) =>
          po.poNumber.toLowerCase().includes(query) ||
          po.vendor.name.toLowerCase().includes(query) ||
          po.notes?.toLowerCase().includes(query),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((po) => po.status === statusFilter);
    }

    if (vendorFilter !== "all") {
      result = result.filter((po) => po.vendor.id === parseInt(vendorFilter));
    }

    if (priorityFilter !== "all") {
      result = result.filter((po) => po.priority === priorityFilter);
    }

    if (dateRange.from) {
      result = result.filter((po) => po.orderDate >= dateRange.from);
    }
    if (dateRange.to) {
      result = result.filter((po) => po.orderDate <= dateRange.to);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (
          sortConfig.key === "orderDate" ||
          sortConfig.key === "expectedDeliveryDate"
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
  }, [
    purchaseOrders,
    searchQuery,
    statusFilter,
    vendorFilter,
    priorityFilter,
    dateRange,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);
  const paginatedPOs = filteredPOs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Calculate line item totals
  const calculateItemTotal = (item: POLineItem) => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = subtotal * (item.discount / 100);
    const discountedSubtotal = subtotal - discountAmount;
    const taxAmount = discountedSubtotal * (item.tax / 100);
    return discountedSubtotal + taxAmount;
  };

  const calculatePOTotals = (items: POLineItem[]) => {
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
  const handleSort = (key: keyof PurchaseOrder) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setIsViewModalOpen(true);
  };

  const handleEditPO = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setFormData({
      vendorId: po.vendor.id,
      orderDate: po.orderDate,
      expectedDeliveryDate: po.expectedDeliveryDate,
      priority: po.priority,
      deliveryMethod: po.deliveryMethod,
      deliveryAddress: po.deliveryAddress,
      paymentTerms: po.paymentTerms,
      shippingTerms: po.shippingTerms,
      notes: po.notes || "",
      lineItems: [...po.lineItems],
    });
    setIsEditModalOpen(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: POLineItem) => {
    setEditingItem(item);
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Partial<POLineItem>) => {
    if (editingItem) {
      setFormData((prev) => ({
        ...prev,
        lineItems: prev.lineItems.map((item) =>
          item.id === editingItem.id
            ? ({ ...item, ...itemData } as POLineItem)
            : item,
        ),
      }));
    } else {
      const newItem: POLineItem = {
        id: Date.now(),
        itemCode: itemData.itemCode || "",
        description: itemData.description || "",
        quantity: itemData.quantity || 0,
        unitPrice: itemData.unitPrice || 0,
        discount: itemData.discount || 0,
        tax: itemData.tax || 0,
        total: 0,
        receivedQuantity: 0,
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
    if (!formData.deliveryAddress)
      errors.deliveryAddress = "Delivery address is required";
    if (formData.lineItems.length === 0)
      errors.lineItems = "At least one line item is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePO = () => {
    if (!validateForm()) return;

    const selectedVendor = vendors.find((v) => v.id === formData.vendorId);
    const { subtotal, discountTotal, taxTotal } = calculatePOTotals(
      formData.lineItems,
    );
    const totalAmount = subtotal - discountTotal + taxTotal;

    const newPO: PurchaseOrder = {
      id: Math.max(...purchaseOrders.map((po) => po.id), 0) + 1,
      poNumber: `PO-${new Date().getFullYear()}-${String(purchaseOrders.length + 1).padStart(4, "0")}`,
      vendor: selectedVendor!,
      orderDate: formData.orderDate,
      expectedDeliveryDate: formData.expectedDeliveryDate,
      status: "draft",
      priority: formData.priority,
      deliveryMethod: formData.deliveryMethod,
      deliveryAddress: formData.deliveryAddress,
      lineItems: formData.lineItems.map((item) => ({
        ...item,
        total: calculateItemTotal(item),
      })),
      subtotal,
      discountTotal,
      taxTotal,
      shippingCost: 0,
      totalAmount,
      currency: "NGN",
      paymentTerms: formData.paymentTerms,
      shippingTerms: formData.shippingTerms,
      createdBy: { id: 1, name: "Current User", department: "Procurement" },
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPurchaseOrders((prev) => [newPO, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdatePO = () => {
    if (!validateForm() || !selectedPO) return;

    const selectedVendor = vendors.find((v) => v.id === formData.vendorId);
    const { subtotal, discountTotal, taxTotal } = calculatePOTotals(
      formData.lineItems,
    );
    const totalAmount = subtotal - discountTotal + taxTotal;

    const updatedPO: PurchaseOrder = {
      ...selectedPO,
      vendor: selectedVendor!,
      orderDate: formData.orderDate,
      expectedDeliveryDate: formData.expectedDeliveryDate,
      priority: formData.priority,
      deliveryMethod: formData.deliveryMethod,
      deliveryAddress: formData.deliveryAddress,
      lineItems: formData.lineItems.map((item) => ({
        ...item,
        total: calculateItemTotal(item),
      })),
      subtotal,
      discountTotal,
      taxTotal,
      totalAmount,
      paymentTerms: formData.paymentTerms,
      shippingTerms: formData.shippingTerms,
      notes: formData.notes,
      updatedAt: new Date().toISOString(),
    };

    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === selectedPO.id ? updatedPO : po)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedPO(null);
  };

  const handleApprovePO = () => {
    if (!selectedPO) return;
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === selectedPO.id
          ? {
              ...po,
              status: "approved",
              approvedBy: {
                id: 1,
                name: "Approver",
                date: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : po,
      ),
    );
    setIsApproveDialogOpen(false);
    setSelectedPO(null);
  };

  const handleOrderPO = () => {
    if (!selectedPO) return;
    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === selectedPO.id
          ? {
              ...po,
              status: "ordered",
              orderedBy: {
                id: 1,
                name: "Procurement Officer",
                date: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : po,
      ),
    );
    setIsOrderDialogOpen(false);
    setSelectedPO(null);
  };

  const handleReceivePO = (
    receivedItems: { itemId: number; quantity: number }[],
  ) => {
    if (!selectedPO) return;

    const updatedLineItems = selectedPO.lineItems.map((item) => {
      const received = receivedItems.find((r) => r.itemId === item.id);
      if (received) {
        return {
          ...item,
          receivedQuantity: item.receivedQuantity + received.quantity,
        };
      }
      return item;
    });

    const allFullyReceived = updatedLineItems.every(
      (item) => item.receivedQuantity >= item.quantity,
    );
    const partiallyReceived = updatedLineItems.some(
      (item) =>
        item.receivedQuantity > 0 && item.receivedQuantity < item.quantity,
    );

    let newStatus: POStatus = "ordered";
    if (allFullyReceived) newStatus = "fully_received";
    else if (partiallyReceived) newStatus = "partially_received";

    setPurchaseOrders((prev) =>
      prev.map((po) =>
        po.id === selectedPO.id
          ? {
              ...po,
              lineItems: updatedLineItems,
              status: newStatus,
              actualDeliveryDate: new Date().toISOString().split("T")[0],
              receivedBy: {
                id: 1,
                name: "Store Keeper",
                date: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
            }
          : po,
      ),
    );
    setIsReceiveDialogOpen(false);
    setSelectedPO(null);
  };

  const resetForm = () => {
    setFormData({
      vendorId: 0,
      orderDate: new Date().toISOString().split("T")[0],
      expectedDeliveryDate: "",
      priority: "medium",
      deliveryMethod: "delivery",
      deliveryAddress: "",
      paymentTerms: "Net 30",
      shippingTerms: "FOB Destination",
      notes: "",
      lineItems: [],
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "PO Number",
      "Date",
      "Vendor",
      "Status",
      "Priority",
      "Total Amount",
      "Expected Delivery",
    ];
    const csvData = filteredPOs.map((po) => [
      po.poNumber,
      formatDate(po.orderDate),
      po.vendor.name,
      po.status,
      po.priority,
      po.totalAmount.toString(),
      formatDate(po.expectedDeliveryDate),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `purchase-orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setPurchaseOrders([...mockPurchaseOrders]);
    setCurrentPage(1);
    setSearchQuery("");
    setStatusFilter("all");
    setVendorFilter("all");
    setPriorityFilter("all");
    setDateRange({ from: "", to: "" });
  };

  // Item Modal Component
  const ItemModal = () => {
    const [itemData, setItemData] = useState<Partial<POLineItem>>(
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
            <DialogDescription>Enter item details</DialogDescription>
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
                placeholder="e.g., IT-001"
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

  // Receive Items Modal
  const ReceiveModal = () => {
    const [receivedQuantities, setReceivedQuantities] = useState<
      { itemId: number; quantity: number }[]
    >(
      selectedPO?.lineItems.map((item) => ({ itemId: item.id, quantity: 0 })) ||
        [],
    );

    const handleReceive = () => {
      const itemsToReceive = receivedQuantities.filter((r) => r.quantity > 0);
      if (itemsToReceive.length === 0) return;
      handleReceivePO(itemsToReceive);
    };

    return (
      <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Receive Items</DialogTitle>
            <DialogDescription>
              Enter quantities received for PO #{selectedPO?.poNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedPO?.lineItems.map((item, index) => {
              const remaining = item.quantity - item.receivedQuantity;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Ordered: {item.quantity} | Received:{" "}
                      {item.receivedQuantity} | Remaining: {remaining}
                    </p>
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Qty"
                      max={remaining}
                      min={0}
                      value={receivedQuantities[index]?.quantity || ""}
                      onChange={(e) => {
                        const newQuantities = [...receivedQuantities];
                        newQuantities[index] = {
                          itemId: item.id,
                          quantity: parseFloat(e.target.value) || 0,
                        };
                        setReceivedQuantities(newQuantities);
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReceiveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleReceive}>Receive Items</Button>
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
              <Package className="h-6 w-6" />
              Purchase Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage purchase orders
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
            Create PO
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total POs</p>
                <p className="text-2xl font-bold">{stats.totalPOs}</p>
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
                  Pending Approval
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pendingApproval}
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
                <p className="text-sm text-muted-foreground">Overdue Orders</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.overdue}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <AlertCircle className="h-5 w-5 text-red-600" />
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
                placeholder="Search by PO #, vendor..."
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
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
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
              value={priorityFilter}
              onValueChange={(v) => {
                setPriorityFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[130px]">
                <Flag className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
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

      {/* Purchase Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("poNumber")}
                    >
                      PO Number
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("orderDate")}
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Vendor</TableHead>
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
                  <TableHead>Priority</TableHead>
                  <TableHead>Expected Delivery</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No purchase orders found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPOs.map((po) => (
                    <TableRow key={po.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {po.poNumber}
                      </TableCell>
                      <TableCell>{formatDate(po.orderDate)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{po.vendor.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {po.vendor.code}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(po.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell>{getPriorityBadge(po.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span
                            className={
                              new Date(po.expectedDeliveryDate) < new Date() &&
                              po.status !== "fully_received" &&
                              po.status !== "cancelled"
                                ? "text-red-600"
                                : ""
                            }
                          >
                            {formatDate(po.expectedDeliveryDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewPO(po)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {po.status === "draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditPO(po)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPO(po);
                                  setIsApproveDialogOpen(true);
                                }}
                                className="text-green-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {po.status === "approved" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPO(po);
                                setIsOrderDialogOpen(true);
                              }}
                              className="text-blue-600"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          {po.status === "ordered" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedPO(po);
                                setIsReceiveDialogOpen(true);
                              }}
                              className="text-purple-600"
                            >
                              <Package className="h-4 w-4" />
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
          {filteredPOs.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredPOs.length)} of{" "}
                  {filteredPOs.length}
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

      {/* View PO Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Purchase Order #{selectedPO?.poNumber}</span>
              {selectedPO && getStatusBadge(selectedPO.status)}
            </DialogTitle>
            <DialogDescription>
              Created: {selectedPO && formatDateTime(selectedPO.createdAt)} by{" "}
              {selectedPO?.createdBy.name}
            </DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-6 py-4">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                  <p className="font-medium">{selectedPO.vendor.name}</p>
                  <p className="text-sm">{selectedPO.vendor.contactPerson}</p>
                  <p className="text-sm">
                    {selectedPO.vendor.email} | {selectedPO.vendor.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p>{formatDate(selectedPO.orderDate)}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Expected Delivery
                  </p>
                  <p>{formatDate(selectedPO.expectedDeliveryDate)}</p>
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
                    {selectedPO.lineItems.map((item) => (
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
                        {formatCurrency(selectedPO.subtotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={6} className="text-right">
                        Discount:
                      </TableHead>
                      <TableHead className="text-right text-red-600">
                        -{formatCurrency(selectedPO.discountTotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={6} className="text-right">
                        Tax:
                      </TableHead>
                      <TableHead className="text-right">
                        {formatCurrency(selectedPO.taxTotal)}
                      </TableHead>
                    </TableRow>
                    <TableRow>
                      <TableHead colSpan={6} className="text-right font-bold">
                        Total:
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        {formatCurrency(selectedPO.totalAmount)}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>
              </div>

              {/* Delivery Info */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Delivery Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Delivery Method
                    </p>
                    <p className="capitalize">{selectedPO.deliveryMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Terms
                    </p>
                    <p>{selectedPO.paymentTerms}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Shipping Terms
                    </p>
                    <p>{selectedPO.shippingTerms}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Delivery Address
                    </p>
                    <p>{selectedPO.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Approval Timeline */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Approval Timeline</h3>
                <div className="space-y-2">
                  {selectedPO.approvedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>
                        Approved by {selectedPO.approvedBy.name} on{" "}
                        {formatDateTime(selectedPO.approvedBy.date)}
                      </span>
                    </div>
                  )}
                  {selectedPO.orderedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <Send className="h-4 w-4 text-blue-600" />
                      <span>
                        Ordered by {selectedPO.orderedBy.name} on{" "}
                        {formatDateTime(selectedPO.orderedBy.date)}
                      </span>
                    </div>
                  )}
                  {selectedPO.receivedBy && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="h-4 w-4 text-purple-600" />
                      <span>
                        Received by {selectedPO.receivedBy.name} on{" "}
                        {formatDateTime(selectedPO.receivedBy.date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {selectedPO.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedPO.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            {selectedPO && selectedPO.status === "draft" && (
              <Button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEditPO(selectedPO);
                }}
              >
                Edit PO
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit PO Modal */}
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
                ? "Create Purchase Order"
                : "Edit Purchase Order"}
            </DialogTitle>
            <DialogDescription>Enter purchase order details</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
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
                <Label>Order Date</Label>
                <Input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      orderDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Expected Delivery Date</Label>
                <Input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expectedDeliveryDate: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, priority: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delivery Method</Label>
                <Select
                  value={formData.deliveryMethod}
                  onValueChange={(v: any) =>
                    setFormData((prev) => ({ ...prev, deliveryMethod: v }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="courier">Courier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Payment Terms</Label>
                <Input
                  value={formData.paymentTerms}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      paymentTerms: e.target.value,
                    }))
                  }
                  className="mt-1"
                  placeholder="Net 30"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Delivery Address *</Label>
                <Textarea
                  value={formData.deliveryAddress}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryAddress: e.target.value,
                    }))
                  }
                  className="mt-1"
                  rows={2}
                  placeholder="Full delivery address"
                />
                {formErrors.deliveryAddress && (
                  <p className="text-sm text-red-500 mt-1">
                    {formErrors.deliveryAddress}
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
              onClick={isCreateModalOpen ? handleCreatePO : handleUpdatePO}
            >
              {isCreateModalOpen ? "Create PO" : "Save Changes"}
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
            <AlertDialogTitle>Approve Purchase Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this purchase order?
              {selectedPO && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedPO.poNumber}</p>
                  <p>Vendor: {selectedPO.vendor.name}</p>
                  <p>Amount: {formatCurrency(selectedPO.totalAmount)}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprovePO}>
              Approve PO
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order Dialog */}
      <AlertDialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Place Order</AlertDialogTitle>
            <AlertDialogDescription>
              Confirm that you have sent this purchase order to the vendor.
              {selectedPO && (
                <div className="mt-2 p-3 bg-muted rounded-lg">
                  <p className="font-medium">{selectedPO.poNumber}</p>
                  <p>Vendor: {selectedPO.vendor.name}</p>
                  <p>Email: {selectedPO.vendor.email}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleOrderPO}>
              Confirm Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receive Modal */}
      <ReceiveModal />

      {/* Item Modal */}
      <ItemModal />
    </div>
  );
}
