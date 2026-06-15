// export default function CalendarPage() {

//     // const askAI = async (trpcClient: { ai: { chat: { mutate: (input: { prompt: string; useLocalModel: boolean }) => Promise<{ response: string }> } } }, prompt: string, options: AskOptions = {}): Promise<string> => {
//     //   trpcClient: { ai: { chat: { mutate: (input: { prompt: string; useLocalModel: boolean }) => Promise<{ response: string }> } } },
//     //   prompt: string,
//     //   options: AskOptions = {},
//     // ): Promise<string> =>{
//     //   const result = await trpcClient.ai.chat.mutate({
//     //     prompt,
//     //     useLocalModel: options.useLocalModel ?? false,
//     //   });
//     //   return result.response;
//     // }


//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">Calendar</h1>
//       <p className="text-muted-foreground mt-2">
//         Upcoming events.
//       </p>
//     </div>
//   );
// }

// export default async function CalendarPage() {
//   const response = await fetch("/api/chat", {
//     method: "POST",
//   });
//   console.log(response);
//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">Calendar</h1>
//       <p className="text-muted-foreground mt-2">Upcoming events.</p>
//     </div>
//   );
// }

// export default async function CalendarPage() {
//   const response = await fetch("http://localhost:3000/api/chat", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ prompt: "Show my upcoming calendar events" }),
//     cache: "no-store",
//   });
//   const data = await response.json();
//   console.log(data);

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold">Calendar</h1>
//       <p className="text-muted-foreground mt-2">Upcoming events.</p>
//     </div>
//   );
// }

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


































