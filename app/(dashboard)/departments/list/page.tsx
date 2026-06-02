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
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
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
  Users,
  Building2,
  User,
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
  TrendingUp,
  TrendingDown,
  Layers,
  Briefcase,
  Target,
  Activity,
  BarChart3,
  PieChart,
  Shield,
  Star,
  GitBranch,
} from "lucide-react";

// Types
interface DepartmentEmployee {
  id: number;
  name: string;
  email: string;
  position: string;
  salary: number;
  status: "active" | "on-leave" | "terminated";
  joinDate: string;
}

interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  head: string;
  headEmail: string;
  headPhone: string;
  parentDepartment?: string;
  budget: number;
  actualSpent: number;
  employeeCount: number;
  employees: DepartmentEmployee[];
  costCenter: string;
  location: string;
  status: "active" | "inactive" | "restructuring";
  createdAt: string;
  objectives?: string;
  subDepartments?: string[];
}

// Initial Data
const initialDepartments: Department[] = [
  {
    id: 1,
    name: "Finance",
    code: "FIN",
    description:
      "Manages company financial operations, accounting, budgeting, and reporting.",
    head: "Jane Manager",
    headEmail: "jane.manager@company.com",
    headPhone: "+234 800 111 2233",
    budget: 50000000,
    actualSpent: 32500000,
    employeeCount: 12,
    employees: [
      {
        id: 1,
        name: "Jane Manager",
        email: "jane.manager@company.com",
        position: "Finance Manager",
        salary: 1200000,
        status: "active",
        joinDate: "2022-03-15",
      },
      {
        id: 2,
        name: "Robert Chen",
        email: "robert.chen@company.com",
        position: "Senior Accountant",
        salary: 850000,
        status: "active",
        joinDate: "2023-01-10",
      },
      {
        id: 3,
        name: "Lisa Wang",
        email: "lisa.wang@company.com",
        position: "Financial Analyst",
        salary: 750000,
        status: "active",
        joinDate: "2023-06-20",
      },
      {
        id: 4,
        name: "David Kim",
        email: "david.kim@company.com",
        position: "Accountant",
        salary: 600000,
        status: "active",
        joinDate: "2024-02-01",
      },
      {
        id: 5,
        name: "Sarah Okafor",
        email: "sarah.okafor@company.com",
        position: "Payroll Specialist",
        salary: 650000,
        status: "on-leave",
        joinDate: "2023-09-15",
      },
    ],
    costCenter: "CC-FIN-001",
    location: "Head Office - 3rd Floor",
    status: "active",
    createdAt: "2020-01-01",
    objectives:
      "Ensure accurate financial reporting, maintain budget compliance, optimize tax strategy.",
    subDepartments: ["Accounting", "Treasury", "Payroll"],
  },
  {
    id: 2,
    name: "Engineering",
    code: "ENG",
    description:
      "Software development, infrastructure, and technical operations.",
    head: "Tech Lead",
    headEmail: "tech.lead@company.com",
    headPhone: "+234 800 222 3344",
    budget: 85000000,
    actualSpent: 42500000,
    employeeCount: 45,
    employees: [
      {
        id: 1,
        name: "Tech Lead",
        email: "tech.lead@company.com",
        position: "Engineering Manager",
        salary: 1500000,
        status: "active",
        joinDate: "2021-06-01",
      },
      {
        id: 2,
        name: "John Doe",
        email: "john.doe@company.com",
        position: "Senior Developer",
        salary: 950000,
        status: "active",
        joinDate: "2022-03-15",
      },
      {
        id: 3,
        name: "Tom Wilson",
        email: "tom.wilson@company.com",
        position: "DevOps Engineer",
        salary: 980000,
        status: "active",
        joinDate: "2022-08-10",
      },
      {
        id: 4,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
        position: "Junior Developer",
        salary: 500000,
        status: "active",
        joinDate: "2024-01-15",
      },
    ],
    costCenter: "CC-ENG-001",
    location: "Head Office - 2nd Floor",
    status: "active",
    createdAt: "2020-01-01",
    objectives:
      "Deliver high-quality software products, maintain system reliability, drive technical innovation.",
    subDepartments: ["Frontend", "Backend", "DevOps", "QA"],
  },
  {
    id: 3,
    name: "Human Resources",
    code: "HR",
    description:
      "Employee management, recruitment, training, and organizational development.",
    head: "HR Director",
    headEmail: "hr.director@company.com",
    headPhone: "+234 800 333 4455",
    budget: 25000000,
    actualSpent: 14500000,
    employeeCount: 8,
    employees: [
      {
        id: 1,
        name: "HR Director",
        email: "hr.director@company.com",
        position: "HR Director",
        salary: 1300000,
        status: "active",
        joinDate: "2021-01-15",
      },
      {
        id: 2,
        name: "Emma Davis",
        email: "emma.davis@company.com",
        position: "HR Specialist",
        salary: 620000,
        status: "active",
        joinDate: "2023-04-10",
      },
      {
        id: 3,
        name: "Mike Roberts",
        email: "mike.roberts@company.com",
        position: "Recruiter",
        salary: 580000,
        status: "active",
        joinDate: "2023-07-20",
      },
    ],
    costCenter: "CC-HR-001",
    location: "Head Office - 4th Floor",
    status: "active",
    createdAt: "2020-01-01",
    objectives:
      "Attract top talent, foster positive work culture, ensure compliance with labor laws.",
    subDepartments: ["Recruitment", "Training", "Compensation & Benefits"],
  },
  {
    id: 4,
    name: "Sales",
    code: "SAL",
    description:
      "Revenue generation, client acquisition, and relationship management.",
    head: "Sales Manager",
    headEmail: "sales.manager@company.com",
    headPhone: "+234 800 444 5566",
    budget: 35000000,
    actualSpent: 32000000,
    employeeCount: 20,
    employees: [
      {
        id: 1,
        name: "Sales Manager",
        email: "sales.manager@company.com",
        position: "Sales Manager",
        salary: 1100000,
        status: "active",
        joinDate: "2021-03-01",
      },
      {
        id: 2,
        name: "Bob King",
        email: "bob.king@company.com",
        position: "Sales Representative",
        salary: 650000,
        status: "active",
        joinDate: "2023-01-10",
      },
    ],
    costCenter: "CC-SAL-001",
    location: "Head Office - 1st Floor",
    status: "active",
    createdAt: "2020-01-01",
    objectives:
      "Achieve quarterly sales targets, expand customer base, improve client retention.",
    subDepartments: ["B2B Sales", "B2C Sales", "Account Management"],
  },
  {
    id: 5,
    name: "Operations",
    code: "OPS",
    description:
      "Day-to-day business operations, logistics, and process optimization.",
    head: "Ops Director",
    headEmail: "ops.director@company.com",
    headPhone: "+234 800 555 6677",
    budget: 30000000,
    actualSpent: 18000000,
    employeeCount: 15,
    employees: [
      {
        id: 1,
        name: "Ops Director",
        email: "ops.director@company.com",
        position: "Operations Director",
        salary: 1400000,
        status: "active",
        joinDate: "2020-06-01",
      },
    ],
    costCenter: "CC-OPS-001",
    location: "Head Office - Ground Floor",
    status: "active",
    createdAt: "2020-06-01",
    objectives:
      "Streamline operations, reduce costs, improve service delivery.",
    subDepartments: ["Logistics", "Facility Management", "Procurement"],
  },
  {
    id: 6,
    name: "Administration",
    code: "ADM",
    description:
      "Office administration, support services, and executive assistance.",
    head: "Admin Manager",
    headEmail: "admin.manager@company.com",
    headPhone: "+234 800 666 7788",
    budget: 15000000,
    actualSpent: 9000000,
    employeeCount: 6,
    employees: [
      {
        id: 1,
        name: "Admin Manager",
        email: "admin.manager@company.com",
        position: "Admin Manager",
        salary: 800000,
        status: "active",
        joinDate: "2021-09-01",
      },
    ],
    costCenter: "CC-ADM-001",
    location: "Head Office - 3rd Floor",
    status: "active",
    createdAt: "2021-09-01",
    objectives:
      "Provide efficient administrative support, manage office resources, coordinate executive activities.",
    subDepartments: ["Front Desk", "Executive Support"],
  },
  {
    id: 7,
    name: "Marketing",
    code: "MKT",
    description: "Brand management, digital marketing, and market research.",
    head: "Marketing Director",
    headEmail: "marketing.director@company.com",
    headPhone: "+234 800 777 8899",
    budget: 45000000,
    actualSpent: 38000000,
    employeeCount: 14,
    employees: [
      {
        id: 1,
        name: "Marketing Director",
        email: "marketing.director@company.com",
        position: "Marketing Director",
        salary: 1350000,
        status: "active",
        joinDate: "2021-04-15",
      },
      {
        id: 2,
        name: "Emma Wilson",
        email: "emma.wilson@company.com",
        position: "Marketing Manager",
        salary: 950000,
        status: "active",
        joinDate: "2022-05-20",
      },
    ],
    costCenter: "CC-MKT-001",
    location: "Head Office - 4th Floor",
    status: "active",
    createdAt: "2021-04-15",
    objectives:
      "Increase brand awareness, generate qualified leads, improve customer engagement.",
    subDepartments: ["Digital Marketing", "Content", "Brand Management"],
  },
  {
    id: 8,
    name: "IT",
    code: "IT",
    description:
      "Information technology infrastructure, security, and support services.",
    head: "IT Manager",
    headEmail: "it.manager@company.com",
    headPhone: "+234 800 888 9900",
    budget: 55000000,
    actualSpent: 31000000,
    employeeCount: 18,
    employees: [
      {
        id: 1,
        name: "IT Manager",
        email: "it.manager@company.com",
        position: "IT Manager",
        salary: 1400000,
        status: "active",
        joinDate: "2020-08-01",
      },
      {
        id: 2,
        name: "Tom Harris",
        email: "tom.harris@company.com",
        position: "System Administrator",
        salary: 850000,
        status: "active",
        joinDate: "2022-11-15",
      },
    ],
    costCenter: "CC-IT-001",
    location: "Head Office - 2nd Floor",
    status: "active",
    createdAt: "2020-08-01",
    objectives:
      "Maintain IT infrastructure, ensure cybersecurity, provide technical support.",
    subDepartments: ["Infrastructure", "Security", "Help Desk"],
  },
];

export default function AllDepartmentsPage() {
  // State
  const [departments, setDepartments] =
    useState<Department[]>(initialDepartments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Department;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    head: "",
    headEmail: "",
    headPhone: "",
    parentDepartment: "",
    budget: 0,
    location: "",
    status: "active" as Department["status"],
    objectives: "",
    subDepartments: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalDepartments = departments.length;
    const activeDepartments = departments.filter(
      (d) => d.status === "active",
    ).length;
    const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
    const totalSpent = departments.reduce((sum, d) => sum + d.actualSpent, 0);
    const totalEmployees = departments.reduce(
      (sum, d) => sum + d.employeeCount,
      0,
    );
    const avgBudgetUtilization =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalDepartments,
      activeDepartments,
      totalBudget,
      totalSpent,
      totalEmployees,
      avgBudgetUtilization,
    };
  }, [departments]);

  // Filter and sort
  const filteredDepartments = useMemo(() => {
    let result = [...departments];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.code.toLowerCase().includes(query) ||
          d.head.toLowerCase().includes(query) ||
          d.headEmail.toLowerCase().includes(query) ||
          d.costCenter.toLowerCase().includes(query) ||
          d.location.toLowerCase().includes(query) ||
          (d.description && d.description.toLowerCase().includes(query)),
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((d) => d.status === statusFilter);
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
  }, [departments, searchQuery, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof Department) => {
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
      [name]: name === "budget" ? parseFloat(value) || 0 : value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const generateDepartmentCode = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 4);
  };

  const generateCostCenter = (code: string) => {
    const count = departments.filter((d) => d.code.startsWith(code)).length + 1;
    return `CC-${code}-${String(count).padStart(3, "0")}`;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Department name is required";
    if (!formData.head.trim()) errors.head = "Department head is required";
    if (!formData.headEmail.trim()) {
      errors.headEmail = "Head email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.headEmail)) {
      errors.headEmail = "Invalid email format";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddDepartment = () => {
    if (!validateForm()) return;

    const code = formData.code || generateDepartmentCode(formData.name);
    const costCenter = generateCostCenter(code);

    const newDepartment: Department = {
      id: Math.max(...departments.map((d) => d.id), 0) + 1,
      name: formData.name,
      code,
      description: formData.description,
      head: formData.head,
      headEmail: formData.headEmail,
      headPhone: formData.headPhone,
      parentDepartment: formData.parentDepartment || undefined,
      budget: formData.budget,
      actualSpent: 0,
      employeeCount: 0,
      employees: [],
      costCenter,
      location: formData.location,
      status: formData.status,
      createdAt: new Date().toISOString().split("T")[0],
      objectives: formData.objectives || undefined,
      subDepartments: formData.subDepartments
        ? formData.subDepartments
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    };

    setDepartments((prev) => [newDepartment, ...prev]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditDepartment = () => {
    if (!validateForm() || !selectedDepartment) return;

    setDepartments((prev) =>
      prev.map((d) =>
        d.id === selectedDepartment.id
          ? {
              ...d,
              name: formData.name,
              code: formData.code,
              description: formData.description,
              head: formData.head,
              headEmail: formData.headEmail,
              headPhone: formData.headPhone,
              parentDepartment: formData.parentDepartment || undefined,
              budget: formData.budget,
              location: formData.location,
              status: formData.status,
              objectives: formData.objectives || undefined,
              subDepartments: formData.subDepartments
                ? formData.subDepartments
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                : undefined,
            }
          : d,
      ),
    );

    resetForm();
    setIsEditModalOpen(false);
    setSelectedDepartment(null);
  };

  const handleDeleteDepartment = () => {
    if (!selectedDepartment) return;
    setDepartments((prev) =>
      prev.filter((d) => d.id !== selectedDepartment.id),
    );
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  const openEditModal = (department: Department) => {
    setSelectedDepartment(department);
    setFormData({
      name: department.name,
      code: department.code,
      description: department.description,
      head: department.head,
      headEmail: department.headEmail,
      headPhone: department.headPhone,
      parentDepartment: department.parentDepartment || "",
      budget: department.budget,
      location: department.location,
      status: department.status,
      objectives: department.objectives || "",
      subDepartments: department.subDepartments?.join(", ") || "",
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (department: Department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      head: "",
      headEmail: "",
      headPhone: "",
      parentDepartment: "",
      budget: 0,
      location: "",
      status: "active",
      objectives: "",
      subDepartments: "",
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

  const getStatusBadge = (status: Department["status"]) => {
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
      case "restructuring":
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <Activity className="h-3 w-3 mr-1" />
            Restructuring
          </Badge>
        );
      default:
        return null;
    }
  };

  const getEmployeeStatusBadge = (status: DepartmentEmployee["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
        );
      case "on-leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 text-xs">
            On Leave
          </Badge>
        );
      case "terminated":
        return (
          <Badge className="bg-red-100 text-red-700 text-xs">Terminated</Badge>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getBudgetUtilization = (spent: number, budget: number) => {
    return budget > 0 ? Math.round((spent / budget) * 100) : 0;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            All Departments
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage company departments, heads, and budgets
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new department with head, budget, and location details.
              </DialogDescription>
            </DialogHeader>
            <DepartmentForm
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onSelectChange={handleSelectChange}
              departments={departments}
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
              <Button onClick={handleAddDepartment}>Create Department</Button>
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
                <p className="text-sm text-muted-foreground">
                  Total Departments
                </p>
                <p className="text-2xl font-bold">{stats.totalDepartments}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.activeDepartments} active
                </p>
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
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalBudget)}
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
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Budget Utilized</p>
                <p className="text-2xl font-bold">
                  {stats.avgBudgetUtilization.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <Progress value={stats.avgBudgetUtilization} className="h-2 mt-3" />
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
                placeholder="Search by name, code, head, cost center..."
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="restructuring">Restructuring</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" title="Export">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Departments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Departments</CardTitle>
          <CardDescription>
            {filteredDepartments.length} department
            {filteredDepartments.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("name")}
                    >
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("budget")}
                    >
                      Budget
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("employeeCount")}
                    >
                      Employees
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Cost Center</TableHead>
                  <TableHead>Budget Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDepartments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No departments found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDepartments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{dept.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {dept.code}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                              {getInitials(dept.head)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{dept.head}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(dept.budget)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{dept.employeeCount}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs">
                          {dept.costCenter}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-[100px] space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>
                              {getBudgetUtilization(
                                dept.actualSpent,
                                dept.budget,
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={getBudgetUtilization(
                              dept.actualSpent,
                              dept.budget,
                            )}
                            className="h-2"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(dept.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewModal(dept)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
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
                                onClick={() => openViewModal(dept)}
                              >
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => openEditModal(dept)}
                              >
                                <Pencil className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setSelectedDepartment(dept);
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredDepartments.length > 0 && (
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
                    filteredDepartments.length,
                  )}{" "}
                  of {filteredDepartments.length}
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

      {/* View Department Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedDepartment?.name}</DialogTitle>
            <DialogDescription>
              {selectedDepartment?.code} - {selectedDepartment?.costCenter}
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">
                      {selectedDepartment.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedDepartment.description}
                    </p>
                  </div>
                </div>
                {getStatusBadge(selectedDepartment.status)}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    Department Head
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700">
                        {getInitials(selectedDepartment.head)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedDepartment.head}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedDepartment.headEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {selectedDepartment.headPhone}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    Budget Overview
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Budget:</span>
                      <span className="font-bold">
                        {formatCurrency(selectedDepartment.budget)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Spent:</span>
                      <span className="font-bold">
                        {formatCurrency(selectedDepartment.actualSpent)}
                      </span>
                    </div>
                    <Progress
                      value={getBudgetUtilization(
                        selectedDepartment.actualSpent,
                        selectedDepartment.budget,
                      )}
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {getBudgetUtilization(
                          selectedDepartment.actualSpent,
                          selectedDepartment.budget,
                        )}
                        % utilized
                      </span>
                      <span>
                        {formatCurrency(
                          selectedDepartment.budget -
                            selectedDepartment.actualSpent,
                        )}{" "}
                        remaining
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedDepartment.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {formatDate(selectedDepartment.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Parent Department
                  </p>
                  <p className="font-medium">
                    {selectedDepartment.parentDepartment || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employees</p>
                  <p className="font-medium">
                    {selectedDepartment.employeeCount}
                  </p>
                </div>
              </div>

              {selectedDepartment.subDepartments &&
                selectedDepartment.subDepartments.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Sub-Departments</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDepartment.subDepartments.map((sub, i) => (
                        <Badge key={i} variant="secondary">
                          {sub}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {selectedDepartment.objectives && (
                <div>
                  <p className="font-medium mb-2">Objectives</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedDepartment.objectives}
                  </p>
                </div>
              )}

              {/* Employees List */}
              {selectedDepartment.employees.length > 0 && (
                <div>
                  <p className="font-medium mb-3">
                    Employees ({selectedDepartment.employees.length})
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDepartment.employees.map((emp) => (
                        <TableRow key={emp.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs">
                                  {getInitials(emp.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {emp.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {emp.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">
                            {emp.position}
                          </TableCell>
                          <TableCell className="text-sm font-medium">
                            {formatCurrency(emp.salary)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(emp.joinDate)}
                          </TableCell>
                          <TableCell>
                            {getEmployeeStatusBadge(emp.status)}
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
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department information.
            </DialogDescription>
          </DialogHeader>
          <DepartmentForm
            formData={formData}
            formErrors={formErrors}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
            departments={departments}
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
            <Button onClick={handleEditDepartment}>Save Changes</Button>
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
            <AlertDialogTitle>Delete Department</AlertDialogTitle>
            <AlertDialogDescription>
              Permanently delete <strong>{selectedDepartment?.name}</strong>{" "}
              department? This will also remove all associated data. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteDepartment}
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

// Department Form Component
function DepartmentForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
  departments,
  isEditing = false,
}: {
  formData: any;
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
  departments: Department[];
  isEditing?: boolean;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Department Name *</Label>
          <Input
            name="name"
            value={formData.name}
            onChange={onInputChange}
            placeholder="e.g., Finance"
          />
          {formErrors.name && (
            <p className="text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Department Code</Label>
          <Input
            name="code"
            value={formData.code}
            onChange={onInputChange}
            placeholder="Auto-generated if empty"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            placeholder="Department description..."
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label>Department Head *</Label>
          <Input
            name="head"
            value={formData.head}
            onChange={onInputChange}
            placeholder="Full name"
          />
          {formErrors.head && (
            <p className="text-sm text-red-500">{formErrors.head}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Head Email *</Label>
          <Input
            name="headEmail"
            type="email"
            value={formData.headEmail}
            onChange={onInputChange}
            placeholder="head@company.com"
          />
          {formErrors.headEmail && (
            <p className="text-sm text-red-500">{formErrors.headEmail}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label>Head Phone</Label>
          <Input
            name="headPhone"
            value={formData.headPhone}
            onChange={onInputChange}
            placeholder="+234 800 000 0000"
          />
        </div>
        <div className="space-y-2">
          <Label>Parent Department</Label>
          <Select
            value={formData.parentDepartment}
            onValueChange={(v) => onSelectChange("parentDepartment", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="None (top-level)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (top-level)</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={d.name}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Annual Budget (₦)</Label>
          <Input
            name="budget"
            type="number"
            value={formData.budget || ""}
            onChange={onInputChange}
            placeholder="50000000"
          />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input
            name="location"
            value={formData.location}
            onChange={onInputChange}
            placeholder="Head Office - 3rd Floor"
          />
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
              <SelectItem value="restructuring">Restructuring</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Objectives</Label>
          <Textarea
            name="objectives"
            value={formData.objectives}
            onChange={onInputChange}
            placeholder="Department objectives and goals..."
            rows={2}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Sub-Departments</Label>
          <Input
            name="subDepartments"
            value={formData.subDepartments}
            onChange={onInputChange}
            placeholder="Comma-separated, e.g., Accounting, Treasury, Payroll"
          />
          <p className="text-xs text-muted-foreground">
            Separate multiple sub-departments with commas
          </p>
        </div>
      </div>
    </div>
  );
}
