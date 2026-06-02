import { cn } from "@/src/lib/utils";

interface FinancialCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  format?: "currency" | "percentage" | "number";
}

export function FinancialCard({
  label,
  value,
  change,
  changeLabel,
  icon,
}: FinancialCardProps) {
  const isPositive = change != null && change >= 0;
  const isNegative = change != null && change < 0;

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="stat-value">{value}</div>
      {(change != null || changeLabel) && (
        <div className="stat-change">
          {change != null && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5",
                isPositive && "text-success",
                isNegative && "text-danger"
              )}
            >
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                {isPositive ? (
                  <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
                ) : (
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                )}
              </svg>
              {Math.abs(change).toFixed(1)}%
            </span>
          )}
          {changeLabel && (
            <span className="text-muted-foreground">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
