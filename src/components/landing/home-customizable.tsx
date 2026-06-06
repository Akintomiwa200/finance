export function HomeCustomizable() {
  return (
    <section className="custom-section">
      <div className="custom-left" style={{ position: "relative" }}>
        <div className="custom-blob" />
        <span className="custom-star-bl" style={{ position: "absolute", bottom: 30, left: 20, fontSize: "1.6rem", color: "#111" }}>✳</span>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 270, height: 270, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 190, height: 190, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
        <div className="phone-frame" style={{ width: 220, height: 440, margin: "0 auto", position: "relative", zIndex: 3 }}>
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
              <div className="phone-card-bottom"><span>VALID THRU</span><span>07/24</span></div>
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
      <div className="custom-right" style={{ position: "relative" }}>
        <span style={{ position: "absolute", top: "-20px", right: "30px", fontSize: "1.3rem", color: "#111" }}>✳</span>
        <div className="custom-head">
          <div className="custom-icon-circle">✦</div>
          <h3 className="custom-h3">Fully Customizable</h3>
        </div>
        <p className="custom-desc">
          Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris Etiam Odio. Duis Tristique Lacus, Et Blandit Viverra Nisl Velit. Sed Mattis Rhoncus, Diam Suspendisse Sit Nunc, Gravida Eu. Lectus Eget Eget Ac Dolor Neque Lorem Sapien, Suspendisse Aliquam.
        </p>
        <span style={{ position: "absolute", bottom: "-20px", right: "0px", fontSize: "1.6rem", color: "#111" }}>✳</span>
      </div>
    </section>
  );
}
