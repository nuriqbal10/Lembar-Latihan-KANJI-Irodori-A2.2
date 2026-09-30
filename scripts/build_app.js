const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const svgDir = path.join(rootDir, 'assets', 'kanjivg');
const dataFile = path.join(rootDir, 'kanji_irodori_a2_2_data.json');
const kanjiData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// Extract stroke paths for all Kanji to power interactive stroke player
const kanjiStrokesMap = {};
kanjiData.forEach(ch => {
  ch.kanjiList.forEach(k => {
    if (!kanjiStrokesMap[k.kanji]) {
      const cp = k.kanji.codePointAt(0).toString(16).padStart(5, '0');
      const svgPath = path.join(svgDir, cp + '.svg');
      const strokes = [];
      if (fs.existsSync(svgPath)) {
        const content = fs.readFileSync(svgPath, 'utf-8');
        const regex = /<path[^>]+id="kvg:[^"]+-s\d+"[^>]+d="([^"]+)"/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
          strokes.push(match[1]);
        }
      }
      kanjiStrokesMap[k.kanji] = strokes;
    }
  });
});

console.log('Extracted stroke paths for all', Object.keys(kanjiStrokesMap).length, 'unique Kanji!');

// Box 1: Numbered Guidance SVG
function getGuidanceSvg(kanjiChar) {
  if (!kanjiChar) return '';
  const cp = kanjiChar.codePointAt(0).toString(16).padStart(5, '0');
  const svgPath = path.join(svgDir, cp + '.svg');
  if (!fs.existsSync(svgPath)) return `<div class="char-fallback">${kanjiChar}</div>`;
  let raw = fs.readFileSync(svgPath, 'utf-8');
  raw = raw.replace(/<\?xml[\s\S]*?<svg/i, '<svg').replace(/<!DOCTYPE[\s\S]*?>/i, '');
  const cross = `
    <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
    <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
  `;
  raw = raw.replace(/(<svg[^>]*>)/i, `$1${cross}`);
  raw = raw.replace(/stroke:#000000;stroke-width:3;/g, 'stroke:#1e293b;stroke-width:3.8;stroke-linecap:round;stroke-linejoin:round;');
  raw = raw.replace(/fill:#808080/g, 'fill:#e11d48;font-weight:bold;');
  raw = raw.replace(/font-size:8/g, 'font-size:10');
  return raw.replace('<svg ', '<svg class="kanji-svg guidance-svg" ');
}

// Box 2: Model SVG (Exact same size and stroke shape as guidance, solid dark ink, no numbers)
function getModelSvg(kanjiChar) {
  if (!kanjiChar) return '';
  const cp = kanjiChar.codePointAt(0).toString(16).padStart(5, '0');
  const svgPath = path.join(svgDir, cp + '.svg');
  if (!fs.existsSync(svgPath)) return `<div class="char-fallback">${kanjiChar}</div>`;
  let raw = fs.readFileSync(svgPath, 'utf-8');
  raw = raw.replace(/<\?xml[\s\S]*?<svg/i, '<svg').replace(/<!DOCTYPE[\s\S]*?>/i, '');
  raw = raw.replace(/<text[^>]*>.*?<\/text>/g, '');
  const cross = `
    <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
    <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
  `;
  raw = raw.replace(/(<svg[^>]*>)/i, `$1${cross}`);
  raw = raw.replace(/stroke:#000000;stroke-width:3;/g, 'stroke:#0f172a;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;');
  return raw.replace('<svg ', '<svg class="kanji-svg model-svg" ');
}

// Boxes 3, 4, 11, 12: Trace SVG (Exact same size and stroke shape, soft calm gray for muscle-memory tracing)
function getTraceSvg(kanjiChar) {
  if (!kanjiChar) return '';
  const cp = kanjiChar.codePointAt(0).toString(16).padStart(5, '0');
  const svgPath = path.join(svgDir, cp + '.svg');
  if (!fs.existsSync(svgPath)) return `<div class="char-fallback trace-char">${kanjiChar}</div>`;
  let raw = fs.readFileSync(svgPath, 'utf-8');
  raw = raw.replace(/<\?xml[\s\S]*?<svg/i, '<svg').replace(/<!DOCTYPE[\s\S]*?>/i, '');
  raw = raw.replace(/<text[^>]*>.*?<\/text>/g, '');
  const cross = `
    <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
    <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
  `;
  raw = raw.replace(/(<svg[^>]*>)/i, `$1${cross}`);
  raw = raw.replace(/stroke:#000000;stroke-width:3;/g, 'stroke:#94a3b8;stroke-width:3.8;stroke-linecap:round;stroke-linejoin:round;opacity:0.65;');
  return raw.replace('<svg ', '<svg class="kanji-svg trace-svg" ');
}

function buildIndexApp() {
  console.log("Building V5 Enhanced Web Application index.html with identical SVG Model/Trace, 20-Grid & Separate A/B Exercise Pages...");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IRODORI Kanji Studio A2.2 (Bab 1 - 18) | Lembar Latihan 20-Grid & Kuis Interaktif</title>
  <meta name="description" content="Lembar Latihan Kanji IRODORI A2.2 dengan font UD Digi Kyokasho, 20 Kotak Grid per Kanji, Ukuran Model & Jiplak Presisi, Halaman Latihan A & B Terpisah">

  <!-- Firebase SDK Compat -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>


  <style>
    
    /* AUDIO TTS & VOCAB PILL */
    .btn-voice-mini {
      position: absolute;
      bottom: 2px;
      right: 2px;
      background: var(--pastel-blue-bg);
      color: var(--pastel-blue-txt);
      border: 1px solid var(--pastel-blue-border);
      border-radius: 6px;
      font-size: 0.65rem;
      padding: 1px 4px;
      cursor: pointer;
      line-height: 1;
      transition: transform 0.15s ease;
      z-index: 5;
    }
    .btn-voice-mini:hover { transform: scale(1.15); background: #dbeafe; }

    .btn-voice-inline {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 0.85rem;
      padding: 0 3px;
      line-height: 1;
      opacity: 0.75;
      transition: opacity 0.15s, transform 0.15s;
    }
    .btn-voice-inline:hover { opacity: 1; transform: scale(1.2); }

    .vocab-pill {
      background: var(--clay-surface);
      padding: 3px 8px;
      border-radius: 8px;
      border: 1px solid var(--card-border);
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* GOOGLE SIGN IN & SENSEI DASHBOARD */
    .btn-google {
      width: 100%;
      background: #ffffff;
      color: #1e293b;
      border: 1.5px solid #cbd5e1;
      padding: 10px 14px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 14px;
      transition: background 0.15s, border-color 0.15s;
    }
    .btn-google:hover { background: #f8fafc; border-color: #94a3b8; }

    .auth-divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 12px 0 16px;
      color: var(--text-light);
      font-size: 0.75rem;
    }
    .auth-divider::before, .auth-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--card-border);
    }
    .auth-divider span { padding: 0 10px; }

    .btn-sensei {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.25);
    }
    .btn-sensei:hover { opacity: 0.95; transform: translateY(-1px); }

    .sensei-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin-top: 14px;
    }
    .sensei-table th {
      background: var(--clay-surface);
      padding: 10px 14px;
      text-align: left;
      font-weight: 800;
      color: var(--text-sub);
      border-bottom: 2px solid var(--card-border);
    }
    .sensei-table td {
      padding: 10px 14px;
      border-bottom: 1px solid var(--card-border);
    }

    /* 1. TYPOGRAPHY: STRICT UD DIGI KYOKASHO PRIORITY */
    @font-face {
      font-family: 'UD Digi Kyokasho Native';
      src: local('UD デジタル 教科書体 NP-R'),
           local('UD Digi Kyokasho NP-R'),
           local('UD デジタル 教科書体 NK-R'),
           local('UD Digi Kyokasho NK-R'),
           local('UD デジタル 教科書体 N-R'),
           local('UD Digi Kyokasho N-R'),
           local('UD デジタル 教科書体 NP-B'),
           local('UD Digi Kyokasho NP-B'),
           local('UD デジタル 教科書体'),
           local('UD Digi Kyokasho');
    }

    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=BIZ+UDPGothic:wght@400;700&family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');

    :root {
      --font-kyokasho: 'UD Digi Kyokasho Native', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体', 'UD Digi Kyokasho', 'BIZ UDPGothic', 'Zen Maru Gothic', 'Noto Sans JP', sans-serif;
      --font-body: 'UD Digi Kyokasho Native', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho NP-R', 'Plus Jakarta Sans', 'BIZ UDPGothic', sans-serif;

      --bg-base: #f0f4f8;
      --clay-card-bg: #ffffff;
      --clay-surface: #fdfbf7;
      --card-border: #e2e8f0;

      --pastel-blue-bg: #e8f0fe;
      --pastel-blue-txt: #1d4ed8;
      --pastel-blue-border: #bfdbfe;

      --pastel-rose-bg: #fde8ef;
      --pastel-rose-txt: #9d174d;
      --pastel-rose-border: #fbcfe8;

      --pastel-sage-bg: #e6f4ea;
      --pastel-sage-txt: #166534;
      --pastel-sage-border: #bbf7d0;

      --pastel-amber-bg: #fef3c7;
      --pastel-amber-txt: #92400e;
      --pastel-amber-border: #fde68a;

      --pastel-lavender-bg: #f3e8ff;
      --pastel-lavender-txt: #6b21a8;
      --pastel-lavender-border: #e9d5ff;

      --text-main: #1e293b;
      --text-sub: #475569;
      --text-light: #94a3b8;

      --grid-border: #94a3b8;
      --grid-cross: #cbd5e1;

      --clay-shadow-out: 6px 6px 16px rgba(185, 195, 210, 0.4), -4px -4px 12px #ffffff;
      --clay-shadow-pill: 3px 3px 8px rgba(185, 195, 210, 0.3), -2px -2px 6px #ffffff;
      --clay-shadow-in: inset 2px 2px 5px rgba(185, 195, 210, 0.35), inset -2px -2px 5px #ffffff;
    }

    body.dark-mode {
      --bg-base: #0b1120;
      --clay-card-bg: #1e293b;
      --clay-surface: #141e33;
      --card-border: #334155;

      --pastel-blue-bg: #1e3a8a;
      --pastel-blue-txt: #93c5fd;
      --pastel-blue-border: #2563eb;

      --pastel-rose-bg: #831843;
      --pastel-rose-txt: #fbcfe8;
      --pastel-rose-border: #db2777;

      --pastel-sage-bg: #14532d;
      --pastel-sage-txt: #86efac;
      --pastel-sage-border: #16a34a;

      --pastel-amber-bg: #78350f;
      --pastel-amber-txt: #fef08a;
      --pastel-amber-border: #d97706;

      --pastel-lavender-bg: #581c87;
      --pastel-lavender-txt: #e9d5ff;
      --pastel-lavender-border: #9333ea;

      --text-main: #f8fafc;
      --text-sub: #cbd5e1;
      --text-light: #64748b;

      --grid-border: #475569;
      --grid-cross: #334155;

      --clay-shadow-out: 6px 6px 18px rgba(0, 0, 0, 0.5), -3px -3px 10px rgba(255, 255, 255, 0.03);
      --clay-shadow-pill: 3px 3px 8px rgba(0, 0, 0, 0.4), -2px -2px 5px rgba(255, 255, 255, 0.02);
      --clay-shadow-in: inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.02);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-kyokasho);
      background-color: var(--bg-base);
      color: var(--text-main);
      line-height: 1.5;
      padding-bottom: 60px;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    /* Top App Bar */
    .app-header {
      background: var(--clay-card-bg);
      border-bottom: 1px solid var(--card-border);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
    }

    .header-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 10px 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .brand-section { display: flex; align-items: center; gap: 10px; }
    .brand-logo {
      width: 40px; height: 40px; border-radius: 12px;
      background: linear-gradient(135deg, #e0e7ff 0%, #fde8ef 100%);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; box-shadow: var(--clay-shadow-pill);
    }
    .brand-title { font-size: 1.15rem; font-weight: 800; color: var(--text-main); }
    .brand-subtitle { font-size: 0.72rem; font-weight: 600; color: var(--text-sub); }

    .nav-tabs {
      display: flex; gap: 6px;
      background: var(--clay-surface);
      padding: 4px; border-radius: 30px;
      box-shadow: var(--clay-shadow-in);
    }

    .tab-btn {
      border: none; background: transparent;
      padding: 7px 14px; border-radius: 20px;
      font-family: inherit; font-size: 0.82rem; font-weight: 700;
      color: var(--text-sub); cursor: pointer;
      display: flex; align-items: center; gap: 5px;
    }
    .tab-btn:hover { color: var(--text-main); }
    .tab-btn.active {
      background: var(--clay-card-bg); color: #2563eb;
      box-shadow: var(--clay-shadow-pill);
    }

    .header-controls { display: flex; align-items: center; gap: 8px; }
    .select-bab {
      padding: 7px 12px; border-radius: 16px;
      border: 1px solid var(--card-border); background-color: var(--clay-card-bg);
      font-family: inherit; font-size: 0.82rem; font-weight: 700;
      color: var(--text-main); box-shadow: var(--clay-shadow-pill); outline: none;
    }

    .btn-action {
      padding: 7px 14px; border-radius: 16px; border: none;
      font-family: inherit; font-size: 0.82rem; font-weight: 700;
      cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
    }

    .btn-print { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; }
    .btn-theme { background: var(--clay-card-bg); color: var(--text-main); border: 1px solid var(--card-border); }
    .btn-auth { background: linear-gradient(135deg, #10b981, #059669); color: white; }

    .user-pill {
      display: flex; align-items: center; gap: 6px; padding: 4px 10px 4px 6px;
      border-radius: 20px; background: var(--pastel-blue-bg); border: 1px solid var(--pastel-blue-border);
      color: var(--pastel-blue-txt); font-size: 0.78rem; font-weight: 700; cursor: pointer;
    }
    .user-avatar {
      width: 24px; height: 24px; border-radius: 50%;
      background: #2563eb; color: white; display: flex;
      align-items: center; justify-content: center; font-size: 11px;
    }

    .app-main { max-width: 1200px; margin: 18px auto; padding: 0 14px; }
    .tab-content { display: none; }
    .tab-content.active { display: block; animation: fadeIn 0.25s ease; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .hero-banner {
      background: var(--clay-card-bg); border-radius: 20px; padding: 16px 22px;
      margin-bottom: 18px; box-shadow: var(--clay-shadow-out); border: 1px solid var(--card-border);
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;
    }
    .hero-text h2 { font-size: 1.2rem; font-weight: 800; color: var(--text-main); margin-bottom: 2px; }
    .hero-text p { font-size: 0.84rem; color: var(--text-sub); max-width: 650px; }
    .hero-stats { display: flex; gap: 8px; }
    .stat-pill {
      background: var(--pastel-blue-bg); border: 1px solid var(--pastel-blue-border);
      color: var(--pastel-blue-txt); padding: 6px 12px; border-radius: 12px; text-align: center;
    }
    .stat-num { font-size: 1.1rem; font-weight: 800; display: block; }
    .stat-lbl { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }

    /* WORKSHEET PAGE */
    .worksheet-page {
      background: var(--clay-card-bg); border-radius: 20px; padding: 22px 24px;
      margin-bottom: 28px; box-shadow: var(--clay-shadow-out); border: 1px solid var(--card-border);
      position: relative;
    }

    .sheet-header { border-bottom: 2px dashed var(--card-border); padding-bottom: 12px; margin-bottom: 16px; }
    .curriculum-tag {
      display: inline-block; font-size: 0.68rem; font-weight: 800; text-transform: uppercase;
      color: var(--pastel-blue-txt); background-color: var(--pastel-blue-bg); border: 1px solid var(--pastel-blue-border);
      padding: 3px 10px; border-radius: 10px; margin-bottom: 4px;
    }
    .sheet-title { font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 2px; }
    .sheet-subtitle { font-size: 0.86rem; font-weight: 600; color: var(--text-sub); margin-bottom: 10px; }

    .student-info-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
      background-color: var(--clay-surface); border-radius: 12px; padding: 8px 12px; border: 1px solid var(--card-border);
    }
    .info-field { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 600; color: var(--text-sub); }
    .info-field .line { flex: 1; border-bottom: 1.5px dotted var(--text-light); height: 12px; }
    .score-box { font-weight: 800; color: var(--text-main); background: var(--clay-card-bg); padding: 2px 8px; border-radius: 6px; border: 1px solid var(--card-border); }

    /* KANJI UNIT: 20-GRID LAYOUT */
    .kanji-unit {
      background: var(--clay-card-bg); border-radius: 16px; border: 1px solid var(--card-border);
      padding: 14px 16px; margin-bottom: 16px; box-shadow: var(--clay-shadow-pill);
      page-break-inside: avoid;
    }

    .kanji-header { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
    .kanji-hero {
      width: 60px; height: 60px; border-radius: 14px; background: var(--clay-card-bg);
      border: 1.5px solid var(--card-border); display: flex; align-items: center; justify-content: center;
      font-size: 2.3rem; font-weight: 800; color: var(--text-main); box-shadow: var(--clay-shadow-pill);
      position: relative;
    }
    .kanji-hero::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; border-top: 1px dashed var(--grid-cross); }
    .kanji-hero::after { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; border-left: 1px dashed var(--grid-cross); }

    .kanji-meta { flex: 1; }
    .kanji-readings { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
    .reading-tag { font-size: 0.74rem; font-weight: 700; padding: 2px 8px; border-radius: 8px; }
    .tag-on { background: var(--pastel-rose-bg); color: var(--pastel-rose-txt); border: 1px solid var(--pastel-rose-border); }
    .tag-kun { background: var(--pastel-blue-bg); color: var(--pastel-blue-txt); border: 1px solid var(--pastel-blue-border); }
    .tag-stroke { background: var(--pastel-amber-bg); color: var(--pastel-amber-txt); border: 1px solid var(--pastel-amber-border); }
    .tag-radical { background: var(--pastel-lavender-bg); color: var(--pastel-lavender-txt); border: 1px solid var(--pastel-lavender-border); }
    .kanji-meaning { font-size: 0.95rem; font-weight: 800; color: var(--text-main); }
    .stroke-rule { font-size: 0.76rem; color: var(--text-sub); }

    .btn-animate-stroke {
      font-size: 0.75rem; font-weight: 700; color: #e11d48; background: var(--pastel-rose-bg);
      border: 1px solid var(--pastel-rose-border); padding: 4px 10px; border-radius: 10px;
      cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
    }
    .btn-animate-stroke:hover { background: #e11d48; color: white; }

    /* 20-GRID WRITING SECTION */
    .writing-grid-section-20 { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
    .grid-boxes-10-row { display: grid; grid-template-columns: repeat(10, 1fr); gap: 5px; }

    .tianzige-box {
      aspect-ratio: 1 / 1; border: 1.5px solid var(--grid-border); border-radius: 8px;
      position: relative; display: flex; align-items: center; justify-content: center;
      background: var(--clay-card-bg); box-shadow: var(--clay-shadow-pill); user-select: none;
      overflow: hidden;
    }
    .tianzige-box::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; border-top: 1px dashed var(--grid-cross); }
    .tianzige-box::after { content: ''; position: absolute; left: 50%; top: 0; bottom: 0; border-left: 1px dashed var(--grid-cross); }

    /* Clean In-Box Tags (Never overlaps or breaks layout!) */
    .box-tag {
      position: absolute;
      top: 2px;
      left: 3px;
      font-size: 0.62rem;
      font-weight: 800;
      color: var(--text-sub);
      z-index: 5;
      line-height: 1;
      pointer-events: none;
    }
    .guidance-box .box-tag { color: #dc2626; }
    .model-box .box-tag { color: #2563eb; }

    /* SVG Character Styling inside boxes: 100% Identical Size! */
    .kanji-svg {
      width: 90% !important;
      height: 90% !important;
      z-index: 2;
    }

    .guidance-box { background: var(--clay-surface); border-color: #f43f5e; border-width: 2px; cursor: pointer; }
    .model-box { border-color: #2563eb; border-width: 2px; }

    /* Ruled Writing Line for Print Utilization */
    .ruled-writing-row {
      margin-top: 8px; padding-top: 6px; border-top: 1px dotted var(--card-border);
      display: flex; flex-direction: column; gap: 5px; font-size: 0.78rem;
    }
    .ruled-item { display: flex; align-items: baseline; gap: 8px; }
    .ruled-lbl { font-weight: 700; color: var(--text-sub); white-space: nowrap; font-size: 0.75rem; }
    .ruled-line { flex: 1; border-bottom: 1.5px dotted var(--grid-cross); height: 14px; }

    /* SEPARATE EXERCISE PAGES FOR A & B */
    .exercise-page-card {
      background: var(--clay-card-bg);
      border-radius: 20px;
      padding: 24px 28px;
      margin-bottom: 30px;
      border: 1px solid var(--card-border);
      box-shadow: var(--clay-shadow-out);
      position: relative;
    }

    .page-exercise-b {
      page-break-before: always;
      break-before: page;
    }

    .exercise-page-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 4px;
    }

    .exercise-grid-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: 14px;
    }

    .exercise-list-item {
      background: var(--clay-surface);
      border-radius: 12px;
      padding: 10px 14px;
      border: 1px solid var(--card-border);
      font-size: 0.92rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .exercise-q-text { font-size: 0.95rem; font-weight: 600; color: var(--text-main); }
    .answer-key {
      display: inline-block; font-size: 0.78rem; font-weight: 700;
      color: var(--pastel-rose-txt); background: var(--pastel-rose-bg);
      border: 1px solid var(--pastel-rose-border); padding: 2px 8px; border-radius: 6px;
      align-self: flex-start;
    }

    /* PURE SVG ANIMATION CANVAS */
    #animCanvasWrap {
      width: 190px; height: 190px; margin: 0 auto 14px;
      background: var(--clay-surface); border-radius: 18px; border: 2px solid var(--card-border);
      position: relative; overflow: hidden; box-shadow: var(--clay-shadow-pill);
    }
    #animCanvasSvg { width: 100%; height: 100%; }
    .stroke-path {
      fill: none; stroke-width: 4.2; stroke-linecap: round; stroke-linejoin: round;
      transition: stroke 0.3s ease, opacity 0.3s ease;
    }
    @keyframes drawStrokeAnim {
      from { stroke-dashoffset: var(--stroke-len); }
      to { stroke-dashoffset: 0; }
    }
    .stroke-drawing {
      stroke: #e11d48 !important; stroke-width: 5 !important;
      animation: drawStrokeAnim 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    /* MODAL */
    .modal-backdrop {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(6px);
      z-index: 2000; display: none; align-items: center; justify-content: center; padding: 16px;
    }
    .modal-card {
      background: var(--clay-card-bg); border: 1px solid var(--card-border); border-radius: 24px;
      max-width: 480px; width: 100%; padding: 26px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
      position: relative;
    }
    .modal-close {
      position: absolute; top: 14px; right: 16px; border: none; background: transparent;
      font-size: 20px; color: var(--text-sub); cursor: pointer;
    }
    .input-field {
      width: 100%; padding: 10px 14px; border-radius: 12px; border: 1px solid var(--card-border);
      background: var(--clay-surface); color: var(--text-main); font-family: inherit; font-size: 0.9rem;
      margin-top: 5px; margin-bottom: 12px; outline: none;
    }

    /* Content Lock */
    .locked-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.78); backdrop-filter: blur(8px); border-radius: 20px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      z-index: 50; padding: 30px; text-align: center; color: white;
    }
    .lock-icon-circle {
      width: 64px; height: 64px; border-radius: 50%;
      background: linear-gradient(135deg, #f43f5e, #be123c); display: flex;
      align-items: center; justify-content: center; font-size: 28px; margin-bottom: 14px;
    }

    /* KANJI EXPLORER & KAMUS */
    .explorer-search-bar { margin-bottom: 20px; display: flex; gap: 10px; }
    .search-input {
      flex: 1; padding: 10px 16px; border-radius: 16px; border: 1px solid var(--card-border);
      background: var(--clay-card-bg); color: var(--text-main); font-family: inherit; font-size: 0.9rem;
      outline: none; box-shadow: var(--clay-shadow-pill);
    }
    .explorer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
    .explorer-card {
      background: var(--clay-card-bg); border-radius: 16px; padding: 16px;
      border: 1px solid var(--card-border); box-shadow: var(--clay-shadow-pill);
      display: flex; flex-direction: column; gap: 8px;
    }
    .explorer-top { display: flex; align-items: center; justify-content: space-between; }
    .exp-char { font-size: 2.4rem; font-weight: 800; color: var(--text-main); cursor: pointer; }

    /* DOWNLOAD CENTER */
    .download-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 14px; }
    .dl-card {
      background: var(--clay-card-bg); border-radius: 16px; padding: 16px;
      border: 1px solid var(--card-border); box-shadow: var(--clay-shadow-pill);
      display: flex; flex-direction: column; justify-content: space-between; gap: 12px;
    }
    .dl-card-title { font-size: 0.98rem; font-weight: 800; color: var(--text-main); }
    .dl-card-sub { font-size: 0.78rem; color: var(--text-sub); }
    .dl-actions { display: flex; gap: 8px; }
    .btn-dl-docx {
      flex: 1; padding: 7px 10px; border-radius: 10px; background: var(--pastel-blue-bg);
      color: var(--pastel-blue-txt); border: 1px solid var(--pastel-blue-border);
      font-weight: 700; font-size: 0.78rem; text-align: center; text-decoration: none;
    }
    .btn-dl-html {
      flex: 1; padding: 7px 10px; border-radius: 10px; background: var(--pastel-rose-bg);
      color: var(--pastel-rose-txt); border: 1px solid var(--pastel-rose-border);
      font-weight: 700; font-size: 0.78rem; text-align: center; text-decoration: none;
    }

    /* =======================================================
       PRINT MEDIA OPTIMIZATION (STRICT A4 WITH DEDICATED PAGES)
       ======================================================= */
    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }

    @media print {
      body {
        background: #ffffff !important;
        color: #000000 !important;
        padding: 0 !important;
        font-family: var(--font-kyokasho) !important;
      }

      .app-header, .hero-banner, .no-print, .locked-overlay, .btn-animate-stroke {
        display: none !important;
      }

      .app-main { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
      #tab-worksheets { display: block !important; }
      #tab-quiz, #tab-progress, #tab-explorer, #tab-downloads { display: none !important; }

      .worksheet-page {
        box-shadow: none !important; border: none !important; padding: 0 !important;
        margin-bottom: 12mm !important; page-break-after: always !important;
      }

      .exercise-page-card {
        box-shadow: none !important; border: none !important; padding: 0 !important;
        margin-bottom: 12mm !important; page-break-after: always !important;
      }

      .page-exercise-b {
        page-break-before: always !important;
        break-before: page !important;
      }

      .kanji-unit {
        box-shadow: none !important; border: 1.5px solid #94a3b8 !important;
        padding: 10px 12px !important; margin-bottom: 12px !important;
        page-break-inside: avoid !important;
      }

      .tianzige-box { box-shadow: none !important; border: 1.2px solid #64748b !important; }
      .guidance-box { border: 1.8px solid #dc2626 !important; }
      .model-box { border: 1.8px solid #2563eb !important; }

      .ruled-writing-row { display: flex !important; border-top: 1px dashed #94a3b8 !important; }
      .ruled-line { border-bottom: 1.5px dotted #64748b !important; }

      .exercise-list-item {
        background: #ffffff !important;
        border: 1px solid #94a3b8 !important;
        page-break-inside: avoid !important;
      }

      .answer-key { display: none !important; }
    }

    @media (max-width: 768px) {
      .grid-boxes-10-row { grid-template-columns: repeat(5, 1fr); }
      .student-info-grid { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>

  <!-- Top App Bar -->
  <header class="app-header no-print">
    <div class="header-container">
      <div class="brand-section">
        <div class="brand-logo">⛩️</div>
        <div>
          <h1 class="brand-title">IRODORI Kanji Studio</h1>
          <div class="brand-subtitle">Kurikulum JFT-Basic A2.2 • Bab 1 s.d. 18 (UD Digi Kyokasho)</div>
        </div>
      </div>

      <nav class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('worksheets')">📑 Lembar Kerja</button>
        <button class="tab-btn" onclick="switchTab('quiz')">⚡ Kuis Mandiri</button>
        <button class="tab-btn" onclick="switchTab('progress')">📊 Progres Belajar</button>
        <button class="tab-btn" onclick="switchTab('explorer')">🔍 Kamus Kanji</button>
        <button class="tab-btn" onclick="switchTab('downloads')">📥 Unduh Berkas</button>
      </nav>

      <div class="header-controls">
        <select id="babSelector" class="select-bab" onchange="handleBabChange(this.value)">
          <option value="all">Semua Bab (1 - 18)</option>
          ${kanjiData.map(d => `<option value="${d.bab}">Bab ${d.bab}: ${d.titleJp.split(' ')[1] || d.titleId}</option>`).join('')}
        </select>
        <button class="btn-action btn-print" onclick="window.print()">🖨️ Cetak A4</button>
        <button class="btn-action btn-theme" onclick="toggleTheme()" id="themeBtn" title="Ganti Mode Gelap / Terang">🌙</button>
        <div id="senseiButtonContainer" style="display:none;">
          <button class="btn-sensei" onclick="openSenseiDashboard()">👑 Rekap Siswa</button>
        </div>
        <div id="authProfileContainer">
          <button class="btn-action btn-auth" onclick="openAuthModal('login')" style="background:#2563eb;color:#ffffff;font-weight:700;box-shadow:0 2px 8px rgba(37,99,235,0.35);">
            🔑 Masuk Siswa
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Application Body -->
  <main class="app-main">

    <!-- Hero Banner -->
    <div class="hero-banner no-print">
      <div class="hero-text">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span class="curriculum-tag" id="userStatusTag">Status: Akses Tamu (Bab 1 - 2)</span>
        </div>
        <h2>🎌 Studio Latihan Kanji 20-Grid IRODORI (UD Digi Kyokasho)</h2>
        <p>
          Model & Jiplak presisi vektor identik 100%, 20 Kotak Tianzige (2 Baris), animasi goresan interaktif, 
          serta <strong>Halaman Latihan A & B yang terpisah rapi saat dicetak</strong>.
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat-pill">
          <span class="stat-num" id="statMasteredCount">0</span>
          <span class="stat-lbl">Kanji Dikuasai</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">18</span>
          <span class="stat-lbl">Bab Lengkap</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">20</span>
          <span class="stat-lbl">Kotak / Kanji</span>
        </div>
      </div>
    </div>

    <!-- TAB 1: LEMBAR LATIHAN KERJA (WORKSHEETS) -->
    <section id="tab-worksheets" class="tab-content active">
      ${kanjiData.map(ch => `
        <!-- 1. HALAMAN TARGET KANJI (20-GRID) -->
        <div class="worksheet-page" id="sheet-bab-${ch.bab}" data-bab="${ch.bab}">
          
          ${ch.bab > 2 ? `
            <div class="locked-overlay" id="lock-overlay-${ch.bab}">
              <div class="lock-icon-circle">🔒</div>
              <h3 style="font-size:1.35rem;font-weight:800;margin-bottom:8px;">Bab ${ch.bab} Terkunci</h3>
              <p style="font-size:0.9rem;max-width:440px;color:#cbd5e1;margin-bottom:20px;">
                Materi Bab 3 s.d. 18 dibatasi untuk pengguna terdaftar. Silakan Masuk atau Buat Akun Siswa (Gratis) untuk membuka seluruh 18 Bab!
              </p>
              <div style="display:flex;gap:10px;">
                <button class="btn-action btn-auth" style="padding:10px 20px;font-size:0.9rem;" onclick="openAuthModal('login')">
                  🔑 Masuk Akun
                </button>
                <button class="btn-action" style="background:#ffffff;color:#1e293b;padding:10px 20px;font-size:0.9rem;" onclick="openAuthModal('register')">
                  📝 Daftar Siswa Baru
                </button>
              </div>
            </div>
          ` : ''}

          <div class="sheet-header">
            <div class="curriculum-tag">IRODORI: Nihongo de Kurashito Kotoba • 初級2 (A2.2 / JFT-Basic)</div>
            <h2 class="sheet-title">${ch.titleJp}</h2>
            <div class="sheet-subtitle">${ch.titleId} — Topik: ${ch.topic}</div>

            <div class="student-info-grid">
              <div class="info-field"><span class="label">Nama:</span><span class="line" id="infoStudentName"></span></div>
              <div class="info-field"><span class="label">Tanggal:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Kelas:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Nilai:</span><span class="score-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 100</span></div>
            </div>
          </div>

          <!-- Daftar Kanji Unit (20-Grid) -->
          <div class="kanji-list-container">
            ${ch.kanjiList.map(k => `
              <div class="kanji-unit">
                
                <div class="kanji-header">
                  <div class="kanji-hero">
                    <span>${k.kanji}</span>
                    <button class="btn-voice-mini no-print" onclick="event.stopPropagation(); speakJapanese('${k.kanji}')" title="Dengarkan Pengucapan Kanji">🔊</button>
                  </div>
                  <div class="kanji-meta">
                    <div class="kanji-readings">
                      <span class="reading-tag tag-on">音: ${k.on}</span>
                      <span class="reading-tag tag-kun">訓: ${k.kun}</span>
                      <span class="reading-tag tag-stroke">Goresan: ${k.strokes} 画</span>
                      <span class="reading-tag tag-radical">Radikal: ${k.radical}</span>
                    </div>
                    <div class="kanji-meaning">Arti: ${k.meaning}</div>
                    <div class="stroke-rule">Urutan goresan: ${k.strokeRule}</div>
                  </div>
                  <div class="no-print">
                    <button class="btn-animate-stroke" onclick="playStrokeAnimation('${k.kanji}', '${k.meaning}', ${k.strokes})">
                      ▶️ Putar Animasi
                    </button>
                  </div>
                </div>

                <div class="kanji-details-row" style="font-size:0.82rem;margin-bottom:6px;">
                  <span style="font-weight:700;color:var(--text-sub);min-width:70px;">Kosakata:</span>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    ${k.words.map(w => `
                      <span class="vocab-pill">
                        <strong>${w.word}</strong> (${w.reading}): ${w.meaning}
                        <button class="btn-voice-inline no-print" onclick="event.stopPropagation(); speakJapanese('${w.word}')" title="Dengarkan kata">🔊</button>
                      </span>
                    `).join('')}
                  </div>
                </div>

                <div class="kanji-details-row" style="font-size:0.82rem;margin-bottom:10px;">
                  <span style="font-weight:700;color:var(--text-sub);min-width:70px;">Contoh:</span>
                  <div>
                    <div style="display:flex;align-items:center;gap:6px;">
                      <span style="font-weight:700;color:var(--text-main);">${k.sentenceFurigana}</span>
                      <button class="btn-voice-inline no-print" onclick="event.stopPropagation(); speakJapanese('${k.sentenceFurigana.replace(/\[.*?\]/g, '')}')" title="Dengarkan kalimat">🔊</button>
                    </div>
                    <span style="font-style:italic;color:var(--text-sub);display:block;font-size:0.78rem;">"${k.sentenceId}"</span>
                  </div>
                </div>

                <!-- 20-GRID WRITING SECTION -->
                <div class="writing-grid-section-20">
                  
                  <!-- Baris 1: 10 Kotak -->
                  <div class="grid-boxes-10-row">
                    <div class="tianzige-box guidance-box" onclick="playStrokeAnimation('${k.kanji}', '${k.meaning}', ${k.strokes})" title="Klik untuk putar animasi">
                      <span class="box-tag">① Urutan</span>
                      ${getGuidanceSvg(k.kanji)}
                    </div>
                    <div class="tianzige-box model-box" title="Huruf contoh tebal (Kyoukasho)">
                      <span class="box-tag">② Contoh</span>
                      ${getModelSvg(k.kanji)}
                    </div>
                    <div class="tianzige-box trace-box" title="Jiplak / Trace 1">
                      <span class="box-tag">③ Jiplak</span>
                      ${getTraceSvg(k.kanji)}
                    </div>
                    <div class="tianzige-box trace-box" title="Jiplak / Trace 2">
                      <span class="box-tag">④ Jiplak</span>
                      ${getTraceSvg(k.kanji)}
                    </div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑤</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑥</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑦</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑧</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑨</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑩</span></div>
                  </div>

                  <!-- Baris 2: 10 Kotak Penguatan (Total 20 Kotak!) -->
                  <div class="grid-boxes-10-row" style="margin-top: 5px;">
                    <div class="tianzige-box trace-box" title="Jiplak / Trace 3">
                      <span class="box-tag">⑪ Jiplak</span>
                      ${getTraceSvg(k.kanji)}
                    </div>
                    <div class="tianzige-box trace-box" title="Jiplak / Trace 4">
                      <span class="box-tag">⑫ Jiplak</span>
                      ${getTraceSvg(k.kanji)}
                    </div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑬</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑭</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑮</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑯</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑰</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑱</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑲</span></div>
                    <div class="tianzige-box practice-box"><span class="box-tag">⑳</span></div>
                  </div>

                  <!-- Baris Latihan Menulis saat Dicetak -->
                  <div class="ruled-writing-row">
                    <div class="ruled-item">
                      <span class="ruled-lbl">✏️ Tulis Kata (${k.words[0] ? k.words[0].word : k.kanji}):</span>
                      <span class="ruled-line"></span>
                      <span class="ruled-line"></span>
                    </div>
                    <div class="ruled-item">
                      <span class="ruled-lbl">💬 Salin Kalimat:</span>
                      <span class="ruled-line"></span>
                    </div>
                  </div>

                </div>

              </div>
            `).join('')}
          </div>

        </div>

        <!-- 2. HALAMAN TERPISAH: LATIHAN MEMBACA (BAGIAN A) -->
        <div class="exercise-page-card page-exercise-a" id="sheet-bab-${ch.bab}-ex-a" data-bab="${ch.bab}">
          <div class="sheet-header">
            <div class="curriculum-tag">IRODORI A2.2 • Bab ${ch.bab} - Lembar Evaluasi</div>
            <h2 class="exercise-page-title">📖 A. Latihan Membaca (10 Soal): Tuliskan cara baca (Hiragana) dari Kanji dalam tanda [ ]!</h2>
            <div class="sheet-subtitle">${ch.titleJp} (${ch.titleId})</div>

            <div class="student-info-grid">
              <div class="info-field"><span class="label">Nama:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Tanggal:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Kelas:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Nilai Bagian A:</span><span class="score-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 50</span></div>
            </div>
          </div>

          <div class="exercise-grid-list">
            ${ch.readingExercise.map((ex, idx) => `
              <div class="exercise-list-item">
                <div class="exercise-q-text">(${idx + 1}) ${ex.q}</div>
                <div class="answer-key" style="margin-top:4px;">Jawaban: ${ex.a}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- 3. HALAMAN TERPISAH: LATIHAN MENULIS (BAGIAN B - DEDICATED NEW PAGE) -->
        <div class="exercise-page-card page-exercise-b" id="sheet-bab-${ch.bab}-ex-b" data-bab="${ch.bab}">
          <div class="sheet-header">
            <div class="curriculum-tag" style="background:var(--pastel-amber-bg);color:var(--pastel-amber-txt);border-color:var(--pastel-amber-border);">
              IRODORI A2.2 • Bab ${ch.bab} - Lembar Evaluasi Menulis
            </div>
            <h2 class="exercise-page-title">✏️ B. Latihan Menulis (10 Soal): Tuliskan huruf Kanji dari kata yang berada di dalam [ ]!</h2>
            <div class="sheet-subtitle">${ch.titleJp} (${ch.titleId})</div>

            <div class="student-info-grid">
              <div class="info-field"><span class="label">Nama:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Tanggal:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Kelas:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Nilai Bagian B:</span><span class="score-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 50</span></div>
            </div>
          </div>

          <div class="exercise-grid-list">
            ${ch.writingExercise.map((ex, idx) => `
              <div class="exercise-list-item">
                <div class="exercise-q-text">(${idx + 1}) ${ex.q}</div>
                <div class="answer-key" style="margin-top:4px;">Jawaban: ${ex.a}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </section>

    <!-- TAB 2: KUIS INTERAKTIF -->
    <section id="tab-quiz" class="tab-content">
      <div style="background:var(--clay-card-bg);border-radius:20px;padding:22px;box-shadow:var(--clay-shadow-out);border:1px solid var(--card-border);margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
          <div>
            <h2 style="font-size:1.25rem;font-weight:800;color:var(--text-main);">⚡ Mode Kuis Interaktif IRODORI</h2>
            <p style="font-size:0.86rem;color:var(--text-sub);">Ketikkan jawaban Anda lalu klik 'Cek' untuk evaluasi instan!</p>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="stat-pill" style="padding:6px 14px;">
              <span id="quizScoreText" class="stat-num" style="font-size:1.1rem;color:#2563eb;">0 / 20</span>
              <span class="stat-lbl">Skor Bab</span>
            </div>
            <button class="btn-action" style="background:var(--clay-surface);color:var(--text-main);" onclick="resetQuiz()">🔄 Reset</button>
          </div>
        </div>

        <div id="quizContainer"></div>
      </div>
    </section>

    <!-- TAB 3: DASHBOARD PROGRES BELAJAR SISWA -->
    <section id="tab-progress" class="tab-content">
      <div style="background:var(--clay-card-bg);border-radius:20px;padding:22px;border:1px solid var(--card-border);box-shadow:var(--clay-shadow-out);margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
          <div>
            <h2 style="font-size:1.25rem;font-weight:800;color:var(--text-main);">📊 Dashboard Progres Belajar Siswa</h2>
            <p style="font-size:0.86rem;color:var(--text-sub);">Pantau perkembangan penguasaan Kanji dan riwayat nilai kuis Anda.</p>
          </div>
          <div id="progressUserBadge"></div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:22px;">
          <div class="stat-pill" style="padding:12px;">
            <span class="stat-num" id="dashTotalMastered">0 / 226</span>
            <span class="stat-lbl">Kanji Dikuasai</span>
          </div>
          <div class="stat-pill" style="padding:12px;background:var(--pastel-sage-bg);color:var(--pastel-sage-txt);border-color:var(--pastel-sage-border);">
            <span class="stat-num" id="dashCompletedBab">0 / 18</span>
            <span class="stat-lbl">Bab Selesai</span>
          </div>
          <div class="stat-pill" style="padding:12px;background:var(--pastel-amber-bg);color:var(--pastel-amber-txt);border-color:var(--pastel-amber-border);">
            <span class="stat-num" id="dashAvgScore">0%</span>
            <span class="stat-lbl">Rata-rata Nilai</span>
          </div>
        </div>

        <h3 style="font-size:1.02rem;font-weight:800;color:var(--text-main);margin-bottom:10px;">Daftar Capaian per Bab:</h3>
        <div id="progressBabList" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(250px, 1fr));gap:10px;"></div>
      </div>
    </section>

    <!-- TAB 4: KAMUS KANJI & EKSPLORASI -->
    <section id="tab-explorer" class="tab-content">
      <div class="explorer-search-bar">
        <input type="text" id="explorerSearchInput" class="search-input" placeholder="🔍 Cari Kanji berdasarkan huruf, cara baca, bab, atau arti bahasa Indonesia..." oninput="handleKanjiSearch(this.value)">
      </div>
      <div class="explorer-grid" id="explorerGrid"></div>
    </section>

    <!-- TAB 5: PUSAT UNDUHAN BERKAS -->
    <section id="tab-downloads" class="tab-content">
      <div style="margin-bottom:18px;">
        <h2 style="font-size:1.25rem;font-weight:800;color:var(--text-main);margin-bottom:4px;">📥 Pusat Unduhan Berkas Lengkap</h2>
        <p style="font-size:0.86rem;color:var(--text-sub);">Unduh berkas Microsoft Word (.docx) siap cetak & edit, atau berkas HTML mandiri.</p>
      </div>

      <div style="background:linear-gradient(135deg, #e0e7ff, #fde8ef);border-radius:20px;padding:20px;margin-bottom:18px;box-shadow:var(--clay-shadow-out);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;">
        <div>
          <span class="curriculum-tag" style="background:#ffffff;">Master Bundle</span>
          <h3 style="font-size:1.15rem;font-weight:800;color:#1e293b;margin:4px 0;">Paket Lengkap Seluruh Bab 1 s.d. 18 (All-in-One)</h3>
          <p style="font-size:0.84rem;color:#475569;">Berisi seluruh 226 Kanji lengkap dengan diagram 20-grid Tianzige & 360 latihan soal.</p>
        </div>
        <div style="display:flex;gap:8px;">
          <a href="Lembar%20Latihan%20Kanji/Lembar_Latihan_Kanji_IRODORI_A2.2_Lengkap.docx" class="btn-action btn-print" download>
            📄 Unduh Master Word (1.2 MB)
          </a>
          <a href="Lembar%20Latihan%20Kanji/Lembar_Latihan_Kanji_IRODORI_A2.2.html" class="btn-action" style="background:#ffffff;color:#1e293b;" target="_blank">
            🌐 Buka Master HTML
          </a>
        </div>
      </div>

      <div class="download-grid">
        ${kanjiData.map(ch => `
          <div class="dl-card">
            <div>
              <span class="curriculum-tag" style="font-size:0.65rem;">Bab ${ch.bab}</span>
              <div class="dl-card-title">${ch.titleJp}</div>
              <div class="dl-card-sub">${ch.titleId}</div>
              <div style="font-size:0.75rem;color:var(--text-light);margin-top:4px;">
                ${ch.kanjiList.length} Kanji • 20 Kotak/Kanji • 20 Soal
              </div>
            </div>

            <div class="dl-actions">
              <a href="Lembar%20Latihan%20Kanji/Lembar_Latihan_Kanji_Bab_${String(ch.bab).padStart(2, '0')}.docx" class="btn-dl-docx" download>
                📄 Word (.docx)
              </a>
              <a href="Lembar%20Latihan%20Kanji/Lembar_Latihan_Kanji_Bab_${ch.bab}.html" class="btn-dl-html" target="_blank">
                🌐 Buka HTML
              </a>
            </div>
          </div>
        `).join('')}
      </div>
    </section>

  </main>

    <!-- AUTH MODAL (FIREBASE) -->
  <div class="modal-backdrop" id="authModal">
    <div class="modal-card" style="max-width:440px;">
      <button class="modal-close" onclick="closeAuthModal()">✕</button>
      <div style="display:flex;gap:8px;margin-bottom:18px;border-bottom:1px solid var(--card-border);padding-bottom:8px;">
        <button id="authTabLogin" class="tab-btn active" onclick="switchAuthMode('login')">🔑 Masuk Akun</button>
        <button id="authTabRegister" class="tab-btn" onclick="switchAuthMode('register')">📝 Daftar Siswa Baru</button>
      </div>

      <!-- GOOGLE SIGN IN BUTTON -->
      <button class="btn-google" onclick="handleGoogleSignIn()">
        <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.79l7.98-6.2z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        Masuk Cepat dengan Google
      </button>

      <div class="auth-divider"><span>atau dengan Email</span></div>

      <div id="loginFormSection">
        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Alamat Email</label>
        <input type="email" id="loginEmail" class="input-field" placeholder="nama@email.com">
        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Password</label>
        <input type="password" id="loginPassword" class="input-field" placeholder="Ketik password..." onkeydown="if(event.key==='Enter') handleLoginSubmit()">
        <div style="display:flex;justify-content:flex-end;margin-top:-6px;margin-bottom:12px;">
          <a href="javascript:void(0)" onclick="handleForgotPassword()" style="font-size:0.75rem;color:#2563eb;text-decoration:none;">Lupa password?</a>
        </div>
        <button class="btn-action btn-print" style="width:100%;justify-content:center;padding:10px;" onclick="handleLoginSubmit()">Masuk Sekarang</button>
      </div>

      <div id="registerFormSection" style="display:none;">
        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Nama Lengkap Siswa</label>
        <input type="text" id="regFullName" class="input-field" placeholder="Contoh: Budi Pratama">
        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Alamat Email</label>
        <input type="email" id="regEmail" class="input-field" placeholder="nama@email.com">
        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Password (Minimal 6 karakter)</label>
        <input type="password" id="regPassword" class="input-field" placeholder="Buat password..." onkeydown="if(event.key==='Enter') handleRegisterSubmit()">
        <button class="btn-action btn-auth" style="width:100%;justify-content:center;padding:10px;margin-top:6px;" onclick="handleRegisterSubmit()">Daftar Akun Siswa Baru</button>
      </div>
    </div>
  </div>

  <!-- SENSEI DASHBOARD MODAL -->
  <div class="modal-backdrop" id="senseiModal">
    <div class="modal-card" style="max-width:800px;width:95%;">
      <button class="modal-close" onclick="closeSenseiDashboard()">✕</button>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px;">
        <div>
          <span class="curriculum-tag" style="background:#fef3c7;color:#92400e;">👑 Panel Pengajar</span>
          <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-main);margin-top:2px;">Rekap Data & Nilai Murid</h3>
          <p style="font-size:0.82rem;color:var(--text-sub);">Data murid terdaftar di Cloud Firestore (Real-time).</p>
        </div>
        <span class="curriculum-tag" id="senseiTotalStudentCount" style="font-size:0.82rem;">0 Murid</span>
      </div>

      <div style="max-height:400px;overflow-y:auto;border:1px solid var(--card-border);border-radius:12px;">
        <table class="sensei-table">
          <thead>
            <tr>
              <th>Nama Siswa</th>
              <th>Email</th>
              <th style="text-align:center;">Bab Selesai</th>
              <th style="text-align:center;">Rata-rata Skor</th>
              <th style="text-align:center;">Status</th>
            </tr>
          </thead>
          <tbody id="senseiStudentTableBody">
            <tr><td colspan="5" style="text-align:center;padding:20px;">Memuat data...</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <!-- PURE SVG STROKE ANIMATION MODAL -->
  <div class="modal-backdrop" id="strokeModal">
    <div class="modal-card" style="text-align:center;">
      <button class="modal-close" onclick="closeStrokeModal()">✕</button>
      <span class="curriculum-tag" id="animStrokeCountTag">0 Goresan</span>
      <h3 style="font-size:1.35rem;font-weight:800;color:var(--text-main);margin:4px 0 2px;" id="animKanjiTitle">山</h3>
      <div style="font-size:0.86rem;color:var(--text-sub);margin-bottom:14px;" id="animKanjiMeaning">Gunung</div>

      <div id="animCanvasWrap">
        <svg id="animCanvasSvg" viewBox="0 0 109 109">
          <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
          <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
          <g id="animGhostGroup"></g>
          <g id="animStrokesGroup"></g>
        </svg>
      </div>

      <div style="font-size:0.84rem;font-weight:700;color:var(--text-sub);margin-bottom:14px;" id="animStepIndicator">
        Langkah Goresan: 1 / 8
      </div>

      <div style="display:flex;justify-content:center;gap:8px;">
        <button class="btn-action" style="background:var(--clay-surface);color:var(--text-main);" onclick="prevStrokeStep()">⏮️ Mundur</button>
        <button class="btn-action btn-print" id="animPlayBtn" onclick="toggleStrokePlay()">▶️ Putar Animasi</button>
        <button class="btn-action" style="background:var(--clay-surface);color:var(--text-main);" onclick="nextStrokeStep()">Maju ⏭️</button>
        <button class="btn-action" style="background:var(--clay-surface);color:var(--text-main);" onclick="resetStrokePlayer()">🔄 Ulangi</button>
      </div>
    </div>
  </div>

  <!-- Client-side Application Logic -->
  <script>
    const kanjiData = ${JSON.stringify(kanjiData)};
    const kanjiStrokesMap = ${JSON.stringify(kanjiStrokesMap)};

    let currentBab = 'all';
    let currentUser = null;

    // Stroke Player State
    let activeAnimKanji = null;
    let activeStrokeList = [];
    let currentStrokeIndex = 0;
    let strokeTimer = null;
    let isPlaying = false;

    function playStrokeAnimation(kanji, meaning, strokesCount) {
      activeAnimKanji = kanji;
      activeStrokeList = kanjiStrokesMap[kanji] || [];
      currentStrokeIndex = 0;
      isPlaying = false;
      clearTimeout(strokeTimer);

      document.getElementById('animKanjiTitle').innerText = kanji;
      document.getElementById('animKanjiMeaning').innerText = meaning;
      document.getElementById('animStrokeCountTag').innerText = (strokesCount || activeStrokeList.length) + ' Goresan';
      document.getElementById('animPlayBtn').innerText = '▶️ Putar Animasi';

      setupStrokeSvgCanvas();
      document.getElementById('strokeModal').style.display = 'flex';
      toggleStrokePlay();
    }

    function closeStrokeModal() {
      clearTimeout(strokeTimer);
      isPlaying = false;
      document.getElementById('strokeModal').style.display = 'none';
    }

    function setupStrokeSvgCanvas() {
      const ghostGroup = document.getElementById('animGhostGroup');
      const strokesGroup = document.getElementById('animStrokesGroup');
      ghostGroup.innerHTML = '';
      strokesGroup.innerHTML = '';

      if (!activeStrokeList || activeStrokeList.length === 0) {
        strokesGroup.innerHTML = '<text x="54.5" y="65" font-size="40" text-anchor="middle" fill="#334155">' + activeAnimKanji + '</text>';
        return;
      }

      activeStrokeList.forEach((dStr) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', dStr);
        path.setAttribute('class', 'stroke-path');
        path.setAttribute('stroke', '#cbd5e1');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('opacity', '0.25');
        ghostGroup.appendChild(path);
      });

      renderStrokeStep(currentStrokeIndex);
    }

    function renderStrokeStep(step) {
      const strokesGroup = document.getElementById('animStrokesGroup');
      strokesGroup.innerHTML = '';

      const total = activeStrokeList.length;
      if (total === 0) return;

      for (let i = 0; i <= step && i < total; i++) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', activeStrokeList[i]);
        path.setAttribute('class', 'stroke-path');

        if (i === step) {
          path.setAttribute('stroke', '#e11d48');
          path.setAttribute('stroke-width', '5');
          strokesGroup.appendChild(path);

          const len = path.getTotalLength() || 100;
          path.style.setProperty('--stroke-len', len);
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
          path.classList.add('stroke-drawing');
        } else {
          path.setAttribute('stroke', '#1e293b');
          path.setAttribute('stroke-width', '4.2');
          strokesGroup.appendChild(path);
        }
      }

      const indicator = document.getElementById('animStepIndicator');
      if (indicator) {
        indicator.innerText = 'Langkah Goresan: ' + (step + 1) + ' / ' + total;
      }
    }

    function toggleStrokePlay() {
      if (isPlaying) { pauseStrokePlay(); } else { startStrokePlay(); }
    }

    function startStrokePlay() {
      isPlaying = true;
      document.getElementById('animPlayBtn').innerText = '⏸️ Jeda';
      playNextStrokeLoop();
    }

    function pauseStrokePlay() {
      isPlaying = false;
      clearTimeout(strokeTimer);
      document.getElementById('animPlayBtn').innerText = '▶️ Lanjutkan';
    }

    function playNextStrokeLoop() {
      if (!isPlaying) return;
      renderStrokeStep(currentStrokeIndex);

      if (currentStrokeIndex < activeStrokeList.length - 1) {
        currentStrokeIndex++;
        strokeTimer = setTimeout(playNextStrokeLoop, 850);
      } else {
        isPlaying = false;
        document.getElementById('animPlayBtn').innerText = '🔄 Putar Ulang';
        const indicator = document.getElementById('animStepIndicator');
        if (indicator) indicator.innerText = '✨ Selesai! Seluruh ' + activeStrokeList.length + ' goresan lengkap.';
      }
    }

    function nextStrokeStep() {
      pauseStrokePlay();
      if (currentStrokeIndex < activeStrokeList.length - 1) {
        currentStrokeIndex++;
        renderStrokeStep(currentStrokeIndex);
      }
    }

    function prevStrokeStep() {
      pauseStrokePlay();
      if (currentStrokeIndex > 0) {
        currentStrokeIndex--;
        renderStrokeStep(currentStrokeIndex);
      }
    }

    function resetStrokePlayer() {
      pauseStrokePlay();
      currentStrokeIndex = 0;
      renderStrokeStep(0);
      startStrokePlay();
    }

    // --- FIREBASE INITIALIZATION & CONFIGURATION ---
    const firebaseConfig = {
      apiKey: "AIzaSyBfvKrdTOYX4T98wIJipFCQg_2hjss0o6g",
      authDomain: "ikubarusenseinojyugyou.firebaseapp.com",
      projectId: "ikubarusenseinojyugyou",
      storageBucket: "ikubarusenseinojyugyou.firebasestorage.app",
      messagingSenderId: "669942519776",
      appId: "1:669942519776:web:0bb74a2dd61bdd4e3b7d85",
      measurementId: "G-YY0525NJBE"
    };

    let firebaseApp = null;
    let auth = null;
    let db = null;

    try {
      if (typeof firebase !== 'undefined') {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
      }
    } catch (e) {
      console.warn('Firebase init:', e);
    }

    const SENSEI_EMAILS = [
      'iqbalnurdiana10@gmail.com',
      'ikubarusenseinojyugyou@gmail.com'
    ];

    // --- AUDIO NATIVE JAPANESE SPEECH SYNTHESIS (WEB SPEECH API) ---
    function speakJapanese(text) {
      if (!('speechSynthesis' in window)) {
        alert('Fitur audio memerlukan browser modern seperti Chrome, Edge, atau Safari.');
        return;
      }
      window.speechSynthesis.cancel();
      const clean = text.replace(/[\(\)\[\]「」\{\}]/g, '').trim();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'ja-JP';
      u.rate = 0.85; // Sedikit lebih perlahan untuk kenyamanan menyimak
      window.speechSynthesis.speak(u);
    }

    // --- AUTHENTICATION WITH FIREBASE ---
    function initAuth() {
      if (!auth) {
        console.warn('Firebase Auth SDK belum dimuat, fallback ke mode tamu.');
        updateAuthUI();
        applyContentLocks();
        return;
      }

      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const isSensei = SENSEI_EMAILS.includes((user.email || '').toLowerCase());
          let studentData = null;

          try {
            if (db) {
              const docRef = db.collection('students').doc(user.uid);
              const docSnap = await docRef.get();
              if (docSnap.exists) {
                studentData = docSnap.data();
                // update lastLogin
                docRef.set({ lastLogin: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
              } else {
                studentData = {
                  uid: user.uid,
                  name: user.displayName || (user.email ? user.email.split('@')[0] : 'Siswa'),
                  email: user.email || '',
                  role: isSensei ? 'sensei' : 'student',
                  status: 'approved',
                  joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                  lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                  quizScores: {},
                  masteredKanji: []
                };
                await docRef.set(studentData);
              }
            }
          } catch (err) {
            console.warn('Firestore fetch studentData error:', err);
          }

          currentUser = {
            uid: user.uid,
            email: user.email || '',
            name: (studentData && studentData.name) || user.displayName || (user.email ? user.email.split('@')[0] : 'Siswa'),
            role: isSensei ? 'sensei' : ((studentData && studentData.role) || 'student'),
            quizScores: (studentData && studentData.quizScores) || {},
            masteredKanji: (studentData && studentData.masteredKanji) || []
          };

          localStorage.setItem('irodori_active_user', JSON.stringify(currentUser));
        } else {
          currentUser = null;
          localStorage.removeItem('irodori_active_user');
        }

        updateAuthUI();
        applyContentLocks();
      });
    }

    function updateAuthUI() {
      const container = document.getElementById('authProfileContainer');
      const senseiBtnWrap = document.getElementById('senseiButtonContainer');
      const statusTag = document.getElementById('userStatusTag');
      const studentNameField = document.getElementById('infoStudentName');

      if (!container) return;

      if (currentUser) {
        const isSensei = (currentUser.role === 'sensei') || SENSEI_EMAILS.includes((currentUser.email || '').toLowerCase());
        if (senseiBtnWrap) senseiBtnWrap.style.display = isSensei ? 'inline-block' : 'none';

        if (statusTag) {
          statusTag.innerText = isSensei ? '👑 Sensei / Pengajar (' + currentUser.name + ')' : '🎒 Murid Terdaftar (' + currentUser.name + ')';
          statusTag.style.background = isSensei ? '#fef3c7' : 'var(--pastel-sage-bg)';
          statusTag.style.color = isSensei ? '#92400e' : 'var(--pastel-sage-txt)';
          statusTag.style.borderColor = isSensei ? '#fde68a' : 'var(--pastel-sage-border)';
        }
        if (studentNameField) studentNameField.innerText = ' ' + currentUser.name;

        container.innerHTML = \`
          <div class="user-pill" onclick="logoutUser()" title="Klik untuk keluar (Logout)" style="cursor:pointer;">
            <div class="user-avatar" style="\${isSensei ? 'background:linear-gradient(135deg, #f59e0b, #d97706);' : ''}">\${currentUser.name.charAt(0).toUpperCase()}</div>
            <span>\${currentUser.name.split(' ')[0]} (\${isSensei ? 'Sensei' : 'Keluar'})</span>
          </div>
        \`;
      } else {
        if (senseiBtnWrap) senseiBtnWrap.style.display = 'none';

        if (statusTag) {
          statusTag.innerText = 'Status: Akses Tamu (Bab 1 - 2)';
          statusTag.style.background = 'var(--pastel-rose-bg)';
          statusTag.style.color = 'var(--pastel-rose-txt)';
          statusTag.style.borderColor = 'var(--pastel-rose-border)';
        }
        if (studentNameField) studentNameField.innerText = '';

        container.innerHTML = \`
          <button class="btn-action btn-auth" onclick="openAuthModal('login')" style="background:#2563eb;color:#ffffff;font-weight:700;box-shadow:0 2px 8px rgba(37,99,235,0.35);">
            🔑 Masuk Siswa
          </button>
        \`;
      }
      updateProgressDashboard();
    }

    function applyContentLocks() {
      const isUnlocked = !!currentUser;
      for (let b = 3; b <= 18; b++) {
        const overlay = document.getElementById('lock-overlay-' + b);
        if (overlay) {
          overlay.style.display = isUnlocked ? 'none' : 'flex';
        }
      }
    }

    function openAuthModal(mode) {
      document.getElementById('authModal').style.display = 'flex';
      switchAuthMode(mode);
    }

    function closeAuthModal() {
      document.getElementById('authModal').style.display = 'none';
    }

    function switchAuthMode(mode) {
      const isLogin = mode === 'login';
      document.getElementById('loginFormSection').style.display = isLogin ? 'block' : 'none';
      document.getElementById('registerFormSection').style.display = isLogin ? 'none' : 'block';
      document.getElementById('authTabLogin').className = isLogin ? 'tab-btn active' : 'tab-btn';
      document.getElementById('authTabRegister').className = isLogin ? 'tab-btn' : 'tab-btn active';
    }

    async function handleGoogleSignIn() {
      if (!auth) {
        alert('Firebase Auth belum siap.');
        return;
      }
      const provider = new firebase.auth.GoogleAuthProvider();
      try {
        await auth.signInWithPopup(provider);
        closeAuthModal();
      } catch (err) {
        console.error('Google Sign-in error:', err);
        alert('Gagal masuk dengan Google: ' + err.message);
      }
    }

    async function handleLoginSubmit() {
      const email = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPassword').value.trim();
      if (!email || !pass) { alert('Silakan isi Email dan Password!'); return; }

      if (!auth) { alert('Koneksi Firebase Auth belum terhubung.'); return; }

      try {
        await auth.signInWithEmailAndPassword(email, pass);
        closeAuthModal();
        alert('✨ Berhasil masuk! Seluruh Bab 1 s.d. 18 kini terbuka.');
      } catch (err) {
        let msg = 'Gagal masuk: ' + err.message;
        if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          msg = '⚠️ Email atau password salah. Silakan periksa kembali.';
        }
        alert(msg);
      }
    }

    async function handleRegisterSubmit() {
      const name = document.getElementById('regFullName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const pass = document.getElementById('regPassword').value.trim();
      if (!name || !email || !pass) { alert('Harap lengkapi semua kolom!'); return; }
      if (pass.length < 6) { alert('Password minimal 6 karakter!'); return; }

      if (!auth) { alert('Koneksi Firebase Auth belum terhubung.'); return; }

      try {
        const cred = await auth.createUserWithEmailAndPassword(email, pass);
        await cred.user.updateProfile({ displayName: name });
        const isSensei = SENSEI_EMAILS.includes(email.toLowerCase());

        if (db) {
          await db.collection('students').doc(cred.user.uid).set({
            uid: cred.user.uid,
            name: name,
            email: email,
            role: isSensei ? 'sensei' : 'student',
            status: 'approved',
            joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            quizScores: {},
            masteredKanji: []
          });
        }
        closeAuthModal();
        alert('🎉 Akun murid berhasil dibuat! Selamat belajar, seluruh Bab terbuka.');
      } catch (err) {
        let msg = 'Gagal mendaftar: ' + err.message;
        if (err.code === 'auth/email-already-in-use') {
          msg = '⚠️ Email sudah terdaftar. Silakan pilih tab Masuk Akun.';
        }
        alert(msg);
      }
    }

    async function handleForgotPassword() {
      const email = prompt('Masukkan email Anda untuk menerima link reset password:');
      if (!email) return;
      if (!auth) return;
      try {
        await auth.sendPasswordResetEmail(email.trim());
        alert('📧 Link reset password telah dikirim ke ' + email + '. Silakan periksa email Anda.');
      } catch (err) {
        alert('Gagal mengirim link: ' + err.message);
      }
    }

    async function logoutUser() {
      if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
        if (auth) await auth.signOut();
        currentUser = null;
        localStorage.removeItem('irodori_active_user');
        updateAuthUI();
        applyContentLocks();
      }
    }

    // --- SENSEI DASHBOARD PANEL ---
    async function openSenseiDashboard() {
      if (!currentUser || currentUser.role !== 'sensei') {
        alert('Akses ini hanya untuk akun Sensei / Guru.');
        return;
      }
      document.getElementById('senseiModal').style.display = 'flex';
      const tableBody = document.getElementById('senseiStudentTableBody');
      tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;">Memuat data murid dari Cloud Firestore...</td></tr>';

      try {
        if (!db) throw new Error('Firestore belum siap.');
        const snap = await db.collection('students').orderBy('joinedAt', 'desc').get();
        if (snap.empty) {
          tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;">Belum ada murid yang terdaftar.</td></tr>';
          return;
        }

        let html = '';
        let totalCount = 0;
        snap.forEach(doc => {
          totalCount++;
          const s = doc.data();
          const scores = s.quizScores || {};
          const completedCount = Object.keys(scores).length;
          let totalScore = 0;
          Object.values(scores).forEach(v => totalScore += Number(v) || 0);
          const avg = completedCount > 0 ? Math.round((totalScore / (completedCount * 20)) * 100) : 0;

          html += '<tr>' +
            '<td style="font-weight:700;">' + (s.name || '-') + '</td>' +
            '<td style="color:var(--text-sub);">' + (s.email || '') + '</td>' +
            '<td style="text-align:center;"><span class="curriculum-tag" style="background:var(--pastel-blue-bg);color:var(--pastel-blue-txt);">' + completedCount + ' / 18 Bab</span></td>' +
            '<td style="text-align:center;font-weight:800;color:' + (avg >= 70 ? '#16a34a' : '#d97706') + ';">' + avg + '%</td>' +
            '<td style="text-align:center;"><span style="font-size:0.75rem;padding:3px 8px;border-radius:6px;background:var(--pastel-sage-bg);color:var(--pastel-sage-txt);font-weight:700;">Aktif</span></td>' +
          '</tr>';
        });
        tableBody.innerHTML = html;
        document.getElementById('senseiTotalStudentCount').innerText = totalCount + ' Murid Terdaftar';
      } catch (err) {
        console.error('Error load students:', err);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:20px;color:#dc2626;">Gagal memuat: ' + err.message + '</td></tr>';
      }
    }

    function closeSenseiDashboard() {
      document.getElementById('senseiModal').style.display = 'none';
    }

    // --- PASTEL DARK THEME ---
    function initTheme() {
      const savedTheme = localStorage.getItem('irodori_theme');
      if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeBtn').innerText = '☀️';
      }
    }

    function toggleTheme() {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('irodori_theme', isDark ? 'dark' : 'light');
      document.getElementById('themeBtn').innerText = isDark ? '☀️' : '🌙';
    }

    // --- NAVIGATION TABS ---
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      const targetBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick')?.includes(tabId));
      if (targetBtn) targetBtn.classList.add('active');

      const targetContent = document.getElementById('tab-' + tabId);
      if (targetContent) targetContent.classList.add('active');

      if (tabId === 'quiz') renderQuizView();
      if (tabId === 'progress') updateProgressDashboard();
      if (tabId === 'explorer') renderExplorerView();
    }

    function handleBabChange(val) {
      currentBab = val;
      const pages = document.querySelectorAll('.worksheet-page, .exercise-page-card');
      if (val === 'all') {
        pages.forEach(p => p.style.display = 'block');
      } else {
        pages.forEach(p => p.style.display = 'none');
        const targetSheet = document.getElementById('sheet-bab-' + val);
        const targetExA = document.getElementById('sheet-bab-' + val + '-ex-a');
        const targetExB = document.getElementById('sheet-bab-' + val + '-ex-b');
        if (targetSheet) targetSheet.style.display = 'block';
        if (targetExA) targetExA.style.display = 'block';
        if (targetExB) targetExB.style.display = 'block';
      }

      if (document.getElementById('tab-quiz').classList.contains('active')) {
        renderQuizView();
      }
    }

    // --- QUIZ LOGIC WITH AUTO-SAVE ---
    function renderQuizView() {
      const container = document.getElementById('quizContainer');
      const targetBab = currentBab === 'all' ? 1 : parseInt(currentBab);
      const ch = kanjiData.find(d => d.bab === targetBab) || kanjiData[0];

      if (!currentUser && ch.bab > 2) {
        container.innerHTML = \`
          <div style="text-align:center;padding:40px 20px;">
            <div style="font-size:40px;margin-bottom:10px;">🔒</div>
            <h3 style="font-size:1.2rem;font-weight:800;color:var(--text-main);margin-bottom:6px;">Kuis Bab \${ch.bab} Terkunci</h3>
            <p style="font-size:0.86rem;color:var(--text-sub);max-width:400px;margin:0 auto 16px;">
              Silakan Masuk atau Buat Akun Siswa untuk mencoba kuis evaluasi Bab 3 s.d. 18.
            </p>
            <button class="btn-action btn-auth" onclick="openAuthModal('login')">🔑 Masuk Akun</button>
          </div>
        \`;
        return;
      }

      container.innerHTML = \`
        <div style="margin-bottom:14px;">
          <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-main);">\${ch.titleJp} — \${ch.titleId}</h3>
          <div style="font-size:0.82rem;color:var(--text-sub);">Menampilkan kuis Bab \${ch.bab}. Ketik jawaban Anda pada kotak di bawah.</div>
        </div>

        <h4 style="font-size:0.9rem;font-weight:700;color:var(--text-sub);margin:14px 0 8px;">A. Kuis Membaca (Hiragana):</h4>
        <div style="display:flex;flex-direction:column;gap:8px;">
          \${ch.readingExercise.map((ex, idx) => \`
            <div class="exercise-list-item" id="quiz-r-\${idx}">
              <div class="exercise-q-text">(\${idx + 1}) \${ex.q}</div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <input type="text" class="search-input" style="padding:6px 12px;font-size:0.88rem;" id="input-r-\${idx}" placeholder="Ketik hiragana..." onkeydown="if(event.key==='Enter') checkQuizItem('r', \${idx}, '\${ex.a}')">
                <button class="btn-action btn-print" style="padding:6px 14px;font-size:0.8rem;" onclick="checkQuizItem('r', \${idx}, '\${ex.a}')">Cek</button>
              </div>
              <div><span class="answer-key" id="res-r-\${idx}" style="display:none;"></span></div>
            </div>
          \`).join('')}
        </div>

        <h4 style="font-size:0.9rem;font-weight:700;color:var(--text-sub);margin:20px 0 8px;">B. Kuis Menulis (Kanji):</h4>
        <div style="display:flex;flex-direction:column;gap:8px;">
          \${ch.writingExercise.map((ex, idx) => \`
            <div class="exercise-list-item" id="quiz-w-\${idx}">
              <div class="exercise-q-text">(\${idx + 1}) \${ex.q}</div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <input type="text" class="search-input" style="padding:6px 12px;font-size:0.88rem;" id="input-w-\${idx}" placeholder="Ketik kanji..." onkeydown="if(event.key==='Enter') checkQuizItem('w', \${idx}, '\${ex.a}')">
                <button class="btn-action btn-print" style="padding:6px 14px;font-size:0.8rem;" onclick="checkQuizItem('w', \${idx}, '\${ex.a}')">Cek</button>
              </div>
              <div><span class="answer-key" id="res-w-\${idx}" style="display:none;"></span></div>
            </div>
          \`).join('')}
        </div>
      \`;

      updateQuizScore();
    }

    function checkQuizItem(type, idx, correctVal) {
      const input = document.getElementById(\`input-\${type}-\${idx}\`);
      const res = document.getElementById(\`res-\${type}-\${idx}\`);
      if (!input || !res) return;

      const userVal = input.value.trim();
      if (!userVal) {
        res.style.display = 'inline-block';
        res.innerText = '⚠️ Harap isi jawaban';
        return;
      }

      res.style.display = 'inline-block';
      if (userVal === correctVal || userVal.toLowerCase() === correctVal.toLowerCase()) {
        res.innerText = '✨ Benar! Tepat sekali.';
        res.style.background = 'var(--pastel-sage-bg)';
        res.style.color = 'var(--pastel-sage-txt)';
        res.style.borderColor = 'var(--pastel-sage-border)';
      } else {
        res.innerText = '❌ Jawaban tepat: ' + correctVal;
        res.style.background = 'var(--pastel-rose-bg)';
        res.style.color = 'var(--pastel-rose-txt)';
        res.style.borderColor = 'var(--pastel-rose-border)';
      }
      updateQuizScore();
    }

    function updateQuizScore() {
      const allResults = document.querySelectorAll('#quizContainer .answer-key');
      let correct = 0;
      allResults.forEach(r => {
        if (r.innerText.includes('Benar')) correct++;
      });
      const textEl = document.getElementById('quizScoreText');
      if (textEl) textEl.innerText = correct + ' / 20';

      if (currentUser) {
        const targetBab = currentBab === 'all' ? 1 : parseInt(currentBab);
        if (!currentUser.quizScores) currentUser.quizScores = {};
        currentUser.quizScores['bab_' + targetBab] = correct;
        saveCurrentUserProfile();
      }
    }

    function resetQuiz() {
      document.querySelectorAll('#quizContainer input').forEach(i => { i.value = ''; });
      document.querySelectorAll('#quizContainer .answer-key').forEach(r => { r.style.display = 'none'; r.innerText = ''; });
      updateQuizScore();
    }

    function saveCurrentUserProfile() {
      if (!currentUser) return;
      localStorage.setItem('irodori_active_user', JSON.stringify(currentUser));

      // Realtime Cloud Firestore sync
      if (db && currentUser.uid) {
        db.collection('students').doc(currentUser.uid).set({
          quizScores: currentUser.quizScores || {},
          lastActive: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true }).catch(e => console.warn('Firestore quiz score sync:', e));
      }
    }

    // --- STUDENT PROGRESS DASHBOARD ---
    function updateProgressDashboard() {
      const badge = document.getElementById('progressUserBadge');
      const list = document.getElementById('progressBabList');
      if (!badge || !list) return;

      if (!currentUser) {
        badge.innerHTML = \`<span class="curriculum-tag">Akses Tamu (Mode Terbatas)</span>\`;
      } else {
        badge.innerHTML = \`<span class="curriculum-tag" style="background:var(--pastel-sage-bg);color:var(--pastel-sage-txt);">Akun: \${currentUser.name}</span>\`;
      }

      const scores = (currentUser && currentUser.quizScores) ? currentUser.quizScores : {};
      let totalCompleted = 0;
      let totalScoreSum = 0;
      let scoredBabsCount = 0;

      list.innerHTML = kanjiData.map(ch => {
        const score = scores['bab_' + ch.bab] !== undefined ? scores['bab_' + ch.bab] : null;
        if (score !== null) {
          scoredBabsCount++;
          totalScoreSum += score;
          if (score >= 14) totalCompleted++;
        }

        const isLocked = !currentUser && ch.bab > 2;
        return \`
          <div style="background:var(--clay-surface);border:1px solid var(--card-border);border-radius:14px;padding:12px 14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-size:0.75rem;font-weight:800;color:var(--pastel-blue-txt);">Bab \${ch.bab}</span>
              <span style="font-size:0.72rem;font-weight:700;\${isLocked ? 'color:#e11d48;' : (score !== null ? score + ' / 20 Soal' : 'Belum Kuis')}">
                \${isLocked ? '🔒 Terkunci' : (score !== null ? score + ' / 20 Soal' : 'Belum Kuis')}
              </span>
            </div>
            <div style="font-size:0.86rem;font-weight:700;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              \${ch.titleJp}
            </div>
            <div style="font-size:0.76rem;color:var(--text-sub);">\${ch.titleId}</div>
          </div>
        \`;
      }).join('');

      const avgScore = scoredBabsCount > 0 ? Math.round((totalScoreSum / (scoredBabsCount * 20)) * 100) : 0;
      const totalMastered = (currentUser && currentUser.masteredKanji) ? currentUser.masteredKanji.length : 0;

      const statMasteredEl = document.getElementById('statMasteredCount');
      if (statMasteredEl) statMasteredEl.innerText = totalMastered;

      const dashMasteredEl = document.getElementById('dashTotalMastered');
      if (dashMasteredEl) dashMasteredEl.innerText = totalMastered + ' / 226';

      const dashCompletedEl = document.getElementById('dashCompletedBab');
      if (dashCompletedEl) dashCompletedEl.innerText = totalCompleted + ' / 18';

      const dashAvgEl = document.getElementById('dashAvgScore');
      if (dashAvgEl) dashAvgEl.innerText = avgScore + '%';
    }

    // --- KANJI EXPLORER & KAMUS ---
    function renderExplorerView(searchQuery = '') {
      const grid = document.getElementById('explorerGrid');
      const q = searchQuery.toLowerCase().trim();

      const allKanji = [];
      kanjiData.forEach(ch => {
        ch.kanjiList.forEach(k => {
          allKanji.push({ ...k, bab: ch.bab, babTitle: ch.titleId });
        });
      });

      const filtered = allKanji.filter(k => {
        if (!q) return true;
        return k.kanji.includes(q) ||
               k.meaning.toLowerCase().includes(q) ||
               k.on.toLowerCase().includes(q) ||
               k.kun.toLowerCase().includes(q) ||
               k.words.some(w => w.word.includes(q) || w.reading.includes(q) || w.meaning.toLowerCase().includes(q)) ||
               String(k.bab) === q;
      });

      grid.innerHTML = filtered.map(k => \`
        <div class="explorer-card">
          <div class="explorer-top">
            <div>
              <span class="curriculum-tag" style="font-size:0.65rem;">Bab \${k.bab}</span>
              <div class="exp-char" title="Klik untuk salin" onclick="navigator.clipboard.writeText('\${k.kanji}'); alert('Kanji \${k.kanji} disalin ke clipboard!');">\${k.kanji}</div>
            </div>
            <div>
              <button class="btn-animate-stroke" onclick="playStrokeAnimation('\${k.kanji}', '\${k.meaning}', \${k.strokes})">
                ▶️ Animasi
              </button>
            </div>
          </div>
          <div>
            <div style="font-size:0.92rem;font-weight:700;color:var(--text-main);">\${k.meaning}</div>
            <div style="font-size:0.78rem;color:var(--text-sub);margin-top:2px;">
              音: <strong>\${k.on}</strong> | 訓: <strong>\${k.kun}</strong>
            </div>
            <div style="font-size:0.72rem;color:var(--text-light);margin-top:2px;">
              \${k.strokes} Goresan • Radikal: \${k.radical}
            </div>
          </div>
          <div style="font-size:0.78rem;background:var(--clay-surface);padding:5px 8px;border-radius:8px;color:var(--text-main);border:1px solid var(--card-border);">
            📚 <strong>\${k.words[0] ? k.words[0].word : k.kanji}</strong> (\${k.words[0] ? k.words[0].reading : ''}): \${k.words[0] ? k.words[0].meaning : ''}
          </div>
        </div>
      \`).join('');
    }

    function handleKanjiSearch(val) {
      renderExplorerView(val);
    }

    window.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initAuth();
    });
  </script>
</body>
</html>`;

  // Write to C: workspace
  const indexPathC = path.join(rootDir, 'index.html');
  fs.writeFileSync(indexPathC, html, 'utf-8');
  console.log(`Successfully generated index.html in C: (${(html.length / 1024).toFixed(1)} KB)!`);

  // Write to D: workspace
  const dPath = 'D:/KANJI Irodori A2.2/KANJI Irodori A2.2';
  if (fs.existsSync(dPath)) {
    const indexPathD = path.join(dPath, 'index.html');
    fs.writeFileSync(indexPathD, html, 'utf-8');
    console.log(`Successfully synced index.html to D: (${(html.length / 1024).toFixed(1)} KB)!`);
  }
}

buildIndexApp();
