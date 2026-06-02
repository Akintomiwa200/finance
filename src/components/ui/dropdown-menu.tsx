"use client";

import { useState, useRef, useEffect, Children, cloneElement, isValidElement, createContext, useContext } from "react";
import { cn } from "@/src/lib/utils";

interface DropdownMenuContextValue {
  open: boolean;
  toggle: () => void;
  close: () => void;
}

const DropdownCtx = createContext<DropdownMenuContextValue>(null!);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <DropdownCtx.Provider value={{ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) }}>
        {children}
      </DropdownCtx.Provider>
    </div>
  );
}

export function DropdownMenuTrigger({ children, asChild, ...props }: any) {
  const { toggle } = useContext(DropdownCtx);
  const child = Children.only(children);
  if (asChild && isValidElement(child)) {
    return cloneElement(child as React.ReactElement<any>, {
      ...(child as React.ReactElement<any>).props,
      ...props,
      onClick: (e: React.MouseEvent) => {
        toggle();
        (child as React.ReactElement<any>).props.onClick?.(e);
      },
    });
  }
  return <button onClick={toggle} {...props}>{children}</button>;
}

export function DropdownMenuContent({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "end";
}) {
  const { open } = useContext(DropdownCtx);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 min-w-[12rem] rounded-lg border border-border bg-background shadow-lg py-1",
        align === "end" ? "right-0" : "left-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const { close } = useContext(DropdownCtx);
  return (
    <button
      onClick={() => {
        close();
        onClick?.();
      }}
      className={cn(
        "flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <hr className={cn("border-border my-1", className)} />;
}
