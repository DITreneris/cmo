/**
 * Build locale pages: generates lt/index.html and en/index.html from root index.html.
 * LT = Lithuanian (default), EN = English (replacements applied).
 * Run: node scripts/build-locale-pages.js
 * Optional: BASE_PATH=/marketingas/ for GitHub Pages subpath.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const BASE_PATH = (process.env.BASE_PATH || '').replace(/\/?$/, ''); // e.g. '' or '/marketingas'

function readIndex() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  if (!html) throw new Error('index.html not found or empty');
  return html;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/** Insert canonical + hreflang after viewport meta */
function insertSeo(html, locale) {
  const base = BASE_PATH ? BASE_PATH + '/' : '';
  const canonical = base + (locale === 'lt' ? 'lt/' : 'en/');
  const insert = [
    `<link rel="canonical" href="${canonical}">`,
    `<link rel="alternate" hreflang="lt" href="${base}lt/">`,
    `<link rel="alternate" hreflang="en" href="${base}en/">`,
    `<link rel="alternate" hreflang="x-default" href="${base}lt/">`
  ].join('\n    ');
  return html.replace(
    /<meta name="viewport" content="[^"]*">/,
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    ' + insert
  );
}

/** Fix asset paths for pages inside lt/ or en/ */
function fixAssetPaths(html) {
  return html
    .replace(/href="favicon\.svg"/g, 'href="../favicon.svg"')
    .replace(/href="privatumas\.html"/g, 'href="../privatumas.html"');
}

/** EN static text replacements (order: more specific first where needed) */
const EN_REPLACEMENTS = [
  // Skip & meta
  ['Pereiti prie turinio', 'Skip to content'],
  ['<title>Turinio DI sistema – rinkodaros vadovams</title>', '<title>Content AI System – for Marketing Leaders</title>'],
  // Hero
  ['aria-label="Pilna Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)"', 'aria-label="Full Prompt Anatomy – interactive training (opens in new tab)"'],
  ['aria-label="Mini rinkodaros DI sistema, Lead generator versija"', 'aria-label="Mini marketing AI system, Lead generator version"'],
  // Footer product link (before generic "Promptų anatomija" so full paragraph matches)
  ['<p class="footer-product-link">Tai Spin-off Nr. 2 iš „Promptų anatomijos“. Pilnas interaktyvus mokymas ir kiti kursai: <a href="https://www.promptanatomy.app/" target="_blank" rel="noopener noreferrer">Promptų anatomija →</a></p>', '<p class="footer-product-link">This is Spin-off No. 2 from Prompt Anatomy. Full interactive training and other courses: <a href="https://www.promptanatomy.app/" target="_blank" rel="noopener noreferrer">Prompt Anatomy →</a></p>'],
  ['<span id="footer-email-label">El. paštas:</span>', '<span id="footer-email-label">Email:</span>'],
  ['Promptų anatomija', 'Prompt Anatomy'],
  ['Turinio DI sistema<br>rinkodaros vadovams', 'Content AI System<br>for Marketing Leaders'],
  ['Per 45 min. susikursi turinio variklį, kuris dirba kasdien.', 'In 45 min you\'ll build a content engine that works every day.'],
  ['aria-label="Gauti nemokamai – pereiti prie promptų"', 'aria-label="Get free – go to prompts"'],
  ['Gauti nemokamai', 'Get free'],
  ['aria-label="Prisijunk prie bendruomenės – pereiti prie WhatsApp ir nuorodų"', 'aria-label="Join community – go to WhatsApp and links"'],
  ['Prisijunk prie bendruomenės', 'Join the community'],
  // Objectives
  ['<span aria-hidden="true">🎯</span> Ką realiai gausi', '<span aria-hidden="true">🎯</span> What you actually get'],
  ['Per 3/4 val. turėsi aiškią turinio sistemą, 100 turinio vienetų ir 30 d. planą', 'In 3/4 h you\'ll have a clear content system, 100 content units and a 30-day plan'],
  ['Generuosi turinį pagal 4 principus', 'Generate content by 4 principles'],
  ['Testuosi ir optimizuosi pagal aiškius matavimo rodiklius', 'Test and optimize by clear metrics'],
  ['Dirbsi uždaru ciklu: Planuok → Kurk → Platink → Matuok → Spręsk', 'Work in a closed loop: Plan → Create → Distribute → Measure → Decide'],
  // Instructions
  ['Kaip naudoti šią biblioteką', 'How to use this library'],
  ['aria-label="Orientacinis laikas: 3–5 min per žingsnį"', 'aria-label="Estimated time: 3–5 min per step"'],
  ['Pasirink promptą ir spausk ant jo – tekstas pažymėsis', 'Select a prompt and click it – text will be selected'],
  // Use same quote chars as in index.html: „ (U+201E) and " (U+201C) so replacement matches
  ['Spausk <strong>„Kopijuoti promptą\u201C</strong> arba <code>Ctrl+C</code> / <code>Cmd+C</code>', 'Click <strong>"Copy prompt"</strong> or <code>Ctrl+C</code> / <code>Cmd+C</code>'],
  ['~3–5 min per žingsnį', '~3–5 min per step'],
  ["content: '💡 Spausk čia ir nukopijuok';", "content: '💡 Click here and copy';"],
  ['Įklijuok į ChatGPT, Claude ar kitą DI (dirbtinio intelekto) įrankį', 'Paste into ChatGPT, Claude or another AI tool'],
  ['Pakeisk <code>[auditorija]</code>, <code>[galvos skausmas]</code>, <code>[unikalus pardavimo pasiūlymas]</code>, <code>[kanalas]</code> ir kitus laukus savo duomenimis – ir gauk rezultatą', 'Replace <code>[audience]</code>, <code>[pain point]</code>, <code>[unique selling proposition]</code>, <code>[channel]</code> and other placeholders with your data – and get the result'],
  // Progress
  ['Panaudojai 0 iš 10 promptų', 'You used 0 of 10 prompts'],
  ['aria-label="Progresas: 0 iš 10 promptų"', 'aria-label="Progress: 0 of 10 prompts"'],
  // Prompt 1–10: full <pre> body content LT → EN (order: prompt 1 first so IDs match)
  ['META: Tu esi rinkodaros strategas. Tikslas: 30 dienų planas pagal 4 principus (Autoritetas, Problema, Pavyzdys, Pasiūlymas).\n\nINPUT: Auditorija [ ], galvos skausmas [ ], unikalus pardavimo pasiūlymas [ ], kanalas [ ]. Kiekvienai dienai – vienas iš 4 principų; matomi matavimo rodikliai.\n\nOUTPUT: Lentelė/sąrašas – 30 dienų: tema, įžanginis kabliukas, formatas, raginimas veikti, matavimo rodikliai. LT arba EN; konkretus tonas.', 'META: You are a marketing strategist. Goal: 30-day plan by 4 principles (Authority, Problem, Proof, Offer).\n\nINPUT: Audience [ ], pain point [ ], unique selling proposition [ ], channel [ ]. For each day – one of 4 principles; visible metrics.\n\nOUTPUT: Table/list – 30 days: topic, hook, format, call to action, metrics. LT or EN; concrete tone.'],
  ['META: Tu esi turinio strategas. Tikslas: 1 idėja → 7 formatų (ta pati žinutė, skirtingi kanalai).\n\nINPUT: Idėja [ ]. Ta pati branduolinė žinutė; pritaikyta kanalui.\n\nOUTPUT: 7 blokai – LinkedIn, karuselė, 30s video, el. laiškas, titulinis ekranas, reklama, 3 įžanginiai kabliukai. LT arba EN; konkretus tonas.', 'META: You are a content strategist. Goal: 1 idea → 7 formats (same message, different channels).\n\nINPUT: Idea [ ]. Same core message; adapted to channel.\n\nOUTPUT: 7 blocks – LinkedIn, carousel, 30s video, email, hero screen, ad, 3 hooks. LT or EN; concrete tone.'],
  ['META: Tu esi LinkedIn/autoriteto specialistas. Tikslas: postas B2B skaitytojams su įrodymais.\n\nINPUT: Tema [ ], pavyzdys/skaičius [ ]. 150–200 žodžių; be tuščių frazių.\n\nOUTPUT: 1 postas – įžanginis kabliukas, 3 punktai, 1 pavyzdys, raginimas veikti. LT arba EN; įžūlus, pagrįstas.', 'META: You are a LinkedIn/authority specialist. Goal: post for B2B readers with proof.\n\nINPUT: Topic [ ], example/number [ ]. 150–200 words; no filler.\n\nOUTPUT: 1 post – hook, 3 points, 1 example, call to action. LT or EN; bold, evidence-based.'],
  ['META: Tu esi video scenarijų autorius (Reels/TikTok/Shorts). Tikslas: 30 s scenarijus – sustabdyti žiūrovą, gauti reakciją.\n\nINPUT: Tema [ ], pavyzdys [ ]. ~30 s; įžanginis kabliukas 0–2 s – pirmos sekundės sprendžia.\n\nOUTPUT: Laiko žymės – 0–2 s įžanginis kabliukas, 3 punktai (~8–10 s kiekvienam), pavyzdys, raginimas veikti. LT arba EN; greitas, aiškus.', 'META: You are a video script writer (Reels/TikTok/Shorts). Goal: 30s script – stop the viewer, get a reaction.\n\nINPUT: Topic [ ], example [ ]. ~30s; hook 0–2s – first seconds decide.\n\nOUTPUT: Timestamps – 0–2s hook, 3 points (~8–10s each), example, call to action. LT or EN; fast, clear.'],
  ['META: Tu esi analitikas. Tikslas: iš rodiklių – veiksmų planas (\u201Eką daryti rytoj\u201C).\n\nINPUT: Rodikliai – skaičiai, kanalai, periodas [ ]. Kontekstas: ką bandėte, tikslai [ ]. Paremta duomenimis.\n\nOUTPUT: 4 punktai – (1) Kas neveikia, (2) Priežastis (hipotezė), (3) Ką testuoti, (4) Ką stabdyti. LT arba EN; konkretus, veiksmo orientuotas.', 'META: You are an analyst. Goal: from metrics – action plan ("what to do tomorrow").\n\nINPUT: Metrics – numbers, channels, period [ ]. Context: what you tried, goals [ ]. Data-backed.\n\nOUTPUT: 4 points – (1) What doesn\'t work, (2) Reason (hypothesis), (3) What to test, (4) What to stop. LT or EN; concrete, action-oriented.'],
  ['META: Tu esi konversijos/turinio specialistas. Tikslas: turinys, neutralizuojantis prieštaravimus – mažesnė trintis, didesnis pasitikėjimas.\n\nINPUT: Prieštaravimų sąrašas [ ], produktas/pasiūlymas [ ]. Kiekvienas vienetas – vienas prieštaravimas; įtikinamai.\n\nOUTPUT: 10 vienetų – postai/el. laiškai/landing, prieštaravimas + argumentai. Trumpas aprašymas + žinutė. LT arba EN; įtikinamas, empatiškas.', 'META: You are a conversion/content specialist. Goal: content that neutralises objections – less friction, more trust.\n\nINPUT: List of objections [ ], product/offer [ ]. Each unit – one objection; persuasive.\n\nOUTPUT: 10 units – posts/emails/landing, objection + arguments. Short description + message. LT or EN; persuasive, empathetic.'],
  ['META: Tu esi lead/konversijų specialistas. Tikslas: postas + 4 žinutės tiems, kurie augina lead\'us ir nori vesti iš sekėjo į klientą.\n\nINPUT: Lead generator [ kas duodama, ką sprendžia ] [ ], auditorija [ ]. Postas – vienas raginimas veikti; seka: pristatyti → kvalifikacija → vertė → pasiūlymas.\n\nOUTPUT: (1) Postas: įžanginis kabliukas, nauda, raginimas veikti. (2) 4 žinutės (tekstas + raginimas veikti kiekvienai). LT arba EN; naudingas, aiškus tonas.', 'META: You are a lead/conversion specialist. Goal: post + 4 messages for those growing leads and moving follower to customer.\n\nINPUT: Lead generator [ what you give, what it solves ] [ ], audience [ ]. Post – one call to action; sequence: intro → qualification → value → offer.\n\nOUTPUT: (1) Post: hook, benefit, call to action. (2) 4 messages (copy + CTA each). LT or EN; useful, clear tone.'],
  ['META: Tu esi turinio/pardavimų specialistas. Tikslas: iš duomenų – struktūrizuota kliento istorija (kredibilitetas, konversija).\n\nINPUT: Klientas [ ], problema [ ], sprendimas [ ], procesas [ ], rezultatai (skaičiai/citatos) [ ]. Rezultatai – konkretūs.\n\nOUTPUT: 6 sekcijos – Problema, Sprendimas, Procesas, Rezultatas, Pagrindinės mintys, raginimas veikti. Su skaičiais kur įmanoma. LT arba EN; įtikinamas tonas.', 'META: You are a content/sales specialist. Goal: from data – structured customer story (credibility, conversion).\n\nINPUT: Customer [ ], problem [ ], solution [ ], process [ ], results (numbers/quotes) [ ]. Results – concrete.\n\nOUTPUT: 6 sections – Problem, Solution, Process, Result, Key takeaways, call to action. With numbers where possible. LT or EN; persuasive tone.'],
  ['META: Tu esi SEO/turinio specialistas. Tikslas: temų struktūra (pagrindinė + 8 subtemos) autoritetui ir organiniam pasiekiamumui.\n\nINPUT: Pagrindinė tema [ ], niša/vertė [ ]. 8 subtemos, logiškai susietos; vidinės nuorodos.\n\nOUTPUT: (1) 1 pagrindinė tema – pavadinimas, aprašymas, raginimas veikti. (2) 8 subtemos – pavadinimai, ryšys su pagrindine. (3) Nuorodų logika. LT arba EN.', 'META: You are an SEO/content specialist. Goal: topic structure (pillar + 8 subtopics) for authority and organic reach.\n\nINPUT: Pillar topic [ ], niche/value [ ]. 8 subtopics, logically linked; internal links.\n\nOUTPUT: (1) 1 pillar topic – title, description, call to action. (2) 8 subtopics – titles, link to pillar. (3) Link logic. LT or EN.'],
  ['META: Tu esi rinkodaros strategas. Tikslas: vienas „valdymo centro" planas – turinys, 1→7 formatų, testavimas, prioritetai.\n\nINPUT: Verslas [ ], auditorija [ ], galvos skausmas [ ], unikalus pardavimo pasiūlymas [ ], tikslas [ ], kanalai [ ], duomenys (rodikliai, prieštaravimai, istorijos) [ ]. Konkretūs teiginiai, matuojamas raginimas veikti.\n\nOUTPUT: 6 blokai – (1) 30 d. struktūra, (2) 5 turinio vienetai šiai savaitei, (3) 1 idėja→7 formatų, (4) 3 hipotezės, (5) Rodiklių interpretavimas, (6) 3 veiksmai rytoj. LT arba EN; konkretus tonas.', 'META: You are a marketing strategist. Goal: one "control centre" plan – content, 1→7 formats, testing, priorities.\n\nINPUT: Business [ ], audience [ ], pain point [ ], unique selling proposition [ ], goal [ ], channels [ ], data (metrics, objections, stories) [ ]. Concrete claims, measurable call to action.\n\nOUTPUT: 6 blocks – (1) 30-day structure, (2) 5 content units this week, (3) 1 idea→7 formats, (4) 3 hypotheses, (5) Metrics interpretation, (6) 3 actions tomorrow. LT or EN; concrete tone.'],
  // Prompt 1
  ['<div class="category">Pradžia</div>', '<div class="category">Start</div>'],
  ['<h2 class="prompt-title">30 dienų turinio sistema</h2>', '<h2 class="prompt-title">30-day content system</h2>'],
  ['<p class="prompt-desc">Sukurk 30 dienų turinio planą pagal 4 turinio principus</p>', '<p class="prompt-desc">Create a 30-day content plan by 4 content principles</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 1"', 'aria-label="Select and copy prompt 1"'],
  ['aria-label="Informacija: promptas 1"', 'aria-label="Information: prompt 1"'],
  ['<strong>Branduolys:</strong>', '<strong>Core:</strong>'],
  ['<p>4 principai = balansas: autoritetas, problema, įrodymas, pasiūlymas.</p>', '<p>4 principles = balance: authority, problem, proof, offer.</p>'],
  ['Nukopijuok ir įklijuok į ChatGPT arba Claude – tai šio žingsnio tikslas.', 'Copy and paste into ChatGPT or Claude – that\'s the goal of this step.'],
  ['aria-label="Kopijuoti promptą 1 į mainų atmintinę"', 'aria-label="Copy prompt 1 to clipboard"'],
  ['<span>Kopijuoti promptą</span>', '<span>Copy prompt</span>'],
  ['aria-label="Pažymėti, kad atlikai šį žingsnį"', 'aria-label="Mark as done"'],
  ['<span>Pažymėjau kaip atlikau</span>', '<span>Mark as done</span>'],
  // Prompt 2
  ['<h2 class="prompt-title">Viena idėja → 7 formatai</h2>', '<h2 class="prompt-title">One idea → 7 formats</h2>'],
  ['<p class="prompt-desc">Vieną idėją paversk į 7 skirtingus formatus</p>', '<p class="prompt-desc">Turn one idea into 7 different formats</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 2"', 'aria-label="Select and copy prompt 2"'],
  ['aria-label="Informacija: promptas 2"', 'aria-label="Information: prompt 2"'],
  ['<strong>Vienos idėjos daug formatų:</strong>', '<strong>One idea, many formats:</strong>'],
  ['<p>1 idėja = 7 vienetų. Laikas sutaupomas, nuoseklumas išlaikomas.</p>', '<p>1 idea = 7 units. Time saved, consistency kept.</p>'],
  ['Įklijuok į ChatGPT arba Claude ir pakeisk laukus savo duomenimis.', 'Paste into ChatGPT or Claude and replace placeholders with your data.'],
  ['aria-label="Kopijuoti promptą 2 į mainų atmintinę"', 'aria-label="Copy prompt 2 to clipboard"'],
  // Prompt 3
  ['<h2 class="prompt-title">LinkedIn Autoriteto Kūrimas</h2>', '<h2 class="prompt-title">LinkedIn authority building</h2>'],
  ['<p class="prompt-desc">150–200 žodžių postas su įžanginiu kabliuku, 3 punktais, pavyzdžiu ir raginimu veikti</p>', '<p class="prompt-desc">150–200 word post with hook, 3 points, example and call to action</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 3"', 'aria-label="Select and copy prompt 3"'],
  ['aria-label="Informacija: promptas 3"', 'aria-label="Information: prompt 3"'],
  ['<strong>Autoritetas:</strong>', '<strong>Authority:</strong>'],
  ['<p>Įrodymai + konkretūs punktai = pasitikėjimas ir reakcija.</p>', '<p>Proof + concrete points = trust and engagement.</p>'],
  ['aria-label="Kopijuoti promptą 3 į mainų atmintinę"', 'aria-label="Copy prompt 3 to clipboard"'],
  // Prompt 4
  ['<h2 class="prompt-title">30 sek. video scenarijus</h2>', '<h2 class="prompt-title">30 sec video script</h2>'],
  ['<p class="prompt-desc">Sukurti video – lengviau dar nebuvo!</p>', '<p class="prompt-desc">Create video – easier than ever!</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 4"', 'aria-label="Select and copy prompt 4"'],
  ['aria-label="Informacija: promptas 4"', 'aria-label="Information: prompt 4"'],
  ['<strong>Trumpas formatas:</strong>', '<strong>Short format:</strong>'],
  ['<p>2 sekundės = liks arba slinks toliau. Įžūgis – esmė.</p>', '<p>2 seconds = stay or scroll. The hook is key.</p>'],
  ['Nukopijuok, įklijuok į DI įrankį ir pakeisk [tema], [pavyzdys] savo duomenimis.', 'Copy, paste into AI tool and replace [topic], [example] with your data.'],
  ['aria-label="Kopijuoti promptą 4 į mainų atmintinę"', 'aria-label="Copy prompt 4 to clipboard"'],
  // Prompt 5
  ['<h2 class="prompt-title">Kasdienė analizė (Veikla→Sprendimas)</h2>', '<h2 class="prompt-title">Daily analysis (Action→Decision)</h2>'],
  ['<p class="prompt-desc">Iš rodiklių suprask: kas neveikia, kodėl, ką daryti</p>', '<p class="prompt-desc">From metrics understand: what doesn\'t work, why, what to do</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 5"', 'aria-label="Select and copy prompt 5"'],
  ['aria-label="Informacija: promptas 5"', 'aria-label="Information: prompt 5"'],
  ['<strong>Uždaras ciklas:</strong>', '<strong>Closed loop:</strong>'],
  ['<p>Rodikliai be veiksmų = stovėjimas vietoje. Duomenys → sprendimai.</p>', '<p>Metrics without action = standing still. Data → decisions.</p>'],
  ['aria-label="Kopijuoti promptą 5 į mainų atmintinę"', 'aria-label="Copy prompt 5 to clipboard"'],
  // Prompt 6
  ['<div class="category">Įgūdžiai</div>', '<div class="category">Skills</div>'],
  ['<h2 class="prompt-title">Prieštaravimų apdorojimo įrankis</h2>', '<h2 class="prompt-title">Objection handling tool</h2>'],
  ['<p class="prompt-desc">Iš klientų prieštaravimų sukurk turinį, kuris juos neutralizuoja</p>', '<p class="prompt-desc">From customer objections create content that neutralises them</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 6"', 'aria-label="Select and copy prompt 6"'],
  ['aria-label="Informacija: promptas 6"', 'aria-label="Information: prompt 6"'],
  ['<strong>Konversija:</strong>', '<strong>Conversion:</strong>'],
  ['<p>Realūs klausimai + atsakymai = mažesnė trintis, didesnis pasitikėjimas.</p>', '<p>Real questions + answers = less friction, more trust.</p>'],
  ['Įklijuok į ChatGPT arba Claude – pakeisk prieštaravimus ir kontekstą.', 'Paste into ChatGPT or Claude – replace objections and context.'],
  ['aria-label="Kopijuoti promptą 6 į mainų atmintinę"', 'aria-label="Copy prompt 6 to clipboard"'],
  // Prompt 7
  ['<h2 class="prompt-title">Lead generator postas + DM seka</h2>', '<h2 class="prompt-title">Lead generator post + DM sequence</h2>'],
  ['<p class="prompt-desc">Lead generator postas + 4 žinučių seka</p>', '<p class="prompt-desc">Lead generator post + 4-message sequence</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 7"', 'aria-label="Select and copy prompt 7"'],
  ['aria-label="Informacija: promptas 7"', 'aria-label="Information: prompt 7"'],
  ['<strong>Potencialūs klientai:</strong>', '<strong>Leads:</strong>'],
  ['<p>Seka: sekėjas → klientas. Struktūra didina konversiją.</p>', '<p>Sequence: follower → customer. Structure increases conversion.</p>'],
  ['aria-label="Kopijuoti promptą 7 į mainų atmintinę"', 'aria-label="Copy prompt 7 to clipboard"'],
  // Prompt 8
  ['<h2 class="prompt-title">Kliento istorijos struktūra</h2>', '<h2 class="prompt-title">Customer story structure</h2>'],
  ['<p class="prompt-desc">Iš duomenų sukurk kliento istoriją</p>', '<p class="prompt-desc">From data create a customer story</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 8"', 'aria-label="Select and copy prompt 8"'],
  ['aria-label="Informacija: promptas 8"', 'aria-label="Information: prompt 8"'],
  ['<strong>Įrodymai:</strong>', '<strong>Proof:</strong>'],
  ['<p>Skaičiai + procesas = kredibilitetas ir konversija.</p>', '<p>Numbers + process = credibility and conversion.</p>'],
  ['Nukopijuok ir įklijuok – įrašyk kliento duomenis ir gauk struktūrizuotą istoriją.', 'Copy and paste – enter customer data and get a structured story.'],
  ['aria-label="Kopijuoti promptą 8 į mainų atmintinę"', 'aria-label="Copy prompt 8 to clipboard"'],
  // Prompt 9
  ['<div class="category">Plėtra</div>', '<div class="category">Growth</div>'],
  ['<h2 class="prompt-title">Temų grupė</h2>', '<h2 class="prompt-title">Topic cluster</h2>'],
  ['<p class="prompt-desc">Pagrindinė tema + 8 subtemos, vidinės nuorodos</p>', '<p class="prompt-desc">Main topic + 8 subtopics, internal links</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 9"', 'aria-label="Select and copy prompt 9"'],
  ['aria-label="Informacija: promptas 9"', 'aria-label="Information: prompt 9"'],
  ['aria-label="Kopijuoti promptą 9 į mainų atmintinę"', 'aria-label="Copy prompt 9 to clipboard"'],
  // Prompt 10
  ['<div class="category">Viskas kartu</div>', '<div class="category">All together</div>'],
  ['<h2 class="prompt-title">Pagrindinis promptas (valdymo centras)</h2>', '<h2 class="prompt-title">Main prompt (control centre)</h2>'],
  ['<p class="prompt-desc">Vienas integruotas planas: turinys, vienos idėjos daug formatų, testavimas, veiksmai</p>', '<p class="prompt-desc">One integrated plan: content, one idea many formats, testing, actions</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 10"', 'aria-label="Select and copy prompt 10"'],
  ['aria-label="Informacija: promptas 10"', 'aria-label="Information: prompt 10"'],
  ['<strong>Valdymo centras:</strong>', '<strong>Control centre:</strong>'],
  ['<p>Viskas vienoje vietoje: 30 d. planas, 1→7, testavimas, prioritetai.</p>', '<p>Everything in one place: 30-day plan, 1→7, testing, priorities.</p>'],
  ['Šis promptas apima viską – nukopijuok, įklijuok ir pildyk savo verslo laukus.', 'This prompt covers everything – copy, paste and fill your business fields.'],
  ['aria-label="Kopijuoti promptą 10 į mainų atmintinę"', 'aria-label="Copy prompt 10 to clipboard"'],
  // Next steps
  ['<h2 id="next-steps-title">Kas toliau?</h2>', '<h2 id="next-steps-title">What next?</h2>'],
  ['Geriausia eiti iš eilės nuo 1 iki 10. Paspaudę nuorodą pereisi prie atitinkamo prompto.', 'Best to go in order from 1 to 10. Click a link to jump to that prompt.'],
  ['<a href="#block1">1. 30 dienų turinio sistema</a>', '<a href="#block1">1. 30-day content system</a>'],
  ['<a href="#block2">2. Viena idėja → 7 formatai</a>', '<a href="#block2">2. One idea → 7 formats</a>'],
  ['<a href="#block3">3. LinkedIn Autoriteto Kūrimas</a>', '<a href="#block3">3. LinkedIn authority building</a>'],
  ['<a href="#block4">4. 30 sek. video scenarijus</a>', '<a href="#block4">4. 30 sec video script</a>'],
  ['<a href="#block5">5. Kasdienė analizė (Veikla→Sprendimas)</a>', '<a href="#block5">5. Daily analysis (Action→Decision)</a>'],
  ['<a href="#block6">6. Prieštaravimų apdorojimas</a>', '<a href="#block6">6. Objection handling</a>'],
  ['<a href="#block7">7. Lead generator postas + DM seka</a>', '<a href="#block7">7. Lead generator post + DM sequence</a>'],
  ['<a href="#block8">8. Kliento istorijos struktūra</a>', '<a href="#block8">8. Customer story structure</a>'],
  ['<a href="#block9">9. Temų grupė</a>', '<a href="#block9">9. Topic cluster</a>'],
  ['<a href="#block10">10. Pagrindinis promptas (valdymo centras)</a>', '<a href="#block10">10. Main prompt (control centre)</a>'],
  // Community
  ['<h2 id="community-title">Nori daugiau?<br>Prisijunk prie WhatsApp grupės.</h2>', '<h2 id="community-title">Want more?<br>Join the WhatsApp group.</h2>'],
  ['<p>Bendros diskusijos, patarimai ir naujienos apie promptus ir DI.</p>', '<p>Shared discussions, tips and news about prompts and AI.</p>'],
  ['aria-label="Atidaryti Promptų anatomija WhatsApp grupę naujame lange"', 'aria-label="Open Prompt Anatomy WhatsApp group in new tab"'],
  ['Prisijungti prie WhatsApp grupės', 'Join WhatsApp group'],
  ['aria-label="Pilna Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)"', 'aria-label="Full Prompt Anatomy – interactive training (opens in new tab)"'],
  ['Promptų anatomija →', 'Prompt Anatomy →'],
  // Footer
  ['<h3>Sėkmės rinkodaroje <span aria-hidden="true">🚀</span></h3>', '<h3>Success in marketing <span aria-hidden="true">🚀</span></h3>'],
  ['<p>Nepamiršk pakeisti <strong>[auditorija]</strong>, <strong>[galvos skausmas]</strong>, <strong>[unikalus pardavimo pasiūlymas]</strong>, <strong>[kanalas]</strong> ir kitus laukus savo duomenimis</p>', '<p>Remember to replace <strong>[audience]</strong>, <strong>[pain point]</strong>, <strong>[unique selling proposition]</strong>, <strong>[channel]</strong> and other placeholders with your data</p>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">📣</span> Rinkodara</span>', '<span class="tag" role="listitem"><span aria-hidden="true">📣</span> Marketing</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">📚</span> 10 promptų</span>', '<span class="tag" role="listitem"><span aria-hidden="true">📚</span> 10 prompts</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">⚡</span> Veiksmų fokusas</span>', '<span class="tag" role="listitem"><span aria-hidden="true">⚡</span> Action focus</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">🎯</span> Potencialūs klientai ir rodikliai</span>', '<span class="tag" role="listitem"><span aria-hidden="true">🎯</span> Leads and metrics</span>'],
  ['<p>&copy; 2026 Tomas Staniulis. Mokymų medžiaga. Visos teisės saugomos. <a href="privatumas.html">Privatumas</a></p>', '<p>&copy; 2026 Tomas Staniulis. Training material. All rights reserved. <a href="../privatumas.html">Privacy</a></p>'],
  // Toast & hidden
  ['aria-label="Kopijavimo pranešimas"', 'aria-label="Copy notification"'],
  ['<span>Nukopijuota.</span>', '<span>Copied.</span>'],
  ['aria-label="Kopijuojamo teksto laukas"', 'aria-label="Text to copy field"'],
  // Lang switcher
  ['aria-label="Kalbos pasirinkimas"', 'aria-label="Language selection"'],
  ['aria-label="Perjungti į lietuvių kalbą"', 'aria-label="Switch to Lithuanian"']
];

function applyEnReplacements(html) {
  let out = html;
  for (const [from, to] of EN_REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

function buildLocale(locale) {
  let html = readIndex();
  html = html.replace(/<html lang="lt">/, '<html lang="' + locale + '">');
  if (locale === 'en') {
    html = applyEnReplacements(html);
  }
  html = insertSeo(html, locale);
  html = fixAssetPaths(html);
  return html;
}

function main() {
  ensureDir(path.join(ROOT, 'lt'));
  ensureDir(path.join(ROOT, 'en'));
  const ltHtml = buildLocale('lt');
  const enHtml = buildLocale('en');
  fs.writeFileSync(path.join(ROOT, 'lt', 'index.html'), ltHtml, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'en', 'index.html'), enHtml, 'utf8');
  console.log('Built lt/index.html and en/index.html');
}

main();
