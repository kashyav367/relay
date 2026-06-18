"use client";

import { useState } from "react";
import {
  Zap,
  User,
  Link2,
  Sparkles,
  Bell,
  Shield,
  AlertTriangle,
  ChevronRight,
  Check,
  X,
  Mail,
  Calendar,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  ToggleLeft,
  ToggleRight,
  Edit3,
  LogOut,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = "profile" | "connected" | "ai" | "notifications" | "security" | "danger";

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  icon: "laptop" | "mobile" | "globe";
}

// ─── Initial State ────────────────────────────────────────────────────────────

const INITIAL_AI_SETTINGS: ToggleSetting[] = [
  { id: "daily-briefing", label: "Daily Briefing", description: "Receive an AI-generated summary of your inbox and calendar every morning at 8 AM.", enabled: true },
  { id: "auto-draft", label: "Auto Draft Replies", description: "Relay drafts reply suggestions for emails it detects need a response. You always approve before sending.", enabled: true },
  { id: "meeting-prep", label: "Meeting Preparation", description: "Auto-generate briefs, prep notes, and context for upcoming meetings 30 minutes before they start.", enabled: true },
  { id: "priority-detection", label: "Priority Detection", description: "Relay automatically scores and surfaces high-priority emails based on sender patterns and content.", enabled: false },
  { id: "smart-followups", label: "Smart Follow-ups", description: "Get reminders when awaited replies haven't arrived after 48 hours.", enabled: true },
];

const INITIAL_NOTIFICATION_SETTINGS: ToggleSetting[] = [
  { id: "email-alerts", label: "Email Alerts", description: "Get notified when Relay detects a high-priority email requiring action.", enabled: true },
  { id: "meeting-reminders", label: "Meeting Reminders", description: "Receive briefing notifications 30 minutes before each meeting.", enabled: true },
  { id: "daily-summary", label: "Daily Summary", description: "A digest of everything Relay handled while you were away, sent at end of day.", enabled: false },
];

const MOCK_SESSIONS: Session[] = [
  { id: "1", device: 'MacBook Pro 16"', location: "San Francisco, CA", lastActive: "Active now", current: true, icon: "laptop" },
  { id: "2", device: "iPhone 15 Pro", location: "San Francisco, CA", lastActive: "2 hours ago", current: false, icon: "mobile" },
  { id: "3", device: "Chrome — Windows", location: "New York, NY", lastActive: "3 days ago", current: false, icon: "globe" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NAV_SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User size={14} /> },
  { id: "connected", label: "Connected Accounts", icon: <Link2 size={14} /> },
  { id: "ai", label: "AI Preferences", icon: <Sparkles size={14} /> },
  { id: "notifications", label: "Notifications", icon: <Bell size={14} /> },
  { id: "security", label: "Security", icon: <Shield size={14} /> },
  { id: "danger", label: "Danger Zone", icon: <AlertTriangle size={14} /> },
];

function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: enabled ? "#FFE600" : "#27272A",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.15s",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 3,
          left: enabled ? 21 : 3,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: enabled ? "#09090B" : "#71717A",
          transition: "left 0.15s",
        }}
      />
    </button>
  );
}

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #27272A",
        borderRadius: 12,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #27272A" }}>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: "-0.015em", color: "#FFFFFF" }}>{title}</h3>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#71717A", lineHeight: 1.5 }}>{description}</p>
    </div>
  );
}

function SettingRow({
  setting,
  onToggle,
  last,
}: {
  setting: ToggleSetting;
  onToggle: () => void;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 24px",
        borderBottom: last ? "none" : "1px solid #1A1A1A",
        gap: 24,
        transition: "background 0.1s",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#E4E4E7", marginBottom: 3 }}>{setting.label}</div>
        <div style={{ fontSize: 12, color: "#71717A", lineHeight: 1.5 }}>{setting.description}</div>
      </div>
      <Toggle enabled={setting.enabled} onToggle={onToggle} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [aiSettings, setAiSettings] = useState<ToggleSetting[]>(INITIAL_AI_SETTINGS);
  const [notifSettings, setNotifSettings] = useState<ToggleSetting[]>(INITIAL_NOTIFICATION_SETTINGS);
  const [showApiKey, setShowApiKey] = useState(false);
  const [dangerConfirm, setDangerConfirm] = useState<"google" | "account" | null>(null);
  const [profileName, setProfileName] = useState("Alex Rivera");
  const [profileEmail, setProfileEmail] = useState("alex@company.io");
  const [editingProfile, setEditingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  function toggleAiSetting(id: string) {
    setAiSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }

  function toggleNotifSetting(id: string) {
    setNotifSettings((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }

  function handleSave() {
    setEditingProfile(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  }

  const sessionIcons: Record<string, React.ReactNode> = {
    laptop: <Laptop size={16} color="#A1A1AA" />,
    mobile: <Smartphone size={16} color="#A1A1AA" />,
    globe: <Globe size={16} color="#A1A1AA" />,
  };

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

        <div style={{ padding: "0 8px 16px", borderBottom: "1px solid #27272A" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#52525B", letterSpacing: "0.07em", textTransform: "uppercase", padding: "0 10px", display: "block", marginBottom: 6 }}>
            Settings
          </span>
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                width: "100%",
                padding: "7px 10px",
                borderRadius: 7,
                border: "none",
                background: activeSection === section.id ? "rgba(255,230,0,0.08)" : "transparent",
                color: activeSection === section.id ? "#FFE600" : "#A1A1AA",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
                transition: "all 0.12s",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.id) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = "#A1A1AA";
                }
              }}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "16px 16px 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 10px",
              borderRadius: 8,
              background: "#111111",
              border: "1px solid #27272A",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #7C3AED, #0EA5E9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              AR
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#E4E4E7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Alex Rivera
              </div>
              <div style={{ fontSize: 11, color: "#52525B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                alex@company.io
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px 40px 64px",
          maxWidth: 720,
        }}
      >
        {/* Save success toast */}
        {saveSuccess && (
          <div
            style={{
              position: "fixed",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#111111",
              border: "1px solid #27272A",
              borderRadius: 9,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 100,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <Check size={14} color="#10B981" />
            <span style={{ fontSize: 13, color: "#E4E4E7" }}>Changes saved</span>
          </div>
        )}

        {/* ── Profile ── */}
        {activeSection === "profile" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>Profile</h2>
              <p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>Manage your name, email, and avatar.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <SectionCard>
                <SectionHeader title="Personal Information" description="Your name and email address." />
                <div style={{ padding: "20px 24px" }}>
                  {/* Avatar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #7C3AED, #0EA5E9)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 20,
                        fontWeight: 700,
                      }}
                    >
                      AR
                    </div>
                    <div>
                      <button
                        style={{
                          padding: "6px 14px",
                          background: "#1A1A1A",
                          border: "1px solid #27272A",
                          borderRadius: 7,
                          color: "#D4D4D8",
                          fontSize: 12,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#3F3F46";
                          (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272A";
                          (e.currentTarget as HTMLButtonElement).style.color = "#D4D4D8";
                        }}
                      >
                        Change avatar
                      </button>
                      <p style={{ fontSize: 11, color: "#52525B", margin: "6px 0 0" }}>JPG, PNG or GIF. Max 2MB.</p>
                    </div>
                  </div>

                  {/* Fields */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[
                      { label: "Full name", value: profileName, setter: setProfileName },
                      { label: "Email address", value: profileEmail, setter: setProfileEmail },
                    ].map(({ label, value, setter }) => (
                      <div key={label}>
                        <label
                          style={{
                            display: "block",
                            fontSize: 12,
                            fontWeight: 500,
                            color: "#A1A1AA",
                            marginBottom: 6,
                          }}
                        >
                          {label}
                        </label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => setter(e.target.value)}
                          disabled={!editingProfile}
                          style={{
                            width: "100%",
                            padding: "9px 12px",
                            background: editingProfile ? "#1A1A1A" : "#111111",
                            border: `1px solid ${editingProfile ? "#3F3F46" : "#27272A"}`,
                            borderRadius: 8,
                            color: editingProfile ? "#FFFFFF" : "#A1A1AA",
                            fontSize: 13,
                            fontFamily: "inherit",
                            outline: "none",
                            boxSizing: "border-box",
                            cursor: editingProfile ? "text" : "default",
                            transition: "all 0.12s",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    {!editingProfile ? (
                      <button
                        onClick={() => setEditingProfile(true)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "8px 16px",
                          background: "#1A1A1A",
                          border: "1px solid #27272A",
                          borderRadius: 8,
                          color: "#D4D4D8",
                          fontSize: 13,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#3F3F46";
                          (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272A";
                          (e.currentTarget as HTMLButtonElement).style.color = "#D4D4D8";
                        }}
                      >
                        <Edit3 size={13} />
                        Edit profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          style={{
                            padding: "8px 18px",
                            background: "#FFE600",
                            border: "none",
                            borderRadius: 8,
                            color: "#09090B",
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "inherit",
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#FFF000";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#FFE600";
                          }}
                        >
                          Save changes
                        </button>
                        <button
                          onClick={() => setEditingProfile(false)}
                          style={{
                            padding: "8px 14px",
                            background: "transparent",
                            border: "1px solid #27272A",
                            borderRadius: 8,
                            color: "#71717A",
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "inherit",
                          }}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {/* ── Connected Accounts ── */}
        {activeSection === "connected" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>Connected Accounts</h2>
              <p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>Manage the services Relay is connected to.</p>
            </div>

            <SectionCard>
              <SectionHeader title="Google Workspace" description="Relay uses read/write access to manage your inbox and calendar." />
              {[
                {
                  icon: <Mail size={18} color="#EA4335" />,
                  label: "Gmail",
                  detail: "alex@company.io",
                  connected: true,
                  lastSync: "Synced just now",
                  color: "#EA4335",
                },
                {
                  icon: <Calendar size={18} color="#4285F4" />,
                  label: "Google Calendar",
                  detail: "alex@company.io",
                  connected: true,
                  lastSync: "Synced 2 min ago",
                  color: "#4285F4",
                },
              ].map((account, i, arr) => (
                <div
                  key={account.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 24px",
                    borderBottom: i < arr.length - 1 ? "1px solid #1A1A1A" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: `${account.color}15`,
                        border: `1px solid ${account.color}30`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {account.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#E4E4E7", marginBottom: 2 }}>{account.label}</div>
                      <div style={{ fontSize: 12, color: "#71717A" }}>
                        {account.detail} ·{" "}
                        <span style={{ color: "#52525B" }}>{account.lastSync}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#10B981",
                        background: "rgba(16,185,129,0.08)",
                        padding: "3px 9px",
                        borderRadius: 20,
                      }}
                    >
                      <Check size={10} />
                      Connected
                    </span>
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        color: "#52525B",
                        cursor: "pointer",
                        padding: 4,
                        borderRadius: 5,
                        display: "flex",
                        transition: "color 0.12s",
                      }}
                      title="Reconnect"
                    >
                      <RefreshCw size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </SectionCard>

            {/* API Key */}
            <SectionCard style={{ marginTop: 16 }}>
              <SectionHeader title="Relay API Key" description="Use this key to integrate Relay with your own tools and automations." />
              <div style={{ padding: "20px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#0D0D0D",
                    border: "1px solid #27272A",
                    borderRadius: 8,
                    padding: "10px 14px",
                  }}
                >
                  <code
                    style={{
                      flex: 1,
                      fontSize: 12,
                      fontFamily: "JetBrains Mono, Menlo, monospace",
                      color: "#A1A1AA",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {showApiKey ? "rl_sk_prod_7f3d2c8e9b1a4f6e2d5c8b3a7e4f1d2c" : "rl_sk_prod_••••••••••••••••••••••••••••••••"}
                  </code>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    style={{ background: "none", border: "none", color: "#71717A", cursor: "pointer", display: "flex", transition: "color 0.12s" }}
                  >
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button
                    style={{
                      padding: "7px 14px",
                      background: "#1A1A1A",
                      border: "1px solid #27272A",
                      borderRadius: 7,
                      color: "#D4D4D8",
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Copy key
                  </button>
                  <button
                    style={{
                      padding: "7px 14px",
                      background: "transparent",
                      border: "1px solid #27272A",
                      borderRadius: 7,
                      color: "#71717A",
                      fontSize: 12,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── AI Preferences ── */}
        {activeSection === "ai" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>AI Preferences</h2>
              <p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>
                Control how Relay's AI behaves across your inbox and calendar.
              </p>
            </div>

            <SectionCard>
              <SectionHeader
                title="Automation Settings"
                description="You are always in control. Relay will only take action when you approve."
              />
              {aiSettings.map((setting, i) => (
                <SettingRow
                  key={setting.id}
                  setting={setting}
                  onToggle={() => toggleAiSetting(setting.id)}
                  last={i === aiSettings.length - 1}
                />
              ))}
            </SectionCard>

            <SectionCard style={{ marginTop: 16 }}>
              <SectionHeader title="AI Model" description="The model Relay uses to process your emails and generate suggestions." />
              <div style={{ padding: "16px 24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: "rgba(255,230,0,0.05)",
                    border: "1px solid rgba(255,230,0,0.15)",
                    borderRadius: 9,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Sparkles size={16} color="#FFE600" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#FFFFFF" }}>Claude Sonnet</div>
                      <div style={{ fontSize: 11, color: "#71717A" }}>Fast, accurate, context-aware — recommended for most users</div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#FFE600",
                      background: "rgba(255,230,0,0.1)",
                      padding: "3px 8px",
                      borderRadius: 4,
                      letterSpacing: "0.04em",
                    }}
                  >
                    Active
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── Notifications ── */}
        {activeSection === "notifications" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>Notifications</h2>
              <p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>
                Choose when and how Relay alerts you.
              </p>
            </div>

            <SectionCard>
              <SectionHeader title="Notification Channels" description="These preferences apply to browser and mobile push notifications." />
              {notifSettings.map((setting, i) => (
                <SettingRow
                  key={setting.id}
                  setting={setting}
                  onToggle={() => toggleNotifSetting(setting.id)}
                  last={i === notifSettings.length - 1}
                />
              ))}
            </SectionCard>

            <SectionCard style={{ marginTop: 16 }}>
              <SectionHeader title="Daily Briefing Time" description="When Relay delivers your morning inbox and calendar summary." />
              <div style={{ padding: "16px 24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Clock size={16} color="#A1A1AA" />
                  <select
                    style={{
                      background: "#1A1A1A",
                      border: "1px solid #27272A",
                      borderRadius: 8,
                      color: "#E4E4E7",
                      padding: "8px 32px 8px 12px",
                      fontSize: 13,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      outline: "none",
                      appearance: "none",
                    }}
                  >
                    {["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM"].map((t) => (
                      <option key={t} value={t} selected={t === "8:00 AM"}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span style={{ fontSize: 12, color: "#71717A" }}>your local time</span>
                </div>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── Security ── */}
        {activeSection === "security" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>Security</h2>
              <p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>Manage your active sessions and access control.</p>
            </div>

            <SectionCard>
              <SectionHeader title="Active Sessions" description="These devices are currently signed in to your Relay account." />
              {MOCK_SESSIONS.map((session, i) => (
                <div
                  key={session.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 24px",
                    borderBottom: i < MOCK_SESSIONS.length - 1 ? "1px solid #1A1A1A" : "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        background: "#1A1A1A",
                        border: "1px solid #27272A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {sessionIcons[session.icon]}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#E4E4E7" }}>{session.device}</span>
                        {session.current && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#10B981",
                              background: "rgba(16,185,129,0.08)",
                              padding: "1px 6px",
                              borderRadius: 3,
                            }}
                          >
                            This device
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: "#71717A" }}>
                        {session.location} · {session.lastActive}
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 12px",
                        background: "transparent",
                        border: "1px solid #27272A",
                        borderRadius: 7,
                        color: "#71717A",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.12s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF4444";
                        (e.currentTarget as HTMLButtonElement).style.color = "#EF4444";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272A";
                        (e.currentTarget as HTMLButtonElement).style.color = "#71717A";
                      }}
                    >
                      <LogOut size={12} />
                      Sign out
                    </button>
                  )}
                </div>
              ))}
            </SectionCard>

            <SectionCard style={{ marginTop: 16 }}>
              <SectionHeader title="Two-Factor Authentication" description="Add an extra layer of security to your account." />
              <div
                style={{
                  padding: "16px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#E4E4E7", marginBottom: 3 }}>Authenticator app</div>
                  <div style={{ fontSize: 12, color: "#71717A" }}>Use an authenticator app to generate one-time codes.</div>
                </div>
                <button
                  style={{
                    padding: "7px 14px",
                    background: "#1A1A1A",
                    border: "1px solid #27272A",
                    borderRadius: 7,
                    color: "#D4D4D8",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#3F3F46";
                    (e.currentTarget as HTMLButtonElement).style.color = "#FFFFFF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#27272A";
                    (e.currentTarget as HTMLButtonElement).style.color = "#D4D4D8";
                  }}
                >
                  Enable 2FA
                </button>
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── Danger Zone ── */}
        {activeSection === "danger" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", margin: "0 0 6px" }}>Danger Zone</h2>
              <p style={{ fontSize: 13, color: "#71717A", margin: 0 }}>
                Irreversible actions. Proceed with care.
              </p>
            </div>

            <div
              style={{
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              {/* Disconnect Google */}
              <div
                style={{
                  padding: "20px 24px",
                  borderBottom: "1px solid rgba(239,68,68,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 24,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 4 }}>Disconnect Google Account</div>
                  <p style={{ margin: 0, fontSize: 13, color: "#71717A", lineHeight: 1.5 }}>
                    Relay will lose access to Gmail and Google Calendar. All AI-powered features will stop working immediately. Your data will remain in Relay for 30 days.
                  </p>
                </div>
                {dangerConfirm === "google" ? (
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setDangerConfirm(null)}
                      style={{
                        padding: "8px 14px",
                        background: "transparent",
                        border: "1px solid #27272A",
                        borderRadius: 7,
                        color: "#71717A",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      style={{
                        padding: "8px 14px",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.4)",
                        borderRadius: 7,
                        color: "#EF4444",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Yes, disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDangerConfirm("google")}
                    style={{
                      padding: "8px 16px",
                      background: "transparent",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 7,
                      color: "#EF4444",
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      flexShrink: 0,
                      transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(239,68,68,0.3)";
                    }}
                  >
                    Disconnect Google
                  </button>
                )}
              </div>

              {/* Delete Account */}
              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 24,
                  background: "rgba(239,68,68,0.03)",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF", marginBottom: 4 }}>Delete Account</div>
                  <p style={{ margin: 0, fontSize: 13, color: "#71717A", lineHeight: 1.5 }}>
                    Permanently deletes your Relay account, all stored preferences, email summaries, and AI history. This cannot be undone.
                  </p>
                </div>
                {dangerConfirm === "account" ? (
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => setDangerConfirm(null)}
                      style={{
                        padding: "8px 14px",
                        background: "transparent",
                        border: "1px solid #27272A",
                        borderRadius: 7,
                        color: "#71717A",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      style={{
                        padding: "8px 14px",
                        background: "rgba(239,68,68,0.15)",
                        border: "1px solid rgba(239,68,68,0.5)",
                        borderRadius: 7,
                        color: "#EF4444",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Delete forever
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDangerConfirm("account")}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 16px",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      borderRadius: 7,
                      color: "#EF4444",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      flexShrink: 0,
                      transition: "all 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
                    }}
                  >
                    <Trash2 size={13} />
                    Delete account
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}