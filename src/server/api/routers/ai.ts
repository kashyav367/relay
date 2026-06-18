import { z } from "zod";
import { generateText, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { ollama } from "ai-sdk-ollama";
import { corsair } from "~/server/corsair";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { buildRawEmailBase64 } from "~/server/lib/gmail";
import { getCurrentUser } from "~/server/auth";
import { TRPCError } from "@trpc/server";

const AI_SYSTEM_PROMPT = `
You are Relay AI.

You are an executive assistant connected to Gmail and Google Calendar.

Rules:

- Always use tools for inbox and calendar questions.
- Never invent email content.
- Use sender, subject and snippet when summarizing emails.
- Highlight urgent emails.
- Use calendar events to answer scheduling questions.
- Ask for missing information before sending emails.
- Never expose raw JSON or tool outputs.
- Respond like a professional executive assistant.

Be concise and action-oriented.
`.trim();

// --- Gmail header helpers -------------------------------------------------

interface GmailHeader {
  name?: string;
  value?: string;
}

interface GmailMessage {
  id?: string;
  snippet?: string;
  labelIds?: string[];
  payload?: {
    headers?: GmailHeader[];
  };
}

function getHeader(headers: GmailHeader[], name: string): string {
  return headers.find((h) => h.name === name)?.value ?? "";
}

function summarizeMessage(email: GmailMessage) {
  const headers = email.payload?.headers ?? [];
  return {
    id: email.id ?? "",
    subject: getHeader(headers, "Subject") || "(No Subject)",
    from: getHeader(headers, "From"),
    snippet: email.snippet ?? "",
    unread: email.labelIds?.includes("UNREAD") ?? false,
  };
}

// --- Router ----------------------------------------------------------------

export const aiRouter = createTRPCRouter({
  chat: publicProcedure
    .input(
      z.object({
        prompt: z.string().min(1),
        useLocalModel: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await getCurrentUser();
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      const tenant = corsair.withTenant(user.id);

      const tools = {
        listEmails: tool({
          description: "List recent emails from Gmail inbox",
          parameters: z.object({
            maxResults: z
              .number()
              .default(10)
              .describe("Number of emails to fetch"),
          }),
          execute: async ({ maxResults }) => {
            try {
              const list = await tenant.gmail.api.messages.list({
                maxResults,
              });

              const messageRefs = list.messages ?? [];

              const emails = await Promise.all(
                messageRefs
                  .filter((msg): msg is { id: string } => Boolean(msg.id))
                  .map(async (msg) => {
                    const email = await tenant.gmail.api.messages.get({
                      id: msg.id,
                    });
                    return summarizeMessage(email);
                  }),
              );

              return emails;
            } catch (err) {
              console.error("listEmails failed:", err);
              return { error: "Could not load emails right now." };
            }
          },
        }),

        getEmail: tool({
          description: "Get a specific email by ID",
          parameters: z.object({
            id: z.string().describe("The email message ID"),
          }),
          execute: async ({ id }) => {
            try {
              const email = await tenant.gmail.api.messages.get({ id });
              return summarizeMessage(email);
            } catch (err) {
              console.error("getEmail failed:", err);
              return { error: `Could not load email ${id}.` };
            }
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
            try {
              const raw = buildRawEmailBase64({ to, subject, body });
              await tenant.gmail.api.messages.send({ raw });
              return { success: true, to, subject };
            } catch (err) {
              console.error("sendEmail failed:", err);
              return { success: false, error: "Could not send the email." };
            }
          },
        }),

        getCalendarEvents: tool({
          description: "Get upcoming Google Calendar events",
          parameters: z.object({
            maxResults: z.number().default(10),
            timeMin: z.string().optional(),
          }),
          execute: async ({ maxResults, timeMin }) => {
            try {
              const events = await tenant.googlecalendar.api.events.getMany({
                calendarId: "primary",
                maxResults,
                timeMin: timeMin ?? new Date().toISOString(),
              });

              return (events ?? []).map((event) => ({
                id: event.id,
                title: event.summary,
                start: event.start,
                end: event.end,
                location: event.location,
                description: event.description,
              }));
            } catch (err) {
              console.error("getCalendarEvents failed:", err);
              return { error: "Could not load calendar events right now." };
            }
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
            try {
              const event = await tenant.googlecalendar.api.events.create({
                summary,
                start,
                end,
                description,
              });
              return { success: true, id: event.id, summary };
            } catch (err) {
              console.error("createCalendarEvent failed:", err);
              return { success: false, error: "Could not create the event." };
            }
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
            try {
              await tenant.googlecalendar.api.events.update({
                id,
                ...updates,
              });
              return { success: true, id };
            } catch (err) {
              console.error("updateCalendarEvent failed:", err);
              return { success: false, error: "Could not update the event." };
            }
          },
        }),

        deleteCalendarEvent: tool({
          description: "Delete a calendar event",
          parameters: z.object({
            id: z.string().describe("Event ID to delete"),
          }),
          execute: async ({ id }) => {
            try {
              await tenant.googlecalendar.api.events.delete({ id });
              return { success: true, id };
            } catch (err) {
              console.error("deleteCalendarEvent failed:", err);
              return { success: false, error: "Could not delete the event." };
            }
          },
        }),
      };

      try {
        const { text } = await generateText({
          model: input.useLocalModel
            ? ollama("gemma2")
            : google("gemini-2.5-flash"),
          tools,
          stopWhen: stepCountIs(20),
          system: AI_SYSTEM_PROMPT,
          prompt: input.prompt,
        });

        return { response: text };
      } catch (err) {
        console.error("generateText failed:", err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Relay couldn't process that request. Please try again.",
        });
      }
    }),
});