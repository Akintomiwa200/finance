"use client";

import { Suspense } from "react";
import { RolesAssignmentsPageContent } from "@/src/components/admin/roles-assignments-page-content";
import { Loader2 } from "lucide-react";

function AssignmentsFallback() {
  return (
    <div className="flex justify-center py-24">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}

export default function AssignmentsPage() {
  return (
    <Suspense fallback={<AssignmentsFallback />}>
      <RolesAssignmentsPageContent />
    </Suspense>
  );
}
