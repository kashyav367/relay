import { z } from "zod";
import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { ollama } from "ai-sdk-ollama";
import { createVercelAiMcpClient } from "@corsair-dev/mcp";

import { createTRPCRouter, publicProcedure } from "../trpc";

const AI_SYSTEM_PROMPT = `
You are a helpful assistant with access to the user's Gmail and Google Calendar
via MCP tools. Use the tools to answer questions and complete tasks on the
user's behalf. Be concise and action-oriented.
`.trim();

export const aiRouter = createTRPCRouter({
  chat: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        useLocalModel: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const mcpClient = await createVercelAiMcpClient({
        url: process.env.MCP_URL ?? "http://localhost:3000/mcp",
      });

      try {
        const tools = await mcpClient.tools();

        const { text } = await generateText({
          model: input.useLocalModel
            ? ollama("gemma4")
            : google("gemini-flash-lite-latest"),
          tools,
          stopWhen: stepCountIs(10),
          system: AI_SYSTEM_PROMPT,
          prompt: input.prompt,
        });

        return { response: text.toString() };
      } finally {
        await mcpClient.close();
      }
    }),
});
