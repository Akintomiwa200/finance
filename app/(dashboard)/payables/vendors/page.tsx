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
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Copy,
  Star,
  StarOff,
  Users,
  Briefcase,
  DollarSign,
  Calendar,
  MessageSquare,
  Upload,
  Image,
  Receipt,
  Truck,
  Package,
  Store,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { compareValues } from "@/src/lib/utils";

// Types
type VendorStatus = "active" | "inactive" | "suspended" | "blacklisted";
type VendorType =
  | "supplier"
  | "service_provider"
  | "consultant"
  | "contractor"
  | "distributor";
type PaymentTerms =
  | "net_15"
  | "net_30"
  | "net_45"
  | "net_60"
  | "cod"
  | "prepaid";
type TaxType = "vat_registered" | "vat_exempt" | "non_vat";

interface Vendor {
  id: number;
  vendorCode: string;
  name: string;
  type: VendorType;
  status: VendorStatus;
  taxId: string;
  taxType: TaxType;
  paymentTerms: PaymentTerms;
  creditLimit: number;
  currentBalance: number;
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    sortCode?: string;
  };
  website?: string;
  categories: string[];
  rating: number; // 1-5
  totalPurchases: number;
  totalPaid: number;
  outstandingBalance: number;
  lastPurchaseDate?: string;
  notes?: string;
  attachments?: {
    id: number;
    name: string;
    url: string;
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock Data
const mockVendors: Vendor[] = [
  {
    id: 1,
    vendorCode: "VEN-001",
    name: "Office Depot Nigeria",
    type: "supplier",
    status: "active",
    taxId: "RC-1234567",
    taxType: "vat_registered",
    paymentTerms: "net_30",
    creditLimit: 5000000,
    currentBalance: 1250000,
    contactPerson: {
      name: "John Adeyemi",
      email: "john@officedepot.ng",
      phone: "+234 802 123 4567",
      position: "Sales Manager",
    },
    address: {
      street: "12, Allen Avenue",
      city: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "100001",
    },
    bankDetails: {
      bankName: "First Bank",
      accountNumber: "2034567890",
      accountName: "Office Depot Nigeria Ltd",
      sortCode: "011234567",
    },
    website: "www.officedepot.ng",
    categories: ["Office Supplies", "Stationery", "Furniture"],
    rating: 4.5,
    totalPurchases: 8750000,
    totalPaid: 7500000,
    outstandingBalance: 1250000,
    lastPurchaseDate: "2026-03-10",
    notes: "Preferred vendor for office supplies",
    createdAt: "2024-01-15",
    updatedAt: "2026-03-10",
    createdBy: "Procurement",
  },
  {
    id: 2,
    vendorCode: "VEN-002",
    name: "Tech Solutions Ltd",
    type: "service_provider",
    status: "active",
    taxId: "RC-7654321",
    taxType: "vat_registered",
    paymentTerms: "net_45",
    creditLimit: 10000000,
    currentBalance: 2500000,
    contactPerson: {
      name: "Sarah Okafor",
      email: "sarah@techsolutions.ng",
      phone: "+234 803 456 7890",
      position: "Account Manager",
    },
    address: {
      street: "5, IT Park",
      city: "Victoria Island",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101241",
    },
    bankDetails: {
      bankName: "GT Bank",
      accountNumber: "0123456789",
      accountName: "Tech Solutions Ltd",
      sortCode: "058123456",
    },
    website: "www.techsolutions.ng",
    categories: ["IT Services", "Software", "Hardware"],
    rating: 4.8,
    totalPurchases: 15000000,
    totalPaid: 12500000,
    outstandingBalance: 2500000,
    lastPurchaseDate: "2026-03-05",
    notes: "IT infrastructure support vendor",
    createdAt: "2024-02-01",
    updatedAt: "2026-03-05",
    createdBy: "IT Department",
  },
  {
    id: 3,
    vendorCode: "VEN-003",
    name: "Global Logistics",
    type: "contractor",
    status: "active",
    taxId: "RC-9876543",
    taxType: "vat_registered",
    paymentTerms: "net_30",
    creditLimit: 3000000,
    currentBalance: 750000,
    contactPerson: {
      name: "Michael Eze",
      email: "michael@globallogistics.ng",
      phone: "+234 805 678 9012",
      position: "Operations Director",
    },
    address: {
      street: "22, Warehouse Road",
      city: "Apapa",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "102102",
    },
    bankDetails: {
      bankName: "Zenith Bank",
      accountNumber: "9876543210",
      accountName: "Global Logistics Nigeria",
      sortCode: "057123456",
    },
    website: "www.globallogistics.ng",
    categories: ["Logistics", "Transport", "Warehousing"],
    rating: 4.2,
    totalPurchases: 4500000,
    totalPaid: 3750000,
    outstandingBalance: 750000,
    lastPurchaseDate: "2026-03-01",
    notes: "Primary logistics partner",
    createdAt: "2024-03-10",
    updatedAt: "2026-03-01",
    createdBy: "Operations",
  },
  {
    id: 4,
    vendorCode: "VEN-004",
    name: "Creative Design Agency",
    type: "consultant",
    status: "active",
    taxId: "RC-1122334",
    taxType: "vat_registered",
    paymentTerms: "net_15",
    creditLimit: 2000000,
    currentBalance: 0,
    contactPerson: {
      name: "Amara Nwosu",
      email: "amara@creativedesign.ng",
      phone: "+234 806 789 0123",
      position: "Creative Director",
    },
    address: {
      street: "8, Creative Hub",
      city: "Yaba",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101212",
    },
    bankDetails: {
      bankName: "Access Bank",
      accountNumber: "4567890123",
      accountName: "Creative Design Agency",
      sortCode: "044123456",
    },
    website: "www.creativedesign.ng",
    categories: ["Design", "Marketing", "Branding"],
    rating: 4.9,
    totalPurchases: 3500000,
    totalPaid: 3500000,
    outstandingBalance: 0,
    lastPurchaseDate: "2026-02-20",
    notes: "Excellent design work, highly recommended",
    createdAt: "2024-04-15",
    updatedAt: "2026-02-20",
    createdBy: "Marketing",
  },
  {
    id: 5,
    vendorCode: "VEN-005",
    name: "Industrial Supplies Co",
    type: "supplier",
    status: "suspended",
    taxId: "RC-5566778",
    taxType: "vat_registered",
    paymentTerms: "net_30",
    creditLimit: 8000000,
    currentBalance: 4500000,
    contactPerson: {
      name: "Peter Obi",
      email: "peter@industrialsupplies.ng",
      phone: "+234 807 890 1234",
      position: "Sales Director",
    },
    address: {
      street: "15, Industrial Area",
      city: "Ota",
      state: "Ogun",
      country: "Nigeria",
      postalCode: "112104",
    },
    bankDetails: {
      bankName: "UBA",
      accountNumber: "5678901234",
      accountName: "Industrial Supplies Co",
      sortCode: "033123456",
    },
    categories: ["Industrial Equipment", "Tools", "Machinery"],
    rating: 3.5,
    totalPurchases: 12000000,
    totalPaid: 7500000,
    outstandingBalance: 4500000,
    lastPurchaseDate: "2026-01-15",
    notes: "Suspended due to quality issues",
    createdAt: "2024-01-20",
    updatedAt: "2026-02-01",
    createdBy: "Procurement",
  },
];

const vendorTypes = [
  { value: "supplier", label: "Supplier", icon: Package },
  { value: "service_provider", label: "Service Provider", icon: Briefcase },
  { value: "consultant", label: "Consultant", icon: Users },
  { value: "contractor", label: "Contractor", icon: Truck },
  { value: "distributor", label: "Distributor", icon: Store },
];

const statuses = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-700" },
  { value: "inactive", label: "Inactive", color: "bg-gray-100 text-gray-700" },
  {
    value: "suspended",
    label: "Suspended",
    color: "bg-yellow-100 text-yellow-700",
  },
  {
    value: "blacklisted",
    label: "Blacklisted",
    color: "bg-red-100 text-red-700",
  },
];

const paymentTermsList = [
  { value: "net_15", label: "Net 15 Days" },
  { value: "net_30", label: "Net 30 Days" },
  { value: "net_45", label: "Net 45 Days" },
  { value: "net_60", label: "Net 60 Days" },
  { value: "cod", label: "Cash on Delivery" },
  { value: "prepaid", label: "Prepaid" },
];

const categories = [
  "Office Supplies",
  "Stationery",
  "Furniture",
  "IT Services",
  "Software",
  "Hardware",
  "Logistics",
  "Transport",
  "Warehousing",
  "Design",
  "Marketing",
  "Branding",
  "Industrial Equipment",
  "Tools",
  "Machinery",
  "Cleaning",
  "Maintenance",
  "Security",
  "Catering",
  "Other",
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

const getStatusBadge = (status: VendorStatus) => {
  const config = statuses.find((s) => s.value === status);
  return <Badge className={config?.color}>{config?.label}</Badge>;
};

const getVendorTypeBadge = (type: VendorType) => {
  const config = vendorTypes.find((t) => t.value === type);
  return (
    <Badge variant="outline" className="capitalize">
      {config?.label || type}
    </Badge>
  );
};

const getRatingStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />,
      );
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<Star key={i} className="h-3 w-3 text-yellow-500" />);
    } else {
      stars.push(<StarOff key={i} className="h-3 w-3 text-gray-300" />);
    }
  }
  return stars;
};

export default function Vendors() {
  const router = useRouter();

  // State
  const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Vendor;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"vendors" | "analytics">(
    "vendors",
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "supplier" as VendorType,
    taxId: "",
    taxType: "vat_registered" as TaxType,
    paymentTerms: "net_30" as PaymentTerms,
    creditLimit: 0,
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactPosition: "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    sortCode: "",
    website: "",
    categories: [] as string[],
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [newCategory, setNewCategory] = useState("");

  // Filter and sort
  const filteredVendors = useMemo(() => {
    let result = [...vendors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.vendorCode.toLowerCase().includes(query) ||
          v.name.toLowerCase().includes(query) ||
          v.contactPerson.name.toLowerCase().includes(query) ||
          v.contactPerson.email.toLowerCase().includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((v) => v.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((v) => v.categories.includes(categoryFilter));
    }

    if (sortConfig.key) {
      result.sort((a, b) =>
        compareValues(a[sortConfig.key], b[sortConfig.key], sortConfig.direction),
      );
    }

    return result;
  }, [
    vendors,
    searchQuery,
    typeFilter,
    statusFilter,
    categoryFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const paginatedVendors = filteredVendors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Statistics
  const stats = useMemo(() => {
    const totalVendors = vendors.length;
    const activeCount = vendors.filter((v) => v.status === "active").length;
    const totalOutstanding = vendors.reduce(
      (sum, v) => sum + v.outstandingBalance,
      0,
    );
    const totalCreditLimit = vendors.reduce((sum, v) => sum + v.creditLimit, 0);
    const avgRating =
      vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length;

    return {
      totalVendors,
      activeCount,
      totalOutstanding,
      totalCreditLimit,
      avgRating,
    };
  }, [vendors]);

  // Handlers
  const handleSort = (key: keyof Vendor) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsViewModalOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setFormData({
      name: vendor.name,
      type: vendor.type,
      taxId: vendor.taxId,
      taxType: vendor.taxType,
      paymentTerms: vendor.paymentTerms,
      creditLimit: vendor.creditLimit,
      contactName: vendor.contactPerson.name,
      contactEmail: vendor.contactPerson.email,
      contactPhone: vendor.contactPerson.phone,
      contactPosition: vendor.contactPerson.position,
      street: vendor.address.street,
      city: vendor.address.city,
      state: vendor.address.state,
      country: vendor.address.country,
      postalCode: vendor.address.postalCode,
      bankName: vendor.bankDetails.bankName,
      accountNumber: vendor.bankDetails.accountNumber,
      accountName: vendor.bankDetails.accountName,
      sortCode: vendor.bankDetails.sortCode || "",
      website: vendor.website || "",
      categories: vendor.categories,
      notes: vendor.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "Vendor name is required";
    if (!formData.contactName)
      errors.contactName = "Contact person name is required";
    if (!formData.contactEmail)
      errors.contactEmail = "Contact email is required";
    if (!formData.contactPhone)
      errors.contactPhone = "Contact phone is required";
    if (formData.categories.length === 0)
      errors.categories = "At least one category is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateVendor = () => {
    if (!validateForm()) return;

    const newVendor: Vendor = {
      id: Math.max(...vendors.map((v) => v.id), 0) + 1,
      vendorCode: `VEN-${String(vendors.length + 1).padStart(3, "0")}`,
      name: formData.name,
      type: formData.type,
      status: "active",
      taxId: formData.taxId,
      taxType: formData.taxType,
      paymentTerms: formData.paymentTerms,
      creditLimit: formData.creditLimit,
      currentBalance: 0,
      contactPerson: {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone,
        position: formData.contactPosition,
      },
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      },
      bankDetails: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        sortCode: formData.sortCode,
      },
      website: formData.website,
      categories: formData.categories,
      rating: 0,
      totalPurchases: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      notes: formData.notes,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
    };

    setVendors((prev) => [newVendor, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateVendor = () => {
    if (!validateForm() || !selectedVendor) return;

    const updatedVendor: Vendor = {
      ...selectedVendor,
      name: formData.name,
      type: formData.type,
      taxId: formData.taxId,
      taxType: formData.taxType,
      paymentTerms: formData.paymentTerms,
      creditLimit: formData.creditLimit,
      contactPerson: {
        name: formData.contactName,
        email: formData.contactEmail,
        phone: formData.contactPhone,
        position: formData.contactPosition,
      },
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
      },
      bankDetails: {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName,
        sortCode: formData.sortCode,
      },
      website: formData.website,
      categories: formData.categories,
      notes: formData.notes,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setVendors((prev) =>
      prev.map((v) => (v.id === selectedVendor.id ? updatedVendor : v)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedVendor(null);
  };

  const handleDeleteVendor = () => {
    if (!selectedVendor) return;
    setVendors((prev) => prev.filter((v) => v.id !== selectedVendor.id));
    setIsDeleteDialogOpen(false);
    setSelectedVendor(null);
  };

  const handleAddCategory = () => {
    if (newCategory && !formData.categories.includes(newCategory)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory],
      }));
      setNewCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "supplier",
      taxId: "",
      taxType: "vat_registered",
      paymentTerms: "net_30",
      creditLimit: 0,
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactPosition: "",
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      bankName: "",
      accountNumber: "",
      accountName: "",
      sortCode: "",
      website: "",
      categories: [],
      notes: "",
    });
    setFormErrors({});
    setNewCategory("");
  };

  const handleExport = () => {
    const headers = [
      "Code",
      "Name",
      "Type",
      "Status",
      "Contact",
      "Email",
      "Phone",
      "Credit Limit",
      "Outstanding",
      "Categories",
    ];
    const csvData = filteredVendors.map((v) => [
      v.vendorCode,
      v.name,
      v.type,
      v.status,
      v.contactPerson.name,
      v.contactPerson.email,
      v.contactPerson.phone,
      v.creditLimit.toString(),
      v.outstandingBalance.toString(),
      v.categories.join("; "),
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vendors-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setVendors([...mockVendors]);
    setCurrentPage(1);
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setCategoryFilter("all");
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
              <Building2 className="h-6 w-6" />
              Vendor Directory
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all your vendors and suppliers
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
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Vendors</p>
                <p className="text-2xl font-bold">{stats.totalVendors}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCount}
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
                  Total Outstanding
                </p>
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
                <p className="text-sm text-muted-foreground">Avg. Rating</p>
                <p className="text-2xl font-bold">
                  {stats.avgRating.toFixed(1)} / 5.0
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Star className="h-5 w-5 text-purple-600" />
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
                placeholder="Search by name, code, contact..."
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
              <SelectTrigger className="w-full sm:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {vendorTypes.map((type) => (
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
              <SelectTrigger className="w-full sm:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <Package className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("vendorCode")}
                    >
                      Code
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("name")}
                    >
                      Vendor Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("outstandingBalance")}
                    >
                      Outstanding
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No vendors found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell className="font-mono text-xs">
                        {vendor.vendorCode}
                      </TableCell>
                      <TableCell className="font-medium">
                        {vendor.name}
                      </TableCell>
                      <TableCell>{getVendorTypeBadge(vendor.type)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {vendor.contactPerson.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {vendor.contactPerson.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {vendor.categories.slice(0, 2).map((cat) => (
                            <Badge
                              key={cat}
                              variant="secondary"
                              className="text-xs"
                            >
                              {cat}
                            </Badge>
                          ))}
                          {vendor.categories.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{vendor.categories.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell
                        className={`font-medium ${vendor.outstandingBalance > 0 ? "text-orange-600" : "text-green-600"}`}
                      >
                        {formatCurrency(vendor.outstandingBalance)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getRatingStars(vendor.rating)}
                          <span className="text-xs ml-1">
                            ({vendor.rating})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewVendor(vendor)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditVendor(vendor)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredVendors.length > 0 && (
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
                  {Math.min(currentPage * itemsPerPage, filteredVendors.length)}{" "}
                  of {filteredVendors.length}
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

      {/* View Vendor Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedVendor?.name}</span>
              {selectedVendor && getStatusBadge(selectedVendor.status)}
            </DialogTitle>
            <DialogDescription>{selectedVendor?.vendorCode}</DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vendor Type</p>
                  <div className="mt-1">
                    {getVendorTypeBadge(selectedVendor.type)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax ID</p>
                  <p>{selectedVendor.taxId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Type</p>
                  <Badge variant="outline">
                    {selectedVendor.taxType.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p>
                    {
                      paymentTermsList.find(
                        (t) => t.value === selectedVendor.paymentTerms,
                      )?.label
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Credit Limit</p>
                  <p className="font-bold">
                    {formatCurrency(selectedVendor.creditLimit)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Outstanding Balance
                  </p>
                  <p
                    className={`font-bold ${selectedVendor.outstandingBalance > 0 ? "text-orange-600" : "text-green-600"}`}
                  >
                    {formatCurrency(selectedVendor.outstandingBalance)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contact Person
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{selectedVendor.contactPerson.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p>{selectedVendor.contactPerson.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {selectedVendor.contactPerson.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedVendor.contactPerson.phone}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </h3>
                <div>
                  <p>{selectedVendor.address.street}</p>
                  <p>
                    {selectedVendor.address.city},{" "}
                    {selectedVendor.address.state}
                  </p>
                  <p>
                    {selectedVendor.address.country} -{" "}
                    {selectedVendor.address.postalCode}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Bank</p>
                    <p>{selectedVendor.bankDetails.bankName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Account Name
                    </p>
                    <p>{selectedVendor.bankDetails.accountName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Account Number
                    </p>
                    <p className="font-mono">
                      {selectedVendor.bankDetails.accountNumber}
                    </p>
                  </div>
                  {selectedVendor.bankDetails.sortCode && (
                    <div>
                      <p className="text-sm text-muted-foreground">Sort Code</p>
                      <p>{selectedVendor.bankDetails.sortCode}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVendor.categories.map((cat) => (
                    <Badge key={cat} variant="secondary">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedVendor.website && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Website</p>
                  <a
                    href={`https://${selectedVendor.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Globe className="h-3 w-3" />
                    {selectedVendor.website}
                  </a>
                </div>
              )}

              {selectedVendor.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedVendor.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewModalOpen(false);
                handleEditVendor(selectedVendor!);
              }}
            >
              Edit Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Vendor Modal */}
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
              {isCreateModalOpen ? "Add New Vendor" : "Edit Vendor"}
            </DialogTitle>
            <DialogDescription>
              Enter vendor details for your directory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Vendor Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-1"
                    placeholder="e.g., Office Depot Nigeria"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Vendor Type *</Label>
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
                      {vendorTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tax ID</Label>
                  <Input
                    value={formData.taxId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        taxId: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="RC Number / TIN"
                  />
                </div>
                <div>
                  <Label>Tax Type</Label>
                  <Select
                    value={formData.taxType}
                    onValueChange={(v: any) =>
                      setFormData((prev) => ({ ...prev, taxType: v }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vat_registered">
                        VAT Registered
                      </SelectItem>
                      <SelectItem value="vat_exempt">VAT Exempt</SelectItem>
                      <SelectItem value="non_vat">Non-VAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Payment Terms</Label>
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(v: any) =>
                      setFormData((prev) => ({ ...prev, paymentTerms: v }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTermsList.map((term) => (
                        <SelectItem key={term.value} value={term.value}>
                          {term.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Credit Limit (₦)</Label>
                  <Input
                    type="number"
                    value={formData.creditLimit || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        creditLimit: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="mt-1"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Website</Label>
                  <Input
                    value={formData.website}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="www.example.com"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Contact Person</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={formData.contactName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactName: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Full name"
                  />
                  {formErrors.contactName && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.contactName}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={formData.contactPosition}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPosition: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="e.g., Sales Manager"
                  />
                </div>
                <div>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="contact@vendor.com"
                  />
                  {formErrors.contactEmail && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.contactEmail}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="+234 XXX XXX XXXX"
                  />
                  {formErrors.contactPhone && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.contactPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Street Address</Label>
                  <Input
                    value={formData.street}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        street: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <Label>City</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="mt-1"
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={formData.state}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="State"
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Input
                    value={formData.country}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Country"
                  />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        postalCode: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label>Sort Code</Label>
                  <Input
                    value={formData.sortCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sortCode: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Sort code"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Categories *</h3>
              <div className="flex gap-2">
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((c) => !formData.categories.includes(c))
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={handleAddCategory}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.categories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="gap-1">
                    {cat}
                    <button
                      onClick={() => handleRemoveCategory(cat)}
                      className="ml-1 hover:text-red-600"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {formErrors.categories && (
                <p className="text-sm text-red-500">{formErrors.categories}</p>
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
                placeholder="Additional notes about the vendor..."
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
                isCreateModalOpen ? handleCreateVendor : handleUpdateVendor
              }
            >
              {isCreateModalOpen ? "Add Vendor" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete "{selectedVendor?.name}"? This action cannot be
              undone.
              {selectedVendor && selectedVendor.outstandingBalance > 0 && (
                <div className="mt-2 p-3 bg-red-50 rounded-lg text-red-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  This vendor has an outstanding balance of{" "}
                  {formatCurrency(selectedVendor.outstandingBalance)}. Delete
                  all pending transactions first.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteVendor}
              className="bg-red-600 hover:bg-red-700"
              disabled={selectedVendor?.outstandingBalance !== 0}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
