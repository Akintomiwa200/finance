import { forwardRef } from "react";
import { cn } from "@/src/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={textareaId}>{label}</label>}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "min-h-[80px] px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-danger focus:ring-red-500",
            className,
          )}
          {...props}
        />
        {error && <span className="form-error">{error}</span>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
