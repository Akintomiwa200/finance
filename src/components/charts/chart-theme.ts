export const CHART_COLORS = [
  "var(--accent-500)",
  "var(--accent-400)",
  "var(--success)",
  "var(--warning)",
  "var(--danger)",
  "var(--info)",
  "#8b5cf6",
  "#ec4899",
];

export function getChartTooltipStyle(): React.CSSProperties {
  return {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    fontSize: "13px",
    color: "var(--text-primary)",
  };
}

export function getChartGridColor(): string {
  return "var(--border)";
}

export function getChartAxisColor(): string {
  return "var(--text-muted)";
}
