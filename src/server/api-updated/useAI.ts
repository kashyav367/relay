/**
 * useAI — call the AI from anywhere in your app.
 *
 * Usage (React component / hook):
 *
 *   const { ask, response, loading, error } = useAI();
 *
 *   await ask("Summarise my unread emails");
 *   await ask("What meetings do I have tomorrow?", { useLocalModel: true });
 *
 * Usage (one-shot, outside React):
 *
 *   import { askAI } from "~/hooks/useAI";
 *   const text = await askAI(trpc, "Draft a reply to the last email");
 */

import { useState, useCallback } from "react";
import { api } from "~/trpc/react";          // adjust if your tRPC client lives elsewhere

// ─── Types ───────────────────────────────────────────────────────────────────

interface AskOptions {
  /** Use the local Ollama model instead of Gemini. Defaults to false. */
  useLocalModel?: boolean;
}

interface UseAIReturn {
  /** Send a prompt to the AI and await its response. */
  ask: (prompt: string, options?: AskOptions) => Promise<string>;
  /** The last response text, or null before the first call. */
  response: string | null;
  /** True while a request is in-flight. */
  loading: boolean;
  /** The last error, or null if the most recent call succeeded. */
  error: Error | null;
  /** Reset state back to the initial values. */
  reset: () => void;
}

// ─── React hook ──────────────────────────────────────────────────────────────

export function useAI(): UseAIReturn {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const chatMutation = api.ai.chat.useMutation();

  const ask = useCallback(
    async (prompt: string, options: AskOptions = {}): Promise<string> => {
      setLoading(true);
      setError(null);

      try {
        const result = await chatMutation.mutateAsync({
          prompt,
          useLocalModel: options.useLocalModel ?? false,
        });

        setResponse(result.response);
        return result.response;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [chatMutation],
  );

  const reset = useCallback(() => {
    setResponse(null);
    setError(null);
    setLoading(false);
  }, []);

  return { ask, response, loading, error, reset };
}

// ─── Standalone helper (outside React) ───────────────────────────────────────

/**
 * Call the AI without a React hook — useful in server actions, route handlers,
 * utility functions, etc.
 *
 * @param trpcClient  A tRPC caller created via `createCaller(ctx)` or the
 *                    vanilla tRPC client from `~/trpc/server`.
 * @param prompt      The user's message.
 * @param options     Optional config (useLocalModel).
 * @returns           The AI's response text.
 *
 * @example
 *   // In a Next.js Server Action:
 *   import { createCaller } from "~/server/api/root";
 *   import { createTRPCContext } from "~/server/api/trpc";
 *
 *   const ctx = await createTRPCContext({ headers: request.headers });
 *   const caller = createCaller(ctx);
 *   const text = await askAI(caller, "List my calendar events for today");
 */
export async function askAI(
  trpcClient: { ai: { chat: { mutate: (input: { prompt: string; useLocalModel: boolean }) => Promise<{ response: string }> } } },
  prompt: string,
  options: AskOptions = {},
): Promise<string> {
  const result = await trpcClient.ai.chat.mutate({
    prompt,
    useLocalModel: options.useLocalModel ?? false,
  });
  return result.response;
}
