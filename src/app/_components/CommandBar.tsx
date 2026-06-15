"use client";

import { useEffect, useState } from "react";

interface Props {
  defaultPrompt?: string;
}

export default function CommandBar({
  defaultPrompt = "",
}: Props) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPrompt(defaultPrompt);
  }, [defaultPrompt]);

  async function handleSubmit() {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });

      const data = await res.json();

      setResponse(data.message);
    } catch (err) {
      console.error(err);
      setResponse("Failed to connect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
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

      {loading && (
        <div className="rounded-xl border p-4">
          Thinking...
        </div>
      )}

      {response && (
        <pre className="overflow-auto rounded-xl border p-4 text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}