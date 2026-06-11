"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { CreditCard, Layers, Receipt, FileText } from "lucide-react";

export default function BillingPage() {
  return (
    <SectionPage
      title="Billing & Subscriptions"
      description="Manage tenant subscriptions, pricing plans, and invoices"
      links={[
        { label: "Pricing Plans", href: "/admin/billing/plans", description: "Configure platform pricing tiers and features", icon: Layers },
        { label: "Subscriptions", href: "/admin/billing/subscriptions", description: "View and manage active tenant subscriptions", icon: CreditCard },
        { label: "Invoices", href: "/admin/billing/invoices", description: "Platform billing invoices and payment history", icon: FileText },
        { label: "Payment Methods", href: "/admin/billing/payment-methods", description: "Tenant payment methods on file", icon: Receipt },
      ]}
    />
  );
}
