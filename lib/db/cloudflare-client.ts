import { drizzle } from "drizzle-orm/d1";
import { getRequestContext } from "@cloudflare/next-on-pages";
import * as schema from "./schema";

// Interface pour l'environnement Cloudflare
interface CloudflareEnv {
  DB: any;
  IMAGES: any;
}

// Pour Cloudflare Pages avec Next-on-Pages
export function getCloudflareDb() {
  try {
    const { env } = getRequestContext() as any;
    if (!env.DB) {
      throw new Error("Database binding not found");
    }
    return drizzle(env.DB, { schema });
  } catch (error) {
    console.error("Failed to get Cloudflare DB:", error);
    throw error;
  }
}

// Pour R2
export function getR2Bucket() {
  try {
    const { env } = getRequestContext() as any;
    if (!env.IMAGES) {
      throw new Error("R2 bucket binding not found");
    }
    return env.IMAGES;
  } catch (error) {
    console.error("Failed to get R2 bucket:", error);
    throw error;
  }
}
