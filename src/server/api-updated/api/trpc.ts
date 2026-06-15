/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "~/server/db";

/**
 * 1. CONTEXT
 *
 * Extend context to carry the user id and access token extracted from the
 * Authorization header (Bearer <token>).  Both the MCP router and the AI
 * router need them.
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const authHeader = opts.headers.get("Authorization") ?? "";
  const accessToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  // Derive a stable tenant / user id from the token.
  // Replace this with your real auth lookup (e.g. JWT decode / session fetch).
  const userId = accessToken ? `user-${accessToken.slice(0, 8)}` : null;

  return {
    db,
    accessToken,
    user: userId ? { id: userId } : null,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

/**
 * Timing middleware (keeps your existing dev-delay behaviour).
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();
  console.log(`[TRPC] ${path} took ${Date.now() - start}ms to execute`);
  return result;
});

/**
 * Auth middleware — rejects unauthenticated requests.
 */
const enforceAuth = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.accessToken) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // narrow types: user and accessToken are now non-null
      user: ctx.user,
      accessToken: ctx.accessToken,
    },
  });
});

/**
 * Public procedure — no auth required.
 */
export const publicProcedure = t.procedure.use(timingMiddleware );

/**
 * Protected procedure — requires a valid Bearer token.
 */

