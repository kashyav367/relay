"use client";

import { useState } from "react";

import { Sidebar } from "~/components/layout/Sidebar";

import CommandBar from "./_components/CommandBar";
import InboxCard from "./_components/InboxCard";
import CalendarCard from "./_components/CalendarCard";

import { Mail, Calendar, FileText, Plus } from "lucide-react";
import { QuickActionCard } from "~/components/chat/QuickActionCard";

export default function HomePage() {
  const [selectedPrompt, setSelectedPrompt] = useState("");

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold">
            Relay
          </h1>

          <p className="mt-2 text-gray-500">
            AI-Powered Email & Calendar OS
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mt-6 max-w-2xl">
            <QuickActionCard
              icon={Mail}
              title="Unread Emails"
              subtitle="See what needs attention"
              color="indigo"
              onClick={() => setSelectedPrompt("Show unread emails")}
            />

            <QuickActionCard
              icon={Calendar}
              title="Calendar"
              subtitle="Upcoming meetings"
              color="violet"
              onClick={() => setSelectedPrompt("Show my calendar")}
            />

            <QuickActionCard
              icon={FileText}
              title="Latest Emails"
              subtitle="Recent inbox activity"
              color="blue"
              onClick={() => setSelectedPrompt("Show latest emails")}
            />

            <QuickActionCard
              icon={Plus}
              title="Create Meeting"
              subtitle="Schedule an event"
              color="purple"
              onClick={() =>
                setSelectedPrompt("Create meeting tomorrow at 10 AM")
              }
            />
          </div>

          <div className="mt-8">
            <CommandBar defaultPrompt={selectedPrompt} />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <InboxCard />
            <CalendarCard />
          </div>
        </div>
      </main>
    </div>
  );
}