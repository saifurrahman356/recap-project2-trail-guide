import path from "path";
import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";

const DB_PATH = String(
  process.env.DB_PATH || path.join(process.cwd(), "db", "trail-guide.db"),
);

let db: Database | null = null;

export async function connectDB(): Promise<Database> {
  db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  await db.exec("PRAGMA foreign_keys = ON");
  return db;
}

export async function getDB(): Promise<Database> {
  if (!db) {
    await connectDB();
  }
  return db!;
}

export async function closeDB(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
