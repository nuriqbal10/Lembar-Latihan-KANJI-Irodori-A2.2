const fs = require('fs');
const path = require('path');

const outputDir = path.resolve(__dirname, '..', 'Lembar Latihan Kanji');
const svgDir = path.resolve(__dirname, '..', 'assets', 'kanjivg');
const kanjiData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'kanji_irodori_a2_2_data.json'), 'utf-8'));

// Helper to get formatted KanjiVG SVG with cross grid & numbered guides
function getGuidanceSvg(kanjiChar) {
  const codePoint = kanjiChar.codePointAt(0).toString(16).padStart(5, '0');
  const svgPath = path.join(svgDir, codePoint + '.svg');
  if (!fs.existsSync(svgPath)) {
    return `<div style="font-size:24px;font-weight:bold;color:#334155;">${kanjiChar}</div>`;
  }
  let rawSvg = fs.readFileSync(svgPath, 'utf-8');

  // Strip xml header & doctype
  rawSvg = rawSvg.replace(/<\?xml[\s\S]*?<svg/i, '<svg');
  rawSvg = rawSvg.replace(/<!DOCTYPE[\s\S]*?>/i, '');

  // Add cross guidelines right after opening <svg ...>
  const crossLines = `
    <!-- Tianzige Cross Guidelines -->
    <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
    <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
  `;
  rawSvg = rawSvg.replace(/(<svg[^>]*>)/i, `$1${crossLines}`);

  // Enhance stroke path styling
  rawSvg = rawSvg.replace(/stroke:#000000;stroke-width:3;/g, 'stroke:#334155;stroke-width:3.8;stroke-linecap:round;stroke-linejoin:round;');

  // Enhance stroke numbers (vibrant pastel coral red, bold, readable)
  rawSvg = rawSvg.replace(/fill:#808080/g, 'fill:#e11d48;font-weight:bold;');
  rawSvg = rawSvg.replace(/font-size:8/g, 'font-size:10');

  // Ensure svg has proper classes and responsiveness
  rawSvg = rawSvg.replace('<svg ', '<svg class="guidance-svg" ');

  return rawSvg;
}

function generateHtmlContentV2(selectedBab = null) {
  const filteredData = selectedBab ? kanjiData.filter(d => d.bab === selectedBab) : kanjiData;
  const pageTitle = selectedBab
    ? `Lembar Latihan Kanji IRODORI A2.2 - Bab ${selectedBab}`
    : `Lembar Latihan Kanji Lengkap IRODORI A2.2 (Bab 1 - 18)`;

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageTitle}</title>
  <style>
    /* Font UD Digi Kyokasho priority, with high quality fallbacks */
    @font-face {
      font-family: 'UD Digi Kyokasho Fallback';
      src: local('UD デジタル 教科書体 NP-R'), local('UD Digi Kyokasho NP-R'), local('UD デジタル 教科書体'), local('UD Digi Kyokasho');
    }

    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=BIZ+UDPGothic:wght@400;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');

    :root {
      /* Calm Pastel Palette (Claymorphism style) */
      --bg-base: #f4f7f6;
      --clay-card-bg: #ffffff;
      --clay-surface: #fdfbf7;
      
      /* Calm Pastels */
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

      --text-main: #2d3748;
      --text-sub: #4a5568;
      --text-light: #718096;

      --grid-border: #94a3b8;
      --grid-cross: #cbd5e1;
      --trace-char: #cbd5e1;

      /* Claymorphism Shadows */
      --clay-shadow-out: 8px 8px 20px rgba(185, 195, 210, 0.4), -6px -6px 16px #ffffff;
      --clay-shadow-pill: 4px 4px 10px rgba(185, 195, 210, 0.35), -3px -3px 8px #ffffff;
      --clay-shadow-box: 3px 3px 8px rgba(185, 195, 210, 0.3), -2px -2px 6px #ffffff;
      --clay-inset: inset 2px 2px 4px rgba(185, 195, 210, 0.25), inset -2px -2px 4px #ffffff;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho', 'UD デジタル 教科書体', 'BIZ UDPGothic', 'Plus Jakarta Sans', sans-serif;
      background-color: var(--bg-base);
      color: var(--text-main);
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    /* Toolbar / Navigation (Screen only) */
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(12px);
      border-bottom: 1.5px solid #e2e8f0;
      padding: 12px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }

    .toolbar-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .toolbar-title h1 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #1e3a8a;
    }

    .badge-clay {
      background: var(--pastel-amber-bg);
      color: var(--pastel-amber-txt);
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid var(--pastel-amber-border);
      box-shadow: var(--clay-shadow-pill);
    }

    .toolbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .select-bab {
      padding: 8px 14px;
      font-size: 0.88rem;
      font-weight: 600;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      background: white;
      color: var(--text-main);
      box-shadow: var(--clay-shadow-box);
      cursor: pointer;
      outline: none;
    }

    .btn-clay {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 18px;
      font-size: 0.88rem;
      font-weight: 700;
      border-radius: 12px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-primary-clay {
      background: #2563eb;
      color: white;
      box-shadow: 4px 4px 12px rgba(37, 99, 235, 0.35), -2px -2px 8px #ffffff;
    }
    .btn-primary-clay:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }

    .btn-outline-clay {
      background: white;
      color: var(--text-main);
      border: 1.5px solid #cbd5e1;
      box-shadow: var(--clay-shadow-box);
    }
    .btn-outline-clay:hover {
      background: #f8fafc;
    }

    /* Main Container */
    .container {
      max-width: 920px;
      margin: 28px auto;
      padding: 0 16px;
    }

    /* Worksheet Page Card (Claymorphic) */
    .worksheet-page {
      background: var(--clay-card-bg);
      border-radius: 20px;
      border: 2px solid #eef2f6;
      box-shadow: var(--clay-shadow-out);
      padding: 32px 36px;
      margin-bottom: 36px;
    }

    /* Header */
    .sheet-header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 22px;
    }

    .curriculum-tag {
      font-size: 0.78rem;
      font-weight: 700;
      color: #92400e;
      background: var(--pastel-amber-bg);
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      border: 1px solid var(--pastel-amber-border);
      margin-bottom: 8px;
    }

    .sheet-title {
      font-size: 1.38rem;
      font-weight: 800;
      color: #1e3a8a;
      letter-spacing: -0.2px;
    }

    .sheet-subtitle {
      font-size: 0.92rem;
      color: var(--text-sub);
      margin-top: 4px;
    }

    /* Student Info Box (Clay Pill Style) */
    .student-info-grid {
      display: grid;
      grid-template-columns: 2fr 1.2fr 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
      background: #f8fafc;
      padding: 12px 16px;
      border-radius: 14px;
      border: 1.5px solid #e2e8f0;
      box-shadow: inset 1px 1px 3px rgba(0,0,0,0.03);
      font-size: 0.86rem;
    }

    .info-field {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .info-field .label {
      font-weight: 700;
      color: #3b82f6;
      white-space: nowrap;
    }

    .info-field .line {
      flex: 1;
      border-bottom: 1.5px dotted #94a3b8;
      height: 16px;
    }

    .score-box {
      border: 1.5px dashed #3b82f6;
      background: white;
      border-radius: 8px;
      text-align: center;
      padding: 3px 8px;
      font-weight: 800;
      color: #1e40af;
      box-shadow: var(--clay-shadow-box);
    }

    /* Section Subheading */
    .section-title {
      font-size: 1.02rem;
      font-weight: 800;
      color: #1e293b;
      margin: 24px 0 14px 0;
      display: flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      padding: 8px 14px;
      border-radius: 10px;
      border-left: 5px solid #3b82f6;
    }

    /* Kanji Card (Claymorphism Calm Style) */
    .kanji-card {
      border: 1.8px solid #e2e8f0;
      border-radius: 16px;
      margin-bottom: 22px;
      background: #ffffff;
      box-shadow: 4px 4px 12px rgba(185, 195, 210, 0.25), -3px -3px 8px #ffffff;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .kanji-header {
      background: #fcfbf9;
      border-bottom: 1.5px solid #edf2f7;
      padding: 12px 16px;
      display: grid;
      grid-template-columns: 84px 1fr;
      gap: 16px;
      align-items: center;
    }

    .kanji-hero {
      width: 80px;
      height: 80px;
      background: white;
      border: 2px solid #3b82f6;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho', sans-serif;
      font-size: 48px;
      font-weight: 900;
      color: #0f172a;
      box-shadow: var(--clay-shadow-box);
      position: relative;
    }

    /* Cross inside hero */
    .kanji-hero::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 1px;
      border-top: 1px dashed #cbd5e1;
      top: 50%;
      left: 0;
      pointer-events: none;
    }
    .kanji-hero::after {
      content: '';
      position: absolute;
      width: 1px;
      height: 100%;
      border-left: 1px dashed #cbd5e1;
      left: 50%;
      top: 0;
      pointer-events: none;
    }

    .kanji-meta {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .kanji-readings {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
    }

    .reading-tag {
      font-size: 0.8rem;
      padding: 3px 10px;
      border-radius: 8px;
      font-weight: 700;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.03);
    }
    .tag-on {
      background: var(--pastel-rose-bg);
      color: var(--pastel-rose-txt);
      border: 1px solid var(--pastel-rose-border);
    }
    .tag-kun {
      background: var(--pastel-blue-bg);
      color: var(--pastel-blue-txt);
      border: 1px solid var(--pastel-blue-border);
    }
    .tag-stroke {
      background: var(--pastel-sage-bg);
      color: var(--pastel-sage-txt);
      border: 1px solid var(--pastel-sage-border);
    }
    .tag-radical {
      background: var(--pastel-lavender-bg);
      color: var(--pastel-lavender-txt);
      border: 1px solid var(--pastel-lavender-border);
    }

    .kanji-meaning {
      font-size: 0.96rem;
      font-weight: 800;
      color: #1e293b;
    }

    .stroke-rule {
      font-size: 0.8rem;
      color: #64748b;
      font-style: italic;
    }

    /* Details Rows */
    .kanji-details-row {
      padding: 9px 16px;
      border-bottom: 1px dashed #e2e8f0;
      font-size: 0.86rem;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      align-items: baseline;
    }

    .row-label {
      font-weight: 800;
      color: #475569;
      min-width: 95px;
    }

    .word-pill {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 3px 10px;
      border-radius: 8px;
      font-size: 0.84rem;
      box-shadow: 1px 1px 3px rgba(0,0,0,0.02);
    }

    .word-kanji {
      font-family: 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho', sans-serif;
      font-weight: 800;
      color: #1d4ed8;
    }

    .sentence-jp {
      font-family: 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho', sans-serif;
      font-weight: 700;
      color: #1e293b;
    }

    .sentence-id {
      color: #64748b;
      font-style: italic;
      margin-left: 6px;
    }

    /* 10-Grid Writing Section */
    .writing-grid-section {
      padding: 14px 16px;
      background: #ffffff;
      overflow-x: auto;
    }

    .grid-label-row {
      display: grid;
      grid-template-columns: 50px 50px 104px 1fr;
      gap: 6px;
      font-size: 0.74rem;
      font-weight: 800;
      color: #64748b;
      margin-bottom: 6px;
      text-align: center;
    }

    .grid-boxes-10 {
      display: flex;
      gap: 6px;
      justify-content: flex-start;
      flex-wrap: nowrap;
    }

    /* Tianzige 10 Boxes */
    .tianzige-box {
      width: 48px;
      height: 48px;
      border: 1.5px solid var(--grid-border);
      border-radius: 8px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      flex-shrink: 0;
      box-shadow: inset 1px 1px 2px rgba(0,0,0,0.03);
    }

    /* Cross guidelines (Tian-zi-ge) */
    .tianzige-box::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 1px;
      border-top: 1px dashed var(--grid-cross);
      pointer-events: none;
    }
    .tianzige-box::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      width: 1px;
      height: 100%;
      border-left: 1px dashed var(--grid-cross);
      pointer-events: none;
    }

    /* Box 1: Numbered Stroke Order Guidance */
    .tianzige-box.guidance-box {
      border: 2px solid #dc2626;
      background-color: #fff9f9;
      overflow: hidden;
      padding: 2px;
    }
    .tianzige-box.guidance-box::before,
    .tianzige-box.guidance-box::after {
      display: none; /* Cross is inside SVG */
    }

    .guidance-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Box 2: Model Character */
    .tianzige-box.model-box {
      border: 2px solid #2563eb;
      background-color: #f8faff;
    }
    .tianzige-box.model-box span {
      font-family: 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho', sans-serif;
      font-size: 30px;
      font-weight: 900;
      color: #0f172a;
      z-index: 1;
    }

    /* Box 3 & 4: Trace (Grey character for tracing) */
    .tianzige-box.trace-box {
      border-color: #94a3b8;
    }
    .tianzige-box.trace-box span {
      font-family: 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho', sans-serif;
      font-size: 30px;
      font-weight: 600;
      color: var(--trace-char);
      z-index: 1;
      user-select: none;
    }

    /* Box 5 to 10: Blank practice */
    .tianzige-box.practice-box {
      border-color: #94a3b8;
    }

    /* Exercises Section (10 Reading + 10 Writing) */
    .exercise-box {
      background: #fbfcfe;
      border: 1.8px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      margin-top: 24px;
      box-shadow: var(--clay-shadow-box);
      page-break-inside: avoid;
    }

    .exercise-title {
      font-size: 0.96rem;
      font-weight: 800;
      color: #1e3a8a;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .exercise-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .exercise-item {
      font-size: 0.88rem;
      background: white;
      padding: 9px 12px;
      border-radius: 10px;
      border: 1.5px solid #edf2f7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 2px 2px 6px rgba(0,0,0,0.02);
    }

    .exercise-q {
      font-family: 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho', sans-serif;
      font-weight: 600;
      color: #1e293b;
    }

    .answer-space {
      display: inline-block;
      min-width: 60px;
      border-bottom: 1.5px dotted #94a3b8;
      text-align: center;
      color: transparent;
      padding: 0 4px;
    }

    .answer-key {
      font-size: 0.78rem;
      color: #059669;
      font-weight: 700;
      background: #ecfdf5;
      padding: 2px 7px;
      border-radius: 6px;
      border: 1px solid #a7f3d0;
      white-space: nowrap;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    /* Print Styles (A4 Optimized) */
    @media print {
      body {
        background: white !important;
        color: black !important;
      }

      .no-print {
        display: none !important;
      }

      .container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .worksheet-page {
        box-shadow: none !important;
        border: none !important;
        border-radius: 0 !important;
        padding: 6mm 8mm !important;
        margin-bottom: 0 !important;
      }

      .kanji-card {
        border: 1px solid #475569 !important;
        box-shadow: none !important;
        page-break-inside: avoid !important;
        margin-bottom: 14px !important;
        border-radius: 10px !important;
      }

      .kanji-hero {
        border: 1.5px solid black !important;
        box-shadow: none !important;
      }

      .tianzige-box {
        border: 1px solid #475569 !important;
        width: 38px !important;
        height: 38px !important;
        box-shadow: none !important;
      }

      .tianzige-box.guidance-box {
        border: 1.5px solid #dc2626 !important;
      }

      .tianzige-box.model-box {
        border: 1.5px solid black !important;
      }

      .tianzige-box.model-box span {
        font-size: 24px !important;
      }

      .tianzige-box.trace-box span {
        font-size: 24px !important;
        color: #94a3b8 !important;
      }

      .exercise-grid {
        grid-template-columns: 1fr 1fr !important;
      }

      .exercise-item {
        border: 1px solid #cbd5e1 !important;
        box-shadow: none !important;
      }

      .answer-key {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <!-- Toolbar / Navigasi Layar -->
  <div class="toolbar no-print">
    <div class="toolbar-title">
      <h1>🎌 Lembar Latihan Kanji IRODORI A2.2 (JFT-Basic A2)</h1>
      <span class="badge-clay">Claymorphism Pastel Calm • 10-Grid</span>
    </div>

    <div class="toolbar-actions">
      <label for="babSelector" style="font-size: 0.86rem; font-weight: 700;">Pilih Bab:</label>
      <select id="babSelector" class="select-bab" onchange="filterBab(this.value)">
        <option value="all">Tampilkan Semua (Bab 1 - 18)</option>
        ${kanjiData.map(d => `<option value="${d.bab}" ${selectedBab === d.bab ? 'selected' : ''}>Bab ${d.bab}: ${d.titleJp.split(' ')[1] || d.titleId}</option>`).join('')}
      </select>

      <button class="btn-clay btn-primary-clay" onclick="window.print()">
        🖨️ Cetak / Simpan PDF (A4)
      </button>

      <button class="btn-clay btn-outline-clay" id="toggleAnswerBtn" onclick="toggleAnswers()">
        👁️ Kunci Jawaban: Sembunyikan
      </button>
    </div>
  </div>

  <div class="container">
    ${filteredData.map(ch => `
      <!-- Bab ${ch.bab} Worksheet -->
      <div class="worksheet-page" id="bab-${ch.bab}">
        
        <!-- Header Bab -->
        <div class="sheet-header">
          <div class="curriculum-tag">IRODORI: Nihongo de Kurashito Kotoba • 初級2 (A2.2 / JFT-Basic)</div>
          <h2 class="sheet-title">${ch.titleJp}</h2>
          <div class="sheet-subtitle">${ch.titleId} — Topik: ${ch.topic}</div>

          <!-- Identitas Siswa -->
          <div class="student-info-grid">
            <div class="info-field">
              <span class="label">Nama:</span>
              <span class="line"></span>
            </div>
            <div class="info-field">
              <span class="label">Tanggal:</span>
              <span class="line"></span>
            </div>
            <div class="info-field">
              <span class="label">Kelas:</span>
              <span class="line"></span>
            </div>
            <div class="info-field">
              <span class="label">Nilai:</span>
              <span class="score-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 100</span>
            </div>
          </div>
        </div>

        <!-- Judul Bagian Target Kanji -->
        <div class="section-title">
          <span>✍️ Target Kanji, Cara Baca, & 10 Kotak Grid Latihan Menulis (十字リーダー格)</span>
        </div>

        <!-- Daftar Kanji Cards -->
        ${ch.kanjiList.map((k) => `
          <div class="kanji-card">
            <!-- Header Kartu Kanji -->
            <div class="kanji-header">
              <div class="kanji-hero">
                <span>${k.kanji}</span>
              </div>
              <div class="kanji-meta">
                <div class="kanji-readings">
                  <span class="reading-tag tag-on">音 (Onyomi): ${k.on}</span>
                  <span class="reading-tag tag-kun">訓 (Kunyomi): ${k.kun}</span>
                  <span class="reading-tag tag-stroke">Goresan: ${k.strokes} 画</span>
                  <span class="reading-tag tag-radical">Radikal: ${k.radical}</span>
                </div>
                <div class="kanji-meaning">Arti: ${k.meaning}</div>
                <div class="stroke-rule">Urutan goresan: ${k.strokeRule}</div>
              </div>
            </div>

            <!-- Baris Kosakata Terkait -->
            <div class="kanji-details-row">
              <span class="row-label">Kosakata Bab:</span>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                ${k.words.map(w => `
                  <span class="word-pill">
                    <span class="word-kanji">${w.word}</span> (${w.reading}): ${w.meaning}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Baris Contoh Kalimat Bab -->
            <div class="kanji-details-row">
              <span class="row-label">Contoh Kalimat:</span>
              <div>
                <span class="sentence-jp">${k.sentenceFurigana}</span>
                <span class="sentence-id">${k.sentenceId}</span>
              </div>
            </div>

            <!-- 10 Kotak Grid Latihan Menulis -->
            <div class="writing-grid-section">
              <div class="grid-label-row">
                <span style="color:#dc2626;">[① Urutan]</span>
                <span style="color:#2563eb;">[② Contoh]</span>
                <span style="color:#64748b;">[③-④ Tebalkan]</span>
                <span style="text-align: right; color:#475569;">[⑤ s.d. ⑩ Latihan Mandiri 6x]</span>
              </div>
              <div class="grid-boxes-10">
                <!-- Kotak 1: Peragaan Urutan Nomor (Guidance Box) -->
                <div class="tianzige-box guidance-box" title="Urutan goresan dengan nomor petunjuk">
                  ${getGuidanceSvg(k.kanji)}
                </div>

                <!-- Kotak 2: Huruf Contoh Tebal (Model Box) -->
                <div class="tianzige-box model-box" title="Huruf contoh">
                  <span>${k.kanji}</span>
                </div>

                <!-- Kotak 3: Jiplak / Trace 1 -->
                <div class="tianzige-box trace-box" title="Tebalkan 1">
                  <span>${k.kanji}</span>
                </div>

                <!-- Kotak 4: Jiplak / Trace 2 -->
                <div class="tianzige-box trace-box" title="Tebalkan 2">
                  <span>${k.kanji}</span>
                </div>

                <!-- Kotak 5 s.d. 10: Latihan Mandiri (6 Kotak Kosong Bergaris Bantu) -->
                <div class="tianzige-box practice-box"></div>
                <div class="tianzige-box practice-box"></div>
                <div class="tianzige-box practice-box"></div>
                <div class="tianzige-box practice-box"></div>
                <div class="tianzige-box practice-box"></div>
                <div class="tianzige-box practice-box"></div>
              </div>
            </div>
          </div>
        `).join('')}

        <!-- Bagian Latihan Evaluasi (10 Soal Membaca + 10 Soal Menulis) -->
        <div class="section-title" style="margin-top: 28px;">
          <span>📝 Latihan Evaluasi Pemahaman Kanji (Bab ${ch.bab} - 20 Soal)</span>
        </div>

        <div class="exercise-box">
          <!-- A. 10 Soal Membaca -->
          <div class="exercise-title">
            <span>📖 A. Latihan Membaca (10 Soal): Tuliskan cara baca (Hiragana) dari Kanji dalam tanda [ ]!</span>
          </div>
          <div class="exercise-grid">
            ${ch.readingExercise.map(ex => `
              <div class="exercise-item">
                <span class="exercise-q">${ex.q}</span>
                <span class="answer-space">________</span>
                <span class="answer-key">${ex.a}</span>
              </div>
            `).join('')}
          </div>

          <!-- B. 10 Soal Menulis -->
          <div class="exercise-title" style="margin-top: 20px;">
            <span>✏️ B. Latihan Menulis (10 Soal): Tuliskan huruf Kanji dari kata yang bergaris bawah!</span>
          </div>
          <div class="exercise-grid">
            ${ch.writingExercise.map(ex => `
              <div class="exercise-item">
                <span class="exercise-q">${ex.q}</span>
                <span class="answer-key">${ex.a}</span>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
      <div class="page-break"></div>
    `).join('')}
  </div>

  <script>
    function filterBab(val) {
      if (val === 'all') {
        document.querySelectorAll('.worksheet-page').forEach(el => el.style.display = 'block');
      } else {
        document.querySelectorAll('.worksheet-page').forEach(el => el.style.display = 'none');
        const target = document.getElementById('bab-' + val);
        if (target) target.style.display = 'block';
      }
    }

    let showAnswers = true;
    function toggleAnswers() {
      showAnswers = !showAnswers;
      const keys = document.querySelectorAll('.answer-key');
      keys.forEach(k => k.style.display = showAnswers ? 'inline-block' : 'none');
      document.getElementById('toggleAnswerBtn').innerText = showAnswers ? '👁️ Kunci Jawaban: Sembunyikan' : '👁️ Kunci Jawaban: Tampilkan';
    }
  </script>
</body>
</html>`;
}

// 1. Generate Master HTML
const masterHtmlPath = path.join(outputDir, 'Lembar_Latihan_Kanji_IRODORI_A2.2.html');
fs.writeFileSync(masterHtmlPath, generateHtmlContentV2(null), 'utf-8');
console.log('Saved master HTML V2:', masterHtmlPath);

// 2. Generate Individual Bab HTML (Bab 1 to 18)
for (let b = 1; b <= 18; b++) {
  const babHtmlPath = path.join(outputDir, `Lembar_Latihan_Kanji_Bab_${b}.html`);
  fs.writeFileSync(babHtmlPath, generateHtmlContentV2(b), 'utf-8');
}
console.log('Saved 18 individual Bab HTML V2 files successfully!');
