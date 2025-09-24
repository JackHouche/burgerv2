// Cloudflare Pages Function pour les créneaux horaires
export async function onRequestGet(context) {
  const { request } = context;

  try {
    const url = new URL(request.url);
    const date = url.searchParams.get("date");

    if (!date) {
      return new Response(
        JSON.stringify({ error: "Date parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        },
      );
    }

    // Données temporaires des créneaux
    const slotsData = [
      { id: 1, date: date, time: "11:30", isAvailable: true },
      { id: 2, date: date, time: "12:00", isAvailable: true },
      { id: 3, date: date, time: "12:30", isAvailable: true },
      { id: 4, date: date, time: "18:30", isAvailable: true },
      { id: 5, date: date, time: "19:00", isAvailable: true },
      { id: 6, date: date, time: "19:30", isAvailable: true },
    ];

    return new Response(JSON.stringify(slotsData), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error in slots function:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch slots",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
