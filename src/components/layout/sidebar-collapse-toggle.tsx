"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface SidebarCollapseToggleProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
  variant?: "default" | "admin";
}

export function SidebarCollapseToggle({
  collapsed,
  onToggle,
  className,
  variant = "default",
}: SidebarCollapseToggleProps) {
  const Icon = collapsed ? ChevronRight : ChevronLeft;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      className={cn(
        "shrink-0 inline-flex items-center justify-center rounded-md transition-all duration-200",
        "h-8 w-8",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        "active:scale-[0.97]",
        variant === "admin"
          ? "text-[var(--admin-nav-item-muted)] hover:text-[var(--admin-nav-item)] hover:bg-[var(--admin-nav-hover)]"
          : "text-muted hover:text-primary hover:bg-surface-2",
        className,
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
