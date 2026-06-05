"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { Truck, ShoppingCart, FileText, CreditCard } from "lucide-react";

export default function AccountsPayable() {
  return (
    <SectionPage
      title="Accounts Payable"
      description="Manage vendor bills, purchase orders, and payments."
      links={[
        { label: "Vendors", href: "/payables/vendors", description: "Manage your vendor/supplier list", icon: Truck },
        { label: "Purchase Orders", href: "/payables/purchase-orders", description: "Create and manage purchase orders", icon: ShoppingCart },
        { label: "Vendor Bills", href: "/payables/vendor-bills", description: "Record and track vendor invoices", icon: FileText },
        { label: "Bill Payments", href: "/payables/bill-payments", description: "Process payments to vendors", icon: CreditCard },
      ]}
    />
  );
}
