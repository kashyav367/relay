"use client";

import { useState } from "react";
import {
  Inbox,
  Mail,
  Star,
  Reply,
  FileText,
  Send,
  Archive,
  Trash2,
  Flag,
  RefreshCw,
  Search,
  ChevronDown,
  Sparkles,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  MoreHorizontal,
  Zap,
  ArrowRight,
  Circle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "urgent" | "high" | "normal" | "low";
type Folder = "inbox" | "unread" | "important" | "needs-reply" | "drafts" | "sent";

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  senderInitials: string;
  senderColor: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  time: string;
  priority: Priority;
  unread: boolean;
  starred: boolean;
  hasAttachment: boolean;
  aiSummary: string;
  aiInsights: string[];
  suggestedActions: string[];
  folder: Folder[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_EMAILS: Email[] = [
  {
    id: "1",
    sender: "Sarah Chen",
    senderEmail: "sarah.chen@acmecorp.com",
    senderInitials: "SC",
    senderColor: "#7C3AED",
    subject: "Q3 Product Roadmap Review — Action Required",
    snippet: "Hi, I wanted to follow up on our discussion from Monday. The board is asking for final sign-off on the roadmap before the all-hands on Friday...",
    body: `Hi,\n\nI wanted to follow up on our discussion from Monday. The board is asking for final sign-off on the roadmap before the all-hands on Friday. We need your input on the three initiatives we flagged:\n\n1. The AI-assisted triage feature\n2. Mobile app revamp timeline\n3. Enterprise SSO rollout\n\nCould you review the attached deck and send any edits by EOD Thursday? I'll be compiling feedback from all stakeholders and presenting a unified view to Marcus.\n\nAlso — Marcus specifically asked about the competitive positioning section. Might be worth spending 10 minutes on that before Thursday.\n\nThanks,\nSarah`,
    date: "Today",
    time: "9:14 AM",
    priority: "urgent",
    unread: true,
    starred: true,
    hasAttachment: true,
    aiSummary: "Sarah needs your sign-off on the Q3 roadmap before the Friday all-hands. Three decisions are outstanding: AI triage feature, mobile revamp timeline, and enterprise SSO. The board — specifically Marcus — wants input on competitive positioning. Deadline is EOD Thursday.",
    aiInsights: [
      "Board-level deadline: Friday all-hands is a hard stop",
      "Marcus is personally watching the competitive positioning section",
      "Three unresolved decisions are blocking the full roadmap",
      "Your response by Thursday EOD is on the critical path",
    ],
    suggestedActions: ["Draft reply confirming Thursday deadline", "Flag for calendar: block 30 min today", "Generate competitive positioning notes"],
    folder: ["inbox", "important", "needs-reply"],
  },
  {
    id: "2",
    sender: "Marcus Webb",
    senderEmail: "m.webb@acmecorp.com",
    senderInitials: "MW",
    senderColor: "#0EA5E9",
    subject: "Intro: Alex Torres / Relay Partnership",
    snippet: "Hey — want to connect you with Alex Torres from Sequoia. They're exploring AI workflow tooling for their portfolio companies and I thought Relay would be a perfect fit...",
    body: `Hey —\n\nWant to connect you with Alex Torres from Sequoia. They're exploring AI workflow tooling for their portfolio companies and I thought Relay would be a perfect fit.\n\nAlex, meet the founder of Relay. Their product is exactly what we've been looking for — AI-native executive assistant that actually understands context.\n\nI'll let you two take it from here. Alex is in SF this week if you want to grab coffee.\n\n— Marcus`,
    date: "Today",
    time: "8:02 AM",
    priority: "high",
    unread: true,
    starred: false,
    hasAttachment: false,
    aiSummary: "Marcus is making a warm intro to Alex Torres at Sequoia. They're actively evaluating AI workflow tools for portfolio companies — this is an inbound investor/partnership signal. Alex is in SF this week, creating an immediate in-person opportunity.",
    aiInsights: [
      "Sequoia is actively sourcing AI workflow tools — this is warm, not cold",
      "In-person window: Alex Torres is in SF this week only",
      "Marcus has pre-sold Relay — don't over-explain, move to meeting",
    ],
    suggestedActions: ["Draft reply to Alex + suggest coffee this week", "Research Alex Torres / Sequoia portfolio", "Block 1hr on calendar for potential SF meeting"],
    folder: ["inbox", "important", "needs-reply"],
  },
  {
    id: "3",
    sender: "Priya Nair",
    senderEmail: "priya@designstudio.co",
    senderInitials: "PN",
    senderColor: "#F59E0B",
    subject: "Brand refresh final assets — ready for handoff",
    snippet: "The final brand package is ready. Included in this delivery: updated logo suite (SVG + PNG), color tokens, typography specimens, motion guidelines...",
    body: `Hi,\n\nThe final brand package is ready. Included in this delivery:\n\n• Updated logo suite (SVG + PNG, all variants)\n• Color tokens (Figma + CSS variables)\n• Typography specimens (Inter Display + JetBrains Mono)\n• Motion guidelines PDF\n• Component library preview\n\nEverything is in the shared Figma file and also zipped in the Drive folder I've linked below.\n\nOne thing to note: we adjusted the primary yellow slightly — it's now #FFE600 instead of #FFD700. The new value is warmer and holds up better on dark backgrounds at small sizes.\n\nLet me know if any revisions are needed before you hand this to engineering.\n\nPriya`,
    date: "Yesterday",
    time: "4:47 PM",
    priority: "normal",
    unread: false,
    starred: false,
    hasAttachment: true,
    aiSummary: "Final brand assets are ready for handoff. Priya delivered the full package including logos, color tokens, typography, and motion guidelines. Notable change: primary yellow updated to #FFE600. Assets are in Figma and Google Drive.",
    aiInsights: [
      "Primary yellow changed from #FFD700 → #FFE600 — engineering needs to update",
      "Brand package is complete — no revisions flagged",
      "Assets are in two places: Figma + Drive (confirm engineering has access)",
    ],
    suggestedActions: ["Reply confirming receipt", "Forward color token update to engineering", "Archive after review"],
    folder: ["inbox"],
  },
  {
    id: "4",
    sender: "DataDog",
    senderEmail: "alerts@datadoghq.com",
    senderInitials: "DD",
    senderColor: "#EF4444",
    subject: "[ALERT] P1 — API latency spike detected (relay-prod)",
    snippet: "A latency anomaly has been detected on relay-prod. p99 response time exceeded 2800ms threshold. Affected service: email-ingestion-worker. Alert started at 07:23 UTC...",
    body: `A latency anomaly has been detected on relay-prod.\n\np99 response time exceeded 2800ms threshold.\nAffected service: email-ingestion-worker\nAlert started: 07:23 UTC\nDuration: 14 minutes (auto-resolved at 07:37 UTC)\n\nThis alert has been auto-resolved. No action required unless issues persist.\n\nView full trace in DataDog →`,
    date: "Today",
    time: "7:23 AM",
    priority: "urgent",
    unread: true,
    starred: false,
    hasAttachment: false,
    aiSummary: "A P1 latency spike hit the email ingestion worker at 07:23 UTC. It lasted 14 minutes and auto-resolved by 07:37 UTC. No action is currently required, but worth reviewing the trace if this is a recurring pattern.",
    aiInsights: [
      "Auto-resolved — no immediate action needed",
      "14-minute duration: could indicate a cold-start or memory pressure issue",
      "Check if this coincides with the 7am cron job or a traffic spike",
    ],
    suggestedActions: ["Archive — auto-resolved", "Share with on-call engineer", "Log in incident tracker"],
    folder: ["inbox", "unread"],
  },
  {
    id: "5",
    sender: "Jordan Kim",
    senderEmail: "jordan@venturelab.io",
    senderInitials: "JK",
    senderColor: "#10B981",
    subject: "Re: Demo follow-up + next steps",
    snippet: "Thanks for the demo on Tuesday — the team was genuinely impressed. A few follow-up questions came up internally that I wanted to run by you before we move to a pilot proposal...",
    body: `Thanks for the demo on Tuesday — the team was genuinely impressed.\n\nA few follow-up questions came up internally:\n\n1. Does Relay support multi-workspace Google accounts? Our execs often manage 2-3 inboxes.\n2. What's the data retention policy for email content processed by the AI?\n3. Is there a team/enterprise plan in the works?\n\nOnce we have clarity on these, I'd like to move quickly toward a pilot proposal. We have budget allocated for Q3 and the stakeholders are aligned.\n\nJordan`,
    date: "Yesterday",
    time: "11:30 AM",
    priority: "high",
    unread: false,
    starred: true,
    hasAttachment: false,
    aiSummary: "Jordan's team is ready to move to a pilot — budget is allocated and stakeholders are aligned. Three technical questions are blocking next steps: multi-workspace support, data retention policy, and enterprise plan availability. This is a hot lead.",
    aiInsights: [
      "High buying signal: budget allocated, stakeholders aligned, asking pre-purchase questions",
      "Multi-workspace is a feature gap to acknowledge honestly",
      "Data retention policy needs a clear, written answer — this is a procurement requirement",
      "Enterprise plan question = sizing conversation opportunity",
    ],
    suggestedActions: ["Draft reply answering all 3 questions", "CC sales / solutions engineer", "Create follow-up reminder for 48hrs"],
    folder: ["inbox", "important", "needs-reply"],
  },
  {
    id: "6",
    sender: "Notion",
    senderEmail: "noreply@notion.so",
    senderInitials: "N",
    senderColor: "#18181B",
    subject: "Your weekly digest — 3 pages need review",
    snippet: "Here's what happened in your Notion workspace this week. 3 pages were shared with you, 2 documents are awaiting your review...",
    body: `Here's what happened in your Notion workspace this week:\n\n• 3 pages shared with you\n• 2 documents awaiting your review\n• 1 comment mention\n\nTop activity: Q3 Planning > Roadmap document was updated by Sarah Chen (14 edits)\n\nOpen Notion →`,
    date: "Mon",
    time: "8:00 AM",
    priority: "low",
    unread: false,
    starred: false,
    hasAttachment: false,
    aiSummary: "Weekly Notion digest. Sarah Chen made 14 edits to the Q3 Roadmap document — likely connected to her email about the roadmap review. Two documents are awaiting your review.",
    aiInsights: [
      "Sarah's 14 edits to Q3 Roadmap are directly related to her urgent email",
      "Two docs awaiting review — worth batching with Sarah's roadmap sign-off",
    ],
    suggestedActions: ["Archive", "Open Q3 Roadmap in Notion"],
    folder: ["inbox"],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  urgent: { label: "Urgent", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
  high: { label: "High", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  normal: { label: "Normal", color: "#A1A1AA", bg: "rgba(161,161,170,0.1)" },
  low: { label: "Low", color: "#52525B", bg: "rgba(82,82,91,0.1)" },
};

const folderItems: { id: Folder; label: string; icon: React.ReactNode; count?: number }[] = [
  { id: "inbox", label: "Inbox", icon: <Inbox size={15} />, count: 6 },
  { id: "unread", label: "Unread", icon: <Circle size={15} />, count: 3 },
  { id: "important", label: "Important", icon: <Star size={15} />, count: 3 },
  { id: "needs-reply", label: "Needs Reply", icon: <Reply size={15} />, count: 3 },
  { id: "drafts", label: "Drafts", icon: <FileText size={15} />, count: 1 },
  { id: "sent", label: "Sent", icon: <Send size={15} /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InboxPage() {
  const [activeFolder, setActiveFolder] = useState<Folder>("inbox");
  const [selectedEmail, setSelectedEmail] = useState<Email>(MOCK_EMAILS[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmails = MOCK_EMAILS.filter((e) => {
    const matchesFolder = e.folder.includes(activeFolder);
    const matchesSearch =
      searchQuery === "" ||
      e.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#09090B",
        color: "#FFFFFF",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Left Sidebar ── */}
      <aside
        style={{
          width: 220,
          borderRight: "1px solid #27272A",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "0 16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div
              style={{
                width: 28,
                height: 28,
                background: "#FFE600",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={14} color="#09090B" />
            </div>
            <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em" }}>Relay</span>
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
              padding: "7px 10px",
              transition: "border-color 0.15s",
            }}
          >
            <Search size={13} color="#A1A1AA" />
            <input
              type="text"
              placeholder="Search mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: 13,
                width: "100%",
                fontFamily: "inherit",
              }}
            />
          </div>
        </div>

        <nav style={{ flex: 1, padding: "0 8px" }}>
          {folderItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveFolder(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "7px 10px",
                borderRadius: 7,
                border: "none",
                background: activeFolder === item.id ? "rgba(255,230,0,0.08)" : "transparent",
                color: activeFolder === item.id ? "#FFE600" : "#A1A1AA",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
                transition: "all 0.12s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (activeFolder !== item.id) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (activeFolder !== item.id) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#A1A1AA";
                }
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                {item.icon}
                {item.label}
              </span>
              {item.count ? (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    background: activeFolder === item.id ? "rgba(255,230,0,0.15)" : "rgba(255,255,255,0.06)",
                    color: activeFolder === item.id ? "#FFE600" : "#71717A",
                    borderRadius: 4,
                    padding: "1px 6px",
                  }}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 16px 0", borderTop: "1px solid #27272A" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "8px 10px",
              background: "rgba(255,230,0,0.06)",
              border: "1px solid rgba(255,230,0,0.15)",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <Sparkles size={13} color="#FFE600" />
            <span style={{ fontSize: 12, color: "#FFE600", fontWeight: 500 }}>AI Briefing ready</span>
          </div>
        </div>
      </aside>

      {/* ── Email List ── */}
      <section
        style={{
          width: 340,
          borderRight: "1px solid #27272A",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: "20px 16px 14px",
            borderBottom: "1px solid #27272A",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
              {folderItems.find((f) => f.id === activeFolder)?.label}
            </h2>
            <p style={{ fontSize: 12, color: "#52525B", margin: "2px 0 0", fontWeight: 400 }}>
              {filteredEmails.length} messages
            </p>
          </div>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#52525B",
              cursor: "pointer",
              padding: 4,
              borderRadius: 6,
              display: "flex",
              transition: "color 0.12s",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#52525B")}
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredEmails.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#52525B",
                gap: 8,
              }}
            >
              <Inbox size={24} />
              <span style={{ fontSize: 13 }}>No messages here</span>
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #18181B",
                  cursor: "pointer",
                  background: selectedEmail.id === email.id ? "rgba(255,230,0,0.04)" : "transparent",
                  borderLeft: selectedEmail.id === email.id ? "2px solid #FFE600" : "2px solid transparent",
                  transition: "all 0.12s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (selectedEmail.id !== email.id) {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedEmail.id !== email.id) {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  {/* Avatar */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: email.senderColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      flexShrink: 0,
                      opacity: email.unread ? 1 : 0.7,
                    }}
                  >
                    {email.senderInitials}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: email.unread ? 600 : 400,
                          color: email.unread ? "#FFFFFF" : "#A1A1AA",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 160,
                        }}
                      >
                        {email.sender}
                      </span>
                      <span style={{ fontSize: 11, color: "#52525B", flexShrink: 0 }}>{email.time}</span>
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: email.unread ? 600 : 400,
                        color: email.unread ? "#E4E4E7" : "#71717A",
                        marginBottom: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {email.subject}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#52525B",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        marginBottom: 6,
                      }}
                    >
                      {email.snippet}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {email.priority !== "normal" && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background: priorityConfig[email.priority].bg,
                            color: priorityConfig[email.priority].color,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {priorityConfig[email.priority].label}
                        </span>
                      )}
                      {email.unread && (
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#FFE600",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {email.starred && <Star size={11} color="#F59E0B" fill="#F59E0B" />}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Right Panel: Email Preview + AI ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {selectedEmail ? (
          <>
            {/* Header */}
            <div
              style={{
                padding: "20px 28px 16px",
                borderBottom: "1px solid #27272A",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                    margin: "0 0 6px",
                    color: "#FFFFFF",
                  }}
                >
                  {selectedEmail.subject}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: selectedEmail.senderColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 700,
                    }}
                  >
                    {selectedEmail.senderInitials}
                  </div>
                  <span style={{ fontSize: 13, color: "#A1A1AA" }}>
                    {selectedEmail.sender}{" "}
                    <span style={{ color: "#52525B" }}>&lt;{selectedEmail.senderEmail}&gt;</span>
                  </span>
                  <span style={{ fontSize: 12, color: "#52525B" }}>
                    · {selectedEmail.date}, {selectedEmail.time}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "2px 7px",
                      borderRadius: 4,
                      background: priorityConfig[selectedEmail.priority].bg,
                      color: priorityConfig[selectedEmail.priority].color,
                    }}
                  >
                    {priorityConfig[selectedEmail.priority].label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                {[
                  { icon: <Reply size={14} />, label: "Reply" },
                  { icon: <Archive size={14} />, label: "Archive" },
                  { icon: <Trash2 size={14} />, label: "Delete" },
                  { icon: <Flag size={14} />, label: "Flag" },
                  { icon: <MoreHorizontal size={14} />, label: "More" },
                ].map((action) => (
                  <button
                    key={action.label}
                    title={action.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "6px 10px",
                      background: "#111111",
                      border: "1px solid #27272A",
                      borderRadius: 7,
                      color: "#A1A1AA",
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: "inherit",
                      transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#1A1A1A";
                      (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#3F3F46";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#111111";
                      (e.currentTarget as HTMLButtonElement).style.color = "#A1A1AA";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272A";
                    }}
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
              {/* Email Body */}
              <div
                style={{
                  flex: 1,
                  padding: "24px 28px",
                  overflowY: "auto",
                  minWidth: 0,
                  borderRight: "1px solid #27272A",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.75,
                    color: "#D4D4D8",
                    whiteSpace: "pre-line",
                    maxWidth: 600,
                  }}
                >
                  {selectedEmail.body}
                </div>
              </div>

              {/* AI Panel */}
              <div
                style={{
                  width: 320,
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                  padding: "20px 20px 24px",
                  gap: 16,
                  flexShrink: 0,
                }}
              >
                {/* AI Summary */}
                <div
                  style={{
                    background: "#111111",
                    border: "1px solid #27272A",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
                    <Sparkles size={13} color="#FFE600" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#FFE600", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      AI Summary
                    </span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "#A1A1AA", margin: 0 }}>
                    {selectedEmail.aiSummary}
                  </p>
                </div>

                {/* AI Insights */}
                <div
                  style={{
                    background: "#111111",
                    border: "1px solid #27272A",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                    <AlertCircle size={13} color="#A1A1AA" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#71717A", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Insights
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedEmail.aiInsights.map((insight, i) => (
                      <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
                        <div
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "#FFE600",
                            marginTop: 6,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.55 }}>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Actions */}
                <div
                  style={{
                    background: "#111111",
                    border: "1px solid #27272A",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                    <Zap size={13} color="#A1A1AA" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#71717A", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Suggested Actions
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {selectedEmail.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid #27272A",
                          borderRadius: 7,
                          color: "#D4D4D8",
                          cursor: "pointer",
                          fontSize: 12,
                          fontFamily: "inherit",
                          textAlign: "left",
                          transition: "all 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,230,0,0.06)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,230,0,0.2)";
                          (e.currentTarget as HTMLButtonElement).style.color = "#FFE600";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272A";
                          (e.currentTarget as HTMLButtonElement).style.color = "#D4D4D8";
                        }}
                      >
                        {action}
                        <ArrowRight size={12} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Draft Reply CTA */}
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "11px 16px",
                    background: "#FFE600",
                    border: "none",
                    borderRadius: 9,
                    color: "#09090B",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    letterSpacing: "-0.01em",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#FFF000";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#FFE600";
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }}
                >
                  <Sparkles size={14} />
                  Draft AI Reply
                </button>
              </div>
            </div>
          </>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              color: "#52525B",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <Mail size={32} style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14 }}>Select a message</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
