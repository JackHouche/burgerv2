import { getCloudflareDb } from "./cloudflare-client";

// Client unifié qui utilise toujours Cloudflare D1
export function getDb() {
  try {
    return getCloudflareDb();
  } catch (error) {
    console.error("Failed to get Cloudflare DB client:", error);
    throw error;
  }
}
