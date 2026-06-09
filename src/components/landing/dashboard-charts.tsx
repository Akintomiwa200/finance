export function DashboardCharts({ compact = false }: { compact?: boolean }) {
  const h = compact ? 40 : 60;
  return (
    <svg
      viewBox={`0 0 180 ${h}`}
      className="w-full"
      style={{ height: h }}
      aria-hidden="true"
    >
      <rect x="10" y={h - 20} width="14" height="20" rx="2" fill="#4F7EF7" opacity="0.6" />
      <rect x="28" y={h - 32} width="14" height="32" rx="2" fill="#4F7EF7" />
      <rect x="46" y={h - 24} width="14" height="24" rx="2" fill="#4F7EF7" opacity="0.7" />
      <rect x="64" y={h - 36} width="14" height="36" rx="2" fill="#FF5555" />
      <rect x="82" y={h - 28} width="14" height="28" rx="2" fill="#4F7EF7" opacity="0.8" />
      <rect x="100" y={h - 38} width="14" height="38" rx="2" fill="#4F7EF7" />
      <rect x="118" y={h - 22} width="14" height="22" rx="2" fill="#4F7EF7" opacity="0.6" />
      <rect x="136" y={h - 30} width="14" height="30" rx="2" fill="#4F7EF7" opacity="0.7" />
      <rect x="154" y={h - 34} width="14" height="34" rx="2" fill="#4F7EF7" />
    </svg>
  );
}
