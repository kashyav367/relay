"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Zap,
  Search,
  Plus,
  Mail,
  Calendar,
  FileText,
  Star,
  ArrowRight,
  Clock,
  Users,
  CheckCircle2,
  Circle,
  Sparkles,
  Send,
  ChevronRight,
  Inbox,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Video,
  MoreHorizontal,
  Command,
  Paperclip,
  Mic,
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Activity,
  Flag,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  cards?: ContextCard[];
}

interface ContextCard {
  type: "email" | "meeting" | "action" | "stat";
  title: string;
  meta: string;
  accent?: string;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: string;
  group: "today" | "yesterday" | "earlier";
}

interface Priority {
  label: string;
  tag: "urgent" | "high" | "normal";
  done: boolean;
}

interface UpcomingMeeting {
  title: string;
  time: string;
  duration: string;
  attendees: number;
  isVideo: boolean;
  color: string;
}

interface UnreadEmail {
  sender: string;
  subject: string;
  time: string;
  priority: "urgent" | "high" | "normal";
  initials: string;
  color: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────────

const CONVERSATIONS: Conversation[] = [
  { id: "1", title: "Summarize Inbox", preview: "You have 14 unread emails...", timestamp: "9:14 AM", group: "today" },
  { id: "2", title: "Prepare For Today", preview: "3 meetings, board deck due...", timestamp: "8:02 AM", group: "today" },
  { id: "3", title: "Draft Investor Reply", preview: "Re: Series A follow-up...", timestamp: "Yesterday", group: "yesterday" },
  { id: "4", title: "Review Calendar", preview: "Next 7 days overview...", timestamp: "Yesterday", group: "yesterday" },
  { id: "5", title: "Weekly Briefing", preview: "Executive summary for...", timestamp: "Mon", group: "earlier" },
  { id: "6", title: "Prepare For Meeting", preview: "VentureLab demo prep...", timestamp: "Mon", group: "earlier" },
  { id: "7", title: "Show Unread Emails", preview: "Filtered by priority...", timestamp: "Sun", group: "earlier" },
];

const TODAY_PRIORITIES: Priority[] = [
  { label: "Sign off on Q3 roadmap deck", tag: "urgent", done: false },
  { label: "Reply to Jordan Kim — VentureLab pilot", tag: "high", done: false },
  { label: "Review DataDog latency trace", tag: "normal", done: true },
  { label: "Draft reply to Sarah Chen", tag: "high", done: false },
  { label: "Send brand tokens to engineering", tag: "normal", done: true },
];

const UPCOMING_MEETINGS: UpcomingMeeting[] = [
  { title: "1:1 with Marcus Webb", time: "11:00 AM", duration: "30m", attendees: 2, isVideo: true, color: "#0EA5E9" },
  { title: "Product Demo — VentureLab", time: "2:00 PM", duration: "1h", attendees: 3, isVideo: true, color: "#10B981" },
  { title: "All-Hands — Q3 Preview", time: "3:00 PM", duration: "1.5h", attendees: 24, isVideo: false, color: "#8B5CF6" },
];

const UNREAD_EMAILS: UnreadEmail[] = [
  { sender: "Sarah Chen", subject: "Q3 Roadmap Review — Action Required", time: "9:14 AM", priority: "urgent", initials: "SC", color: "#7C3AED" },
  { sender: "Marcus Webb", subject: "Intro: Alex Torres / Relay Partnership", time: "8:02 AM", priority: "high", initials: "MW", color: "#0EA5E9" },
  { sender: "Jordan Kim", subject: "Re: Demo follow-up + next steps", time: "Yesterday", priority: "high", initials: "JK", color: "#10B981" },
  { sender: "DataDog", subject: "[ALERT] P1 — API latency spike detected", time: "7:23 AM", priority: "urgent", initials: "DD", color: "#EF4444" },
];

const QUICK_ACTIONS = [
  { icon: "📬", label: "Summarize Inbox", prompt: "Summarize my inbox and highlight what needs my attention today.", description: "AI reads your inbox" },
  { icon: "📅", label: "Prepare Me For Today", prompt: "Prepare me for today — walk me through my meetings, priorities, and anything I need to know.", description: "Your daily briefing" },
  { icon: "✍️", label: "Draft a Reply", prompt: "Help me draft a reply to Sarah Chen about the Q3 roadmap review.", description: "AI writes, you approve" },
  { icon: "⚡", label: "Show Priorities", prompt: "What are my top priorities right now? What's most urgent?", description: "Cut through the noise" },
  { icon: "🔍", label: "Find Important Emails", prompt: "Find all emails that need my reply. Sort by urgency.", description: "Smart email triage" },
  { icon: "🤝", label: "Prepare For Meeting", prompt: "Prepare me for my 2 PM demo with VentureLab. What do I need to know?", description: "Meeting intel + notes" },
  { icon: "📈", label: "Weekly Briefing", prompt: "Give me an executive briefing for this week — key emails, meetings, decisions, and outstanding items.", description: "Your week at a glance" },
  { icon: "🗓️", label: "Review Calendar", prompt: "Walk me through my calendar for the next 7 days and flag any conflicts or prep needed.", description: "Calendar intelligence" },
];

const MOCK_RESPONSES: Record<string, { content: string; cards?: ContextCard[] }> = {
  default: {
    content: `Here's your executive briefing for today:\n\n**14 unread emails** — 2 are urgent and need your attention before noon.\n\n**Sarah Chen** is waiting on your Q3 roadmap sign-off before Friday's all-hands. The board will be in the room — Marcus specifically flagged the competitive positioning section.\n\n**Jordan Kim at VentureLab** responded with 3 pre-purchase questions. Their budget is allocated and stakeholders are aligned. This is a hot lead.\n\n**Your 2 PM demo** with VentureLab is your most important meeting today. I've prepared a brief with their outstanding questions and suggested talking points.\n\nShall I draft the reply to Sarah, or prepare your VentureLab talking points first?`,
    cards: [
      { type: "email", title: "Sarah Chen", meta: "Q3 Roadmap — needs sign-off by Thursday EOD", accent: "#EF4444" },
      { type: "email", title: "Jordan Kim", meta: "VentureLab pilot — 3 questions blocking purchase", accent: "#F59E0B" },
      { type: "meeting", title: "2:00 PM — VentureLab Demo", meta: "3 attendees · Zoom · 1 hour", accent: "#10B981" },
    ],
  },
};

function getResponse(prompt: string): { content: string; cards?: ContextCard[] } {
  const lower = prompt.toLowerCase();
  if (lower.includes("inbox") || lower.includes("email") || lower.includes("summar")) {
    return {
      content: `**Inbox summary — ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}**\n\nYou have **14 unread emails**. Here's what matters:\n\n**Urgent (2)**\n• Sarah Chen — Q3 Roadmap sign-off needed before Friday all-hands\n• DataDog alert — P1 latency spike on email-ingestion-worker (auto-resolved at 07:37 UTC)\n\n**High Priority (3)**\n• Marcus Webb — Warm intro to Alex Torres at Sequoia. In-person window: Alex is in SF this week only\n• Jordan Kim — VentureLab is ready to move to pilot. Budget allocated. 3 questions blocking sign-off\n• Priya Nair — Final brand assets ready for handoff. Note: primary yellow updated to #FFE600\n\n**Can wait (9)** — newsletters, digests, automated alerts, and one Notion weekly summary\n\nShould I draft replies to any of these?`,
      cards: [
        { type: "stat", title: "14 Unread", meta: "2 urgent · 3 high priority", accent: "#FFE600" },
        { type: "email", title: "Sarah Chen", meta: "Q3 Roadmap — sign-off required", accent: "#EF4444" },
        { type: "email", title: "Jordan Kim", meta: "VentureLab — pilot ready to start", accent: "#10B981" },
      ],
    };
  }
  if (lower.includes("meeting") || lower.includes("prepare") || lower.includes("venturelab") || lower.includes("today")) {
    return {
      content: `**Your day — ${new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}**\n\n**11:00 AM — 1:1 with Marcus Webb** (30 min · Google Meet)\nComing in, Marcus will likely want to discuss the Sequoia intro. Alex Torres is in SF this week — bring a suggested time for coffee. Also align on what Marcus wants in competitive positioning before you sign off on the roadmap.\n\n**2:00 PM — Product Demo, VentureLab** (1 hr · Zoom)\nJordan's team has budget and stakeholder alignment. Three questions are open:\n1. Multi-workspace Google account support\n2. Data retention policy for AI-processed email\n3. Enterprise plan timeline\n\nI've prepared answers for all three. Want me to send them to Jordan before the call?\n\n**3:00 PM — All-Hands Q3 Preview** (1.5 hr · HQ)\nBoard will be present. Sarah is compiling sign-offs — yours is outstanding. You need to approve the roadmap deck by EOD Thursday.\n\n**One thing to do now:** Sign off on the roadmap deck so Sarah can incorporate your input before Friday.`,
      cards: [
        { type: "meeting", title: "1:1 Marcus Webb — 11 AM", meta: "Sequoia intro · roadmap alignment", accent: "#0EA5E9" },
        { type: "meeting", title: "VentureLab Demo — 2 PM", meta: "3 open questions · hot lead", accent: "#10B981" },
        { type: "action", title: "Sign off on Q3 Roadmap", meta: "Required before EOD Thursday", accent: "#FFE600" },
      ],
    };
  }
  if (lower.includes("draft") || lower.includes("reply") || lower.includes("write")) {
    return {
      content: `Here's a draft reply to Sarah Chen:\n\n---\n\n**To:** Sarah Chen\n**Re:** Q3 Product Roadmap Review — Action Required\n\nHi Sarah,\n\nThanks for the heads-up. I'll have my edits on the roadmap deck to you by EOD Thursday — you'll have what you need before Friday's all-hands.\n\nOn competitive positioning: I'll connect with Marcus today to align before I mark up that section, so the board sees a unified view.\n\nOne flag: if the AI triage feature section is still showing the original scope estimate, that number needs updating before the deck goes to the board.\n\nTalk soon,\n[Your name]\n\n---\n\nWant me to adjust the tone, add more detail on any section, or send it?`,
      cards: [
        { type: "email", title: "Draft ready — Sarah Chen", meta: "Re: Q3 Roadmap · 3 sentences · professional", accent: "#FFE600" },
      ],
    };
  }
  if (lower.includes("priorit") || lower.includes("urgent") || lower.includes("attention")) {
    return {
      content: `**Your top priorities right now:**\n\n**1. Sign off on Q3 roadmap deck** — Sarah Chen is waiting. Board presentation is Friday. If you don't respond by EOD Thursday, the deck goes to Marcus incomplete.\n\n**2. Reply to Jordan Kim** — VentureLab pilot is ready. They have budget, stakeholders are aligned, and they're asking 3 specific pre-purchase questions. This is warm and time-sensitive.\n\n**3. Prep for 2 PM VentureLab demo** — Jordan's team will ask about multi-workspace support, data retention, and enterprise plans. I can prepare talking points now.\n\n**4. Follow up on Sequoia intro** — Marcus made a warm intro to Alex Torres. Alex is in SF *this week only*. The window to grab coffee is today or tomorrow.\n\nEverything else can wait until tomorrow. What do you want to tackle first?`,
      cards: [
        { type: "action", title: "Q3 Roadmap sign-off", meta: "Board deadline · Thursday EOD", accent: "#EF4444" },
        { type: "action", title: "VentureLab reply", meta: "Budget allocated · ready to buy", accent: "#10B981" },
        { type: "action", title: "Sequoia intro follow-up", meta: "Alex Torres · SF this week only", accent: "#F59E0B" },
      ],
    };
  }
  return MOCK_RESPONSES.default;
}

// ─── Priority badge ─────────────────────────────────────────────────────────────

const TAG_COLORS = {
  urgent: { color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  high: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  normal: { color: "#52525B", bg: "rgba(82,82,91,0.08)" },
};

// ─── Typing indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#FFE600",
            animation: `relay-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes relay-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        @keyframes relay-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes relay-slideup {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes relay-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,230,0,0); }
          50% { box-shadow: 0 0 24px 2px rgba(255,230,0,0.07); }
        }
      `}</style>
    </div>
  );
}

// ─── Message renderer ──────────────────────────────────────────────────────────

function MessageBubble({ msg, isLatest }: { msg: Message; isLatest: boolean }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const formattedContent = msg.content.replace(
    /\*\*(.*?)\*\*/g,
    '<strong style="color:#FFFFFF;font-weight:600">$1</strong>'
  ).replace(/\n/g, "<br/>");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        gap: 10,
        animation: isLatest ? "relay-fadein 0.3s ease-out" : "none",
      }}
    >
      {isUser ? (
        <div
          style={{
            maxWidth: 520,
            padding: "12px 18px",
            background: "#1A1A1A",
            border: "1px solid #2E2E2E",
            borderRadius: "16px 16px 4px 16px",
            fontSize: 14,
            lineHeight: 1.7,
            color: "#E4E4E7",
            fontWeight: 400,
          }}
        >
          {msg.content}
        </div>
      ) : (
        <div style={{ width: "100%", maxWidth: 680 }}>
          {/* Assistant header */}
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: "#FFE600",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Zap size={13} color="#09090B" />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#FFE600", letterSpacing: "0.04em" }}>RELAY</span>
            <span style={{ fontSize: 11, color: "#3F3F46" }}>
              {msg.timestamp.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>

          {/* Message body */}
          <div
            style={{
              padding: "20px 24px",
              background: "#111111",
              border: "1px solid #27272A",
              borderLeft: "2px solid #FFE600",
              borderRadius: "0 12px 12px 12px",
              fontSize: 14,
              lineHeight: 1.85,
              color: "#C4C4C7",
              animation: "relay-glow 3s ease-in-out 0.5s 2",
            }}
            dangerouslySetInnerHTML={{ __html: formattedContent }}
          />

          {/* Context cards */}
          {msg.cards && msg.cards.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                flexWrap: "wrap",
              }}
            >
              {msg.cards.map((card, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 13px",
                    background: "#0F0F0F",
                    border: `1px solid ${card.accent ?? "#27272A"}22`,
                    borderLeft: `2px solid ${card.accent ?? "#FFE600"}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.12s",
                    animation: `relay-fadein 0.3s ease-out ${0.1 + i * 0.06}s both`,
                    minWidth: 0,
                    flex: "1 1 auto",
                    maxWidth: 220,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "#161616";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "#0F0F0F";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: card.accent ?? "#FFE600",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#E4E4E7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {card.title}
                    </div>
                    <div style={{ fontSize: 11, color: "#71717A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {card.meta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action row */}
          <div style={{ display: "flex", gap: 6, marginTop: 10, alignItems: "center" }}>
            {[
              {
                icon: <Copy size={12} />, label: copied ? "Copied" : "Copy",
                action: () => { navigator.clipboard.writeText(msg.content); setCopied(true); setTimeout(() => setCopied(false), 2000); }
              },
              { icon: <RotateCcw size={12} />, label: "Regenerate", action: () => {} },
              { icon: <ThumbsUp size={12} />, label: "Good", action: () => {} },
              { icon: <ThumbsDown size={12} />, label: "Bad", action: () => {} },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 9px",
                  background: "transparent",
                  border: "1px solid transparent",
                  borderRadius: 6,
                  color: "#52525B",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.12s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#A1A1AA";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272A";
                  (e.currentTarget as HTMLButtonElement).style.background = "#111111";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "#52525B";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                {btn.icon}
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasMessages = messages.length > 0;

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (hasMessages) scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));

    const response = getResponse(text);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response.content,
      timestamp: new Date(),
      cards: response.cards,
    };
    setIsTyping(false);
    setMessages((prev) => [...prev, assistantMsg]);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleQuickAction = (prompt: string) => sendMessage(prompt);

  const filteredConvos = CONVERSATIONS.filter((c) =>
    searchQuery === "" || c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groups = [
    { label: "Today", items: filteredConvos.filter((c) => c.group === "today") },
    { label: "Yesterday", items: filteredConvos.filter((c) => c.group === "yesterday") },
    { label: "Earlier", items: filteredConvos.filter((c) => c.group === "earlier") },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#09090B",
        color: "#FFFFFF",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Display', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ═══════════════════════════════════════════════════════
          LEFT SIDEBAR
      ═══════════════════════════════════════════════════════ */}
      <aside
        style={{
          width: 280,
          borderRight: "1px solid #27272A",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Logo + New Chat */}
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid #27272A" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  background: "#FFE600",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 16px rgba(255,230,0,0.3)",
                }}
              >
                <Zap size={15} color="#09090B" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>Relay</div>
                <div style={{ fontSize: 10, color: "#FFE600", letterSpacing: "0.06em", fontWeight: 600 }}>AI</div>
              </div>
            </div>
            <button
              onClick={() => { setMessages([]); setActiveConvId(null); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 10px",
                background: "rgba(255,230,0,0.08)",
                border: "1px solid rgba(255,230,0,0.2)",
                borderRadius: 8,
                color: "#FFE600",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,230,0,0.14)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,230,0,0.08)";
              }}
            >
              <Plus size={13} />
              New
            </button>
          </div>

          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#111111",
              border: "1px solid #27272A",
              borderRadius: 8,
              padding: "7px 11px",
            }}
          >
            <Search size={13} color="#52525B" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: 12,
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          {groups.map(({ label, items }) =>
            items.length === 0 ? null : (
              <div key={label} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#3F3F46",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    padding: "6px 10px 4px",
                  }}
                >
                  {label}
                </div>
                {items.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => { setActiveConvId(conv.id); }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "9px 11px",
                      borderRadius: 8,
                      border: "none",
                      background: activeConvId === conv.id ? "rgba(255,230,0,0.06)" : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      transition: "all 0.1s",
                      borderLeft: activeConvId === conv.id ? "2px solid #FFE600" : "2px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (activeConvId !== conv.id) {
                        (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeConvId !== conv.id) {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      }
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: activeConvId === conv.id ? 600 : 400,
                        color: activeConvId === conv.id ? "#FFFFFF" : "#A1A1AA",
                        marginBottom: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conv.title}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#3F3F46",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {conv.preview}
                    </div>
                  </button>
                ))}
              </div>
            )
          )}
        </div>

        {/* Connected apps indicator */}
        <div style={{ padding: "12px 14px", borderTop: "1px solid #27272A" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#3F3F46", letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
            Connected
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {[
              { icon: <Mail size={11} color="#EA4335" />, label: "Gmail", sub: "14 unread" },
              { icon: <Calendar size={11} color="#4285F4" />, label: "Google Calendar", sub: "3 meetings today" },
            ].map((app) => (
              <div
                key={app.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 9px",
                  background: "#0F0F0F",
                  border: "1px solid #1E1E1E",
                  borderRadius: 7,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  {app.icon}
                  <span style={{ fontSize: 12, color: "#A1A1AA", fontWeight: 500 }}>{app.label}</span>
                </div>
                <span style={{ fontSize: 10, color: "#52525B" }}>{app.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════
          CENTER — MAIN WORKSPACE
      ═══════════════════════════════════════════════════════ */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
          position: "relative",
        }}
      >
        {/* ── EMPTY STATE / COMMAND CENTER ── */}
        {!hasMessages ? (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Hero */}
            <div
              style={{
                padding: "52px 48px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                animation: "relay-slideup 0.5s ease-out",
              }}
            >
              {/* Ambient glow */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 600,
                  height: 300,
                  background: "radial-gradient(ellipse at center top, rgba(255,230,0,0.06) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    background: "#FFE600",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 40px rgba(255,230,0,0.25), 0 0 80px rgba(255,230,0,0.08)",
                  }}
                >
                  <Zap size={22} color="#09090B" />
                </div>
              </div>

              <h1
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  letterSpacing: "-0.04em",
                  margin: "0 0 8px",
                  lineHeight: 1.1,
                  background: "linear-gradient(135deg, #FFFFFF 60%, #A1A1AA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Relay AI
              </h1>
              <p
                style={{
                  fontSize: 15,
                  color: "#71717A",
                  margin: "0 0 6px",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                }}
              >
                Your AI Executive Assistant
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12,
                  color: "#3F3F46",
                  marginBottom: 40,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981" }} />
                  <span>Gmail connected</span>
                </div>
                <span>·</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981" }} />
                  <span>Google Calendar connected</span>
                </div>
              </div>

              {/* What needs attention headline */}
              <div style={{ marginBottom: 28, position: "relative", zIndex: 1 }}>
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    margin: "0 0 6px",
                    color: "#FFFFFF",
                  }}
                >
                  What needs attention today?
                </h2>
                <p style={{ fontSize: 13, color: "#52525B", margin: 0 }}>
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  {" · "}14 unread · 3 meetings · 2 urgent
                </p>
              </div>
            </div>

            {/* Action Cards Grid */}
            <div
              style={{
                padding: "0 48px 32px",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 10,
                animation: "relay-slideup 0.5s ease-out 0.1s both",
                position: "relative",
                zIndex: 1,
              }}
            >
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={action.label}
                  onClick={() => handleQuickAction(action.prompt)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "16px 16px 14px",
                    background: "#0F0F0F",
                    border: "1px solid #1E1E1E",
                    borderRadius: 12,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                    animation: `relay-fadein 0.4s ease-out ${0.05 * i}s both`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#141414";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#2E2E2E";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#0F0F0F";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#1E1E1E";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                  }}
                >
                  <span style={{ fontSize: 20, lineHeight: 1 }}>{action.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#E4E4E7", marginBottom: 3, letterSpacing: "-0.01em" }}>
                      {action.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#52525B", lineHeight: 1.4 }}>
                      {action.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Inline status strip */}
            <div
              style={{
                margin: "0 48px 24px",
                padding: "14px 20px",
                background: "#0A0A0A",
                border: "1px solid #1A1A1A",
                borderRadius: 12,
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 0,
                animation: "relay-fadein 0.5s ease-out 0.3s both",
                position: "relative",
                zIndex: 1,
              }}
            >
              {[
                { value: "14", label: "Unread Emails", color: "#FFE600" },
                { value: "3", label: "Meetings Today", color: "#0EA5E9" },
                { value: "5", label: "Pending Replies", color: "#F59E0B" },
                { value: "2", label: "High Priority", color: "#EF4444" },
              ].map((stat, i, arr) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    borderRight: i < arr.length - 1 ? "1px solid #1A1A1A" : "none",
                    padding: "0 20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: 26,
                      fontWeight: 800,
                      letterSpacing: "-0.04em",
                      color: stat.color,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span style={{ fontSize: 11, color: "#52525B", fontWeight: 500 }}>{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Spacer to push input to proper position */}
            <div style={{ flex: 1 }} />
          </div>
        ) : (
          /* ── CONVERSATION MODE ── */
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "32px 48px",
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {messages.map((msg, i) => (
              <MessageBubble key={msg.id} msg={msg} isLatest={i === messages.length - 1} />
            ))}

            {isTyping && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  animation: "relay-fadein 0.2s ease-out",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      background: "#FFE600",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Zap size={13} color="#09090B" />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#FFE600", letterSpacing: "0.04em" }}>RELAY</span>
                </div>
                <div
                  style={{
                    padding: "16px 20px",
                    background: "#111111",
                    border: "1px solid #27272A",
                    borderLeft: "2px solid #FFE600",
                    borderRadius: "0 12px 12px 12px",
                    display: "inline-block",
                  }}
                >
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* ── STICKY INPUT AREA ── */}
        <div
          style={{
            padding: "16px 48px 24px",
            borderTop: hasMessages ? "1px solid #1A1A1A" : "none",
            background: hasMessages ? "rgba(9,9,11,0.95)" : "transparent",
            backdropFilter: hasMessages ? "blur(12px)" : "none",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: "#111111",
              border: "1px solid #2E2E2E",
              borderRadius: 14,
              overflow: "hidden",
              transition: "border-color 0.15s, box-shadow 0.15s",
              boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
            }}
            onFocusCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,230,0,0.3)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,230,0,0.1)";
            }}
            onBlurCapture={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#2E2E2E";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 32px rgba(0,0,0,0.4)";
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Relay about your inbox, calendar, meetings, or priorities..."
              rows={1}
              style={{
                width: "100%",
                padding: "16px 20px 10px",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: 14,
                fontFamily: "inherit",
                resize: "none",
                lineHeight: 1.6,
                boxSizing: "border-box",
                minHeight: 52,
                maxHeight: 160,
              }}
              onInput={(e) => {
                const el = e.currentTarget;
                el.style.height = "auto";
                el.style.height = Math.min(el.scrollHeight, 160) + "px";
              }}
            />

            {/* Input toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "6px 12px 10px",
              }}
            >
              <div style={{ display: "flex", gap: 2 }}>
                {[
                  { icon: <Paperclip size={14} />, title: "Attach" },
                  { icon: <Command size={14} />, title: "Commands" },
                ].map((btn) => (
                  <button
                    key={btn.title}
                    title={btn.title}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px 8px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 6,
                      color: "#52525B",
                      cursor: "pointer",
                      transition: "color 0.12s",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#A1A1AA")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#52525B")}
                  >
                    {btn.icon}
                  </button>
                ))}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 9px",
                    background: "#0F0F0F",
                    border: "1px solid #1E1E1E",
                    borderRadius: 6,
                    marginLeft: 4,
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10B981" }} />
                  <span style={{ fontSize: 10, color: "#52525B", fontWeight: 500 }}>Gmail · Calendar</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#3F3F46" }}>
                  {input.length > 0 ? `${input.length} chars` : "⏎ to send"}
                </span>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isTyping}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    background: input.trim() && !isTyping ? "#FFE600" : "#1A1A1A",
                    border: "none",
                    borderRadius: 8,
                    color: input.trim() && !isTyping ? "#09090B" : "#3F3F46",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: input.trim() && !isTyping ? "pointer" : "default",
                    fontFamily: "inherit",
                    transition: "all 0.15s",
                    letterSpacing: "-0.01em",
                  }}
                  onMouseEnter={(e) => {
                    if (input.trim() && !isTyping) {
                      (e.currentTarget as HTMLButtonElement).style.background = "#FFF000";
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = input.trim() && !isTyping ? "#FFE600" : "#1A1A1A";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  <Send size={13} />
                  Send
                </button>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 11, color: "#27272A", margin: "10px 0 0" }}>
            Relay reads your Gmail and Calendar to give contextual answers. Your data stays private.
          </p>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════
          RIGHT SIDEBAR — EXECUTIVE DASHBOARD
      ═══════════════════════════════════════════════════════ */}
      <aside
        style={{
          width: 300,
          borderLeft: "1px solid #27272A",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 18px 14px",
            borderBottom: "1px solid #27272A",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Activity size={13} color="#FFE600" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#A1A1AA", letterSpacing: "0.02em" }}>
              Executive Dashboard
            </span>
          </div>
          <span style={{ fontSize: 11, color: "#3F3F46" }}>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px 20px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Quick Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
            }}
          >
            {[
              { value: "14", label: "Unread", color: "#FFE600", icon: <Mail size={11} /> },
              { value: "3", label: "Meetings", color: "#0EA5E9", icon: <Calendar size={11} /> },
              { value: "5", label: "Replies", color: "#F59E0B", icon: <MessageSquare size={11} /> },
              { value: "2", label: "Urgent", color: "#EF4444", icon: <AlertCircle size={11} /> },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  padding: "12px 12px",
                  background: "#0F0F0F",
                  border: "1px solid #1A1A1A",
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ color: "#3F3F46" }}>{s.icon}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 10, color: "#52525B", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Today's Priorities */}
          <div
            style={{
              background: "#0F0F0F",
              border: "1px solid #1A1A1A",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "11px 14px 10px", borderBottom: "1px solid #1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
              <Flag size={11} color="#FFE600" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#71717A", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Priorities
              </span>
            </div>
            <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 7 }}>
              {TODAY_PRIORITIES.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  {p.done ? (
                    <CheckCircle2 size={13} color="#2D2D2D" style={{ marginTop: 1.5, flexShrink: 0 }} />
                  ) : (
                    <Circle
                      size={13}
                      color={p.tag === "urgent" ? "#EF4444" : p.tag === "high" ? "#F59E0B" : "#52525B"}
                      style={{ marginTop: 1.5, flexShrink: 0 }}
                    />
                  )}
                  <span
                    style={{
                      fontSize: 12,
                      color: p.done ? "#3F3F46" : "#C4C4C7",
                      textDecoration: p.done ? "line-through" : "none",
                      lineHeight: 1.45,
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Meetings */}
          <div
            style={{
              background: "#0F0F0F",
              border: "1px solid #1A1A1A",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "11px 14px 10px", borderBottom: "1px solid #1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
              <Calendar size={11} color="#A1A1AA" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#71717A", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Upcoming
              </span>
            </div>
            <div style={{ padding: "8px 12px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
              {UPCOMING_MEETINGS.map((m, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(`Prepare me for my meeting: ${m.title} at ${m.time}`)}
                  style={{
                    display: "flex",
                    gap: 9,
                    padding: "8px 9px",
                    background: "transparent",
                    border: "1px solid transparent",
                    borderRadius: 8,
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    transition: "all 0.12s",
                    alignItems: "flex-start",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#1E1E1E";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 36,
                      borderRadius: 2,
                      background: m.color,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#D4D4D8",
                        lineHeight: 1.3,
                        marginBottom: 3,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {m.title}
                    </div>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#71717A" }}>
                        {m.time} · {m.duration}
                      </span>
                      <span style={{ fontSize: 10, color: "#52525B", display: "flex", alignItems: "center", gap: 3 }}>
                        {m.isVideo ? <Video size={9} /> : <Users size={9} />}
                        {m.attendees}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Unread Emails */}
          <div
            style={{
              background: "#0F0F0F",
              border: "1px solid #1A1A1A",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "11px 14px 10px",
                borderBottom: "1px solid #1A1A1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Inbox size={11} color="#A1A1AA" />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#71717A", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  Inbox
                </span>
              </div>
              <button
                onClick={() => handleQuickAction("Summarize my inbox and tell me what needs my attention.")}
                style={{
                  fontSize: 10,
                  color: "#FFE600",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                  transition: "opacity 0.12s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.7")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
              >
                Ask Relay →
              </button>
            </div>
            <div style={{ padding: "8px 12px 10px", display: "flex", flexDirection: "column", gap: 1 }}>
              {UNREAD_EMAILS.map((email, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                    padding: "7px 6px",
                    borderRadius: 7,
                    cursor: "pointer",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: email.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {email.initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#D4D4D8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {email.sender}
                    </div>
                    <div style={{ fontSize: 11, color: "#52525B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {email.subject}
                    </div>
                  </div>
                  {email.priority !== "normal" && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: email.priority === "urgent" ? "#EF4444" : "#F59E0B",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Actions */}
          <div
            style={{
              background: "#0F0F0F",
              border: "1px solid #1A1A1A",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "11px 14px 10px", borderBottom: "1px solid #1A1A1A", display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={11} color="#A1A1AA" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#71717A", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Recent Actions
              </span>
            </div>
            <div style={{ padding: "8px 14px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { label: "Summarized inbox", time: "9:14 AM", icon: <Mail size={10} /> },
                { label: "Drafted reply to Priya", time: "8:30 AM", icon: <FileText size={10} /> },
                { label: "Created VentureLab brief", time: "8:02 AM", icon: <Users size={10} /> },
                { label: "Flagged roadmap deadline", time: "Yesterday", icon: <Flag size={10} /> },
              ].map((action, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ color: "#3F3F46" }}>{action.icon}</span>
                    <span style={{ fontSize: 12, color: "#71717A" }}>{action.label}</span>
                  </div>
                  <span style={{ fontSize: 10, color: "#3F3F46", flexShrink: 0 }}>{action.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}