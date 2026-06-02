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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  Users,
  Building2,
  Save,
  Download,
  Key,
  Lock,
  Unlock,
  Settings,
  UserPlus,
  UserCheck,
  UserX,
  AlertCircle,
  Clock,
  ArrowUpDown,
  Filter,
  Activity,
  Layers,
  CheckCheck,
} from "lucide-react";

// Types
type RoleValue =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "FINANCE_MANAGER"
  | "ACCOUNTANT_PAYABLE"
  | "ACCOUNTANT_RECEIVABLE"
  | "PAYROLL_OFFICER"
  | "BUDGET_ANALYST"
  | "DEPARTMENT_HEAD"
  | "AUDITOR"
  | "TAX_SPECIALIST"
  | "EMPLOYEE";

type ModulePermission =
  | "none"
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "approve"
  | "full";

interface Permission {
  module: string;
  permissions: ModulePermission;
}

interface Role {
  value: RoleValue;
  label: string;
  description: string;
  level: number;
  color: string;
  permissions: Permission[];
  userCount: number;
}

interface Employee {
  name: string;
  email: string;
  department: string;
  role: RoleValue;
  status: "active" | "inactive";
  lastActive?: string;
}

const modules = [
  "Dashboard",
  "Employees",
  "Payroll",
  "Expense Reports",
  "Reimbursements",
  "Employee Loans",
  "Budget",
  "Departments",
  "Cost Centers",
  "Approvals",
  "Sales Invoices",
  "Purchase Invoices",
  "Payslips",
  "Reports",
  "Tax Reports",
  "Audit Trail",
  "Roles & Permissions",
  "Settings",
];

const roleDefinitions: Role[] = [
  {
    value: "SUPER_ADMIN",
    label: "Super Admin",
    description:
      "Full system access with all permissions. Can manage users, roles, and system settings.",
    level: 10,
    color: "#DC2626",
    userCount: 1,
    permissions: modules.map((m) => ({
      module: m,
      permissions: "full" as ModulePermission,
    })),
  },
  {
    value: "ADMIN",
    label: "Admin",
    description:
      "Administrative access to most modules. Can manage employees and approve transactions.",
    level: 9,
    color: "#EA580C",
    userCount: 1,
    permissions: modules.map((m) => {
      if (["Roles & Permissions", "Settings"].includes(m))
        return { module: m, permissions: "view" as ModulePermission };
      if (["Audit Trail"].includes(m))
        return { module: m, permissions: "view" as ModulePermission };
      return { module: m, permissions: "full" as ModulePermission };
    }),
  },
  {
    value: "FINANCE_MANAGER",
    label: "Finance Manager",
    description:
      "Oversees all financial operations. Can approve budgets, expenses, and loans.",
    level: 8,
    color: "#2563EB",
    userCount: 1,
    permissions: modules.map((m) => {
      if (
        [
          "Dashboard",
          "Employees",
          "Payroll",
          "Expense Reports",
          "Reimbursements",
          "Employee Loans",
          "Budget",
          "Cost Centers",
          "Approvals",
          "Sales Invoices",
          "Purchase Invoices",
          "Payslips",
          "Reports",
          "Tax Reports",
          "Audit Trail",
        ].includes(m)
      ) {
        return { module: m, permissions: "approve" as ModulePermission };
      }
      if (["Departments"].includes(m))
        return { module: m, permissions: "view" as ModulePermission };
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
  {
    value: "ACCOUNTANT_PAYABLE",
    label: "Accountant (AP)",
    description:
      "Manages accounts payable, vendor invoices, and purchase-related expenses.",
    level: 6,
    color: "#7C3AED",
    userCount: 1,
    permissions: modules.map((m) => {
      if (
        [
          "Dashboard",
          "Purchase Invoices",
          "Cost Centers",
          "Reports",
          "Tax Reports",
        ].includes(m)
      ) {
        return { module: m, permissions: "edit" as ModulePermission };
      }
      if (["Expense Reports", "Reimbursements", "Payslips"].includes(m)) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
  {
    value: "ACCOUNTANT_RECEIVABLE",
    label: "Accountant (AR)",
    description:
      "Manages accounts receivable, customer invoices, and collections.",
    level: 6,
    color: "#0891B2",
    userCount: 1,
    permissions: modules.map((m) => {
      if (["Dashboard", "Sales Invoices", "Reports"].includes(m)) {
        return { module: m, permissions: "edit" as ModulePermission };
      }
      if (["Cost Centers", "Tax Reports"].includes(m)) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
  {
    value: "PAYROLL_OFFICER",
    label: "Payroll Officer",
    description:
      "Processes payroll, manages payslips, and handles employee compensation.",
    level: 6,
    color: "#059669",
    userCount: 1,
    permissions: modules.map((m) => {
      if (["Dashboard", "Payroll", "Payslips", "Employees"].includes(m)) {
        return { module: m, permissions: "edit" as ModulePermission };
      }
      if (["Reports", "Tax Reports", "Employee Loans"].includes(m)) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
  {
    value: "BUDGET_ANALYST",
    label: "Budget Analyst",
    description:
      "Creates and monitors budgets, analyzes variances, and forecasts expenses.",
    level: 5,
    color: "#D97706",
    userCount: 0,
    permissions: modules.map((m) => {
      if (["Dashboard", "Budget", "Cost Centers", "Reports"].includes(m)) {
        return { module: m, permissions: "edit" as ModulePermission };
      }
      if (["Departments", "Expense Reports"].includes(m)) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
  {
    value: "DEPARTMENT_HEAD",
    label: "Department Head",
    description:
      "Manages department employees, approves expenses, and monitors budget.",
    level: 7,
    color: "#DB2777",
    userCount: 1,
    permissions: modules.map((m) => {
      if (
        [
          "Dashboard",
          "Employees",
          "Expense Reports",
          "Reimbursements",
          "Approvals",
        ].includes(m)
      ) {
        return { module: m, permissions: "approve" as ModulePermission };
      }
      if (["Budget", "Cost Centers", "Reports", "Payslips"].includes(m)) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
  {
    value: "AUDITOR",
    label: "Auditor",
    description:
      "Reviews financial records, audit trails, and compliance reports.",
    level: 4,
    color: "#4F46E5",
    userCount: 0,
    permissions: modules.map((m) => {
      if (["Audit Trail", "Reports", "Tax Reports", "Dashboard"].includes(m)) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      if (
        [
          "Payroll",
          "Expense Reports",
          "Sales Invoices",
          "Purchase Invoices",
          "Budget",
        ].includes(m)
      ) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
  {
    value: "TAX_SPECIALIST",
    label: "Tax Specialist",
    description:
      "Manages tax filings, PAYE, VAT, and withholding tax calculations.",
    level: 5,
    color: "#9333EA",
    userCount: 0,
    permissions: modules.map((m) => {
      if (["Tax Reports", "Payroll", "Reports", "Dashboard"].includes(m)) {
        return { module: m, permissions: "edit" as ModulePermission };
      }
      if (["Employees", "Payslips"].includes(m)) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
  {
    value: "EMPLOYEE",
    label: "Employee",
    description:
      "Basic access to submit expenses, view payslips, and manage personal information.",
    level: 1,
    color: "#6B7280",
    userCount: 2,
    permissions: modules.map((m) => {
      if (["Dashboard", "Payslips"].includes(m)) {
        return { module: m, permissions: "view" as ModulePermission };
      }
      if (["Expense Reports", "Reimbursements"].includes(m)) {
        return { module: m, permissions: "create" as ModulePermission };
      }
      return { module: m, permissions: "none" as ModulePermission };
    }),
  },
];

const initialEmployees: Employee[] = [
  {
    name: "Jane Manager",
    email: "jane@acmecorp.com",
    department: "Finance",
    role: "FINANCE_MANAGER",
    status: "active",
    lastActive: "2026-06-02T14:30:00",
  },
  {
    name: "Paul Roller",
    email: "payroll@acmecorp.com",
    department: "Finance",
    role: "PAYROLL_OFFICER",
    status: "active",
    lastActive: "2026-06-02T11:00:00",
  },
  {
    name: "John Doe",
    email: "john@acmecorp.com",
    department: "Engineering",
    role: "EMPLOYEE",
    status: "active",
    lastActive: "2026-06-02T09:15:00",
  },
  {
    name: "Alice Lee",
    email: "alice@acmecorp.com",
    department: "Finance",
    role: "ACCOUNTANT_PAYABLE",
    status: "active",
    lastActive: "2026-06-01T16:45:00",
  },
  {
    name: "Bob King",
    email: "bob@acmecorp.com",
    department: "Sales",
    role: "EMPLOYEE",
    status: "active",
    lastActive: "2026-06-01T10:00:00",
  },
  {
    name: "Sarah Connor",
    email: "sarah@acmecorp.com",
    department: "HR",
    role: "DEPARTMENT_HEAD",
    status: "active",
    lastActive: "2026-05-31T15:30:00",
  },
  {
    name: "Admin User",
    email: "admin@acmecorp.com",
    department: "IT",
    role: "ADMIN",
    status: "active",
    lastActive: "2026-06-02T14:55:00",
  },
  {
    name: "Super Admin",
    email: "superadmin@acmecorp.com",
    department: "IT",
    role: "SUPER_ADMIN",
    status: "active",
    lastActive: "2026-06-02T08:00:00",
  },
];

const departments = [
  "Finance",
  "Engineering",
  "Sales",
  "HR",
  "IT",
  "Marketing",
  "Operations",
  "Administration",
];

const permissionColors: Record<ModulePermission, string> = {
  none: "bg-gray-100 text-gray-600",
  view: "bg-blue-100 text-blue-700",
  create: "bg-green-100 text-green-700",
  edit: "bg-yellow-100 text-yellow-700",
  delete: "bg-red-100 text-red-700",
  approve: "bg-purple-100 text-purple-700",
  full: "bg-emerald-100 text-emerald-700",
};

const permissionLabels: Record<ModulePermission, string> = {
  none: "None",
  view: "View",
  create: "Create",
  edit: "Edit",
  delete: "Delete",
  approve: "Approve",
  full: "Full Access",
};

export default function RolesPermissionsPage() {
  // State
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isViewRoleOpen, setIsViewRoleOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
  const [bulkRole, setBulkRole] = useState<RoleValue>("EMPLOYEE");
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("users");
  const [compareRole1, setCompareRole1] =
    useState<RoleValue>("FINANCE_MANAGER");
  const [compareRole2, setCompareRole2] =
    useState<RoleValue>("ACCOUNTANT_PAYABLE");
  const [changedRoles, setChangedRoles] = useState<Set<number>>(new Set());

  // Statistics
  const stats = useMemo(() => {
    const roleCounts: Record<string, number> = {};
    employees.forEach((emp) => {
      roleCounts[emp.role] = (roleCounts[emp.role] || 0) + 1;
    });

    const uniqueDepartments = [...new Set(employees.map((e) => e.department))]
      .length;

    return {
      totalUsers: employees.length,
      activeUsers: employees.filter((e) => e.status === "active").length,
      departments: uniqueDepartments,
      rolesAvailable: roleDefinitions.length,
      roleCounts,
    };
  }, [employees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    let result = [...employees];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.email.toLowerCase().includes(query) ||
          e.department.toLowerCase().includes(query),
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((e) => e.role === roleFilter);
    }

    if (departmentFilter !== "all") {
      result = result.filter((e) => e.department === departmentFilter);
    }

    return result;
  }, [employees, searchQuery, roleFilter, departmentFilter]);

  // Handlers
  const handleRoleChange = (index: number, newRole: RoleValue) => {
    const globalIndex = employees.findIndex(
      (e) => e.email === filteredEmployees[index].email,
    );
    if (globalIndex === -1) return;

    const updated = [...employees];
    updated[globalIndex] = { ...updated[globalIndex], role: newRole };
    setEmployees(updated);

    const newChanged = new Set(changedRoles);
    newChanged.add(globalIndex);
    setChangedRoles(newChanged);
  };

  const handleSave = () => {
    setChangedRoles(new Set());
    setIsSaveDialogOpen(false);
  };

  const handleBulkAssign = () => {
    const updated = [...employees];
    selectedEmployees.forEach((index) => {
      updated[index] = { ...updated[index], role: bulkRole };
    });
    setEmployees(updated);
    setSelectedEmployees([]);
    setIsBulkAssignOpen(false);
  };

  const toggleEmployeeSelection = (index: number) => {
    const globalIndex = employees.findIndex(
      (e) => e.email === filteredEmployees[index].email,
    );
    if (globalIndex === -1) return;

    setSelectedEmployees((prev) =>
      prev.includes(globalIndex)
        ? prev.filter((i) => i !== globalIndex)
        : [...prev, globalIndex],
    );
  };

  const getRoleColor = (roleValue: RoleValue) => {
    return (
      roleDefinitions.find((r) => r.value === roleValue)?.color || "#6B7280"
    );
  };

  const getRoleLabel = (roleValue: RoleValue) => {
    return (
      roleDefinitions.find((r) => r.value === roleValue)?.label || roleValue
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase();
  };

  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPermissionBadge = (perm: ModulePermission) => {
    return (
      <Badge className={permissionColors[perm]}>{permissionLabels[perm]}</Badge>
    );
  };

  const role1 = roleDefinitions.find((r) => r.value === compareRole1);
  const role2 = roleDefinitions.find((r) => r.value === compareRole2);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground mt-1">
            Assign and manage user roles across the organization
          </p>
        </div>
        <div className="flex gap-2">
          {changedRoles.size > 0 && (
            <Button onClick={() => setIsSaveDialogOpen(true)}>
              <Save className="h-4 w-4 mr-2" />
              Save Role Changes ({changedRoles.size})
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setIsBulkAssignOpen(true)}
            disabled={selectedEmployees.length === 0}
          >
            <Users className="h-4 w-4 mr-2" />
            Bulk Assign
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.activeUsers} active
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Departments</p>
                <p className="text-2xl font-bold">{stats.departments}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Roles Available</p>
                <p className="text-2xl font-bold">{stats.rolesAvailable}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Changes Pending</p>
                <p className="text-2xl font-bold">{changedRoles.size}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Assignments
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Shield className="h-4 w-4 mr-2" />
            Role Definitions
          </TabsTrigger>
          <TabsTrigger value="compare">
            <Layers className="h-4 w-4 mr-2" />
            Compare Roles
          </TabsTrigger>
        </TabsList>

        {/* User Assignments Tab */}
        <TabsContent value="users" className="space-y-6 mt-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Shield className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roleDefinitions.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* User Role Assignments Table */}
          <Card>
            <CardHeader>
              <CardTitle>User Role Assignments</CardTitle>
              <CardDescription>
                {filteredEmployees.length} user
                {filteredEmployees.length !== 1 ? "s" : ""} found
                {selectedEmployees.length > 0 &&
                  ` (${selectedEmployees.length} selected)`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40px]">
                        <input
                          type="checkbox"
                          checked={
                            filteredEmployees.length > 0 &&
                            filteredEmployees.every((_, i) => {
                              const gi = employees.findIndex(
                                (e) => e.email === filteredEmployees[i].email,
                              );
                              return selectedEmployees.includes(gi);
                            })
                          }
                          onChange={() => {
                            const allSelected = filteredEmployees.every(
                              (_, i) => {
                                const gi = employees.findIndex(
                                  (e) => e.email === filteredEmployees[i].email,
                                );
                                return selectedEmployees.includes(gi);
                              },
                            );
                            if (allSelected) {
                              setSelectedEmployees([]);
                            } else {
                              const indices = filteredEmployees
                                .map((_, i) =>
                                  employees.findIndex(
                                    (e) =>
                                      e.email === filteredEmployees[i].email,
                                  ),
                                )
                                .filter((i) => i !== -1);
                              setSelectedEmployees(indices);
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Current Role</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Assign New Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">
                            No users found
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees.map((emp, index) => {
                        const globalIndex = employees.findIndex(
                          (e) => e.email === emp.email,
                        );
                        const isChanged = changedRoles.has(globalIndex);
                        return (
                          <TableRow
                            key={emp.email}
                            className={isChanged ? "bg-yellow-50/50" : ""}
                          >
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedEmployees.includes(
                                  globalIndex,
                                )}
                                onChange={() => toggleEmployeeSelection(index)}
                                className="rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback
                                    className="text-xs"
                                    style={{
                                      backgroundColor: `${getRoleColor(emp.role)}20`,
                                      color: getRoleColor(emp.role),
                                    }}
                                  >
                                    {getInitials(emp.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-sm">
                                    {emp.name}
                                  </p>
                                  {emp.status === "inactive" && (
                                    <Badge className="bg-gray-100 text-gray-600 text-xs">
                                      Inactive
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {emp.email}
                            </TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>
                              <Badge
                                style={{
                                  backgroundColor: `${getRoleColor(emp.role)}20`,
                                  color: getRoleColor(emp.role),
                                }}
                              >
                                {getRoleLabel(emp.role)}
                              </Badge>
                              {isChanged && (
                                <Badge className="ml-2 bg-yellow-100 text-yellow-700 text-xs">
                                  Modified
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {formatDateTime(emp.lastActive)}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={emp.role}
                                onValueChange={(value) =>
                                  handleRoleChange(index, value as RoleValue)
                                }
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {roleDefinitions.map((r) => (
                                    <SelectItem key={r.value} value={r.value}>
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-2 h-2 rounded-full"
                                          style={{ backgroundColor: r.color }}
                                        />
                                        {r.label}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Definitions Tab */}
        <TabsContent value="roles" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleDefinitions.map((role) => (
              <Card
                key={role.value}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedRole(role);
                  setIsViewRoleOpen(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      <CardTitle className="text-base">{role.label}</CardTitle>
                    </div>
                    <Badge variant="secondary">Lvl {role.level}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {role.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      <Users className="h-3 w-3 inline mr-1" />
                      {role.userCount} user{role.userCount !== 1 ? "s" : ""}
                    </span>
                    <span className="text-muted-foreground">
                      {
                        role.permissions.filter((p) => p.permissions !== "none")
                          .length
                      }{" "}
                      permissions
                    </span>
                  </div>
                  <Progress
                    value={
                      (role.permissions.filter((p) => p.permissions !== "none")
                        .length /
                        modules.length) *
                      100
                    }
                    className="h-1 mt-2"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compare Roles Tab */}
        <TabsContent value="compare" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Comparison</CardTitle>
              <CardDescription>
                Compare permissions between two roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Label>Role 1</Label>
                  <Select
                    value={compareRole1}
                    onValueChange={(v) => setCompareRole1(v as RoleValue)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleDefinitions.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end pb-1">
                  <span className="text-lg font-bold text-muted-foreground">
                    vs
                  </span>
                </div>
                <div className="flex-1">
                  <Label>Role 2</Label>
                  <Select
                    value={compareRole2}
                    onValueChange={(v) => setCompareRole2(v as RoleValue)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleDefinitions.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {role1 && role2 && (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Module</TableHead>
                        <TableHead className="text-center">
                          {role1.label}
                        </TableHead>
                        <TableHead className="text-center">
                          {role2.label}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {modules.map((module) => {
                        const perm1 =
                          role1.permissions.find((p) => p.module === module)
                            ?.permissions || "none";
                        const perm2 =
                          role2.permissions.find((p) => p.module === module)
                            ?.permissions || "none";
                        const isDifferent = perm1 !== perm2;

                        return (
                          <TableRow
                            key={module}
                            className={isDifferent ? "bg-yellow-50/30" : ""}
                          >
                            <TableCell className="font-medium text-sm">
                              {module}
                            </TableCell>
                            <TableCell className="text-center">
                              {getPermissionBadge(perm1)}
                            </TableCell>
                            <TableCell className="text-center">
                              {getPermissionBadge(perm2)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Role Modal */}
      <Dialog open={isViewRoleOpen} onOpenChange={setIsViewRoleOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedRole?.color }}
              />
              {selectedRole?.label}
            </DialogTitle>
            <DialogDescription>{selectedRole?.description}</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="text-xl font-bold">{selectedRole.level}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Users</p>
                  <p className="text-xl font-bold">{selectedRole.userCount}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Permissions</p>
                  <p className="text-xl font-bold">
                    {
                      selectedRole.permissions.filter(
                        (p) => p.permissions !== "none",
                      ).length
                    }
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium mb-3">Module Permissions</p>
                <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                  {selectedRole.permissions.map((perm) => (
                    <div
                      key={perm.module}
                      className="flex items-center justify-between p-3 text-sm"
                    >
                      <span className="font-medium">{perm.module}</span>
                      {getPermissionBadge(perm.permissions)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Save Confirmation Dialog */}
      <AlertDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Role Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to update roles for{" "}
              <strong>
                {changedRoles.size} user{changedRoles.size !== 1 ? "s" : ""}
              </strong>
              . This will affect their system permissions immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Assign Dialog */}
      <Dialog open={isBulkAssignOpen} onOpenChange={setIsBulkAssignOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk Role Assignment</DialogTitle>
            <DialogDescription>
              Assign a role to {selectedEmployees.length} selected employee
              {selectedEmployees.length !== 1 ? "s" : ""}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Role</Label>
              <Select
                value={bulkRole}
                onValueChange={(v) => setBulkRole(v as RoleValue)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleDefinitions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: r.color }}
                        />
                        {r.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">
                Selected Users ({selectedEmployees.length})
              </p>
              <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                {selectedEmployees.map((index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(employees[index].name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{employees[index].name}</span>
                    <span className="text-muted-foreground text-xs">
                      - {employees[index].department}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkAssignOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleBulkAssign}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Assign Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
