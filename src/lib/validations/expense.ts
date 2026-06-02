import { z } from "zod";

export const expenseItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  expenseDate: z.string().min(1, "Date is required"),
  receiptUrl: z.string().optional(),
});

export const expenseReportSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  items: z.array(expenseItemSchema).min(1, "Add at least one item"),
});

export type ExpenseReportInput = z.infer<typeof expenseReportSchema>;
export type ExpenseItemInput = z.infer<typeof expenseItemSchema>;
