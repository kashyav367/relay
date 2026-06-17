import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { corsair } from "~/server/corsair";
import { buildRawEmailBase64 } from "~/server/lib/gmail";
import { getCurrentUser } from "~/server/auth";

export const gmailRouter = createTRPCRouter({
inbox: publicProcedure.query(async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }
const gmail = corsair.withTenant(user.id).gmail.api;

    const list = await gmail.messages.list({
      maxResults: 20,
    });

    const emails = await Promise.all(
      (list.messages ?? []).map(async (msg) => {
        const email = await gmail.messages.get({
          id: msg.id!,
        });

        const headers = email.payload?.headers ?? [];

        return {
          id: email.id,
          subject: headers.find((h) => h.name === "Subject")?.value ?? "(no subject)",
          from: headers.find((h) => h.name === "From")?.value ?? "",
          to: headers.find((h) => h.name === "To")?.value ?? "",
          date: headers.find((h) => h.name === "Date")?.value ?? "",
          snippet: email.snippet,
          labels: email.labelIds,
          isUnread: email.labelIds?.includes("UNREAD") ?? false,
        };
      }),
    );

    return emails;
  }),

getEmail: publicProcedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input }) => {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const gmail = corsair.withTenant(user.id).gmail.api;

    const email = await gmail.messages.get({ id: input.id });
    const headers = email.payload?.headers ?? [];

    return {
      id: email.id,
      snippet: email.snippet,
      labels: email.labelIds,
      isUnread: email.labelIds?.includes("UNREAD") ?? false,
      subject:
        headers.find((h) => h.name === "Subject")?.value ??
        "(no subject)",
      from: headers.find((h) => h.name === "From")?.value ?? "",
      to: headers.find((h) => h.name === "To")?.value ?? "",
      date: headers.find((h) => h.name === "Date")?.value ?? "",
    };
  }),

  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const gmail = corsair.withTenant(user.id).gmail.api;

      const results = await gmail.messages.list({ q: input.query });

      if (!results.messages?.length) return [];

      const emails = await Promise.all(
        results.messages.map(async (msg) => {
          const email = await gmail.messages.get({ id: msg.id! });
          const headers = email.payload?.headers ?? [];
          return {
            id: email.id,
            subject: headers.find((h) => h.name === "Subject")?.value ?? "(no subject)",
            from: headers.find((h) => h.name === "From")?.value ?? "",
            date: headers.find((h) => h.name === "Date")?.value ?? "",
            snippet: email.snippet,
            isUnread: email.labelIds?.includes("UNREAD") ?? false,
          };
        }),
      );

      return emails;
    }),

  sendEmail: publicProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
        cc: z.string().optional(),
        replyToId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const gmail = corsair.withTenant(user.id).gmail.api;

      const raw = buildRawEmailBase64({
        to: input.to,
        subject: input.subject,
        body: input.body,
        cc: input.cc,
      });

      return await gmail.messages.send({ raw });
    }),

  createDraft: publicProcedure
    .input(
      z.object({
        to: z.string().email(),
        subject: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const gmail = corsair.withTenant(user.id).gmail.api;

      const raw = buildRawEmailBase64({
        to: input.to,
        subject: input.subject,
        body: input.body,
      });

      return await gmail.drafts.create({
        draft: { message: { raw } },
      });
    }),

  sendDraft: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const gmail = corsair.withTenant(user.id).gmail.api;
      return await gmail.drafts.send({ id: input.id });
    }),

  markRead: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const gmail = corsair.withTenant(user.id).gmail.api;
      return await gmail.messages.modify({
        id: input.id,
        removeLabelIds: ["UNREAD"],
      });
    }),

  markUnread: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const gmail = corsair.withTenant(user.id).gmail.api;
      return await gmail.messages.modify({
        id: input.id,
        addLabelIds: ["UNREAD"],
      });
    }),

  archiveEmail: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const gmail = corsair.withTenant(user.id).gmail.api;
      return await gmail.messages.modify({
        id: input.id,
        removeLabelIds: ["INBOX"],
      });
    }),
trashEmail: publicProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input }) => {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const gmail = corsair.withTenant(user.id).gmail.api;

    return await gmail.messages.trash({
      id: input.id,
    });
  }),

  untrashEmail: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const user = await getCurrentUser();

      if (!user) {
        throw new Error("Unauthorized");
      }

      const gmail = corsair.withTenant(user.id).gmail.api;
      return await gmail.messages.delete({ id: input.id });
    }),
});