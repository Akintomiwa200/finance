"use client";

import { use } from "react";
import { EditCompanyForm } from "@/src/components/admin/edit-company-form";

export default function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <EditCompanyForm companyId={id} />;
}
