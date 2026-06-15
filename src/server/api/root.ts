import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { gmailRouter } from "~/server/api/routers/gmail";
import { calendarRouter } from "~/server/api/routers/calendar";
import { aiRouter } from "~/server/api/routers/ai";

export const appRouter = createTRPCRouter({
  gmail: gmailRouter,
  calendar: calendarRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);