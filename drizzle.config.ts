import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    databaseId: process.env.DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  },
});
