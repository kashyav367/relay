import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { corsair } from "~/server/corsair";

export const calendarRouter = createTRPCRouter({
  getEvents: publicProcedure.query(async () => {
    const calendar = corsair.withTenant("dev").googlecalendar.api;

    return await calendar.events.getMany({
      calendarId: "primary",
    });
  }),

  getEvent: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const calendar = corsair.withTenant("dev").googlecalendar.api;

      return await calendar.events.get({
        id: input.id,
        calendarId: "primary",
      });
    }),

  createEvent: publicProcedure
    .input(
      z.object({
        summary: z.string(),
        description: z.string().optional(),
        start: z.string(),
        end: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const calendar = corsair.withTenant("dev").googlecalendar.api;

      return await calendar.events.create({
        calendarId: "primary",
        event: {
          summary: input.summary,
          description: input.description,
          start: {
            dateTime: input.start,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: input.end,
            timeZone: "Asia/Kolkata",
          },
        },
      });
    }),

updateEvent: publicProcedure
  .input(
    z.object({
      id: z.string(),
      summary: z.string(),
    }),
  )
  .mutation(async ({ input }) => {
    const calendar = corsair.withTenant("dev").googlecalendar.api;

    const existing = await calendar.events.get({
      id: input.id,
      calendarId: "primary",
    });

    return await calendar.events.update({
      id: input.id,
      calendarId: "primary",
      event: {
        summary: input.summary,
        description: existing.description,
        start: existing.start,
        end: existing.end,
      },
    });
  }),

  deleteEvent: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const calendar = corsair.withTenant("dev").googlecalendar.api;

      return await calendar.events.delete({
        id: input.id,
        calendarId: "primary",
      });
    }),
});
