"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Plus,
  Search,
  Filter,
  FolderKanban,
  Users,
  Building2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { EmptyState } from "@/src/components/ui/empty-state";
import { AddDepartmentModal } from "@/src/components/admin/add-department-modal";
import { CHART_COLORS } from "@/src/components/charts/chart-theme";
import { cn, formatDate } from "@/src/lib/utils";
import type { AdminDepartment } from "@/src/types/admin";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function DashCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconClassName,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <DashCard className="flex items-center gap-4">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          iconClassName,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
      </div>
    </DashCard>
  );
}

export function DepartmentsPageContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading, refetch } = useFetch<AdminDepartment[]>(
    "/api/admin/departments",
  );
  useAdminRealtime(refetch);

  const stats = useMemo(() => {
    const departments = data ?? [];
    const companies = new Set(departments.map((d) => d.organizationId)).size;
    const recent = departments.filter(
      (d) =>
        new Date(d.createdAt) >=
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    ).length;
    return {
      totalDepartments: departments.length,
      companies,
      recent,
    };
  }, [data]);

  const topDepartments = useMemo(() => {
    const total = data?.length ?? 0;
    const share = total > 0 ? Math.round(100 / Math.min(total, 5)) : 0;
    return [...(data ?? [])]
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 5)
      .map((dept, i) => ({
        id: dept.id,
        name: dept.name,
        rate: share,
        color: CHART_COLORS[i % CHART_COLORS.length],
      }));
  }, [data]);

  const donutData = useMemo(
    () =>
      topDepartments.map((d) => ({
        name: d.name,
        value: d.rate || 1,
        color: d.color,
      })),
    [topDepartments],
  );

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.organizationName.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.head?.toLowerCase().includes(q),
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <>
    <AddDepartmentModal
      open={createOpen}
      onClose={() => setCreateOpen(false)}
      onCreated={refetch}
    />
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-5">
      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]">
        {/* Left sidebar */}
        <aside className="min-w-0 space-y-4">
          <StatCard
            label="Total Departments"
            value={stats.totalDepartments}
            icon={<FolderKanban className="h-5 w-5 text-brand-600" />}
            iconClassName="bg-brand-50 text-brand-600"
          />
          <StatCard
            label="Companies Linked"
            value={stats.companies}
            icon={<Building2 className="h-5 w-5 text-brand-600" />}
            iconClassName="bg-brand-50 text-brand-600"
          />
          <StatCard
            label="Added This Month"
            value={stats.recent}
            icon={<Users className="h-5 w-5 text-brand-600" />}
            iconClassName="bg-brand-50 text-brand-600"
          />

          <DashCard>
            <p className="text-sm font-semibold text-foreground">
              Top 5 Departments
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Share across platform
            </p>

            <div className="relative mx-auto my-4 h-[140px] w-full max-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donutData.length ? donutData : [{ name: "—", value: 1, color: "var(--border)" }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={62}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {(donutData.length ? donutData : [{ color: "var(--border)" }]).map(
                      (entry, i) => (
                        <Cell key={i} fill={entry.color ?? CHART_COLORS[i]} />
                      ),
                    )}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-semibold text-foreground">
                  {stats.totalDepartments}
                </p>
                <p className="text-[10px] text-muted-foreground">Total</p>
              </div>
            </div>

            <ul className="space-y-3">
              {topDepartments.length === 0 ? (
                <li className="text-center text-xs text-muted-foreground py-4">
                  No departments yet
                </li>
              ) : (
                topDepartments.map((dept) => (
                  <li key={dept.id} className="min-w-0">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2.5 w-2.5 shrink-0 rounded-sm"
                          style={{ backgroundColor: dept.color }}
                        />
                        <span className="truncate text-xs font-medium text-foreground">
                          {dept.name}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-foreground">
                        {dept.rate}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-brand-600 transition-all"
                        style={{ width: `${dept.rate}%` }}
                      />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </DashCard>
        </aside>

        {/* Main table area */}
        <div className="min-w-0">
          <DashCard className="overflow-hidden p-0">
            <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search department, company, head..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="h-10 min-w-0 pl-9"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 gap-2"
                  disabled
                  title="Filter coming soon"
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              <Button
                variant="primary"
                className="shrink-0 gap-2 bg-brand-600 hover:bg-brand-700"
                onClick={() => setCreateOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add New Department
              </Button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading departments…
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8">
                <EmptyState title="No departments found" />
              </div>
            ) : (
              <div className="min-w-0 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 text-left">
                      <th className="px-4 py-3 font-semibold text-foreground sm:px-5">
                        Department
                      </th>
                      <th className="px-4 py-3 font-semibold text-foreground sm:px-5">
                        Company
                      </th>
                      <th className="px-4 py-3 font-semibold text-foreground sm:px-5">
                        Head
                      </th>
                      <th className="px-4 py-3 font-semibold text-foreground sm:px-5">
                        Created
                      </th>
                      <th className="px-4 py-3 font-semibold text-foreground sm:px-5">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((row) => {
                      return (
                        <tr
                          key={row.id}
                          onClick={() => router.push(`/admin/departments/${row.id}`)}
                          className="cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-4 sm:px-5">
                            <p className="font-semibold text-foreground">
                              {row.name}
                            </p>
                            <p className="font-mono text-xs text-muted-foreground">
                              #{row.code}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-muted-foreground sm:px-5">
                            {row.organizationName || "—"}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground sm:px-5">
                            {row.head ?? "—"}
                          </td>
                          <td className="px-4 py-4 text-sm text-muted-foreground sm:px-5">
                            {formatDate(row.createdAt)}
                          </td>
                          <td className="px-4 py-4 sm:px-5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-info/15 px-2.5 py-1 text-xs font-medium text-info">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Active
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && filtered.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-border px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Showing</span>
                  <select
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setPage(1);
                    }}
                    className="h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground"
                  >
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <span>
                    out of {filtered.length}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {pageNumbers.map((n) => (
                    <Button
                      key={n}
                      type="button"
                      variant={n === currentPage ? "primary" : "outline"}
                      size="icon"
                      className={cn(
                        "h-8 w-8 text-xs",
                        n === currentPage &&
                          "bg-brand-600 hover:bg-brand-700 border-brand-600",
                      )}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </DashCard>
        </div>
      </div>
    </div>
    </>
  );
}
