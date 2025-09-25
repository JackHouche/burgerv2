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
  // Sur Cloudflare Pages/Workers avec next-on-pages
  if (typeof process !== "undefined" && process.env.CF_PAGES === "1") {
    // Utiliser le client Cloudflare spécialement conçu pour next-on-pages
    try {
      const { getCloudflareDb } = require("./cloudflare-client");
      return getCloudflareDb();
    } catch (error) {
      console.error("Failed to get Cloudflare DB client:", error);
      throw error;
    }
  }

  // Développement local ou autres environnements
  return getLocalDb();
}
