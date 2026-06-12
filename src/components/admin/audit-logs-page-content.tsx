"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Loader2,
  Lock,
  Minus,
  MoreVertical,
  RefreshCw,
  Search,
  Shield,
  X as XIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFetch } from "@/src/hooks/use-fetch";
import { useAdminRealtime } from "@/src/hooks/use-admin-realtime";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { EmptyState } from "@/src/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/src/components/ui/select";
import {
  CHART_COLORS,
  getChartAxisColor,
  getChartGridColor,
  getChartTooltipStyle,
} from "@/src/components/charts/chart-theme";
import { DashCard, ViewPill } from "@/src/components/admin/reports-shared";
import { cn, formatDate } from "@/src/lib/utils";
import type { AdminAuditLog } from "@/src/types/admin";

const PAGE_SIZE = 8;

type ActionFilter = "all" | "CREATE" | "UPDATE" | "DELETE" | "OTHER";

const ACTION_FILTERS: { id: ActionFilter; label: string; color: string }[] = [
  { id: "all", label: "All", color: CHART_COLORS[0] },
  { id: "CREATE", label: "Created", color: CHART_COLORS[1] },
  { id: "UPDATE", label: "Updated", color: CHART_COLORS[2] },
  { id: "DELETE", label: "Deleted", color: CHART_COLORS[3] },
  { id: "OTHER", label: "Other", color: CHART_COLORS[4] },
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatLogDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function actionCategory(action: string): ActionFilter {
  const upper = action.toUpperCase();
  if (upper === "CREATE") return "CREATE";
  if (upper === "UPDATE") return "UPDATE";
  if (upper === "DELETE") return "DELETE";
  return "OTHER";
}

function actionStatusColor(action: string) {
  const cat = actionCategory(action);
  if (cat === "CREATE") return "bg-success";
  if (cat === "UPDATE") return "bg-info";
  if (cat === "DELETE") return "bg-danger";
  return "bg-warning";
}

function logTitle(log: AdminAuditLog) {
  return `${log.action} — ${log.entity}`;
}

function logSnippet(log: AdminAuditLog) {
  const parts = [
    log.userName ? `by ${log.userName}` : null,
    log.organizationName ? `at ${log.organizationName}` : null,
    log.entityId ? `id ${log.entityId.slice(0, 8)}…` : null,
  ].filter(Boolean);
  return parts.join(" · ") || "Platform activity recorded";
}

function initials(name: string | null) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export function AuditLogsPageContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading, refetch } = useFetch<AdminAuditLog[]>("/api/admin/audit-logs");
  useAdminRealtime(refetch);

  const logs = data ?? [];

  const counts = useMemo(() => {
    const c = { all: logs.length, CREATE: 0, UPDATE: 0, DELETE: 0, OTHER: 0 };
    for (const log of logs) c[actionCategory(log.action)] += 1;
    return c;
  }, [logs]);

  const todayCount = useMemo(() => logs.filter((l) => isToday(l.createdAt)).length, [logs]);

  const orgCount = useMemo(() => {
    const set = new Set(logs.map((l) => l.organizationName).filter(Boolean));
    return set.size;
  }, [logs]);

  const actionChart = useMemo(
    () =>
      ACTION_FILTERS.filter((f) => f.id !== "all").map((f) => ({
        name: f.label,
        count: counts[f.id],
        color: f.color,
      })),
    [counts],
  );

  const dailyChart = useMemo(() => {
    const buckets = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      buckets.set(d.toDateString(), 0);
    }
    for (const log of logs) {
      const key = new Date(log.createdAt).toDateString();
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return [...buckets.entries()].map(([key, count]) => ({
      day: DAY_LABELS[new Date(key).getDay()],
      count,
    }));
  }, [logs]);

  const entityOptions = useMemo(() => {
    const set = new Set(logs.map((l) => l.entity));
    return ["all", ...Array.from(set).sort()];
  }, [logs]);

  const filtered = useMemo(() => {
    let rows = logs;
    if (actionFilter !== "all") rows = rows.filter((l) => actionCategory(l.action) === actionFilter);
    if (entityFilter !== "all") rows = rows.filter((l) => l.entity === entityFilter);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.entity.toLowerCase().includes(q) ||
          l.userName?.toLowerCase().includes(q) ||
          l.organizationName?.toLowerCase().includes(q) ||
          l.entityId?.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [logs, actionFilter, entityFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const toggleAll = () => {
    if (selected.size === paginated.length) setSelected(new Set());
    else setSelected(new Set(paginated.map((l) => l.id)));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <DashCard className="flex flex-col justify-between lg:col-span-7 xl:col-span-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex shrink-0 items-center justify-center rounded-2xl bg-muted/50 p-6 sm:w-[140px]">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <Shield className="absolute -left-1 top-2 h-8 w-8 text-brand-600 opacity-90" />
                <Activity className="absolute bottom-0 right-0 h-10 w-10 text-violet-500 opacity-90" />
                <div className="h-12 w-12 rounded-full bg-brand-600/10" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                Platform audit logs
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Track who changed what across tenant companies and platform settings.
                Every create, update, and delete is recorded here for compliance and troubleshooting.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm" onClick={() => router.push("/admin/settings/security")}>
                  <Shield className="h-4 w-4" />
                  Security settings
                </Button>
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </DashCard>

        <DashCard className="lg:col-span-5 xl:col-span-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Events (7 days)</p>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-[140px]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyChart} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} vertical={false} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: getChartAxisColor(), fontSize: 11 }} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip contentStyle={getChartTooltipStyle()} formatter={(v) => [v, "Events"]} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {dailyChart.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </DashCard>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Total events</p>
          <p className="mt-1 text-2xl font-semibold">{counts.all}</p>
          <p className="mt-1 text-xs text-muted-foreground">All time on platform</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Today</p>
          <p className="mt-1 text-2xl font-semibold">{todayCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Events since midnight</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Organizations</p>
          <p className="mt-1 text-2xl font-semibold">{orgCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">With logged activity</p>
        </DashCard>
        <DashCard className="!p-4">
          <p className="text-xs text-muted-foreground">Deletes</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">{counts.DELETE}</p>
          <p className="mt-1 text-xs text-muted-foreground">Destructive actions</p>
        </DashCard>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-5">
        <DashCard className="xl:col-span-5">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">By action type</p>
            <p className="text-xs text-muted-foreground">Breakdown of recorded events</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ACTION_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  setActionFilter(f.id);
                  setPage(1);
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  actionFilter === f.id
                    ? "bg-foreground text-background"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted",
                )}
              >
                {f.label} ({counts[f.id]})
              </button>
            ))}
          </div>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionChart} layout="vertical" barCategoryGap="16%">
                <CartesianGrid strokeDasharray="3 3" stroke={getChartGridColor()} horizontal={false} />
                <XAxis type="number" allowDecimals={false} stroke={getChartAxisColor()} fontSize={11} />
                <YAxis type="category" dataKey="name" stroke={getChartAxisColor()} fontSize={11} width={72} />
                <Tooltip contentStyle={getChartTooltipStyle()} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {actionChart.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashCard>

        <DashCard className="xl:col-span-7">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Filter events</p>
              <p className="text-xs text-muted-foreground">Narrow by entity or action</p>
            </div>
            <ViewPill href="/admin/reports/platform-health" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={entityFilter} onValueChange={(v) => { setEntityFilter(v); setPage(1); }}>
              <SelectTrigger className="h-9 w-[11rem] text-sm">
                <span>{entityFilter === "all" ? "All entities" : entityFilter}</span>
              </SelectTrigger>
              <SelectContent>
                {entityOptions.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e === "all" ? "All entities" : e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={actionFilter}
              onValueChange={(v) => {
                setActionFilter(v as ActionFilter);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-[10rem] text-sm">
                <span>{actionFilter === "all" ? "All actions" : actionFilter}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="CREATE">CREATE</SelectItem>
                <SelectItem value="UPDATE">UPDATE</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="OTHER">OTHER</SelectItem>
              </SelectContent>
            </Select>
            {selected.size > 0 && (
              <Button variant="primary" size="sm" className="bg-brand-600 hover:bg-brand-700">
                Action ({selected.size})
              </Button>
            )}
          </div>
        </DashCard>
      </div>

      <DashCard className="!p-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, action, entity or more"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10 pl-9"
            />
          </div>
          <div className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg p-2 transition-colors hover:bg-muted"
              aria-label="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <span>
              {rangeStart}-{rangeEnd} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button type="button" variant="outline" size="icon" className="h-8 w-8" disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading audit logs…
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10">
            <EmptyState title="No audit logs yet" />
          </div>
        ) : (
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="w-10 px-4 py-3 sm:px-5">
                    <input
                      type="checkbox"
                      checked={paginated.length > 0 && selected.size === paginated.length}
                      onChange={toggleAll}
                      className="rounded border-border"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-2 py-3 font-medium">Date</th>
                  <th className="px-2 py-3 font-medium">User</th>
                  <th className="w-12 px-2 py-3 font-medium">Org</th>
                  <th className="px-2 py-3 font-medium">Activity</th>
                  <th className="w-32 px-4 py-3 text-right font-medium sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((row) => {
                  const isSelected = selected.has(row.id);
                  return (
                    <tr
                      key={row.id}
                      onClick={() => router.push(`/admin/audit-logs/${row.id}`)}
                      className={cn(
                        "cursor-pointer border-b border-border/50 transition-all",
                        isSelected ? "bg-card shadow-md" : "hover:bg-muted/30",
                      )}
                    >
                      <td className="px-4 py-4 sm:px-5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleOne(row.id)}
                          className="rounded border-border"
                          aria-label={`Select log ${row.id}`}
                        />
                      </td>
                      <td className="whitespace-nowrap px-2 py-4 text-muted-foreground">
                        {formatLogDate(row.createdAt)}
                      </td>
                      <td className="px-2 py-4">
                        <p className="font-medium text-foreground">{row.userName ?? "System"}</p>
                        <p className="text-xs text-muted-foreground">{row.entity}</p>
                      </td>
                      <td className="px-2 py-4">
                        <span
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand-700"
                          title={row.organizationName ?? "Platform"}
                        >
                          {initials(row.organizationName)}
                        </span>
                      </td>
                      <td className="min-w-0 px-2 py-4">
                        <p className="font-medium text-foreground">{logTitle(row)}</p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{logSnippet(row)}</p>
                      </td>
                      <td className="px-4 py-4 sm:px-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2 text-muted-foreground">
                          <Lock className="h-3.5 w-3.5" />
                          {actionCategory(row.action) === "DELETE" ? (
                            <XIcon className="h-3.5 w-3.5" />
                          ) : (
                            <Minus className="h-3.5 w-3.5" />
                          )}
                          <Cloud className="h-3.5 w-3.5" />
                          <span className={cn("h-2.5 w-2.5 rounded-full", actionStatusColor(row.action))} />
                          <button
                            type="button"
                            className="rounded p-1 hover:bg-muted"
                            onClick={() => router.push(`/admin/audit-logs/${row.id}`)}
                            aria-label="More actions"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filtered.length > 0 && (
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground sm:px-5">
            Last synced {formatDate(new Date().toISOString(), "relative")} · {counts.all} total events
          </div>
        )}
      </DashCard>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/admin/reports/platform-health" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Platform health</p>
              <p className="text-xs text-muted-foreground">Uptime and recent events</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
        <Link href="/admin/settings/security" className="no-underline">
          <DashCard className="flex items-center gap-3 transition-colors hover:border-accent-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Security settings</p>
              <p className="text-xs text-muted-foreground">Access and audit policies</p>
            </div>
            <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </DashCard>
        </Link>
      </div>
    </div>
  );
}
