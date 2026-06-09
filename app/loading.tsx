export default function Loading() {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "var(--lp-bg, #1a1a1a)",
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ animation: "pulse 1.2s ease-in-out infinite" }}
      >
        <path d="M16 0L4 8V24L16 32L28 24V8L16 0Z" fill="var(--lp-red, #ff5555)" />
        <path d="M16 4L8 9V23L16 28L24 23V9L16 4Z" fill="var(--lp-red-dark, #cc0000)" />
      </svg>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
