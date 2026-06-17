"use client";

import { useRouter } from "next/navigation";

const TICKER = [
  "REPLIES IN 8 SECONDS",
  "MEETINGS BOOKED INSTANTLY",
  "ZERO FORGOTTEN FOLLOW-UPS",
  "INBOX ZERO IS REAL NOW",
  "YOUR AI IS ALREADY READING",
  "LESS GMAIL. MORE DONE.",
];

export default function LandingPage() {
  const router = useRouter();
  const signIn = () => router.push("/sign-in");

  return (
    <main className="min-h-screen bg-[#FFE600] text-black overflow-x-hidden">
      <style>{`
        @keyframes run { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .run { display:flex; animation: run 18s linear infinite; white-space:nowrap; }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        .blink { animation: blink 1s step-end infinite; }
      `}</style>

      {/* ── NAV ── */}
      <header className="border-b-4 border-black sticky top-0 bg-[#FFE600] z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <span className="text-2xl sm:text-3xl font-black tracking-tight">RELAY</span>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <a href="#how"      className="text-[11px] font-black uppercase tracking-widest hover:opacity-50 transition">How It Works</a>
            <a href="#features" className="text-[11px] font-black uppercase tracking-widest hover:opacity-50 transition">Features</a>
            <a href="#demo"     className="text-[11px] font-black uppercase tracking-widest hover:opacity-50 transition">Live Demo</a>
            {/* CHANGED: two buttons instead of one */}
            <button
              onClick={signIn}
              className="bg-white text-black border-4 border-black px-5 py-2.5 text-[11px] font-black uppercase tracking-widest hover:-translate-y-0.5 transition"
            >
              SIGN IN
            </button>
            <button
              onClick={signIn}
              className="bg-black text-[#FFE600] border-4 border-black px-5 py-2.5 text-[11px] font-black uppercase tracking-widest hover:-translate-y-0.5 transition"
            >
              GET STARTED →
            </button>
          </nav>

          {/* Mobile nav — stacked */}
          <div className="md:hidden flex flex-col gap-1.5">
            <button
              onClick={signIn}
              className="bg-white text-black border-2 border-black px-3 py-1.5 text-[9px] font-black uppercase tracking-widest"
            >
              SIGN IN
            </button>
            <button
              onClick={signIn}
              className="bg-black text-[#FFE600] border-2 border-black px-3 py-1.5 text-[9px] font-black uppercase tracking-widest"
            >
              GET STARTED →
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-12">

        <div className="flex items-center gap-3 mb-8 sm:mb-12">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-black blink shrink-0" />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">
            Relay is live · 
          </span>
        </div>

        <h1 className="text-[58px] sm:text-[80px] md:text-[128px] font-black leading-[0.85] tracking-tight">
          Inbox guilt
          <br />
          ends
          <br />
          <span className="bg-black text-[#FFE600] px-2 sm:px-3 inline-block mt-1">
            today.
          </span>
        </h1>

        <div className="mt-10 sm:mt-14 max-w-3xl">
          <p className="text-xl sm:text-2xl md:text-3xl font-black leading-snug">
            Tell Relay what you need done.
          </p>
            <p className="text-lg sm:text-xl md:text-2xl font-medium leading-snug mt-2 opacity-50">
            It opens Gmail so you don’t have to.
          </p>
        </div>

        {/* CHANGED: primary = START WITH GOOGLE, secondary = SIGN IN */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={signIn}
            className="w-full sm:w-auto bg-black text-[#FFE600] border-4 border-black px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-black uppercase tracking-wide hover:-translate-y-1 transition text-center"
          >
            START WITH GOOGLE →
          </button>
          <button
            onClick={signIn}
            className="w-full sm:w-auto bg-white text-black border-4 border-black px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-black uppercase tracking-wide hover:-translate-y-1 transition text-center"
          >
            SIGN IN
          </button>
        </div>

        <p className="mt-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest opacity-30 text-center sm:text-left">
          Gmail + Google Calendar · Setup in 90 seconds · No credit card ever
        </p>

        {/* Stats — 2×2 on mobile, 4×1 on md+ */}
        <div className="mt-14 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {[
            { big: "8s",   small: "Average reply time" },
            { big: "3 hrs", small: "Given back per day" },
            { big: "100%", small: "Follow-ups completed" },
            { big: "1 tab", small: "Instead of twelve", invert: true },
          ].map(({ big, small, invert }) => (
            <div key={small} className={`border-4 border-black p-4 sm:p-6 ${invert ? "bg-black text-[#FFE600]" : "bg-white"}`}>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black leading-none">{big}</div>
              <div className={`mt-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-wide ${invert ? "opacity-50" : "opacity-40"}`}>{small}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="border-y-4 border-black overflow-hidden">
        <div className="run">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="text-[22px] sm:text-[30px] md:text-[42px] font-black uppercase px-6 sm:px-10 py-4 sm:py-5 border-r-4 border-black inline-block">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── THE TRUTH ── */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-28">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6 sm:mb-8">LET’S BE HONEST</p>
        <h2 className="text-[38px] sm:text-[56px] md:text-[92px] font-black leading-[0.88] tracking-tight">
          You’re not
          <br />
          bad at email.
          <br />
          <span className="opacity-30">Email is bad at you.</span>
        </h2>

        <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              tag: "SOUND FAMILIAR?",
              headline: "You open Gmail to send one thing.",
              copy: "Forty minutes later you’ve read a thread from 2022, replied to three things that weren’t urgent, and forgotten the one email you needed to send.",
            },
            {
              tag: "EVERY WEEK.",
              headline: "Someone’s waiting. You don’t know.",
              copy: "There’s an email in there that’s been waiting three days for your reply. You’ll find it on day seven. Awkward apology incoming.",
            },
            {
              tag: "THE CLASSIC.",
              headline: "\"I’ll follow up on Friday.\"",
              copy: "Friday comes. Friday goes. The deal slips. The intro never happens. You had every intention. The system just isn’t built for it.",
            },
          ].map(({ tag, headline, copy }) => (
            <div key={tag} className="border-4 border-black bg-white p-6 sm:p-8">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] opacity-30">{tag}</span>
              <h3 className="text-lg sm:text-xl font-black mt-3 mb-3 leading-snug">{headline}</h3>
              <p className="text-sm leading-relaxed opacity-60">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="border-t-4 border-black bg-black text-[#FFE600]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6 sm:mb-8">HOW IT WORKS</p>
          <h2 className="text-[38px] sm:text-[56px] md:text-[88px] font-black leading-[0.88] tracking-tight mb-10 sm:mb-16">
            Say it.
            <br />
            Relay does it.
            <br />
            That’s it.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-[#222]">
            {[
              {
                step: "01",
                title: "Connect Gmail in 90s",
                body: "Sign in with Google. Relay gets read and write access to your Gmail and Calendar. No complicated setup. No forms to fill.",
              },
              {
                step: "02",
                title: "Type what you need",
                body: "\"Summarise today’s emails.\" \"Reply to Rahul, say I’ll call him at 4.\" \"Book 30 mins with the team Thursday.\" Plain English. That’s the whole interface.",
              },
              {
                step: "03",
                title: "Watch it happen",
                body: "Relay reads, writes, sends, and schedules — directly in your Gmail and Google Calendar. You see exactly what it did and can undo anything.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-black border border-[#1a1a1a] p-8 sm:p-10">
                <div className="text-4xl sm:text-5xl font-black opacity-20 mb-5 sm:mb-6">{step}</div>
                <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4">{title}</h3>
                <p className="text-sm leading-relaxed opacity-40">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-6 sm:mb-8">CAPABILITIES</p>
        <h2 className="text-[38px] sm:text-[56px] md:text-[88px] font-black leading-[0.88] tracking-tight mb-10 sm:mb-16">
          Not a chatbot.
          <br />
          An operator.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[
            {
              icon: "📬",
              title: "Smart Inbox Triage",
              body: "Relay reads every unread email and tells you what actually matters — ranked by urgency, not arrival time. No more swimming through newsletters to find the real stuff.",
              tag: "INBOX",
              invert: false,
            },
            {
              icon: "✍️",
              title: "Draft & Send Replies",
              body: "Describe what you want to say. Relay writes it in your voice and sends it. Or shows you a draft first — your call. Works for one-liners and long threads alike.",
              tag: "COMPOSE",
              invert: false,
            },
            {
              icon: "📅",
              title: "Full Calendar Control",
              body: "Create meetings, reschedule events, send invites, check availability — all from a single message. \"Book 30 mins with Anjali next week\" is a complete instruction.",
              tag: "CALENDAR",
              invert: false,
            },
            {
              icon: "🔁",
              title: "Automated Follow-Ups",
              body: "\"Remind me if Vikram hasn't replied by Thursday.\" Relay watches the thread and follows up so you never have to remember to remember.",
              tag: "FOLLOW-UP",
              invert: true,
            },
          ].map(({ icon, title, body, tag, invert }) => (
            <div
              key={title}
              className={`border-4 border-black p-6 sm:p-8 group transition-all duration-150 ${
                invert
                  ? "bg-black text-[#FFE600]"
                  : "bg-white hover:bg-black hover:text-[#FFE600]"
              }`}
            >
              <div className="flex items-start justify-between mb-5 sm:mb-6">
                <span className="text-2xl sm:text-3xl">{icon}</span>
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest border-2 px-2 sm:px-3 py-1 opacity-30 ${invert ? "border-[#FFE600]" : "border-black group-hover:border-[#FFE600]"}`}>
                  {tag}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3">{title}</h3>
              <p className="text-sm leading-relaxed opacity-60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DEMO CONVERSATION ── */}
      <section id="demo" className="border-t-4 border-black mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-28">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-5 sm:mb-6">REAL CONVERSATION · REAL RESULTS</p>
        <h2 className="text-[38px] sm:text-[56px] md:text-[88px] font-black leading-[0.88] tracking-tight mb-10 sm:mb-14">
          A Monday
          <br />
          morning,
          <br />
          handled.
        </h2>

        <div className="border-4 border-black">
          {[
            { who: "YOU",   msg: "What’s the damage this morning?",                                                                                                                                dark: false },
            { who: "RELAY", msg: "Four things worth your time. Nisha sent the final invoice — needs approval. Dev team’s standup moved to 9:30 (nobody told you). Two people replied to your Friday proposal. One said yes. And your AWS bill is 40% higher than last month.",       dark: true  },
            { who: "YOU",   msg: "Approve Nisha’s invoice and reply to the proposal yes — say I’ll send the onboarding doc by Wednesday.",                                                        dark: false },
            { who: "RELAY", msg: "Done. Nisha’s invoice marked approved — confirmation sent. Replied to Aryan: \"Great to hear — I’ll get the onboarding doc across by Wednesday.\" Both sent ✓", dark: true  },
            { who: "YOU",   msg: "Add the standup to my calendar at 9:30 and block 2 hours after lunch for deep work — no meetings.",                                                             dark: false },
            { who: "RELAY", msg: "Standup added at 9:30am. Deep work block set: 1pm–3pm, marked as Busy. Anyone who tries to book you in that window will see you’re unavailable.",              dark: true  },
            { who: "YOU",   msg: "Remind me to check the AWS bill on Friday before 5pm.",                                                                                                        dark: false },
            { who: "RELAY", msg: "Reminder set for Friday 4:30pm: \"Review AWS bill — up 40% this month.\" You’re clear. Good morning.",                                                         dark: true  },
          ].map((m, i) => (
            <div key={i} className={`px-6 sm:px-10 md:px-12 py-6 sm:py-8 border-b-4 border-black last:border-b-0 ${m.dark ? "bg-black text-[#FFE600]" : "bg-white"}`}>
              <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] mb-2 sm:mb-3 ${m.dark ? "opacity-30" : "opacity-25"}`}>{m.who}</p>
              <p className="text-base sm:text-lg md:text-xl font-medium leading-relaxed">{m.msg}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DASHBOARD ── */}
      <section className="border-t-4 border-black mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <h2 className="text-[38px] sm:text-[56px] md:text-[88px] font-black leading-[0.88] tracking-tight mb-8 sm:mb-12">
          One screen.
          <br />
          No context-switching.
        </h2>

        <div className="border-4 border-black overflow-hidden">
          {/* Topbar */}
          <div className="bg-black px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b-2 border-[#1f1f1f]">
            <span className="text-[#FFE600] text-lg sm:text-xl font-black">RELAY</span>
            <div className="flex gap-2">
              <span className="bg-[#FFE600] text-black text-[9px] sm:text-[10px] font-black uppercase px-2 sm:px-3 py-1">9 UNREAD</span>
              <span className="bg-[#1a1a1a] text-[#555] text-[9px] sm:text-[10px] font-black uppercase px-2 sm:px-3 py-1">4 TODAY</span>
            </div>
          </div>

          {/* Body */}
          <div className="bg-[#0d0d0d] grid grid-cols-1 md:grid-cols-[190px_1fr_250px]">
            {/* Sidebar */}
            <div className="bg-[#0a0a0a] border-r-2 border-[#1a1a1a] p-4 hidden md:flex flex-col gap-1">
              {[
                { e: "⚡", l: "Ask Relay",      a: true  },
                { e: "📬", l: "Inbox",          a: false },
                { e: "📅", l: "Calendar",       a: false },
                { e: "🔁", l: "Follow-ups",     a: false },
                { e: "📤", l: "Sent by Relay",  a: false },
              ].map(({ e, l, a }) => (
                <div key={l} className={`flex items-center gap-2.5 px-3 py-2.5 rounded text-[11px] font-black uppercase tracking-wide ${a ? "bg-[#FFE600] text-black" : "text-[#444]"}`}>
                  <span>{e}</span>{l}
                </div>
              ))}
            </div>

            {/* Chat area */}
            <div className="p-4 sm:p-5 flex flex-col gap-3 border-r-0 md:border-r-2 border-[#1a1a1a]">
              <div className="bg-[#161616] border border-[#222] rounded-md p-3">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#3a3a3a] mb-2">YOU</p>
                <p className="text-sm text-[#666]">What’s the damage this morning?</p>
              </div>
              <div className="bg-[#FFE600] rounded-md p-3">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">RELAY</p>
                <p className="text-sm font-semibold text-black leading-relaxed">
                  Four things. Nisha’s invoice needs approval. Dev standup moved to 9:30. Proposal got a yes. AWS bill up 40%.
                </p>
              </div>
              <div className="bg-[#161616] border border-[#222] rounded-md p-3">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[#3a3a3a] mb-2">YOU</p>
                <p className="text-sm text-[#666]">Approve Nisha’s invoice.</p>
              </div>
              <div className="bg-[#FFE600] rounded-md p-3">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-black/30 mb-2">RELAY</p>
                <p className="text-sm font-semibold text-black">Done. Confirmation sent to Nisha ✓</p>
              </div>
              <div className="flex gap-2 mt-1">
                <div className="flex-1 bg-[#161616] border border-[#2a2a2a] rounded-md px-4 py-2.5 text-xs text-[#333]">Type anything...</div>
                <div className="bg-[#FFE600] text-black px-4 py-2.5 text-sm font-black rounded-md">→</div>
              </div>
            </div>

            {/* Right panel */}
            <div className="p-4 sm:p-5 hidden md:flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#333] mb-3">NEEDS ACTION</p>
                {[
                  { f: "Nisha Kapoor",  s: "Invoice #112 — approval pending…", dot: true  },
                  { f: "Aryan Verma",   s: "Re: Proposal — we’re in!",         dot: true  },
                  { f: "AWS Billing",   s: "Your bill increased by 40%",        dot: false },
                  { f: "Dev Team",      s: "Standup moved to 9:30am",           dot: false },
                ].map(({ f, s, dot }) => (
                  <div key={f} className="py-2 border-b border-[#1a1a1a] last:border-0">
                    <p className="text-[11px] font-bold text-[#ccc] flex items-center gap-1.5">
                      {dot && <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600] shrink-0" />}
                      {f}
                    </p>
                    <p className="text-[10px] text-[#444] truncate">{s}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#333] mb-3">TODAY’S SCHEDULE</p>
                {[
                  { t: "9:30",    e: "Dev Standup ⚡",     w: "Eng team"       },
                  { t: "1:00 PM", e: "Deep Work Block",    w: "Blocked by Relay" },
                  { t: "3:30 PM", e: "Client Onboarding",  w: "You + Nisha"    },
                ].map(({ t, e, w }) => (
                  <div key={t} className="py-2 border-b border-[#1a1a1a] last:border-0 flex gap-3">
                    <span className="text-[10px] font-black text-[#FFE600] whitespace-nowrap pt-0.5">{t}</span>
                    <div>
                      <p className="text-[11px] font-bold text-[#aaa]">{e}</p>
                      <p className="text-[10px] text-[#444]">{w}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ADDED: mid-page CTA after dashboard showcase */}
          <div className="mt-12 sm:mt-16 border-4 border-black bg-white p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">READY TO TRY?</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight">Ready to try Relay?</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
              onClick={signIn}
              className="w-full sm:w-auto bg-white text-black border-4 border-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:-translate-y-0.5 transition text-center"
            >
              SIGN IN
            </button>
            <button
              onClick={signIn}
              className="w-full sm:w-auto bg-black text-[#FFE600] border-4 border-black px-6 py-3 text-sm font-black uppercase tracking-widest hover:-translate-y-0.5 transition text-center"
            >
              GET STARTED →
            </button>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="border-t-4 border-black mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-8 sm:mb-12">WHAT PEOPLE ARE SAYING</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              quote: "I used to start every morning in my inbox for 45 minutes. Now I type two sentences to Relay and I’m done. It’s a bit unreal.",
              name: "Priya M.",
              role: "Founder, B2B SaaS",
            },
            {
              quote: "The follow-up feature alone is worth it. I’ve closed three deals this month that would have gone cold before Relay.",
              name: "Rahul S.",
              role: "Head of Sales",
            },
            {
              quote: "I gave it to our CEO to try for a week. He hasn’t opened Gmail directly since. That’s the whole review.",
              name: "Devansh T.",
              role: "CTO, Series A startup",
            },
          ].map(({ quote, name, role }) => (
            <div key={name} className="border-4 border-black bg-white p-6 sm:p-8">
              <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8 font-medium">“{quote}”</p>
              <div className="border-t-2 border-black pt-4 sm:pt-5">
                <p className="font-black text-sm">{name}</p>
                <p className="text-[10px] sm:text-xs opacity-40 font-bold uppercase tracking-wide mt-1">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BIG STATEMENT ── */}
      <section className="border-t-4 border-black mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-32">
        <h2 className="text-[46px] sm:text-[68px] md:text-[110px] font-black leading-[0.88] tracking-tight">
          Gmail is a tool.
          <br />
          You are not
          <br />
          <span className="inline-block bg-black text-[#FFE600] px-3 sm:px-4 mt-2">
            the tool.
          </span>
        </h2>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-black border-t-4 border-black px-4 sm:px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FFE600] blink shrink-0" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-[#FFE600]/40">
              Free during beta · No card needed
            </span>
          </div>

          <h2 className="text-[42px] sm:text-[64px] md:text-[100px] font-black leading-[0.88] tracking-tight text-[#FFE600]">
            Stop managing
            <br />
            email.
            <br />
            Start managing
            <br />
            your actual life.
          </h2>

          <p className="mt-8 sm:mt-10 text-base sm:text-lg md:text-xl text-[#FFE600]/40 max-w-xl leading-relaxed font-medium">
            Relay plugs into Gmail and Google Calendar in 90 seconds. From that point on — you talk, it works. That’s the whole product.
          </p>

          {/* CHANGED: two buttons — SIGN IN + START FREE */}
          <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={signIn}
              className="w-full sm:w-auto bg-[#FFE600] text-black border-4 border-[#FFE600] px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl font-black uppercase tracking-wide hover:-translate-y-1 transition text-center"
            >
              START FREE WITH GOOGLE →
            </button>
            <button
              onClick={signIn}
              className="w-full sm:w-auto bg-transparent text-[#FFE600] border-4 border-[#FFE600]/40 px-8 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl font-black uppercase tracking-wide hover:-translate-y-1 hover:border-[#FFE600] transition text-center"
            >
              SIGN IN
            </button>
          </div>

          <p className="mt-4 sm:mt-5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#FFE600]/20 text-center sm:text-left">
            Gmail · Google Calendar · No lock-in · Cancel anytime
          </p>
        </div>
      </section>

    </main>
  );
}