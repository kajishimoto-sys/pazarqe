// /robots.txt – tells Google what to index and where the sitemap is.
export async function onRequest({ request: req }) {
  const origin = new URL(req.url).origin;
  const body = `User-agent: *\nAllow: /\nDisallow: /admin.html\n\nSitemap: ${origin}/sitemap.xml\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
