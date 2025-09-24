// Cloudflare Pages Function pour les créneaux horaires
export async function onRequest(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const date = url.searchParams.get('date');

    if (!date) {
      return new Response(
        JSON.stringify({ error: "Date parameter is required" }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          }
        }
      );
    }

    // Données temporaires des créneaux
    const slotsData = [
      { id: 1, date: date, time: '11:30', isAvailable: true },
      { id: 2, date: date, time: '12:00', isAvailable: true },
      { id: 3, date: date, time: '12:30', isAvailable: true },
      { id: 4, date: date, time: '18:30', isAvailable: true },
      { id: 5, date: date, time: '19:00', isAvailable: true },
      { id: 6, date: date, time: '19:30', isAvailable: true }
    ];

    return new Response(JSON.stringify(slotsData), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error("Error in slots function:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch slots", details: error.message }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    );
  }
}
