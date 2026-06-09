"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  Sparkles,
  Bot,
} from "lucide-react";
import { useAuthStore } from "@/src/store/auth-store";

interface Message {
  id: number;
  role: "user" | "admin" | "system";
  text: string;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "system",
    text: "Welcome to Uifry Help! How can we assist you today?",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  },
];

const quickReplies = [
  "How do I reset my password?",
  "How to generate a report?",
  "I need help with transactions",
  "Contact super admin",
];

const adminResponses: Record<string, string> = {
  "How do I reset my password?":
    "Go to Settings → Security → Reset Password. You'll receive a confirmation email within 5 minutes.",
  "How to generate a report?":
    "Navigate to Reports from the sidebar, choose your report type, set the date range, then click Generate. You can download as PDF or CSV.",
  "I need help with transactions":
    "View all transactions in the Transactions page. Use filters and search to find specific entries. For disputes, open a transaction and click 'Report Issue'.",
  "Contact super admin":
    "A request has been sent to your super admin. They'll be notified and can respond here or reach out directly.",
};

const autoReply =
  "Thanks for reaching out! Our support team will respond within 24 hours. For urgent issues, please contact your account manager.";

function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function useAutoScroll(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [dep]);
  return ref;
}

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useAutoScroll([messages, isTyping]);
  const { user, isAuthenticated } = useAuthStore();

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  function addMessage(text: string, role: Message["role"]) {
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role, text, time: getTime() },
    ]);
  }

  function simulateReply(text: string) {
    setIsTyping(true);
    setTimeout(
      () => {
        setIsTyping(false);
        addMessage(
          isSuperAdmin
            ? `As super admin, you can reply to: "${text}" — the user will be notified.`
            : adminResponses[text] || autoReply,
          "admin",
        );
      },
      1000 + Math.random() * 800,
    );
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setShowQuickReplies(false);
    addMessage(text, "user");
    setInput("");
    simulateReply(text);
  }

  function handleQuickReply(text: string) {
    setShowQuickReplies(false);
    addMessage(text, "user");
    simulateReply(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const RED = "var(--lp-red, #ff5555)";

  return (
    <>
      <style>{`
        .hc-panel {
          position: fixed;
          z-index: 50;
          bottom: 88px;
          right: 24px;
          /* Fixed width on desktop, fluid on mobile */
          width: 400px;
          max-width: calc(100vw - 32px);
          /* Fixed height on desktop */
          height: 580px;
          max-height: calc(100vh - 120px);
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          box-shadow:
            0 24px 48px rgba(0, 0, 0, 0.35),
            0 8px 16px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transform-origin: bottom right;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .hc-panel[data-open="false"] {
          opacity: 0;
          transform: scale(0.94) translateY(8px);
          pointer-events: none;
        }
        .hc-panel[data-open="true"] {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
        }

        /* Header */
        .hc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
          background: var(--bg-card);
        }
        .hc-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .hc-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .hc-header-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          line-height: 1.3;
          margin: 0;
        }
        .hc-header-status {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 2px;
        }
        .hc-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }
        .hc-status-text {
          font-size: 11px;
          color: var(--text-muted);
          line-height: 1;
        }
        .hc-close-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: none;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--text-muted);
          transition: background 0.15s;
          flex-shrink: 0;
        }
        .hc-close-btn:hover {
          background: var(--bg-surface);
        }

        /* Messages area */
        .hc-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          /* Prevent scrollbar from causing layout shift */
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
        .hc-messages::-webkit-scrollbar {
          width: 4px;
        }
        .hc-messages::-webkit-scrollbar-track {
          background: transparent;
        }
        .hc-messages::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 2px;
        }

        /* Empty state */
        .hc-empty {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 24px;
          gap: 8px;
        }
        .hc-empty-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .hc-empty-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0;
        }
        .hc-empty-sub {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
          max-width: 220px;
        }

        /* Message row */
        .hc-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          /* ensure rows don't get squeezed */
          min-width: 0;
        }
        .hc-msg-row--user {
          justify-content: flex-end;
        }
        .hc-msg-row--admin,
        .hc-msg-row--system {
          justify-content: flex-start;
        }

        /* Bot avatar beside admin messages */
        .hc-bot-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--bg-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 2px;
        }

        /* Bubble */
        .hc-bubble {
          max-width: 72%;
          padding: 10px 13px;
          border-radius: 16px;
          font-size: 13px;
          line-height: 1.55;
          word-break: break-word;
        }
        .hc-bubble--user {
          background: var(--lp-red, #ff5555);
          color: #fff;
          border-bottom-right-radius: 4px;
        }
        .hc-bubble--admin {
          background: var(--bg-surface);
          color: var(--text-primary);
          border-bottom-left-radius: 4px;
        }
        .hc-bubble--system {
          background: var(--bg-surface);
          color: var(--text-muted);
          font-size: 12px;
          border-radius: 10px;
          padding: 8px 12px;
          /* system messages centered, no avatar */
          align-self: center;
          text-align: center;
        }
        .hc-bubble-text {
          margin: 0;
        }
        .hc-bubble-time {
          font-size: 10px;
          margin-top: 4px;
          line-height: 1;
        }
        .hc-bubble--user .hc-bubble-time {
          color: #fbb;
          text-align: right;
        }
        .hc-bubble--admin .hc-bubble-time,
        .hc-bubble--system .hc-bubble-time {
          color: var(--text-muted);
        }

        /* Typing indicator */
        .hc-typing {
          background: var(--bg-surface);
          border-radius: 16px;
          border-bottom-left-radius: 4px;
          padding: 12px 14px;
          display: flex;
          gap: 4px;
          align-items: center;
        }
        .hc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-muted);
          animation: hcBounce 1.2s infinite ease-in-out;
        }
        .hc-dot:nth-child(2) { animation-delay: 0.2s; }
        .hc-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes hcBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }

        /* Quick replies */
        .hc-quick {
          flex-shrink: 0;
          padding: 8px 16px 12px;
          border-top: 1px solid var(--border);
        }
        .hc-quick-label {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 8px;
        }
        .hc-quick-label-text {
          font-size: 10px;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .hc-quick-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .hc-pill {
          padding: 5px 11px;
          font-size: 11.5px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: var(--bg-page);
          color: var(--text-primary);
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          line-height: 1.4;
          white-space: nowrap;
        }
        .hc-pill:hover {
          border-color: var(--lp-red, #ff5555);
          color: var(--lp-red, #ff5555);
          background: var(--bg-surface);
        }

        /* Input bar */
        .hc-input-bar {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px 12px;
          border-top: 1px solid var(--border);
          background: var(--bg-card);
        }
        .hc-input-wrap {
          flex: 1;
          position: relative;
          min-width: 0;
        }
        .hc-input {
          width: 100%;
          height: 40px;
          padding: 0 36px 0 13px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg-page);
          font-size: 13px;
          color: var(--text-primary);
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .hc-input::placeholder {
          color: var(--text-muted);
          opacity: 0.7;
        }
        .hc-input:focus {
          border-color: var(--lp-red, #ff5555);
          box-shadow: 0 0 0 3px rgba(255, 85, 85, 0.12);
        }
        .hc-char-count {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }
        .hc-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: none;
          background: var(--lp-red, #ff5555);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.15s, transform 0.1s;
        }
        .hc-send-btn:hover:not(:disabled) {
          opacity: 0.88;
        }
        .hc-send-btn:active:not(:disabled) {
          transform: scale(0.94);
        }
        .hc-send-btn:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        /* FAB */
        .hc-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 50;
          width: 52px;
          height: 52px;
          border-radius: 16px;
          border: none;
          background: var(--lp-red, #ff5555);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(255, 85, 85, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s;
        }
        .hc-fab:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 24px rgba(255, 85, 85, 0.55);
        }
        .hc-fab--open {
          background: var(--text-primary);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }
        .hc-fab--open:hover {
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
        }

        /* Mobile tweaks */
        @media (max-width: 480px) {
          .hc-panel {
            bottom: 0;
            right: 0;
            width: 100vw;
            max-width: 100vw;
            height: 70vh;
            max-height: 70vh;
            border-radius: 20px 20px 0 0;
          }
          .hc-fab {
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`hc-fab${open ? " hc-fab--open" : ""}`}
        aria-label={open ? "Close chat" : "Open help chat"}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {/* Panel */}
      <div
        className="hc-panel"
        data-open={open ? "true" : "false"}
        role="dialog"
        aria-label="Help chat"
      >
        {/* Header */}
        <div className="hc-header">
          <div className="hc-header-left">
            <div className="hc-avatar">
              <Bot size={18} color="var(--lp-red, #ff5555)" />
            </div>
            <div>
              <p className="hc-header-title">Help Center</p>
              <div className="hc-header-status">
                <span className="hc-status-dot" />
                <span className="hc-status-text">
                  {isSuperAdmin
                    ? "Super Admin mode"
                    : "Online — replies in minutes"}
                </span>
              </div>
            </div>
          </div>
          <button
            className="hc-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="hc-messages">
          {messages.length === 1 && (
            <div className="hc-empty">
              <div className="hc-empty-icon">
                <MessageCircle size={22} color="var(--lp-red, #ff5555)" />
              </div>
              <p className="hc-empty-title">Need help?</p>
              <p className="hc-empty-sub">
                Ask a question or pick a quick answer below to get started.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            if (msg.role === "system") {
              return (
                <div
                  key={msg.id}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div className="hc-bubble hc-bubble--system">
                    <p className="hc-bubble-text">{msg.text}</p>
                    <p className="hc-bubble-time">{msg.time}</p>
                  </div>
                </div>
              );
            }

            if (msg.role === "user") {
              return (
                <div key={msg.id} className="hc-msg-row hc-msg-row--user">
                  <div className="hc-bubble hc-bubble--user">
                    <p className="hc-bubble-text">{msg.text}</p>
                    <p className="hc-bubble-time">{msg.time}</p>
                  </div>
                </div>
              );
            }

            // admin
            return (
              <div key={msg.id} className="hc-msg-row hc-msg-row--admin">
                <div className="hc-bot-avatar">
                  <Bot size={13} color="var(--text-muted)" />
                </div>
                <div className="hc-bubble hc-bubble--admin">
                  <p className="hc-bubble-text">{msg.text}</p>
                  <p className="hc-bubble-time">{msg.time}</p>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="hc-msg-row hc-msg-row--admin">
              <div className="hc-bot-avatar">
                <Bot size={13} color="var(--text-muted)" />
              </div>
              <div className="hc-typing">
                <span className="hc-dot" />
                <span className="hc-dot" />
                <span className="hc-dot" />
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Quick replies */}
        {showQuickReplies && isAuthenticated && !isSuperAdmin && (
          <div className="hc-quick">
            <div className="hc-quick-label">
              <Sparkles size={11} color="var(--text-muted)" />
              <span className="hc-quick-label-text">Quick Answers</span>
            </div>
            <div className="hc-quick-pills">
              {quickReplies.map((qr) => (
                <button
                  key={qr}
                  className="hc-pill"
                  onClick={() => handleQuickReply(qr)}
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input bar */}
        <div className="hc-input-bar">
          <div className="hc-input-wrap">
            <input
              ref={inputRef}
              className="hc-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
            />
            {input.length > 0 && (
              <span className="hc-char-count">{input.length}</span>
            )}
          </div>
          <button
            className="hc-send-btn"
            onClick={handleSend}
            disabled={!input.trim()}
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
