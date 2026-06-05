export function LandingSpark({
  className = "",
  size = 44,
  inline = false,
}: {
  className?: string;
  size?: number;
  inline?: boolean;
}) {
  const arm = Math.round(size * 0.9);
  const cross = Math.round(size * 0.58);

  return (
    <span
      className={
        inline
          ? `relative inline-block shrink-0 ${className}`
          : `pointer-events-none absolute ${className}`
      }
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <span
        className="absolute left-1/2 top-1/2 w-[1.5px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black"
        style={{ height: arm }}
      />
      <span
        className="absolute left-1/2 top-1/2 w-[1.5px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-black"
        style={{ height: arm }}
      />
      <span
        className="absolute left-1/2 top-1/2 w-px -translate-x-1/2 -translate-y-1/2 bg-black"
        style={{ height: cross }}
      />
      <span
        className="absolute left-1/2 top-1/2 h-px -translate-x-1/2 -translate-y-1/2 bg-black"
        style={{ width: cross }}
      />
    </span>
  );
}
