"use client";

import { SectionPage } from "@/src/components/templates/section-page";
import { ClipboardList, CalendarRange, Trash2 } from "lucide-react";

export default function AssetsPage() {
  return (
    <SectionPage
      title="Fixed Assets"
      description="Manage your organization's fixed assets — register assets, track depreciation, and handle disposals."
      links={[
        { label: "Asset Register", href: "/assets/register", description: "View and manage all registered fixed assets", icon: ClipboardList },
        { label: "Depreciation Schedule", href: "/assets/depreciation", description: "Track asset depreciation over time", icon: CalendarRange },
        { label: "Asset Disposal", href: "/assets/disposal", description: "Record and manage asset disposals", icon: Trash2 },
      ]}
    />
  );
}
