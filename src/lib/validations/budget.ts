import { z } from "zod";

export const budgetLineItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  allocated: z.coerce.number().min(0, "Allocated amount must be positive"),
});

export const budgetSchema = z.object({
  fiscalYear: z.coerce.number().int().min(2024, "Invalid fiscal year"),
  departmentId: z.string().optional(),
  lineItems: z.array(budgetLineItemSchema).min(1, "Add at least one budget line item"),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
export type BudgetLineItemInput = z.infer<typeof budgetLineItemSchema>;
