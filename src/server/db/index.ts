import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";

import * as schema from "./schema";

const env = {
  DATABASE_URL: process.env.DATABASE_URL!,
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

export const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);

if (env.NODE_ENV !== "production") {
  globalForDb.conn = conn;
}

export const db = drizzle(conn, { schema });