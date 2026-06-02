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
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Briefcase,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Filter,
  Download,
  Users,
  UserPlus,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";

// Types
interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  salary: number;
  startDate: string;
  status: "active" | "on-leave" | "terminated";
  address: string;
  avatar?: string;
}

// Initial Data
const initialEmployees: Employee[] = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    position: "Senior Developer",
    salary: 95000,
    startDate: "2022-03-15",
    status: "active",
    address: "123 Main St, New York, NY 10001",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    phone: "+1 (555) 234-5678",
    department: "Design",
    position: "UX Designer",
    salary: 85000,
    startDate: "2022-06-01",
    status: "active",
    address: "456 Oak Ave, Los Angeles, CA 90001",
  },
  {
    id: 3,
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@company.com",
    phone: "+1 (555) 345-6789",
    department: "Marketing",
    position: "Marketing Manager",
    salary: 78000,
    startDate: "2021-11-20",
    status: "on-leave",
    address: "789 Pine Rd, Chicago, IL 60601",
  },
  {
    id: 4,
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@company.com",
    phone: "+1 (555) 456-7890",
    department: "Sales",
    position: "Sales Representative",
    salary: 65000,
    startDate: "2023-01-10",
    status: "active",
    address: "321 Elm St, Houston, TX 77001",
  },
  {
    id: 5,
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    phone: "+1 (555) 567-8901",
    department: "Engineering",
    position: "Junior Developer",
    salary: 70000,
    startDate: "2023-04-05",
    status: "active",
    address: "654 Maple Dr, Phoenix, AZ 85001",
  },
  {
    id: 6,
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@company.com",
    phone: "+1 (555) 678-9012",
    department: "HR",
    position: "HR Specialist",
    salary: 62000,
    startDate: "2022-09-12",
    status: "terminated",
    address: "987 Cedar Ln, Philadelphia, PA 19101",
  },
  {
    id: 7,
    firstName: "Robert",
    lastName: "Taylor",
    email: "robert.taylor@company.com",
    phone: "+1 (555) 789-0123",
    department: "Finance",
    position: "Financial Analyst",
    salary: 82000,
    startDate: "2022-07-18",
    status: "active",
    address: "147 Birch St, San Antonio, TX 78201",
  },
  {
    id: 8,
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@company.com",
    phone: "+1 (555) 890-1234",
    department: "Engineering",
    position: "DevOps Engineer",
    salary: 98000,
    startDate: "2021-05-30",
    status: "active",
    address: "258 Walnut Ave, San Diego, CA 92101",
  },
];

const departments = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Legal",
];

const positions = [
  "Senior Developer",
  "Junior Developer",
  "DevOps Engineer",
  "UX Designer",
  "Marketing Manager",
  "Sales Representative",
  "HR Specialist",
  "Financial Analyst",
  "Project Manager",
  "Team Lead",
];

export default function EmployeesPage() {
  // State
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Employee;
    direction: "asc" | "desc";
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<Employee>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: 0,
    startDate: "",
    status: "active",
    address: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Statistics
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(
      (e) => e.status === "active",
    ).length;
    const onLeaveEmployees = employees.filter(
      (e) => e.status === "on-leave",
    ).length;
    const totalSalary = employees.reduce((sum, e) => sum + e.salary, 0);
    const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
    const departments = [...new Set(employees.map((e) => e.department))].length;

    return {
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      totalSalary,
      averageSalary,
      departments,
    };
  }, [employees]);

  // Filter and sort
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (emp) =>
          emp.firstName.toLowerCase().includes(query) ||
          emp.lastName.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query) ||
          emp.position.toLowerCase().includes(query),
      );
    }

    // Department filter
    if (departmentFilter !== "all") {
      result = result.filter((emp) => emp.department === departmentFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((emp) => emp.status === statusFilter);
    }

    // Sort
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
  }, [employees, searchQuery, departmentFilter, statusFilter, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Handlers
  const handleSort = (key: keyof Employee) => {
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
      [name]: name === "salary" ? parseFloat(value) || 0 : value,
    }));
    // Clear error for this field
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.firstName?.trim())
      errors.firstName = "First name is required";
    if (!formData.lastName?.trim()) errors.lastName = "Last name is required";
    if (!formData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone?.trim()) errors.phone = "Phone is required";
    if (!formData.department) errors.department = "Department is required";
    if (!formData.position) errors.position = "Position is required";
    if (!formData.salary || formData.salary <= 0)
      errors.salary = "Valid salary is required";
    if (!formData.startDate) errors.startDate = "Start date is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEmployee = () => {
    if (!validateForm()) return;

    const newEmployee: Employee = {
      id: Math.max(...employees.map((e) => e.id)) + 1,
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      email: formData.email!,
      phone: formData.phone!,
      department: formData.department!,
      position: formData.position!,
      salary: formData.salary!,
      startDate: formData.startDate!,
      status: formData.status as Employee["status"],
      address: formData.address || "",
    };

    setEmployees((prev) => [...prev, newEmployee]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEditEmployee = () => {
    if (!validateForm() || !selectedEmployee) return;

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id
          ? { ...emp, ...formData, salary: formData.salary! }
          : emp,
      ),
    );

    resetForm();
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;

    setEmployees((prev) =>
      prev.filter((emp) => emp.id !== selectedEmployee.id),
    );
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  };

  const openEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      salary: employee.salary,
      startDate: employee.startDate,
      status: employee.status,
      address: employee.address,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      salary: 0,
      startDate: "",
      status: "active",
      address: "",
    });
    setFormErrors({});
  };

  const getStatusBadge = (status: Employee["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
            Active
          </Badge>
        );
      case "on-leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
            On Leave
          </Badge>
        );
      case "terminated":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
            Terminated
          </Badge>
        );
      default:
        return null;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Employees
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage employee records and compensation
          </p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill in the employee details below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm
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
              <Button onClick={handleAddEmployee}>Save Employee</Button>
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
                <p className="text-sm text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">{stats.totalEmployees}</p>
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
                <p className="text-sm text-muted-foreground">Active Now</p>
                <p className="text-2xl font-bold">{stats.activeEmployees}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{stats.departments}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Salary</p>
                <p className="text-2xl font-bold">
                  {formatSalary(stats.averageSalary)}
                </p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <DollarSign className="h-5 w-5 text-orange-600" />
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
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={departmentFilter}
              onValueChange={(value) => {
                setDepartmentFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" title="Export">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Records</CardTitle>
          <CardDescription>
            {filteredEmployees.length} employee
            {filteredEmployees.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("department")}
                    >
                      Department
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("position")}
                    >
                      Position
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("salary")}
                    >
                      Salary
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort("startDate")}
                    >
                      Start Date
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground/30" />
                        <p className="text-muted-foreground">
                          No employees found
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {getInitials(
                                employee.firstName,
                                employee.lastName,
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {employee.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{employee.department}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {employee.position}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {employee.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatSalary(employee.salary)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(employee.startDate)}
                      </TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => openEditModal(employee)}
                            >
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => openDeleteDialog(employee)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filteredEmployees.length > 0 && (
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
                    filteredEmployees.length,
                  )}{" "}
                  of {filteredEmployees.length}
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

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
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
                setIsEditModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleEditEmployee}>Update Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the employee record for{" "}
              <strong>
                {selectedEmployee?.firstName} {selectedEmployee?.lastName}
              </strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteEmployee}
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

// Employee Form Component
function EmployeeForm({
  formData,
  formErrors,
  onInputChange,
  onSelectChange,
}: {
  formData: Partial<Employee>;
  formErrors: Record<string, string>;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onSelectChange: (name: string, value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formData.firstName || ""}
          onChange={onInputChange}
          placeholder="John"
        />
        {formErrors.firstName && (
          <p className="text-sm text-red-500">{formErrors.firstName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formData.lastName || ""}
          onChange={onInputChange}
          placeholder="Doe"
        />
        {formErrors.lastName && (
          <p className="text-sm text-red-500">{formErrors.lastName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={onInputChange}
          placeholder="john.doe@company.com"
        />
        {formErrors.email && (
          <p className="text-sm text-red-500">{formErrors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone *</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone || ""}
          onChange={onInputChange}
          placeholder="+1 (555) 123-4567"
        />
        {formErrors.phone && (
          <p className="text-sm text-red-500">{formErrors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department *</Label>
        <Select
          value={formData.department || ""}
          onValueChange={(value) => onSelectChange("department", value)}
        >
          <SelectTrigger id="department">
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
        <Label htmlFor="position">Position *</Label>
        <Select
          value={formData.position || ""}
          onValueChange={(value) => onSelectChange("position", value)}
        >
          <SelectTrigger id="position">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formErrors.position && (
          <p className="text-sm text-red-500">{formErrors.position}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary">Salary *</Label>
        <Input
          id="salary"
          name="salary"
          type="number"
          value={formData.salary || ""}
          onChange={onInputChange}
          placeholder="50000"
        />
        {formErrors.salary && (
          <p className="text-sm text-red-500">{formErrors.salary}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date *</Label>
        <Input
          id="startDate"
          name="startDate"
          type="date"
          value={formData.startDate || ""}
          onChange={onInputChange}
        />
        {formErrors.startDate && (
          <p className="text-sm text-red-500">{formErrors.startDate}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status || "active"}
          onValueChange={(value) => onSelectChange("status", value)}
        >
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on-leave">On Leave</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address || ""}
          onChange={onInputChange}
          placeholder="123 Main St, City, State ZIP"
          rows={2}
        />
      </div>
    </div>
  );
}
