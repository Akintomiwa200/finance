import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/utils";

export function PageHeaderSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Skeleton className="h-8 w-48 max-w-full rounded-lg" />
      <Skeleton className="h-4 w-72 max-w-full rounded-md" />
    </div>
  );
}

export function StatCardsSkeleton({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2",
        count >= 4 && "lg:grid-cols-4",
        count === 3 && "lg:grid-cols-3",
        count === 2 && "sm:grid-cols-2",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-[22px] border border-border bg-card p-5 shadow-sm space-y-3"
        >
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-lg" />
          <Skeleton className="h-3 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({
  rows = 6,
  columns = 5,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="border-b border-border px-4 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1 rounded-md" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="flex items-center gap-4 px-4 py-3.5">
            {Array.from({ length: columns }).map((_, col) => (
              <Skeleton
                key={col}
                className={cn(
                  "h-4 rounded-md",
                  col === 0 ? "w-[30%]" : "flex-1",
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card p-4 lg:block">
        <Skeleton className="mb-6 h-10 w-36 rounded-lg" />
        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </aside>
      <main className="min-w-0 flex-1">
        <Skeleton className="h-14 w-full rounded-none border-b border-border" />
        <div className="space-y-6 p-4 md:p-6">
          <PageHeaderSkeleton />
          <StatCardsSkeleton />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Skeleton className="h-72 rounded-[22px] lg:col-span-2" />
            <Skeleton className="h-72 rounded-[22px]" />
          </div>
          <TableSkeleton rows={5} columns={5} />
        </div>
      </main>
    </div>
  );
}

export function DashboardPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <PageHeaderSkeleton />
      <StatCardsSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-[22px] lg:col-span-2" />
        <div className="space-y-4">
          <Skeleton className="h-36 rounded-[22px]" />
          <Skeleton className="h-36 rounded-[22px]" />
        </div>
      </div>
      <TableSkeleton />
    </div>
  );
}

export function DashboardHomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageHeaderSkeleton />
        <div className="flex w-full gap-2 sm:w-auto">
          <Skeleton className="h-10 flex-1 rounded-lg sm:w-64" />
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
      <StatCardsSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-80 rounded-[22px]" />
          <Skeleton className="h-64 rounded-[22px]" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-[22px]" />
          <Skeleton className="h-48 rounded-[22px]" />
          <Skeleton className="h-40 rounded-[22px]" />
        </div>
      </div>
    </div>
  );
}

export function TransactionsListSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <PageHeaderSkeleton />
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Skeleton className="h-10 flex-1 rounded-lg sm:w-60" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
      <TableSkeleton rows={10} columns={6} />
    </div>
  );
}

export function TransactionDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-44 rounded-[22px]" />
      <Skeleton className="h-56 rounded-[22px]" />
      <Skeleton className="h-36 rounded-[22px]" />
    </div>
  );
}

export function SupportTicketDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeaderSkeleton className="flex-1" />
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-40 rounded-[22px]" />
          <Skeleton className="h-64 rounded-[22px]" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 rounded-[22px]" />
          <Skeleton className="h-36 rounded-[22px]" />
        </div>
      </div>
    </div>
  );
}

export function LiveFixSessionSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-[420px] rounded-[22px] lg:col-span-2" />
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-[22px]" />
          <Skeleton className="h-48 rounded-[22px]" />
          <Skeleton className="h-40 rounded-[22px]" />
        </div>
      </div>
    </div>
  );
}

export function FormCardSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="rounded-[22px] border border-border bg-card p-5 shadow-sm space-y-4">
      <Skeleton className="h-5 w-40 rounded-md" />
      <Skeleton className="h-3 w-64 rounded-md" />
      <div className="space-y-4 pt-2">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

export const AdminShellSkeleton = DashboardShellSkeleton;

export const AdminPageSkeleton = DashboardPageSkeleton;

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn("min-h-[140px] w-full rounded-xl", className)}
    />
  );
}

export function ListRowsSkeleton({
  rows = 6,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("divide-y divide-border", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-40 max-w-full rounded-md" />
            <Skeleton className="h-3 w-56 max-w-full rounded-md" />
          </div>
          <Skeleton className="h-8 w-20 shrink-0 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function AdminDetailPageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 rounded-[22px]" />
      <StatCardsSkeleton count={3} />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-[22px]" />
        ))}
      </div>
      <TableSkeleton rows={5} columns={4} />
    </div>
  );
}

export function AdminSettingsFormSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <div className="space-y-5">
      {Array.from({ length: cards }).map((_, i) => (
        <FormCardSkeleton key={i} fields={i === 0 ? 3 : 4} />
      ))}
    </div>
  );
}

export function AdminCardGridSkeleton({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-5 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="min-h-[22rem] rounded-[22px] sm:min-h-[24rem]"
        />
      ))}
    </div>
  );
}

export function AdminPermissionsMatrixSkeleton({
  rows = 8,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return <TableSkeleton rows={rows} columns={columns} />;
}

export const AdminSupportTicketDetailSkeleton = SupportTicketDetailSkeleton;

export function ProfilePageSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <div className="space-y-6">
        <div className="rounded-[22px] border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="mt-4 h-5 w-32 rounded-md" />
            <Skeleton className="mt-2 h-4 w-40 rounded-md" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-36 rounded-[22px]" />
      </div>
      <div className="space-y-6">
        <FormCardSkeleton fields={5} />
        <FormCardSkeleton fields={3} />
      </div>
    </div>
  );
}

export function NotificationListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-[22px]" />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[22px] border border-border bg-card p-4 space-y-3"
          >
            <Skeleton className="h-4 w-24 rounded-md" />
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotificationDetailSkeleton() {
  return (
    <div className="rounded-[22px] border border-border bg-card p-6 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <Skeleton className="h-7 w-2/3 max-w-md rounded-lg" />
      <Skeleton className="h-4 w-40 rounded-md" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
}
