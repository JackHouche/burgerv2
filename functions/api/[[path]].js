// Redirection générale vers les functions spécifiques
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const path = url.pathname;

  // Redirection vers la function products
  if (path === '/api/products') {
    return fetch(url.origin + '/functions/api/products' + url.search, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
  }

  // Redirection vers la function slots
  if (path === '/api/slots') {
    return fetch(url.origin + '/functions/api/slots' + url.search, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
  }

  // Pour les autres routes API, retourner une erreur temporaire
  return new Response(
    JSON.stringify({
      error: "API route not implemented",
      path: path,
      message: "This API route needs to be converted to a Cloudflare Function"
    }),
    {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
}
