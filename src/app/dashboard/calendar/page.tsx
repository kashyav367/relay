"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sparkles,
  Clock,
  MapPin,
  Users,
  Video,
  Zap,
  CheckCircle2,
  Circle,
  CalendarDays,
  AlertCircle,
  ArrowRight,
  MoreHorizontal,
  Star,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MeetingStatus = "upcoming" | "live" | "completed";
type CalendarView = "day" | "week" | "month";

interface Attendee {
  name: string;
  initials: string;
  color: string;
}

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  isVideo: boolean;
  status: MeetingStatus;
  attendees: Attendee[];
  brief: string;
  prepNotes: string[];
  dayIndex: number; // 0 = today, 1 = tomorrow, etc.
  hour: number; // grid position
  color: string;
  accentColor: string;
}

interface Priority {
  label: string;
  done: boolean;
  tag: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_MEETINGS: Meeting[] = [
  {
    id: "1",
    title: "Q3 Roadmap Review",
    startTime: "9:00 AM",
    endTime: "10:00 AM",
    duration: "1h",
    location: "Zoom",
    isVideo: true,
    status: "completed",
    attendees: [
      { name: "Sarah Chen", initials: "SC", color: "#7C3AED" },
      { name: "Marcus Webb", initials: "MW", color: "#0EA5E9" },
      { name: "You", initials: "YO", color: "#FFE600" },
    ],
    brief:
      "Board-level review of Q3 product roadmap. Three open decisions: AI triage feature scope, mobile revamp timeline, and enterprise SSO rollout. Marcus will ask about competitive positioning.",
    prepNotes: [
      "Review Sarah's updated roadmap deck (14 edits since Monday)",
      "Prepare stance on AI triage feature scope",
      "Competitive positioning: note Superhuman, Notion AI gaps",
    ],
    dayIndex: 0,
    hour: 9,
    color: "rgba(124,58,237,0.12)",
    accentColor: "#7C3AED",
  },
  {
    id: "2",
    title: "1:1 with Marcus Webb",
    startTime: "11:00 AM",
    endTime: "11:30 AM",
    duration: "30m",
    location: "Google Meet",
    isVideo: true,
    status: "upcoming",
    attendees: [
      { name: "Marcus Webb", initials: "MW", color: "#0EA5E9" },
      { name: "You", initials: "YO", color: "#FFE600" },
    ],
    brief:
      "Regular weekly sync with Marcus. Likely to cover: the Sequoia intro (Alex Torres), board prep for Friday, and your thoughts on the roadmap sign-off.",
    prepNotes: [
      "Follow up on Alex Torres intro — suggest coffee this week",
      "Align on what Marcus wants in the competitive positioning section",
      "Confirm Friday all-hands agenda timing",
    ],
    dayIndex: 0,
    hour: 11,
    color: "rgba(14,165,233,0.12)",
    accentColor: "#0EA5E9",
  },
  {
    id: "3",
    title: "Product Demo — VentureLab",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    duration: "1h",
    location: "Zoom",
    isVideo: true,
    status: "upcoming",
    attendees: [
      { name: "Jordan Kim", initials: "JK", color: "#10B981" },
      { name: "You", initials: "YO", color: "#FFE600" },
      { name: "Alex Torres", initials: "AT", color: "#F59E0B" },
    ],
    brief:
      "Follow-up demo for VentureLab after Tuesday's call. Jordan's team has budget allocated and stakeholders aligned. Three open questions: multi-workspace support, data retention policy, enterprise plan.",
    prepNotes: [
      "Answer Jordan's 3 questions before the call starts",
      "Prepare multi-workspace roadmap slide",
      "Have data retention one-pager ready to share",
      "Mention enterprise plan ETA (Q4 target)",
    ],
    dayIndex: 0,
    hour: 14,
    color: "rgba(16,185,129,0.12)",
    accentColor: "#10B981",
  },
  {
    id: "4",
    title: "Engineering Standup",
    startTime: "10:00 AM",
    endTime: "10:20 AM",
    duration: "20m",
    location: "Slack Huddle",
    isVideo: false,
    status: "upcoming",
    attendees: [
      { name: "Dev Team", initials: "DT", color: "#EF4444" },
      { name: "You", initials: "YO", color: "#FFE600" },
    ],
    brief:
      "Daily engineering standup. Follow up on yesterday's P1 latency spike on email-ingestion-worker. Review sprint velocity heading into Friday.",
    prepNotes: [
      "Check DataDog trace for 07:23 UTC latency spike",
      "Ask if cold-start fix is in this sprint",
      "Confirm mobile app revamp is on track for Q3 target",
    ],
    dayIndex: 1,
    hour: 10,
    color: "rgba(239,68,68,0.12)",
    accentColor: "#EF4444",
  },
  {
    id: "5",
    title: "All-Hands — Relay Q3 Preview",
    startTime: "3:00 PM",
    endTime: "4:30 PM",
    duration: "1.5h",
    location: "HQ — Main Floor",
    isVideo: false,
    status: "upcoming",
    attendees: [
      { name: "Full Team", initials: "FT", color: "#8B5CF6" },
      { name: "Board", initials: "BD", color: "#F59E0B" },
    ],
    brief:
      "Company-wide all-hands presenting the Q3 roadmap. Board will be present. Sarah is compiling all stakeholder feedback — your sign-off must be in by Thursday EOD.",
    prepNotes: [
      "Sign off on roadmap by EOD Thursday",
      "Review competitive positioning section with Marcus first",
      "Prepare 2-min summary of AI triage feature for non-technical audience",
    ],
    dayIndex: 2,
    hour: 15,
    color: "rgba(139,92,246,0.12)",
    accentColor: "#8B5CF6",
  },
];

const TODAY_PRIORITIES: Priority[] = [
  { label: "Sign off on Q3 roadmap deck", done: false, tag: "Urgent" },
  { label: "Reply to Jordan Kim (VentureLab pilot)", done: false, tag: "High" },
  { label: "Review DataDog latency trace", done: true, tag: "Done" },
  { label: "Draft reply to Sarah Chen", done: false, tag: "High" },
  { label: "Send brand tokens to engineering", done: true, tag: "Done" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7); // 7am–6pm

function statusBadge(status: MeetingStatus) {
  if (status === "live") return { label: "Live", color: "#EF4444", bg: "rgba(239,68,68,0.1)" };
  if (status === "completed") return { label: "Done", color: "#52525B", bg: "rgba(82,82,91,0.08)" };
  return { label: "Upcoming", color: "#10B981", bg: "rgba(16,185,129,0.1)" };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today = new Date();
  const [view, setView] = useState<CalendarView>("week");
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting>(MOCK_MEETINGS[2]);
  const [miniDay, setMiniDay] = useState(today.getDate());

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const todayMeetings = MOCK_MEETINGS.filter((m) => m.dayIndex === 0);
  const tomorrowMeetings = MOCK_MEETINGS.filter((m) => m.dayIndex === 1);
  const laterMeetings = MOCK_MEETINGS.filter((m) => m.dayIndex >= 2);

  // Week view: 7 days starting Sunday of current week
  const weekStartOffset = today.getDay();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - weekStartOffset + i);
    return d;
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
      {/* ── Left Column ── */}
      <aside
        style={{
          width: 228,
          borderRight: "1px solid #27272A",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #27272A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
        </div>

        {/* Mini Calendar */}
        <div style={{ padding: "16px 14px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {MONTHS[calMonth]} {calYear}
            </span>
            <div style={{ display: "flex", gap: 2 }}>
              <button
                onClick={() => {
                  if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                  else setCalMonth(m => m - 1);
                }}
                style={{ background: "none", border: "none", color: "#71717A", cursor: "pointer", padding: 3, borderRadius: 4, display: "flex" }}
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => {
                  if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                  else setCalMonth(m => m + 1);
                }}
                style={{ background: "none", border: "none", color: "#71717A", cursor: "pointer", padding: 3, borderRadius: 4, display: "flex" }}
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 4 }}>
            {DAYS.map((d) => (
              <div key={d} style={{ textAlign: "center", fontSize: 10, color: "#52525B", fontWeight: 600, padding: "2px 0" }}>
                {d[0]}
              </div>
            ))}
          </div>

          {/* Date grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
              const isSelected = day === miniDay;
              const hasMeeting = day === today.getDate() || day === today.getDate() + 1 || day === today.getDate() + 2;
              return (
                <button
                  key={day}
                  onClick={() => setMiniDay(day)}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    background: isToday ? "#FFE600" : isSelected ? "rgba(255,230,0,0.12)" : "transparent",
                    border: "none",
                    borderRadius: "50%",
                    color: isToday ? "#09090B" : isSelected ? "#FFE600" : "#D4D4D8",
                    fontSize: 11,
                    fontWeight: isToday ? 700 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.12s",
                  }}
                >
                  {day}
                  {hasMeeting && !isToday && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "#FFE600",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Upcoming sections */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Today", meetings: todayMeetings },
            { label: "Tomorrow", meetings: tomorrowMeetings },
            { label: "This Week", meetings: laterMeetings },
          ].map(({ label, meetings }) => (
            <div key={label}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#52525B", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                {label}
              </span>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {meetings.length === 0 ? (
                  <span style={{ fontSize: 12, color: "#3F3F46" }}>No meetings</span>
                ) : (
                  meetings.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMeeting(m)}
                      style={{
                        display: "flex",
                        gap: 9,
                        padding: "7px 8px",
                        background: selectedMeeting?.id === m.id ? "rgba(255,230,0,0.06)" : "transparent",
                        border: selectedMeeting?.id === m.id ? "1px solid rgba(255,230,0,0.15)" : "1px solid transparent",
                        borderRadius: 7,
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "inherit",
                        transition: "all 0.12s",
                        alignItems: "flex-start",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedMeeting?.id !== m.id) {
                          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedMeeting?.id !== m.id) {
                          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        }
                      }}
                    >
                      <div
                        style={{
                          width: 3,
                          height: 32,
                          borderRadius: 2,
                          background: m.accentColor,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      />
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: "#E4E4E7", lineHeight: 1.3, marginBottom: 2 }}>
                          {m.title}
                        </div>
                        <div style={{ fontSize: 11, color: "#71717A" }}>{m.startTime} · {m.duration}</div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Center: Calendar ── */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
          borderRight: "1px solid #27272A",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #27272A",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.025em", margin: 0 }}>
              {MONTHS[today.getMonth()]} {today.getFullYear()}
            </h2>
            <div style={{ display: "flex", gap: 2 }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#71717A",
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: 6,
                  display: "flex",
                  transition: "color 0.12s",
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#71717A",
                  cursor: "pointer",
                  padding: "4px 6px",
                  borderRadius: 6,
                  display: "flex",
                  transition: "color 0.12s",
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <button
              style={{
                padding: "5px 12px",
                background: "#111111",
                border: "1px solid #27272A",
                borderRadius: 7,
                color: "#A1A1AA",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Today
            </button>
          </div>

          {/* View Toggle */}
          <div
            style={{
              display: "flex",
              background: "#111111",
              border: "1px solid #27272A",
              borderRadius: 8,
              padding: 2,
            }}
          >
            {(["day", "week", "month"] as CalendarView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: "5px 12px",
                  background: view === v ? "#1F1F1F" : "transparent",
                  border: view === v ? "1px solid #3F3F46" : "1px solid transparent",
                  borderRadius: 6,
                  color: view === v ? "#FFFFFF" : "#71717A",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: view === v ? 500 : 400,
                  transition: "all 0.12s",
                  textTransform: "capitalize",
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Week View */}
        {view === "week" && (
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Day headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "56px repeat(7, 1fr)",
                borderBottom: "1px solid #27272A",
                flexShrink: 0,
              }}
            >
              <div />
              {weekDays.map((day, i) => {
                const isToday = day.toDateString() === today.toDateString();
                return (
                  <div
                    key={i}
                    style={{
                      padding: "10px 8px",
                      textAlign: "center",
                      borderLeft: "1px solid #27272A",
                    }}
                  >
                    <div style={{ fontSize: 11, color: "#52525B", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                      {DAYS[day.getDay()]}
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: isToday ? "#FFE600" : "transparent",
                        color: isToday ? "#09090B" : "#D4D4D8",
                        fontSize: 14,
                        fontWeight: isToday ? 700 : 400,
                      }}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time grid */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "56px repeat(7, 1fr)", position: "relative" }}>
              {/* Hour labels + rows */}
              {HOURS.map((hour) => (
                <>
                  <div
                    key={`label-${hour}`}
                    style={{
                      padding: "0 8px",
                      height: 64,
                      display: "flex",
                      alignItems: "flex-start",
                      paddingTop: 6,
                      borderBottom: "1px solid #18181B",
                    }}
                  >
                    <span style={{ fontSize: 10, color: "#3F3F46" }}>
                      {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </span>
                  </div>
                  {weekDays.map((day, dayI) => {
                    const isToday = day.toDateString() === today.toDateString();
                    const meetingsAtHour = MOCK_MEETINGS.filter(
                      (m) => m.dayIndex === (isToday ? 0 : dayI - today.getDay() + today.getDay()) && m.hour === hour
                    );
                    // Simplified: show today meetings on today column
                    const todayIndex = weekDays.findIndex((d) => d.toDateString() === today.toDateString());
                    const dayOffset = dayI - todayIndex;
                    const meetingsHere = MOCK_MEETINGS.filter((m) => m.dayIndex === dayOffset && m.hour === hour);

                    return (
                      <div
                        key={`cell-${hour}-${dayI}`}
                        style={{
                          borderLeft: "1px solid #18181B",
                          borderBottom: "1px solid #18181B",
                          height: 64,
                          background: isToday ? "rgba(255,230,0,0.012)" : "transparent",
                          position: "relative",
                          padding: 2,
                        }}
                      >
                        {meetingsHere.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setSelectedMeeting(m)}
                            style={{
                              position: "absolute",
                              left: 3,
                              right: 3,
                              top: 3,
                              background: m.color,
                              border: `1px solid ${m.accentColor}33`,
                              borderLeft: `2px solid ${m.accentColor}`,
                              borderRadius: 5,
                              padding: "3px 6px",
                              cursor: "pointer",
                              textAlign: "left",
                              fontFamily: "inherit",
                              transition: "all 0.12s",
                              zIndex: 1,
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                            }}
                          >
                            <div style={{ fontSize: 11, fontWeight: 600, color: "#FFFFFF", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {m.title}
                            </div>
                            <div style={{ fontSize: 10, color: "#A1A1AA" }}>{m.startTime}</div>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </>
              ))}
            </div>
          </div>
        )}

        {/* Day View */}
        {view === "day" && (
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{ padding: "16px 24px 8px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0, color: "#E4E4E7" }}>
                {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
            </div>
            <div style={{ position: "relative" }}>
              {HOURS.map((hour) => {
                const meetingsAtHour = MOCK_MEETINGS.filter((m) => m.dayIndex === 0 && m.hour === hour);
                return (
                  <div
                    key={hour}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 1fr",
                      borderBottom: "1px solid #18181B",
                      minHeight: 72,
                    }}
                  >
                    <div style={{ padding: "8px 12px 0", fontSize: 11, color: "#3F3F46" }}>
                      {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                    </div>
                    <div style={{ padding: "4px 16px 4px 0", display: "flex", flexDirection: "column", gap: 4 }}>
                      {meetingsAtHour.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMeeting(m)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 12px",
                            background: m.color,
                            border: `1px solid ${m.accentColor}33`,
                            borderLeft: `3px solid ${m.accentColor}`,
                            borderRadius: 7,
                            cursor: "pointer",
                            textAlign: "left",
                            fontFamily: "inherit",
                            transition: "all 0.12s",
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>{m.title}</div>
                            <div style={{ fontSize: 11, color: "#A1A1AA", marginTop: 2 }}>
                              {m.startTime} – {m.endTime} · {m.duration}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: -4 }}>
                            {m.attendees.slice(0, 3).map((a, i) => (
                              <div
                                key={i}
                                title={a.name}
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  background: a.color,
                                  border: "1.5px solid #09090B",
                                  marginLeft: i > 0 ? -6 : 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 8,
                                  fontWeight: 700,
                                  zIndex: 3 - i,
                                }}
                              >
                                {a.initials[0]}
                              </div>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Month View */}
        {view === "month" && (
          <div style={{ flex: 1, overflowY: "auto", padding: "0 0 16px" }}>
            {/* Headers */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                borderBottom: "1px solid #27272A",
              }}
            >
              {DAYS.map((d) => (
                <div key={d} style={{ padding: "10px", textAlign: "center", fontSize: 11, color: "#52525B", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  {d}
                </div>
              ))}
            </div>
            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`e-${i}`} style={{ borderRight: "1px solid #18181B", borderBottom: "1px solid #18181B", minHeight: 80 }} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isToday = day === today.getDate() && calMonth === today.getMonth();
                const hasMeeting = [today.getDate(), today.getDate() + 1, today.getDate() + 2].includes(day);
                return (
                  <div
                    key={day}
                    style={{
                      borderRight: "1px solid #18181B",
                      borderBottom: "1px solid #18181B",
                      minHeight: 80,
                      padding: "6px",
                      background: isToday ? "rgba(255,230,0,0.03)" : "transparent",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: isToday ? "#FFE600" : "transparent",
                        color: isToday ? "#09090B" : "#A1A1AA",
                        fontSize: 12,
                        fontWeight: isToday ? 700 : 400,
                        marginBottom: 4,
                      }}
                    >
                      {day}
                    </div>
                    {hasMeeting && MOCK_MEETINGS.filter((m) => m.dayIndex === day - today.getDate()).slice(0, 2).map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMeeting(m)}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "2px 5px",
                          background: m.color,
                          borderLeft: `2px solid ${m.accentColor}`,
                          border: "none",
                          borderRadius: 3,
                          fontSize: 10,
                          color: "#E4E4E7",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          textAlign: "left",
                          marginBottom: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {m.title}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Create Event FAB */}
        <button
          style={{
            position: "absolute",
            bottom: 28,
            right: 372,
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "11px 18px",
            background: "#FFE600",
            border: "none",
            borderRadius: 40,
            color: "#09090B",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "inherit",
            boxShadow: "0 4px 24px rgba(255,230,0,0.25)",
            transition: "all 0.15s",
            letterSpacing: "-0.01em",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 32px rgba(255,230,0,0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(255,230,0,0.25)";
          }}
        >
          <Plus size={15} />
          Create Event
        </button>
      </main>

      {/* ── Right Column: AI Assistant ── */}
      <aside
        style={{
          width: 320,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #27272A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Sparkles size={14} color="#FFE600" />
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "-0.01em" }}>AI Meeting Assistant</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Today's Priorities */}
          <div
            style={{
              background: "#111111",
              border: "1px solid #27272A",
              borderRadius: 10,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
              <Star size={12} color="#FFE600" fill="#FFE600" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#FFE600", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Today's Priorities
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {TODAY_PRIORITIES.map((p, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                  {p.done ? (
                    <CheckCircle2 size={14} color="#3F3F46" style={{ marginTop: 1, flexShrink: 0 }} />
                  ) : (
                    <Circle size={14} color="#FFE600" style={{ marginTop: 1, flexShrink: 0 }} />
                  )}
                  <span
                    style={{
                      fontSize: 12,
                      color: p.done ? "#52525B" : "#D4D4D8",
                      textDecoration: p.done ? "line-through" : "none",
                      lineHeight: 1.4,
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Meeting Brief */}
          {selectedMeeting && (
            <div
              style={{
                background: "#111111",
                border: "1px solid #27272A",
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: selectedMeeting.accentColor }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#71717A", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  Meeting Brief
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF", marginBottom: 6, letterSpacing: "-0.01em" }}>
                {selectedMeeting.title}
              </div>
              <div style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#71717A", display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={10} /> {selectedMeeting.startTime}
                </span>
                <span style={{ fontSize: 11, color: "#71717A", display: "flex", alignItems: "center", gap: 4 }}>
                  {selectedMeeting.isVideo ? <Video size={10} /> : <MapPin size={10} />}
                  {selectedMeeting.location}
                </span>
              </div>
              <p style={{ fontSize: 12, color: "#A1A1AA", lineHeight: 1.6, margin: "0 0 12px" }}>
                {selectedMeeting.brief}
              </p>

              {/* Prep notes */}
              <div style={{ borderTop: "1px solid #27272A", paddingTop: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#52525B", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                  Prep Checklist
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {selectedMeeting.prepNotes.map((note, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <Circle size={11} color="#3F3F46" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 11, color: "#A1A1AA", lineHeight: 1.5 }}>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendees */}
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 11, color: "#52525B" }}>
                  <Users size={11} style={{ display: "inline", marginRight: 4 }} />
                  {selectedMeeting.attendees.length} attendees
                </span>
                <div style={{ display: "flex" }}>
                  {selectedMeeting.attendees.map((a, i) => (
                    <div
                      key={i}
                      title={a.name}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: "50%",
                        background: a.color,
                        border: "1.5px solid #111111",
                        marginLeft: i > 0 ? -5 : 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 7,
                        fontWeight: 700,
                        zIndex: selectedMeeting.attendees.length - i,
                        position: "relative",
                      }}
                    >
                      {a.initials[0]}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Suggested Actions */}
          <div
            style={{
              background: "#111111",
              border: "1px solid #27272A",
              borderRadius: 10,
              padding: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <Zap size={12} color="#A1A1AA" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#71717A", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Suggested Actions
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                "Prepare VentureLab demo answers",
                "Block focus time before All-Hands",
                "Send pre-read to Marcus before 1:1",
              ].map((action, i) => (
                <button
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 9px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid #27272A",
                    borderRadius: 6,
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
                  <ArrowRight size={11} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}