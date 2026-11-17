// Cloudflare Pages advanced-mode worker: handles /oglas/<id>, /sitemap.xml, /robots.txt.
// Everything else is served from the normal static files.

const listingPage = (() => {
// Builds a complete, Google-readable page for one listing: /oglas/<id>
// Runs on Netlify (Functions v2). No packages needed.

const SB = 'https://ttqaswutuhswrjyocbcv.supabase.co';
const KEY = 'sb_publishable_LxYBkR8o93P7tgUpu7dAMQ_bo3BCq1c'; // publishable key: safe to be public

const LANGS = ['mk', 'sq', 'en'];
const LI = { mk: 0, en: 1, sq: 2 };
const LOCALE = { mk: 'mk-MK', en: 'en-GB', sq: 'sq-AL' };

/* key, emoji, mk, en, sq */
const CATS = [['car','🚗','Возила','Vehicles','Automjete'],['home','🏠','Недвижности','Real estate','Patundshmëri'],['tech','📱','Електроника','Electronics','Elektronikë'],['house','🛋️','Дом и градина','Home & garden','Shtëpi dhe kopsht'],['fash','👕','Облека','Fashion','Veshje'],['job','💼','Работа','Jobs','Punë'],['serv','🔧','Услуги','Services','Shërbime'],['pet','🐕','Миленичиња','Pets','Kafshë shtëpiake'],['part','🔩','Авто делови и гуми','Auto parts & tires','Pjesë këmbimi dhe goma'],['mach','🚜','Машини и трактори','Machinery & tractors','Makineri dhe traktorë'],['appl','🧊','Бела техника','Appliances','Pajisje shtëpiake'],['kids','🧸','Играчки и бебиња','Toys & baby','Lodra dhe bebe'],['sport','⚽','Спорт и рекреација','Sports','Sport dhe rekreacion'],['build','🧱','Градежни материјали','Building materials','Materiale ndërtimi'],['other','📦','Останато','Other','Të tjera']];
const COLOR = { car: '#dbe9f7', home: '#f3e3cf', tech: '#e0e0f5', house: '#e2f0d9', fash: '#f5dde8', job: '#f0ecd0', serv: '#d9efee', pet: '#f4e2d4', part: '#e6e6e6', mach: '#e8efd2', appl: '#d8eaf0', kids: '#f7e6c9', sport: '#d6efdc', build: '#efdcd2', other: '#e9e4f3' };
/* mk, en, sq */
const CITIES =[['Скопје','Skopje','Shkup'],['Битола','Bitola','Manastir'],['Куманово','Kumanovo','Kumanovë'],['Охрид','Ohrid','Ohër'],['Тетово','Tetovo','Tetovë'],['Прилеп','Prilep','Prilep'],['Струмица','Strumica','Strumicë'],['Велес','Veles','Veles'],['Штип','Štip','Shtip'],['Гостивар','Gostivar','Gostivar'],['Кавадарци','Kavadarci','Kavadar'],['Кочани','Kočani','Koçan'],['Кичево','Kičevo','Kërçovë'],['Струга','Struga','Strugë'],['Радовиш','Radoviš','Radovish'],['Гевгелија','Gevgelija','Gjevgjeli'],['Дебар','Debar','Dibër'],['Крива Паланка','Kriva Palanka','Kriva Pallankë'],['Свети Николе','Sveti Nikole','Sveti Nikollë'],['Неготино','Negotino','Negotinë'],['Делчево','Delčevo','Delçevë'],['Виница','Vinica','Vinicë'],['Ресен','Resen','Resnjë'],['Пробиштип','Probištip','Probishtip'],['Берово','Berovo','Berovë'],['Кратово','Kratovo','Kratovë'],['Крушево','Kruševo','Krushevë'],['Македонски Брод','Makedonski Brod','Brod'],['Демир Хисар','Demir Hisar','Demir Hisar'],['Валандово','Valandovo','Valandovë'],['Пехчево','Pehčevo','Pehçevë'],['Македонска Каменица','Makedonska Kamenica','Kamenicë'],['Богданци','Bogdanci','Bogdanci'],['Демир Капија','Demir Kapija','Demir Kapi'],['Василево','Vasilevo','Vasilevë'],['Кривогаштани','Krivogaštani','Krivogashtan'],['Вевчани','Vevčani','Vevçan'],['Лозово','Lozovo','Llozovë'],['Росоман','Rosoman','Rosoman'],['Могила','Mogila','Mogilë']];
const OPT_YN=[['yes','Да','Yes','Po'],['no','Не','No','Jo']];
/* key, mk, en, sq, type, options[[value, mk, en, sq]] */
const FIELDS={
car:[['make','Марка','Make','Marka','text'],['model','Модел','Model','Modeli','text'],['year','Година','Year','Viti','number'],['km','Километри','Mileage (km)','Kilometrat','number'],['fuel','Гориво','Fuel','Karburanti','sel',[['petrol','Бензин','Petrol','Benzinë'],['diesel','Дизел','Diesel','Naftë'],['lpg','Бензин/Плин','Petrol/LPG','Benzinë/Gaz'],['hybrid','Хибрид','Hybrid','Hibrid'],['electric','Електрично','Electric','Elektrik']]],['gear','Менувач','Gearbox','Marshi','sel',[['man','Мануелен','Manual','Manual'],['auto','Автоматски','Automatic','Automatik']]]],
home:[['m2','Површина (м²)','Area (m²)','Sipërfaqja (m²)','number'],['rooms','Соби','Rooms','Dhoma','number'],['floor','Кат','Floor','Kati','number'],['year','Година на градба','Year built','Viti i ndërtimit','number'],['heating','Греење','Heating','Ngrohja','sel',[['central','Централно','Central','Qendrore'],['ac','Клима','A/C','Klimë'],['elec','Струја','Electric','Elektrike'],['wood','Дрва/Пелети','Wood/Pellets','Dru/Pelet'],['none','Нема','None','Pa ngrohje']]],['furn','Мебелирано','Furnished','E mobiluar','sel',[['yes','Да','Yes','Po'],['part','Делумно','Partly','Pjesërisht'],['no','Не','No','Jo']]],['parking','Паркинг','Parking','Parkim','sel',OPT_YN]],
tech:[['brand','Бренд','Brand','Brendi','text'],['model','Модел','Model','Modeli','text']],
appl:[['brand','Бренд','Brand','Brendi','text'],['model','Модел','Model','Modeli','text']],
house:[['brand','Производител','Maker','Prodhuesi','text']],
fash:[['brand','Бренд','Brand','Brendi','text'],['size','Големина','Size','Madhësia','text']],
job:[['company','Компанија','Company','Kompania','text'],['salary','Плата','Salary','Paga','text'],['hours','Работно време','Hours','Orari','sel',[['full','Полно','Full-time','Kohë e plotë'],['part','Скратено','Part-time','Kohë e pjesshme'],['remote','Од дома','Remote','Në distancë'],['shift','Смени','Shifts','Turne']]]],
serv:[['exp','Искуство (год.)','Experience (yrs)','Përvoja (vite)','number']],
pet:[['breed','Раса','Breed','Raca','text'],['age','Возраст','Age','Mosha','text']],
kids:[['age','Возраст','Age group','Mosha','text']],
sport:[['brand','Бренд','Brand','Brendi','text']],
mach:[['brand','Бренд','Brand','Brendi','text'],['year','Година','Year','Viti','number']],
part:[['make','За возило','For vehicle','Për automjetin','text'],['model','Модел','Model','Modeli','text']]};

/* subcategories: cat -> [key, mk, en, sq] */
const SUBS={
car:[['cars','Патнички возила','Cars','Makina'],['suv','Џипови / SUV','SUVs','SUV / Xhip'],['moto','Мотори и скутери','Motorcycles & scooters','Motorra dhe skuterë'],['truck','Комбиња и камиони','Vans & trucks','Furgonë dhe kamionë'],['other','Друго','Other','Tjetër']],
home:[['apt','Станови','Apartments','Apartamente'],['house','Куќи','Houses','Shtëpi'],['land','Земјиште','Land','Tokë'],['biz','Деловен простор','Commercial','Hapësira biznesi'],['garage','Гаражи','Garages','Garazhe'],['room','Соби / студија','Rooms / studios','Dhoma / studio']],
tech:[['phone','Телефони','Phones','Telefona'],['comp','Компјутери и лаптопи','Computers & laptops','Kompjuterë dhe laptopë'],['tv','ТВ и аудио','TV & audio','TV dhe audio'],['game','Игри и конзоли','Games & consoles','Lojëra dhe konsola'],['cam','Фотоапарати','Cameras','Kamera'],['acc','Додатоци','Accessories','Aksesorë']],
house:[['furn','Мебел','Furniture','Mobilje'],['deco','Декорација','Decor','Dekor'],['kitchen','Кујна','Kitchen','Kuzhinë'],['garden','Градина','Garden','Kopsht']],
fash:[['women','Женска облека','Women','Femra'],['men','Машка облека','Men','Meshkuj'],['shoes','Обувки','Shoes','Këpucë'],['bags','Чанти и додатоци','Bags & accessories','Çanta dhe aksesorë']],
job:[['it','ИТ','IT','IT'],['sales','Продажба','Sales','Shitje'],['constr','Градежништво','Construction','Ndërtim'],['hosp','Угостителство','Hospitality','Gastronomi'],['drive','Возачи','Drivers','Shoferë'],['office','Канцеларија','Office','Zyrë'],['other','Друго','Other','Tjetër']],
serv:[['repair','Поправки','Repairs','Riparime'],['move','Транспорт и селидби','Transport & moving','Transport dhe zhvendosje'],['clean','Чистење','Cleaning','Pastrim'],['edu','Часови и обука','Lessons & training','Mësime'],['beauty','Убавина','Beauty','Bukuri'],['other','Друго','Other','Tjetër']],
pet:[['dog','Кучиња','Dogs','Qen'],['cat','Мачки','Cats','Mace'],['bird','Птици','Birds','Zogj'],['other','Друго','Other','Tjetër']],
part:[['parts','Делови','Parts','Pjesë'],['tires','Гуми и felni','Tires & rims','Goma dhe disqe'],['acc','Додатоци','Accessories','Aksesorë']],
mach:[['agri','Земјоделска','Agricultural','Bujqësore'],['constr','Градежна','Construction','Ndërtimi'],['ind','Индустриска','Industrial','Industriale']],
appl:[['white','Бела техника','Large appliances','Teknikë e bardhë'],['small','Мали апарати','Small appliances','Aparate të vogla'],['heat','Греење и клими','Heating & AC','Ngrohje dhe klima']],
kids:[['toys','Играчки','Toys','Lodra'],['stroll','Колички и седишта','Strollers & seats','Karroca dhe sedilje'],['clothes','Детска облека','Kids clothing','Veshje fëmijësh'],['furn','Детски мебел','Kids furniture','Mobilje fëmijësh']],
sport:[['fit','Фитнес','Fitness','Fitnes'],['bike','Велосипеди','Bikes','Biçikleta'],['camp','Кампување','Camping','Kampim'],['other','Друго','Other','Tjetër']],
build:[['mat','Материјали','Materials','Materiale'],['tools','Алат','Tools','Vegla'],['doors','Врати и прозорци','Doors & windows','Dyer dhe dritare']]};
const KC={def:['sale','wanted'],home:['sale','rent','wanted','wantrent'],car:['sale','rent','wanted'],job:['hiring','jobwanted']};
const KINDS=['sale','rent','wanted','wantrent','hiring','jobwanted'],RATE=61.5;

const TX = {
  mk: { brand: 'Пазарче', sellerMore: 'Други огласи од овој продавач', k_sale:'Се продава',k_rent:'Се изнајмува',k_wanted:'Се купува',k_wantrent:'Се бара за изнајмување',k_hiring:'Вработуваме',k_jobwanted:'Бара работа',ptFree:'Бесплатно',ptSwap:'Замена',ptNeg:'Договорно',ptNegS:'договорно',curS:'ден',posted:'Објавено',views:'прегледи',similar:'Слични огласи',videoT:'Видео', free: 'Бесплатно', call: 'Повикај', show: 'Прикажи телефон', all: 'Сите огласи', more: 'Повеќе огласи во', usedC: 'Користен', newC: 'Нов', cond: 'Состојба', share: 'Сподели', copied: 'Линкот е копиран', today: 'денес', nf: 'Огласот не е пронајден', nfp: 'Овој оглас е избришан, скриен или не постои.', err: 'Привремена грешка. Обиди се повторно за малку.', desc: 'Опис', posted: 'Објавен', tag: 'огласи од Македонија', edit: 'Уреди', renew: 'Обнови', del: 'Избриши', confirmDel: 'Да го избришам огласот?', report: 'Пријави', save: 'Зачувај', saved: 'Зачувано', renewed: 'Огласот е обновен', fail: 'Нешто тргна наопаку. Обиди се повторно.', okPosted: 'Огласот е објавен', okSaved: 'Огласот е ажуриран' },
  en: { brand: 'Пазарче', sellerMore: 'More from this seller', k_sale:'For sale',k_rent:'For rent',k_wanted:'Wanted to buy',k_wantrent:'Wanted to rent',k_hiring:'Hiring',k_jobwanted:'Looking for work',ptFree:'Free',ptSwap:'Swap',ptNeg:'Negotiable',ptNegS:'negotiable',curS:'MKD',posted:'Posted',views:'views',similar:'Similar listings',videoT:'Video', free: 'Free', call: 'Call', show: 'Show phone number', all: 'All listings', more: 'More listings in', usedC: 'Used', newC: 'New', cond: 'Condition', share: 'Share', copied: 'Link copied', today: 'today', nf: 'Listing not found', nfp: 'This listing was deleted, hidden or never existed.', err: 'Temporary error. Please try again in a moment.', desc: 'Description', posted: 'Posted', tag: 'classifieds in North Macedonia', edit: 'Edit', renew: 'Renew', del: 'Delete', confirmDel: 'Delete this listing?', report: 'Report', save: 'Save', saved: 'Saved', renewed: 'Listing renewed', fail: 'Something went wrong. Please try again.', okPosted: 'Listing published', okSaved: 'Listing updated' },
  sq: { brand: 'Pazarçe', sellerMore: 'Më shumë nga ky shitës', k_sale:'Në shitje',k_rent:'Me qira',k_wanted:'Kërkohet për blerje',k_wantrent:'Kërkohet me qira',k_hiring:'Punësojmë',k_jobwanted:'Kërkoj punë',ptFree:'Falas',ptSwap:'Këmbim',ptNeg:'Me marrëveshje',ptNegS:'me marrëveshje',curS:'MKD',posted:'Postuar',views:'shikime',similar:'Njoftime të ngjashme',videoT:'Video', free: 'Falas', call: 'Telefono', show: 'Shfaq numrin e telefonit', all: 'Të gjitha njoftimet', more: 'Më shumë njoftime në', usedC: 'I përdorur', newC: 'I ri', cond: 'Gjendja', share: 'Ndaj', copied: 'Lidhja u kopjua', today: 'sot', nf: 'Njoftimi nuk u gjet', nfp: 'Ky njoftim është fshirë, fshehur ose nuk ekziston.', err: 'Gabim i përkohshëm. Provo përsëri pas pak.', desc: 'Përshkrimi', posted: 'Postuar', tag: 'njoftime nga Maqedonia e Veriut', edit: 'Ndrysho', renew: 'Rinovo', del: 'Fshi', confirmDel: 'Ta fshij njoftimin?', report: 'Raporto', save: 'Ruaj', saved: 'E ruajtur', renewed: 'Njoftimi u rinovua', fail: 'Diçka shkoi keq. Provo përsëri.', okPosted: 'Njoftimi u publikua', okSaved: 'Njoftimi u përditësua' },
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const IMG_OK = /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/listing-photos\/[A-Za-z0-9/_.-]+$/;

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const jsonLd = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
const clip = (s, n) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s; };
const money = (l, lang, tx) => {
  const pt = l.price_type || 'fixed', n = Number(l.price) || 0;
  if (pt === 'free') return tx.ptFree;
  if (pt === 'swap') return tx.ptSwap;
  if (pt === 'neg' && !n) return tx.ptNeg;
  if (!n) return tx.free;
  const s = n.toLocaleString(LOCALE[lang]) + (l.currency === 'MKD' ? ' ' + tx.curS : ' €');
  return pt === 'neg' ? s + ' · ' + tx.ptNegS : s;
};
const kindOf = (l) => ((l.kind || 'sale') === 'sale' && l.extra && l.extra.deal === 'rent') ? 'rent' : (l.kind || 'sale');
const YT = /^[A-Za-z0-9_-]{11}$/;
const waNum = (p) => { let d = String(p).replace(/[^0-9+]/g, ''); if (d[0] === '+') return d.slice(1); d = d.replace(/^00/, ''); return d[0] === '0' ? '389' + d.slice(1) : d; };
const thumbOf = (u) => u.replace(/\.jpg$/, '_t.jpg');

const TZ = 'Europe/Skopje';
const MONTHS = {
  mk: ['јануари','февруари','март','април','мај','јуни','јули','август','септември','октомври','ноември','декември'],
  sq: ['janar','shkurt','mars','prill','maj','qershor','korrik','gusht','shtator','tetor','nëntor','dhjetor'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
};
function ymd(x) {
  const d = new Date(x);
  if (isNaN(d)) return null;
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(d).map((q) => [q.type, q.value]));
  return { y: +p.year, m: +p.month, d: +p.day };
}
function dayAge(x) {
  const a = ymd(Date.now()), b = ymd(x);
  if (!a || !b) return 0;
  return Math.max(0, Math.round((Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d)) / 864e5));
}
function fmtDate(x, lang) {
  const b = ymd(x);
  if (!b) return '';
  return b.d + ' ' + (MONTHS[lang] || MONTHS.en)[b.m - 1] + ' ' + b.y;
}

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

const STYLE = `.thumbs{display:flex;gap:6px;overflow-x:auto;margin:-4px 0 12px;scrollbar-width:thin}.thumbs button{flex:none;width:64px;height:48px;padding:0;border:2px solid transparent;border-radius:6px;overflow:hidden;background:var(--bg);cursor:pointer}.thumbs button[aria-current=true]{border-color:var(--brand)}.thumbs img{width:100%;height:100%;object-fit:cover;display:block}
.vid{position:relative;aspect-ratio:16/9;margin:12px 0;border-radius:10px;overflow:hidden;background:#000}.vid iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
.chat{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.btn.wa{background:#25d366;color:#08210f}.btn.vb{background:#7360f2;color:#fff}
.sim{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:8px}.sim a{background:var(--surface);border:1px solid var(--line);border-radius:10px;overflow:hidden;text-decoration:none;display:block}.sim img,.sim .ph{width:100%;aspect-ratio:4/3;object-fit:cover;display:grid;place-items:center;font-size:40px;background:var(--bg)}.sim div{padding:8px 10px;font-size:14px}.sim b{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.sim span{color:var(--brand);font-weight:800}
:root{--bg:#f2f5f3;--surface:#fff;--ink:#14231f;--mute:#5d6e68;--line:#d8e1dd;--brand:#0f6b5c;--brand-ink:#fff;--tag:#f2c230;--tag-ink:#2b2200}
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
footer{max-width:760px;margin:0 auto;padding:0 14px 120px;color:var(--mute);font-size:13px;line-height:1.9}footer a{color:var(--mute)}
.notice{background:var(--brand);color:var(--brand-ink);border-radius:10px;padding:10px 14px;margin:0 0 12px;font-weight:700}
.tools{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.tools:empty{display:none}
.btn.sm{min-height:42px;padding:8px 14px;font-size:15px}.btn.sm.ghost{border:1.5px solid var(--line)}.btn.bad{background:#c0392b;color:#fff}
.toast{position:fixed;left:50%;bottom:calc(90px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:10px 16px;border-radius:8px;z-index:20;max-width:92vw;text-align:center}
/* ───── theme: bazaar (cream paper, pine, tangerine) ───── */
:root{--bg:#fdf8ee;--surface:#fff;--ink:#1c2a33;--mute:#5f6c73;--line:#e9e1d3;--brand:#0f3b30;--brand-ink:#f7f1e3;--tag:#e85d0a;--tag-ink:#fff;--pine:#0f3b30;--pine-ink:#f7f1e3;--hd:#0f3b30;--sel:#0f3b30;--sel-ink:#f7f1e3;--price:#1d6b57;--accent:#fde6c8;--fd:"Unbounded","Trebuchet MS","Segoe UI",system-ui,sans-serif;--awn:repeating-linear-gradient(90deg,#ee6a12 0 28px,var(--bg) 28px 56px);--sh:0 1px 2px rgba(28,42,51,.06),0 8px 22px -12px rgba(28,42,51,.22);color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e2321;--surface:#16302e;--ink:#f7f1e3;--mute:#a7b8b3;--line:#2b4744;--brand:#5fcdb0;--brand-ink:#082019;--tag:#f0731f;--tag-ink:#1b0e03;--pine:#0a1c1a;--pine-ink:#f7f1e3;--hd:#f7f1e3;--sel:#2f8f78;--sel-ink:#fff;--price:#7fd9bf;--accent:#3a2f1c;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0e2321;--surface:#16302e;--ink:#f7f1e3;--mute:#a7b8b3;--line:#2b4744;--brand:#5fcdb0;--brand-ink:#082019;--tag:#f0731f;--tag-ink:#1b0e03;--pine:#0a1c1a;--pine-ink:#f7f1e3;--hd:#f7f1e3;--sel:#2f8f78;--sel-ink:#fff;--price:#7fd9bf;--accent:#3a2f1c;color-scheme:dark}
body{font-family:"Onest","Trebuchet MS","Segoe UI",system-ui,sans-serif}
header{background:var(--bg);color:var(--hd);padding:0}
header .in{display:flex;align-items:center;padding:10px 14px;padding-top:calc(10px + env(safe-area-inset-top,0px))}
header::after{content:"";display:block;height:9px;background:var(--awn)}
header a{display:inline-flex;align-items:center;gap:9px;font-family:var(--fd);font-weight:700;font-size:19px;letter-spacing:-.3px;color:var(--hd);text-decoration:none}
.lgb{position:relative;width:34px;height:34px;border-radius:9px;background:var(--pine);overflow:hidden;display:grid;place-items:center;color:var(--pine-ink);font-size:14px;flex:none}
.lgb i{position:absolute;left:0;right:0;top:0;height:9px;background:repeating-linear-gradient(90deg,#ee6a12 0 8px,#fdf8ee 8px 16px)}
.lgb u{text-decoration:none;margin-top:6px}
.card{border-radius:16px;box-shadow:var(--sh)}
.btn{background:linear-gradient(135deg,var(--tag),color-mix(in srgb,var(--tag) 72%,#ffb347));color:var(--tag-ink);border-radius:10px}
.btn.wa{background:#25d366;color:#08210f}.btn.vb{background:#7360f2;color:#fff}
.btn.ghost,.btn.sm.ghost{background:var(--surface);color:var(--ink);border:1.5px solid var(--line)}
.btn.bad{background:#c0392b;color:#fff}
h1,.big{font-family:var(--fd)}.big{color:var(--price)}
.spec{border-radius:999px;padding:4px 12px}
.links a{color:var(--tag)}
.sim span{color:var(--price);font-family:var(--fd)}
.notice{background:var(--pine);color:var(--pine-ink)}
footer{max-width:none;margin:36px 0 0;background:var(--pine);color:var(--pine-ink);position:relative;padding:36px 14px 120px}
footer::before{content:"";position:absolute;left:0;right:0;top:0;height:10px;background:repeating-linear-gradient(90deg,#ee6a12 0 28px,var(--bg) 28px 56px)}
footer a{color:var(--pine-ink);opacity:.85}
.bar{background:var(--surface)}
@media (max-width:640px){header a{font-size:17px}h1{font-size:21px}}

/* ───── listing page v2: photo-first, two columns on desktop ───── */
main.wrap{max-width:760px}
.lay{display:block}
.colm{padding:12px}
.gal{background:#0f1514;border-radius:14px;margin-bottom:10px}
.gs img{aspect-ratio:4/3;object-fit:contain;background:#0f1514}
.thumbs{gap:8px;margin:0 0 14px}.thumbs button{width:72px;height:54px;border-radius:8px}
.colm h1{font-family:var(--fd);font-size:21px;font-weight:700;line-height:1.25;margin:4px 0 6px}
.big{font-family:var(--fd);color:var(--price);font-size:26px;font-weight:800}
.sprice{display:none}
.spec{background:var(--accent);border-color:transparent;border-radius:999px;padding:5px 12px}
.colm h2{font-family:var(--fd);font-size:15px;margin:18px 0 8px;padding-top:14px;border-top:1px solid var(--line)}
.sidec{margin-top:12px}
.crumbs{display:flex;flex-wrap:wrap;gap:4px 6px;align-items:center}
@media (min-width:900px){
  main.wrap{max-width:1160px;padding:22px 24px 40px}
  .lay{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:22px;align-items:start}
  .colm{padding:16px}
  .gs img{aspect-ratio:auto;height:min(560px,62vh)}
  .gal{margin-bottom:12px}
  .colm h1{font-size:28px;margin-top:8px}
  .big.mob{display:none}
  .sprice{display:block;font-family:var(--fd);color:var(--price);font-size:30px;font-weight:800;line-height:1.2;margin:0 0 16px}
  .cols{position:sticky;top:18px}
  .sidec{margin-top:0;padding:20px}
  .bar{position:static;display:grid;gap:10px;padding:0;background:none;border:0;margin:0 0 14px}
  .bar .btn{width:100%;min-height:54px}
  .btn.main{font-size:18px}
  .chat{margin:0 0 14px}.chat .btn{flex:1}
  .links{flex-direction:column;gap:8px;margin-top:6px;padding-top:14px;border-top:1px solid var(--line)}
  .sim{grid-template-columns:repeat(4,minmax(0,1fr))}
  footer{max-width:1160px;padding:0 24px 40px}
  .toast{bottom:30px}
}
`;

const FOOT = {
  mk: [['help', 'Помош'], ['safety', 'Безбедно тргување'], ['privacy', 'Политика за приватност'], ['terms', 'Услови за користење'], ['contact', 'Контакт']],
  sq: [['help', 'Ndihma'], ['safety', 'Tregtim i sigurt'], ['privacy', 'Politika e privatësisë'], ['terms', 'Kushtet e përdorimit'], ['contact', 'Kontakt']],
  en: [['help', 'Help'], ['safety', 'Trade safely'], ['privacy', 'Privacy policy'], ['terms', 'Terms of use'], ['contact', 'Contact']],
};
const footLinks = (lang) => FOOT[lang].map(([k, t]) => `<a href="/${k}.html${lang === 'mk' ? '' : '?lang=' + lang}">${esc(t)}</a>`).join(' · ');

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
<meta name="theme-color" content="#fdf8ee">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@500;700;800&display=swap">
<link rel="icon" href="/icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/manifest.webmanifest">
${(ld || []).map((o) => `<script type="application/ld+json">${jsonLd(o)}</script>`).join('\n')}
<style>${STYLE}</style></head><body>
<header><div class="in"><a href="/${lang === 'mk' ? '' : '?lang=' + lang}"><span class="lgb"><i></i><u>${esc(tx.brand.charAt(0))}</u></span><span>${esc(tx.brand)}</span></a></div></header>
${body}
</body></html>`;
}

function html(status, text, extra = {}) {
  return new Response(text, { status, headers: { 'content-type': 'text/html; charset=utf-8', ...extra } });
}

async function onRequest({ request: req }) {
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

  let sims = [];
  try {
    const r2 = await fetch(`${SB}/rest/v1/listings?category=eq.${encodeURIComponent(l.category)}&id=neq.${id}&hidden=eq.false&report_count=lt.3&select=*&order=renewed_at.desc&limit=6`, { headers: { apikey: KEY } });
    if (r2.ok) sims = (await r2.json()).filter((x) => x && UUID.test(x.id));
  } catch (e) { /* similar ads are optional */ }

  const cat = CATS.find((c) => c[0] === l.category) || CATS[0];
  const catName = cat[2 + (lang === 'mk' ? 0 : lang === 'en' ? 1 : 2)];
  const cityName = (CITIES[l.city] || CITIES[0])[LI[lang]];
  const price = money(l, lang, tx);
  const images = (Array.isArray(l.images) && l.images.length ? l.images : l.image_url ? [l.image_url] : []).filter((u) => IMG_OK.test(u)).slice(0, 12);
  const days = dayAge(l.renewed_at || l.created_at);
  const specs = specsOf(l, lang);
  const kind = kindOf(l);
  const kindName = tx['k_' + kind] || '';
  const subDef = (SUBS[l.category] || []).find((x) => x[0] === l.sub);
  const subName = subDef ? subDef[1 + LI[lang]] : '';
  const postedOn = fmtDate(l.created_at || l.renewed_at, lang);
  const views = Number(l.views) || 0;
  const vid = YT.test(l.video || '') ? l.video : '';
  const self = (lg) => origin + '/oglas/' + id + (lg === 'mk' ? '' : '?lang=' + lg);
  const canonical = self(lang);
  const catUrl = origin + '/?cat=' + l.category + (lang === 'mk' ? '' : '&lang=' + lang);
  const q2 = lang === 'mk' ? '' : '?lang=' + lang;
  const simPrice = (x) => money(x, lang, tx);
  const simHtml = sims.length ? `<h2>${esc(tx.similar)}</h2><div class="sim">${sims.map((x) => {
    const im = (Array.isArray(x.images) && x.images.length ? x.images : x.image_url ? [x.image_url] : []).filter((u) => IMG_OK.test(u))[0];
    return `<a href="/oglas/${esc(x.id)}${q2}">${im ? `<img src="${esc(thumbOf(im))}" data-f="${esc(im)}" onerror="this.onerror=null;this.src=this.dataset.f" alt="" loading="lazy">` : `<div class="ph" style="background:${COLOR[x.category] || '#e6e6e6'}">${cat[1]}</div>`}<div><b>${esc(x.title)}</b><span>${esc(simPrice(x))}</span></div></a>`;
  }).join('')}</div>` : '';

  const title = clip(`${l.title} – ${price} – ${cityName}`, 62) + ' | ' + tx.brand;
  const desc = clip(l.description && l.description.trim() ? `${l.title}. ${l.description}` : `${l.title} – ${catName}, ${cityName}, ${price}`, 158);
  const phoneB64 = btoa(unescape(encodeURIComponent(String(l.phone))));
  const condLabel = l.cond === 'new' ? tx.newC : tx.usedC;

  const gallery = images.length
    ? `<div class="gal"><div class="gs" id="gs">${images.map((u, i) => `<img src="${esc(u)}" alt="${esc(l.title)}"${i ? ' loading="lazy"' : ' fetchpriority="high"'} width="800" height="600">`).join('')}</div>${images.length > 1 ? `<button class="gb l" id="gl" type="button" aria-label="Previous">‹</button><button class="gb r" id="gr" type="button" aria-label="Next">›</button><span class="gc" id="gc">1 / ${images.length}</span>` : ''}</div>`
    : `<div class="noimg" style="background:${COLOR[l.category] || '#e6e6e6'}">${cat[1]}</div>`;

  const notice = url.searchParams.get('posted') ? tx.okPosted : url.searchParams.get('saved') ? tx.okSaved : '';
  const pageData = JSON.stringify({ url: SB, key: KEY, edit: tx.edit, renew: tx.renew, del: tx.del, confirmDel: tx.confirmDel, report: tx.report, save: tx.save, saved: tx.saved, renewed: tx.renewed, fail: tx.fail });
  const body = `<main class="wrap">
${notice ? `<p class="notice" role="status">✔ ${esc(notice)}</p>` : ''}<p class="crumbs"><a href="${esc(home)}">${esc(tx.brand)}</a> › <a href="${esc(catUrl)}">${esc(catName)}</a>${subName ? ` › <a href="${esc(catUrl + '&sub=' + l.sub)}">${esc(subName)}</a>` : ''}</p>
<article class="lay" id="art" data-id="${esc(id)}" data-owner="${esc(l.owner)}" data-lang="${esc(lang)}" data-imgs="${esc(JSON.stringify(images))}" data-x="${esc(pageData)}">
<div class="colm card">
${gallery}
${images.length > 1 ? `<div class="thumbs" id="th">${images.map((u, i) => `<button type="button" data-i="${i}" aria-label="${i + 1}"${i === 0 ? ' aria-current="true"' : ''}><img src="${esc(thumbOf(u))}" data-f="${esc(u)}" onerror="this.onerror=null;this.src=this.dataset.f" alt="" loading="lazy"></button>`).join('')}</div>` : ''}
<h1>${esc(l.title)}</h1>
<p class="big mob">${esc(price)}</p>
<p class="meta">${esc(catName)}${subName ? ' · ' + esc(subName) : ''} · ${esc(cityName)} · ${esc(ago(days, lang, tx))}</p>
<p class="meta">${esc(tx.posted)} ${esc(postedOn)} · 👁 <span id="vw">${views}</span> ${esc(views === 1 ? ({ mk: 'преглед', sq: 'shikim', en: 'view' }[lang] || tx.views) : tx.views)}</p>
<div class="specs"><span class="spec"><b>${esc(kindName)}</b></span>${['new', 'used'].includes(l.cond) && l.category !== 'job' && l.category !== 'serv' ? `<span class="spec"><b>${esc(tx.cond)}</b> ${esc(condLabel)}</span>` : ''}${specs.map(([k, v]) => `<span class="spec"><b>${esc(k)}</b> ${esc(v)}</span>`).join('')}</div>
${false ? `<div class="specs">${specs.map(([k, v]) => `<span class="spec"><b>${esc(k)}</b> ${esc(v)}</span>`).join('')}</div>` : ''}
${l.description ? `<h2>${esc(tx.desc)}</h2><p class="desc">${esc(l.description)}</p>` : ''}
${vid ? `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${esc(vid)}" title="${esc(tx.videoT)}" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>` : ''}
</div>
<aside class="cols"><div class="card sidec">
<p class="sprice">${esc(price)}</p>
<div class="bar">
<button class="btn main" id="ph" type="button" data-p="${esc(phoneB64)}" data-c="${esc(tx.call)}">📞 ${esc(tx.show)}</button>
<button class="btn ghost" id="sh" type="button" data-u="${esc(canonical)}" data-t="${esc(l.title)}" data-m="${esc(tx.copied)}">${esc(tx.share)}</button>
</div>
${l.wa || l.vb ? `<div class="chat" id="chat" data-p="${esc(phoneB64)}">${l.wa ? '<button class="btn wa" type="button" data-k="wa">WhatsApp</button>' : ''}${l.vb ? '<button class="btn vb" type="button" data-k="vb">Viber</button>' : ''}</div>` : ''}
<div class="links"><a href="${esc(origin + '/?seller=' + l.owner + (lang === 'mk' ? '' : '&lang=' + lang))}">${esc(tx.sellerMore)} →</a><a href="${esc(catUrl)}">${esc(tx.more)} ${esc(catName)} →</a><a href="${esc(home)}">${esc(tx.all)}</a></div>
<div class="tools" id="tools"></div>
</div></aside>
</article>
${simHtml}</main>

<footer>${esc(tx.brand)} – ${esc(tx.tag)}<br>${footLinks(lang)}</footer>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer></script>
<script>
(function(){
try{var rk='rv',ra=JSON.parse(localStorage.getItem(rk)||'[]').filter(function(x){return x!==document.getElementById('art').dataset.id});ra.unshift(document.getElementById('art').dataset.id);localStorage.setItem(rk,JSON.stringify(ra.slice(0,12)))}catch(e){}
var ph=document.getElementById('ph');
ph.onclick=function(){var n=atob(ph.dataset.p);var a=document.createElement('a');a.className='btn main';a.href='tel:'+n.replace(/[^0-9+]/g,'');a.textContent='📞 '+ph.dataset.c+' '+n;ph.replaceWith(a)};
var sh=document.getElementById('sh');
sh.onclick=function(){var d=sh.dataset;if(navigator.share){navigator.share({title:d.t,url:d.u}).catch(function(){});return}
if(navigator.clipboard){navigator.clipboard.writeText(d.u).then(function(){sh.textContent=d.m})}};
var s=document.getElementById('gs');if(s){var c=document.getElementById('gc');
document.getElementById('gl')&&(document.getElementById('gl').onclick=function(){s.scrollBy({left:-s.clientWidth,behavior:'smooth'})});
document.getElementById('gr')&&(document.getElementById('gr').onclick=function(){s.scrollBy({left:s.clientWidth,behavior:'smooth'})});
var th=document.getElementById('th');
function mark(i){if(th)[].forEach.call(th.children,function(b,k){b.setAttribute('aria-current',k===i)})}
if(th)th.onclick=function(e){var b=e.target.closest('button');if(b)s.scrollTo({left:s.clientWidth*(+b.dataset.i),behavior:'smooth'})};
s.onscroll=function(){var i=Math.round(s.scrollLeft/s.clientWidth);if(c)c.textContent=(i+1)+' / '+s.children.length;mark(i)}}
var ch=document.getElementById('chat');
function num(p){var d=String(p).replace(/[^0-9+]/g,'');if(d[0]==='+')return d.slice(1);d=d.replace(/^00/,'');return d[0]==='0'?'389'+d.slice(1):d}
if(ch)ch.onclick=function(e){var b=e.target.closest('button');if(!b)return;var n=num(atob(ch.dataset.p));if(b.dataset.k==='wa')window.open('https://wa.me/'+n,'_blank','noopener');else location.href='viber://chat?number=%2B'+n};
})();
</script>
<script>
window.addEventListener('load',function(){
var art=document.getElementById('art'),tools=document.getElementById('tools');
if(!window.supabase||!art||!tools)return;
var X=JSON.parse(art.dataset.x),id=art.dataset.id,owner=art.dataset.owner,imgs=JSON.parse(art.dataset.imgs||'[]'),lang=art.dataset.lang;
var sb=window.supabase.createClient(X.url,X.key),q=lang==='mk'?'':'&lang='+lang;
function add(e,cls,txt){e.className='btn sm '+cls;e.textContent=txt;tools.appendChild(e);return e}
function link(cls,txt,href){var a=document.createElement('a');a.href=href;return add(a,cls,txt)}
function btn(cls,txt){var b=document.createElement('button');b.type='button';return add(b,cls,txt)}
function toast(m){var t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},2500)}
sb.auth.getSession().then(function(r){
  var u=r.data&&r.data.session&&r.data.session.user;
  if(!(u&&u.id===owner)){try{var vk='v_'+id;if(!sessionStorage.getItem(vk)){sessionStorage.setItem(vk,'1');sb.rpc('bump_view',{p_id:id}).then(function(r){var v=document.getElementById('vw');if(v&&!r.error)v.textContent=(+v.textContent||0)+1})}}catch(e){}}
  if(u&&u.id===owner){
    link('ghost','✎ '+X.edit,'/?edit='+id+q);
    btn('ghost','↻ '+X.renew).onclick=function(){sb.rpc('renew_listing',{p_id:id}).then(function(r){toast(r.error?X.fail:X.renewed)})};
    btn('bad','🗑 '+X.del).onclick=function(){
      if(!confirm(X.confirmDel))return;
      sb.from('listings').delete().eq('id',id).then(function(r){
        if(r.error){toast(X.fail);return}
        var ps=[];imgs.forEach(function(x){var p=String(x).split('/listing-photos/')[1];if(p){ps.push(p);ps.push(p.replace(/[.]jpg$/,'_t.jpg'))}});
        if(ps.length)sb.storage.from('listing-photos').remove(ps);
        location.href='/'+(q?'?'+q.slice(1):'');
      });
    };
  }else{
    link('ghost','⚑ '+X.report,'/?report='+id+q);
    if(!u){link('ghost','♡ '+X.save,'/?fav='+id+q)}
    else{
      var b=btn('ghost','♡ '+X.save),on=false;
      var paint=function(){b.textContent=on?'♥ '+X.saved:'♡ '+X.save};
      sb.from('favorites').select('listing_id').eq('listing_id',id).then(function(r){on=!!(r.data&&r.data.length);paint()});
      b.onclick=function(){on=!on;paint();(on?sb.from('favorites').insert({listing_id:id}):sb.from('favorites').delete().eq('listing_id',id)).then(function(r){if(r.error){on=!on;paint();toast(X.fail)}})};
    }
  }
});
});
</script>`;

  const ld = [
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: tx.brand, item: home },
      { '@type': 'ListItem', position: 2, name: catName, item: catUrl },
      { '@type': 'ListItem', position: 3, name: l.title, item: canonical } ] },
  ];
  const nPrice = Number(l.price) || 0, canOffer = !['neg', 'swap'].includes(l.price_type) || nPrice > 0;
  if (l.category !== 'job' && canOffer) {
    ld.push({ '@context': 'https://schema.org', '@type': 'Product', name: l.title, description: clip(l.description || l.title, 500),
      ...(images.length ? { image: images } : {}), category: catName,
      itemCondition: l.cond === 'new' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      offers: { '@type': 'Offer', price: nPrice, priceCurrency: l.currency === 'MKD' ? 'MKD' : 'EUR', availability: 'https://schema.org/InStock', url: canonical,
        availableAtOrFrom: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: cityName, addressCountry: 'MK' } } } });
  }

  return html(200, shell({ lang, title, desc, canonical, alternates: self, image: images[0], body, ld }), {
    'cache-control': 'public, max-age=0, must-revalidate',
  });
}

return onRequest;
})();

const sitemapPage = (() => {
// /sitemap.xml – lists the homepage and every public listing so Google can find them.

const SB = 'https://ttqaswutuhswrjyocbcv.supabase.co';
const KEY = 'sb_publishable_LxYBkR8o93P7tgUpu7dAMQ_bo3BCq1c'; // publishable key: safe to be public

const xml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]));

async function onRequest({ request: req }) {
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
}

return onRequest;
})();

const robotsPage = (() => {
// /robots.txt – tells Google what to index and where the sitemap is.
async function onRequest({ request: req }) {
  const origin = new URL(req.url).origin;
  const body = `User-agent: *\nAllow: /\nDisallow: /admin.html\n\nSitemap: ${origin}/sitemap.xml\n`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}

return onRequest;
})();

export default {
  async fetch(request, env) {
    const p = new URL(request.url).pathname;
    if (p === '/robots.txt') return robotsPage({ request });
    if (p === '/sitemap.xml') return sitemapPage({ request });
    if (/^\/oglas\/[^/]+\/?$/.test(p)) return listingPage({ request });
    return env.ASSETS.fetch(request);
  },
};
