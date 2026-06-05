"use client";

import { useState } from "react";
import { HomeHero } from "@/src/components/landing/home-hero";
import { HomeNavbar } from "@/src/components/landing/home-navbar";
import "@/src/styles/uifry-landing-sections.css";

export default function UifryLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  return (
    <div className="uifry-landing font-sans">
      <div className="mx-[18px] mt-1">
        <div className="uifry-top overflow-hidden rounded-t-[24px] bg-white md:rounded-t-[32px] lg:rounded-t-[40px]">
          <HomeNavbar />
          <HomeHero />
        </div>
      </div>
      {/* ━━━━━━━━━━━━━━━━ FEATURES (dark) ━━━━━━━━━━━━━━━━ */}
      <section className="features-section">
        <div className="features-phone-wrap" style={{ position: "relative" }}>
          <div className="features-blob" />
          {/* orbital rings */}
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

      {/* ━━━━━━━━━━━━━━━━ ADVANTAGES (white) ━━━━━━━━━━━━━━━━ */}
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
          {/* orbital rings */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 270, height: 270, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 190, height: 190, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
          {/* Activity phone */}
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
              {/* mini chart */}
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
              {/* red wave */}
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

      {/* ━━━━━━━━━━━━━━━━ CUSTOMIZABLE (white) ━━━━━━━━━━━━━━━━ */}
      <section className="custom-section">
        <div className="custom-left" style={{ position: "relative" }}>
          <div className="custom-blob" />
          <span className="custom-star-bl" style={{ position: "absolute", bottom: 30, left: 20, fontSize: "1.6rem", color: "#111" }}>✳</span>
          {/* orbital rings */}
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

      {/* ━━━━━━━━━━━━━━━━ TESTIMONIALS ━━━━━━━━━━━━━━━━ */}
      <section className="testimonials-section">
        <div className="test-header">
          <div className="test-label">TESTIMONIAL</div>
          <h2 className="test-h2">What Our Users<br />Say About Us?</h2>
        </div>
        <div className="test-body">
          {/* orbital avatar cluster */}
          <div className="test-orbit-wrap">
            <div className="test-orbit-blob" />
            <div className="test-orbit-circle" style={{ width: 380, height: 380, borderColor: "rgba(0,0,0,0.07)" }} />
            <div className="test-orbit-circle" style={{ width: 280, height: 280, borderColor: "rgba(0,0,0,0.07)" }} />
            <div className="test-orbit-circle" style={{ width: 190, height: 190, borderColor: "rgba(0,0,0,0.07)" }} />
            {/* center avatar */}
            <div className="test-avatar center" style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>😎</div>
            <div className="test-quote-badge">"</div>
            {/* surrounding avatars */}
            <div className="test-avatar" style={{ top: "30px", left: "80px", background: "linear-gradient(135deg,#f093fb,#f5576c)", width: 60, height: 60, fontSize: "1.2rem" }}>👩</div>
            <div className="test-avatar" style={{ top: "40px", right: "80px", background: "linear-gradient(135deg,#4facfe,#00f2fe)", width: 68, height: 68, fontSize: "1.3rem" }}>👨</div>
            <div className="test-avatar" style={{ bottom: "40px", left: "60px", background: "linear-gradient(135deg,#43e97b,#38f9d7)", width: 72, height: 72, fontSize: "1.4rem" }}>🧑</div>
            <div className="test-avatar" style={{ bottom: "50px", right: "60px", background: "linear-gradient(135deg,#fa709a,#fee140)", width: 64, height: 64, fontSize: "1.2rem" }}>👱</div>
          </div>

          {/* right quote */}
          <div className="test-right">
            <h3 className="test-quote-title">The Best Financial Accounting App Ever!</h3>
            <p className="test-quote-text">
              "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris Etiam Odio. Duis Tristique Lacus, Et Blandit Viverra Nisl Velit. Sed Mattis Rhoncus, Diam Suspendisse Sit Nunc, Gravida Eu. Lectus Eget Eget Ac Dolor Neque Lorem Sapien, Suspendisse Aliquam."
            </p>
            <div style={{ display: "flex" }}>
              {[
                "linear-gradient(135deg,#667eea,#764ba2)",
                "linear-gradient(135deg,#f093fb,#f5576c)",
                "linear-gradient(135deg,#4facfe,#00f2fe)",
                "linear-gradient(135deg,#43e97b,#38f9d7)",
                "linear-gradient(135deg,#fa709a,#fee140)",
              ].map((bg, i) => (
                <div key={i} className="test-mini-avatar" style={{ background: bg, fontSize: "0.8rem" }}>
                  {["😎","👩","👨","🧑","👱"][i]}
                </div>
              ))}
            </div>
            <div className="test-name">Nick Jonas</div>
          </div>
        </div>
        <span className="test-star" style={{ position: "absolute", bottom: "60px", left: "80px", fontSize: "1.3rem", color: "#111" }}>✳</span>
      </section>

      {/* ━━━━━━━━━━━━━━━━ FAQ (dark) ━━━━━━━━━━━━━━━━ */}
      <section className="faq-section">
        <div className="faq-blob" />
        <span className="faq-star-tr">✳</span>
        <span className="faq-star-br">✳</span>
        <div className="faq-label">FAQ</div>
        <h2 className="faq-h2">Frequently Asked<br />Questions</h2>
        <div className="faq-grid">
          {[
            { colored: true,  q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
            { colored: false, q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
            { colored: false, q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
            { colored: true,  q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
            { colored: true,  q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
            { colored: false, q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
          ].map((item, i) => (
            <div key={i} className={`faq-card ${item.colored ? "colored" : "light"}`}>
              <div className="faq-card-title">{item.q}</div>
              <div className="faq-card-text">"{item.a}"</div>
            </div>
          ))}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━ CTA ━━━━━━━━━━━━━━━━ */}
      <section className="cta-outer">
        <div className="cta-red-blob" />
        <span style={{ position: "absolute", top: "40px", right: "80px", fontSize: "1.8rem", color: "#111" }}>✳</span>
        <span style={{ position: "absolute", bottom: "40px", left: "80px", fontSize: "1.2rem", color: "#111" }}>✳</span>
        <div className="cta-card">
          {/* orbital circles */}
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
          {/* phones in CTA */}
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
                {/* mini chart */}
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

      {/* ━━━━━━━━━━━━━━━━ FOOTER ━━━━━━━━━━━━━━━━ */}
      <footer className="footer">
        <div className="footer-top">
          {/* Brand col */}
          <div className="footer-logo-col">
            <div className="footer-logo">
              <div className="footer-logo-icon">🔥</div>
              uifry<span style={{ fontSize: "0.55rem", fontWeight: 400, color: "#888", verticalAlign: "super" }}>™</span>
            </div>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <div className="footer-contact-icon">✉️</div>
                Help@Frybix.Com
              </div>
              <div className="footer-contact-item">
                <div className="footer-contact-icon">📞</div>
                +1234 456 678 89
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <div className="footer-col-title">Links</div>
            <ul className="footer-links">
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Bookings</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="footer-col-title">Legal</div>
            <ul className="footer-links">
              <li><a href="#">Terms Of Use</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <div className="footer-col-title">Product</div>
            <ul className="footer-links">
              <li><a href="#">Take Tour</a></li>
              <li><a href="#">Live Chat</a></li>
              <li><a href="#">Reveiws</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <div className="footer-col-title">Newsletter</div>
            <p className="footer-newsletter-desc">Stay Up To Date</p>
            <div className="footer-email-row">
              <input
                type="email"
                className="footer-email-input"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="footer-subscribe-btn">Subscribe</button>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />
        <div className="footer-bottom">
          <p className="footer-copy">Copyright 2022 Uifry.Com All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}
