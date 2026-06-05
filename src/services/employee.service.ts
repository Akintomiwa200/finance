import { Role } from "../../generated/prisma/enums";
import { db } from "@/src/lib/db";

export async function getEmployees(organizationId: string) {
  return db.employee.findMany({
    where: { organizationId },
    include: { department: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEmployeeById(id: string) {
  return db.employee.findUnique({
    where: { id },
    include: { department: true },
  });
}

export async function createEmployee(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  baseSalary?: number;
  departmentId: string;
  organizationId: string;
  role?: Role;
}) {
  const count = await db.employee.count({
    where: { organizationId: data.organizationId },
  });
  const employeeCode = `EMP${String(count + 1).padStart(5, "0")}`;

  return db.employee.create({
    data: {
      ...data,
      employeeCode,
      baseSalary: data.baseSalary ? data.baseSalary : undefined,
    },
  });
}

export async function updateEmployee(
  id: string,
  data: Partial<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    baseSalary: number;
    bankName: string;
    bankAccount: string;
    bankCode: string;
    taxId: string;
    isActive: boolean;
    departmentId: string;
    role: Role;
  }>
) {
  return db.employee.update({
    where: { id },
    data,
  });
}

export async function deleteEmployee(id: string) {
  return db.employee.update({
    where: { id },
    data: { isActive: false },
  });
}
