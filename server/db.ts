import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

// Temporary fallback for development
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/digital-school";

export const db = drizzle({
  connection: databaseUrl,
  ws: ws,
});