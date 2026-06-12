"use client";

import { use } from "react";
import { RolesGroupDetailPageContent } from "@/src/components/admin/roles-group-detail-page-content";

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <RolesGroupDetailPageContent groupId={id} />;
}
