export function HomeAdvantages() {
  return (
    <section className="advantages-section">
      <div className="advantages-left">
        <div className="advantages-label">ADVATNAGES</div>
        <h2 className="advantages-h2">Why Choose Uifry?</h2>
        <div className="adv-feature-head">
          <div className="adv-icon-circle">🔔</div>
          <span className="adv-feature-title">Clever Notifications</span>
        </div>
        <p className="adv-feature-desc">
          Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris Etiam Odio. Duis Tristique Lacus, Et Blandit Viverra Nisl Velit. Sed Mattis Rhoncus, Diam Suspendisse Sit Nunc, Gravida Eu. Lectus Eget Eget Ac Dolor Neque Lorem Sapien, Suspendisse Aliquam.
        </p>
      </div>
      <div className="advantages-right">
        <div className="adv-blob" />
        <div className="adv-star" style={{ position: "absolute", top: 20, right: 10, fontSize: "1.8rem", color: "#111" }}>✳</div>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 270, height: 270, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 190, height: 190, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
        <div className="phone-frame" style={{ width: 200, height: 400, margin: "0 auto", position: "relative", zIndex: 3 }}>
          <div className="phone-notch" />
          <div className="phone-screen" style={{ padding: "36px 12px 12px", background: "#f8f8fa" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2px" }}>
              <button style={{ background: "none", border: "none", fontSize: "0.75rem", color: "#111", cursor: "pointer" }}>←</button>
              <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>Activity</span>
              <div />
            </div>
            <div style={{ display: "flex", gap: 12, margin: "10px 0 8px" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#111", borderBottom: "2px solid #ff4444", paddingBottom: "2px" }}>Income</span>
              <span style={{ fontSize: "0.7rem", color: "#aaa" }}>Expenses</span>
            </div>
            <div style={{ fontSize: "0.6rem", color: "#aaa", marginBottom: "4px" }}>18 – 23 May</div>
            <div style={{ position: "relative", height: "60px", marginBottom: "10px" }}>
              <svg viewBox="0 0 180 60" style={{ width: "100%", height: "100%" }}>
                <path d="M0 50 C30 45 40 20 70 25 S110 10 140 18 S170 30 180 28" fill="none" stroke="#4F7EF7" strokeWidth="2" />
                <circle cx="90" cy="22" r="5" fill="#4F7EF7" />
                <rect x="72" y="8" width="42" height="14" rx="4" fill="#111" />
                <text x="93" y="18" fontSize="6" fill="#fff" textAnchor="middle">$2,366</text>
              </svg>
            </div>
            <div className="phone-tx-item" style={{ marginBottom: "8px" }}>
              <div className="phone-tx-avatar" />
              <div className="phone-tx-info">
                <div className="phone-tx-amount">$560.00</div>
                <div className="phone-tx-name">From Adam</div>
              </div>
              <span className="phone-on-hold">On Hold</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "0.6rem", borderTop: "1px solid #eee" }}>
              <span style={{ color: "#aaa" }}>Transaction  22 May ▶</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", padding: "4px 0" }}>
              <span style={{ color: "#666" }}>Limit</span>
              <span style={{ fontWeight: 700 }}>$1,000</span>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", fontSize: "0.55rem", color: "#aaa" }}>Per Av.</div>
            <svg viewBox="0 0 180 30" style={{ width: "100%", height: "30px", marginTop: "4px" }}>
              <path d="M0 15 C30 5 40 25 70 15 S110 5 140 15 S170 25 180 15" fill="none" stroke="#ff4444" strokeWidth="2" />
            </svg>
            <div className="phone-nav">
              <span className="phone-nav-item">🏠</span>
              <span className="phone-nav-item">💳</span>
              <span className="phone-nav-item" style={{ background: "#ff4444", borderRadius: "50%", color: "#fff", padding: "3px", fontSize: "0.75rem" }}>⚡</span>
              <span className="phone-nav-item active">📊</span>
              <span className="phone-nav-item">⚙️</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
