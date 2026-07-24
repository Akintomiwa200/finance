export interface TaxConfiguration {
  id: string;
  name: string;
  rate: number;
  threshold: number | null;
  isActive: boolean;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
}
