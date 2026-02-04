import { createClient } from "@libsql/client";
import { LeaderboardEntry } from "../types";

// Credentials provided by user
const URL = "https://cutscene-apk-cutscene.aws-us-east-1.turso.io";
const AUTH_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjkwODc0MzIsImlkIjoiNjlhOTgwYzgtYjc3Mi00YmJiLThjODMtM2ZhYTQzMDlkOTg1IiwicmlkIjoiYjI1YmEwYzAtNmQ0MS00ODYzLTg3ZTItYTkyYTExNWIxOTNhIn0.TsK8WxdHpDrG5EJTcrmaYqOBOxuzhf92SpS3bqWnL9-H6dagA-le49MdXRe3Np4T894YomtiFWtl_ELc6sEFDA";

const client = createClient({
  url: URL,
  authToken: AUTH_TOKEN,
});

// Initialize table if it doesn't exist (Lazy initialization)
const ensureTableExists = async () => {
    try {
        await client.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone TEXT NOT NULL UNIQUE,
                discount INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (e) {
        console.error("Failed to ensure table exists:", e);
        throw e; // Propagate error to block user
    }
};

export const checkPhoneUnique = async (phone: string): Promise<boolean> => {
  try {
    // Basic network connectivity check before DB call
    if (!navigator.onLine) {
        throw new Error("No internet connection");
    }

    await ensureTableExists();
    const result = await client.execute({
      sql: "SELECT count(*) as count FROM users WHERE phone = ?",
      args: [phone],
    });
    
    // Handle different response structures
    const row = result.rows[0];
    const count = typeof row === 'object' && row !== null && 'count' in row 
        ? row.count 
        : Array.isArray(row) ? row[0] : 0;

    return Number(count) === 0;
  } catch (e) {
    console.error("DB Check Failed:", e);
    // CRITICAL UPDATE: DO NOT return true here. 
    // If the DB is unreachable, we must block the user.
    throw e; 
  }
};

export const registerUser = async (name: string, phone: string): Promise<void> => {
  try {
    await ensureTableExists();
    await client.execute({
      sql: "INSERT INTO users (name, phone, discount) VALUES (?, ?, 0)",
      args: [name, phone],
    });
  } catch (e) {
    console.error("DB Register Failed:", e);
    throw e;
  }
};

export const updateUserScore = async (phone: string, discount: number): Promise<void> => {
    try {
        await client.execute({
            sql: "UPDATE users SET discount = ? WHERE phone = ?",
            args: [discount, phone]
        });
    } catch(e) {
        console.error("DB Update Score Failed:", e);
        // We might want to queue this for later if possible, 
        // but for now, we just log it.
    }
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    await ensureTableExists();
    // LOGIC UPDATE:
    // 1. discount DESC (Highest score first)
    // 2. created_at ASC (Oldest timestamp first) -> This handles the "tie-breaker" favoring early birds
    const result = await client.execute({
      sql: "SELECT name, discount FROM users ORDER BY discount DESC, created_at ASC LIMIT 10", 
      args: [],
    });

    return result.rows.map(row => ({
      name: row.name as string,
      discount: Number(row.discount)
    }));
  } catch (e) {
    console.error("Fetch Leaderboard Failed:", e);
    return [];
  }
};