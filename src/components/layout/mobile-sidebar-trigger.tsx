"use client";

import { Menu, X } from "lucide-react";
import { useMobileSidebarOptional } from "@/src/context/mobile-sidebar-context";
import { cn } from "@/src/lib/utils";

interface MobileSidebarTriggerProps {
  className?: string;
  variant?: "default" | "admin";
}

export function MobileSidebarTrigger({
  className,
  variant = "default",
}: MobileSidebarTriggerProps) {
  const ctx = useMobileSidebarOptional();
  if (!ctx) return null;

  const { isOpen, toggle } = ctx;

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors md:hidden",
        variant === "admin"
          ? "text-muted-foreground hover:text-foreground hover:bg-muted"
          : "text-muted-foreground hover:text-foreground hover:bg-surface-2",
        className,
      )}
      aria-label={isOpen ? "Close navigation" : "Open navigation"}
      aria-expanded={isOpen}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
