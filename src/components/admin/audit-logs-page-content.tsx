"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Lock,
  MoreVertical,
  Loader2,
  Cloud,
  Minus,
  X as XIcon,
} from "lucide-react";
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
import { cn, formatDate } from "@/src/lib/utils";
import type { AdminAuditLog } from "@/src/types/admin";

const PAGE_SIZE = 8;

type ActionFilter = "all" | "CREATE" | "UPDATE" | "DELETE" | "OTHER";

const ACTION_FILTERS: {
  id: ActionFilter;
  label: string;
  color: string;
}[] = [
  { id: "all", label: "All Logs", color: "var(--accent-500)" },
  { id: "CREATE", label: "Created", color: "var(--accent-500)" },
  { id: "UPDATE", label: "Updated", color: "var(--success)" },
  { id: "DELETE", label: "Deleted", color: "var(--danger)" },
  { id: "OTHER", label: "Other", color: "var(--warning)" },
];

function formatLogDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
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

function RingStat({
  label,
  count,
  total,
  color,
  active,
  onClick,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  const pct = total > 0 ? Math.max(8, Math.round((count / total) * 100)) : 0;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-w-[88px] flex-col items-center gap-2 rounded-xl px-2 py-3 transition-colors",
        active ? "bg-card shadow-sm" : "hover:bg-muted/50",
      )}
    >
      <div className="relative h-[64px] w-[64px]">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="5"
          />
          <circle
            cx="32"
            cy="32"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground">
          {count}
        </span>
      </div>
      <span
        className={cn(
          "text-center text-xs font-medium",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
      {active && (
        <span
          className="h-0.5 w-8 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
    </button>
  );
}

export function AuditLogsPageContent() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data, isLoading, refetch } = useFetch<AdminAuditLog[]>(
    "/api/admin/audit-logs",
  );
  useAdminRealtime(refetch);

  const logs = data ?? [];

  const counts = useMemo(() => {
    const c = { all: logs.length, CREATE: 0, UPDATE: 0, DELETE: 0, OTHER: 0 };
    for (const log of logs) {
      c[actionCategory(log.action)] += 1;
    }
    return c;
  }, [logs]);

  const entityOptions = useMemo(() => {
    const set = new Set(logs.map((l) => l.entity));
    return ["all", ...Array.from(set).sort()];
  }, [logs]);

  const filtered = useMemo(() => {
    let rows = logs;
    if (actionFilter !== "all") {
      rows = rows.filter((l) => actionCategory(l.action) === actionFilter);
    }
    if (entityFilter !== "all") {
      rows = rows.filter((l) => l.entity === entityFilter);
    }
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
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);

  const toggleAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((l) => l.id)));
    }
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
    <div className="mx-auto w-full min-w-0 max-w-5xl space-y-4">
      {/* Top filters */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-muted-foreground">
            Filters
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="text-muted-foreground">
            Last 7 days
          </Button>
          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="h-9 w-[10rem] text-sm">
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
            <SelectTrigger className="h-9 w-[9rem] text-sm">
              <span>
                {actionFilter === "all" ? "All actions" : actionFilter}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="CREATE">CREATE</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
              <SelectItem value="OTHER">OTHER</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selected.size > 0 && (
          <Button variant="primary" size="sm" className="bg-brand-600 hover:bg-brand-700">
            Action ({selected.size})
          </Button>
        )}
      </div>

      {/* Ring stats */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-muted/20 p-3">
        <div className="flex min-w-max items-start justify-between gap-2 px-1">
          {ACTION_FILTERS.map((f) => (
            <RingStat
              key={f.id}
              label={f.label}
              count={counts[f.id]}
              total={counts.all || 1}
              color={f.color}
              active={actionFilter === f.id}
              onClick={() => {
                setActionFilter(f.id);
                setPage(1);
              }}
            />
          ))}
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
              {rangeStart}-{rangeEnd} out of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
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
                      checked={
                        paginated.length > 0 &&
                        selected.size === paginated.length
                      }
                      onChange={toggleAll}
                      className="rounded border-border"
                      aria-label="Select all"
                    />
                  </th>
                  <th className="px-2 py-3 font-medium">Date</th>
                  <th className="px-2 py-3 font-medium">User</th>
                  <th className="w-12 px-2 py-3 font-medium">Org</th>
                  <th className="px-2 py-3 font-medium">Activity</th>
                  <th className="w-32 px-4 py-3 text-right font-medium sm:px-5">
                    Actions
                  </th>
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
                        isSelected
                          ? "bg-card shadow-md"
                          : "hover:bg-muted/30",
                      )}
                    >
                      <td
                        className="px-4 py-4 sm:px-5"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                        <p className="font-medium text-foreground">
                          {row.userName ?? "System"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.entity}
                        </p>
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
                        <p className="font-medium text-foreground">
                          {logTitle(row)}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {logSnippet(row)}
                        </p>
                      </td>
                      <td
                        className="px-4 py-4 sm:px-5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2 text-muted-foreground">
                          <Lock className="h-3.5 w-3.5" />
                          {actionCategory(row.action) === "DELETE" ? (
                            <XIcon className="h-3.5 w-3.5" />
                          ) : (
                            <Minus className="h-3.5 w-3.5" />
                          )}
                          <Cloud className="h-3.5 w-3.5" />
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full",
                              actionStatusColor(row.action),
                            )}
                          />
                          <button
                            type="button"
                            className="rounded p-1 hover:bg-muted"
                            onClick={() =>
                              router.push(`/admin/audit-logs/${row.id}`)
                            }
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
            Last synced {formatDate(new Date().toISOString(), "relative")} ·{" "}
            {counts.all} total events on platform
          </div>
        )}
      </div>
    </div>
  );
}
