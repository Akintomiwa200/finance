"use client";

import { useState } from "react";

export default function UifryLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }

        /* ── STAR DECORATION ── */
        .star {
          display: inline-block;
          font-size: inherit;
          line-height: 1;
          color: #111;
          font-weight: 300;
        }
        .star-svg {
          width: 28px; height: 28px; flex-shrink: 0;
        }

        /* ── NAVBAR ── */
        .navbar {
          position: sticky; top: 0; z-index: 50;
          background: #fff;
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 80px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .navbar-logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 1.2rem; font-weight: 800; color: #111; letter-spacing: -0.02em;
          text-decoration: none;
        }
        .navbar-logo-icon {
          width: 32px; height: 32px;
          background: #ff4444;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .navbar-logo-tm {
          font-size: 0.6rem; font-weight: 400; vertical-align: super; color: #999;
        }
        .navbar-links {
          display: flex; align-items: center; gap: 40px; list-style: none;
        }
        .navbar-links a {
          text-decoration: none; font-size: 0.9rem; font-weight: 500; color: #333;
          transition: color 0.2s;
        }
        .navbar-links a.active { color: #ff4444; }
        .navbar-links a:hover { color: #ff4444; }
        .navbar-download {
          background: #111; color: #fff; border: none;
          padding: 12px 28px; border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          transition: background 0.2s;
        }
        .navbar-download:hover { background: #333; }

        /* ── HERO ── */
        .hero {
          background: #fff;
          min-height: calc(100vh - 73px);
          display: flex; align-items: center;
          padding: 60px 80px 0;
          position: relative;
          overflow: hidden;
        }
        .hero-left {
          flex: 0 0 500px; max-width: 500px;
          position: relative; z-index: 2;
          padding-bottom: 80px;
        }
        .hero-h1 {
          font-size: 3.6rem; font-weight: 800;
          line-height: 1.08; letter-spacing: -0.03em;
          color: #111; margin-bottom: 20px;
        }
        .hero-sub {
          font-size: 0.9rem; color: #888; line-height: 1.7;
          max-width: 400px; margin-bottom: 36px; font-weight: 400;
        }
        .hero-buttons {
          display: flex; align-items: center; gap: 24px;
        }
        .btn-get-started {
          background: #111; color: #fff; border: none;
          padding: 14px 28px; border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; gap: 8px;
          transition: background 0.2s;
        }
        .btn-get-started:hover { background: #333; }
        .btn-watch-video {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem; font-weight: 500; color: #333;
          transition: color 0.2s;
        }
        .btn-watch-video:hover { color: #ff4444; }
        .btn-watch-icon {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid #111;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
        }
        /* red blob bg */
        .hero-blob-red {
          position: absolute;
          width: 340px; height: 340px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,80,80,0.38) 0%, rgba(255,160,80,0.18) 50%, transparent 70%);
          pointer-events: none;
        }
        /* star decorations */
        .hero-star-tl { position: absolute; top: 80px; left: 60px; font-size: 1.6rem; color: #111; font-weight: 300; pointer-events: none; }
        .hero-star-bl { position: absolute; bottom: 200px; left: 220px; font-size: 1.2rem; color: #111; pointer-events: none; }
        .hero-star-br { position: absolute; bottom: 60px; right: 80px; font-size: 1.6rem; color: #111; pointer-events: none; }

        /* phone mockup right */
        .hero-right {
          flex: 1; display: flex; align-items: flex-end; justify-content: center;
          position: relative; padding-bottom: 0;
          min-height: 520px;
        }

        /* phone frame */
        .phone-frame {
          background: #fff;
          border-radius: 42px;
          border: 2px solid #e0e0e0;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08);
          overflow: hidden;
          position: relative;
        }
        .phone-notch {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 100px; height: 26px;
          background: #111; border-radius: 0 0 18px 18px; z-index: 10;
        }

        /* phone 1 (main, left) */
        .phone-main {
          width: 220px; height: 440px;
          position: relative; z-index: 3;
          margin-right: -40px;
          margin-bottom: 20px;
        }
        /* phone 2 (secondary, right) */
        .phone-secondary {
          width: 200px; height: 400px;
          position: relative; z-index: 2;
          margin-bottom: 0;
          transform: rotate(6deg);
          transform-origin: bottom center;
        }

        /* phone screen content */
        .phone-screen {
          padding: 36px 14px 14px;
          height: 100%;
          display: flex; flex-direction: column; gap: 10px;
          background: #fff;
        }
        .phone-hello { font-size: 0.75rem; font-weight: 600; color: #111; }
        .phone-hello span { font-weight: 800; }
        .phone-card {
          background: #111; border-radius: 14px;
          padding: 14px; color: #fff;
        }
        .phone-card-top {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 12px;
        }
        .phone-card-logo { font-size: 0.6rem; font-weight: 700; display: flex; align-items: center; gap: 4px; }
        .phone-card-visa { font-size: 0.85rem; font-weight: 700; font-style: italic; }
        .phone-card-number { font-size: 0.62rem; letter-spacing: 0.1em; color: #aaa; margin-bottom: 8px; }
        .phone-card-bottom { display: flex; justify-content: space-between; font-size: 0.55rem; color: #aaa; }
        .phone-stats {
          display: flex; gap: 10px;
        }
        .phone-stat { flex: 1; }
        .phone-stat-label { font-size: 0.55rem; color: #aaa; }
        .phone-stat-val { font-size: 0.75rem; font-weight: 700; color: #111; }
        .phone-tx-item {
          display: flex; align-items: center; gap: 8px;
          padding: 8px; background: #f9f9f9; border-radius: 10px;
        }
        .phone-tx-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: linear-gradient(135deg, #ff9966, #ff5e62);
          flex-shrink: 0;
        }
        .phone-tx-info { flex: 1; }
        .phone-tx-amount { font-size: 0.75rem; font-weight: 700; }
        .phone-tx-name { font-size: 0.6rem; color: #888; }
        .phone-on-hold {
          background: #ff4444; color: #fff;
          font-size: 0.45rem; padding: 2px 5px; border-radius: 4px; font-weight: 600;
        }
        .phone-tx-section-label { font-size: 0.65rem; font-weight: 600; color: #111; }
        .phone-nav {
          display: flex; justify-content: space-around; padding: 8px 0 4px;
          border-top: 1px solid #f0f0f0; margin-top: auto;
        }
        .phone-nav-item { font-size: 1rem; }
        .phone-nav-item.active { color: #ff4444; }

        /* ribbon banner */
        .hero-ribbon-wrap {
          position: absolute; bottom: 0; left: -20px;
          width: 560px; z-index: 5;
          transform: rotate(-12deg);
          transform-origin: bottom left;
        }
        .ribbon-black {
          background: #111; color: #fff;
          padding: 14px 28px;
          display: flex; align-items: center; gap: 20px;
          font-size: 0.72rem; font-weight: 500;
          border-radius: 4px 4px 0 0;
          white-space: nowrap; overflow: hidden;
        }
        .ribbon-black-sep { width: 1px; height: 28px; background: rgba(255,255,255,0.2); flex-shrink: 0; }
        .ribbon-red {
          background: #ff4444; color: #fff;
          padding: 11px 24px;
          display: flex; align-items: center; gap: 12px;
          font-size: 0.72rem; font-weight: 600;
          border-radius: 0 0 4px 4px;
        }

        /* ── FEATURES SECTION (dark) ── */
        .features-section {
          background: #2D2A32;
          padding: 80px;
          display: flex; align-items: center; gap: 80px;
          position: relative; overflow: hidden;
        }
        .features-phone-wrap {
          flex: 0 0 280px;
          position: relative;
        }
        .features-blob {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 280px; height: 280px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,160,60,0.5) 0%, rgba(255,80,60,0.3) 40%, transparent 70%);
          pointer-events: none;
        }
        /* orbital circles */
        .orb-circle {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.12);
          pointer-events: none;
        }
        .features-right { flex: 1; }
        .section-label-tag {
          font-size: 0.72rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: #ff4444; margin-bottom: 10px;
        }
        .features-h2 {
          font-size: 2.6rem; font-weight: 800;
          letter-spacing: -0.025em; color: #fff;
          margin-bottom: 36px; line-height: 1.1;
        }
        .feature-item { margin-bottom: 28px; }
        .feature-item-head {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 8px;
        }
        .feature-icon-box {
          width: 36px; height: 36px; border-radius: 8px;
          background: rgba(255,68,68,0.15); border: 1.5px solid rgba(255,68,68,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0;
        }
        .feature-item-title {
          font-size: 1rem; font-weight: 700; color: #fff;
        }
        .feature-item-desc {
          font-size: 0.82rem; color: #aaa; line-height: 1.65;
          max-width: 400px;
        }

        /* ── ADVANTAGES SECTION (white) ── */
        .advantages-section {
          background: #fff;
          padding: 80px;
          display: flex; align-items: center; gap: 80px;
          position: relative; overflow: hidden;
          min-height: 500px;
        }
        .advantages-left { flex: 1; }
        .advantages-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #ff4444; margin-bottom: 10px; }
        .advantages-h2 {
          font-size: 2.6rem; font-weight: 800;
          letter-spacing: -0.025em; color: #111;
          margin-bottom: 32px; line-height: 1.1;
        }
        .adv-feature-head {
          display: flex; align-items: center; gap: 14px; margin-bottom: 12px;
        }
        .adv-icon-circle {
          width: 48px; height: 48px; border-radius: 50%;
          background: #ff4444;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem; color: #fff; flex-shrink: 0;
        }
        .adv-feature-title { font-size: 1.15rem; font-weight: 700; color: #111; }
        .adv-feature-desc { font-size: 0.85rem; color: #666; line-height: 1.7; max-width: 440px; }
        .advantages-right {
          flex: 0 0 360px; position: relative;
        }
        .adv-blob {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,80,80,0.22) 0%, rgba(255,160,60,0.12) 50%, transparent 70%);
          pointer-events: none;
        }
        .adv-star { position: absolute; top: 20px; right: 10px; font-size: 1.8rem; }

        /* ── CUSTOMIZABLE SECTION (white) ── */
        .custom-section {
          background: #fff;
          padding: 80px;
          display: flex; align-items: center; gap: 80px;
          position: relative; overflow: hidden;
          border-top: 1px solid #f5f5f5;
        }
        .custom-left {
          flex: 0 0 360px; position: relative;
        }
        .custom-blob {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,160,60,0.22) 0%, rgba(255,80,80,0.12) 50%, transparent 70%);
          pointer-events: none;
        }
        .custom-right { flex: 1; }
        .custom-head {
          display: flex; align-items: center; gap: 14px; margin-bottom: 20px;
        }
        .custom-icon-circle {
          width: 52px; height: 52px; border-radius: 50%;
          background: #ff4444;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; color: #fff; flex-shrink: 0;
        }
        .custom-h3 { font-size: 1.5rem; font-weight: 800; color: #111; letter-spacing: -0.02em; }
        .custom-desc { font-size: 0.85rem; color: #666; line-height: 1.7; max-width: 420px; }
        .custom-star-bl { position: absolute; bottom: 30px; left: 20px; font-size: 1.6rem; }
        .custom-star-tr { position: absolute; top: 30px; right: 30px; font-size: 1.2rem; }

        /* ── TESTIMONIALS (white) ── */
        .testimonials-section {
          background: #fff;
          padding: 80px;
          position: relative; overflow: hidden;
          border-top: 1px solid #f5f5f5;
        }
        .test-header { text-align: center; margin-bottom: 60px; }
        .test-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #888; margin-bottom: 10px; }
        .test-h2 { font-size: 2.6rem; font-weight: 800; letter-spacing: -0.025em; color: #111; line-height: 1.1; }
        .test-body { display: flex; align-items: center; gap: 60px; }
        /* orbital avatar cluster */
        .test-orbit-wrap {
          flex: 0 0 400px; height: 420px;
          position: relative;
        }
        .test-orbit-blob {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 220px; height: 220px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,80,80,0.3) 0%, rgba(255,160,60,0.15) 50%, transparent 70%);
          pointer-events: none;
        }
        .test-orbit-circle {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%; border: 1px solid rgba(0,0,0,0.08);
          pointer-events: none;
        }
        .test-avatar {
          position: absolute;
          width: 72px; height: 72px; border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          object-fit: cover; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; font-weight: 700; color: #fff;
        }
        .test-avatar.center {
          width: 120px; height: 120px;
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          font-size: 2rem;
          border: 4px solid #fff;
          z-index: 5;
        }
        .test-quote-badge {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-10px, 30px);
          width: 44px; height: 44px; border-radius: 50%;
          background: #ff4444; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; font-weight: 800; z-index: 6;
          box-shadow: 0 4px 12px rgba(255,68,68,0.4);
        }
        /* right side */
        .test-right { flex: 1; }
        .test-quote-title { font-size: 1.3rem; font-weight: 800; color: #111; margin-bottom: 14px; letter-spacing: -0.02em; }
        .test-quote-text { font-size: 0.88rem; color: #555; line-height: 1.75; margin-bottom: 24px; }
        .test-avatars-row {
          display: flex; gap: -8px; margin-bottom: 12px;
        }
        .test-mini-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          border: 2px solid #fff;
          margin-right: -8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 600; color: #fff;
        }
        .test-name { font-size: 0.9rem; font-weight: 700; color: #111; margin-top: 14px; }
        .test-star { position: absolute; bottom: 60px; left: 80px; font-size: 1.3rem; }

        /* ── FAQ (dark) ── */
        .faq-section {
          background: #2D2A32;
          padding: 80px;
          position: relative; overflow: hidden;
        }
        .faq-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #ff4444; margin-bottom: 10px; }
        .faq-h2 { font-size: 2.4rem; font-weight: 800; letter-spacing: -0.025em; color: #fff; line-height: 1.1; margin-bottom: 40px; }
        .faq-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
        }
        .faq-card {
          border-radius: 12px; padding: 24px 26px; cursor: pointer;
          transition: all 0.2s;
        }
        .faq-card.light { background: #fff; }
        .faq-card.colored { background: #ff4444; }
        .faq-card-title {
          font-size: 1rem; font-weight: 700; margin-bottom: 10px;
          line-height: 1.25;
        }
        .faq-card.light .faq-card-title { color: #111; }
        .faq-card.colored .faq-card-title { color: #fff; }
        .faq-card-text { font-size: 0.82rem; line-height: 1.6; }
        .faq-card.light .faq-card-text { color: #555; }
        .faq-card.colored .faq-card-text { color: rgba(255,255,255,0.82); }
        .faq-star-tr { position: absolute; top: 60px; right: 80px; font-size: 2rem; color: #fff; }
        .faq-star-br { position: absolute; bottom: 40px; right: 80px; font-size: 2rem; color: #fff; }
        .faq-blob {
          position: absolute; bottom: -60px; left: -40px;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,80,80,0.45) 0%, rgba(255,160,60,0.2) 50%, transparent 70%);
          pointer-events: none;
        }

        /* ── CTA (white bg, black card) ── */
        .cta-outer {
          background: #fff;
          padding: 80px;
          position: relative; overflow: hidden;
        }
        .cta-red-blob {
          position: absolute; top: 20px; left: -30px;
          width: 260px; height: 260px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,80,80,0.38) 0%, rgba(255,160,60,0.18) 50%, transparent 70%);
          pointer-events: none;
        }
        .cta-card {
          background: #111; border-radius: 24px;
          padding: 60px 60px;
          display: flex; align-items: center; justify-content: space-between;
          position: relative; overflow: hidden;
          min-height: 280px;
        }
        .cta-orb-circle {
          position: absolute;
          border-radius: 50%; border: 1px solid rgba(255,255,255,0.08);
          pointer-events: none;
        }
        .cta-star1 { position: absolute; top: 40px; left: 50%; font-size: 1.4rem; color: rgba(255,255,255,0.6); }
        .cta-star2 { position: absolute; bottom: 50px; right: 200px; font-size: 1.1rem; color: rgba(255,255,255,0.4); }
        .cta-left { position: relative; z-index: 2; max-width: 360px; }
        .cta-h2 { font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 14px; letter-spacing: -0.025em; }
        .cta-desc { font-size: 0.85rem; color: #aaa; line-height: 1.65; margin-bottom: 32px; }
        .btn-download-app {
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #111; border: none;
          padding: 12px 24px; border-radius: 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.9rem; font-weight: 700; cursor: pointer;
          transition: opacity 0.2s;
        }
        .btn-download-app:hover { opacity: 0.88; }
        .cta-phones {
          position: relative; z-index: 2;
          display: flex; align-items: flex-end; gap: -20px;
        }

        /* ── FOOTER ── */
        .footer {
          background: #2D2A32;
          padding: 60px 80px 32px;
        }
        .footer-top {
          display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr 1.6fr;
          gap: 40px; margin-bottom: 48px;
        }
        .footer-logo-col {}
        .footer-logo {
          display: flex; align-items: center; gap: 8px;
          font-size: 1.1rem; font-weight: 800; color: #fff;
          margin-bottom: 16px;
        }
        .footer-logo-icon {
          width: 28px; height: 28px; background: #ff4444;
          border-radius: 6px; display: flex; align-items: center; justify-content: center;
          font-size: 0.875rem;
        }
        .footer-contact { display: flex; flex-direction: column; gap: 8px; }
        .footer-contact-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.82rem; color: #aaa;
        }
        .footer-contact-icon {
          width: 26px; height: 26px; border-radius: 6px;
          background: rgba(255,68,68,0.15); border: 1px solid rgba(255,68,68,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.65rem; flex-shrink: 0;
        }
        .footer-col-title { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 20px; }
        .footer-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .footer-links a { color: #aaa; text-decoration: none; font-size: 0.85rem; transition: color 0.2s; }
        .footer-links a:hover { color: #fff; }
        .footer-newsletter-desc { font-size: 0.82rem; color: #aaa; margin-bottom: 16px; }
        .footer-email-row { display: flex; gap: 0; }
        .footer-email-input {
          flex: 1; padding: 12px 16px;
          background: #fff; border: none; outline: none;
          border-radius: 8px 0 0 8px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem; color: #111;
        }
        .footer-email-input::placeholder { color: #999; }
        .footer-subscribe-btn {
          background: #111; color: #fff; border: none;
          padding: 12px 20px; border-radius: 0 8px 8px 0;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          transition: background 0.2s; white-space: nowrap;
        }
        .footer-subscribe-btn:hover { background: #333; }
        .footer-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin-bottom: 24px; }
        .footer-bottom { display: flex; justify-content: center; }
        .footer-copy { font-size: 0.8rem; color: #aaa; }

        /* orbital circle helper */
        .orb { position: absolute; border-radius: 50%; border: 1px solid; pointer-events: none; }

        /* responsive */
        @media (max-width: 1024px) {
          .navbar { padding: 16px 32px; }
          .hero { padding: 40px 32px 0; }
          .hero-h1 { font-size: 2.6rem; }
          .features-section, .advantages-section, .custom-section,
          .testimonials-section, .faq-section, .cta-outer, .footer { padding: 60px 32px; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
        }
        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .hero { flex-direction: column; }
          .hero-left { flex: none; max-width: 100%; }
          .hero-right { min-height: 300px; }
          .features-section, .advantages-section, .custom-section { flex-direction: column; }
          .faq-grid { grid-template-columns: 1fr; }
          .test-body { flex-direction: column; }
          .footer-top { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ━━━━━━━━━━━━━━━━ NAVBAR ━━━━━━━━━━━━━━━━ */}
      <nav className="navbar">
        <a href="#" className="navbar-logo">
          <div className="navbar-logo-icon">🔥</div>
          uifry<span className="navbar-logo-tm">™</span>
        </a>
        <ul className="navbar-links">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Pricing</a></li>
          <li><a href="#">Features</a></li>
        </ul>
        <button className="navbar-download">Download</button>
      </nav>

      {/* ━━━━━━━━━━━━━━━━ HERO ━━━━━━━━━━━━━━━━ */}
      <section className="hero">
        {/* bg glow blobs */}
        <div className="hero-blob-red" style={{ top: "60px", left: "160px", width: "300px", height: "300px" }} />

        {/* star decorations */}
        <span className="hero-star-tl">✳</span>
        <span className="hero-star-bl">✳</span>
        <span className="hero-star-br">✳</span>

        {/* LEFT */}
        <div className="hero-left">
          <h1 className="hero-h1">
            Make The Best<br />Financial Decisions
          </h1>
          <p className="hero-sub">
            Cum Et Convallis Risus Placerat Aliquam, Nunc. Scelerisque Aliquet Faucibus Tincidunt Eu Adipiscing Sociis Arcu Lorem Porttitor.
          </p>
          <div className="hero-buttons">
            <button className="btn-get-started">Get Started →</button>
            <button className="btn-watch-video">
              <div className="btn-watch-icon">▶</div>
              Watch Video
            </button>
          </div>
        </div>

        {/* RIGHT — phone mockups */}
        <div className="hero-right">
          {/* orbital circles behind phones */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "420px", height: "420px", borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "300px", height: "300px", borderRadius: "50%", border: "1px solid rgba(0,0,0,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "20px", right: "10px", width: "200px", height: "200px", borderRadius: "50%", border: "1px solid rgba(0,0,0,0.06)", pointerEvents: "none" }} />

          {/* red glow */}
          <div style={{ position: "absolute", bottom: "30px", right: "60px", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,80,80,0.3) 0%, rgba(255,160,60,0.15) 50%, transparent 70%)", pointerEvents: "none" }} />

          {/* Phone 1 — main */}
          <div className="phone-frame phone-main" style={{ position: "relative", zIndex: 3 }}>
            <div className="phone-notch" />
            <div className="phone-screen">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "4px" }}>
                <span className="phone-hello">Hello <span>Sami</span></span>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#f093fb,#f5576c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem" }}>👤</div>
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
                <div className="phone-stat">
                  <div className="phone-stat-label">↑ Expense</div>
                  <div className="phone-stat-val">$4,264</div>
                </div>
                <div className="phone-stat">
                  <div className="phone-stat-label">↓ Income</div>
                  <div className="phone-stat-val">$3,897</div>
                </div>
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

          {/* Phone 2 — secondary (behind, rotated) */}
          <div className="phone-frame phone-secondary" style={{ position: "absolute", right: "30px", bottom: "20px", zIndex: 2 }}>
            <div className="phone-notch" />
            <div className="phone-screen" style={{ padding: "36px 12px 12px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#f093fb,#f5576c)", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>
              </div>
              <div style={{ fontSize: "0.6rem", color: "#aaa", margin: "8px 0 4px" }}>15 May</div>
              <div className="phone-card" style={{ padding: "10px 12px" }}>
                <div className="phone-card-top" style={{ marginBottom: "6px" }}>
                  <span className="phone-card-logo" style={{ fontSize: "0.55rem" }}>🔥</span>
                  <span className="phone-card-visa" style={{ fontSize: "0.7rem" }}>VISA</span>
                </div>
                <div className="phone-card-number" style={{ fontSize: "0.52rem" }}>•••• •••• 2222 3333</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: "0.6rem" }}>
                <span style={{ color: "#aaa" }}>Amount</span>
                <span style={{ fontWeight: 700, color: "#111" }}>$1,000</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "0.5rem", color: "#aaa" }}>Per day</span>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                <span className="phone-on-hold">On Hold</span>
              </div>
              <div className="phone-tx-section-label" style={{ marginTop: "8px" }}>Transaction</div>
              <div className="phone-nav" style={{ marginTop: "auto" }}>
                <span className="phone-nav-item">🏠</span>
                <span className="phone-nav-item">💳</span>
                <span className="phone-nav-item" style={{ background: "#ff4444", borderRadius: "50%", color: "#fff", padding: "3px", fontSize: "0.75rem" }}>⚡</span>
                <span className="phone-nav-item active">📊</span>
                <span className="phone-nav-item">⚙️</span>
              </div>
            </div>
          </div>
        </div>

        {/* ribbon diagonal banner */}
        <div className="hero-ribbon-wrap">
          <div className="ribbon-black">
            <span style={{ fontSize: "1.2rem" }}>🏆</span>
            <div>
              <div style={{ color: "#aaa", fontSize: "0.6rem", marginBottom: "2px" }}>Achievements</div>
              <div>Best Finance App On Playstore</div>
            </div>
            <div className="ribbon-black-sep" />
            <div>
              <div style={{ color: "#aaa", fontSize: "0.6rem", marginBottom: "2px" }}>Finance</div>
              <div>Most Popular Accounting App</div>
            </div>
            <div className="ribbon-black-sep" />
            <div style={{ fontStyle: "italic", color: "#aaa", fontSize: "0.65rem", maxWidth: "120px", overflow: "hidden", whiteSpace: "nowrap" }}>Make The Best Financial D...</div>
          </div>
          <div className="ribbon-red">
            <span style={{ fontSize: "1rem" }}>✳</span>
            <div>
              <div style={{ fontSize: "0.65rem", opacity: 0.8 }}>Uifry Premium</div>
              <div style={{ fontWeight: 700 }}>Free Trial</div>
            </div>
          </div>
        </div>
      </section>

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
