import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Please set it before starting the server.");
}

export const db = drizzle({
  connection: process.env.DATABASE_URL,
  ws,
});
