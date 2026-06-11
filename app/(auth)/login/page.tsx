"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useAuthStore } from "@/src/store/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [step, setStep] = useState<"email" | "password">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (step === "email") {
      const form = new FormData(e.currentTarget);
      const emailValue = form.get("email") as string;
      if (!emailValue) return;
      setEmail(emailValue);
      setError("");
      setStep("password");
    } else {
      setLoading(true);
      setError("");

      const form = new FormData(e.currentTarget);
      const password = form.get("password") as string;

      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setToken("authenticated");
          
          if (userData.role === "SUPER_ADMIN") {
            router.push("/admin/dashboard");
            return;
          }
        }

        router.push("/dashboard");
      } catch {
        setError("An unexpected error occurred");
        setLoading(false);
      }
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Euclid Circular A', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--lp-bg);
        }

        /* ── LEFT PANEL ── */
        .left-panel {
          width: 100%;
          max-width: 480px;
          flex-shrink: 0;
          background: var(--lp-card-bg);
          display: flex;
          flex-direction: column;
          padding: 40px 40px 48px;
          position: relative;
          z-index: 1;
        }

        /* Logo */
        .logo-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 28px;
        }
        .logo-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--lp-text);
          letter-spacing: -0.3px;
        }

        /* Heading */
        .login-heading {
          font-size: 28px;
          font-weight: 500;
          color: var(--lp-red-dark);
          line-height: 1.15;
          margin-bottom: 10px;
          letter-spacing: -0.3px;
        }

        .login-sub {
          font-size: 13px;
          color: var(--lp-text-muted);
          margin-bottom: 28px;
          line-height: 1.5;
        }
        .login-sub a {
          color: var(--lp-red-dark);
          font-weight: 600;
          text-decoration: none;
        }
        .login-sub a:hover {
          text-decoration: underline;
        }

        /* Social buttons */
        .social-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 16px;
          border: 1px solid var(--lp-border);
          border-radius: 6px;
          background: var(--lp-card-bg);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: var(--lp-text);
          transition: background 0.15s, border-color 0.15s;
          font-family: inherit;
          margin-bottom: 10px;
        }
        .social-btn:hover {
          background: var(--lp-card-alt);
          border-color: #889397;
        }
        .social-btn:last-child {
          margin-bottom: 0;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 24px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--lp-border);
        }
        .divider-text {
          font-size: 12px;
          color: var(--lp-text-muted);
          white-space: nowrap;
          font-weight: 400;
        }

        /* Form */
        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: var(--lp-text);
          margin-bottom: 5px;
          letter-spacing: 0.1px;
        }
        .field-input {
          width: 100%;
          padding: 8px 10px;
          border: 1px solid var(--lp-border);
          border-radius: 6px;
          font-size: 13px;
          color: var(--lp-text);
          background: var(--lp-card-bg);
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
          line-height: 1.5;
        }
        .field-input::placeholder {
          color: var(--lp-text-muted);
        }
        .field-input:focus {
          border-color: var(--lp-red-dark);
          box-shadow: 0 0 0 3px rgba(255, 85, 85, 0.15);
        }

        .submit-btn {
          width: 100%;
          margin-top: 24px;
          padding: 9px 16px;
          background: var(--lp-card-alt);
          color: var(--lp-text-muted);
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
        }
        .submit-btn:hover:not(:disabled) {
          background: #d1d5db;
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .back-btn {
          display: block;
          margin: 12px auto 0;
          background: none;
          border: none;
          color: var(--lp-text-muted);
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.15s;
        }
        .back-btn:hover {
          color: var(--lp-text);
        }

        .error-msg {
          margin-top: 10px;
          font-size: 12px;
          color: #CF4A22;
        }

        /* ── RIGHT PANEL ── */
        .right-panel {
          display: none;
          flex: 1;
          background: var(--lp-bg);
          position: relative;
          overflow: hidden;
        }

        /* The organic rounded-rectangle grid */
        .grid-pattern {
          position: absolute;
          inset: 0;
          display: grid;
          /* 5 cols × 4 rows of cells, shifted right */
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(4, 1fr);
          gap: 10px;
          padding: 10px;
          /* Only show the right ~60% of the panel */
          left: 40%;
          transform: rotate(-2deg) translateX(20px);
          transform-origin: center center;
        }

        .grid-cell {
          border-radius: 48px;
          background: transparent;
          border: 2.5px solid transparent;
        }

        /* Color palette — red shades */
        .c-bright   { background: #ff5555; border-color: #ff5555; }
        .c-mid      { background: #e63946; border-color: #e63946; }
        .c-dark     { background: #cc0000; border-color: #cc0000; }
        .c-darker   { background: #8b0000; border-color: #8b0000; }
        .c-outline  { background: transparent; border-color: #ff5555; }
        .c-faint    { background: #2a1115; border-color: #2a1115; }

        /* Radial glow overlay */
        .glow-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 70% 70% at 70% 40%,
            rgba(255, 85, 85, 0.28) 0%,
            rgba(204, 0, 0, 0.10) 50%,
            transparent 80%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Right panel content */
        .right-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 52px;
          max-width: 420px;
          height: 100%;
        }

        .right-heading {
          font-size: 34px;
          font-weight: 700;
          color: var(--lp-text);
          line-height: 1.15;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }

        .right-body {
          font-size: 14px;
          color: var(--lp-text-muted);
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .right-promo {
          font-size: 14px;
          color: var(--lp-text);
          margin-bottom: 20px;
        }
        .right-promo strong {
          color: var(--lp-text);
          font-weight: 700;
        }

        .right-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          font-weight: 500;
          color: var(--lp-text);
          text-decoration: underline;
          text-underline-offset: 3px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          padding: 0;
          transition: opacity 0.15s;
        }
        .right-cta:hover {
          opacity: 0.75;
        }

        /* Chat bubble */
        .chat-bubble {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 3;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--lp-card-bg);
          border: 1px solid var(--lp-border);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s;
        }
        .chat-bubble:hover {
          background: var(--lp-card-alt);
        }

        /* ── RESPONSIVE ── */
        @media (min-width: 768px) {
          .right-panel {
            display: flex;
          }
        }

        @media (max-width: 767px) {
          .left-panel {
            max-width: 340px;
            margin: auto;
            padding: 32px 24px 40px;
            border-radius: 16px;
            justify-content: center;
          }
          .login-heading {
            font-size: 24px;
          }
        }

        @media (min-width: 768px) {
          .logo-wrap {
            margin-bottom: 36px;
          }
          .login-heading {
            margin-bottom: 14px;
          }
          .login-sub {
            margin-bottom: 36px;
          }
          .social-btn {
            margin-bottom: 14px;
          }
          .divider {
            margin: 28px 0;
          }
          .field-label {
            margin-bottom: 8px;
          }
          .submit-btn {
            margin-top: 32px;
          }
        }

        @media (min-width: 1280px) {
          .left-panel {
            padding: 48px 56px 56px;
          }
          .right-heading {
            font-size: 40px;
          }
          .right-content {
            padding: 56px 64px;
          }
        }
      `}</style>

      <div className="login-root">
        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          {/* Logo */}
          <Link
            href="/"
            className="logo-wrap"
            style={{ textDecoration: "none" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 0L4 8V24L16 32L28 24V8L16 0Z" fill="var(--lp-red)" />
              <path
                d="M16 4L8 9V23L16 28L24 23V9L16 4Z"
                fill="var(--lp-red-dark)"
              />
            </svg>
            <span className="logo-text">uifry</span>
          </Link>

          {/* Heading */}
          <h1 className="login-heading">Log in to your account</h1>
          {/*<p className="login-sub">
            Don't have an account? <Link href="/register">Sign Up</Link>
          </p>*/}

          {/* Social buttons */}
          <button
            className="social-btn"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          {/* <button className="social-btn" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--lp-text)">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02a9.68 9.68 0 0 1 2.5-.34c.85.01 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
            </svg>
            GitHub
          </button> */}

          {/* Divider */}
          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Or with email and password</span>
            <div className="divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                className="field-input"
                placeholder=""
                required
                autoFocus
              />
            </div>

            {step === "password" && (
              <div style={{ marginTop: 16 }}>
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className="field-input"
                  placeholder="Enter your password"
                  required
                  autoFocus
                />
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Signing in..." : step === "email" ? "Next" : "Login"}
            </button>

            {step === "password" && (
              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setStep("email");
                  setError("");
                }}
              >
                ← Back
              </button>
            )}

            {error && <p className="error-msg">{error}</p>}
          </form>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          {/* Rounded-rect grid pattern */}
          <div className="grid-pattern">
            {/* Row 1 */}
            <div className="grid-cell c-faint" />
            <div className="grid-cell c-darker" />
            <div className="grid-cell c-dark" />
            <div className="grid-cell c-mid" />
            <div className="grid-cell c-bright" />
            {/* Row 2 */}
            <div className="grid-cell c-darker" />
            <div className="grid-cell c-dark" />
            <div className="grid-cell c-mid" />
            <div className="grid-cell c-bright" />
            <div className="grid-cell c-mid" />
            {/* Row 3 */}
            <div className="grid-cell c-dark" />
            <div className="grid-cell c-mid" />
            <div className="grid-cell c-bright" />
            <div className="grid-cell c-mid" />
            <div className="grid-cell c-dark" />
            {/* Row 4 */}
            <div className="grid-cell c-mid" />
            <div className="grid-cell c-bright" />
            <div className="grid-cell c-mid" />
            <div className="grid-cell c-dark" />
            <div className="grid-cell c-darker" />
          </div>

          {/* Glow */}
          <div className="glow-overlay" />

          {/* Text content */}
          <div className="right-content">
            <h2 className="right-heading">
              Take control of
              <br />
              your finances
              <br />
              today!
            </h2>
            <p className="right-body">
              Track expenses, manage budgets, and make smarter financial
              decisions with Uifry's powerful analytics.
            </p>
            <p className="right-promo">
              Start free — <strong>cancel anytime</strong>.
            </p>
            <button className="right-cta" type="button">
              Get started →
            </button>
          </div>

          {/* Chat bubble */}
          <div className="chat-bubble">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="var(--lp-text)"
            >
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
