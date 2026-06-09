"use client";

import { Children, cloneElement, useEffect, useRef, useState, isValidElement } from "react";
import { cn } from "@/src/lib/utils";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open: controlledOpen, onOpenChange, onClose, title, children, className }: DialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const open = controlledOpen ?? internalOpen;

  const close = () => {
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
    setInternalOpen(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Split children: DialogTrigger goes outside modal, DialogContent goes inside
  let trigger: React.ReactNode = null;
  let contentChild: React.ReactNode = null;
  let contentClassName = "";

  Children.forEach(children, (child) => {
    if (isValidElement(child) && (child.type as any)?.displayName === "DialogTrigger") {
      trigger = child;
    } else if (isValidElement(child) && (child.type as any)?.displayName === "DialogContent") {
      contentChild = (child as React.ReactElement<any>).props.children;
      contentClassName = (child as React.ReactElement<any>).props.className || "";
    } else {
      contentChild = child;
    }
  });

  return (
    <>
      {trigger &&
        cloneElement(trigger as React.ReactElement<any>, {
          onClick: (e: React.MouseEvent) => {
            if (onOpenChange) onOpenChange(true);
            setInternalOpen(true);
            (trigger as React.ReactElement<any>).props.onClick?.(e);
          },
        })}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => e.target === overlayRef.current && close()}
        >
          <div className={cn("bg-background border border-border rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto", contentClassName)}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">{title || ""}</h2>
              <button onClick={close} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted" aria-label="Close">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {contentChild}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DialogTrigger({ children, asChild, ...props }: any) {
  const child = Children.only(children);
  if (asChild && isValidElement(child)) {
    return cloneElement(child as React.ReactElement<any>, { ...(child as React.ReactElement<any>).props, ...props });
  }
  return <button {...props}>{children}</button>;
}
DialogTrigger.displayName = "DialogTrigger";

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <>{children}</>;
}
DialogContent.displayName = "DialogContent";

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-end gap-2 mt-6", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground mt-1", className)}>{children}</p>;
}
