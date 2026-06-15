import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { gmailRouter } from "~/server/api/routers/gmail";
import { calendarRouter } from "~/server/api/routers/calendar";
import { mcpRouter } from "~/server/api/routers/mcp";
import { aiRouter } from "~/server/api/routers/ai";

/**
 * Primary router — add every sub-router here.
 */
export const appRouter = createTRPCRouter({
  gmail: gmailRouter,
  calendar: calendarRouter,
  mcp: mcpRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
