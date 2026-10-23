"use client";

import { useThread, useThreadList, type ChatStorage, type Message, type Thread } from "@openuidev/react-ui";
import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

const MAX_THREADS = 50;

function userThreadsKey(userId: string) {
  return `oiu:${userId}:threads`;
}

function userMessagesKey(userId: string, threadId: string) {
  return `oiu:${userId}:messages:${threadId}`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(key) : null;
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // Full or blocked storage: the chat keeps working, unsaved.
  }
}

// Purge any legacy shared threads so no past history leaks to guests or between users
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem("oiu:threads");
  } catch {}
}

const titleOf = (message: Message) => {
  const text = typeof message.content === "string" ? message.content : "";
  return text.replace(/\s+/g, " ").trim().slice(0, 60) || "New chat";
};

/**
 * Returns user-isolated ChatStorage:
 * - In demo or guest mode (userId is null or isDemo is true): NO persistent history is exposed or stored.
 *   `listThreads` returns empty array, starting completely fresh on every visit or refresh.
 * - For authenticated users: Threads and messages are isolated strictly to their `userId` in both
 *   user-partitioned localStorage and Supabase (with Postgres Row Level Security).
 */
export function localChatStorage(userId?: string | null, isDemo?: boolean): ChatStorage {
  // ── 1. Demo / Guest User: ZERO history, fresh on reload ──
  if (isDemo || !userId || userId === "demo-guest-session") {
    // Ephemeral in-memory store for the current active tab only
    let activeDemoThread: Thread | null = null;
    let activeDemoMessages: Message[] = [];

    return {
      thread: {
        async listThreads() {
          // Guest users have NO persistent history
          return { threads: [] };
        },
        async createThread(firstMessage) {
          activeDemoThread = {
            id: crypto.randomUUID(),
            title: titleOf(firstMessage as Message),
            createdAt: new Date().toISOString(),
          };
          activeDemoMessages = [firstMessage as Message];
          return activeDemoThread;
        },
        async getMessages(threadId) {
          if (activeDemoThread && activeDemoThread.id === threadId) {
            return activeDemoMessages;
          }
          return [];
        },
        async updateThread(thread) {
          if (activeDemoThread && activeDemoThread.id === thread.id) {
            activeDemoThread = { ...activeDemoThread, ...thread };
          }
          return thread;
        },
        async deleteThread() {
          activeDemoThread = null;
          activeDemoMessages = [];
        },
      },
    };
  }

  // ── 2. Authenticated User: Isolated by user.id with Supabase RLS ──
  const threadsKey = userThreadsKey(userId);

  return {
    thread: {
      async listThreads() {
        // Fast local read first
        const localThreads = read<Thread[]>(threadsKey, []);

        // Sync with Supabase (RLS ensures user only sees their own rows)
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from("threads")
            .select("id, title, created_at, updated_at")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });

          if (!error && data) {
            const dbThreads: Thread[] = data.map((t) => ({
              id: t.id,
              title: t.title,
              createdAt: t.created_at,
            }));
            write(threadsKey, dbThreads);
            return { threads: dbThreads };
          }
        } catch {
          // Offline / fallback to local cache
        }

        return { threads: localThreads };
      },

      async createThread(firstMessage) {
        const thread: Thread = {
          id: crypto.randomUUID(),
          title: titleOf(firstMessage as Message),
          createdAt: new Date().toISOString(),
        };

        const current = read<Thread[]>(threadsKey, []);
        const threads = [thread, ...current];
        for (const old of threads.slice(MAX_THREADS)) {
          try {
            localStorage.removeItem(userMessagesKey(userId, old.id));
          } catch {}
        }
        write(threadsKey, threads.slice(0, MAX_THREADS));
        write(userMessagesKey(userId, thread.id), [firstMessage]);

        // Sync with Supabase
        try {
          const supabase = createClient();
          await supabase.from("threads").insert({
            id: thread.id,
            user_id: userId,
            title: thread.title,
          });
          await supabase.from("messages").insert({
            thread_id: thread.id,
            user_id: userId,
            role: (firstMessage as any).role || "user",
            content: (firstMessage as any).content,
            metadata: (firstMessage as any).metadata || {},
          });
        } catch {}

        return thread;
      },

      async getMessages(threadId) {
        // Try Supabase first
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from("messages")
            .select("id, role, content, metadata")
            .eq("thread_id", threadId)
            .eq("user_id", userId)
            .order("created_at", { ascending: true });

          if (!error && data && data.length > 0) {
            const msgs: Message[] = data.map((m) => ({
              id: m.id,
              role: m.role,
              content: m.content,
              metadata: m.metadata,
            }));
            write(userMessagesKey(userId, threadId), msgs);
            return msgs;
          }
        } catch {}

        return read<Message[]>(userMessagesKey(userId, threadId), []);
      },

      async updateThread(thread) {
        const current = read<Thread[]>(threadsKey, []);
        write(
          threadsKey,
          current.map((t) => (t.id === thread.id ? { ...t, ...thread, isPending: undefined } : t))
        );

        try {
          const supabase = createClient();
          await supabase
            .from("threads")
            .update({ title: thread.title, updated_at: new Date().toISOString() })
            .eq("id", thread.id)
            .eq("user_id", userId);
        } catch {}

        return thread;
      },

      async deleteThread(id) {
        const current = read<Thread[]>(threadsKey, []);
        write(threadsKey, current.filter((t) => t.id !== id));
        try {
          localStorage.removeItem(userMessagesKey(userId, id));
        } catch {}

        try {
          const supabase = createClient();
          await supabase.from("threads").delete().eq("id", id).eq("user_id", userId);
        } catch {}
      },
    },
  };
}

/**
 * Saves the open thread's messages whenever they change and no answer is streaming.
 * Isolated strictly to the active authenticated user. In demo or guest mode, nothing is persisted.
 */
export function SaveMessages({ userId, isDemo }: { userId?: string | null; isDemo?: boolean }) {
  const messages = useThread((s) => s.messages);
  const isRunning = useThread((s) => s.isRunning);
  const threadId = useThreadList((s) => s.selectedThreadId);
  const lastSavedCountRef = useRef<number>(0);

  useEffect(() => {
    // Guest or demo users have NO persistent history
    if (isDemo || !userId || userId === "demo-guest-session") return;

    if (threadId && !isRunning && messages.length > 0) {
      write(userMessagesKey(userId, threadId), messages);

      // Save new assistant messages to Supabase
      if (messages.length > lastSavedCountRef.current) {
        const newMsgs = messages.slice(lastSavedCountRef.current);
        lastSavedCountRef.current = messages.length;

        const supabase = createClient();
        const records = newMsgs.map((m) => ({
          thread_id: threadId,
          user_id: userId,
          role: m.role,
          content: m.content,
          metadata: (m as any).metadata || {},
        }));

        void (async () => {
          try {
            await supabase.from("messages").insert(records);
          } catch {}
        })();
      }
    }
  }, [threadId, isRunning, messages, userId, isDemo]);

  return null;
}
