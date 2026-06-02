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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Layers,
  Wallet,
  PiggyBank,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Receipt,
} from "lucide-react";

// Types
interface ExpenseTransaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  reference: string;
  type: "expense" | "allocation" | "transfer";
}

interface CostCenter {
  id: number;
  code: string;
  name: string;
  department: string;
  description: string;
  manager: string;
  managerEmail: string;
  budgetAllocated: number;
  spent: number;
  remaining: number;
  fiscalYear: string;
  status: "active" | "inactive" | "frozen";
  category: string;
  transactions: ExpenseTransaction[];
  createdAt: string;
  notes?: string;
}

// Initial Data
const initialCostCenters: CostCenter[] = [
  {
    id: 1,
    code: "CC-FIN-001",
    name: "Finance Operations",
    department: "Finance",
    description:
      "Day-to-day financial operations including accounting, reporting, and compliance.",
    manager: "Jane Manager",
    managerEmail: "jane.manager@company.com",
    budgetAllocated: 50000000,
    spent: 32000000,
    remaining: 18000000,
    fiscalYear: "FY 2026",
    status: "active",
    category: "Operations",
    transactions: [
      {
        id: 1,
        date: "2026-01-15",
        description: "Accounting Software License",
        category: "Software",
        amount: 5000000,
        reference: "INV-2026-001",
        type: "expense",
      },
      {
        id: 2,
        date: "2026-02-01",
        description: "Audit Services",
        category: "Professional Services",
        amount: 3000000,
        reference: "INV-2026-015",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-03-10",
        description: "Office Supplies",
        category: "Supplies",
        amount: 500000,
        reference: "PO-2026-022",
        type: "expense",
      },
      {
        id: 4,
        date: "2026-04-01",
        description: "Q2 Budget Allocation",
        category: "Budget",
        amount: 12500000,
        reference: "BUD-2026-Q2",
        type: "allocation",
      },
    ],
    createdAt: "2024-01-15",
    notes:
      "Primary financial operations cost center. Includes accounting software, audit, and compliance costs.",
  },
  {
    id: 2,
    code: "CC-ENG-001",
    name: "Engineering R&D",
    department: "Engineering",
    description:
      "Research and development, software engineering, and technical infrastructure.",
    manager: "Tech Lead",
    managerEmail: "tech.lead@company.com",
    budgetAllocated: 80000000,
    spent: 45000000,
    remaining: 35000000,
    fiscalYear: "FY 2026",
    status: "active",
    category: "Research & Development",
    transactions: [
      {
        id: 1,
        date: "2026-01-10",
        description: "Cloud Infrastructure",
        category: "Infrastructure",
        amount: 8000000,
        reference: "INV-2026-005",
        type: "expense",
      },
      {
        id: 2,
        date: "2026-02-15",
        description: "Development Tools",
        category: "Software",
        amount: 3500000,
        reference: "INV-2026-018",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-03-20",
        description: "Server Equipment",
        category: "Equipment",
        amount: 6000000,
        reference: "PO-2026-030",
        type: "expense",
      },
      {
        id: 4,
        date: "2026-04-01",
        description: "Q2 Budget Allocation",
        category: "Budget",
        amount: 20000000,
        reference: "BUD-2026-Q2",
        type: "allocation",
      },
    ],
    createdAt: "2024-01-15",
    notes:
      "Core engineering R&D cost center. Covers cloud infrastructure, development tools, and equipment.",
  },
  {
    id: 3,
    code: "CC-HR-001",
    name: "HR Operations",
    department: "HR",
    description:
      "Human resources management, recruitment, training, and employee benefits.",
    manager: "HR Director",
    managerEmail: "hr.director@company.com",
    budgetAllocated: 25000000,
    spent: 14500000,
    remaining: 10500000,
    fiscalYear: "FY 2026",
    status: "active",
    category: "Operations",
    transactions: [
      {
        id: 1,
        date: "2026-01-05",
        description: "HR Management System",
        category: "Software",
        amount: 3500000,
        reference: "INV-2026-003",
        type: "expense",
      },
      {
        id: 2,
        date: "2026-02-20",
        description: "Recruitment Campaign",
        category: "Recruitment",
        amount: 2500000,
        reference: "INV-2026-020",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-03-15",
        description: "Training Program",
        category: "Training",
        amount: 2000000,
        reference: "PO-2026-025",
        type: "expense",
      },
      {
        id: 4,
        date: "2026-04-01",
        description: "Q2 Budget Allocation",
        category: "Budget",
        amount: 6000000,
        reference: "BUD-2026-Q2",
        type: "allocation",
      },
    ],
    createdAt: "2024-01-15",
    notes:
      "HR operational costs including recruitment, training, and employee benefits administration.",
  },
  {
    id: 4,
    code: "CC-SAL-001",
    name: "Sales & Marketing",
    department: "Sales",
    description:
      "Sales operations, marketing campaigns, and client acquisition costs.",
    manager: "Sales Manager",
    managerEmail: "sales.manager@company.com",
    budgetAllocated: 35000000,
    spent: 32000000,
    remaining: 3000000,
    fiscalYear: "FY 2026",
    status: "active",
    category: "Sales & Marketing",
    transactions: [
      {
        id: 1,
        date: "2026-01-12",
        description: "Digital Ad Campaign",
        category: "Advertising",
        amount: 8000000,
        reference: "INV-2026-008",
        type: "expense",
      },
      {
        id: 2,
        date: "2026-02-10",
        description: "Trade Show Exhibition",
        category: "Events",
        amount: 5000000,
        reference: "INV-2026-016",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-03-05",
        description: "CRM Software",
        category: "Software",
        amount: 3000000,
        reference: "INV-2026-022",
        type: "expense",
      },
      {
        id: 4,
        date: "2026-04-01",
        description: "Q2 Budget Allocation",
        category: "Budget",
        amount: 8750000,
        reference: "BUD-2026-Q2",
        type: "allocation",
      },
    ],
    createdAt: "2024-01-15",
    notes:
      "Sales and marketing cost center. Tracks advertising, events, and client acquisition expenses.",
  },
  {
    id: 5,
    code: "CC-IT-001",
    name: "IT Infrastructure",
    department: "IT",
    description:
      "IT infrastructure, cybersecurity, network management, and technical support.",
    manager: "IT Manager",
    managerEmail: "it.manager@company.com",
    budgetAllocated: 55000000,
    spent: 31000000,
    remaining: 24000000,
    fiscalYear: "FY 2026",
    status: "active",
    category: "Technology",
    transactions: [
      {
        id: 1,
        date: "2026-01-08",
        description: "Network Equipment",
        category: "Infrastructure",
        amount: 7000000,
        reference: "PO-2026-010",
        type: "expense",
      },
      {
        id: 2,
        date: "2026-02-25",
        description: "Security Software",
        category: "Software",
        amount: 4500000,
        reference: "INV-2026-021",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-03-18",
        description: "Server Maintenance",
        category: "Maintenance",
        amount: 2500000,
        reference: "INV-2026-028",
        type: "expense",
      },
      {
        id: 4,
        date: "2026-04-01",
        description: "Q2 Budget Allocation",
        category: "Budget",
        amount: 13750000,
        reference: "BUD-2026-Q2",
        type: "allocation",
      },
    ],
    createdAt: "2024-06-01",
    notes: "IT infrastructure and cybersecurity cost center.",
  },
  {
    id: 6,
    code: "CC-MKT-001",
    name: "Digital Marketing",
    department: "Marketing",
    description:
      "Digital marketing campaigns, social media, content creation, and SEO.",
    manager: "Marketing Director",
    managerEmail: "marketing.director@company.com",
    budgetAllocated: 30000000,
    spent: 22000000,
    remaining: 8000000,
    fiscalYear: "FY 2026",
    status: "active",
    category: "Sales & Marketing",
    transactions: [
      {
        id: 1,
        date: "2026-01-20",
        description: "Social Media Ads",
        category: "Advertising",
        amount: 6000000,
        reference: "INV-2026-012",
        type: "expense",
      },
      {
        id: 2,
        date: "2026-02-14",
        description: "Content Production",
        category: "Content",
        amount: 3500000,
        reference: "INV-2026-017",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-03-22",
        description: "SEO Tools",
        category: "Software",
        amount: 1500000,
        reference: "INV-2026-029",
        type: "expense",
      },
      {
        id: 4,
        date: "2026-04-01",
        description: "Q2 Budget Allocation",
        category: "Budget",
        amount: 7500000,
        reference: "BUD-2026-Q2",
        type: "allocation",
      },
    ],
    createdAt: "2024-03-01",
    notes: "Digital marketing and brand awareness cost center.",
  },
  {
    id: 7,
    code: "CC-OPS-001",
    name: "Facility Operations",
    department: "Operations",
    description:
      "Office facilities, utilities, maintenance, and operational support.",
    manager: "Ops Director",
    managerEmail: "ops.director@company.com",
    budgetAllocated: 20000000,
    spent: 12000000,
    remaining: 8000000,
    fiscalYear: "FY 2026",
    status: "active",
    category: "Operations",
    transactions: [
      {
        id: 1,
        date: "2026-01-03",
        description: "Office Rent Q1",
        category: "Rent",
        amount: 5000000,
        reference: "INV-2026-002",
        type: "expense",
      },
      {
        id: 2,
        date: "2026-02-05",
        description: "Utility Bills",
        category: "Utilities",
        amount: 1500000,
        reference: "INV-2026-014",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-03-12",
        description: "Cleaning Services",
        category: "Maintenance",
        amount: 800000,
        reference: "INV-2026-024",
        type: "expense",
      },
      {
        id: 4,
        date: "2026-04-01",
        description: "Q2 Budget Allocation",
        category: "Budget",
        amount: 5000000,
        reference: "BUD-2026-Q2",
        type: "allocation",
      },
    ],
    createdAt: "2024-01-15",
    notes: "Facility management and operational support cost center.",
  },
  {
    id: 8,
    code: "CC-ADM-001",
    name: "General Administration",
    department: "Administration",
    description:
      "General administrative expenses, office supplies, and executive support.",
    manager: "Admin Manager",
    managerEmail: "admin.manager@company.com",
    budgetAllocated: 10000000,
    spent: 6500000,
    remaining: 3500000,
    fiscalYear: "FY 2026",
    status: "frozen",
    category: "Operations",
    transactions: [
      {
        id: 1,
        date: "2026-01-10",
        description: "Office Supplies",
        category: "Supplies",
        amount: 2000000,
        reference: "PO-2026-005",
        type: "expense",
      },
      {
        id: 2,
        date: "2026-02-18",
        description: "Executive Travel",
        category: "Travel",
        amount: 1500000,
        reference: "INV-2026-019",
        type: "expense",
      },
      {
        id: 3,
        date: "2026-04-01",
        description: "Q2 Budget Allocation",
        category: "Budget",
        amount: 2500000,
        reference: "BUD-2026-Q2",
        type: "allocation",
      },
    ],
    createdAt: "2024-01-15",
    notes: "Budget frozen pending review of Q1 overspend.",
  },
];

const departments = [
  "Finance",
  "Engineering",
  "HR",
  "Sales",
  "Marketing",
  "IT",
  "Operations",
  "Administration",
];
const costCategories = [
  "Operations",
  "Research & Development",
  "Sales & Marketing",
  "Technology",
  "Administrative",
];
const expenseCategories = [
  "Software",
  "Professional Services",
  "Supplies",
  "Infrastructure",
  "Equipment",
  "Recruitment",
  "Training",
  "Advertising",
  "Events",
  "Content",
  "Maintenance",
  "Rent",
  "Utilities",
  "Travel",
  "Budget",
  "Other",
];

export default function CostCentersPage() {
  // State
  const [costCenters, setCostCenters] =
    useState<CostCenter[]>(initialCostCenters);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CostCenter;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCostCenter, setSelectedCostCenter] =
    useState<CostCenter | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    description: "",
    manager: "",
    managerEmail: "",
    budgetAllocated: 0,
    fiscalYear: "FY 2026",
    status: "active" as CostCenter["status"],
    category: "",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalBudget = costCenters.reduce(
      (sum, cc) => sum + cc.budgetAllocated,
      0,
    );
    const totalSpent = costCenters.reduce((sum, cc) => sum + cc.spent, 0);
    const totalRemaining = costCenters.reduce(
      (sum, cc) => sum + cc.remaining,
      0,
    );
    const activeCount = costCenters.filter(
      (cc) => cc.status === "active",
    ).length;
    const overBudgetCount = costCenters.filter(
      (cc) => cc.spent > cc.budgetAllocated,
    ).length;
    const nearLimitCount = costCenters.filter((cc) => {
      const percentage =
        cc.budgetAllocated > 0 ? (cc.spent / cc.budgetAllocated) * 100 : 0;
      return percentage >= 80 && percentage < 100;
    }).length;
    const utilizationRate =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      totalRemaining,
      activeCount,
      overBudgetCount,
      nearLimitCount,
      utilizationRate,
      totalCostCenters: costCenters.length,
    };
  }, [costCenters]);

  // Filter and sort
  const filteredCostCenters = useMemo(() => {
    let result = [...costCenters];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (cc) =>
          cc.code.toLowerCase().includes(query) ||
          cc.name.toLowerCase().includes(query) ||
          cc.department.toLowerCase().includes(query) ||
          cc.manager.toLowerCase().includes(query) ||
          cc.managerEmail.toLowerCase().includes(query) ||
          (cc.description && cc.description.toLowerCase().includes(query)),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((cc) => cc.status === statusFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter((cc) => cc.department === departmentFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter((cc) => cc.category === categoryFilter);
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

    return result;
  }, [
    costCenters,
    searchQuery,
    statusFilter,
    departmentFilter,
    categoryFilter,
    sortConfig,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredCostCenters.length / itemsPerPage);
  const paginatedCostCenters = filteredCostCenters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof CostCenter) => {
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
      [name]: name === "budgetAllocated" ? parseFloat(value) || 0 : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const generateCostCenterCode = (department: string) => {
    const deptCode = department.substring(0, 3).toUpperCase();
    const existingCount =
      costCenters.filter((cc) => cc.department === department).length + 1;
    return `CC-${deptCode}-${String(existingCount).padStart(3, "0")}`;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Cost center name is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.manager.trim()) errors.manager = "Manager name is required";
    if (!formData.managerEmail.trim()) {
      errors.managerEmail = "Manager email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.managerEmail)) {
      errors.managerEmail = "Invalid email format";
    }
    if (!formData.category) errors.category = "Category is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCostCenter = () => {
    if (!validateForm()) return;

    const code = generateCostCenterCode(formData.department);

    const newCostCenter: CostCenter = {
      id: Math.max(...costCenters.map((cc) => cc.id), 0) + 1,
      code,
      name: formData.name,
      department: formData.department,
      description: formData.description,
      manager: formData.manager,
      managerEmail: formData.managerEmail,
      budgetAllocated: formData.budgetAllocated,
      spent: 0,
      remaining: formData.budgetAllocated,
      fiscalYear: formData.fiscalYear,
      status: formData.status,
      category: formData.category,
      transactions: [],
      createdAt: new Date().toISOString().split("T")[0],
      notes: formData.notes || undefined,
    };

    setCostCenters((prev) => [newCostCenter, ...prev]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditCostCenter = () => {
    if (!validateForm() || !selectedCostCenter) return;

    setCostCenters((prev) =>
      prev.map((cc) =>
        cc.id === selectedCostCenter.id
          ? {
              ...cc,
              name: formData.name,
              department: formData.department,
              description: formData.description,
              manager: formData.manager,
              managerEmail: formData.managerEmail,
              budgetAllocated: formData.budgetAllocated,
              remaining: formData.budgetAllocated - cc.spent,
              fiscalYear: formData.fiscalYear,
              status: formData.status,
              category: formData.category,
              notes: formData.notes || undefined,
            }
          : cc,
      ),
    );

    resetForm();
    setIsEditModalOpen(false);
    setSelectedCostCenter(null);
  };

  const handleDeleteCostCenter = () => {
    if (!selectedCostCenter) return;
    setCostCenters((prev) =>
      prev.filter((cc) => cc.id !== selectedCostCenter.id),
    );
    setIsDeleteDialogOpen(false);
    setSelectedCostCenter(null);
  };

  const openEditModal = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setFormData({
      name: costCenter.name,
      department: costCenter.department,
      description: costCenter.description,
      manager: costCenter.manager,
      managerEmail: costCenter.managerEmail,
      budgetAllocated: costCenter.budgetAllocated,
      fiscalYear: costCenter.fiscalYear,
      status: costCenter.status,
      category: costCenter.category,
      notes: costCenter.notes || "",
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      department: "",
      description: "",
      manager: "",
      managerEmail: "",
      budgetAllocated: 0,
      fiscalYear: "FY 2026",
      status: "active",
      category: "",
      notes: "",
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
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: CostCenter["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-700">
            <Clock className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      case "frozen":
        return (
          <Badge className="bg-blue-100 text-blue-700">
            <Activity className="h-3 w-3 mr-1" />
            Frozen
          </Badge>
        );
      default:
        return null;
    }
  };

  const getUtilizationPercentage = (spent: number, allocated: number) => {
    return allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
  };

  const getUtilizationColor = (percentage: number, status: string) => {
    if (status === "frozen") return "bg-blue-500";
    if (percentage > 100) return "bg-red-500";
    if (percentage > 80) return "bg-orange-500";
    if (percentage > 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getUtilizationStatus = (percentage: number, status: string) => {
    if (status === "frozen") return "Frozen";
    if (percentage > 100) return "Over Budget";
    if (percentage > 80) return "Near Limit";
    if (percentage > 50) return "On Track";
    return "Under Budget";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Cost Centers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage cost center codes and budget allocations
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Cost Center
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Cost Center</DialogTitle>
              <DialogDescription>
                Create a new cost center with budget allocation and manager
                details.
              </DialogDescription>
            </DialogHeader>
            <CostCenterForm
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
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
              <Button onClick={handleAddCostCenter}>Create Cost Center</Button>
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
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalBudget)}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalSpent)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRemaining)}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className="text-2xl font-bold">
                  {stats.utilizationRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <Progress value={stats.utilizationRate} className="h-2 mt-3" />
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
                placeholder="Search by code, name, department, manager..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="frozen">Frozen</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={departmentFilter}
              onValueChange={(v) => {
                setDepartmentFilter(v);
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
            <Select
              value={categoryFilter}
              onValueChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Layers className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {costCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cost Centers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Centers</CardTitle>
          <CardDescription>
            {filteredCostCenters.length} cost center
            {filteredCostCenters.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("budgetAllocated")}
                    >
                      Budget Allocated
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Spent</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCostCenters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Layers className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No cost centers found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedCostCenters.map((cc) => {
                    const utilization = getUtilizationPercentage(
                      cc.spent,
                      cc.budgetAllocated,
                    );
                    return (
                      <TableRow key={cc.id}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-mono text-xs"
                          >
                            {cc.code}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-sm">{cc.name}</span>
                        </TableCell>
                        <TableCell>{cc.department}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {cc.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(cc.budgetAllocated)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(cc.spent)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${cc.remaining < 0 ? "text-red-600" : "text-green-600"}`}
                          >
                            {formatCurrency(Math.abs(cc.remaining))}
                            {cc.remaining < 0 ? " Over" : ""}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="w-[120px] space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{utilization}%</span>
                              <span
                                className={
                                  utilization > 100
                                    ? "text-red-600"
                                    : utilization > 80
                                      ? "text-orange-600"
                                      : "text-muted-foreground"
                                }
                              >
                                {getUtilizationStatus(utilization, cc.status)}
                              </span>
                            </div>
                            <Progress
                              value={Math.min(utilization, 100)}
                              className="h-2"
                              indicatorClassName={getUtilizationColor(
                                utilization,
                                cc.status,
                              )}
                            />
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cc.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewModal(cc)}
                            >
                              View
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
                                  onClick={() => openViewModal(cc)}
                                >
                                  <Eye className="h-4 w-4 mr-2" /> View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => openEditModal(cc)}
                                >
                                  <Pencil className="h-4 w-4 mr-2" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedCostCenter(cc);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredCostCenters.length > 0 && (
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
                  </SelectContent>
                </Select>
                <span>
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredCostCenters.length,
                  )}{" "}
                  of {filteredCostCenters.length}
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

      {/* View Cost Center Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCostCenter?.name}</DialogTitle>
            <DialogDescription>
              {selectedCostCenter?.code} - {selectedCostCenter?.fiscalYear}
            </DialogDescription>
          </DialogHeader>
          {selectedCostCenter && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    {selectedCostCenter.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCostCenter.description}
                  </p>
                </div>
                {getStatusBadge(selectedCostCenter.status)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    Manager
                  </p>
                  <p className="font-medium">{selectedCostCenter.manager}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCostCenter.managerEmail}
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    Budget Overview
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Allocated:</span>
                      <span className="font-bold">
                        {formatCurrency(selectedCostCenter.budgetAllocated)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Spent:</span>
                      <span className="font-bold">
                        {formatCurrency(selectedCostCenter.spent)}
                      </span>
                    </div>
                    <Progress
                      value={getUtilizationPercentage(
                        selectedCostCenter.spent,
                        selectedCostCenter.budgetAllocated,
                      )}
                      className="h-2"
                      indicatorClassName={getUtilizationColor(
                        getUtilizationPercentage(
                          selectedCostCenter.spent,
                          selectedCostCenter.budgetAllocated,
                        ),
                        selectedCostCenter.status,
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {getUtilizationPercentage(
                          selectedCostCenter.spent,
                          selectedCostCenter.budgetAllocated,
                        )}
                        % utilized
                      </span>
                      <span
                        className={
                          selectedCostCenter.remaining < 0
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {formatCurrency(Math.abs(selectedCostCenter.remaining))}{" "}
                        {selectedCostCenter.remaining < 0
                          ? "over"
                          : "remaining"}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedCostCenter.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="secondary">
                    {selectedCostCenter.category}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fiscal Year</p>
                  <p className="font-medium">{selectedCostCenter.fiscalYear}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {formatDate(selectedCostCenter.createdAt)}
                  </p>
                </div>
              </div>

              {selectedCostCenter.notes && (
                <div>
                  <p className="font-medium mb-2">Notes</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedCostCenter.notes}
                  </p>
                </div>
              )}

              {/* Transactions */}
              {selectedCostCenter.transactions.length > 0 && (
                <div>
                  <p className="font-medium mb-3">Recent Transactions</p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCostCenter.transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="text-sm">
                            {formatDate(txn.date)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {txn.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {txn.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs ${
                                txn.type === "allocation"
                                  ? "bg-blue-100 text-blue-700"
                                  : txn.type === "transfer"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-orange-100 text-orange-700"
                              }`}
                            >
                              {txn.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs font-mono">
                            {txn.reference}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(txn.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Cost Center</DialogTitle>
            <DialogDescription>
              Update cost center information.
            </DialogDescription>
          </DialogHeader>
          <CostCenterForm
            formData={formData}
            formErrors={formErrors}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            isEditing
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
            <Button onClick={handleEditCostCenter}>Save Changes</Button>
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
            <AlertDialogTitle>Delete Cost Center</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete{" "}
              <strong>
                {selectedCostCenter?.code} - {selectedCostCenter?.name}
              </strong>
              ? This will remove all transaction history. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCostCenter}
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

// Cost Center Form Component
function CostCenterForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
  isEditing = false,
}: {
  formData: any;
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  isEditing?: boolean;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Cost Center Name *</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="e.g., Finance Operations"
          />
          {formErrors.name && (
            <p className="text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Department *</Label>
          <Select
            value={formData.department}
            onValueChange={(v) => onSelectChange("department", v)}
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
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Cost center description..."
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Manager *</Label>
          <Input
            name="manager"
            value={formData.manager}
            onChange={onInputChange}
            placeholder="Full name"
          />
          {formErrors.manager && (
            <p className="text-sm text-red-500">{formErrors.manager}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Manager Email *</Label>
          <Input
            name="managerEmail"
            type="email"
            value={formData.managerEmail}
            onChange={onInputChange}
            placeholder="manager@company.com"
          />
          {formErrors.managerEmail && (
            <p className="text-sm text-red-500">{formErrors.managerEmail}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Budget Allocated (₦)</Label>
          <Input
            name="budgetAllocated"
            type="number"
            value={formData.budgetAllocated || ""}
            onChange={onInputChange}
            placeholder="50000000"
          />
        </div>
        <div className="space-y-2">
          <Label>Fiscal Year</Label>
          <Select
            value={formData.fiscalYear}
            onValueChange={(v) => onSelectChange("fiscalYear", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FY 2024">FY 2024</SelectItem>
              <SelectItem value="FY 2025">FY 2025</SelectItem>
              <SelectItem value="FY 2026">FY 2026</SelectItem>
              <SelectItem value="FY 2027">FY 2027</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            value={formData.category}
            onValueChange={(v) => onSelectChange("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {costCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formErrors.category && (
            <p className="text-sm text-red-500">{formErrors.category}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status}
            onValueChange={(v) => onSelectChange("status", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="frozen">Frozen</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Notes</Label>
          <Textarea
            name="notes"
            value={formData.notes}
            onChange={onInputChange}
            placeholder="Additional notes..."
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}
