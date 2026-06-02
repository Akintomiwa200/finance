import { z } from "zod";

export const payrollSchema = z.object({
  periodStart: z.string().min(1, "Start date is required"),
  periodEnd: z.string().min(1, "End date is required"),
  notes: z.string().optional(),
  employeeIds: z.array(z.string()).min(1, "Select at least one employee"),
});

export const payrollItemSchema = z.object({
  employeeId: z.string().min(1),
  grossPay: z.coerce.number().min(0, "Gross pay must be positive"),
  deductions: z.coerce.number().min(0).default(0),
  allowances: z.coerce.number().min(0).default(0),
  bonus: z.coerce.number().min(0).default(0),
  loanDeduction: z.coerce.number().min(0).default(0),
  overtimePay: z.coerce.number().min(0).default(0),
});

export type PayrollInput = z.infer<typeof payrollSchema>;
export type PayrollItemInput = z.infer<typeof payrollItemSchema>;
