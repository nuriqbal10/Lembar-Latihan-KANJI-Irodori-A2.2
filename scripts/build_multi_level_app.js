const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const svgDir = path.join(rootDir, 'assets', 'kanjivg');

// Load datasets for all 3 levels
const dataA1File = path.join(rootDir, 'kanji_irodori_a1_data.json');
const dataA21File = path.join(rootDir, 'kanji_irodori_a2_1_data.json');
const dataA22File = path.join(rootDir, 'kanji_irodori_a2_2_data.json');

const kanjiDataA1 = JSON.parse(fs.readFileSync(dataA1File, 'utf-8'));
const kanjiDataA21 = JSON.parse(fs.readFileSync(dataA21File, 'utf-8'));
const kanjiDataA22 = JSON.parse(fs.readFileSync(dataA22File, 'utf-8'));

const KANJI_DATA_BY_LEVEL = {
  "A1": kanjiDataA1,
  "A2.1": kanjiDataA21,
  "A2.2": kanjiDataA22
};

const LEVEL_META = {
  "A1": {
    label: "🌸 Level A1 (入門 - Pemula)",
    subLabel: "入門 (A1 / JFT-Basic)",
    color: "#ec4899",
    totalKanji: kanjiDataA1.reduce((sum, ch) => sum + ch.kanjiList.length, 0)
  },
  "A2.1": {
    label: "🌊 Level A2.1 (初級1 - Dasar 1)",
    subLabel: "初級1 (A2.1 / JFT-Basic)",
    color: "#0284c7",
    totalKanji: kanjiDataA21.reduce((sum, ch) => sum + ch.kanjiList.length, 0)
  },
  "A2.2": {
    label: "⚡ Level A2.2 (初級2 - Dasar 2)",
    subLabel: "初級2 (A2.2 / JFT-Basic)",
    color: "#8b5cf6",
    totalKanji: kanjiDataA22.reduce((sum, ch) => sum + ch.kanjiList.length, 0)
  }
};

// Extract stroke paths for all Kanji across all levels
const kanjiStrokesMap = {};
[...kanjiDataA1, ...kanjiDataA21, ...kanjiDataA22].forEach(ch => {
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

console.log('Extracted stroke paths for all', Object.keys(kanjiStrokesMap).length, 'unique Kanji across A1, A2.1, and A2.2!');

// SVG Helpers
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

function formatSentenceRuby(str) {
  if (!str) return '';
  return str.replace(/([一-龯々\w]+)[\(（]([ぁ-んァ-ヶー]+)[\)）]/g, (match, kanji, furi) => {
    return `<ruby>${kanji}<rt>${furi}</rt></ruby>`;
  });
}

function stripFurigana(str) {
  if (!str) return '';
  return str
    .replace(/\([^\)]*\)/g, '')
    .replace(/（[^）]*）/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/[「」『』]/g, '')
    .trim();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderWorksheetLevelHtml(level, dataList, meta) {
  return dataList.map(ch => `
    <!-- LEVEL ${level} - BAB ${ch.bab} TARGET KANJI (20-GRID) -->
    <div class="worksheet-page" id="sheet-${level}-bab-${ch.bab}" data-level="${level}" data-bab="${ch.bab}">
      <div class="sheet-header">
        <div class="curriculum-tag">IRODORI: Nihongo de Kurashito Kotoba • ${meta.subLabel}</div>
        <h2 class="sheet-title">${ch.titleJp}</h2>
        <div class="sheet-subtitle">${ch.titleId} — Topik: ${ch.topic}</div>

        <div class="student-info-grid">
          <div class="info-field"><span class="label">Nama:</span><span class="line" id="infoStudentName"></span></div>
          <div class="info-field"><span class="label">Tanggal:</span><span class="line"></span></div>
          <div class="info-field"><span class="label">Kelas:</span><span class="line"></span></div>
          <div class="info-field"><span class="label">Nilai:</span><span class="score-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 100</span></div>
        </div>
      </div>

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
                <button class="btn-animate-stroke" onclick="playStrokeAnimation('${k.kanji}', '${escapeHtml(k.meaning)}', ${k.strokes})">
                  ▶️ Putar Animasi
                </button>
              </div>
            </div>

            <div class="kanji-details-row" style="font-size:0.82rem;margin-bottom:6px;">
              <span style="font-weight:700;color:var(--text-sub);min-width:70px;">Kosakata:</span>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                ${k.words.map(w => `
                  <span class="vocab-pill">
                    <ruby><strong>${w.word}</strong><rt>${w.reading}</rt></ruby>: ${w.meaning}
                    <button class="btn-voice-inline no-print" onclick="event.stopPropagation(); speakJapanese('${w.word}')" title="Dengarkan kata">🔊</button>
                  </span>
                `).join('')}
              </div>
            </div>

            <div class="kanji-details-row" style="font-size:0.88rem;margin-bottom:10px;">
              <span style="font-weight:700;color:var(--text-sub);min-width:70px;">Contoh:</span>
              <div>
                <div style="display:flex;align-items:center;gap:8px;">
                  <span style="font-weight:700;color:var(--text-main);font-size:0.98rem;line-height:1.7;">${formatSentenceRuby(k.sentenceFurigana)}</span>
                  <button class="btn-voice-inline no-print" onclick="event.stopPropagation(); speakJapanese('${stripFurigana(k.sentenceFurigana)}')" title="Dengarkan kalimat">🔊</button>
                </div>
                <span style="font-style:italic;color:var(--text-sub);display:block;font-size:0.78rem;margin-top:2px;">"${k.sentenceId}"</span>
              </div>
            </div>

            <!-- 20-GRID WRITING SECTION -->
            <div class="writing-grid-section-20">
              <div class="grid-boxes-10-row">
                <div class="tianzige-box guidance-box" onclick="playStrokeAnimation('${k.kanji}', '${escapeHtml(k.meaning)}', ${k.strokes})" title="Klik untuk putar animasi">
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
            </div>

            <div class="ruled-writing-row">
              <div class="ruled-item">
                <span class="ruled-lbl">Menulis Kata:</span>
                <span class="ruled-line"></span>
              </div>
              <div class="ruled-item">
                <span class="ruled-lbl">Menulis Kalimat:</span>
                <span class="ruled-line"></span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- HALAMAN LATIHAN A (MEMBACA) -->
    <div class="exercise-page-card" id="sheet-${level}-bab-${ch.bab}-ex-a" data-level="${level}" data-bab="${ch.bab}">
      <div class="sheet-header" style="margin-bottom:12px;">
        <div class="curriculum-tag">IRODORI: Nihongo de Kurashito Kotoba • ${meta.subLabel}</div>
        <div class="exercise-page-title">Halaman Latihan A: Membaca Kanji (${ch.titleJp})</div>
        <div style="font-size:0.82rem;color:var(--text-sub);">Bacalah kalimat di bawah ini, lalu tuliskan cara baca kanji yang berada di dalam tanda kurung [ ] ke dalam huruf Hiragana.</div>
      </div>
      <div class="exercise-grid-list">
        ${ch.readingExercise.map((ex, idx) => `
          <div class="exercise-list-item">
            <div class="exercise-q-text">${ex.q}</div>
            <span class="answer-key">Kunci: ${ex.a}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- HALAMAN LATIHAN B (MENULIS) -->
    <div class="exercise-page-card page-exercise-b" id="sheet-${level}-bab-${ch.bab}-ex-b" data-level="${level}" data-bab="${ch.bab}">
      <div class="sheet-header" style="margin-bottom:12px;">
        <div class="curriculum-tag">IRODORI: Nihongo de Kurashito Kotoba • ${meta.subLabel}</div>
        <div class="exercise-page-title">Halaman Latihan B: Menulis Kanji (${ch.titleJp})</div>
        <div style="font-size:0.82rem;color:var(--text-sub);">Perhatikan kata dalam kurung [hiragana], kemudian tuliskan huruf Kanji yang tepat pada garis bawah yang disediakan.</div>
      </div>
      <div class="exercise-grid-list">
        ${ch.writingExercise.map((ex, idx) => `
          <div class="exercise-list-item">
            <div class="exercise-q-text">${ex.q}</div>
            <span class="answer-key">Kunci: ${ex.a}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function buildIndexApp() {
  console.log("Compiling Unified Multi-Level IRODORI Kanji Studio with Claymorphism Nav, Working Stroke Animation & Interactive Flashcards...");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IRODORI Kanji Studio (Level A1 • A2.1 • A2.2) | Lembar Latihan 20-Grid, Flashcard 3D & Kuis Interaktif</title>
  <meta name="description" content="Studio Lengkap Latihan Huruf Kanji IRODORI (A1 Pemula, A2.1 Dasar 1, A2.2 Dasar 2) dengan font UD Digi Kyokasho, Flashcard 3D Claymorphism, 20 Kotak Grid per Kanji, Animasi Goresan & Cetak A4 Presisi">

  <!-- Firebase SDK Compat -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>

  <!-- Google Fonts: Inter & Noto Sans JP -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=BIZ+UDPGothic:wght@400;700&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">

  <style>
    /* =======================================================
       CLAYMORPHISM PASTEL CALM SYSTEM & ROOT VARIABLES
       ======================================================= */
    :root {
      --bg-gradient: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #fce7f3 100%);
      --text-main: #1e293b;
      --text-sub: #475569;
      --text-light: #94a3b8;

      --clay-card-bg: #ffffff;
      --clay-surface: #f8fafc;
      --clay-shadow-out: 0 10px 25px -5px rgba(124, 58, 237, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
      --clay-shadow-pill: 0 4px 12px rgba(124, 58, 237, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9);
      --clay-shadow-in: inset 2px 2px 5px rgba(0,0,0,0.06), inset -2px -2px 5px rgba(255,255,255,0.8);
      --card-border: #e2e8f0;

      --pastel-blue-bg: #e0f2fe;
      --pastel-blue-border: #bae6fd;
      --pastel-blue-txt: #0369a1;

      --pastel-rose-bg: #ffe4e6;
      --pastel-rose-border: #fecdd3;
      --pastel-rose-txt: #be123c;

      --pastel-sage-bg: #dcfce7;
      --pastel-sage-border: #bbf7d0;
      --pastel-sage-txt: #15803d;

      --pastel-lavender-bg: #ede9fe;
      --pastel-lavender-border: #ddd6fe;
      --accent-lavender: #7c3aed;

      --grid-border: #94a3b8;
      --grid-cross: #cbd5e1;

      --font-kyokasho: "UD デジタル 教科書体 NP-R", "UD Digi Kyokasho NP-R", "UD デジタル 教科書体 NK-R", "BIZ UDPGothic", "Noto Sans JP", sans-serif;
    }

    [data-theme="dark"] {
      --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%);
      --text-main: #f8fafc;
      --text-sub: #cbd5e1;
      --text-light: #64748b;

      --clay-card-bg: #1e293b;
      --clay-surface: #0f172a;
      --clay-shadow-out: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      --clay-shadow-pill: 0 4px 12px rgba(0, 0, 0, 0.3);
      --clay-shadow-in: inset 2px 2px 5px rgba(0,0,0,0.5), inset -2px -2px 5px rgba(255,255,255,0.05);
      --card-border: #334155;

      --pastel-blue-bg: #0c4a6e;
      --pastel-blue-border: #0284c7;
      --pastel-blue-txt: #bae6fd;

      --pastel-rose-bg: #881337;
      --pastel-rose-border: #be123c;
      --pastel-rose-txt: #fecdd3;

      --pastel-sage-bg: #14532d;
      --pastel-sage-border: #16a34a;
      --pastel-sage-txt: #bbf7d0;

      --pastel-lavender-bg: #4c1d95;
      --pastel-lavender-border: #6d28d9;
      --accent-lavender: #c4b5fd;

      --grid-border: #475569;
      --grid-cross: #334155;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', var(--font-kyokasho);
      background: var(--bg-gradient);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.5;
      transition: background 0.3s ease, color 0.3s ease;
    }

    /* HEADER BAR */
    .app-header {
      background: var(--clay-card-bg);
      border-bottom: 1px solid var(--card-border);
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      backdrop-filter: blur(12px);
    }

    .header-inner {
      max-width: 1320px;
      margin: 0 auto;
      padding: 10px 16px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .logo-area { display: flex; align-items: center; gap: 10px; }
    .logo-icon {
      font-size: 26px;
      width: 44px; height: 44px; border-radius: 14px;
      background: linear-gradient(135deg, #fce7f3, #ede9fe);
      display: flex; align-items: center; justify-content: center;
      box-shadow: var(--clay-shadow-pill);
    }
    .logo-text h1 {
      font-size: 1.15rem; font-weight: 800; color: var(--text-main); line-height: 1.2;
      display: flex; align-items: center; gap: 8px;
    }
    .logo-text p { font-size: 0.72rem; color: var(--text-sub); font-weight: 500; }
    .tag-version {
      font-size: 0.68rem; font-weight: 800; padding: 2px 8px; border-radius: 8px;
      background: var(--pastel-lavender-bg); color: var(--accent-lavender);
      border: 1px solid var(--pastel-lavender-border);
    }

    /* CLAYMORPHISM TABS NAVBAR */
    .nav-tabs {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--clay-surface);
      padding: 5px 6px;
      border-radius: 9999px;
      border: 1px solid var(--card-border);
      box-shadow: var(--clay-shadow-in);
    }

    .nav-tab {
      border: none;
      background: transparent;
      padding: 7px 14px;
      border-radius: 9999px;
      font-family: inherit;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-sub);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      outline: none;
      white-space: nowrap;
    }

    .nav-tab:hover {
      color: var(--text-main);
      transform: translateY(-1px);
    }

    .nav-tab.active {
      background: var(--clay-card-bg);
      color: #2563eb;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.16), 0 2px 4px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(37, 99, 235, 0.18);
      font-weight: 800;
      transform: translateY(-1px);
    }

    /* ACTION BUTTONS & CONTROLS */
    .action-buttons { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

    .clay-select-wrapper {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--clay-surface);
      padding: 5px 12px;
      border-radius: 9999px;
      border: 1.5px solid var(--card-border);
      box-shadow: var(--clay-shadow-pill);
    }
    .clay-select-wrapper label {
      font-size: 0.74rem; font-weight: 800; color: var(--accent-lavender);
    }
    .clay-select-wrapper select {
      border: none; background: transparent; font-family: inherit; font-size: 0.82rem; font-weight: 800;
      color: var(--text-main); cursor: pointer; outline: none;
    }

    .btn-action {
      padding: 7px 14px; border-radius: 9999px; border: none;
      font-family: inherit; font-size: 0.82rem; font-weight: 700;
      cursor: pointer; display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.2s ease;
    }
    .btn-action:hover { transform: translateY(-1px); }
    .btn-print { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; box-shadow: 0 3px 10px rgba(37, 99, 235, 0.25); }
    .theme-toggle {
      width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--card-border);
      background: var(--clay-card-bg); color: var(--text-main); cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 16px;
      box-shadow: var(--clay-shadow-pill); transition: transform 0.2s ease;
    }
    .theme-toggle:hover { transform: scale(1.06); }

    .user-pill {
      display: flex; align-items: center; gap: 6px; padding: 4px 10px 4px 6px;
      border-radius: 9999px; background: var(--pastel-blue-bg); border: 1px solid var(--pastel-blue-border);
      color: var(--pastel-blue-txt); font-size: 0.78rem; font-weight: 700;
    }
    .user-avatar {
      width: 24px; height: 24px; border-radius: 50%; color: white;
      display: flex; align-items: center; justify-content: center; font-size: 11px;
    }

    /* MAIN APP BODY */
    .app-main { max-width: 1240px; margin: 18px auto; padding: 0 16px; }
    .tab-content { display: none; }
    .tab-content.active { display: block; animation: fadeIn 0.25s ease; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* HERO BANNER */
    .hero-banner {
      background: var(--clay-card-bg); border-radius: 24px; padding: 18px 24px;
      margin-bottom: 20px; box-shadow: var(--clay-shadow-out); border: 1px solid var(--card-border);
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 14px;
    }
    .hero-text h2 { font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 3px; }
    .hero-text p { font-size: 0.84rem; color: var(--text-sub); max-width: 680px; }
    .hero-stats { display: flex; gap: 8px; flex-wrap: wrap; }
    .stat-pill {
      background: var(--pastel-blue-bg); border: 1px solid var(--pastel-blue-border);
      color: var(--pastel-blue-txt); padding: 6px 14px; border-radius: 14px; text-align: center;
    }
    .stat-num { font-size: 1.15rem; font-weight: 800; display: block; line-height: 1.2; }
    .stat-lbl { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; }

    .curriculum-tag {
      font-size: 0.72rem; font-weight: 800; padding: 3px 10px; border-radius: 8px;
      background: var(--pastel-lavender-bg); color: var(--accent-lavender);
      border: 1px solid var(--pastel-lavender-border); display: inline-block;
    }

    /* WORKSHEET PAGE & 20-GRID */
    .worksheet-page {
      background: var(--clay-card-bg); border-radius: 24px; padding: 24px;
      margin-bottom: 28px; box-shadow: var(--clay-shadow-out); border: 1px solid var(--card-border);
      position: relative;
    }
    .sheet-header {
      border-bottom: 2px solid var(--card-border); padding-bottom: 12px; margin-bottom: 18px;
    }
    .sheet-title { font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-top: 4px; }
    .sheet-subtitle { font-size: 0.86rem; color: var(--text-sub); font-weight: 600; margin-top: 2px; }

    .student-info-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px; margin-top: 14px; padding: 8px 12px; border-radius: 12px;
      background: var(--clay-surface); border: 1px solid var(--card-border);
    }
    .info-field { display: flex; align-items: baseline; gap: 6px; font-size: 0.8rem; }
    .info-field .label { font-weight: 700; color: var(--text-sub); }
    .info-field .line { flex: 1; border-bottom: 1.5px dotted var(--grid-cross); height: 14px; }
    .score-box {
      font-weight: 800; color: var(--pastel-rose-txt); background: var(--pastel-rose-bg);
      padding: 2px 8px; border-radius: 6px; border: 1px solid var(--pastel-rose-border);
    }

    /* KANJI UNIT */
    .kanji-list-container { display: flex; flex-direction: column; gap: 20px; }
    .kanji-unit {
      background: var(--clay-card-bg); border: 1.5px solid var(--card-border);
      border-radius: 20px; padding: 18px; box-shadow: var(--clay-shadow-pill);
      position: relative;
    }
    .kanji-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      gap: 12px; margin-bottom: 12px; flex-wrap: wrap;
    }
    .kanji-hero {
      display: flex; align-items: center; gap: 8px; font-family: var(--font-kyokasho);
      font-size: 2.8rem; font-weight: 900; line-height: 1; color: var(--text-main);
    }
    .btn-voice-mini {
      background: var(--clay-surface); border: 1px solid var(--card-border); border-radius: 50%;
      width: 32px; height: 32px; cursor: pointer; font-size: 14px; display: inline-flex;
      align-items: center; justify-content: center; box-shadow: var(--clay-shadow-pill);
    }
    .btn-voice-mini:hover { transform: scale(1.08); }
    .kanji-meta { flex: 1; min-width: 240px; }
    .kanji-readings { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 4px; }
    .reading-tag {
      font-size: 0.74rem; font-weight: 700; padding: 2px 8px; border-radius: 6px;
    }
    .tag-on { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .tag-kun { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }
    .tag-stroke { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
    .tag-radical { background: #fce7f3; color: #9d174d; border: 1px solid #fbcfe8; }
    .kanji-meaning { font-size: 0.94rem; font-weight: 800; color: var(--text-main); margin-top: 2px; }
    .stroke-rule { font-size: 0.78rem; color: var(--text-sub); margin-top: 2px; }

    .btn-animate-stroke {
      background: linear-gradient(135deg, #f43f5e, #e11d48); color: white; border: none;
      padding: 7px 14px; border-radius: 12px; font-weight: 700; font-size: 0.8rem;
      cursor: pointer; display: inline-flex; align-items: center; gap: 5px;
      box-shadow: 0 3px 10px rgba(225, 29, 72, 0.25); transition: transform 0.2s ease;
    }
    .btn-animate-stroke:hover { transform: translateY(-1px); }

    .vocab-pill {
      background: var(--clay-surface); border: 1px solid var(--card-border); border-radius: 8px;
      padding: 3px 8px; font-size: 0.82rem; display: inline-flex; align-items: center; gap: 6px;
    }
    .btn-voice-inline {
      border: none; background: transparent; cursor: pointer; font-size: 13px; opacity: 0.75;
    }
    .btn-voice-inline:hover { opacity: 1; }

    /* 20-GRID TIANZIGE */
    .writing-grid-section-20 {
      margin-top: 14px; display: flex; flex-direction: column; gap: 6px;
    }
    .grid-boxes-10-row {
      display: grid; grid-template-columns: repeat(10, 1fr); gap: 6px;
    }
    .tianzige-box {
      aspect-ratio: 1; border: 1.5px solid var(--grid-border); border-radius: 10px;
      background: var(--clay-surface); position: relative; display: flex;
      align-items: center; justify-content: center; overflow: hidden;
      box-shadow: inset 1px 1px 3px rgba(0,0,0,0.03);
    }
    .tianzige-box::before {
      content: ''; position: absolute; top: 0; bottom: 0; left: 50%;
      border-left: 1px dashed var(--grid-cross);
    }
    .tianzige-box::after {
      content: ''; position: absolute; left: 0; right: 0; top: 50%;
      border-top: 1px dashed var(--grid-cross);
    }
    .box-tag {
      position: absolute; top: 2px; left: 3px; font-size: 0.6rem; font-weight: 800;
      color: var(--text-light); z-index: 5; line-height: 1; pointer-events: none;
    }
    .guidance-box .box-tag { color: #e11d48; }
    .model-box .box-tag { color: #2563eb; }
    .guidance-box { border-color: #f43f5e; border-width: 2px; cursor: pointer; }
    .model-box { border-color: #2563eb; border-width: 2px; }

    .kanji-svg { width: 90% !important; height: 90% !important; z-index: 2; }
    .char-fallback { font-size: 2rem; font-family: var(--font-kyokasho); font-weight: 700; z-index: 2; }
    .trace-char { color: #94a3b8; opacity: 0.65; }

    .ruled-writing-row {
      margin-top: 10px; padding-top: 8px; border-top: 1px dotted var(--card-border);
      display: flex; flex-direction: column; gap: 5px; font-size: 0.78rem;
    }
    .ruled-item { display: flex; align-items: baseline; gap: 8px; }
    .ruled-lbl { font-weight: 700; color: var(--text-sub); white-space: nowrap; font-size: 0.74rem; }
    .ruled-line { flex: 1; border-bottom: 1.5px dotted var(--grid-cross); height: 14px; }

    /* SEPARATE EXERCISE PAGES */
    .exercise-page-card {
      background: var(--clay-card-bg); border-radius: 24px; padding: 24px 28px;
      margin-bottom: 28px; border: 1px solid var(--card-border);
      box-shadow: var(--clay-shadow-out); position: relative;
    }
    .page-exercise-b { page-break-before: always; break-before: page; }
    .exercise-page-title { font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 4px; }
    .exercise-grid-list { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
    .exercise-list-item {
      background: var(--clay-surface); border-radius: 12px; padding: 10px 14px;
      border: 1px solid var(--card-border); font-size: 0.92rem; display: flex;
      flex-direction: column; gap: 4px;
    }
    .exercise-q-text { font-size: 0.95rem; font-weight: 600; color: var(--text-main); }
    .answer-key {
      display: inline-block; font-size: 0.78rem; font-weight: 700;
      color: var(--pastel-rose-txt); background: var(--pastel-rose-bg);
      border: 1px solid var(--pastel-rose-border); padding: 2px 8px; border-radius: 6px;
      align-self: flex-start;
    }

    /* =======================================================
       🎴 FLASHCARD 3D CLAYMORPHISM STYLING
       ======================================================= */
    .flashcard-stage {
      max-width: 620px;
      margin: 10px auto 30px;
      perspective: 1200px;
    }

    .flashcard-3d {
      width: 100%;
      min-height: 440px;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      user-select: none;
    }

    .flashcard-3d.flipped {
      transform: rotateY(180deg);
    }

    .flashcard-face {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      border-radius: 28px;
      padding: 30px 28px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1.5px solid var(--card-border);
      box-shadow: 0 16px 36px rgba(124, 58, 237, 0.08), 0 2px 6px rgba(0,0,0,0.04);
    }

    .flashcard-front {
      background: var(--clay-card-bg);
      text-align: center;
    }

    .flashcard-back {
      background: var(--clay-card-bg);
      transform: rotateY(180deg);
    }

    .fc-hero-char {
      font-size: 6.5rem;
      font-family: var(--font-kyokasho);
      font-weight: 900;
      line-height: 1.1;
      color: var(--text-main);
      text-shadow: 0 4px 12px rgba(0,0,0,0.05);
      margin: 20px 0;
    }

    .fc-controls-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 18px;
      flex-wrap: wrap;
    }

    .fc-btn {
      padding: 9px 18px;
      border-radius: 9999px;
      border: 1.5px solid var(--card-border);
      background: var(--clay-surface);
      color: var(--text-main);
      font-weight: 800;
      font-size: 0.85rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: var(--clay-shadow-pill);
      transition: all 0.2s ease;
      outline: none;
    }
    .fc-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--clay-shadow-out);
    }
    .fc-btn.primary {
      background: linear-gradient(135deg, #7c3aed, #6d28d9);
      color: white;
      border: none;
      box-shadow: 0 4px 14px rgba(124, 58, 237, 0.3);
    }

    /* =======================================================
       STROKE ANIMATION MODAL & SVG CANVAS
       ======================================================= */
    .modal-backdrop {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(8px);
      z-index: 2000; display: none; align-items: center; justify-content: center; padding: 16px;
    }
    .modal-backdrop.active { display: flex !important; }

    .modal-card {
      background: var(--clay-card-bg); border: 1.5px solid var(--card-border); border-radius: 28px;
      max-width: 500px; width: 100%; padding: 26px; box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
      position: relative; animation: modalPop 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes modalPop {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .modal-close {
      position: absolute; top: 16px; right: 18px; border: none; background: transparent;
      font-size: 22px; color: var(--text-sub); cursor: pointer; border-radius: 50%;
      width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
    }
    .modal-close:hover { background: var(--clay-surface); color: var(--text-main); }

    #animCanvasWrap {
      width: 220px; height: 220px; margin: 14px auto 16px;
      background: #ffffff; border-radius: 22px; border: 2px solid var(--card-border);
      position: relative; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.06);
    }
    #animCanvasSvg { width: 100%; height: 100%; }

    .stroke-path {
      fill: none; stroke-width: 4.2; stroke-linecap: round; stroke-linejoin: round;
      transition: stroke 0.3s ease, opacity 0.3s ease;
    }
    .stroke-ghost { stroke: #cbd5e1; stroke-width: 4; opacity: 0.25; }
    @keyframes drawStrokeAnim {
      from { stroke-dashoffset: var(--stroke-len); }
      to { stroke-dashoffset: 0; }
    }
    .stroke-drawing {
      stroke: #e11d48 !important; stroke-width: 5.2 !important;
      animation: drawStrokeAnim 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .anim-controls-bar {
      display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px; flex-wrap: wrap;
    }
    .anim-ctrl-btn {
      padding: 8px 16px; border-radius: 9999px; border: 1px solid var(--card-border);
      background: var(--clay-surface); color: var(--text-main); font-weight: 700; font-size: 0.82rem;
      cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: var(--clay-shadow-pill);
      transition: all 0.2s ease;
    }
    .anim-ctrl-btn:hover { transform: translateY(-1px); }
    .anim-ctrl-btn.primary {
      background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }

    /* KANJI EXPLORER & KAMUS */
    .search-box { margin-bottom: 20px; }
    .search-input {
      width: 100%; padding: 12px 18px; border-radius: 9999px; border: 1.5px solid var(--card-border);
      background: var(--clay-card-bg); color: var(--text-main); font-family: inherit; font-size: 0.92rem;
      outline: none; box-shadow: var(--clay-shadow-pill);
    }
    .explorer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
    .explorer-card {
      background: var(--clay-card-bg); border-radius: 18px; padding: 16px;
      border: 1px solid var(--card-border); box-shadow: var(--clay-shadow-pill);
      display: flex; flex-direction: column; gap: 8px;
    }
    .explorer-top { display: flex; align-items: center; justify-content: space-between; }
    .exp-char { font-size: 2.5rem; font-weight: 800; color: var(--text-main); cursor: pointer; font-family: var(--font-kyokasho); }

    /* DOWNLOAD CENTER */
    .download-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
    .dl-card {
      background: var(--clay-card-bg); border-radius: 18px; padding: 18px;
      border: 1px solid var(--card-border); box-shadow: var(--clay-shadow-pill);
      display: flex; flex-direction: column; justify-content: space-between; gap: 12px;
    }
    .dl-card-title { font-size: 0.98rem; font-weight: 800; color: var(--text-main); }
    .dl-card-sub { font-size: 0.78rem; color: var(--text-sub); }
    .btn-dl-pdf {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 9px 14px; border-radius: 12px; background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: #ffffff; font-weight: 700; font-size: 0.82rem; text-align: center; text-decoration: none;
      box-shadow: 0 3px 8px rgba(37,99,235,0.25); border: none; cursor: pointer; width: 100%;
    }

    /* PRINT MEDIA */
    @page { size: A4 portrait; margin: 8mm 10mm; }
    @media print {
      body { background: #ffffff !important; color: #000000 !important; font-family: var(--font-kyokasho) !important; }
      .app-header, .hero-banner, .no-print, .btn-animate-stroke { display: none !important; }
      .app-main { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
      #tab-worksheets { display: block !important; }
      #tab-flashcards, #tab-quiz, #tab-progress, #tab-explorer, #tab-downloads { display: none !important; }
      .worksheet-page, .exercise-page-card { box-shadow: none !important; border: none !important; padding: 0 !important; margin-bottom: 12mm !important; page-break-after: always !important; }
      .page-exercise-b { page-break-before: always !important; break-before: page !important; }
      .kanji-unit { box-shadow: none !important; border: 1.5px solid #94a3b8 !important; padding: 10px 12px !important; margin-bottom: 12px !important; page-break-inside: avoid !important; }
      .tianzige-box { box-shadow: none !important; border: 1.2px solid #64748b !important; }
      .guidance-box { border: 1.8px solid #dc2626 !important; }
      .model-box { border: 1.8px solid #2563eb !important; }
      .ruled-writing-row { display: flex !important; border-top: 1px dashed #94a3b8 !important; }
      .ruled-line { border-bottom: 1.5px dotted #64748b !important; }
      .exercise-list-item { background: #ffffff !important; border: 1px solid #94a3b8 !important; page-break-inside: avoid !important; }
      .answer-key { display: none !important; }
    }
  </style>
</head>
<body data-theme="light">

  <!-- Header Bar -->
  <header class="app-header no-print">
    <div class="header-inner">
      <div class="logo-area">
        <span class="logo-icon">🎌</span>
        <div class="logo-text">
          <h1>IRODORI Kanji Studio <span class="tag-version" id="headerLevelTag">A1 • A2.1 • A2.2</span></h1>
          <p>Studio Latihan Kanji 20-Grid V5 • UD Digi Kyokasho • Standard Japan Foundation</p>
        </div>
      </div>

      <!-- Navigation Tabs (Claymorphism Pill Container) -->
      <nav class="nav-tabs" id="navTabs">
        <button class="nav-tab active" data-tab="tab-worksheets" onclick="switchTab('tab-worksheets')">
          <span>📝 Lembar Latihan</span>
        </button>
        <button class="nav-tab" data-tab="tab-flashcards" onclick="switchTab('tab-flashcards')">
          <span>🎴 Flashcard 3D</span>
        </button>
        <button class="nav-tab" data-tab="tab-quiz" onclick="switchTab('tab-quiz')">
          <span>🎯 Kuis Mandiri</span>
        </button>
        <button class="nav-tab" data-tab="tab-progress" onclick="switchTab('tab-progress')">
          <span>📊 Progres Siswa</span>
        </button>
        <button class="nav-tab" data-tab="tab-explorer" onclick="switchTab('tab-explorer')">
          <span>🔍 Kamus Kanji</span>
        </button>
        <button class="nav-tab" data-tab="tab-downloads" onclick="switchTab('tab-downloads')">
          <span>📥 Unduh Berkas</span>
        </button>
      </nav>

      <!-- Action Controls -->
      <div class="action-buttons">
        <!-- LEVEL SELECTOR PILL -->
        <div class="clay-select-wrapper">
          <label for="levelSelector">LEVEL</label>
          <select id="levelSelector" onchange="handleLevelChange(this.value)">
            <option value="A1">🌸 A1 (入門 - Pemula)</option>
            <option value="A2.1">🌊 A2.1 (初級1 - Dasar 1)</option>
            <option value="A2.2" selected>⚡ A2.2 (初級2 - Dasar 2)</option>
          </select>
        </div>

        <!-- BAB SELECTOR PILL -->
        <div class="clay-select-wrapper">
          <label for="babSelector">BAB</label>
          <select id="babSelector" onchange="handleBabChange(this.value)">
            <option value="all">Semua (Bab 1 - 18)</option>
            ${kanjiDataA22.map(d => `<option value="${d.bab}">Bab ${d.bab}: ${d.titleJp.split(' ')[1] || d.titleId}</option>`).join('')}
          </select>
        </div>

        <button class="btn-action btn-print" onclick="window.print()" title="Cetak lembar kerja A4 presisi">
          <span>🖨️ Cetak A4</span>
        </button>

        <button class="theme-toggle" onclick="toggleTheme()" title="Ganti Tema Warna">🌓</button>

        <div id="authProfileContainer">
          <div class="user-pill" style="cursor:default;" title="Akun Terintegrasi Portal JP10 Otsutsuki">
            <div class="user-avatar" style="background:linear-gradient(135deg, #f59e0b, #d97706);">👑</div>
            <span>Sensei (JP10)</span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Application Body -->
  <main class="app-main">

    <!-- Hero Banner -->
    <div class="hero-banner no-print">
      <div class="hero-text">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;flex-wrap:wrap;">
          <span class="curriculum-tag" id="userStatusTag" style="background:var(--pastel-sage-bg);color:var(--pastel-sage-txt);border-color:var(--pastel-sage-border);">✅ Akun Terintegrasi Portal JP10 (Akses Penuh Bab 1-18)</span>
          <span class="curriculum-tag" id="activeLevelBadge" style="background:var(--pastel-lavender-bg);color:var(--accent-lavender);border-color:var(--accent-lavender);font-weight:800;">⚡ Level A2.2 (初級2)</span>
        </div>
        <h2 id="heroTitleText">🎌 Studio Latihan Kanji 20-Grid IRODORI (UD Digi Kyokasho)</h2>
        <p id="heroSubtitleText">
          Model & Jiplak presisi vektor identik 100%, 20 Kotak Tianzige (2 Baris), animasi goresan interaktif, 
          Flashcard 3D membalik, serta <strong>Halaman Latihan A & B yang terpisah rapi saat dicetak</strong>.
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat-pill">
          <span class="stat-num" id="statMasteredCount">432</span>
          <span class="stat-lbl">Kanji Tersedia</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">54</span>
          <span class="stat-lbl">Bab Lengkap (3 Level)</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">20</span>
          <span class="stat-lbl">Kotak / Kanji</span>
        </div>
      </div>
    </div>

    <!-- TAB 1: LEMBAR LATIHAN KERJA (WORKSHEETS) -->
    <section id="tab-worksheets" class="tab-content active">
      ${renderWorksheetLevelHtml("A1", kanjiDataA1, LEVEL_META["A1"])}
      ${renderWorksheetLevelHtml("A2.1", kanjiDataA21, LEVEL_META["A2.1"])}
      ${renderWorksheetLevelHtml("A2.2", kanjiDataA22, LEVEL_META["A2.2"])}
    </section>

    <!-- TAB 2: FLASHCARD 3D INTERAKTIF -->
    <section id="tab-flashcards" class="tab-content">
      <div style="text-align:center;margin-bottom:14px;" class="no-print">
        <h3 style="font-size:1.25rem;font-weight:800;color:var(--text-main);">🎴 Flashcard Menghafal Kanji (3D Flip)</h3>
        <p style="font-size:0.84rem;color:var(--text-sub);">Klik kartu atau tekan Spasi pada keyboard untuk membalik kartu dan melihat detailnya.</p>
      </div>

      <div class="flashcard-stage no-print">
        <div class="flashcard-3d" id="flashcardBox" onclick="flipFlashcard()">
          <!-- FRONT FACE -->
          <div class="flashcard-face flashcard-front">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="curriculum-tag" id="fcLevelBadge">Level A1 • Bab 1</span>
              <span style="font-size:0.8rem;font-weight:800;color:var(--text-light);" id="fcCounter">1 / 10</span>
              <button class="btn-voice-mini" onclick="event.stopPropagation(); speakCurrentFlashcard();" title="Dengarkan Pengucapan">🔊</button>
            </div>

            <div class="fc-hero-char" id="fcChar">一</div>

            <div>
              <div style="display:flex;justify-content:center;gap:6px;margin-bottom:12px;">
                <span class="reading-tag tag-stroke" id="fcStrokesTag">1 Goresan</span>
                <span class="reading-tag tag-radical" id="fcRadicalTag">Radikal: 一</span>
              </div>
              <div style="font-size:0.8rem;color:var(--text-light);display:flex;align-items:center;justify-content:center;gap:6px;">
                <span>🔄 Klik kartu untuk membalik</span>
              </div>
            </div>
          </div>

          <!-- BACK FACE -->
          <div class="flashcard-face flashcard-back">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span class="curriculum-tag" id="fcBackLevelBadge">Level A1 • Bab 1</span>
                <button class="btn-voice-mini" onclick="event.stopPropagation(); speakCurrentFlashcard();" title="Dengarkan">🔊</button>
              </div>

              <div style="display:flex;align-items:baseline;gap:10px;margin-bottom:10px;">
                <span style="font-size:2.4rem;font-weight:900;font-family:var(--font-kyokasho);color:var(--text-main);" id="fcBackChar">一</span>
                <span style="font-size:1.35rem;font-weight:800;color:var(--pastel-blue-txt);" id="fcBackMeaning">Satu</span>
              </div>

              <div style="display:flex;flex-direction:column;gap:6px;background:var(--clay-surface);padding:12px 14px;border-radius:14px;border:1px solid var(--card-border);margin-bottom:12px;text-align:left;">
                <div style="font-size:0.85rem;"><strong style="color:#92400e;">音 (Onyomi):</strong> <span id="fcBackOn">-</span></div>
                <div style="font-size:0.85rem;"><strong style="color:#3730a3;">訓 (Kunyomi):</strong> <span id="fcBackKun">-</span></div>
                <div style="font-size:0.78rem;color:var(--text-sub);margin-top:2px;"><strong>Urutan:</strong> <span id="fcBackStrokeRule">-</span></div>
              </div>

              <div style="text-align:left;margin-bottom:10px;">
                <div style="font-size:0.78rem;font-weight:700;color:var(--text-sub);margin-bottom:4px;">Kosakata Terkait:</div>
                <div id="fcBackVocabPills" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
              </div>
            </div>

            <div>
              <div style="background:var(--clay-surface);padding:8px 12px;border-radius:12px;border:1px solid var(--card-border);margin-bottom:14px;text-align:left;">
                <div style="font-weight:700;font-size:0.88rem;color:var(--text-main);" id="fcBackSentence">...</div>
                <div style="font-size:0.75rem;font-style:italic;color:var(--text-sub);" id="fcBackSentenceId">"..."</div>
              </div>

              <div style="display:flex;gap:8px;justify-content:center;">
                <button class="btn-animate-stroke" onclick="event.stopPropagation(); playCurrentFlashcardAnimation();">
                  ▶️ Putar Animasi Goresan
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- FLASHCARD CONTROLS -->
        <div class="fc-controls-bar">
          <button class="fc-btn" onclick="prevFlashcard()" title="Kartu Sebelumnya (Tombol Panah Kiri)">⬅️ Sebelumnya</button>
          <button class="fc-btn primary" onclick="flipFlashcard()" title="Balik Kartu (Spasi)">🔄 Balik Kartu</button>
          <button class="fc-btn" onclick="shuffleFlashcards()" title="Acak urutan kartu">🔀 Acak</button>
          <button class="fc-btn" onclick="nextFlashcard()" title="Kartu Berikutnya (Tombol Panah Kanan)">Berikutnya ➡️</button>
        </div>
      </div>
    </section>

    <!-- TAB 3: KUIS MANDIRI INTERAKTIF -->
    <section id="tab-quiz" class="tab-content">
      <div class="quiz-container" id="quizContainer">
        <!-- Rendered dynamically via renderQuizView() -->
      </div>
    </section>

    <!-- TAB 4: PROGRES BELAJAR SISWA -->
    <section id="tab-progress" class="tab-content">
      <div class="progress-dashboard">
        <div class="dash-summary-row" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:14px;margin-bottom:20px;">
          <div class="stat-pill" style="padding:14px;border-radius:18px;">
            <span class="stat-num" id="dashTotalMastered">0 / 432</span>
            <span class="stat-lbl">Kanji Dikuasai</span>
          </div>
          <div class="stat-pill" style="padding:14px;border-radius:18px;">
            <span class="stat-num" id="dashCompletedBab">0 / 18</span>
            <span class="stat-lbl">Bab Tuntas (Kuis >= 70%)</span>
          </div>
          <div class="stat-pill" style="padding:14px;border-radius:18px;">
            <span class="stat-num" id="dashAvgScore">0%</span>
            <span class="stat-lbl">Rata-rata Skor Kuis</span>
          </div>
        </div>

        <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-main);margin-bottom:12px;">Daftar Bab & Nilai Kuis</h3>
        <div class="progress-chapter-list" id="progressChapterList" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:12px;"></div>
      </div>
    </section>

    <!-- TAB 5: KAMUS & KANJI EXPLORER -->
    <section id="tab-explorer" class="tab-content">
      <div class="explorer-container">
        <div class="search-box">
          <input type="text" class="search-input" id="explorerSearchInput" placeholder="Cari Kanji, arti kata Indonesia, Onyomi, Kunyomi, atau nomor Bab..." oninput="handleKanjiSearch(this.value)">
        </div>
        <div class="explorer-grid" id="explorerGrid"></div>
      </div>
    </section>

    <!-- TAB 6: UNDUH BERKAS (MASTER DOWNLOADS) -->
    <section id="tab-downloads" class="tab-content">
      <div style="background:linear-gradient(135deg, #e0e7ff, #fde8ef);border-radius:24px;padding:22px;margin-bottom:20px;box-shadow:var(--clay-shadow-out);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;">
        <div>
          <span class="curriculum-tag" style="background:#ffffff;">Master Bundle Resmi</span>
          <h3 style="font-size:1.15rem;font-weight:800;color:#1e293b;margin:4px 0;">Paket Lengkap Seluruh Bab (Level A1 • A2.1 • A2.2)</h3>
          <p style="font-size:0.84rem;color:#475569;">Berisi seluruh 432+ Kanji lengkap dengan diagram 20-grid Tianzige & latihan soal presisi.</p>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn-action btn-print" onclick="window.print()">
            🖨️ Cetak Halaman Aktif (A4)
          </button>
        </div>
      </div>

      <div class="download-grid" id="downloadsGridContainer">
        <!-- Rendered dynamically based on currentLevel -->
      </div>
    </section>

  </main>

  <!-- PURE SVG STROKE ANIMATION MODAL -->
  <div class="modal-backdrop" id="strokeModal">
    <div class="modal-card" style="text-align:center;">
      <button class="modal-close" onclick="closeStrokeModal()">✕</button>

      <div style="display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:6px;">
        <span id="animKanjiTitle" style="font-size:3.2rem;font-weight:900;color:var(--text-main);font-family:var(--font-kyokasho);line-height:1;">漢</span>
        <div style="text-align:left;">
          <div id="animKanjiMeaning" style="font-size:1.15rem;font-weight:800;color:var(--text-main);">Arti Huruf</div>
          <div style="display:flex;gap:6px;margin-top:2px;">
            <span id="animStrokeCountTag" class="reading-tag tag-stroke">0 Goresan</span>
            <button class="btn-voice-mini" onclick="speakCurrentAnimKanji()" title="Dengarkan Suara Kanji">🔊</button>
          </div>
        </div>
      </div>

      <!-- Tianzige Canvas -->
      <div id="animCanvasWrap">
        <svg id="animCanvasSvg" viewBox="0 0 109 109">
          <!-- Cross lines -->
          <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#e2e8f0" stroke-dasharray="2.5,2.5" stroke-width="1" />
          <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#e2e8f0" stroke-dasharray="2.5,2.5" stroke-width="1" />
          <!-- Ghost outlines -->
          <g id="animGhostGroup"></g>
          <!-- Animated drawing strokes -->
          <g id="animStrokesGroup"></g>
        </svg>
      </div>

      <div style="font-size:0.84rem;font-weight:700;color:var(--text-sub);margin:10px 0 14px;" id="animStepIndicator">
        Langkah Goresan: 1 / 1
      </div>

      <div class="anim-controls-bar">
        <button class="anim-ctrl-btn" onclick="prevStrokeStep()" title="Langkah sebelumnya">⏮️ Mundur</button>
        <button class="anim-ctrl-btn primary" id="animPlayBtn" onclick="toggleStrokePlay()">⏸️ Jeda</button>
        <button class="anim-ctrl-btn" onclick="nextStrokeStep()" title="Langkah berikutnya">Maju ⏭️</button>
        <button class="anim-ctrl-btn" onclick="resetStrokePlayer()" title="Ulangi dari awal">🔄 Ulangi</button>
      </div>
    </div>
  </div>

  <!-- CLIENT-SIDE APPLICATION LOGIC -->
  <script>
    // --- MULTI-LEVEL DATA ENGINE ---
    const KANJI_DATA_BY_LEVEL = ${JSON.stringify(KANJI_DATA_BY_LEVEL)};
    const LEVEL_META = ${JSON.stringify(LEVEL_META)};
    const kanjiStrokesMap = ${JSON.stringify(kanjiStrokesMap)};

    let currentLevel = localStorage.getItem('kanji_studio_level') || 'A2.2';
    if (!KANJI_DATA_BY_LEVEL[currentLevel]) currentLevel = 'A2.2';
    let kanjiData = KANJI_DATA_BY_LEVEL[currentLevel];
    let currentBab = '1';

    // Current user context
    let currentUser = {
      uid: 'portal_user',
      displayName: 'Siswa JP10',
      email: 'siswa@jp10.ac.id',
      masteredKanji: [],
      quizScores: {}
    };

    // --- LEVEL SWITCHER ---
    function handleLevelChange(lvl) {
      if (!KANJI_DATA_BY_LEVEL[lvl]) return;
      currentLevel = lvl;
      kanjiData = KANJI_DATA_BY_LEVEL[currentLevel];
      localStorage.setItem('kanji_studio_level', currentLevel);

      // Update Header Dropdown
      const lvlSelect = document.getElementById('levelSelector');
      if (lvlSelect) lvlSelect.value = currentLevel;

      // Update Tag & Badge
      const headerTag = document.getElementById('headerLevelTag');
      if (headerTag) headerTag.innerText = currentLevel;

      const badge = document.getElementById('activeLevelBadge');
      if (badge) {
        badge.innerText = LEVEL_META[currentLevel].label;
        badge.style.color = LEVEL_META[currentLevel].color;
        badge.style.borderColor = LEVEL_META[currentLevel].color;
      }

      // Re-populate Bab Selector
      const babSelect = document.getElementById('babSelector');
      if (babSelect) {
        babSelect.innerHTML = \`<option value="all">Semua (Bab 1 - 18)</option>\` +
          kanjiData.map(d => \`<option value="\${d.bab}">Bab \${d.bab}: \${(d.titleJp.split(' ')[1] || d.titleId).replace(/</g, '&lt;')}</option>\`).join('');
        babSelect.value = '1';
      }
      currentBab = '1';

      // Update Views
      updateWorksheetVisibility();
      initFlashcards();

      const statMasteredEl = document.getElementById('statMasteredCount');
      if (statMasteredEl) statMasteredEl.innerText = LEVEL_META[currentLevel].totalKanji;

      if (document.getElementById('tab-quiz').classList.contains('active')) renderQuizView();
      if (document.getElementById('tab-progress').classList.contains('active')) renderProgressView();
      if (document.getElementById('tab-explorer').classList.contains('active')) renderExplorerView();
      if (document.getElementById('tab-downloads').classList.contains('active')) renderDownloadsView();
    }

    function updateWorksheetVisibility() {
      const allSheets = document.querySelectorAll('.worksheet-page, .exercise-page-card');
      allSheets.forEach(el => el.style.display = 'none');

      if (currentBab === 'all') {
        const activeSheets = document.querySelectorAll(\`[data-level="\${currentLevel}"]\`);
        activeSheets.forEach(el => el.style.display = 'block');
      } else {
        const targetSheet = document.getElementById(\`sheet-\${currentLevel}-bab-\${currentBab}\`);
        const targetExA = document.getElementById(\`sheet-\${currentLevel}-bab-\${currentBab}-ex-a\`);
        const targetExB = document.getElementById(\`sheet-\${currentLevel}-bab-\${currentBab}-ex-b\`);
        if (targetSheet) targetSheet.style.display = 'block';
        if (targetExA) targetExA.style.display = 'block';
        if (targetExB) targetExB.style.display = 'block';
      }
    }

    function handleBabChange(val) {
      currentBab = val;
      updateWorksheetVisibility();
      initFlashcards();
      if (document.getElementById('tab-quiz').classList.contains('active')) renderQuizView();
    }

    // --- TAB SWITCHING ---
    function switchTab(tabId) {
      document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
      const activeTabBtn = document.querySelector(\`[data-tab="\${tabId}"]\`);
      if (activeTabBtn) activeTabBtn.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
      const targetSec = document.getElementById(tabId);
      if (targetSec) targetSec.classList.add('active');

      if (tabId === 'tab-flashcards') initFlashcards();
      if (tabId === 'tab-quiz') renderQuizView();
      if (tabId === 'tab-progress') renderProgressView();
      if (tabId === 'tab-explorer') renderExplorerView();
      if (tabId === 'tab-downloads') renderDownloadsView();
      if (tabId === 'tab-worksheets') updateWorksheetVisibility();
    }

    // --- TEXT-TO-SPEECH (TTS) ---
    function speakJapanese(text) {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = 0.88;
      window.speechSynthesis.speak(u);
    }

    // --- THEME ---
    function initTheme() {
      const savedTheme = localStorage.getItem('kanji_studio_theme') || 'light';
      document.body.setAttribute('data-theme', savedTheme);
    }
    function toggleTheme() {
      const cur = document.body.getAttribute('data-theme') || 'light';
      const nxt = cur === 'light' ? 'dark' : 'light';
      document.body.setAttribute('data-theme', nxt);
      localStorage.setItem('kanji_studio_theme', nxt);
    }

    // =======================================================
    // 🎴 FLASHCARD 3D ENGINE
    // =======================================================
    let fcList = [];
    let fcIndex = 0;
    let isFlipped = false;

    function initFlashcards() {
      fcList = [];
      const targetBab = currentBab === 'all' ? null : parseInt(currentBab, 10);

      kanjiData.forEach(ch => {
        if (!targetBab || ch.bab === targetBab) {
          ch.kanjiList.forEach(k => {
            fcList.push({
              ...k,
              bab: ch.bab,
              babTitle: ch.titleId,
              level: currentLevel
            });
          });
        }
      });

      if (fcList.length === 0 && kanjiData[0]) {
        kanjiData[0].kanjiList.forEach(k => {
          fcList.push({ ...k, bab: 1, babTitle: kanjiData[0].titleId, level: currentLevel });
        });
      }

      fcIndex = 0;
      isFlipped = false;
      renderCurrentFlashcard();
    }

    function renderCurrentFlashcard() {
      const box = document.getElementById('flashcardBox');
      if (!box || fcList.length === 0) return;

      if (isFlipped) {
        box.classList.remove('flipped');
        isFlipped = false;
      }

      const item = fcList[fcIndex];
      // Front
      document.getElementById('fcLevelBadge').innerText = \`Level \${item.level} • Bab \${item.bab}\`;
      document.getElementById('fcCounter').innerText = \`\${fcIndex + 1} / \${fcList.length}\`;
      document.getElementById('fcChar').innerText = item.kanji;
      document.getElementById('fcStrokesTag').innerText = \`\${item.strokes} Goresan\`;
      document.getElementById('fcRadicalTag').innerText = \`Radikal: \${item.radical}\`;

      // Back
      document.getElementById('fcBackLevelBadge').innerText = \`Level \${item.level} • Bab \${item.bab}\`;
      document.getElementById('fcBackChar').innerText = item.kanji;
      document.getElementById('fcBackMeaning').innerText = item.meaning;
      document.getElementById('fcBackOn').innerText = item.on;
      document.getElementById('fcBackKun').innerText = item.kun;
      document.getElementById('fcBackStrokeRule').innerText = item.strokeRule;

      // Vocab pills
      const pillsBox = document.getElementById('fcBackVocabPills');
      pillsBox.innerHTML = item.words.map(w => \`
        <span class="vocab-pill">
          <ruby><strong>\${w.word}</strong><rt>\${w.reading}</rt></ruby>: \${w.meaning}
          <button class="btn-voice-inline" onclick="event.stopPropagation(); speakJapanese('\${w.word}')" title="Dengar">🔊</button>
        </span>
      \`).join('');

      // Sentence
      document.getElementById('fcBackSentence').innerHTML = formatSentenceRuby(item.sentenceFurigana);
      document.getElementById('fcBackSentenceId').innerText = \`"\${item.sentenceId}"\`;
    }

    function flipFlashcard() {
      const box = document.getElementById('flashcardBox');
      if (!box) return;
      isFlipped = !isFlipped;
      if (isFlipped) {
        box.classList.add('flipped');
      } else {
        box.classList.remove('flipped');
      }
    }

    function nextFlashcard() {
      if (fcList.length === 0) return;
      fcIndex = (fcIndex + 1) % fcList.length;
      renderCurrentFlashcard();
    }

    function prevFlashcard() {
      if (fcList.length === 0) return;
      fcIndex = (fcIndex - 1 + fcList.length) % fcList.length;
      renderCurrentFlashcard();
    }

    function shuffleFlashcards() {
      for (let i = fcList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fcList[i], fcList[j]] = [fcList[j], fcList[i]];
      }
      fcIndex = 0;
      renderCurrentFlashcard();
    }

    function speakCurrentFlashcard() {
      if (fcList[fcIndex]) {
        speakJapanese(fcList[fcIndex].kanji);
      }
    }

    function playCurrentFlashcardAnimation() {
      if (fcList[fcIndex]) {
        const item = fcList[fcIndex];
        playStrokeAnimation(item.kanji, item.meaning, item.strokes);
      }
    }

    // Keyboard listener for Flashcards
    window.addEventListener('keydown', (e) => {
      const flashcardTab = document.getElementById('tab-flashcards');
      if (flashcardTab && flashcardTab.classList.contains('active')) {
        if (e.code === 'Space') {
          e.preventDefault();
          flipFlashcard();
        } else if (e.code === 'ArrowRight') {
          e.preventDefault();
          nextFlashcard();
        } else if (e.code === 'ArrowLeft') {
          e.preventDefault();
          prevFlashcard();
        }
      }
    });

    // =======================================================
    // 🎌 STROKE ORDER ANIMATOR ENGINE
    // =======================================================
    let activeStrokeList = [];
    let activeAnimKanji = '';
    let currentStrokeIndex = 0;
    let strokeTimer = null;
    let isPlaying = false;

    function playStrokeAnimation(kanji, meaning, strokesCount) {
      activeAnimKanji = kanji;
      activeStrokeList = kanjiStrokesMap[kanji] || [];
      currentStrokeIndex = 0;
      isPlaying = false;
      clearTimeout(strokeTimer);

      if (!meaning || !strokesCount) {
        let foundK = null;
        Object.values(KANJI_DATA_BY_LEVEL).some(lvl => 
          lvl.some(ch => {
            const match = ch.kanjiList.find(k => k.kanji === kanji);
            if (match) { foundK = match; return true; }
            return false;
          })
        );
        if (foundK) {
          if (!meaning) meaning = foundK.meaning;
          if (!strokesCount) strokesCount = foundK.strokes;
        }
      }

      document.getElementById('animKanjiTitle').innerText = kanji;
      document.getElementById('animKanjiMeaning').innerText = meaning || 'Kanji';
      document.getElementById('animStrokeCountTag').innerText = (strokesCount || activeStrokeList.length || 0) + ' Goresan';
      document.getElementById('animPlayBtn').innerText = '▶️ Putar Animasi';

      // Open Modal
      const modal = document.getElementById('strokeModal');
      modal.classList.add('active');
      modal.style.display = 'flex';

      setupStrokeSvgCanvas();
      speakJapanese(kanji);
      startStrokePlay();
    }

    function closeStrokeModal() {
      pauseStrokePlay();
      const modal = document.getElementById('strokeModal');
      modal.classList.remove('active');
      modal.style.display = 'none';
    }

    function speakCurrentAnimKanji() {
      if (activeAnimKanji) speakJapanese(activeAnimKanji);
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

      // Render all ghost outlines
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
          path.setAttribute('stroke-width', '5.2');
          strokesGroup.appendChild(path);

          const len = path.getTotalLength() || 100;
          path.style.setProperty('--stroke-len', len);
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
          path.classList.add('stroke-drawing');
        } else {
          path.setAttribute('stroke', '#1e293b');
          path.setAttribute('stroke-width', '4.4');
          strokesGroup.appendChild(path);
        }
      }

      const indicator = document.getElementById('animStepIndicator');
      if (indicator) {
        if (step >= total - 1 && !isPlaying) {
          indicator.innerText = '✨ Selesai! Seluruh ' + total + ' goresan lengkap.';
        } else {
          indicator.innerText = 'Langkah Goresan: ' + (step + 1) + ' / ' + total;
        }
      }
    }

    function toggleStrokePlay() {
      if (isPlaying) { pauseStrokePlay(); } else { startStrokePlay(); }
    }

    function startStrokePlay() {
      if (currentStrokeIndex >= activeStrokeList.length - 1) {
        currentStrokeIndex = 0;
      }
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

    // =======================================================
    // 🎯 QUIZ VIEW
    // =======================================================
    function renderQuizView() {
      const container = document.getElementById('quizContainer');
      const targetBab = currentBab === 'all' ? 1 : parseInt(currentBab);
      const ch = kanjiData.find(d => d.bab === targetBab) || kanjiData[0];

      container.innerHTML = \`
        <div style="margin-bottom:14px;">
          <div class="curriculum-tag" style="margin-bottom:6px;">\${LEVEL_META[currentLevel].label}</div>
          <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-main);">\${ch.titleJp} — \${ch.titleId}</h3>
          <div style="font-size:0.82rem;color:var(--text-sub);">Menampilkan kuis Bab \${ch.bab} (\${currentLevel}). Ketik jawaban Anda pada kotak di bawah.</div>
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
    }

    function checkQuizItem(type, idx, correctVal) {
      const input = document.getElementById(\`input-\${type}-\${idx}\`);
      const res = document.getElementById(\`res-\${type}-\${idx}\`);
      if (!input || !res) return;

      const userVal = input.value.trim();
      res.style.display = 'inline-block';

      if (userVal.toLowerCase() === correctVal.trim().toLowerCase()) {
        res.style.background = 'var(--pastel-sage-bg)';
        res.style.borderColor = 'var(--pastel-sage-border)';
        res.style.color = 'var(--pastel-sage-txt)';
        res.innerText = '✅ Benar! ' + correctVal;
      } else {
        res.style.background = 'var(--pastel-rose-bg)';
        res.style.borderColor = 'var(--pastel-rose-border)';
        res.style.color = 'var(--pastel-rose-txt)';
        res.innerText = '❌ Salah! Jawaban tepat: ' + correctVal;
      }
    }

    // =======================================================
    // 📊 PROGRESS VIEW
    // =======================================================
    function renderProgressView() {
      const list = document.getElementById('progressChapterList');
      list.innerHTML = kanjiData.map(ch => {
        return \`
          <div style="background:var(--clay-surface);border:1px solid var(--card-border);border-radius:16px;padding:14px 16px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-size:0.75rem;font-weight:800;color:var(--pastel-blue-txt);">Bab \${ch.bab}</span>
              <span style="font-size:0.72rem;font-weight:700;color:var(--text-sub);">
                \${ch.kanjiList.length} Kanji • 20 Soal
              </span>
            </div>
            <div style="font-size:0.88rem;font-weight:800;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              \${ch.titleJp}
            </div>
            <div style="font-size:0.76rem;color:var(--text-sub);">\${ch.titleId}</div>
          </div>
        \`;
      }).join('');
    }

    // =======================================================
    // 🔍 EXPLORER & KAMUS VIEW
    // =======================================================
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
              <div class="exp-char" title="Klik untuk dengar suara" onclick="speakJapanese('\${k.kanji}')">\${k.kanji}</div>
            </div>
            <div>
              <button class="btn-animate-stroke" onclick="playStrokeAnimation('\${k.kanji}')">
                ▶️ Animasi
              </button>
            </div>
          </div>
          <div>
            <div style="font-size:0.92rem;font-weight:800;color:var(--text-main);">\${k.meaning}</div>
            <div style="font-size:0.78rem;color:var(--text-sub);margin-top:2px;">
              音: <strong>\${k.on}</strong> | 訓: <strong>\${k.kun}</strong>
            </div>
            <div style="font-size:0.72rem;color:var(--text-light);margin-top:2px;">
              \${k.strokes} Goresan • Radikal: \${k.radical}
            </div>
          </div>
          <div style="font-size:0.78rem;background:var(--clay-surface);padding:6px 10px;border-radius:10px;color:var(--text-main);border:1px solid var(--card-border);display:flex;align-items:center;justify-content:space-between;">
            <div>
              📚 <ruby><strong>\${k.words[0] ? k.words[0].word : k.kanji}</strong><rt>\${k.words[0] ? k.words[0].reading : ''}</rt></ruby>: \${k.words[0] ? k.words[0].meaning : ''}
            </div>
            <button class="btn-voice-inline no-print" onclick="event.stopPropagation(); speakJapanese('\${k.words[0] ? k.words[0].word : k.kanji}')" title="Dengarkan kata">🔊</button>
          </div>
        </div>
      \`).join('');
    }

    function handleKanjiSearch(val) {
      renderExplorerView(val);
    }

    // =======================================================
    // 📥 DOWNLOADS VIEW
    // =======================================================
    function renderDownloadsView() {
      const container = document.getElementById('downloadsGridContainer');
      container.innerHTML = kanjiData.map(ch => \`
        <div class="dl-card">
          <div>
            <span class="curriculum-tag" style="font-size:0.65rem;">\${currentLevel} • Bab \${ch.bab}</span>
            <div class="dl-card-title">\${ch.titleJp}</div>
            <div class="dl-card-sub">\${ch.titleId}</div>
            <div style="font-size:0.75rem;color:var(--text-light);margin-top:4px;">
              \${ch.kanjiList.length} Kanji • 20 Kotak/Kanji • 20 Soal
            </div>
          </div>
          <div class="dl-actions">
            <button class="btn-dl-pdf" onclick="handleBabChange('\${ch.bab}'); switchTab('tab-worksheets'); window.print();" title="Buka lembar kerja & cetak langsung ke PDF / Printer">
              🖨️ Cetak / PDF Lembar A4 (Tianzige)
            </button>
          </div>
        </div>
      \`).join('');
    }

    // --- POSTMESSAGE LISTENER (DASHBOARD INTEGRATION) ---
    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SET_KANJI_LEVEL') {
        const targetLvl = event.data.level;
        if (KANJI_DATA_BY_LEVEL[targetLvl]) {
          handleLevelChange(targetLvl);
          if (event.data.bab) {
            handleBabChange(event.data.bab);
          }
        }
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      initTheme();
      handleLevelChange(currentLevel);
    });
  </script>
</body>
</html>`;

  // Write to index.html in Kanji Studio folder
  const targetPath = path.join(rootDir, 'index.html');
  fs.writeFileSync(targetPath, html, 'utf-8');
  console.log(`Successfully generated unified index.html with Flashcards & Claymorphism Nav (${(html.length / 1024 / 1024).toFixed(2)} MB)!`);
}

buildIndexApp();
