export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  position: string | null;
  baseSalary: number | null;
  bankName: string | null;
  bankAccount: string | null;
  bankCode: string | null;
  taxId: string | null;
  hireDate: string | null;
  isActive: boolean;
  role: string;
  departmentId: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeSummary {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive";
}
