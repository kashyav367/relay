"use client";

import { useState, useEffect } from "react";
import { authClient } from "~/lib/auth-client";
import {
  Zap, Mail, Calendar, Clock, ArrowRight,
  MessageSquare, FileText, TrendingUp,
  CheckCircle2, AlertCircle, Send,
} from "lucide-react";
import InboxCard from "~/app/_components/InboxCard";
import CalendarCard from "~/app/_components/CalendarCard";
import { useRouter } from "next/navigation";

const QUICK_ACTIONS = [
  { icon: Mail,         label: "Summarize Inbox",    prompt: "Summarize my unread emails",          color: "text-blue-400",   bg: "bg-blue-400/10"   },
  { icon: FileText,     label: "Draft Reply",         prompt: "Help me draft a reply",               color: "text-violet-400", bg: "bg-violet-400/10" },
  { icon: Calendar,     label: "Create Meeting",      prompt: "Create a meeting for tomorrow 10am",  color: "text-emerald-400",bg: "bg-emerald-400/10"},
  { icon: MessageSquare,label: "Ask Relay",           prompt: "",                                    color: "text-[#FFE600]",  bg: "bg-[#FFE600]/10"  },
];

const ACTIVITY = [
  { icon: CheckCircle2, label: "Reply drafted",       sub: "Re: Project proposal",      time: "2m ago",  color: "text-emerald-400" },
  { icon: Calendar,     label: "Meeting created",     sub: "Standup · Tomorrow 9:30am", time: "14m ago", color: "text-blue-400"    },
  { icon: Send,         label: "Follow-up sent",      sub: "Rahul · Invoice #112",      time: "1h ago",  color: "text-violet-400"  },
  { icon: TrendingUp,   label: "Inbox summarized",    sub: "12 emails processed",       time: "2h ago",  color: "text-[#FFE600]"   },
];

const BRIEFING = [
  { icon: Mail,         value: "12", label: "unread emails",       color: "text-blue-400"     },
  { icon: Calendar,     value: "3",  label: "meetings today",      color: "text-emerald-400"  },
  { icon: AlertCircle,  value: "2",  label: "emails need reply",   color: "text-amber-400"    },
  { icon: Clock,        value: "1",  label: "overdue follow-up",   color: "text-rose-400"     },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const [briefLoading, setBriefLoading] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  const handleQuickAction = (prompt: string) => {
    if (!prompt) {
      router.push("/dashboard/chat");
      return;
    }
    router.push(`/dashboard/chat?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleBrief = () => {
    setBriefLoading(true);
    setTimeout(() => {
      router.push("/dashboard/chat?prompt=Generate+my+full+daily+briefing");
    }, 400);
  };

  return (
     <div className="min-h-full px-8 py-8 max-w-7xl mx-auto">

      {/* ── WELCOME ── */}
     <div className="mb-8">
  <p className="text-xs uppercase tracking-widest text-[#A1A1AA]">
    AI Executive Assistant
  </p>

  <h1 className="mt-2 text-3xl font-bold text-white tracking-tight">
    {getGreeting()} 👋 {session?.user?.name}
  </h1>

  <p className="mt-2 text-sm text-[#A1A1AA]">
    Your AI executive assistant is ready.
  </p>
</div>

<div className="grid grid-cols-3 gap-4 mb-4">
  <div className="rounded-xl border border-[#27272A] bg-[#111111] p-4">
    <p className="text-[#A1A1AA] text-xs uppercase">Unread</p>
    <h3 className="text-2xl font-bold text-white">12</h3>
  </div>

  <div className="rounded-xl border border-[#27272A] bg-[#111111] p-4">
    <p className="text-[#A1A1AA] text-xs uppercase">Meetings</p>
    <h3 className="text-2xl font-bold text-white">3</h3>
  </div>

  <div className="rounded-xl border border-[#27272A] bg-[#111111] p-4">
    <p className="text-[#A1A1AA] text-xs uppercase">Pending</p>
    <h3 className="text-2xl font-bold text-white">2</h3>
  </div>
</div>

      {/* ── TOP ROW: Briefing + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mb-4">

        {/* AI Daily Briefing */}
        <div className="rounded-xl border border-[#27272A] bg-[#111111] p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFE600]/10">
                <Zap className="h-3.5 w-3.5 text-[#FFE600]" strokeWidth={2.5} />
              </div>
              <span className="text-sm font-semibold text-white">AI Daily Briefing</span>
            </div>
            <span className="text-[11px] text-[#A1A1AA] border border-[#27272A] rounded-full px-2.5 py-0.5">
              {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {BRIEFING.map(({ icon: Icon, value, label, color }) => (
                <div key={label} className="flex items-center gap-3 rounded-lg bg-[#09090B] border border-[#27272A] px-4 py-3">
                  <Icon className={`h-4 w-4 shrink-0 ${color}`} />
                  <div>
                    <p className="text-xl font-bold text-white leading-none">{value}</p>
                    <p className="text-[11px] text-[#A1A1AA] mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-[#A1A1AA]">Recommended priority: <span className="text-white font-medium">Investor update</span></p>
            <button
              onClick={handleBrief}
              disabled={briefLoading}
              className="flex items-center gap-2 rounded-lg bg-[#FFE600] px-4 py-2 text-xs font-bold text-black transition hover:bg-[#FFE600]/90 disabled:opacity-70"
            >
              {briefLoading ? "Generating..." : "Generate Full Brief"}
              {!briefLoading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-[#27272A] bg-[#111111] p-6">
          <p className="text-sm font-semibold text-white mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map(({ icon: Icon, label, prompt, color, bg }) => (
              <button
                key={label}
                onClick={() => handleQuickAction(prompt)}
                className="flex flex-col items-start gap-2.5 rounded-lg border border-[#27272A] bg-[#09090B] p-3.5 text-left transition hover:border-[#3F3F46] hover:bg-[#18181B] group"
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-md ${bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                </div>
                <span className="text-[12px] font-medium text-[#A1A1AA] group-hover:text-white transition leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MIDDLE ROW: Inbox + Calendar snapshots ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-[#27272A] bg-[#111111] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272A]">
            <span className="text-sm font-semibold text-white">Inbox Snapshot</span>
            <button
              onClick={() => router.push("/dashboard/inbox")}
              className="text-[11px] text-[#A1A1AA] hover:text-white transition flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="p-4">
            <InboxCard />
          </div>
        </div>

        <div className="rounded-xl border border-[#27272A] bg-[#111111] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272A]">
            <span className="text-sm font-semibold text-white">Calendar Snapshot</span>
            <button
              onClick={() => router.push("/dashboard/calendar")}
              className="text-[11px] text-[#A1A1AA] hover:text-white transition flex items-center gap-1"
            >
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="p-4">
            <CalendarCard />
          </div>
        </div>
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <div className="rounded-xl border border-[#27272A] bg-[#111111]">
        <div className="px-5 py-3.5 border-b border-[#27272A]">
          <span className="text-sm font-semibold text-white">Recent Activity</span>
        </div>
        <div className="divide-y divide-[#27272A]">
          {ACTIVITY.map(({ icon: Icon, label, sub, time, color }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#18181B] transition">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#09090B] border border-[#27272A]">
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{label}</p>
                <p className="text-[12px] text-[#A1A1AA] truncate">{sub}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-[#A1A1AA] shrink-0">
                    {time}
                  </span>

                  <button className="text-[11px] text-[#FFE600] hover:underline">
                    Open
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}