"use client";

import { useState } from "react";

export function HomeFooter() {
  const [email, setEmail] = useState("");

  return (
    <footer className="footer">
      <div className="footer-top">
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

        <div>
          <div className="footer-col-title">Links</div>
          <ul className="footer-links">
            <li><a href="#">Home</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Bookings</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Legal</div>
          <ul className="footer-links">
            <li><a href="#">Terms Of Use</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>

        <div>
          <div className="footer-col-title">Product</div>
          <ul className="footer-links">
            <li><a href="#">Take Tour</a></li>
            <li><a href="#">Live Chat</a></li>
            <li><a href="#">Reveiws</a></li>
          </ul>
        </div>

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
  );
}
