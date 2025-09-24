import { drizzle } from "drizzle-orm/d1";
import Database from "better-sqlite3";
import { drizzle as drizzleLocal } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Type pour Cloudflare D1
interface D1Database {
  prepare(query: string): any;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: any[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<D1ExecResult>;
}

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: any;
}

interface D1ExecResult {
  count: number;
  duration: number;
}

// Pour le développement local
export function getLocalDb() {
  const sqlite = new Database("./dev.db");
  return drizzleLocal(sqlite, { schema });
}

// Pour la production Cloudflare
export function getCloudflareDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

// Client unifié qui détecte l'environnement
export function getDb() {
  if (process.env.NODE_ENV === "development" || !process.env.DATABASE_ID) {
    return getLocalDb();
  }

  // En production, D1 sera injecté via les bindings Cloudflare
  throw new Error("D1 database not available in production context");
}
