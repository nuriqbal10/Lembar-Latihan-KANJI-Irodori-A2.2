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
                <button class="btn-animate-stroke" onclick="playStrokeAnimation('${k.kanji}', '${k.meaning}', ${k.strokes})">
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
  console.log("Compiling Unified Multi-Level IRODORI Kanji Studio (A1, A2.1, A2.2)...");

  // Read existing CSS and scripts from original build_app.backup.js or generate cleanly
  const backupSrc = fs.readFileSync(path.join(rootDir, 'scripts', 'build_app.backup.js'), 'utf-8');

  // Extract CSS block
  const cssMatch = backupSrc.match(/<style>([\s\S]*?)<\/style>/);
  const cssContent = cssMatch ? cssMatch[1] : '';

  // Extract JS Auth & Firebase block
  const jsAuthMatch = backupSrc.match(/(\/\* =======================================================[\s\S]*?FIREBASE SDK COMPAT[\s\S]*?<\/script>)/);

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IRODORI Kanji Studio (Level A1 • A2.1 • A2.2) | Lembar Latihan 20-Grid & Kuis Interaktif</title>
  <meta name="description" content="Studio Lengkap Latihan Huruf Kanji IRODORI (A1 Pemula, A2.1 Dasar 1, A2.2 Dasar 2) dengan font UD Digi Kyokasho, 20 Kotak Grid per Kanji, Ukuran Model & Jiplak Presisi, Kuis Mandiri, dan Cetak A4">

  <!-- Firebase SDK Compat -->
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>

  <!-- Google Fonts: Inter & Noto Sans JP -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap" rel="stylesheet">

  <style>
${cssContent}
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

      <!-- Navigation Tabs -->
      <nav class="nav-tabs" id="navTabs">
        <button class="nav-tab active" data-tab="tab-worksheets" onclick="switchTab('tab-worksheets')">
          <span>📝 Lembar Latihan</span>
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

      <!-- Action Buttons -->
      <div class="action-buttons">
        <!-- LEVEL SELECTOR -->
        <div style="display:flex;align-items:center;gap:6px;background:var(--pastel-lavender-bg);padding:4px 8px;border-radius:12px;border:1.5px solid var(--accent-lavender);">
          <span style="font-size:0.75rem;font-weight:800;color:var(--accent-lavender);">LEVEL:</span>
          <select id="levelSelector" onchange="handleLevelChange(this.value)" style="border:none;background:transparent;font-weight:800;font-size:0.85rem;color:var(--text-main);cursor:pointer;outline:none;">
            <option value="A1">🌸 Level A1 (入門 - Pemula)</option>
            <option value="A2.1">🌊 Level A2.1 (初級1 - Dasar 1)</option>
            <option value="A2.2" selected>⚡ Level A2.2 (初級2 - Dasar 2)</option>
          </select>
        </div>

        <!-- BAB SELECTOR -->
        <select id="babSelector" class="select-bab" onchange="handleBabChange(this.value)">
          <option value="all">Semua Bab (Bab 1 - 18)</option>
          ${kanjiDataA22.map(d => `<option value="${d.bab}">Bab ${d.bab}: ${d.titleJp.split(' ')[1] || d.titleId}</option>`).join('')}
        </select>

        <button class="btn-action btn-print" onclick="window.print()" title="Cetak halaman A4 presisi">
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
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span class="curriculum-tag" id="userStatusTag" style="background:var(--pastel-sage-bg);color:var(--pastel-sage-txt);border-color:var(--pastel-sage-border);">✅ Akun Terintegrasi Portal JP10 (Akses Penuh Bab 1-18)</span>
          <span class="curriculum-tag" id="activeLevelBadge" style="background:var(--pastel-lavender-bg);color:var(--accent-lavender);border-color:var(--accent-lavender);font-weight:800;">⚡ Level A2.2 (初級2)</span>
        </div>
        <h2 id="heroTitleText">🎌 Studio Latihan Kanji 20-Grid IRODORI (UD Digi Kyokasho)</h2>
        <p id="heroSubtitleText">
          Model & Jiplak presisi vektor identik 100%, 20 Kotak Tianzige (2 Baris), animasi goresan interaktif, 
          serta <strong>Halaman Latihan A & B yang terpisah rapi saat dicetak</strong>.
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

    <!-- TAB 2: KUIS MANDIRI INTERAKTIF -->
    <section id="tab-quiz" class="tab-content">
      <div class="quiz-container" id="quizContainer">
        <!-- Rendered dynamically via renderQuizView() -->
      </div>
    </section>

    <!-- TAB 3: PROGRES BELAJAR SISWA -->
    <section id="tab-progress" class="tab-content">
      <div class="progress-dashboard">
        <div class="dash-summary-row">
          <div class="dash-card">
            <span class="dash-num" id="dashTotalMastered">0 / 432</span>
            <span class="dash-lbl">Kanji Dikuasai</span>
          </div>
          <div class="dash-card">
            <span class="dash-num" id="dashCompletedBab">0 / 18</span>
            <span class="dash-lbl">Bab Tuntas (Kuis >= 70%)</span>
          </div>
          <div class="dash-card">
            <span class="dash-num" id="dashAvgScore">0%</span>
            <span class="dash-lbl">Rata-rata Skor Kuis</span>
          </div>
        </div>

        <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-main);margin-bottom:12px;">Daftar Bab & Nilai Kuis</h3>
        <div class="progress-chapter-list" id="progressChapterList"></div>
      </div>
    </section>

    <!-- TAB 4: KAMUS & KANJI EXPLORER -->
    <section id="tab-explorer" class="tab-content">
      <div class="explorer-container">
        <div class="search-box">
          <input type="text" class="search-input" id="explorerSearchInput" placeholder="Cari Kanji, arti kata Indonesia, Onyomi, atau Kunyomi..." oninput="handleKanjiSearch(this.value)">
        </div>
        <div class="explorer-grid" id="explorerGrid"></div>
      </div>
    </section>

    <!-- TAB 5: UNDUH BERKAS (MASTER DOWNLOADS) -->
    <section id="tab-downloads" class="tab-content">
      <div style="background:linear-gradient(135deg, #e0e7ff, #fde8ef);border-radius:20px;padding:20px;margin-bottom:18px;box-shadow:var(--clay-shadow-out);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;">
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
        <input type="text" id="regName" class="input-field" placeholder="Nama Anda...">
        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Alamat Email</label>
        <input type="email" id="regEmail" class="input-field" placeholder="nama@email.com">
        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Password (minimal 6 karakter)</label>
        <input type="password" id="regPassword" class="input-field" placeholder="Ketik password baru..." onkeydown="if(event.key==='Enter') handleRegisterSubmit()">
        <button class="btn-action btn-print" style="width:100%;justify-content:center;padding:10px;" onclick="handleRegisterSubmit()">Daftar Akun Baru</button>
      </div>

      <div id="authErrorMessage" style="display:none;color:#e11d48;font-size:0.82rem;font-weight:700;margin-top:12px;text-align:center;"></div>
    </div>
  </div>

  <!-- INTERACTIVE STROKE ANIMATION MODAL -->
  <div class="modal-backdrop" id="strokeModal">
    <div class="modal-card" style="max-width:480px;text-align:center;">
      <button class="modal-close" onclick="closeStrokeModal()">✕</button>

      <div style="display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:8px;">
        <span id="strokeModalChar" style="font-size:2.8rem;font-weight:900;color:var(--text-main);font-family:var(--font-kyokasho);">漢</span>
        <div style="text-align:left;">
          <div id="strokeModalMeaning" style="font-size:1.1rem;font-weight:800;color:var(--text-main);">Arti Kanji</div>
          <div id="strokeModalStrokes" style="font-size:0.84rem;color:var(--text-sub);">0 Goresan</div>
        </div>
      </div>

      <div class="anim-canvas-wrapper" style="margin:16px auto;">
        <svg id="strokeAnimSvg" viewBox="0 0 109 109">
          <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#e2e8f0" stroke-dasharray="2,2" stroke-width="1" />
          <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#e2e8f0" stroke-dasharray="2,2" stroke-width="1" />
          <g id="strokeBackgroundGroup"></g>
          <g id="strokeAnimatedGroup"></g>
        </svg>
      </div>

      <div class="anim-controls">
        <button class="anim-btn" onclick="restartStrokeAnimation()" title="Ulangi dari awal">⏮️ Ulangi</button>
        <button class="anim-btn primary" id="btnToggleAnim" onclick="togglePlayPause()" title="Putar atau Jeda">⏸️ Jeda</button>
        <button class="anim-btn" onclick="stepForwardStroke()" title="Goresan berikutnya">⏭️ Langkah</button>
      </div>
      <div style="margin-top:10px;font-size:0.75rem;color:var(--text-sub);">
        Goresan ke- <span id="currentStrokeNum" style="font-weight:800;color:var(--accent-lavender);">1</span> dari <span id="totalStrokesNum" style="font-weight:800;">1</span>
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

    // Current logged in user profile (Bypass with Sensei / Student)
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

      // Re-populate Bab Selector for this Level
      const babSelect = document.getElementById('babSelector');
      if (babSelect) {
        babSelect.innerHTML = \`<option value="all">Semua Bab (Bab 1 - 18)</option>\` +
          kanjiData.map(d => \`<option value="\${d.bab}">Bab \${d.bab}: \${(d.titleJp.split(' ')[1] || d.titleId).replace(/</g, '&lt;')}</option>\`).join('');
        babSelect.value = '1';
      }
      currentBab = '1';

      // Update Visibility of Worksheets
      updateWorksheetVisibility();

      // Update Stats
      const statMasteredEl = document.getElementById('statMasteredCount');
      if (statMasteredEl) statMasteredEl.innerText = LEVEL_META[currentLevel].totalKanji;

      // Update Quiz & Explorer Views
      if (document.getElementById('tab-quiz').classList.contains('active')) {
        renderQuizView();
      }
      if (document.getElementById('tab-progress').classList.contains('active')) {
        renderProgressView();
      }
      if (document.getElementById('tab-explorer').classList.contains('active')) {
        renderExplorerView();
      }
      if (document.getElementById('tab-downloads').classList.contains('active')) {
        renderDownloadsView();
      }
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
      if (document.getElementById('tab-quiz').classList.contains('active')) {
        renderQuizView();
      }
    }

    // --- TAB SWITCHING ---
    function switchTab(tabId) {
      document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
      const activeTabBtn = document.querySelector(\`[data-tab="\${tabId}"]\`);
      if (activeTabBtn) activeTabBtn.classList.add('active');

      document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
      const targetSec = document.getElementById(tabId);
      if (targetSec) targetSec.classList.add('active');

      if (tabId === 'tab-quiz') renderQuizView();
      if (tabId === 'tab-progress') renderProgressView();
      if (tabId === 'tab-explorer') renderExplorerView();
      if (tabId === 'tab-downloads') renderDownloadsView();
      if (tabId === 'tab-worksheets') updateWorksheetVisibility();
    }

    // --- TEXT-TO-SPEECH (TTS) ---
    function speakJapanese(text) {
      if (!('speechSynthesis' in window)) {
        alert('Fitur suara tidak didukung oleh browser ini.');
        return;
      }
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

    // --- QUIZ VIEW ---
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

    // --- PROGRESS VIEW ---
    function renderProgressView() {
      const list = document.getElementById('progressChapterList');
      list.innerHTML = kanjiData.map(ch => {
        return \`
          <div style="background:var(--clay-surface);border:1px solid var(--card-border);border-radius:14px;padding:12px 14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <span style="font-size:0.75rem;font-weight:800;color:var(--pastel-blue-txt);">Bab \${ch.bab}</span>
              <span style="font-size:0.72rem;font-weight:700;color:var(--text-sub);">
                \${ch.kanjiList.length} Kanji • 20 Soal
              </span>
            </div>
            <div style="font-size:0.86rem;font-weight:700;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              \${ch.titleJp}
            </div>
            <div style="font-size:0.76rem;color:var(--text-sub);">\${ch.titleId}</div>
          </div>
        \`;
      }).join('');
    }

    // --- EXPLORER & KAMUS VIEW ---
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
          <div style="font-size:0.78rem;background:var(--clay-surface);padding:5px 8px;border-radius:8px;color:var(--text-main);border:1px solid var(--card-border);display:flex;align-items:center;justify-content:space-between;">
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

    // --- DOWNLOADS VIEW ---
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

    // --- STROKE ANIMATOR ---
    let animTimer = null;
    let animRunning = false;
    let animCurrentIndex = 0;
    let animPaths = [];

    function playStrokeAnimation(kanji, meaning, strokes) {
      const paths = kanjiStrokesMap[kanji];
      if (!paths || paths.length === 0) {
        alert('Data animasi goresan untuk Kanji "' + kanji + '" sedang dimuat.');
        return;
      }
      animPaths = paths;
      document.getElementById('strokeModalChar').innerText = kanji;
      document.getElementById('strokeModalMeaning').innerText = meaning;
      document.getElementById('strokeModalStrokes').innerText = strokes + ' Goresan';
      document.getElementById('totalStrokesNum').innerText = paths.length;

      document.getElementById('strokeModal').classList.add('active');

      const bgGroup = document.getElementById('strokeBackgroundGroup');
      bgGroup.innerHTML = paths.map(d => \`<path d="\${d}" fill="none" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>\`).join('');

      restartStrokeAnimation();
    }

    function restartStrokeAnimation() {
      if (animTimer) clearInterval(animTimer);
      animCurrentIndex = 0;
      animRunning = true;
      document.getElementById('btnToggleAnim').innerText = '⏸️ Jeda';
      document.getElementById('strokeAnimatedGroup').innerHTML = '';
      stepNextStroke();
    }

    function stepNextStroke() {
      if (animCurrentIndex >= animPaths.length) {
        animRunning = false;
        document.getElementById('btnToggleAnim').innerText = '▶️ Putar';
        return;
      }

      animCurrentIndex++;
      document.getElementById('currentStrokeNum').innerText = animCurrentIndex;

      const animatedGroup = document.getElementById('strokeAnimatedGroup');
      const d = animPaths[animCurrentIndex - 1];
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', d);
      pathEl.setAttribute('fill', 'none');
      pathEl.setAttribute('stroke', '#0f172a');
      pathEl.setAttribute('stroke-width', '4.2');
      pathEl.setAttribute('stroke-linecap', 'round');
      pathEl.setAttribute('stroke-linejoin', 'round');

      animatedGroup.appendChild(pathEl);

      const len = pathEl.getTotalLength();
      pathEl.style.strokeDasharray = len;
      pathEl.style.strokeDashoffset = len;
      pathEl.style.transition = 'stroke-dashoffset 0.45s ease-out';

      setTimeout(() => {
        pathEl.style.strokeDashoffset = '0';
      }, 20);

      if (animRunning) {
        animTimer = setTimeout(() => {
          stepNextStroke();
        }, 550);
      }
    }

    function togglePlayPause() {
      if (animRunning) {
        animRunning = false;
        if (animTimer) clearTimeout(animTimer);
        document.getElementById('btnToggleAnim').innerText = '▶️ Lanjut';
      } else {
        if (animCurrentIndex >= animPaths.length) {
          restartStrokeAnimation();
        } else {
          animRunning = true;
          document.getElementById('btnToggleAnim').innerText = '⏸️ Jeda';
          stepNextStroke();
        }
      }
    }

    function stepForwardStroke() {
      if (animTimer) clearTimeout(animTimer);
      animRunning = false;
      document.getElementById('btnToggleAnim').innerText = '▶️ Lanjut';
      if (animCurrentIndex < animPaths.length) {
        stepNextStroke();
      }
    }

    function closeStrokeModal() {
      if (animTimer) clearTimeout(animTimer);
      animRunning = false;
      document.getElementById('strokeModal').classList.remove('active');
    }

    function closeAuthModal() {
      document.getElementById('authModal').classList.remove('active');
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
  console.log(`Successfully generated unified index.html (${(html.length / 1024 / 1024).toFixed(2)} MB)!`);
}

buildIndexApp();
