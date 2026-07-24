export type EmployeeRole = "ADMIN" | "HR" | "FINANCE" | "MANAGER" | "EMPLOYEE";

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string | null;
  baseSalary: number;
  bankName: string | null;
  bankAccount: string | null;
  bankCode: string | null;
  taxId: string | null;
  hireDate: string | null;
  isActive: boolean;
  role: EmployeeRole;
  departmentId: string;
  departmentName: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  costCenter: string | null;
  budgetAmount: number;
  head: string | null;
  employeeCount: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export const EMPLOYEE_ROLE_OPTIONS: { value: EmployeeRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "HR", label: "HR" },
  { value: "FINANCE", label: "Finance" },
  { value: "MANAGER", label: "Manager" },
  { value: "EMPLOYEE", label: "Employee" },
];
