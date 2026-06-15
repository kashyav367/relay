import { z } from "zod";
import { generateText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { ollama } from "ai-sdk-ollama";
import { corsair } from "~/server/corsair";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { buildRawEmailBase64 } from "~/server/lib/gmail";

const AI_SYSTEM_PROMPT = `
You are an AI assistant with Gmail and Google Calendar access.

Rules:
- Always use tools when appropriate.
- For sending emails, you MUST extract:
  - recipient email address
  - subject
  - body
- Never call sendEmail without a valid email address.
- If the email address is missing, ask the user for it.
- For calendar requests, use calendar tools.
- Be concise and action-oriented.
`.trim();

export const aiRouter = createTRPCRouter({
  chat: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        useLocalModel: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
  const tenant = corsair.withTenant("dev");

  const emailMatch = input.prompt.match(
    /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
  );

 if (
  input.prompt.toLowerCase().includes("send email") &&
  emailMatch
) {
  const raw = buildRawEmailBase64({
    to: emailMatch[0],
    subject: "Relay Test",
    body: "Hello from Relay AI",
  });

  await tenant.gmail.api.messages.send({
    raw,
  });

  return {
    response: `Email sent successfully to ${emailMatch[0]}`,
  };
}

      const tools = {
        listEmails: tool({
          description: "List recent emails from Gmail inbox",
          parameters: z.object({
            maxResults: z.number().default(10).describe("Number of emails to fetch"),
          }),
          execute: async ({ maxResults }) => {
            return await tenant.gmail.api.messages.list({ maxResults });
          },
        }),

        getEmail: tool({
          description: "Get a specific email by ID",
          parameters: z.object({
            id: z.string().describe("The email message ID"),
          }),
          execute: async ({ id }) => {
            return await tenant.gmail.api.messages.get({ id });
          },
        }),

   sendEmail: tool({
  description:
    "Send an email via Gmail. Required fields: to, subject, body.",

  parameters: z.object({
    to: z.string().email(),
    subject: z.string(),
    body: z.string(),
  }),

  execute: async ({ to, subject, body }) => {
    console.log("SEND EMAIL TOOL CALLED", {
      to,
      subject,
      body,
    });

    const raw = buildRawEmailBase64({
      to,
      subject,
      body,
    });

    return await tenant.gmail.api.messages.send({
      raw,
    });
  },
}),


        getCalendarEvents: tool({
          description: "Get upcoming Google Calendar events",
          parameters: z.object({
            maxResults: z.number().default(10),
            timeMin: z.string().optional().describe("ISO datetime, defaults to now"),
          }),
          execute: async ({ maxResults, timeMin }) => {
            return await tenant.googlecalendar.api.events.getMany({
              maxResults,
              timeMin: timeMin ?? new Date().toISOString(),
            });
          },
        }),

        createCalendarEvent: tool({
          description: "Create a new event on Google Calendar",
          parameters: z.object({
            summary: z.string().describe("Event title"),
            start: z.string().describe("Start datetime in ISO format"),
            end: z.string().describe("End datetime in ISO format"),
            description: z.string().optional(),
          }),
          execute: async ({ summary, start, end, description }) => {
            return await tenant.googlecalendar.api.events.create({
              summary,
              start,
              end,
              description,
            });
          },
        }),

        updateCalendarEvent: tool({
          description: "Update an existing calendar event",
          parameters: z.object({
            id: z.string().describe("Event ID"),
            summary: z.string().optional(),
            start: z.string().optional(),
            end: z.string().optional(),
            description: z.string().optional(),
          }),
          execute: async ({ id, ...updates }) => {
            return await tenant.googlecalendar.api.events.update({ id, ...updates });
          },
        }),

        deleteCalendarEvent: tool({
          description: "Delete a calendar event",
          parameters: z.object({
            id: z.string().describe("Event ID to delete"),
          }),
          execute: async ({ id }) => {
            return await tenant.googlecalendar.api.events.delete({ id });
          },
        }),
      };

      const { text } = await generateText({
        model: input.useLocalModel
          ? ollama("gemma4")
          : google("gemini-2.5-flash"),
        tools,
        stopWhen: stepCountIs(10),
        system: AI_SYSTEM_PROMPT,
        prompt: input.prompt,
      });

      return { response: text };
    }),
});