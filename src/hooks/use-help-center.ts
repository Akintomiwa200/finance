"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { realtime } from "@/src/services/realtime.service";
import { useHelpCenterStore } from "@/src/store/help-center-store";
import type {
  HelpCenterArticle,
  HelpCenterConversation,
  HelpCenterInboxItem,
  HelpCenterMessage,
  HelpCenterSession,
} from "@/src/types/help-center";

interface UseHelpCenterOptions {
  enabled: boolean;
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function useHelpCenter({
  enabled,
  isAuthenticated,
  isSuperAdmin,
}: UseHelpCenterOptions) {
  const [messages, setMessages] = useState<HelpCenterMessage[]>([]);
  const [articles, setArticles] = useState<HelpCenterArticle[]>([]);
  const [conversation, setConversation] = useState<HelpCenterConversation | null>(null);
  const [inbox, setInbox] = useState<HelpCenterInboxItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUnreadCount = useHelpCenterStore((s) => s.setUnreadCount);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const applySession = useCallback(
    (session: HelpCenterSession) => {
      setConversation(session.conversation);
      setMessages(session.messages);
      setArticles(session.articles);
      setUnreadCount(session.unreadCount);
    },
    [setUnreadCount],
  );

  const fetchUserSession = useCallback(async () => {
    const res = await fetch("/api/help-center");
    if (!res.ok) throw new Error("Failed to load help center");
    const data = (await res.json()) as HelpCenterSession;
    applySession(data);
    if (enabled) {
      await fetch("/api/help-center", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: data.conversation.id }),
      });
      setUnreadCount(0);
    }
  }, [applySession, enabled, setUnreadCount]);

  const fetchAdminInbox = useCallback(async () => {
    const res = await fetch("/api/admin/help-center/conversations");
    if (!res.ok) throw new Error("Failed to load help inbox");
    const data = await res.json();
    setInbox(data.conversations ?? []);
  }, []);

  const fetchAdminConversation = useCallback(
    async (conversationId: string) => {
      const res = await fetch(`/api/admin/help-center/conversations/${conversationId}`);
      if (!res.ok) throw new Error("Failed to load conversation");
      const data = (await res.json()) as HelpCenterSession;
      setConversation(data.conversation);
      setMessages(data.messages);
      setArticles(data.articles);
      setActiveConversationId(conversationId);
    },
    [],
  );

  const fetchArticlesOnly = useCallback(async () => {
    const res = await fetch("/api/help-center?view=articles");
    if (!res.ok) return;
    const data = await res.json();
    setArticles(data.articles ?? []);
  }, []);

  const refresh = useCallback(async () => {
    if (!enabled || !isAuthenticated) return;

    try {
      if (isSuperAdmin) {
        await fetchAdminInbox();
        if (activeConversationId) {
          await fetchAdminConversation(activeConversationId);
        }
      } else {
        await fetchUserSession();
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh help center");
    }
  }, [
    enabled,
    isAuthenticated,
    isSuperAdmin,
    activeConversationId,
    fetchAdminInbox,
    fetchAdminConversation,
    fetchUserSession,
  ]);

  const fetchUnread = useCallback(async () => {
    if (!isAuthenticated || isSuperAdmin) return;
    try {
      const res = await fetch("/api/help-center?view=unread");
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // silent
    }
  }, [isAuthenticated, isSuperAdmin, setUnreadCount]);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        if (!isAuthenticated) {
          await fetchArticlesOnly();
          setError(null);
          return;
        }

        if (isSuperAdmin) {
          await fetchAdminInbox();
        } else {
          await fetchUserSession();
        }
        if (!cancelled) setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load help center");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    enabled,
    isAuthenticated,
    isSuperAdmin,
    fetchArticlesOnly,
    fetchAdminInbox,
    fetchUserSession,
  ]);

  useEffect(() => {
    if (!enabled || !isAuthenticated) return;

    realtime.startPolling("/api/realtime/poll", 5000);
    pollingRef.current = setInterval(refresh, 8000);

    const unsubscribe = realtime.subscribeAll((msg) => {
      if (
        msg.entity === "help_center_message" ||
        msg.entity === "help_center_conversation"
      ) {
        refresh();
        fetchUnread();
      }
    });

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      unsubscribe();
    };
  }, [enabled, isAuthenticated, refresh, fetchUnread]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || !isAuthenticated) return false;

      setIsSending(true);
      try {
        if (isSuperAdmin) {
          if (!activeConversationId) throw new Error("Select a conversation first");
          const res = await fetch(
            `/api/admin/help-center/conversations/${activeConversationId}/messages`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ content: trimmed }),
            },
          );
          if (!res.ok) throw new Error("Failed to send reply");
          await fetchAdminConversation(activeConversationId);
          await fetchAdminInbox();
        } else {
          const res = await fetch("/api/help-center/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: trimmed }),
          });
          if (!res.ok) throw new Error("Failed to send message");
          await fetchUserSession();
        }
        setError(null);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
        return false;
      } finally {
        setIsSending(false);
      }
    },
    [
      isAuthenticated,
      isSuperAdmin,
      activeConversationId,
      fetchAdminConversation,
      fetchAdminInbox,
      fetchUserSession,
    ],
  );

  const selectConversation = useCallback(
    async (conversationId: string) => {
      setIsLoading(true);
      try {
        await fetchAdminConversation(conversationId);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load conversation");
      } finally {
        setIsLoading(false);
      }
    },
    [fetchAdminConversation],
  );

  const uiMessages = messages.map((msg) => ({
    id: msg.id,
    role:
      msg.role === "USER"
        ? ("user" as const)
        : msg.role === "SYSTEM"
          ? ("system" as const)
          : ("admin" as const),
    text: msg.content,
    time: formatTime(msg.createdAt),
    authorName: msg.authorName,
  }));

  return {
    messages: uiMessages,
    articles,
    conversation,
    inbox,
    activeConversationId,
    isLoading,
    isSending,
    error,
    sendMessage,
    selectConversation,
    refresh,
    fetchUnread,
  };
}
