export function HomeFeatures() {
  return (
    <section className="features-section">
      <div className="features-phone-wrap" style={{ position: "relative" }}>
        <div className="features-blob" />
        <div className="orb-circle" style={{ width: 320, height: 320, borderColor: "rgba(255,255,255,0.08)" }} />
        <div className="orb-circle" style={{ width: 240, height: 240, borderColor: "rgba(255,255,255,0.1)" }} />
        <div className="orb-circle" style={{ width: 160, height: 160, borderColor: "rgba(255,255,255,0.12)" }} />
        <div className="phone-frame" style={{ width: 220, height: 440, position: "relative", zIndex: 3, margin: "0 auto" }}>
          <div className="phone-notch" />
          <div className="phone-screen">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" }}>
              <span className="phone-hello">Hello <span>Sami</span></span>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f093fb,#f5576c)", fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
            </div>
            <div className="phone-card">
              <div className="phone-card-top">
                <span className="phone-card-logo">🔥 uifry</span>
                <span className="phone-card-visa">VISA</span>
              </div>
              <div className="phone-card-number">0000 8888 2222 3333</div>
              <div className="phone-card-bottom"><span>---</span><span>07/24</span></div>
            </div>
            <div className="phone-stats">
              <div className="phone-stat"><div className="phone-stat-label">↑ Expense</div><div className="phone-stat-val">$4,264</div></div>
              <div className="phone-stat"><div className="phone-stat-label">↓ Income</div><div className="phone-stat-val">$3,897</div></div>
            </div>
            <div className="phone-tx-item">
              <div className="phone-tx-avatar" />
              <div className="phone-tx-info">
                <div className="phone-tx-amount">$560.00</div>
                <div className="phone-tx-name">From Adam</div>
              </div>
              <span className="phone-on-hold">On Hold</span>
            </div>
            <div className="phone-tx-section-label">Transaction</div>
            <div className="phone-nav">
              <span className="phone-nav-item active">🏠</span>
              <span className="phone-nav-item">💳</span>
              <span className="phone-nav-item" style={{ background: "#ff4444", borderRadius: "50%", color: "#fff", padding: "4px", fontSize: "0.8rem" }}>⚡</span>
              <span className="phone-nav-item">📊</span>
              <span className="phone-nav-item">⚙️</span>
            </div>
          </div>
        </div>
      </div>

      <div className="features-right">
        <div className="section-label-tag">FEATURES</div>
        <h2 className="features-h2">Uifry Premium</h2>
        {[
          { icon: "✦", title: "Budgeting Intervals", desc: "Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor." },
          { icon: "⊞", title: "Budgeting Intervals", desc: "Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor." },
          { icon: "⊟", title: "Budgeting Intervals", desc: "Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor." },
        ].map((f, i) => (
          <div key={i} className="feature-item">
            <div className="feature-item-head">
              <div className="feature-icon-box" style={{ color: "#ff4444" }}>{f.icon}</div>
              <span className="feature-item-title">{f.title}</span>
            </div>
            <p className="feature-item-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
