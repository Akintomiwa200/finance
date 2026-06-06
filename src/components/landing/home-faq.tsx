const faqItems = [
  { colored: true,  q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
  { colored: false, q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
  { colored: false, q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
  { colored: true,  q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
  { colored: true,  q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
  { colored: false, q: "The Best Financial Accounting App Ever!", a: "Arcu At Dictum Sapien, Mollis. Vulputate Sit Id Accumsan, Ultricies. In Ultrices Malesuada Elit Mauris." },
];

export function HomeFaq() {
  return (
    <section className="faq-section">
      <div className="faq-blob" />
      <span className="faq-star-tr">✳</span>
      <span className="faq-star-br">✳</span>
      <div className="faq-label">FAQ</div>
      <h2 className="faq-h2">Frequently Asked<br />Questions</h2>
      <div className="faq-grid">
        {faqItems.map((item, i) => (
          <div key={i} className={`faq-card ${item.colored ? "colored" : "light"}`}>
            <div className="faq-card-title">{item.q}</div>
            <div className="faq-card-text">"{item.a}"</div>
          </div>
        ))}
      </div>
    </section>
  );
}
