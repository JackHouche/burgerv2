import { drizzle } from "drizzle-orm/d1";
import Database from "better-sqlite3";
import { drizzle as drizzleLocal } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Pour le développement local
export function getLocalDb() {
  const sqlite = new Database("./dev.db");
  return drizzleLocal(sqlite, { schema });
}

// Pour la production Cloudflare
export function getCloudflareDb(d1: any) {
  return drizzle(d1, { schema });
}

// Client unifié qui détecte l'environnement
export function getDb() {
  // Développement local
  if (process.env.NODE_ENV === "development") {
    return getLocalDb();
  }

  // Cloudflare Pages - D1 accessible via process.env.DB
  if (typeof process !== "undefined" && process.env.DB) {
    return getCloudflareDb(process.env.DB as any);
  }

  // Fallback vers local si aucun environnement détecté
  console.warn("No D1 binding found, falling back to local database");
  return getLocalDb();
}
