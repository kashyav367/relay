import CommandBar from "./_components/CommandBar";
import InboxCard from "./_components/InboxCard";
import CalendarCard from "./_components/CalendarCard";

export default function HomePage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold">
          Relay
        </h1>

        <p className="mt-2 text-gray-500">
          AI-Powered Email & Calendar OS
        </p>

        <div className="mt-8">
          <CommandBar />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <InboxCard />
          <CalendarCard />
        </div>

      </div>
    </main>
  );
}