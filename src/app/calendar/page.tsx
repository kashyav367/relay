

import { createCaller } from "~/server/api/root";

export default async function CalendarPage() {
  const caller = createCaller({} as any);
  const result = await caller.ai.chat({
    prompt: "Show my upcoming calendar events",
    useLocalModel: false,
  });
  console.log(result);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Calendar</h1>
      <p className="text-muted-foreground mt-2">Upcoming events.</p>
    </div>
  );
}


































