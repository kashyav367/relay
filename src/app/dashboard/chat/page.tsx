"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, ArrowUp, Paperclip, Command } from "lucide-react";
import { MessageBubble } from "~/components/chat/MessageBubble";
import { TypingIndicator } from "~/components/chat/TypingIndicator";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTED = [
  { icon: "📬", label: "Summarize my inbox",      prompt: "Summarize all my unread emails and highlight what needs attention" },
  { icon: "📅", label: "Prepare me for today",    prompt: "What meetings do I have today and how should I prepare?" },
  { icon: "✍️", label: "Draft a reply",           prompt: "Help me draft a professional reply to my latest email" },
  { icon: "⚡", label: "Show today's priorities", prompt: "What are my top priorities today based on my emails and calendar?" },
  { icon: "🔍", label: "Find important emails",   prompt: "Find emails that require urgent action or response" },
  { icon: "📆", label: "Schedule a meeting",      prompt: "I need to schedule a 30-minute meeting with my team this week" },
];

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

function ChatPageInner() {
  const searchParams = useSearchParams();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-run prompt from URL query param (e.g. from dashboard quick actions)
  useEffect(() => {
    const q = searchParams.get("prompt");
    if (q && messages.length === 0) {
      void sendMessage(q);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: text, timestamp: new Date() },
    ]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      let content: string;
      try {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
        const data = await res.json();
        content = data?.message || data?.response || data?.content || "No response received.";
        /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
      } catch {
        content = await res.text();
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Failed to connect. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(prompt);
    }
  };

  const isEmpty = messages.length === 0;

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  return (
    <div className="flex h-screen flex-col bg-[#09090B] text-white">

      {/* ── Header ── */}
      <header className="flex items-center justify-between border-b border-[#27272A] px-8 py-5">
          <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFE600]/10">
            <Zap className="h-4 w-4 text-[#FFE600]" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">Relay AI</p>
            <p className="text-[11px] tracking-wide text-[#52525B] uppercase">Inbox • Calendar • Scheduling • AI Actions</p>
          </div>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-2 rounded-full border border-[#27272A] bg-[#111111] px-3 py-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[11px] text-[#71717A]">Connected</span>
        </div>
      </header>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-6 py-10" style={{ scrollbarWidth: "none" }}>
        <div className="mx-auto max-w-5xl">

          {/* Top controls: New Chat / Recent Conversations */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="rounded-md bg-[#111111] px-3 py-1 text-sm text-white/90 hover:bg-[#161616]">New Chat</button>
              <button className="rounded-md bg-transparent px-3 py-1 text-sm text-[#A1A1AA] hover:text-white">Recent Conversations</button>
            </div>
          </div>

          {/* Empty state */}
          <AnimatePresence>
            {isEmpty && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start pt-16 pb-12"
              >
                {/* Eyebrow */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="mb-4 text-xs font-medium tracking-[0.18em] uppercase text-[#3F3F46]"
                >
                  RELAY AI EXECUTIVE ASSISTANT
                </motion.p>

                {/* Large headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-5 text-6xl md:text-7xl font-semibold tracking-tight text-white leading-[1.1]"
                >
                  {getGreeting()}, Ankit.
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.45, ease: "easeOut" }}
                  className="mb-6 max-w-2xl text-base leading-relaxed text-[#52525B]"
                >
                  Relay understands your inbox, calendar, meetings and priorities. Ask naturally and let Relay do the work.
                </motion.p>

                {/* Stats row */}
                <div className="mb-8 grid w-full grid-cols-3 gap-4">
                  <div className="rounded-xl bg-[#0E0E10] px-4 py-3 text-center">
                    <div className="text-2xl font-semibold">12</div>
                    <div className="text-[11px] text-[#71717A]">Unread Emails</div>
                  </div>
                  <div className="rounded-xl bg-[#0E0E10] px-4 py-3 text-center">
                    <div className="text-2xl font-semibold">3</div>
                    <div className="text-[11px] text-[#71717A]">Meetings Today</div>
                  </div>
                  <div className="rounded-xl bg-[#0E0E10] px-4 py-3 text-center">
                    <div className="text-2xl font-semibold">2</div>
                    <div className="text-[11px] text-[#71717A]">Need Reply</div>
                  </div>
                </div>

                <motion.p className="mb-6 text-[#71717A]">What would you like to do today?</motion.p>

                {/* Divider */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                  className="mb-8 h-px w-full bg-[#1C1C1F]"
                />

                {/* Suggested prompt cards */}
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  {SUGGESTED.map(({ icon, label, prompt: p }, i) => (
                    <motion.button
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.32 + i * 0.055, duration: 0.38, ease: "easeOut" }}
                      onClick={() => void sendMessage(p)}
                      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-[#1C1C1F] bg-[#111111] px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FFE600]/30 hover:bg-[#131310] hover:shadow-[0_0_0_1px_#FFE60020]"
                    >
                      {/* Yellow left accent on hover */}
                      <span className="absolute inset-y-0 left-0 w-0.5 bg-[#FFE600] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1C1C1F] text-lg transition-colors duration-200 group-hover:bg-[#FFE600]/10">
                        {icon}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#A1A1AA] transition-colors duration-200 group-hover:text-white">
                          {label}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[#3F3F46]">One click workflow</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <MessageBubble message={msg} />
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <TypingIndicator />
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* ── Input ── */}
      <div className="border-t border-[#27272A] px-6 py-5">
          <div className="mx-auto max-w-5xl">
              <div className="flex items-end gap-3 rounded-2xl border border-[#27272A] bg-[#111111] px-5 py-4 transition-colors duration-200 focus-within:border-[#FFE600]/50 focus-within:shadow-[0_0_0_1px_rgba(255,230,0,0.2)]">

            <button
              type="button"
              aria-label="Attach file"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#52525B] transition-colors duration-150 hover:bg-[#1C1C1F] hover:text-[#A1A1AA]"
            >
              <Paperclip className="h-4 w-4" strokeWidth={2} />
            </button>

            <button
              type="button"
              aria-label="Command menu"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#52525B] transition-colors duration-150 hover:bg-[#1C1C1F] hover:text-[#A1A1AA]"
            >
              <Command className="h-4 w-4" strokeWidth={2} />
            </button>

            <textarea
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Relay anything about your inbox or calendar..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm leading-relaxed text-white placeholder-[#3F3F46] outline-none max-h-36"
              style={{ scrollbarWidth: "none" }}
            />
            <button
              onClick={() => void sendMessage(prompt)}
              disabled={!prompt.trim() || loading}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFE600] text-black transition-all duration-150 hover:bg-[#FFE600]/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-25"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
            </button>
          </div>
          <p className="mt-3 text-center text-[11px] tracking-wide text-[#27272A]">
            Relay can read and write your Gmail & Google Calendar
          </p>
        </div>
      </div>

    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatPageInner />
    </Suspense>
  );
}