import { cn } from "@/src/lib/utils";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
  emptyState?: React.ReactNode;
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  onRowClick,
  className,
  emptyState,
}: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && emptyState ? (
            <tr>
              <td colSpan={columns.length}>{emptyState}</td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr
                key={(item.id as string) || idx}
                onClick={() => onRowClick?.(item)}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => (
                  <td key={col.header} className={col.className}>
                    {typeof col.accessorKey === "function"
                      ? col.accessorKey(item)
                      : (item[col.accessorKey] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
