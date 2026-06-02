export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  costCenter: string | null;
  budgetAmount: number | null;
  head: string | null;
  organizationId: string;
  employeeCount?: number;
  createdAt: string;
}
