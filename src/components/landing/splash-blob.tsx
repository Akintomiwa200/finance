export function SplashBlob({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute z-0 h-[400px] w-[640px] bg-[radial-gradient(circle_at_50%_38%,rgba(255,85,85,0.52)_0_18%,rgba(255,85,85,0.26)_28%,transparent_62%),radial-gradient(circle_at_50%_82%,rgba(255,205,77,0.5)_0_12%,transparent_36%)] blur-[18px] max-md:scale-[0.4] max-md:opacity-30 ${className}`}
      aria-hidden="true"
    />
  );
}
