// /sitemap.xml – lists the homepage and every public listing so Google can find them.

const SB = 'https://ttqaswutuhswrjyocbcv.supabase.co';
const KEY = 'sb_publishable_LxYBkR8o93P7tgUpu7dAMQ_bo3BCq1c'; // publishable key: safe to be public

const xml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

export async function onRequest({ request: req }) {
  const origin = new URL(req.url).origin;
  let rows = [];
  try {
    for (let offset = 0; offset < 20000; offset += 1000) {
      const r = await fetch(`${SB}/rest/v1/listings?select=id,renewed_at&order=renewed_at.desc&limit=1000&offset=${offset}`, { headers: { apikey: KEY } });
      if (!r.ok) throw new Error('db ' + r.status);
      const part = await r.json();
      rows = rows.concat(part);
      if (part.length < 1000) break;
    }
  } catch (e) {
    return new Response('Temporarily unavailable', { status: 503, headers: { 'cache-control': 'no-store', 'retry-after': '120' } });
  }
  const urls = [`<url><loc>${xml(origin + '/')}</loc><changefreq>hourly</changefreq><priority>1.0</priority></url>`]
    .concat(rows.map((r) => `<url><loc>${xml(origin + '/oglas/' + r.id)}</loc><lastmod>${xml(new Date(r.renewed_at).toISOString())}</lastmod></url>`));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
};

