const BAR_HEIGHTS = [20, 32, 24, 36, 28, 38, 22, 30, 34];

export function DashboardCharts({
  compact = false,
  highlightIndex = -1,
}: {
  compact?: boolean;
  highlightIndex?: number;
}) {
  const h = compact ? 40 : 60;
  const barWidth = 14;
  const gap = 4;
  const startX = 10;

  return (
    <svg
      viewBox={`0 0 180 ${h}`}
      className="w-full"
      style={{ height: h }}
      aria-hidden="true"
    >
      {BAR_HEIGHTS.map((barHeight, index) => {
        const x = startX + index * (barWidth + gap);
        const isHighlighted = highlightIndex >= 0 && index === highlightIndex;
        const fill = isHighlighted ? "#FF5555" : "#4F7EF7";
        const opacity = isHighlighted ? 1 : 0.55 + (index % 3) * 0.15;

        return (
          <rect
            key={index}
            x={x}
            y={h - barHeight}
            width={barWidth}
            height={barHeight}
            rx="2"
            fill={fill}
            opacity={opacity}
            className="transition-all duration-300"
          />
        );
      })}
    </svg>
  );
}
