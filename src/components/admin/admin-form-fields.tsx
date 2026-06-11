"use client";

import { cn } from "@/src/lib/utils";

export function FieldAvatar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FormFieldRow({
  avatar,
  title,
  hint,
  children,
  trailing,
}: {
  avatar: React.ReactNode;
  title: string;
  hint?: string;
  children: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-border/70 py-4 last:border-b-0">
      {avatar}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2 sm:gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {hint && (
              <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
            )}
          </div>
          {trailing && <div className="shrink-0">{trailing}</div>}
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
