"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface NavbarSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder: string;
}

export function NavbarSearch({
  open,
  onOpenChange,
  query,
  onQueryChange,
  onSubmit,
  placeholder,
}: NavbarSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onOpenChange]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="flex w-[15vw] min-w-[11rem] max-w-xs shrink-0 items-center gap-1.5">
      <form onSubmit={onSubmit} className="relative min-w-0 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-3 text-sm text-foreground",
            "placeholder:text-muted-foreground focus:border-brand-500/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/20",
            "transition-all duration-300 ease-out",
          )}
        />
      </form>
      <button
        type="button"
        onClick={() => onOpenChange(false)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
        aria-label="Close search"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
