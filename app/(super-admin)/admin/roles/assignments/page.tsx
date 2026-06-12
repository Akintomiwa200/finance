"use client";

import { Suspense } from "react";
import { RolesAssignmentsPageContent } from "@/src/components/admin/roles-assignments-page-content";
import { TableSkeleton } from "@/src/components/layout/dashboard-skeletons";

function AssignmentsFallback() {
  return <TableSkeleton rows={6} columns={4} />;
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<AssignmentsFallback />}>
      <RolesAssignmentsPageContent />
    </Suspense>
  );
}
