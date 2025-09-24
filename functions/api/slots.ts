import { drizzle } from "drizzle-orm/d1";
import { timeSlots } from "../../lib/db/schema";
import { eq, and, gte } from "drizzle-orm";

interface Env {
  DB: D1Database;
}

declare global {
  interface CloudflareEnv extends Env {}
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const db = drizzle(env.DB);
    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return new Response(
        JSON.stringify({ error: "Date parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        },
      );
    }

    const availableSlots = await db
      .select()
      .from(timeSlots)
      .where(and(eq(timeSlots.date, date), eq(timeSlots.isAvailable, true)))
      .orderBy(timeSlots.time);

    return new Response(JSON.stringify(availableSlots), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch time slots" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      },
    );
  }
};
