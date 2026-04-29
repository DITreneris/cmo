/**
 * Build locale pages: generates lt/index.html and en/index.html from root index.html.
 * Also writes js/en-prompt-bodies-inline.js from data/en-prompt-bodies.json (single EN source).
 * LT = Lithuanian (default), EN = English (replacements applied; META LT taken from index <pre>).
 * Run: node scripts/build-locale-pages.js
 * Optional overrides: BASE_PATH and SITE_ORIGIN.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'index.html');
const DEFAULT_BASE_PATH = '/cmo';
const BASE_PATH = (process.env.BASE_PATH || DEFAULT_BASE_PATH).replace(/\/?$/, '');
const SITE_ORIGIN = (process.env.SITE_ORIGIN || 'https://ditreneris.github.io').replace(/\/$/, '');

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

const DATA_DIR = path.join(ROOT, 'data');
const EN_PROMPT_BODIES_PATH = path.join(DATA_DIR, 'en-prompt-bodies.json');
const JS_DIR = path.join(ROOT, 'js');
const EN_PROMPT_INLINE_JS_PATH = path.join(JS_DIR, 'en-prompt-bodies-inline.js');

function loadEnPromptBodies() {
  const raw = fs.readFileSync(EN_PROMPT_BODIES_PATH, 'utf8');
  const arr = JSON.parse(raw);
  if (!Array.isArray(arr) || arr.length !== 10) {
    throw new Error('data/en-prompt-bodies.json must be a JSON array of exactly 10 strings');
  }
  return arr;
}

/** LT <pre> inner text from root index.html, prompt1..prompt10 (order). */
function extractLtPreBodiesFromHtml(html) {
  const out = [];
  for (let i = 1; i <= 10; i++) {
    const re = new RegExp(`<pre class="code-text" id="prompt${i}">([\\s\\S]*?)</pre>`, '');
    const m = html.match(re);
    if (!m) {
      throw new Error(`extractLtPreBodiesFromHtml: missing <pre id="prompt${i}">`);
    }
    out.push(m[1].replace(/\r\n/g, '\n').replace(/\r/g, '\n').trimEnd());
  }
  return out;
}

function writeEnPromptInlineJs(enBodies) {
  ensureDir(JS_DIR);
  const content =
    "'use strict';\nwindow.__EN_PROMPT_PRE = " +
    JSON.stringify(enBodies) +
    ';\n';
  fs.writeFileSync(EN_PROMPT_INLINE_JS_PATH, content, 'utf8');
}

const EN_PROMPT_BODIES = loadEnPromptBodies();

function injectEnPreBodies(html) {
  let out = html;
  for (let i = 1; i <= 10; i++) {
    const body = EN_PROMPT_BODIES[i - 1];
    if (typeof body !== 'string') {
      throw new Error('Missing EN prompt body at index ' + (i - 1));
    }
    const re = new RegExp(`(<pre class="code-text" id="prompt${i}">)([\\s\\S]*?)(</pre>)`, '');
    out = out.replace(re, `$1${body}$3`);
  }
  return out;
}

function makeAbsoluteUrl(relativePath) {
  return `${SITE_ORIGIN}${BASE_PATH}${relativePath}`;
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  return haystack.split(needle).length - 1;
}

/** Insert canonical + hreflang + core metadata after viewport meta */
function insertSeo(html, locale) {
  let cleanHtml = html
    .replace(/\n\s*<link rel="canonical" href="[^"]*">/g, '')
    .replace(/\n\s*<link rel="alternate" hreflang="lt" href="[^"]*">/g, '')
    .replace(/\n\s*<link rel="alternate" hreflang="en" href="[^"]*">/g, '')
    .replace(/\n\s*<link rel="alternate" hreflang="x-default" href="[^"]*">/g, '')
    .replace(/\n\s*<meta name="robots" content="[^"]*">/g, '')
    .replace(/\n\s*<meta name="description" content="[^"]*">/g, '')
    .replace(/\n\s*<meta property="og:[^"]+" content="[^"]*">/g, '')
    .replace(/\n\s*<meta name="twitter:[^"]+" content="[^"]*">/g, '');

  const canonicalPath = locale === 'lt' ? '/lt/' : '/en/';
  const ltUrl = makeAbsoluteUrl('/lt/');
  const enUrl = makeAbsoluteUrl('/en/');
  const canonical = makeAbsoluteUrl(canonicalPath);
  const ogLocale = locale === 'lt' ? 'lt_LT' : 'en_US';
  const title =
    locale === 'lt'
      ? 'Turinio DI sistema – rinkodaros vadovams'
      : 'Content AI System – for Marketing Leaders';
  const description =
    locale === 'lt'
      ? 'Praktinė Prompt Anatomy turinio sistema komandai: 10 promptų biblioteka, aiški metodika ir kasdienis veiksmų ciklas.'
      : 'Practical Prompt Anatomy content system for teams: 10-prompt library, clear methodology, and a daily action loop.';
  const insert = [
    `<link rel="canonical" href="${canonical}">`,
    `<link rel="alternate" hreflang="lt" href="${ltUrl}">`,
    `<link rel="alternate" hreflang="en" href="${enUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${ltUrl}">`,
    '<meta name="robots" content="index,follow,max-image-preview:large">',
    `<meta name="description" content="${description}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${canonical}">`,
    `<meta property="og:site_name" content="Prompt Anatomy">`,
    `<meta property="og:locale" content="${ogLocale}">`,
    '<meta property="og:image" content="https://promptanatomy.app/og-image.png">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    '<meta name="twitter:image" content="https://promptanatomy.app/og-image.png">'
  ].join('\n    ');
  return cleanHtml.replace(
    /<meta name="viewport" content="[^"]*">/,
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n    ' + insert
  );
}

/** Fix asset paths for pages inside lt/ or en/ */
function fixAssetPaths(html) {
  return html
    .replace(/href="favicon\.svg"/g, 'href="../favicon.svg"')
    .replace(/href="privatumas\.html"/g, 'href="../privatumas.html"')
    .replace(/href="styles\//g, 'href="../styles/')
    .replace(/src="js\//g, 'src="../js/')
    .replace(/src="data\//g, 'src="../data/');
}

function assertLocaleStructure(html, locale) {
  const requiredSnippets = [
    'href="../styles/tokens.css"',
    'href="../styles/components.css"',
    'href="../styles/utilities.css"',
    'id="main-content"',
    'class="code-block"',
    'class="btn"',
    'class="prompt-done"'
  ];
  for (const snippet of requiredSnippets) {
    if (!html.includes(snippet)) {
      throw new Error(`Locale ${locale}: missing required snippet -> ${snippet}`);
    }
  }
}

/** EN static text replacements (META blocks come from index LT + data/en-prompt-bodies.json) */
const EN_REPLACEMENTS_PREFIX = [
  // Skip & meta
  ['Pereiti prie turinio', 'Skip to content'],
  ['<title>Turinio DI sistema – rinkodaros vadovams</title>', '<title>Content AI System – for Marketing Leaders</title>'],
  // Hero
  ['aria-label="Pilna Promptų anatomija – interaktyvus mokymas (atidaroma naujame lange)"', 'aria-label="Full Prompt Anatomy – interactive training (opens in new tab)"'],
  ['aria-label="Mini rinkodaros DI sistema, Lead generator versija"', 'aria-label="Mini marketing AI system, Lead generator version"'],
  // Footer product link (before generic "Promptų anatomija" so full paragraph matches)
  ['<p class="footer-product-link">Tai Spin-off Nr. 2 iš „Promptų anatomijos“. Pilnas interaktyvus mokymas ir kiti kursai: <a href="https://www.promptanatomy.app/" target="_blank" rel="noopener noreferrer">Promptų anatomija →</a></p>', '<p class="footer-product-link">This is Spin-off No. 2 from Prompt Anatomy. Full interactive training and other courses: <a href="https://www.promptanatomy.app/" target="_blank" rel="noopener noreferrer">Prompt Anatomy →</a></p>'],
  ['<span id="footer-email-label">El. paštas:</span>', '<span id="footer-email-label">Email:</span>'],
  // Exact strings with "Promptų anatomija" before global replace below (order matters)
  ['aria-label="Atidaryti Promptų anatomija Telegram grupę naujame lange"', 'aria-label="Open Prompt Anatomy Telegram group in new tab"'],
  ['Promptų anatomija', 'Prompt Anatomy'],
  ['Turinio DI sistema<br>rinkodaros vadovams', 'Content AI System<br>for Marketing Leaders'],
  ['Per 45 min. susikursi turinio variklį, kuris dirba kasdien.', 'Build a US-ready content engine in 45 minutes.'],
  ['aria-label="Gauti nemokamai – pereiti prie promptų"', 'aria-label="Get started free – go to prompts"'],
  ['Gauti nemokamai', 'Get started free'],
  ['aria-label="Prisijunk prie bendruomenės – pereiti prie Telegram ir nuorodų"', 'aria-label="Join the community – go to Telegram and links"'],
  ['Prisijunk prie bendruomenės', 'Join the community'],
  // Objectives
  ['<span aria-hidden="true">🎯</span> Ką realiai gausi', '<span aria-hidden="true">🎯</span> What you get'],
  ['Per 3/4 val. turėsi aiškią turinio sistemą, 100 turinio vienetų ir 30 d. planą', 'In 45 minutes, you get a clear content system, 100 content assets, and a 30-day plan'],
  ['Generuosi turinį pagal 4 principus', 'Generate content with 4 proven pillars'],
  ['Testuosi ir optimizuosi pagal aiškius matavimo rodiklius', 'Test and optimize with clear KPIs'],
  ['Dirbsi uždaru ciklu: Planuok → Kurk → Platink → Matuok → Spręsk', 'Run a closed loop: Plan → Create → Distribute → Measure → Decide'],
  ['<strong>Apibrėžimas CMO lygmeniui</strong>', '<strong>CMO-level definition</strong>'],
  ['<p>Prompt Anatomy yra praktinė AI operacinė sistema komandai: mažiau spėjimų, daugiau kontrolės ir aiškus sprendimų ciklas.</p>', '<p>Prompt Anatomy is a practical AI operating system for teams: less guesswork, more control, and a clear decision loop.</p>'],
  ['Oficiali metodika: promptanatomy.app →', 'Official methodology: promptanatomy.app →'],
  ['<strong>Kada naudoti</strong>', '<strong>When to use</strong>'],
  ['<p>Naudok, kai reikia greičiau paleisti turinį, sumažinti komandų trintį ir išlaikyti vienodą kokybę per kanalus.</p>', '<p>Use it when you need faster content execution, less team friction, and consistent quality across channels.</p>'],
  ['Pilnas framework ir kontekstas →', 'Full framework and context →'],
  // Instructions
  ['Kaip naudoti šią biblioteką', 'How to use this library'],
  ['aria-label="Orientacinis laikas: 3–5 min per žingsnį"', 'aria-label="Estimated time: 3–5 min per step"'],
  ['Pasirink promptą ir spausk ant jo – tekstas pažymėsis', 'Select a prompt and click it to auto-select the text'],
  // Use same quote chars as in index.html: „ (U+201E) and " (U+201C) so replacement matches
  ['Spausk <strong>„Kopijuoti promptą\u201C</strong> arba <code>Ctrl+C</code> / <code>Cmd+C</code>', 'Click <strong>"Copy prompt"</strong> or <code>Ctrl+C</code> / <code>Cmd+C</code>'],
  ['~3–5 min per žingsnį', '~3–5 min per step'],
  ["content: '💡 Spausk čia ir nukopijuok';", "content: '💡 Click to select and copy';"],
  ['Įklijuok į ChatGPT, Claude ar kitą DI (dirbtinio intelekto) įrankį', 'Paste into ChatGPT, Claude or another AI tool'],
  ['Pakeisk <code>[auditorija]</code>, <code>[galvos skausmas]</code>, <code>[unikalus pardavimo pasiūlymas]</code>, <code>[kanalas]</code> ir kitus laukus savo duomenimis – ir gauk rezultatą', 'Replace <code>[audience]</code>, <code>[pain point]</code>, <code>[unique selling proposition]</code>, <code>[channel]</code>, and any city or budget placeholders with your real data'],
  // Upgrade layer: explain blocks
  ['Kas yra prompt?', 'What is a prompt?'],
  ['Promptas yra aiški instrukcija DI įrankiui: ką daryti, kam daryti ir kokiu formatu grąžinti rezultatą.', 'A prompt is a clear instruction to an AI tool: what to do, for whom, and in which format.'],
  ['Kuo promptas tikslesnis, tuo mažiau taisymų po pirmo atsakymo.', 'The clearer the prompt, the fewer fixes you need after the first answer.'],
  ['Kontekstas + Tikslas + Ribos + Formatas', 'Context + Goal + Constraints + Format'],
  ['aria-label="Meme vieta 1"', 'aria-label="Meme slot 1"'],
  ['Meme vieta #1: „Kai parašai vieną neaiškų sakinį ir tikiesi tobulo plano.“', 'Meme slot #1: "When you write one vague sentence and expect a perfect plan."'],
  ['Kas yra Prompt Anatomy?', 'What is Prompt Anatomy?'],
  ['Prompt Anatomy yra struktūra, kuri padeda rašyti promptus taip, kad rezultatas būtų nuoseklus ir pakartojamas.', 'Prompt Anatomy is a structure that helps you write prompts with consistent and repeatable results.'],
  ['Rolė: kas kalba ir kokio lygio ekspertika.', 'Role: who is speaking and at what expertise level.'],
  ['Kontekstas: situacija, auditorija ir apribojimai.', 'Context: situation, audience, and limits.'],
  ['Tikslas: vienas aiškus rezultatas.', 'Goal: one clear result.'],
  ['Ribos: tonas, ilgis, kas neleidžiama.', 'Constraints: tone, length, what is not allowed.'],
  ['Formatas: kaip turi atrodyti atsakymas.', 'Format: how the response must look.'],
  ['Vertinimas: pagal ką spręsti ar atsakymas geras.', 'Evaluation: how to judge response quality.'],
  ['aria-label="Meme vieta 2"', 'aria-label="Meme slot 2"'],
  ['Meme vieta #2: „Kai iš ‘parašyk kažką’ pereini į aiškią struktūrą ir rezultatas pagaliau normalus.“', 'Meme slot #2: "When you move from \'write something\' to a clear structure and the output is finally solid."'],
  ['Schema: kaip dirbti su šia biblioteka', 'Framework: how to work with this library'],
  ['Planuok: pasirink vieną tikslą ir vieną auditoriją.', 'Plan: choose one goal and one audience.'],
  ['Kurk: paleisk promptą su savo duomenimis.', 'Create: run the prompt with your real data.'],
  ['Tikrink: įvertink rezultatą pagal matavimo rodiklius.', 'Check: evaluate output by your metrics.'],
  ['Tobulink: pakoreguok promptą ir kartok ciklą.', 'Improve: refine the prompt and repeat the cycle.'],
  // Progress
  ['Panaudojai 0 iš 10 promptų', 'You used 0 of 10 prompts'],
  ['aria-label="Progresas: 0 iš 10 promptų"', 'aria-label="Progress: 0 of 10 prompts"']
];

const EN_REPLACEMENTS_SUFFIX = [
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
  ['<p class="prompt-desc">Iš klientų prieštaravimų sukurk turinį, kuris juos neutralizuoja</p>', '<p class="prompt-desc">Turn customer objections into content that neutralizes them</p>'],
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
  ['<p>Pagrindinė tema + subtemos = pasiekiamumas ir eksperto pozicija.</p>', '<p>Main topic + subtopics = reach and expert position.</p>'],
  ['aria-label="Kopijuoti promptą 9 į mainų atmintinę"', 'aria-label="Copy prompt 9 to clipboard"'],
  // Prompt 10
  ['<div class="category">Viskas kartu</div>', '<div class="category">All together</div>'],
  ['<h2 class="prompt-title">Pagrindinis promptas (valdymo centras)</h2>', '<h2 class="prompt-title">Main prompt (control center)</h2>'],
  ['<p class="prompt-desc">Vienas integruotas planas: turinys, vienos idėjos daug formatų, testavimas, veiksmai</p>', '<p class="prompt-desc">One integrated plan: content, one idea many formats, testing, actions</p>'],
  ['aria-label="Pasirinkti ir kopijuoti promptą 10"', 'aria-label="Select and copy prompt 10"'],
  ['aria-label="Informacija: promptas 10"', 'aria-label="Information: prompt 10"'],
  ['<strong>Valdymo centras:</strong>', '<strong>Control center:</strong>'],
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
  ['<a href="#block10">10. Pagrindinis promptas (valdymo centras)</a>', '<a href="#block10">10. Main prompt (control center)</a>'],
  // FAQ + meme slot
  ['Dažniausi klausimai prieš startą', 'Frequently asked questions before you start'],
  ['<summary>Ar tinka pradedančiajam?</summary>', '<summary>Is this for beginners?</summary>'],
  ['<p>Taip, jei pildai laukus savo situacija, ne bendrais žodžiais.</p>', '<p>Yes, if you fill placeholders with your real context.</p>'],
  ['<summary>Ar būtina naudoti visus 10?</summary>', '<summary>Do I need all 10 prompts?</summary>'],
  ['<p>Ne, pradėk nuo 1–3 ir plėskis pagal poreikį.</p>', '<p>No, start with 1–3 and expand when needed.</p>'],
  ['<summary>Kuo tai geriau nei random promptas?</summary>', '<summary>Why is this better than random prompts?</summary>'],
  ['<p>Čia turi nuoseklią seką, aiškų tikslą ir vertinimą.</p>', '<p>You get a clear sequence, goal, and evaluation.</p>'],
  ['<summary>Kiek laiko skirti kasdien?</summary>', '<summary>How much time daily?</summary>'],
  ['<p>20–30 min pakanka, jei dirbi ciklu „Kurk → Tikrink → Tobulink“.</p>', '<p>20–30 minutes is enough if you run Create → Check → Improve.</p>'],
  ['Jei reikia pilnos metodikos su paaiškinimais vadovams, pereik į oficialų šaltinį:', 'If you need full methodology with executive-ready explanations, go to the official source:'],
  ['aria-label="Meme vieta 3"', 'aria-label="Meme slot 3"'],
  ['Meme vieta #3: „Kai supranti, kad problema buvo ne DI, o neaiški instrukcija.“', 'Meme slot #3: "When you realize AI was not the issue, the vague instruction was."'],
  // Community
  ['<h2 id="community-title">Nori daugiau?<br>Prisijunk prie Telegram grupės.</h2>', '<h2 id="community-title">Want more?<br>Join our US-focused Telegram group.</h2>'],
  ['<p>Bendros diskusijos, patarimai ir naujienos apie promptus ir DI.</p>', '<p>Get playbooks, real examples, and prompt updates for US-market execution.</p>'],
  ['Prisijungti prie Telegram grupės', 'Join Telegram group'],
  // Footer
  ['<h3>Sėkmės rinkodaroje <span aria-hidden="true">🚀</span></h3>', '<h3>Go win your market <span aria-hidden="true">🚀</span></h3>'],
  ['<p>Nepamiršk pakeisti <strong>[auditorija]</strong>, <strong>[galvos skausmas]</strong>, <strong>[unikalus pardavimo pasiūlymas]</strong>, <strong>[kanalas]</strong> ir kitus laukus savo duomenimis</p>', '<p>Remember to replace <strong>[audience]</strong>, <strong>[pain point]</strong>, <strong>[unique selling proposition]</strong>, <strong>[channel]</strong> and other placeholders with your data</p>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">📣</span> Rinkodara</span>', '<span class="tag" role="listitem"><span aria-hidden="true">📣</span> Marketing</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">📚</span> 10 promptų</span>', '<span class="tag" role="listitem"><span aria-hidden="true">📚</span> 10 prompts</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">⚡</span> Veiksmų fokusas</span>', '<span class="tag" role="listitem"><span aria-hidden="true">⚡</span> Action focus</span>'],
  ['<span class="tag" role="listitem"><span aria-hidden="true">🎯</span> Potencialūs klientai ir rodikliai</span>', '<span class="tag" role="listitem"><span aria-hidden="true">🎯</span> Leads and metrics</span>'],
  ['<p>&copy; 2026 Tomas Staniulis. Mokymų medžiaga. Visos teisės saugomos. <a href="privatumas.html">Privatumas</a></p>', '<p>&copy; 2026 Tomas Staniulis. Training material. All rights reserved. <a href="../en/privacy.html">Privacy</a></p>'],
  ['Paskutinis atnaujinimas: 2026-04-29. Oficialus metodikos šaltinis ir brand centras:', 'Last updated: 2026-04-29. Official methodology source and brand hub:'],
  // Toast & hidden
  ['aria-label="Kopijavimo pranešimas"', 'aria-label="Copy notification"'],
  ['<span>Nukopijuota.</span>', '<span>Copied</span>'],
  ['aria-label="Kopijuojamo teksto laukas"', 'aria-label="Text to copy field"'],
  // Lang switcher
  ['aria-label="Kalbos pasirinkimas"', 'aria-label="Language selection"'],
  ['aria-label="Perjungti į lietuvių kalbą"', 'aria-label="Switch to Lithuanian"'],
  [
    "var privacyHref = (/\\/lt(?:\\/|$)/.test(path) || /\\/en(?:\\/|$)/.test(path)) ? '../privatumas.html' : 'privatumas.html';",
    "var privacyHref = locale === 'en' ? '../en/privacy.html' : ((/\\/lt(?:\\/|$)/.test(path) || /\\/en(?:\\/|$)/.test(path)) ? '../privatumas.html' : 'privatumas.html');"
  ],
  // EN JS messaging refinements
  ["uiText('Klaida: trūksta parametrų', 'Error: missing parameters')", "uiText('Klaida: trūksta parametrų', 'Something went wrong. Try copying again.')"],
  ["uiText('Promptas nerastas', 'Prompt not found')", "uiText('Promptas nerastas', 'Prompt not available. Try another card.')"],
  ["uiText('Promptas tuščias', 'Prompt is empty')", "uiText('Promptas tuščias', 'Prompt has no text yet. Try another card.')"],
  ["uiText('Kopijavimas nepavyko', 'Copy failed')", "uiText('Kopijavimas nepavyko', 'Copy did not work. Select the text and use Ctrl+C (or Cmd+C).')"],
  ["uiText('Nepavyko. Pažymėk tekstą ranka ir nukopijuok.', 'Failed. Select the text manually and copy.')", "uiText('Nepavyko. Pažymėk tekstą ranka ir nukopijuok.', 'Copy did not work. Select the text and use Ctrl+C (or Cmd+C).')"],
  ["uiText('Nukopijuota!', 'Copied!')", "uiText('Nukopijuota!', 'Copied')"],
  ["uiText('Klaida: ', 'Error: ') + errorMessage", "uiText('Klaida: ', 'Copy issue: ') + errorMessage"],
  ['neutralises', 'neutralizes'],
  ['control centre', 'control center'],
  ['Control centre', 'Control center']
  ,["ts.textContent = 'Copied.'", "ts.textContent = 'Copied'"]
];

function buildMetaReplacementsFromIndex(html) {
  const ltBodies = extractLtPreBodiesFromHtml(html);
  return ltBodies.map((lt, i) => {
    const en = EN_PROMPT_BODIES[i];
    if (typeof en !== 'string') {
      throw new Error('Missing EN prompt body at index ' + i);
    }
    return [lt, en];
  });
}

function getEnReplacementsForHtml(html) {
  return [
    ...EN_REPLACEMENTS_PREFIX,
    ...buildMetaReplacementsFromIndex(html),
    ...EN_REPLACEMENTS_SUFFIX
  ];
}

function applyEnReplacements(html) {
  const list = getEnReplacementsForHtml(html);
  let out = html;
  const missingCritical = [];
  for (const [from, to] of list) {
    const hits = countOccurrences(out, from);
    if (hits === 0 && from.includes('<') && from.length > 24) {
      missingCritical.push(from.slice(0, 80));
    }
    out = out.split(from).join(to);
  }
  if (missingCritical.length > 0) {
    throw new Error(
      `EN replacement safety check failed. Missing critical templates: ${missingCritical.length}`
    );
  }
  return out;
}

function buildLocale(locale) {
  let html = readIndex();
  html = html.replace(/<html lang="lt">/, '<html lang="' + locale + '">');
  if (locale === 'en') {
    html = applyEnReplacements(html);
    html = injectEnPreBodies(html);
  }
  html = insertSeo(html, locale);
  html = fixAssetPaths(html);
  return html;
}

function assertPrivacySeo() {
  const privacyChecks = [
    {
      locale: 'lt',
      filePath: path.join(ROOT, 'lt', 'privatumas.html'),
      canonical: makeAbsoluteUrl('/lt/privatumas.html'),
      alternate: makeAbsoluteUrl('/en/privacy.html')
    },
    {
      locale: 'en',
      filePath: path.join(ROOT, 'en', 'privacy.html'),
      canonical: makeAbsoluteUrl('/en/privacy.html'),
      alternate: makeAbsoluteUrl('/lt/privatumas.html')
    }
  ];

  for (const check of privacyChecks) {
    if (!fs.existsSync(check.filePath)) {
      throw new Error(`Missing privacy page: ${check.filePath}`);
    }
    const html = fs.readFileSync(check.filePath, 'utf8');
    if (!html.includes(`<link rel="canonical" href="${check.canonical}">`)) {
      throw new Error(`Privacy ${check.locale}: canonical mismatch`);
    }
    if (!html.includes(`<link rel="alternate" hreflang="${check.locale}" href="${check.canonical}">`)) {
      throw new Error(`Privacy ${check.locale}: self hreflang mismatch`);
    }
    if (!html.includes(`<link rel="alternate" hreflang="${check.locale === 'lt' ? 'en' : 'lt'}" href="${check.alternate}">`)) {
      throw new Error(`Privacy ${check.locale}: alternate hreflang mismatch`);
    }
  }
}

function main() {
  writeEnPromptInlineJs(EN_PROMPT_BODIES);
  ensureDir(path.join(ROOT, 'lt'));
  ensureDir(path.join(ROOT, 'en'));
  const ltHtml = buildLocale('lt');
  const enHtml = buildLocale('en');
  assertLocaleStructure(ltHtml, 'lt');
  assertLocaleStructure(enHtml, 'en');
  fs.writeFileSync(path.join(ROOT, 'lt', 'index.html'), ltHtml, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'en', 'index.html'), enHtml, 'utf8');
  assertPrivacySeo();
  console.log('Built lt/index.html, en/index.html, js/en-prompt-bodies-inline.js (+ privacy SEO checks)');
}

main();
