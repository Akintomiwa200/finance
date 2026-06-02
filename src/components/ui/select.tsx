"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/src/lib/utils";

interface SelectContextValue {
  value: string;
  open: boolean;
  toggle: () => void;
  close: () => void;
  select: (v: string) => void;
  selectedLabel: string;
  setSelectedLabel: (v: string) => void;
}

const SelectCtx = createContext<SelectContextValue>(null!);

// ─── Select (root) ──────────────────────────────────────────────────────────

export function Select({
  value: controlledValue,
  onValueChange,
  defaultValue,
  children,
  className,
}: {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const select = useCallback(
    (val: string) => {
      if (onValueChange) onValueChange(val);
      setInternalValue(val);
      setOpen(false);
    },
    [onValueChange],
  );

  const ctx: SelectContextValue = {
    value,
    open,
    toggle: () => setOpen((v) => !v),
    close: () => setOpen(false),
    select,
    selectedLabel,
    setSelectedLabel,
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <SelectCtx.Provider value={ctx}>{children}</SelectCtx.Provider>
    </div>
  );
}

// ─── SelectTrigger ──────────────────────────────────────────────────────────

export function SelectTrigger({
  children,
  className,
  id,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  [key: string]: any;
}) {
  const { toggle } = useContext(SelectCtx);
  return (
    <button type="button" id={id} onClick={toggle} className={cn("flex h-10 w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring", className)} {...props}>
      {children}
    </button>
  );
}

// ─── SelectValue ────────────────────────────────────────────────────────────

export function SelectValue({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const { value, selectedLabel } = useContext(SelectCtx);
  return <span className={cn(value ? "text-foreground" : "text-muted-foreground", className)}>{selectedLabel || placeholder}</span>;
}

// ─── SelectContent ──────────────────────────────────────────────────────────

export function SelectContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useContext(SelectCtx);
  if (!open) return null;
  return (
    <div className={cn("absolute z-50 mt-1 w-full rounded-lg border border-border bg-background shadow-lg py-1", className)}>
      {children}
    </div>
  );
}

// ─── SelectItem ─────────────────────────────────────────────────────────────

export function SelectItem({
  children,
  value,
  className,
}: {
  children: React.ReactNode;
  value: string;
  className?: string;
}) {
  const { value: selectedValue, select, setSelectedLabel, close } = useContext(SelectCtx);
  const active = selectedValue === value;
  return (
    <button
      type="button"
      onClick={() => {
        setSelectedLabel(typeof children === "string" ? children : "");
        select(value);
        close();
      }}
      className={cn("flex w-full items-center px-3 py-2 text-sm transition-colors", active ? "bg-muted font-medium text-foreground" : "text-foreground hover:bg-muted", className)}
    >
      {children}
    </button>
  );
}
