// src/app/mcp/route.ts
import "server-only";
import { createBaseMcpServer, createMcpRouter } from "@corsair-dev/mcp";
import { corsair } from "~/server/corsair";
import { type NextRequest } from "next/server";
import { createServer } from "node:http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleRequest(req: NextRequest): Promise<Response> {
  const token = req.headers.get("Authorization")?.slice(7) ?? "dev";

  const router = createMcpRouter(() =>
    createBaseMcpServer({
      corsair: corsair.withTenant(token),
    }),
  );

  return new Promise((resolve) => {
    const server = createServer((nodeReq, nodeRes) => {
      // Collect response
      const chunks: Buffer[] = [];
      const originalWrite = nodeRes.write.bind(nodeRes);
      const originalEnd = nodeRes.end.bind(nodeRes);
      const headers: Record<string, string> = {};
      let statusCode = 200;

      nodeRes.writeHead = (code: number, hdrs?: any) => {
        statusCode = code;
        if (hdrs) {
          Object.entries(hdrs).forEach(([k, v]) => {
            headers[k] = String(v);
          });
        }
        return nodeRes;
      };

      nodeRes.setHeader = (name: string, value: any) => {
        headers[name.toLowerCase()] = String(value);
        return nodeRes;
      };

      nodeRes.write = (chunk: any, ...args: any[]) => {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        return true;
      };

      nodeRes.end = (chunk?: any, ...args: any[]) => {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const body = Buffer.concat(chunks);
        resolve(new Response(body.length > 0 ? body : null, { status: statusCode, headers }));
        return nodeRes;
      };

      // Pipe Next.js request into the Express router
      const url = new URL(req.url);
      nodeReq.url = url.pathname + url.search;
      (nodeReq as any).method = req.method;
      (nodeReq as any).headers = Object.fromEntries(req.headers.entries());

      req.arrayBuffer().then((body) => {
        if (body.byteLength > 0) {
          const readable = nodeReq as any;
          readable.push(Buffer.from(body));
          readable.push(null);
        }
        router(nodeReq as any, nodeRes as any, (err: any) => {
          if (err) {
            resolve(new Response(String(err), { status: 500 }));
          } else {
            resolve(new Response("Not found", { status: 404 }));
          }
        });
      });
    });

    server.close(); // Don't actually listen, just use it as a shim
  });
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}
