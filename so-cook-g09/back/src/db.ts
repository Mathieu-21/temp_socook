import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const db = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "socook",
  user: process.env.DB_USER || "socook",
  password: process.env.DB_PASS,
});

// Optional error handling
db.on("error", (err: Error) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});
