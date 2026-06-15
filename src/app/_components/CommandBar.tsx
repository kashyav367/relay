"use client";

import { useEffect, useState } from "react";
import { MessageBubble } from "~/components/chat/MessageBubble";
import { TypingIndicator } from "~/components/chat/TypingIndicator";

interface Props {
  defaultPrompt?: string;
}

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function CommandBar({
  defaultPrompt = "",
}: Props) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setPrompt(defaultPrompt);
  }, [defaultPrompt]);

  async function handleSubmit() {
    if (!prompt.trim()) return;

    const userPrompt = prompt;

    // User Message
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: userPrompt,
        timestamp: new Date(),
      },
    ]);

    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
        }),
      });

      const data = await res.json();
      console.log("CHAT RESPONSE", data);

      // Assistant Message
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            typeof data.message === "string"
              ? data.message
              : Array.isArray(data.message)
                ? data.message
                    .map((item: any) =>
                      item.subject
                        ? `• ${item.subject}`
                        : item.summary
                          ? `• ${item.summary}`
                          : "• Item"
                    )
                    .join("\n")
                : JSON.stringify(data.message, null, 2),
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error(err);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Failed to connect.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Chat Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))}

        {loading && <TypingIndicator />}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask Relay..."
          className="flex-1 rounded-xl border p-4"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />

        <button
          onClick={handleSubmit}
          className="rounded-xl bg-black px-6 text-white"
        >
          Send
        </button>
      </div>
    </div>
  );
}