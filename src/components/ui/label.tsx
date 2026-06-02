import { cn } from "@/src/lib/utils";

interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export function Label({ children, className, htmlFor }: LabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium text-foreground", className)}>
      {children}
    </label>
  );
}
