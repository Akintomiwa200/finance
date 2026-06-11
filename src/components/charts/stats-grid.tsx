import { FinancialCard } from "@/src/components/charts/financial-card";

export interface StatItem {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 1 | 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridClass =
    columns === 1
      ? "grid-cols-1"
      : columns === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : columns === 3
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {stats.map((stat) => (
        <FinancialCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          changeLabel={stat.changeLabel}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
