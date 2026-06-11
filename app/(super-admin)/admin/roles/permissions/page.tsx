"use client";

import { PageLayout } from "@/src/components/layout/page-layout";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { useFetch } from "@/src/hooks/use-fetch";
import { MODULE_PERMISSIONS } from "@/src/services/permission-group.service";
import type { PermissionGroup } from "@/src/types/admin";

export default function PermissionsMatrixPage() {
  const { data: groups, isLoading } = useFetch<PermissionGroup[]>("/api/admin/groups");

  return (
    <PageLayout title="Permission Matrix" description="Module permissions across all privilege groups" showBack breadcrumbs={[{ label: "Roles", href: "/admin/roles" }, { label: "Permissions" }]}>
      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <Card className="overflow-x-auto">
          <CardContent className="p-0 pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-muted-foreground font-medium">Module</th>
                  {(groups ?? []).map((g) => (
                    <th key={g.id} className="text-center p-3 text-muted-foreground font-medium whitespace-nowrap">{g.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULE_PERMISSIONS.map((mod) => (
                  <tr key={mod} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 capitalize font-medium">{mod.replace(/-/g, " ")}</td>
                    {(groups ?? []).map((g) => (
                      <td key={g.id} className="p-3 text-center">
                        <Badge variant={(g.permissions[mod] ?? "none") === "none" ? "default" : "info"} className="text-[10px]">
                          {g.permissions[mod] ?? "none"}
                        </Badge>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
