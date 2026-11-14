// Builds a complete, Google-readable page for one listing: /oglas/<id>
// Runs on Netlify (Functions v2). No packages needed.

const SB = 'https://ttqaswutuhswrjyocbcv.supabase.co';
const KEY = 'sb_publishable_LxYBkR8o93P7tgUpu7dAMQ_bo3BCq1c'; // publishable key: safe to be public

const LANGS = ['mk', 'sq', 'en'];
const LI = { mk: 0, en: 1, sq: 2 };
const LOCALE = { mk: 'mk-MK', en: 'en-GB', sq: 'sq-AL' };

/* key, emoji, mk, en, sq */
const CATS = [['car','🚗','Возила','Vehicles','Automjete'],['home','🏠','Недвижности','Real estate','Patundshmëri'],['tech','📱','Електроника','Electronics','Elektronikë'],['house','🛋️','Дом и градина','Home & garden','Shtëpi dhe kopsht'],['fash','👕','Облека','Fashion','Veshje'],['job','💼','Работа','Jobs','Punë'],['serv','🔧','Услуги','Services','Shërbime'],['pet','🐕','Миленичиња','Pets','Kafshë shtëpiake'],['part','🔩','Авто делови и гуми','Auto parts & tires','Pjesë këmbimi dhe goma'],['mach','🚜','Машини и трактори','Machinery & tractors','Makineri dhe traktorë'],['appl','🧊','Бела техника','Appliances','Pajisje shtëpiake'],['kids','🧸','Играчки и бебиња','Toys & baby','Lodra dhe bebe'],['sport','⚽','Спорт и рекреација','Sports','Sport dhe rekreacion'],['build','🧱','Градежни материјали','Building materials','Materiale ndërtimi']];
const COLOR = { car: '#dbe9f7', home: '#f3e3cf', tech: '#e0e0f5', house: '#e2f0d9', fash: '#f5dde8', job: '#f0ecd0', serv: '#d9efee', pet: '#f4e2d4', part: '#e6e6e6', mach: '#e8efd2', appl: '#d8eaf0', kids: '#f7e6c9', sport: '#d6efdc', build: '#efdcd2' };
/* mk, en, sq */
const CITIES =[['Скопје','Skopje','Shkup'],['Битола','Bitola','Manastir'],['Куманово','Kumanovo','Kumanovë'],['Охрид','Ohrid','Ohër'],['Тетово','Tetovo','Tetovë'],['Прилеп','Prilep','Prilep'],['Струмица','Strumica','Strumicë'],['Велес','Veles','Veles'],['Штип','Štip','Shtip'],['Гостивар','Gostivar','Gostivar'],['Кавадарци','Kavadarci','Kavadar'],['Кочани','Kočani','Koçan'],['Кичево','Kičevo','Kërçovë'],['Струга','Struga','Strugë'],['Радовиш','Radoviš','Radovish'],['Гевгелија','Gevgelija','Gjevgjeli'],['Дебар','Debar','Dibër'],['Крива Паланка','Kriva Palanka','Kriva Pallankë'],['Свети Николе','Sveti Nikole','Sveti Nikollë'],['Неготино','Negotino','Negotinë'],['Делчево','Delčevo','Delçevë'],['Виница','Vinica','Vinicë'],['Ресен','Resen','Resnjë'],['Пробиштип','Probištip','Probishtip'],['Берово','Berovo','Berovë'],['Кратово','Kratovo','Kratovë'],['Крушево','Kruševo','Krushevë'],['Македонски Брод','Makedonski Brod','Brod'],['Демир Хисар','Demir Hisar','Demir Hisar'],['Валандово','Valandovo','Valandovë'],['Пехчево','Pehčevo','Pehçevë'],['Македонска Каменица','Makedonska Kamenica','Kamenicë'],['Богданци','Bogdanci','Bogdanci'],['Демир Капија','Demir Kapija','Demir Kapi'],['Василево','Vasilevo','Vasilevë'],['Кривогаштани','Krivogaštani','Krivogashtan'],['Вевчани','Vevčani','Vevçan'],['Лозово','Lozovo','Llozovë'],['Росоман','Rosoman','Rosoman'],['Могила','Mogila','Mogilë']];
/* key, mk, en, sq, type, options[[value, mk, en, sq]] */
const FIELDS = {
  car: [['make','Марка','Make','Marka','text'],['year','Година','Year','Viti','number'],['km','Километри','Mileage (km)','Kilometrat','number']],
  home: [['deal','Вид','Type','Lloji','sel',[['sale','Продажба','For sale','Shitje'],['rent','Кирија','For rent','Qira']]],['m2','Површина (м²)','Area (m²)','Sipërfaqja (m²)','number'],['rooms','Соби','Rooms','Dhoma','number']],
  tech: [['brand','Бренд','Brand','Brendi','text']], appl: [['brand','Бренд','Brand','Brendi','text']],
  mach: [['year','Година','Year','Viti','number']], part: [['make','За возило','For vehicle','Për automjetin','text']],
};

const TX = {
  mk: { brand: 'Пазарче', free: 'Бесплатно', call: 'Повикај', show: 'Прикажи телефон', all: 'Сите огласи', more: 'Повеќе огласи во', usedC: 'Користен', newC: 'Нов', cond: 'Состојба', share: 'Сподели', copied: 'Линкот е копиран', today: 'денес', nf: 'Огласот не е пронајден', nfp: 'Овој оглас е избришан, скриен или не постои.', err: 'Привремена грешка. Обиди се повторно за малку.', desc: 'Опис', posted: 'Објавен', tag: 'огласи од Македонија' },
  en: { brand: 'Пазарче', free: 'Free', call: 'Call', show: 'Show phone number', all: 'All listings', more: 'More listings in', usedC: 'Used', newC: 'New', cond: 'Condition', share: 'Share', copied: 'Link copied', today: 'today', nf: 'Listing not found', nfp: 'This listing was deleted, hidden or never existed.', err: 'Temporary error. Please try again in a moment.', desc: 'Description', posted: 'Posted', tag: 'classifieds in North Macedonia' },
  sq: { brand: 'Pazarçe', free: 'Falas', call: 'Telefono', show: 'Shfaq numrin e telefonit', all: 'Të gjitha njoftimet', more: 'Më shumë njoftime në', usedC: 'I përdorur', newC: 'I ri', cond: 'Gjendja', share: 'Ndaj', copied: 'Lidhja u kopjua', today: 'sot', nf: 'Njoftimi nuk u gjet', nfp: 'Ky njoftim është fshirë, fshehur ose nuk ekziston.', err: 'Gabim i përkohshëm. Provo përsëri pas pak.', desc: 'Përshkrimi', posted: 'Postuar', tag: 'njoftime nga Maqedonia e Veriut' },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const IMG_OK = /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/listing-photos\/[A-Za-z0-9/_.-]+$/;

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const jsonLd = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
const clip = (s, n) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };
const money = (n, lang, tx) => (Number(n) ? Number(n).toLocaleString(LOCALE[lang]) + ' €' : tx.free);
const thumbOf = (u) => u.replace(/\.jpg$/, '_t.jpg');

function ago(days, lang, tx) {
  if (days < 1) return tx.today;
  if (lang === 'mk') return 'пред ' + days + (days === 1 ? ' ден' : ' дена');
  if (lang === 'sq') return 'para ' + days + (days === 1 ? ' dite' : ' ditësh');
  return days + (days === 1 ? ' day ago' : ' days ago');
}

function specsOf(l, lang) {
  const out = [];
  const x = l.extra || {};
  for (const f of FIELDS[l.category] || []) {
    let v = x[f[0]];
    if (v === undefined || v === null || v === '') continue;
    if (f[4] === 'sel') { const o = f[5].find((o) => o[0] === v); v = o ? o[1 + LI[lang]] : v; }
    else if (f[0] === 'km') v = Number(v).toLocaleString('en-GB') + ' km';
    out.push([f[1 + LI[lang]], String(v)]);
  }
  return out;
}

const STYLE = `:root{--bg:#f2f5f3;--surface:#fff;--ink:#14231f;--mute:#5d6e68;--line:#d8e1dd;--brand:#0f6b5c;--brand-ink:#fff;--tag:#f2c230;--tag-ink:#2b2200}
@media (prefers-color-scheme:dark){:root{--bg:#0f1a17;--surface:#182521;--ink:#e8f1ed;--mute:#97aaa3;--line:#2a3b35;--brand:#3fb59f;--brand-ink:#08201b;--tag:#e0b127;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 "Trebuchet MS","Segoe UI",system-ui,sans-serif}
a{color:inherit}header{background:var(--brand);color:var(--brand-ink);padding:12px 14px;padding-top:calc(12px + env(safe-area-inset-top,0px))}
header a{font-weight:800;font-size:22px;text-decoration:none;letter-spacing:-.5px}
main{max-width:760px;margin:0 auto;padding:14px 14px 110px}
.crumbs{font-size:14px;color:var(--mute);margin:0 0 10px}.crumbs a{color:var(--mute)}
.card{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:16px}
.gal{position:relative;border-radius:10px;overflow:hidden;background:var(--bg);margin-bottom:12px}
.gs{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.gs::-webkit-scrollbar{display:none}
.gs img{flex:0 0 100%;width:100%;height:auto;aspect-ratio:4/3;object-fit:cover;scroll-snap-align:center;display:block}
.noimg{aspect-ratio:4/3;display:grid;place-items:center;font-size:84px;border-radius:10px;margin-bottom:12px}
.gb{position:absolute;top:50%;transform:translateY(-50%);width:40px;height:40px;border-radius:999px;border:0;background:rgba(0,0,0,.5);color:#fff;font-size:24px;cursor:pointer}.gb.l{left:8px}.gb.r{right:8px}
@media (hover:none){.gb{display:none}}
.gc{position:absolute;right:8px;bottom:8px;background:rgba(0,0,0,.62);color:#fff;font-size:12px;padding:2px 8px;border-radius:999px}
h1{margin:0 0 4px;font-size:24px;line-height:1.25;overflow-wrap:anywhere}.big{font-size:28px;font-weight:800;margin:0 0 6px}
.meta{color:var(--mute);font-size:14px}.specs{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}
.spec{background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:3px 9px;font-size:14px}.spec b{color:var(--mute);font-weight:600}
h2{font-size:16px;margin:16px 0 4px}.desc{white-space:pre-line;overflow-wrap:anywhere;margin:0}
.bar{position:fixed;left:0;right:0;bottom:0;display:flex;gap:8px;padding:10px 14px calc(10px + env(safe-area-inset-bottom,0px));background:var(--surface);border-top:1px solid var(--line)}
.btn{border:0;border-radius:10px;padding:12px 16px;min-height:48px;font:inherit;font-weight:700;background:var(--tag);color:var(--tag-ink);text-decoration:none;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
.btn.main{flex:1;font-size:17px}.btn.ghost{background:transparent;color:var(--ink);border:1.5px solid var(--line)}
.links{margin-top:16px;display:flex;flex-wrap:wrap;gap:12px}.links a{color:var(--brand)}
footer{max-width:760px;margin:0 auto;padding:0 14px 120px;color:var(--mute);font-size:13px}`;

function shell({ lang, title, desc, canonical, alternates, image, body, ld, noindex, status }) {
  const tx = TX[lang];
  const alts = alternates ? LANGS.map((l) => `<link rel="alternate" hreflang="${l === 'mk' ? 'mk' : l}" href="${esc(alternates(l))}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${esc(alternates('mk'))}">` : '';
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}${alts}
<meta property="og:site_name" content="${esc(tx.brand)}"><meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
${image ? `<meta property="og:image" content="${esc(image)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${esc(image)}">` : '<meta name="twitter:card" content="summary">'}
<meta name="theme-color" content="#0f6b5c">
<link rel="icon" href="/icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest">
${(ld || []).map((o) => `<script type="application/ld+json">${jsonLd(o)}</script>`).join('\n')}
<style>${STYLE}</style></head><body>
<header><a href="/${lang === 'mk' ? '' : '?lang=' + lang}">🛒 ${esc(tx.brand)}</a></header>
${body}
</body></html>`;
}

function html(status, text, extra = {}) {
  return new Response(text, { status, headers: { 'content-type': 'text/html; charset=utf-8', ...extra } });
}

export default async (req) => {
  const url = new URL(req.url);
  const origin = url.origin;
  let lang = url.searchParams.get('lang');
  if (!LANGS.includes(lang)) lang = 'mk';
  const tx = TX[lang];
  const id = decodeURIComponent(url.pathname.split('/').filter(Boolean)[1] || '');
  const home = origin + '/' + (lang === 'mk' ? '' : '?lang=' + lang);

  const notFound = (status, heading, msg, cache) =>
    html(status, shell({ lang, title: heading + ' – ' + tx.brand, desc: msg, noindex: true,
      body: `<main><div class="card"><h1>${esc(heading)}</h1><p>${esc(msg)}</p><div class="links"><a href="${esc(home)}">← ${esc(tx.all)}</a></div></div></main>` }),
      { 'cache-control': cache || 'public, max-age=0, must-revalidate', 'x-robots-tag': 'noindex' });

  if (!UUID.test(id)) return notFound(404, tx.nf, tx.nfp);

  let rows;
  try {
    const r = await fetch(`${SB}/rest/v1/listings?id=eq.${id}&select=*&limit=1`, { headers: { apikey: KEY } });
    if (!r.ok) throw new Error('db ' + r.status);
    rows = await r.json();
  } catch (e) {
    return notFound(503, tx.err, tx.err, 'no-store');
  }
  const l = rows && rows[0];
  if (!l) return notFound(404, tx.nf, tx.nfp);

  const cat = CATS.find((c) => c[0] === l.category) || CATS[0];
  const catName = cat[2 + (lang === 'mk' ? 0 : lang === 'en' ? 1 : 2)];
  const cityName = (CITIES[l.city] || CITIES[0])[LI[lang]];
  const price = money(l.price, lang, tx);
  const images = (Array.isArray(l.images) && l.images.length ? l.images : l.image_url ? [l.image_url] : []).filter((u) => IMG_OK.test(u)).slice(0, 6);
  const days = Math.max(0, Math.floor((Date.now() - new Date(l.renewed_at || l.created_at)) / 864e5));
  const specs = specsOf(l, lang);
  const self = (lg) => origin + '/oglas/' + id + (lg === 'mk' ? '' : '?lang=' + lg);
  const canonical = self(lang);
  const catUrl = origin + '/?cat=' + l.category + (lang === 'mk' ? '' : '&lang=' + lang);

  const title = clip(`${l.title} – ${price} – ${cityName}`, 62) + ' | ' + tx.brand;
  const desc = clip(l.description && l.description.trim() ? `${l.title}. ${l.description}` : `${l.title} – ${catName}, ${cityName}, ${price}`, 158);
  const phoneB64 = Buffer.from(String(l.phone)).toString('base64');
  const condLabel = l.cond === 'new' ? tx.newC : tx.usedC;

  const gallery = images.length
    ? `<div class="gal"><div class="gs" id="gs">${images.map((u, i) => `<img src="${esc(u)}" alt="${esc(l.title)}"${i ? ' loading="lazy"' : ' fetchpriority="high"'} width="800" height="600">`).join('')}</div>${images.length > 1 ? `<button class="gb l" id="gl" type="button" aria-label="Previous">‹</button><button class="gb r" id="gr" type="button" aria-label="Next">›</button><span class="gc" id="gc">1 / ${images.length}</span>` : ''}</div>`
    : `<div class="noimg" style="background:${COLOR[l.category] || '#e6e6e6'}">${cat[1]}</div>`;

  const body = `<main>
<p class="crumbs"><a href="${esc(home)}">${esc(tx.brand)}</a> › <a href="${esc(catUrl)}">${esc(catName)}</a></p>
<article class="card">
${gallery}
<h1>${esc(l.title)}</h1>
<p class="big">${esc(price)}</p>
<p class="meta">${esc(catName)} · ${esc(cityName)} · ${esc(ago(days, lang, tx))} · ${esc(tx.cond)}: ${esc(condLabel)}</p>
${specs.length ? `<div class="specs">${specs.map(([k, v]) => `<span class="spec"><b>${esc(k)}</b> ${esc(v)}</span>`).join('')}</div>` : ''}
${l.description ? `<h2>${esc(tx.desc)}</h2><p class="desc">${esc(l.description)}</p>` : ''}
<div class="links"><a href="${esc(catUrl)}">${esc(tx.more)} ${esc(catName)} →</a><a href="${esc(home)}">${esc(tx.all)}</a></div>
</article></main>
<div class="bar">
<button class="btn main" id="ph" type="button" data-p="${esc(phoneB64)}" data-c="${esc(tx.call)}">📞 ${esc(tx.show)}</button>
<button class="btn ghost" id="sh" type="button" data-u="${esc(canonical)}" data-t="${esc(l.title)}" data-m="${esc(tx.copied)}">${esc(tx.share)}</button>
</div>
<footer>${esc(tx.brand)} – ${esc(tx.tag)}</footer>
<script>
(function(){
var ph=document.getElementById('ph');
ph.onclick=function(){var n=atob(ph.dataset.p);var a=document.createElement('a');a.className='btn main';a.href='tel:'+n.replace(/[^0-9+]/g,'');a.textContent='📞 '+ph.dataset.c+' '+n;ph.replaceWith(a)};
var sh=document.getElementById('sh');
sh.onclick=function(){var d=sh.dataset;if(navigator.share){navigator.share({title:d.t,url:d.u}).catch(function(){});return}
if(navigator.clipboard){navigator.clipboard.writeText(d.u).then(function(){sh.textContent=d.m})}};
var s=document.getElementById('gs');if(s){var c=document.getElementById('gc');
document.getElementById('gl')&&(document.getElementById('gl').onclick=function(){s.scrollBy({left:-s.clientWidth,behavior:'smooth'})});
document.getElementById('gr')&&(document.getElementById('gr').onclick=function(){s.scrollBy({left:s.clientWidth,behavior:'smooth'})});
s.onscroll=function(){if(c)c.textContent=(Math.round(s.scrollLeft/s.clientWidth)+1)+' / '+s.children.length}}
})();
</script>`;

  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: tx.brand, item: home },
      { '@type': 'ListItem', position: 2, name: catName, item: catUrl },
      { '@type': 'ListItem', position: 3, name: l.title, item: canonical } ] },
  ];
  if (l.category !== 'job') {
    ld.push({ '@context': 'https://schema.org', '@type': 'Product', name: l.title, description: clip(l.description || l.title, 500),
      ...(images.length ? { image: images } : {}), category: catName,
      itemCondition: l.cond === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      offers: { '@type': 'Offer', price: Number(l.price) || 0, priceCurrency: 'EUR', availability: 'https://schema.org/InStock', url: canonical,
        availableAtOrFrom: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: cityName, addressCountry: 'MK' } } } });
  }

  return html(200, shell({ lang, title, desc, canonical, alternates: self, image: images[0], body, ld }), {
    'cache-control': 'public, max-age=0, must-revalidate',
    'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=3600',
  });
};

export const config = { path: '/oglas/:id' };
