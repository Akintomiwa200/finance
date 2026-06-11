"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export function RadioGroup({
  className,
  value,
  onValueChange,
  defaultValue,
  children,
  ...props
}: {
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const currentValue = value ?? internalValue;

  const handleChange = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onValueChange: handleChange }}>
      <div role="radiogroup" className={cn("grid gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

export function RadioGroupItem({
  value,
  className,
  id,
  disabled,
  ...props
}: {
  value: string;
  className?: string;
  id?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext(RadioGroupContext);
  const selected = ctx.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      id={id}
      disabled={disabled}
      className={cn(
        "h-4 w-4 shrink-0 rounded-full border border-border ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected && "border-brand-600 bg-brand-600",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={() => !disabled && ctx.onValueChange?.(value)}
      {...props}
    />
  );
}
