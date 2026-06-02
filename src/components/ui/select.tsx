import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={selectId}>{label}</label>}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            error && "border-danger",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
