"use client";

import { cn } from "@/src/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { EmptyState } from "@/src/components/ui/empty-state";
import { Input } from "@/src/components/ui/input";
import { TableSkeleton } from "@/src/components/layout/dashboard-skeletons";
import { Search } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T | ((row: T) => string);
  isLoading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  toolbar?: React.ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  isLoading,
  searchable,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  emptyTitle = "No data found",
  emptyDescription,
  emptyAction,
  toolbar,
  onRowClick,
  className,
}: DataTableProps<T>) {
  const getKey = (row: T): string => {
    if (typeof keyField === "function") return keyField(row);
    return String(row[keyField]);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {(searchable || toolbar) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {searchable && (
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
          {toolbar && <div className="flex items-center gap-2">{toolbar}</div>}
        </div>
      )}

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <TableSkeleton
            rows={6}
            columns={columns.length}
            className="rounded-none border-0"
          />
        ) : data.length === 0 ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            action={emptyAction}
            className="border-0 rounded-none"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key} className={col.className}>
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow
                    key={getKey(row)}
                    onClick={() => onRowClick?.(row)}
                    className={onRowClick ? "cursor-pointer" : undefined}
                  >
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.cell(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
