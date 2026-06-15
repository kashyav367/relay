import { createBaseMcpServer, createMcpRouter } from "@corsair-dev/mcp";
import { corsair } from "~/server/corsair";
import { createTRPCRouter, protectedProcedure } from "../trpc";

/**
 * MCP router — exposes a single mutation that boots the MCP server scoped
 * to the authenticated user's tenant.
 */
export const mcpRouter = createTRPCRouter({
  handler: protectedProcedure.mutation(async ({ ctx }) => {
    const tenantId = ctx.user.id;

    return createMcpRouter(() =>
      createBaseMcpServer({
        corsair: corsair.withTenant(tenantId),
      }),
    );
  }),
});
