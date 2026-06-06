export function HomeTestimonials() {
  return (
    <section className="testimonials-section">
      <div className="test-header">
        <div className="test-label">TESTIMONIAL</div>
        <h2 className="test-h2">What Our Users<br />Say About Us?</h2>
      </div>
      <div className="test-body">
        <div className="test-orbit-wrap">
          <div className="test-orbit-blob" />
          <div className="test-orbit-circle" style={{ width: 380, height: 380, borderColor: "rgba(0,0,0,0.07)" }} />
          <div className="test-orbit-circle" style={{ width: 280, height: 280, borderColor: "rgba(0,0,0,0.07)" }} />
          <div className="test-orbit-circle" style={{ width: 190, height: 190, borderColor: "rgba(0,0,0,0.07)" }} />
          <div className="test-avatar center" style={{ background: "linear-gradient(135deg,#667eea,#764ba2)" }}>😎</div>
          <div className="test-quote-badge">"</div>
          <div className="test-avatar" style={{ top: "30px", left: "80px", background: "linear-gradient(135deg,#f093fb,#f5576c)", width: 60, height: 60, fontSize: "1.2rem" }}>👩</div>
          <div className="test-avatar" style={{ top: "40px", right: "80px", background: "linear-gradient(135deg,#4facfe,#00f2fe)", width: 68, height: 68, fontSize: "1.3rem" }}>👨</div>
          <div className="test-avatar" style={{ bottom: "40px", left: "60px", background: "linear-gradient(135deg,#43e97b,#38f9d7)", width: 72, height: 72, fontSize: "1.4rem" }}>🧑</div>
          <div className="test-avatar" style={{ bottom: "50px", right: "60px", background: "linear-gradient(135deg,#fa709a,#fee140)", width: 64, height: 64, fontSize: "1.2rem" }}>👱</div>
        </div>

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
  );
}
