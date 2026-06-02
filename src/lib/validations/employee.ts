import { z } from "zod";

export const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().optional(),
  baseSalary: z.coerce.number().min(0, "Salary must be positive").optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  bankCode: z.string().optional(),
  taxId: z.string().optional(),
  hireDate: z.string().optional(),
  departmentId: z.string().min(1, "Department is required"),
  role: z.string().default("EMPLOYEE"),
});

export type EmployeeInput = z.infer<typeof employeeSchema>;
