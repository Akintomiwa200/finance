"use client";

import { useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Shield, Users, Lock, CheckCircle, XCircle } from "lucide-react";
import { Role, ModuleId, getVisibleModules } from "@/src/lib/permissions";
import { useEmployeeStore } from "@/src/store/employee-store";
import { useTenantSettingsStore } from "@/src/store/tenant-settings-store";
import { SettingsPageSkeleton } from "@/src/components/layout/dashboard-skeletons";

const MODULE_LABELS: Record<ModuleId, string> = {
  dashboard: "Dashboard",
  employees: "Employees",
  payroll: "Payroll",
  ledger: "General Ledger",
  "petty-cash": "Petty Cash",
  payables: "Accounts Payable",
  receivables: "Accounts Receivable",
  cash: "Cash Management",
  assets: "Fixed Assets",
  tax: "Tax Management",
  budget: "Budget",
  "financial-reports": "Financial Reports",
  approvals: "Approvals",
  departments: "Departments",
  reports: "Reports",
  settings: "Settings",
  expenses: "Expenses",
  invoices: "Invoices",
  support: "Support",
};

const MODULE_DESCRIPTIONS: Record<ModuleId, string> = {
  dashboard: "Main dashboard with financial overviews and KPIs",
  employees: "Employee records and HR management",
  payroll: "Payroll processing and salary management",
  ledger: "General ledger entries and journal postings",
  "petty-cash": "Petty cash tracking and replenishment",
  payables: "Vendor invoices and payment processing",
  receivables: "Customer invoices and collections",
  cash: "Cash flow and bank reconciliation",
  assets: "Fixed asset register and depreciation",
  tax: "Tax filings, PAYE, VAT, and withholding",
  budget: "Budget creation and variance analysis",
  "financial-reports": "Income statements, balance sheets, cash flow",
  approvals: "Transaction approval workflows",
  departments: "Department management and cost centers",
  reports: "Business and operational reports",
  settings: "System and organization configuration",
  expenses: "Expense submissions and reimbursements",
  invoices: "Invoice creation and management",
  support: "Help desk and support tickets",
};

const DISPLAY_ROLES: Role[] = [
  "ADMIN",
  "FINANCE_MANAGER",
  "ACCOUNTANT_PAYABLE",
  "ACCOUNTANT_RECEIVABLE",
  "PAYROLL_OFFICER",
  "BUDGET_ANALYST",
  "DEPARTMENT_HEAD",
  "EMPLOYEE",
  "AUDITOR",
  "TAX_SPECIALIST",
];

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  FINANCE_MANAGER: "Finance Manager",
  ACCOUNTANT_PAYABLE: "Accountant (AP)",
  ACCOUNTANT_RECEIVABLE: "Accountant (AR)",
  PAYROLL_OFFICER: "Payroll Officer",
  BUDGET_ANALYST: "Budget Analyst",
  DEPARTMENT_HEAD: "Department Head",
  AUDITOR: "Auditor",
  TAX_SPECIALIST: "Tax Specialist",
  EMPLOYEE: "Employee",
};

export default function PermissionsPage() {
  const { employees, loading: employeesLoading, startPolling, stopPolling } =
    useEmployeeStore();
  const orgSettings = useTenantSettingsStore((s) => s.settings);
  const tenantLoading = useTenantSettingsStore((s) => s.isLoading);

  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const loading = employeesLoading && employees.length === 0;

  const roleEmployeeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((emp) => {
      counts[emp.role] = (counts[emp.role] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const orgName =
    orgSettings?.org?.name ||
    orgSettings?.organization?.legalName ||
    "Organization";

  if (loading || tenantLoading) {
    return <SettingsPageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <span className="text-2xl font-bold tracking-tight">
            Permission Matrix
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Read-only view of module access for each role in {orgName}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Roles</p>
                <p className="text-2xl font-bold">{DISPLAY_ROLES.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Modules</p>
                <p className="text-2xl font-bold">19</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <Lock className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Role Overview</CardTitle>
          <CardDescription>
            Number of employees assigned to each role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {DISPLAY_ROLES.map((role) => {
              const count = roleEmployeeCounts[role] || 0;
              return (
                <div
                  key={role}
                  className="rounded-lg border border-border p-3 space-y-1"
                >
                  <p className="font-medium text-sm">{ROLE_LABELS[role]}</p>
                  <p className="text-xs text-muted-foreground">
                    <Users className="h-3 w-3 inline mr-1" />
                    {count} employee{count !== 1 ? "s" : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>
            Each cell shows whether the role has access to that module
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px] sticky left-0 bg-background z-10">
                  Module
                </TableHead>
                {DISPLAY_ROLES.map((role) => (
                  <TableHead key={role} className="text-center min-w-[90px]">
                    <span className="text-[10px] leading-tight block">
                      {ROLE_LABELS[role]}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(
                Object.keys(MODULE_LABELS) as ModuleId[]
              ).map((moduleId) => (
                <TableRow key={moduleId}>
                  <TableCell className="sticky left-0 bg-background z-10">
                    <div>
                      <p className="font-medium text-sm">
                        {MODULE_LABELS[moduleId]}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {MODULE_DESCRIPTIONS[moduleId]}
                      </p>
                    </div>
                  </TableCell>
                  {DISPLAY_ROLES.map((role) => {
                    const hasAccess = getVisibleModules(role).includes(
                      moduleId,
                    );
                    return (
                      <TableCell key={role} className="text-center">
                        {hasAccess ? (
                          <Badge className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0">
                            <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0">
                            <XCircle className="h-2.5 w-2.5 mr-0.5" />
                            No
                          </Badge>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
