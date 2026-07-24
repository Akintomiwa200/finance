export type AssetStatus = "active" | "maintenance" | "disposed" | "retired";
export type DepreciationMethod = "straight_line" | "declining_balance" | "double_declining";
export type AssetCategory = "IT_Equipment" | "Office_Furniture" | "Vehicles" | "Machinery" | "Building" | "Software" | "Other";
export type DisposalMethod = "sale" | "scrap" | "donation" | "trade_in" | "write_off";
export type DisposalStatus = "pending" | "approved" | "completed" | "rejected";

export interface Asset {
  id: string;
  name: string;
  code: string;
  category: AssetCategory;
  description: string | null;
  serialNumber: string | null;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  depreciationMethod: DepreciationMethod | null;
  usefulLife: number | null;
  salvageValue: number | null;
  accumulatedDepreciation: number;
  monthlyDepreciation: number;
  status: AssetStatus;
  location: string | null;
  departmentName: string | null;
  assignedTo: string | null;
  supplier: string | null;
  warrantyExpiry: string | null;
  notes: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssetDisposal {
  id: string;
  disposalNumber: string;
  disposalDate: string;
  disposalMethod: DisposalMethod;
  saleAmount: number;
  disposalCost: number;
  netProceeds: number;
  bookValueAtDisposal: number;
  gainLoss: number;
  gainLossType: "gain" | "loss";
  status: DisposalStatus;
  buyerName: string | null;
  buyerContact: string | null;
  reason: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  processedBy: string | null;
  processedAt: string | null;
  reference: string | null;
  notes: string | null;
  assetId: string;
  assetName: string;
  assetCode: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
