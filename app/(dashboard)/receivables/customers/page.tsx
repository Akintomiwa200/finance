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
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  XCircle,
  Heart,
  CreditCard,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Star,
  StarOff,
  Building2,
  DollarSign,
  Calendar,
  MessageSquare,
  Upload,
  Receipt,
  TrendingUp,
  TrendingDown,
  Wallet,
  UserPlus,
  UserCheck,
  UserX,
  Landmark,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type CustomerStatus = "active" | "inactive" | "suspended" | "blacklisted";
type CustomerType = "individual" | "business" | "government" | "non_profit";
type CreditRating = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "D";

interface Customer {
  id: number;
  customerCode: string;
  name: string;
  type: CustomerType;
  status: CustomerStatus;
  email: string;
  phone: string;
  alternatePhone?: string;
  taxId: string;
  creditLimit: number;
  currentBalance: number;
  creditRating: CreditRating;
  paymentTerms: string;
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
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  website?: string;
  industry?: string;
  notes?: string;
  totalInvoiced: number;
  totalPaid: number;
  outstandingBalance: number;
  lastInvoiceDate?: string;
  lastPaymentDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock Data
const mockCustomers: Customer[] = [
  {
    id: 1,
    customerCode: "CUST-001",
    name: "Nigerian Breweries PLC",
    type: "business",
    status: "active",
    email: "accounts@nbplc.com",
    phone: "+234 800 123 4567",
    taxId: "RC-1234567",
    creditLimit: 50000000,
    currentBalance: 12500000,
    creditRating: "AA",
    paymentTerms: "Net 45",
    contactPerson: {
      name: "John Adeyemi",
      email: "john.adeyemi@nbplc.com",
      phone: "+234 802 123 4567",
      position: "Finance Manager",
    },
    address: {
      street: "1, Lagos Road",
      city: "Ikeja",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "100001",
    },
    website: "www.nbplc.com",
    industry: "Beverages",
    notes: "Major client, priority handling",
    totalInvoiced: 125000000,
    totalPaid: 112500000,
    outstandingBalance: 12500000,
    lastInvoiceDate: "2026-03-10",
    lastPaymentDate: "2026-03-05",
    createdAt: "2024-01-15",
    updatedAt: "2026-03-10",
    createdBy: "Sales Manager",
  },
  {
    id: 2,
    customerCode: "CUST-002",
    name: "MTN Nigeria",
    type: "business",
    status: "active",
    email: "accounts@mtn.ng",
    phone: "+234 700 123 4567",
    taxId: "RC-7654321",
    creditLimit: 100000000,
    currentBalance: 25000000,
    creditRating: "AAA",
    paymentTerms: "Net 30",
    contactPerson: {
      name: "Sarah Okafor",
      email: "sarah.okafor@mtn.ng",
      phone: "+234 803 456 7890",
      position: "Procurement Director",
    },
    address: {
      street: "2, Telecom Way",
      city: "Victoria Island",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101241",
    },
    website: "www.mtn.ng",
    industry: "Telecommunications",
    notes: "Strategic partner",
    totalInvoiced: 250000000,
    totalPaid: 225000000,
    outstandingBalance: 25000000,
    lastInvoiceDate: "2026-03-08",
    lastPaymentDate: "2026-03-01",
    createdAt: "2024-02-01",
    updatedAt: "2026-03-08",
    createdBy: "Sales Director",
  },
  {
    id: 3,
    customerCode: "CUST-003",
    name: "Lagos State Government",
    type: "government",
    status: "active",
    email: "procurement@lagosstate.gov.ng",
    phone: "+234 800 456 7890",
    taxId: "GOV-001",
    creditLimit: 75000000,
    currentBalance: 15000000,
    creditRating: "AAA",
    paymentTerms: "Net 60",
    contactPerson: {
      name: "Michael Eze",
      email: "michael.eze@lagosstate.gov.ng",
      phone: "+234 805 678 9012",
      position: "Procurement Officer",
    },
    address: {
      street: "3, Government House",
      city: "Alausa",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "102102",
    },
    website: "www.lagosstate.gov.ng",
    industry: "Government",
    notes: "Government contract",
    totalInvoiced: 150000000,
    totalPaid: 135000000,
    outstandingBalance: 15000000,
    lastInvoiceDate: "2026-03-12",
    lastPaymentDate: "2026-03-10",
    createdAt: "2024-03-10",
    updatedAt: "2026-03-12",
    createdBy: "Bid Manager",
  },
  {
    id: 4,
    customerCode: "CUST-004",
    name: "Access Bank Plc",
    type: "business",
    status: "active",
    email: "supplier@accessbank.com",
    phone: "+234 800 789 0123",
    taxId: "RC-1122334",
    creditLimit: 80000000,
    currentBalance: 5000000,
    creditRating: "AAA",
    paymentTerms: "Net 30",
    contactPerson: {
      name: "Amara Nwosu",
      email: "amara.nwosu@accessbank.com",
      phone: "+234 806 789 0123",
      position: "Supply Chain Manager",
    },
    address: {
      street: "4, Banking Avenue",
      city: "Marina",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101212",
    },
    website: "www.accessbank.com",
    industry: "Banking",
    notes: "Banking partner",
    totalInvoiced: 200000000,
    totalPaid: 195000000,
    outstandingBalance: 5000000,
    lastInvoiceDate: "2026-03-05",
    lastPaymentDate: "2026-03-15",
    createdAt: "2024-04-15",
    updatedAt: "2026-03-05",
    createdBy: "Relationship Manager",
  },
  {
    id: 5,
    customerCode: "CUST-005",
    name: "John Obi",
    type: "individual",
    status: "suspended",
    email: "john.obi@gmail.com",
    phone: "+234 807 890 1234",
    taxId: "N/A",
    creditLimit: 1000000,
    currentBalance: 750000,
    creditRating: "B",
    paymentTerms: "Net 15",
    contactPerson: {
      name: "John Obi",
      email: "john.obi@gmail.com",
      phone: "+234 807 890 1234",
      position: "Self",
    },
    address: {
      street: "15, Residential Estate",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "105102",
    },
    industry: "Individual",
    notes: "Suspended due to payment default",
    totalInvoiced: 2500000,
    totalPaid: 1750000,
    outstandingBalance: 750000,
    lastInvoiceDate: "2026-02-20",
    lastPaymentDate: "2026-01-15",
    createdAt: "2024-05-20",
    updatedAt: "2026-02-20",
    createdBy: "Sales Rep",
  },
];

const customerTypes = [
  { value: "individual", label: "Individual", icon: Users },
  { value: "business", label: "Business", icon: Building2 },
  { value: "government", label: "Government", icon: Landmark },
  { value: "non_profit", label: "Non-Profit", icon: Heart },
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

const creditRatings = [
  {
    value: "AAA",
    label: "AAA - Excellent",
    color: "bg-green-100 text-green-700",
  },
  { value: "AA", label: "AA - Very Good", color: "bg-green-50 text-green-600" },
  { value: "A", label: "A - Good", color: "bg-blue-100 text-blue-700" },
  { value: "BBB", label: "BBB - Fair", color: "bg-yellow-100 text-yellow-700" },
  {
    value: "BB",
    label: "BB - Below Average",
    color: "bg-orange-100 text-orange-700",
  },
  { value: "B", label: "B - Poor", color: "bg-red-100 text-red-700" },
  { value: "CCC", label: "CCC - Very Poor", color: "bg-red-200 text-red-800" },
  { value: "D", label: "D - Default", color: "bg-red-300 text-red-900" },
];

const industries = [
  "Beverages",
  "Telecommunications",
  "Government",
  "Banking",
  "Oil & Gas",
  "Manufacturing",
  "Retail",
  "Technology",
  "Healthcare",
  "Education",
  "Construction",
  "Real Estate",
  "Hospitality",
  "Transportation",
  "Agriculture",
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
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusBadge = (status: CustomerStatus) => {
  const config = statuses.find((s) => s.value === status);
  const icons = {
    active: <CheckCircle className="h-3 w-3 mr-1" />,
    inactive: <Clock className="h-3 w-3 mr-1" />,
    suspended: <AlertCircle className="h-3 w-3 mr-1" />,
    blacklisted: <XCircle className="h-3 w-3 mr-1" />,
  };
  return (
    <Badge className={config?.color + " flex items-center w-fit"}>
      {icons[status]}
      {config?.label}
    </Badge>
  );
};

const getCreditRatingBadge = (rating: CreditRating) => {
  const config = creditRatings.find((r) => r.value === rating);
  return (
    <Badge variant="outline" className={config?.color}>
      {config?.label}
    </Badge>
  );
};

export default function Customers() {
  const router = useRouter();

  // State
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Customer;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"customers" | "analytics">(
    "customers",
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "business" as CustomerType,
    email: "",
    phone: "",
    alternatePhone: "",
    taxId: "",
    creditLimit: 0,
    creditRating: "BBB" as CreditRating,
    paymentTerms: "Net 30",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactPosition: "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    postalCode: "",
    website: "",
    industry: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const activeCount = customers.filter((c) => c.status === "active").length;
    const totalOutstanding = customers.reduce(
      (sum, c) => sum + c.outstandingBalance,
      0,
    );
    const totalCreditLimit = customers.reduce(
      (sum, c) => sum + c.creditLimit,
      0,
    );
    const highRiskCount = customers.filter(
      (c) =>
        c.creditRating === "B" ||
        c.creditRating === "CCC" ||
        c.creditRating === "D",
    ).length;
    const creditUtilization = (totalOutstanding / totalCreditLimit) * 100;

    return {
      totalCustomers,
      activeCount,
      totalOutstanding,
      totalCreditLimit,
      highRiskCount,
      creditUtilization,
    };
  }, [customers]);

  // Filter and sort
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.customerCode.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.phone.includes(query),
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((c) => c.type === typeFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (ratingFilter !== "all") {
      result = result.filter((c) => c.creditRating === ratingFilter);
    }

    if (industryFilter !== "all") {
      result = result.filter((c) => c.industry === industryFilter);
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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
    customers,
    searchQuery,
    typeFilter,
    statusFilter,
    ratingFilter,
    industryFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof Customer) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      type: customer.type,
      email: customer.email,
      phone: customer.phone,
      alternatePhone: customer.alternatePhone || "",
      taxId: customer.taxId,
      creditLimit: customer.creditLimit,
      creditRating: customer.creditRating,
      paymentTerms: customer.paymentTerms,
      contactName: customer.contactPerson.name,
      contactEmail: customer.contactPerson.email,
      contactPhone: customer.contactPerson.phone,
      contactPosition: customer.contactPerson.position,
      street: customer.address.street,
      city: customer.address.city,
      state: customer.address.state,
      country: customer.address.country,
      postalCode: customer.address.postalCode,
      website: customer.website || "",
      industry: customer.industry || "",
      notes: customer.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "Customer name is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone number is required";
    if (!formData.contactName)
      errors.contactName = "Contact person name is required";
    if (!formData.contactEmail)
      errors.contactEmail = "Contact email is required";
    if (!formData.contactPhone)
      errors.contactPhone = "Contact phone is required";
    if (!formData.street) errors.street = "Street address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateCustomer = () => {
    if (!validateForm()) return;

    const newCustomer: Customer = {
      id: Math.max(...customers.map((c) => c.id), 0) + 1,
      customerCode: `CUST-${String(customers.length + 1).padStart(3, "0")}`,
      name: formData.name,
      type: formData.type,
      status: "active",
      email: formData.email,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone,
      taxId: formData.taxId,
      creditLimit: formData.creditLimit,
      currentBalance: 0,
      creditRating: formData.creditRating,
      paymentTerms: formData.paymentTerms,
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
      website: formData.website,
      industry: formData.industry,
      notes: formData.notes,
      totalInvoiced: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
      createdBy: "Current User",
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleUpdateCustomer = () => {
    if (!validateForm() || !selectedCustomer) return;

    const updatedCustomer: Customer = {
      ...selectedCustomer,
      name: formData.name,
      type: formData.type,
      email: formData.email,
      phone: formData.phone,
      alternatePhone: formData.alternatePhone,
      taxId: formData.taxId,
      creditLimit: formData.creditLimit,
      creditRating: formData.creditRating,
      paymentTerms: formData.paymentTerms,
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
      website: formData.website,
      industry: formData.industry,
      notes: formData.notes,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setCustomers((prev) =>
      prev.map((c) => (c.id === selectedCustomer.id ? updatedCustomer : c)),
    );
    resetForm();
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
    setIsDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "business",
      email: "",
      phone: "",
      alternatePhone: "",
      taxId: "",
      creditLimit: 0,
      creditRating: "BBB",
      paymentTerms: "Net 30",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactPosition: "",
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      website: "",
      industry: "",
      notes: "",
    });
    setFormErrors({});
  };

  const handleExport = () => {
    const headers = [
      "Code",
      "Name",
      "Type",
      "Status",
      "Email",
      "Phone",
      "Credit Limit",
      "Outstanding",
      "Credit Rating",
    ];
    const csvData = filteredCustomers.map((c) => [
      c.customerCode,
      c.name,
      c.type,
      c.status,
      c.email,
      c.phone,
      c.creditLimit.toString(),
      c.outstandingBalance.toString(),
      c.creditRating,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setCustomers([...mockCustomers]);
    setCurrentPage(1);
    setSearchQuery("");
    setTypeFilter("all");
    setStatusFilter("all");
    setRatingFilter("all");
    setIndustryFilter("all");
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
              <Users className="h-6 w-6" />
              Customer Directory
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage all your customers and their credit information
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
            Add Customer
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Customers
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.activeCount}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <UserCheck className="h-5 w-5 text-green-600" />
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
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.highRiskCount}
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
                placeholder="Search by name, code, email, phone..."
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
                {customerTypes.map((type) => (
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
              value={ratingFilter}
              onValueChange={(v) => {
                setRatingFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[150px]">
                <Star className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Credit Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                {creditRatings.map((rating) => (
                  <SelectItem key={rating.value} value={rating.value}>
                    {rating.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={industryFilter}
              onValueChange={(v) => {
                setIndustryFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <Building2 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("customerCode")}
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
                      Customer Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("outstandingBalance")}
                    >
                      Outstanding
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Credit Limit</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No customers found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-mono text-xs">
                        {customer.customerCode}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {customer.type}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {customer.contactPerson.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {customer.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        className={`font-medium ${customer.outstandingBalance > 0 ? "text-orange-600" : "text-green-600"}`}
                      >
                        {formatCurrency(customer.outstandingBalance)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(customer.creditLimit)}
                      </TableCell>
                      <TableCell>
                        {getCreditRatingBadge(customer.creditRating)}
                      </TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCustomer(customer)}
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
          {filteredCustomers.length > 0 && (
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
                    filteredCustomers.length,
                  )}{" "}
                  of {filteredCustomers.length}
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

      {/* View Customer Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedCustomer?.name}</span>
              {selectedCustomer && getStatusBadge(selectedCustomer.status)}
            </DialogTitle>
            <DialogDescription>
              {selectedCustomer?.customerCode}
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Type</p>
                  <p className="capitalize">{selectedCustomer.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax ID</p>
                  <p>{selectedCustomer.taxId || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedCustomer.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {selectedCustomer.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p>{selectedCustomer.paymentTerms}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Industry</p>
                  <p>{selectedCustomer.industry || "-"}</p>
                </div>
                {selectedCustomer.website && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a
                      href={`https://${selectedCustomer.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      {selectedCustomer.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contact Person
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{selectedCustomer.contactPerson.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p>{selectedCustomer.contactPerson.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedCustomer.contactPerson.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedCustomer.contactPerson.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </h3>
                <div>
                  <p>{selectedCustomer.address.street}</p>
                  <p>
                    {selectedCustomer.address.city},{" "}
                    {selectedCustomer.address.state}
                  </p>
                  <p>
                    {selectedCustomer.address.country} -{" "}
                    {selectedCustomer.address.postalCode}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Credit Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Credit Limit
                    </p>
                    <p className="font-bold">
                      {formatCurrency(selectedCustomer.creditLimit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Balance
                    </p>
                    <p className="font-bold text-orange-600">
                      {formatCurrency(selectedCustomer.currentBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Outstanding Balance
                    </p>
                    <p className="font-bold text-red-600">
                      {formatCurrency(selectedCustomer.outstandingBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Credit Rating
                    </p>
                    {getCreditRatingBadge(selectedCustomer.creditRating)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Invoiced
                    </p>
                    <p>{formatCurrency(selectedCustomer.totalInvoiced)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-green-600">
                      {formatCurrency(selectedCustomer.totalPaid)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{selectedCustomer.notes}</p>
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
                handleEditCustomer(selectedCustomer!);
              }}
            >
              Edit Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Customer Modal */}
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
              {isCreateModalOpen ? "Add New Customer" : "Edit Customer"}
            </DialogTitle>
            <DialogDescription>
              Enter customer information for your directory
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label>Customer Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-1"
                    placeholder="e.g., Nigerian Breweries PLC"
                  />
                  {formErrors.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Customer Type *</Label>
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
                      {customerTypes.map((type) => (
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
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="customer@email.com"
                  />
                  {formErrors.email && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Phone *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="+234 XXX XXX XXXX"
                  />
                  {formErrors.phone && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.phone}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Alternate Phone</Label>
                  <Input
                    value={formData.alternatePhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        alternatePhone: e.target.value,
                      }))
                    }
                    className="mt-1"
                    placeholder="Alternate contact number"
                  />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(v) =>
                      setFormData((prev) => ({ ...prev, industry: v }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
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
                    placeholder="e.g., Finance Manager"
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
                    placeholder="contact@company.com"
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
                  <Label>Street Address *</Label>
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
                  {formErrors.street && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.street}
                    </p>
                  )}
                </div>
                <div>
                  <Label>City *</Label>
                  <Input
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    className="mt-1"
                    placeholder="City"
                  />
                  {formErrors.city && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.city}
                    </p>
                  )}
                </div>
                <div>
                  <Label>State *</Label>
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
                  {formErrors.state && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.state}
                    </p>
                  )}
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

            {/* Credit Information */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Credit Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <Label>Credit Rating</Label>
                  <Select
                    value={formData.creditRating}
                    onValueChange={(v: any) =>
                      setFormData((prev) => ({ ...prev, creditRating: v }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {creditRatings.map((rating) => (
                        <SelectItem key={rating.value} value={rating.value}>
                          {rating.label}
                        </SelectItem>
                      ))}
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
              </div>
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
                placeholder="Additional notes about the customer..."
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
                isCreateModalOpen ? handleCreateCustomer : handleUpdateCustomer
              }
            >
              {isCreateModalOpen ? "Add Customer" : "Save Changes"}
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
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete "{selectedCustomer?.name}"? This action cannot
              be undone.
              {selectedCustomer && selectedCustomer.outstandingBalance > 0 && (
                <div className="mt-2 p-3 bg-red-50 rounded-lg text-red-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  This customer has an outstanding balance of{" "}
                  {formatCurrency(selectedCustomer.outstandingBalance)}. Clear
                  all invoices before deleting.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
              className="bg-red-600 hover:bg-red-700"
              disabled={selectedCustomer?.outstandingBalance !== 0}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
