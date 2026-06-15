export default function CalendarPage() {

    const askAI = async (trpcClient: { ai: { chat: { mutate: (input: { prompt: string; useLocalModel: boolean }) => Promise<{ response: string }> } } }, prompt: string, options: AskOptions = {}): Promise<string> => {
      trpcClient: { ai: { chat: { mutate: (input: { prompt: string; useLocalModel: boolean }) => Promise<{ response: string }> } } },
      prompt: string,
      options: AskOptions = {},
    ): Promise<string> =>{
      const result = await trpcClient.ai.chat.mutate({
        prompt,
        useLocalModel: options.useLocalModel ?? false,
      });
      return result.response;
    }


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Calendar</h1>
      <p className="text-muted-foreground mt-2">
        Upcoming events.
      </p>
    </div>
  );
}

