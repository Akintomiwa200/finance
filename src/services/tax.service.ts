import { db } from "@/src/lib/db";

export async function getTaxConfigurations(organizationId?: string) {
  const where = organizationId ? { organizationId } : {};
  return db.taxConfiguration.findMany({
    where,
    orderBy: { name: "asc" },
  });
}

export async function createTaxConfiguration(data: {
  name: string;
  rate: number;
  threshold?: number;
  organizationId?: string;
}) {
  return db.taxConfiguration.create({ data });
}

export async function updateTaxConfiguration(id: string, data: Partial<{
  name: string;
  rate: number;
  threshold: number;
  isActive: boolean;
}>) {
  return db.taxConfiguration.update({ where: { id }, data });
}

export function computePayeeTax(grossPay: number): number {
  const brackets = [
    { threshold: 300000, rate: 0.01 },
    { threshold: 300000, rate: 0.025 },
    { threshold: 500000, rate: 0.05 },
    { threshold: 500000, rate: 0.075 },
    { threshold: 1600000, rate: 0.1 },
    { threshold: Infinity, rate: 0.15 },
  ];

  let remaining = grossPay;
  let tax = 0;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, bracket.threshold);
    tax += taxable * bracket.rate;
    remaining -= taxable;
  }

  return tax;
}

export function computePensionContribution(grossPay: number): number {
  return grossPay * 0.08;
}

export function computeNhfContribution(grossPay: number): number {
  return Math.min(grossPay * 0.025, 15000);
}
