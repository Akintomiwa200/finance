// src/components/landing/landing-spark.tsx
// Replace the old CSS-span LandingSpark with the real Figma star SVG

export function LandingSpark({
  className = "",
  size = 52,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.952)}
      viewBox="0 0 61 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M30.4338 0L31.9386 29.9289L60.8676 22.1115L32.8685 32.7911L49.243 57.8885L30.4338 34.56L11.6247 57.8885L27.9991 32.7911L2.86102e-05 22.1115L28.9291 29.9289L30.4338 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
