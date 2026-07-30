"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  X,
  Send,
  ChevronDown,
  Sparkles,
  Bot,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "@/src/store/auth-store";
import { useHelpCenterStore } from "@/src/store/help-center-store";
import { useHelpCenter } from "@/src/hooks/use-help-center";

function useAutoScroll(dep: unknown) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [dep]);
  return ref;
}

export function HelpChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, isAuthenticated } = useAuthStore();
  const unreadCount = useHelpCenterStore((s) => s.unreadCount);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const {
    messages,
    articles,
    inbox,
    activeConversationId,
    isLoading,
    isSending,
    error,
    sendMessage,
    selectConversation,
  } = useHelpCenter({
    enabled: open,
    isAuthenticated,
    isSuperAdmin,
  });

  const scrollRef = useAutoScroll([messages, isSending, open]);
  const hasOnlyWelcome =
    messages.length <= 1 && messages.every((m) => m.role === "system");

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open, activeConversationId]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isSending) return;
    setShowQuickReplies(false);
    setInput("");
    await sendMessage(text);
  }

  async function handleQuickReply(text: string) {
    if (isSending) return;
    setShowQuickReplies(false);
    await sendMessage(text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  }

  const quickReplies = articles.map((a) => a.question);
  const showAdminInbox = isSuperAdmin && !activeConversationId;

  return (
    <>
      <style>{`
        .hc-panel {
          position: fixed;
          z-index: 50;
          bottom: 88px;
          right: 24px;
          width: 400px;
          max-width: calc(100vw - 32px);
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
        .hc-close-btn:hover { background: var(--bg-surface); }
        .hc-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }
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
        .hc-msg-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          min-width: 0;
        }
        .hc-msg-row--user { justify-content: flex-end; }
        .hc-msg-row--admin, .hc-msg-row--system { justify-content: flex-start; }
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
          align-self: center;
          text-align: center;
        }
        .hc-bubble-text { margin: 0; }
        .hc-bubble-time {
          font-size: 10px;
          margin-top: 4px;
          line-height: 1;
        }
        .hc-bubble--user .hc-bubble-time { color: #fbb; text-align: right; }
        .hc-bubble--admin .hc-bubble-time, .hc-bubble--system .hc-bubble-time { color: var(--text-muted); }
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
        .hc-quick-pills { display: flex; flex-wrap: wrap; gap: 6px; }
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
        .hc-input-bar {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px 12px;
          border-top: 1px solid var(--border);
          background: var(--bg-card);
        }
        .hc-input-wrap { flex: 1; position: relative; min-width: 0; }
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
          box-sizing: border-box;
        }
        .hc-input::placeholder { color: var(--text-muted); opacity: 0.7; }
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
        }
        .hc-send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
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
        }
        .hc-fab--open {
          background: var(--text-primary);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }
        .hc-fab-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border-radius: 999px;
          background: #fff;
          color: var(--lp-red, #ff5555);
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--lp-red, #ff5555);
        }
        .hc-inbox-item {
          width: 100%;
          text-align: left;
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 12px;
          background: var(--bg-page);
          cursor: pointer;
        }
        .hc-inbox-item:hover { background: var(--bg-surface); }
        .hc-error {
          margin: 0 16px 8px;
          font-size: 12px;
          color: #ef4444;
        }
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
          .hc-fab { bottom: 16px; right: 16px; }
        }
      `}</style>

      <button
        onClick={() => setOpen((v) => !v)}
        className={`hc-fab${open ? " hc-fab--open" : ""}`}
        aria-label={open ? "Close chat" : "Open help chat"}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
        {!open && unreadCount > 0 && (
          <span className="hc-fab-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      <div className="hc-panel" data-open={open ? "true" : "false"} role="dialog" aria-label="Help chat">
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
                    ? "Support inbox — live"
                    : isAuthenticated
                      ? "Online — synced in real time"
                      : "Browse help articles"}
                </span>
              </div>
            </div>
          </div>
          <button className="hc-close-btn" onClick={() => setOpen(false)} aria-label="Close">
            <ChevronDown size={16} />
          </button>
        </div>

        {error && <p className="hc-error">{error}</p>}

        <div className="hc-messages">
          {isLoading && (
            <div className="hc-empty">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <p className="hc-empty-sub">Loading conversation...</p>
            </div>
          )}

          {!isLoading && showAdminInbox && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Open conversations
              </p>
              {inbox.length === 0 ? (
                <p className="text-sm text-muted-foreground">No open help conversations yet.</p>
              ) : (
                inbox.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="hc-inbox-item"
                    onClick={() => void selectConversation(item.id)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">{item.userName ?? "User"}</span>
                      {item.unreadCount > 0 && (
                        <span className="text-[10px] font-bold text-[var(--lp-red,#ff5555)]">
                          {item.unreadCount} new
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{item.orgName}</p>
                    {item.lastMessage && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {item.lastMessage.content}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          )}

          {!isLoading && !showAdminInbox && hasOnlyWelcome && (
            <div className="hc-empty">
              <div className="hc-empty-icon">
                <MessageCircle size={22} color="var(--lp-red, #ff5555)" />
              </div>
              <p className="hc-empty-title">Need help?</p>
              <p className="hc-empty-sub">
                {isAuthenticated
                  ? "Ask a question or pick a quick answer below. Replies sync live across devices."
                  : "Sign in to chat with support, or browse quick answers below."}
              </p>
            </div>
          )}

          {!isLoading &&
            !showAdminInbox &&
            messages.map((msg) => {
              if (msg.role === "system") {
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: "center" }}>
                    <div className="hc-bubble hc-bubble--system">
                      <p className="hc-bubble-text">{msg.text}</p>
                      {msg.time && <p className="hc-bubble-time">{msg.time}</p>}
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

              return (
                <div key={msg.id} className="hc-msg-row hc-msg-row--admin">
                  <div className="hc-bot-avatar">
                    <Bot size={13} color="var(--text-muted)" />
                  </div>
                  <div className="hc-bubble hc-bubble--admin">
                    {msg.authorName && msg.role === "admin" && (
                      <p className="mb-1 text-[10px] font-semibold text-muted-foreground">
                        {msg.authorName}
                      </p>
                    )}
                    <p className="hc-bubble-text">{msg.text}</p>
                    <p className="hc-bubble-time">{msg.time}</p>
                  </div>
                </div>
              );
            })}

          <div ref={scrollRef} />
        </div>

        {showQuickReplies && quickReplies.length > 0 && !showAdminInbox && (
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
                  onClick={() => void handleQuickReply(qr)}
                  disabled={!isAuthenticated || isSending}
                >
                  {qr}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="hc-input-bar">
          <div className="hc-input-wrap">
            {!isAuthenticated ? (
              <div className="flex h-10 items-center px-3 text-xs text-muted-foreground">
                <Link href="/login" className="font-medium text-[var(--lp-red,#ff5555)] hover:underline">
                  Sign in
                </Link>
                <span className="ml-1">to chat with support</span>
              </div>
            ) : (
              <>
                <input
                  ref={inputRef}
                  className="hc-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isSuperAdmin && !activeConversationId
                      ? "Select a conversation above..."
                      : "Type your message..."
                  }
                  disabled={(isSuperAdmin && !activeConversationId) || isSending}
                />
                {input.length > 0 && <span className="hc-char-count">{input.length}</span>}
              </>
            )}
          </div>
          <button
            className="hc-send-btn"
            onClick={() => void handleSend()}
            disabled={!isAuthenticated || !input.trim() || isSending || (isSuperAdmin && !activeConversationId)}
            aria-label="Send"
          >
            {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </>
  );
}
