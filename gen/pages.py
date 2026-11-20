# Generates the static info pages (help, safety, privacy, terms, contact) in mk / sq / en.
# Edit CONTACT_EMAIL, then run:  python3 gen/pages.py   (writes into site/public/)
import html, datetime
CONTACT_EMAIL = 'mazalmk@hotmail.com'
import os
OUT = os.path.dirname(os.path.abspath(__file__)) + '/'
UPD = {'mk': 'Последно ажурирање', 'sq': 'Përditësuar së fundi', 'en': 'Last updated'}
TODAY = datetime.date.today().isoformat()
BRAND = {'mk': 'mazalmk', 'sq': 'mazalmk', 'en': 'mazalmk'}
NAV = {
 'about': {'mk': 'За нас', 'sq': 'Rreth nesh', 'en': 'About'},
 'help': {'mk': 'Помош', 'sq': 'Ndihma', 'en': 'Help'},
 'safety': {'mk': 'Безбедно тргување', 'sq': 'Tregtim i sigurt', 'en': 'Trade safely'},
 'privacy': {'mk': 'Политика за приватност', 'sq': 'Politika e privatësisë', 'en': 'Privacy policy'},
 'terms': {'mk': 'Услови за користење', 'sq': 'Kushtet e përdorimit', 'en': 'Terms of use'},
 'contact': {'mk': 'Контакт', 'sq': 'Kontakt', 'en': 'Contact'},
}
BACK = {'mk': '← Назад кон огласите', 'sq': '← Mbrapa te njoftimet', 'en': '← Back to listings'}

# each page: lang -> list of (heading, [paragraph or ('ul', [items])])
P = {}
P['help'] = {
'mk': [
 ('Како да објавам оглас?', ['Најавете се или направете сметка, па притиснете „Објави оглас“. Внесете наслов, категорија, град, цена, телефон и до 10 фотографии. Објавувањето е бесплатно.']),
 ('Како да го променам или избришам огласот?', ['Отворете го вашиот оглас. Како сопственик ќе ги видите копчињата Уреди, Обнови и Избриши. Сите ваши огласи се и во „Мојата сметка“ → „Мои огласи“.']),
 ('Што прави „Обнови“?', ['Го враќа огласот меѓу најновите, за повторно да биде на врвот од листата.']),
 ('Ја заборавив лозинката.', ['Притиснете „Најави се“ → „Ја заборавив лозинката“ и внесете ја вашата е-пошта. Ќе добиете линк за нова лозинка.']),
 ('Како да го контактирам продавачот?', ['Отворете го огласот и притиснете „Повикај“. Телефонскиот број е прикажан на страницата на огласот.']),
 ('Како да пријавам лажен или несоодветен оглас?', ['На страницата на огласот притиснете „Пријави“ и изберете причина. Огласите со повеќе пријави автоматски се кријат додека не бидат проверени.']),
 ('Како да ја избришам сметката?', ['„Мојата сметка“ → „Избриши сметка“. Ова ги брише сметката, огласите и фотографиите трајно.']),
 ('Јазици', ['Страницата е на македонски, албански и англиски. Јазикот го менувате од менито горе десно.']),
],
'sq': [
 ('Si të postoj një njoftim?', ['Hyni ose krijoni një llogari, pastaj shtypni „Posto njoftim“. Shkruani titullin, kategorinë, qytetin, çmimin, telefonin dhe deri në 10 foto. Postimi është falas.']),
 ('Si ta ndryshoj ose ta fshij njoftimin?', ['Hapni njoftimin tuaj. Si pronar do të shihni butonat Ndrysho, Rinovo dhe Fshi. Të gjitha njoftimet tuaja janë edhe te „Llogaria ime“ → „Njoftimet e mia“.']),
 ('Çfarë bën „Rinovo“?', ['E kthen njoftimin ndër më të rejat, që të jetë sërish në krye të listës.']),
 ('E harrova fjalëkalimin.', ['Shtypni „Hyr“ → „E harrova fjalëkalimin“ dhe shkruani emailin tuaj. Do të merrni një lidhje për fjalëkalim të ri.']),
 ('Si ta kontaktoj shitësin?', ['Hapni njoftimin dhe shtypni „Telefono“. Numri i telefonit shfaqet në faqen e njoftimit.']),
 ('Si ta raportoj një njoftim të rremë ose të papërshtatshëm?', ['Në faqen e njoftimit shtypni „Raporto“ dhe zgjidhni arsyen. Njoftimet me shumë raportime fshihen automatikisht derisa të kontrollohen.']),
 ('Si ta fshij llogarinë?', ['„Llogaria ime“ → „Fshi llogarinë“. Kjo fshin përgjithmonë llogarinë, njoftimet dhe fotot.']),
 ('Gjuhët', ['Faqja është në maqedonisht, shqip dhe anglisht. Gjuhën e ndryshoni nga menyja lart djathtas.']),
],
'en': [
 ('How do I post a listing?', ['Log in or create an account, then press “Post a listing”. Enter a title, category, city, price, phone number and up to 10 photos. Posting is free.']),
 ('How do I edit or delete my listing?', ['Open your listing. As the owner you will see Edit, Renew and Delete. All your listings are also under “My account” → “My listings”.']),
 ('What does “Renew” do?', ['It moves your listing back among the newest, so it is at the top of the list again.']),
 ('I forgot my password.', ['Press “Log in” → “Forgot password” and enter your email. You will receive a link to set a new password.']),
 ('How do I contact the seller?', ['Open the listing and press “Call”. The phone number is shown on the listing page.']),
 ('How do I report a fake or inappropriate listing?', ['On the listing page press “Report” and choose a reason. Listings with several reports are hidden automatically until they are checked.']),
 ('How do I delete my account?', ['“My account” → “Delete account”. This permanently deletes your account, listings and photos.']),
 ('Languages', ['The site is in Macedonian, Albanian and English. Change the language from the menu at the top right.']),
]}
P['safety'] = {
'mk': [
 ('Совети за безбедно тргување', [('ul', [
  'Средете се на јавно и осветлено место, по можност со некого.',
  'Прегледајте го предметот пред да платите. За возила проверете ги документите и историјата.',
  'Не плаќајте однапред или аванс на непознати, ниту „резервација“ или „достава“ однапред.',
  'Никогаш не споделувајте лозинки, SMS кодови или податоци од картичка. mazalmk не бара такви податоци.',
  'Внимавајте на цени што се премногу ниски: тоа често е измама.',
  'За работа: сериозен работодавец не бара пари за да ве вработи.',
  'Користете ги вашите вистински податоци само онаму каде што е потребно и не праќајте копија од лична карта.',
  'Ако нешто не е во ред, пријавете го огласот со копчето „Пријави“.'])]),
 ('Забрането е', [('ul', ['Продавање илегални предмети, оружје, дрога или украдена стока.', 'Лажни огласи, измама и туѓи фотографии.', 'Дискриминација, навреди и содржина за возрасни.'])]),
],
'sq': [
 ('Këshilla për tregtim të sigurt', [('ul', [
  'Takohuni në vend publik dhe të ndriçuar, nëse mundet me dikë tjetër.',
  'Shikojeni sendin para se të paguani. Për automjete kontrolloni dokumentet dhe historikun.',
  'Mos paguani paraprakisht ose avans te të panjohurit, as „rezervim“ apo „dërgesë“ paraprakisht.',
  'Asnjëherë mos ndani fjalëkalime, kode SMS ose të dhëna kartele. mazalmk nuk kërkon të dhëna të tilla.',
  'Kujdes me çmimet shumë të ulëta: shpesh janë mashtrim.',
  'Për punë: një punëdhënës serioz nuk kërkon para që t’ju punësojë.',
  'Mos dërgoni kopje të letërnjoftimit.',
  'Nëse diçka nuk është në rregull, raportojeni njoftimin me butonin „Raporto“.'])]),
 ('E ndaluar është', [('ul', ['Shitja e sendeve të paligjshme, armëve, drogës ose mallrave të vjedhura.', 'Njoftime të rreme, mashtrimi dhe fotove të të tjerëve.', 'Diskriminimi, fyerjet dhe përmbajtja për të rritur.'])]),
],
'en': [
 ('Tips for trading safely', [('ul', [
  'Meet in a public, well-lit place, ideally with someone else.',
  'Inspect the item before you pay. For vehicles, check the documents and history.',
  'Do not pay in advance or send a deposit to strangers, including “reservation” or “delivery” fees.',
  'Never share passwords, SMS codes or card details. We never ask for them.',
  'Be careful with prices that are too good to be true; they are often scams.',
  'For jobs: a serious employer never asks you to pay to be hired.',
  'Do not send a copy of your ID card.',
  'If something feels wrong, report the listing with the “Report” button.'])]),
 ('Not allowed', [('ul', ['Selling illegal items, weapons, drugs or stolen goods.', 'Fake listings, fraud and photos that are not yours.', 'Discrimination, abuse and adult content.'])]),
]}
P['about'] = {
'mk': [
 ('Што е mazalmk', ['mazalmk е бесплатна платформа за огласи за Македонија. Овде луѓето објавуваат и пребаруваат огласи за возила, недвижности, електроника, работа, услуги и многу друго, на македонски, албански и англиски јазик.', 'Сајтот го води независен оператор од Скопје.']),
 ('Како работи', [('ul', ['Објавувањето е бесплатно и бара сметка.', 'Секој оглас има своја страница со фотографии, цена, град и контакт.', 'Купувачот и продавачот се договараат директно, без посредник.'])]),
 ('Безбедност', ['Секој оглас може да се пријави. Огласите со повеќе пријави автоматски се кријат додека не бидат проверени, а сметките што ги кршат правилата се блокираат. Прочитајте ги и советите за безбедно тргување.']),
 ('Деловни сметки', ['Фирми како агенции за недвижности и автокуќи можат да отворат деловна сметка. Деловните сметки се одобруваат рачно.']),
 ('Контакт', ['Пишете ни на ' + CONTACT_EMAIL + '. Скопје, Северна Македонија.']),
],
'sq': [
 ('Çfarë është mazalmk', ['mazalmk është platformë falas njoftimesh për Maqedoninë. Këtu njerëzit postojnë dhe kërkojnë njoftime për automjete, pasuri të paluajtshme, elektronikë, punë, shërbime e shumë të tjera, në maqedonisht, shqip dhe anglisht.', 'Faqen e drejton një operator i pavarur nga Shkupi.']),
 ('Si funksionon', [('ul', ['Postimi është falas dhe kërkon llogari.', 'Çdo njoftim ka faqen e vet me foto, çmim, qytet dhe kontakt.', 'Blerësi dhe shitësi merren vesh drejtpërdrejt, pa ndërmjetës.'])]),
 ('Siguria', ['Çdo njoftim mund të raportohet. Njoftimet me shumë raportime fshihen automatikisht derisa të kontrollohen, ndërsa llogaritë që shkelin rregullat bllokohen. Lexoni edhe këshillat për tregtim të sigurt.']),
 ('Llogari biznesi', ['Kompani si agjencitë e pasurive të paluajtshme dhe shitësit e makinave mund të hapin llogari biznesi. Llogaritë e biznesit miratohen manualisht.']),
 ('Kontakt', ['Na shkruani te ' + CONTACT_EMAIL + '. Shkup, Maqedonia e Veriut.']),
],
'en': [
 ('What is mazalmk', ['mazalmk is a free classifieds platform for North Macedonia. People post and browse listings for vehicles, real estate, electronics, jobs, services and much more, in Macedonian, Albanian and English.', 'The site is run by an independent operator in Skopje.']),
 ('How it works', [('ul', ['Posting is free and needs an account.', 'Every listing has its own page with photos, price, city and contact details.', 'Buyer and seller agree directly, with no middleman.'])]),
 ('Safety', ['Any listing can be reported. Listings with several reports are hidden automatically until they are checked, and accounts that break the rules are banned. Please also read our tips for trading safely.']),
 ('Business accounts', ['Companies such as real estate agencies and car dealerships can open a business account. Business accounts are approved manually.']),
 ('Contact', ['Write to us at ' + CONTACT_EMAIL + '. Skopje, North Macedonia.']),
],
}
P['privacy'] = {
'mk': [
 ('Кој го води сајтот', ['Податоците ги обработува операторот на mazalmk, Скопје, Северна Македонија. За прашања за приватноста пишете на ' + CONTACT_EMAIL + '.']),
 ('Кои податоци ги собираме', [('ul', ['Е-пошта и лозинка за сметката (лозинката се чува заштитена, не ја гледаме).', 'Име и, по избор, телефон во профилот.', 'Огласите што ги објавувате: наслов, опис, цена, град, фотографии и телефонски број. Ако изберете WhatsApp или Viber, купувачите можат да ве контактираат преку тие апликации со истиот број.', 'Огласите што ги зачувувате како омилени, зачуваните пребарувања и пријавите што ги испраќате.', 'Ако отворите деловна сметка: име на бизнисот, вид, град, адреса, телефон и веб-страница.'])]),
 ('Што е јавно', ['Огласот и неговиот телефонски број се јавно видливи, за да можат купувачите да ве контактираат. Не ставајте во огласот податоци што не сакате да бидат јавни.']),
 ('Колачиња, фонтови и реклами', ['Користиме неопходно складирање во вашиот прелистувач (најава, јазик и приказ). Фонтовите се вчитуваат од Google Fonts, па Google може да ја види вашата IP-адреса. Cloudflare и Supabase чуваат технички записи (на пр. IP-адреса) за безбедност и работа на сајтот.', 'Во моментов не прикажуваме реклами. Ако почнеме да прикажуваме реклами (на пр. Google AdSense), Google и неговите партнери можат да користат колачиња за прикажување и мерење на реклами, а ова ќе го наведеме тука. Персонализираните реклами може да ги управувате во поставките за реклами на Google.']),
 ('Каде се чуваат податоците', ['Податоците и фотографиите се чуваат кај Supabase, а веб-страницата се хостира кај Cloudflare. Овие компании ги обработуваат податоците за наша сметка.']),
 ('Колку долго ги чуваме', ['Податоците за сметката и огласите ги чуваме додека сметката постои. Кога ќе ја избришете сметката, се бришат профилот, огласите и фотографиите. Техничките записи кај давателите на услуги се чуваат ограничено време.']),
 ('Споделување', ['Не ги продаваме вашите податоци. Ги споделуваме само кога е законски задолжително.']),
 ('Вашите права', ['Можете да ги прегледате, менувате и бришете вашите огласи и профил. Можете да ја избришете сметката во „Мојата сметка“, со што се бришат и огласите и фотографиите. За други барања пишете ни на ' + CONTACT_EMAIL + '.', 'Имате право да поднесете жалба до Агенцијата за заштита на личните податоци на Северна Македонија.']),
 ('Возраст', ['Сајтот не е наменет за лица под 18 години.']),
 ('Промени', ['Ако ја променуваме оваа политика, ќе го ажурираме датумот на врвот на страницата.']),
],
'sq': [
 ('Kush e drejton faqen', ['Të dhënat i përpunon operatori i mazalmk, Shkup, Maqedonia e Veriut. Për pyetje mbi privatësinë na shkruani te ' + CONTACT_EMAIL + '.']),
 ('Cilat të dhëna i mbledhim', [('ul', ['Emailin dhe fjalëkalimin e llogarisë (fjalëkalimi ruhet i mbrojtur, ne nuk e shohim).', 'Emrin dhe, opsionalisht, telefonin në profil.', 'Njoftimet që postoni: titulli, përshkrimi, çmimi, qyteti, fotot dhe numri i telefonit. Nëse zgjidhni WhatsApp ose Viber, blerësit mund t’ju kontaktojnë me të njëjtin numër përmes këtyre aplikacioneve.', 'Njoftimet që ruani si të preferuara, kërkimet e ruajtura dhe raportimet që dërgoni.', 'Nëse hapni llogari biznesi: emrin e biznesit, llojin, qytetin, adresën, telefonin dhe faqen e internetit.'])]),
 ('Çfarë është publike', ['Njoftimi dhe numri i tij i telefonit janë publikë, që blerësit të mund t’ju kontaktojnë. Mos vendosni në njoftim të dhëna që nuk doni t’i shohin të gjithë.']),
 ('Cookie, shkronja dhe reklama', ['Përdorim ruajtje të domosdoshme në shfletuesin tuaj (hyrja, gjuha dhe pamja). Shkronjat ngarkohen nga Google Fonts, kështu që Google mund ta shohë adresën tuaj IP. Cloudflare dhe Supabase ruajnë regjistra teknikë (p.sh. adresën IP) për siguri dhe funksionim.', 'Aktualisht nuk shfaqim reklama. Nëse fillojmë të shfaqim reklama (p.sh. Google AdSense), Google dhe partnerët e tij mund të përdorin cookie për shfaqjen dhe matjen e reklamave, dhe këtë do ta shënojmë këtu. Reklamat e personalizuara mund t’i menaxhoni te cilësimet e reklamave të Google.']),
 ('Ku ruhen të dhënat', ['Të dhënat dhe fotot ruhen te Supabase, ndërsa faqja strehohet te Cloudflare. Këto kompani i përpunojnë të dhënat në emër tonin.']),
 ('Sa gjatë i ruajmë', ['Të dhënat e llogarisë dhe të njoftimeve i ruajmë sa kohë ekziston llogaria. Kur e fshini llogarinë, fshihen profili, njoftimet dhe fotot. Regjistrat teknikë te ofruesit e shërbimeve ruhen për kohë të kufizuar.']),
 ('Ndarja', ['Nuk i shesim të dhënat tuaja. I ndajmë vetëm kur kërkohet me ligj.']),
 ('Të drejtat tuaja', ['Mund t’i shihni, ndryshoni dhe fshini njoftimet dhe profilin tuaj. Mund ta fshini llogarinë te „Llogaria ime“, që fshin edhe njoftimet dhe fotot. Për kërkesa të tjera na shkruani te ' + CONTACT_EMAIL + '.', 'Keni të drejtë të paraqisni ankesë te Agjencia për Mbrojtjen e të Dhënave Personale e Maqedonisë së Veriut.']),
 ('Mosha', ['Faqja nuk është e destinuar për persona nën 18 vjeç.']),
 ('Ndryshime', ['Nëse e ndryshojmë këtë politikë, do ta përditësojmë datën në krye të faqes.']),
],
'en': [
 ('Who runs the site', ['Data is processed by the operator of mazalmk, Skopje, North Macedonia. For privacy questions write to ' + CONTACT_EMAIL + '.']),
 ('What data we collect', [('ul', ['Email and password for your account (the password is stored protected; we cannot see it).', 'Your name and, optionally, a phone number in your profile.', 'The listings you post: title, description, price, city, photos and phone number. If you choose WhatsApp or Viber, buyers can contact you through those apps using the same number.', 'Listings you save as favorites, your saved searches and reports you send.', 'If you open a business account: business name, type, city, address, phone and website.'])]),
 ('What is public', ['Your listing and its phone number are public so buyers can contact you. Do not put anything in a listing that you do not want everyone to see.']),
 ('Cookies, fonts and ads', ['We use storage in your browser that the site needs to work (login, language and view). Fonts are loaded from Google Fonts, so Google can see your IP address. Cloudflare and Supabase keep technical logs (for example IP addresses) for security and operation.', 'We do not show ads at the moment. If we start showing ads (for example Google AdSense), Google and its partners may use cookies to show and measure ads, and we will say so here. You can manage personalized ads in your Google ad settings.']),
 ('Where data is stored', ['Data and photos are stored with Supabase and the website is hosted by Cloudflare. These companies process data on our behalf.']),
 ('How long we keep it', ['We keep your account and listing data while your account exists. When you delete your account, your profile, listings and photos are deleted. Technical logs at our service providers are kept for a limited time.']),
 ('Sharing', ['We do not sell your data. We share it only when required by law.']),
 ('Your rights', ['You can view, change and delete your listings and profile. You can delete your account under “My account”, which also deletes your listings and photos. For other requests write to ' + CONTACT_EMAIL + '.', 'You have the right to complain to the Personal Data Protection Agency of North Macedonia.']),
 ('Age', ['The site is not intended for people under 18.']),
 ('Changes', ['If we change this policy, we will update the date at the top of the page.']),
]}
P['terms'] = {
'mk': [
 ('Прифаќање', ['Со користење на mazalmk ги прифаќате овие услови.']),
 ('Услугата', ['mazalmk е платформа за огласи. Ние не сме страна во продажбата и не продаваме, не проверуваме и не гарантираме предмети, цени или продавачи. Договорот го правите директно со другата страна.']),
 ('Возраст', ['За да објавувате огласи мора да имате најмалку 18 години.']),
 ('Вашиот оглас', [('ul', ['Одговорни сте за точноста на огласот и имате право да ги користите фотографиите.', 'Огласот мора да е во вистинска категорија и да не е дупликат.', 'Забрането е: илегални предмети, оружје, дрога, украдена стока, измами, лажни огласи, навредлива или дискриминаторска содржина.'])]),
 ('Вашата содржина', ['Со објавување на оглас и фотографии ни давате неексклузивна дозвола да ги прикажуваме на mazalmk (на сајтот и на страниците на огласите) додека огласот е активен. Вие ги задржувате правата врз вашата содржина.']),
 ('Деловни сметки', ['Деловните сметки се одобруваат рачно. Можеме да одбиеме или да го отповикаме одобрувањето ако бизнисот е лажен или ги крши условите.']),
 ('Отстранување и блокирање', ['Можеме да скриеме или избришеме огласи и да блокираме сметки што ги кршат условите или се пријавени за злоупотреба, без претходна најава.']),
 ('Одговорност', ['Услугата се дава „како што е“. Колку што законот дозволува, не одговараме за штета од трансакции помеѓу корисници или од прекин на услугата.']),
 ('Применливо право', ['За овие услови важи правото на Република Северна Македонија, а споредите ги решаваат надлежните судови во Република Северна Македонија.']),
 ('Промени', ['Можеме да ги менуваме условите. Продолжувањето на користењето значи прифаќање на новите услови.']),
 ('Контакт', ['Прашања: ' + CONTACT_EMAIL + '.']),
],
'sq': [
 ('Pranimi', ['Duke përdorur mazalmk, i pranoni këto kushte.']),
 ('Shërbimi', ['mazalmk është platformë njoftimesh. Ne nuk jemi palë në shitje dhe nuk shesim, nuk kontrollojmë e nuk garantojmë sende, çmime apo shitës. Marrëveshjen e bëni drejtpërdrejt me palën tjetër.']),
 ('Mosha', ['Për të postuar njoftime duhet të jeni të paktën 18 vjeç.']),
 ('Njoftimi juaj', [('ul', ['Jeni përgjegjës për saktësinë e njoftimit dhe keni të drejtë t’i përdorni fotot.', 'Njoftimi duhet të jetë në kategorinë e duhur dhe jo i dyfishtë.', 'E ndaluar: sende të paligjshme, armë, drogë, mallra të vjedhura, mashtrime, njoftime të rreme, përmbajtje fyese ose diskriminuese.'])]),
 ('Përmbajtja juaj', ['Duke postuar njoftim dhe foto, na jepni një leje joekskluzive t’i shfaqim në mazalmk (në faqe dhe në faqet e njoftimeve) sa kohë njoftimi është aktiv. Të drejtat mbi përmbajtjen tuaj mbeten tuajat.']),
 ('Llogaritë e biznesit', ['Llogaritë e biznesit miratohen manualisht. Mund ta refuzojmë ose ta tërheqim miratimin nëse biznesi është i rremë ose i shkel kushtet.']),
 ('Heqja dhe bllokimi', ['Mund të fshehim ose fshijmë njoftime dhe të bllokojmë llogari që i shkelin kushtet ose raportohen për abuzim, pa njoftim paraprak.']),
 ('Përgjegjësia', ['Shërbimi ofrohet „siç është“. Sa lejon ligji, nuk jemi përgjegjës për dëme nga transaksionet mes përdoruesve ose nga ndërprerja e shërbimit.']),
 ('E drejta e zbatueshme', ['Këtyre kushteve u zbatohet e drejta e Republikës së Maqedonisë së Veriut, ndërsa mosmarrëveshjet i zgjidhin gjykatat kompetente të Republikës së Maqedonisë së Veriut.']),
 ('Ndryshime', ['Mund t’i ndryshojmë kushtet. Vazhdimi i përdorimit nënkupton pranimin e kushteve të reja.']),
 ('Kontakt', ['Pyetje: ' + CONTACT_EMAIL + '.']),
],
'en': [
 ('Acceptance', ['By using mazalmk you accept these terms.']),
 ('The service', ['mazalmk is a classifieds platform. We are not a party to any sale and we do not sell, check or guarantee items, prices or sellers. You make the deal directly with the other person.']),
 ('Age', ['You must be at least 18 years old to post listings.']),
 ('Your listing', [('ul', ['You are responsible for the accuracy of your listing and must have the right to use its photos.', 'A listing must be in the right category and not a duplicate.', 'Not allowed: illegal items, weapons, drugs, stolen goods, fraud, fake listings, abusive or discriminatory content.'])]),
 ('Your content', ['By posting a listing and photos you give us a non-exclusive permission to display them on mazalmk (on the site and on listing pages) while the listing is active. You keep the rights to your content.']),
 ('Business accounts', ['Business accounts are approved manually. We may refuse or withdraw approval if the business is fake or breaks these terms.']),
 ('Removal and bans', ['We may hide or delete listings and ban accounts that break these terms or are reported for abuse, without prior notice.']),
 ('Liability', ['The service is provided “as is”. As far as the law allows, we are not liable for losses from transactions between users or from service interruptions.']),
 ('Governing law', ['These terms are governed by the law of the Republic of North Macedonia, and disputes are decided by the competent courts of the Republic of North Macedonia.']),
 ('Changes', ['We may change these terms. Continuing to use the site means you accept the new terms.']),
 ('Contact', ['Questions: ' + CONTACT_EMAIL + '.']),
]}
P['contact'] = {
'mk': [('Контакт', ['За проблем со конкретен оглас, користете го копчето „Пријави“ на страницата на огласот.', 'За сè друго (сметка, предлози, злоупотреба), пишете ни на: ' + CONTACT_EMAIL + '.', 'mazalmk, Скопје, Северна Македонија.'])],
'sq': [('Kontakt', ['Për problem me një njoftim të caktuar, përdorni butonin „Raporto“ në faqen e njoftimit.', 'Për gjithçka tjetër (llogaria, sugjerime, abuzim), na shkruani te: ' + CONTACT_EMAIL + '.', 'mazalmk, Shkup, Maqedonia e Veriut.'])],
'en': [('Contact', ['For a problem with a specific listing, use the “Report” button on the listing page.', 'For anything else (account, suggestions, abuse), write to: ' + CONTACT_EMAIL + '.', 'mazalmk, Skopje, North Macedonia.'])],
}
TITLE = {k: {l: NAV[k][l] for l in NAV[k]} for k in NAV}

CSS = """/* ───── theme: bazaar (cream paper, pine, tangerine) ───── */
:root{--bg:#fdf8ee;--surface:#fff;--ink:#1c2a33;--mute:#5f6c73;--line:#e9e1d3;--brand:#0f3b30;--brand-ink:#f7f1e3;--tag:#e85d0a;--tag-ink:#fff;--pine:#0f3b30;--pine-ink:#f7f1e3;--hd:#0f3b30;--sel:#0f3b30;--sel-ink:#f7f1e3;--price:#1d6b57;--accent:#fde6c8;--fd:"Unbounded","Trebuchet MS","Segoe UI",system-ui,sans-serif;--awn:repeating-linear-gradient(90deg,#ee6a12 0 28px,var(--bg) 28px 56px);--sh:0 1px 2px rgba(28,42,51,.06),0 8px 22px -12px rgba(28,42,51,.22);color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e2321;--surface:#16302e;--ink:#f7f1e3;--mute:#a7b8b3;--line:#2b4744;--brand:#5fcdb0;--brand-ink:#082019;--tag:#f0731f;--tag-ink:#1b0e03;--pine:#0a1c1a;--pine-ink:#f7f1e3;--hd:#f7f1e3;--sel:#2f8f78;--sel-ink:#fff;--price:#7fd9bf;--accent:#3a2f1c;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0e2321;--surface:#16302e;--ink:#f7f1e3;--mute:#a7b8b3;--line:#2b4744;--brand:#5fcdb0;--brand-ink:#082019;--tag:#f0731f;--tag-ink:#1b0e03;--pine:#0a1c1a;--pine-ink:#f7f1e3;--hd:#f7f1e3;--sel:#2f8f78;--sel-ink:#fff;--price:#7fd9bf;--accent:#3a2f1c;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 "Trebuchet MS","Segoe UI",system-ui,sans-serif}
header{background:var(--brand);color:var(--brand-ink)}header .in{max-width:760px;margin:auto;padding:12px 16px;display:flex;gap:12px;align-items:center}
header a{color:inherit;font-weight:800;font-size:20px;text-decoration:none;margin-right:auto}
.lg{display:flex;gap:6px}.lg button{background:transparent;color:inherit;border:1.5px solid currentColor;border-radius:8px;padding:5px 10px;cursor:pointer;font-weight:700}.lg button[aria-pressed=true]{background:var(--brand-ink);color:var(--brand)}
main{max-width:760px;margin:auto;padding:18px 16px 40px}
article{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:20px}
h1{margin:0 0 4px;font-size:26px}h2{font-size:18px;margin:22px 0 6px}p{margin:6px 0;overflow-wrap:anywhere}li{margin:4px 0}.mute{color:var(--mute);font-size:14px}
.back{display:inline-block;margin-bottom:12px;color:var(--brand)}nav.f{max-width:760px;margin:0 auto;padding:0 16px 40px;display:flex;flex-wrap:wrap;gap:6px 18px;font-size:14px}nav.f a{color:var(--mute)}
body[data-l=mk] [data-l=sq],body[data-l=mk] [data-l=en],body[data-l=sq] [data-l=mk],body[data-l=sq] [data-l=en],body[data-l=en] [data-l=mk],body[data-l=en] [data-l=sq]{display:none}
/* ───── theme: bazaar (cream paper, pine, tangerine) ───── */
:root{--bg:#fdf8ee;--surface:#fff;--ink:#1c2a33;--mute:#5f6c73;--line:#e9e1d3;--brand:#0f3b30;--brand-ink:#f7f1e3;--tag:#e85d0a;--tag-ink:#fff;--pine:#0f3b30;--pine-ink:#f7f1e3;--hd:#0f3b30;--sel:#0f3b30;--sel-ink:#f7f1e3;--price:#1d6b57;--accent:#fde6c8;--fd:"Unbounded","Trebuchet MS","Segoe UI",system-ui,sans-serif;--awn:repeating-linear-gradient(90deg,#ee6a12 0 28px,var(--bg) 28px 56px);--sh:0 1px 2px rgba(28,42,51,.06),0 8px 22px -12px rgba(28,42,51,.22);color-scheme:light}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#0e2321;--surface:#16302e;--ink:#f7f1e3;--mute:#a7b8b3;--line:#2b4744;--brand:#5fcdb0;--brand-ink:#082019;--tag:#f0731f;--tag-ink:#1b0e03;--pine:#0a1c1a;--pine-ink:#f7f1e3;--hd:#f7f1e3;--sel:#2f8f78;--sel-ink:#fff;--price:#7fd9bf;--accent:#3a2f1c;color-scheme:dark}}
:root[data-theme="dark"]{--bg:#0e2321;--surface:#16302e;--ink:#f7f1e3;--mute:#a7b8b3;--line:#2b4744;--brand:#5fcdb0;--brand-ink:#082019;--tag:#f0731f;--tag-ink:#1b0e03;--pine:#0a1c1a;--pine-ink:#f7f1e3;--hd:#f7f1e3;--sel:#2f8f78;--sel-ink:#fff;--price:#7fd9bf;--accent:#3a2f1c;color-scheme:dark}
body{font-family:"Onest","Trebuchet MS","Segoe UI",system-ui,sans-serif}
header{background:var(--bg);color:var(--hd)}header::after{content:"";display:block;height:9px;background:var(--awn)}
header a{font-family:var(--fd);font-weight:700;font-size:19px;letter-spacing:-.3px;display:inline-flex;align-items:center;gap:9px}
.lgb{position:relative;width:34px;height:34px;border-radius:9px;background:var(--pine);overflow:hidden;display:grid;place-items:center;color:#f7f1e3;font-size:23px;font-weight:800;line-height:1;font-family:Onest,"Trebuchet MS","Segoe UI",system-ui,sans-serif;flex:none}
.lgb i{position:absolute;left:0;right:0;top:0;height:4px;background:#e85d0a}
.lgb u{text-decoration:none;margin-top:3px}
.lg button{background:var(--surface);color:var(--ink);border:1.5px solid var(--line);border-radius:999px}.lg button[aria-pressed=true]{background:var(--sel);color:var(--sel-ink);border-color:var(--sel)}
article{border-radius:16px;box-shadow:var(--sh)}h1{font-family:var(--fd);font-size:24px}
.back{color:var(--tag)}"""

JS = """(function(){var L='mk',ok=['mk','sq','en'];try{var q=new URLSearchParams(location.search).get('lang'),s=localStorage.getItem('lang');L=ok.indexOf(q)>-1?q:ok.indexOf(s)>-1?s:'mk'}catch(e){}
function set(l){L=l;document.body.dataset.l=l;document.documentElement.lang=l;var T=%s;document.title=T[l];
document.querySelectorAll('.lg button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.k==l)});
document.querySelectorAll('a[data-p]').forEach(function(a){a.href=a.dataset.p+(l=='mk'?'':'?lang='+l)})}
document.querySelectorAll('.lg button').forEach(function(b){b.onclick=function(){try{localStorage.setItem('lang',b.dataset.k)}catch(e){}set(b.dataset.k)}});set(L)})();"""

def render(name):
    import json
    e = html.escape
    arts = []
    for l in ('mk', 'sq', 'en'):
        out = ['<div data-l="%s"><h1>%s</h1><p class="mute">%s: %s</p>' % (l, e(NAV[name][l]), UPD[l], TODAY)]
        for h, body in P[name][l]:
            if name == 'contact': out[0] = '<div data-l="%s"><h1>%s</h1>' % (l, e(h))
            else: out.append('<h2>%s</h2>' % e(h))
            for b in body:
                if isinstance(b, tuple): out.append('<ul>' + ''.join('<li>%s</li>' % e(x) for x in b[1]) + '</ul>')
                else: out.append('<p>%s</p>' % e(b))
        out.append('</div>')
        arts.append(''.join(out))
    titles = {l: NAV[name][l] + ' – ' + BRAND[l] for l in ('mk', 'sq', 'en')}
    back = ''.join('<a class="back" data-l="%s" data-p="/" href="/">%s</a>' % (l, e(BACK[l])) for l in ('mk','sq','en'))
    foot = ''.join('<a data-p="/%s.html" href="/%s.html" %s>%s</a>' % (k, k, '', e(NAV[k]['mk'])) for k in NAV)
    foot = ''.join(''.join('<a data-l="%s" data-p="/%s.html" href="/%s.html">%s</a>' % (l, k, k, e(NAV[k][l])) for l in ('mk','sq','en')) for k in NAV)
    return ('<!DOCTYPE html><html lang="mk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
      '<title>%s</title><meta name="theme-color" content="#fdf8ee"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@500;700;800&display=swap"><link rel="icon" href="/icon.svg?v=2" type="image/svg+xml"><style>%s</style></head>'
      '<body data-l="mk"><header><div class="in"><a href="/" data-p="/"><span class="lgb"><i></i><u>m</u></span><span>%s</span></a><div class="lg"><button data-k="mk">МК</button><button data-k="sq">SQ</button><button data-k="en">EN</button></div></div></header>'
      '<main>%s<article>%s</article></main><nav class="f">%s</nav><script>%s</script></body></html>') % (
      e(titles['mk']), CSS, 'mazalmk', back, ''.join(arts), foot, JS % json.dumps(titles, ensure_ascii=False))

for n in P:
    open(OUT + n + '.html', 'w', encoding='utf-8').write(render(n))
print('wrote', ', '.join(n + '.html' for n in P))
