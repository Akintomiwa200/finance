export function HomeCta() {
  return (
    <section className="cta-outer">
      <div className="cta-red-blob" />
      <span style={{ position: "absolute", top: "40px", right: "80px", fontSize: "1.8rem", color: "#111" }}>✳</span>
      <span style={{ position: "absolute", bottom: "40px", left: "80px", fontSize: "1.2rem", color: "#111" }}>✳</span>
      <div className="cta-card">
        <div className="cta-orb-circle" style={{ width: 360, height: 360, bottom: "-100px", left: "30%", borderColor: "rgba(255,255,255,0.06)" }} />
        <div className="cta-orb-circle" style={{ width: 260, height: 260, bottom: "-60px", left: "32%", borderColor: "rgba(255,255,255,0.06)" }} />
        <span className="cta-star1">✳</span>
        <span className="cta-star2">✳</span>
        <div className="cta-left">
          <h2 className="cta-h2">Ready To Get Started?</h2>
          <p className="cta-desc">Risus Habitant Leo Egestas Mauris Diam Eget Morbi Tempus Vulputate.</p>
          <button className="btn-download-app">
            Download App 🍎
          </button>
        </div>
        <div className="cta-phones" style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "flex-end", gap: "-16px" }}>
          <div className="phone-frame" style={{ width: 180, height: 360, position: "relative", zIndex: 3 }}>
            <div className="phone-notch" />
            <div className="phone-screen" style={{ background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2px" }}>
                <span className="phone-hello">Hello <span>Sami</span></span>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#f093fb,#f5576c)", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
              </div>
              <div className="phone-card" style={{ padding: "10px 12px" }}>
                <div className="phone-card-top" style={{ marginBottom: "6px" }}>
                  <span className="phone-card-logo">🔥 uifry</span>
                  <span className="phone-card-visa">VISA</span>
                </div>
                <div className="phone-card-number" style={{ fontSize: "0.55rem" }}>0000 8888 2222 3333</div>
              </div>
              <div style={{ fontSize: "0.6rem", color: "#888", margin: "6px 0 2px" }}>Today</div>
              {[
                { icon: "🎬", name: "Netflix", amt: "-29.49", color: "#E50914" },
                { icon: "🌸", name: "Adam Sha6", amt: "+206.00", color: "#ff9966" },
                { icon: "☕", name: "Starbucks", amt: "-18.00", color: "#00704A" },
              ].map((tx, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 0", borderBottom: "1px solid #f5f5f5", fontSize: "0.65rem" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "8px", background: `${tx.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", flexShrink: 0 }}>{tx.icon}</div>
                  <span style={{ flex: 1, fontWeight: 500, color: "#111" }}>{tx.name}</span>
                  <span style={{ fontWeight: 700, color: tx.amt.startsWith("+") ? "#22c55e" : "#ef4444" }}>{tx.amt}</span>
                </div>
              ))}
              <div className="phone-tx-section-label" style={{ marginTop: "8px" }}>Transaction</div>
              <div className="phone-nav" style={{ marginTop: "auto" }}>
                <span className="phone-nav-item active">🏠</span>
                <span className="phone-nav-item">💳</span>
                <span className="phone-nav-item" style={{ background: "#ff4444", borderRadius: "50%", color: "#fff", padding: "3px", fontSize: "0.75rem" }}>⚡</span>
                <span className="phone-nav-item">📊</span>
                <span className="phone-nav-item">⚙️</span>
              </div>
            </div>
          </div>
          <div className="phone-frame" style={{ width: 160, height: 320, position: "relative", zIndex: 2, marginLeft: "-20px", transform: "rotate(5deg)", transformOrigin: "bottom center" }}>
            <div className="phone-notch" />
            <div className="phone-screen" style={{ background: "#f8f8fa", padding: "32px 10px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", marginBottom: "6px" }}>
                <span style={{ color: "#aaa" }}>← Card Details</span>
              </div>
              <div className="phone-card" style={{ padding: "8px 10px" }}>
                <div className="phone-card-top" style={{ marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.55rem" }}>🔥</span>
                  <span style={{ fontSize: "0.7rem", fontStyle: "italic", fontWeight: 700, color: "#fff" }}>VISA</span>
                </div>
                <div style={{ fontSize: "0.5rem", letterSpacing: "0.08em", color: "#aaa" }}>•••• 2222 3333</div>
              </div>
              <div style={{ margin: "6px 0", fontSize: "0.6rem", color: "#aaa" }}>25 May →</div>
              <svg viewBox="0 0 140 40" style={{ width: "100%", height: "35px" }}>
                <path d="M0 30 C20 25 30 10 50 18 S80 8 100 12 S125 20 140 15" fill="none" stroke="#4F7EF7" strokeWidth="1.5" />
                <circle cx="75" cy="10" r="4" fill="#ff4444" />
              </svg>
              <div className="phone-tx-section-label" style={{ fontSize: "0.6rem", marginTop: "4px" }}>Transaction</div>
              <div className="phone-nav" style={{ marginTop: "auto" }}>
                <span style={{ fontSize: "0.8rem" }}>🏠</span>
                <span style={{ fontSize: "0.8rem" }}>💳</span>
                <span style={{ fontSize: "0.8rem" }}>📊</span>
                <span style={{ fontSize: "0.8rem" }}>⚙️</span>
              </div>
            </div>
          </div>
          <div className="phone-frame" style={{ width: 140, height: 280, position: "relative", zIndex: 2, marginLeft: "-14px", transform: "rotate(10deg)", transformOrigin: "bottom center" }}>
            <div className="phone-notch" />
            <div className="phone-screen" style={{ background: "#fff", padding: "30px 10px 10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", color: "#aaa", marginBottom: "6px" }}>
                <span>← Activity</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: "6px" }}>
                <span style={{ fontSize: "0.6rem", fontWeight: 700, color: "#111", borderBottom: "2px solid #ff4444", paddingBottom: "1px" }}>Income</span>
                <span style={{ fontSize: "0.6rem", color: "#aaa" }}>Expenses</span>
              </div>
              <svg viewBox="0 0 120 40" style={{ width: "100%", height: "35px" }}>
                <path d="M0 30 C20 20 30 10 50 18 S80 5 100 12 S115 20 120 15" fill="none" stroke="#4F7EF7" strokeWidth="1.5" />
                <path d="M0 35 C25 30 40 38 60 32 S90 40 120 35" fill="none" stroke="#ff4444" strokeWidth="1.5" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", padding: "4px 0", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ color: "#888" }}>Transaction</span>
                <span style={{ fontWeight: 700 }}>$1,000</span>
              </div>
              <div className="phone-nav" style={{ marginTop: "auto" }}>
                <span style={{ fontSize: "0.75rem" }}>🏠</span>
                <span style={{ fontSize: "0.75rem" }}>💳</span>
                <span style={{ fontSize: "0.75rem", color: "#ff4444" }}>📊</span>
                <span style={{ fontSize: "0.75rem" }}>⚙️</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
