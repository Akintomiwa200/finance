import { cn } from "@/src/lib/utils";

// ─── Shadcn-style sub-components ───────────────────────────────────────────

export function Table({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full">{children}</table>
    </div>
  );
}

export function TableHeader({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <thead className={cn("border-b border-border", className)}>{children}</thead>;
}

export function TableBody({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <tbody className={cn("divide-y divide-border", className)}>{children}</tbody>;
}

export function TableRow({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <tr className={cn("hover:bg-muted/50 transition-colors", className)}>{children}</tr>;
}

export function TableHead({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={cn("h-10 px-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", className)}>
      {children}
    </th>
  );
}

export function TableCell({ children, className, colSpan }: { children?: React.ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={cn("p-4 text-sm", className)}>{children}</td>;
}
