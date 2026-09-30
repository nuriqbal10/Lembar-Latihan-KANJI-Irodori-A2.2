const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const svgDir = path.join(rootDir, 'assets', 'kanjivg');
const dataFile = path.join(rootDir, 'kanji_irodori_a2_2_data.json');
const kanjiData = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

// Helper to format KanjiVG SVG
function getGuidanceSvg(kanjiChar) {
  if (!kanjiChar) return '';
  const codePoint = kanjiChar.codePointAt(0).toString(16).padStart(5, '0');
  const svgPath = path.join(svgDir, codePoint + '.svg');
  if (!fs.existsSync(svgPath)) {
    return `<div style="font-size:24px;font-weight:bold;color:#334155;">${kanjiChar}</div>`;
  }
  let rawSvg = fs.readFileSync(svgPath, 'utf-8');

  // Strip xml header & doctype
  rawSvg = rawSvg.replace(/<\?xml[\s\S]*?<svg/i, '<svg');
  rawSvg = rawSvg.replace(/<!DOCTYPE[\s\S]*?>/i, '');

  // Add cross guidelines
  const crossLines = `
    <!-- Tianzige Cross Guidelines -->
    <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
    <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
  `;
  rawSvg = rawSvg.replace(/(<svg[^>]*>)/i, `$1${crossLines}`);

  // Enhance stroke path styling
  rawSvg = rawSvg.replace(/stroke:#000000;stroke-width:3;/g, 'stroke:#334155;stroke-width:3.8;stroke-linecap:round;stroke-linejoin:round;');

  // Enhance stroke numbers
  rawSvg = rawSvg.replace(/fill:#808080/g, 'fill:#e11d48;font-weight:bold;');
  rawSvg = rawSvg.replace(/font-size:8/g, 'font-size:10');

  rawSvg = rawSvg.replace('<svg ', '<svg class="guidance-svg" ');
  return rawSvg;
}

function buildIndexApp() {
  console.log("Building complete Web Application index.html for GitHub Pages...");

  // Generate full HTML
  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IRODORI Kanji Studio A2.2 (Bab 1 - 18) | Lembar Latihan & Kuis Interaktif</title>
  <meta name="description" content="Aplikasi Web Lembar Latihan Kanji Interaktif & Siap Cetak IRODORI A2.2 (Bab 1 s.d. 18) dengan Claymorphism Pastel Calm, 10-Grid Tianzige & Nomor Urutan Goresan">
  
  <style>
    /* Font UD Digi Kyokasho priority, with Google Font fallbacks */
    @font-face {
      font-family: 'UD Digi Kyokasho Fallback';
      src: local('UD デジタル 教科書体 NP-R'), local('UD Digi Kyokasho NP-R'), local('UD デジタル 教科書体'), local('UD Digi Kyokasho');
    }

    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=BIZ+UDPGothic:wght@400;700&family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');

    :root {
      /* Calm Pastel Claymorphism Palette */
      --bg-base: #f0f4f8;
      --clay-card-bg: #ffffff;
      --clay-surface: #fdfbf7;
      
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

      --clay-shadow-out: 8px 8px 20px rgba(185, 195, 210, 0.45), -6px -6px 16px #ffffff;
      --clay-shadow-pill: 4px 4px 10px rgba(185, 195, 210, 0.35), -3px -3px 8px #ffffff;
      --clay-shadow-in: inset 2px 2px 5px rgba(185, 195, 210, 0.4), inset -2px -2px 5px #ffffff;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', 'UD Digi Kyokasho Fallback', 'Zen Maru Gothic', 'BIZ UDPGothic', 'Noto Sans JP', sans-serif;
      background-color: var(--bg-base);
      color: var(--text-main);
      line-height: 1.5;
      padding-bottom: 60px;
    }

    /* Top App Bar & Navigation */
    .app-header {
      background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(226, 232, 240, 0.8);
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 4px 20px rgba(148, 163, 184, 0.12);
    }

    .header-container {
      max-width: 1240px;
      margin: 0 auto;
      padding: 12px 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      background: linear-gradient(135deg, #e0e7ff 0%, #fde8ef 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      box-shadow: var(--clay-shadow-pill);
    }

    .brand-title {
      font-size: 1.18rem;
      font-weight: 800;
      color: #1e293b;
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.76rem;
      font-weight: 600;
      color: #64748b;
    }

    /* Tab Pills */
    .nav-tabs {
      display: flex;
      gap: 8px;
      background: #f1f5f9;
      padding: 5px;
      border-radius: 30px;
      box-shadow: var(--clay-shadow-in);
    }

    .tab-btn {
      border: none;
      background: transparent;
      padding: 8px 16px;
      border-radius: 20px;
      font-family: inherit;
      font-size: 0.84rem;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .tab-btn:hover {
      color: #1e293b;
    }

    .tab-btn.active {
      background: #ffffff;
      color: #2563eb;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.15), var(--clay-shadow-pill);
    }

    /* Header Controls */
    .header-controls {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .select-bab {
      padding: 8px 14px;
      border-radius: 20px;
      border: 1px solid #cbd5e1;
      background-color: #ffffff;
      font-family: inherit;
      font-size: 0.84rem;
      font-weight: 700;
      color: #334155;
      box-shadow: var(--clay-shadow-pill);
      outline: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .select-bab:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }

    .btn-action {
      padding: 8px 16px;
      border-radius: 20px;
      border: none;
      font-family: inherit;
      font-size: 0.84rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-print {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .btn-print:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
    }

    .btn-gh {
      background: #ffffff;
      color: #334155;
      border: 1px solid #cbd5e1;
      box-shadow: var(--clay-shadow-pill);
      text-decoration: none;
    }

    .btn-gh:hover {
      background: #f8fafc;
      color: #0f172a;
    }

    /* Container */
    .app-main {
      max-width: 1200px;
      margin: 24px auto;
      padding: 0 16px;
    }

    .tab-content {
      display: none;
      animation: fadeIn 0.3s ease;
    }

    .tab-content.active {
      display: block;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Hero Banner */
    .hero-banner {
      background: linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%);
      border-radius: 24px;
      padding: 24px 30px;
      margin-bottom: 24px;
      box-shadow: var(--clay-shadow-out);
      border: 1px solid #ffffff;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .hero-text h2 {
      font-size: 1.45rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 6px;
    }

    .hero-text p {
      font-size: 0.9rem;
      color: #64748b;
      max-width: 680px;
    }

    .hero-stats {
      display: flex;
      gap: 14px;
    }

    .stat-pill {
      background: var(--pastel-blue-bg);
      border: 1px solid var(--pastel-blue-border);
      color: var(--pastel-blue-txt);
      padding: 10px 18px;
      border-radius: 18px;
      text-align: center;
      box-shadow: var(--clay-shadow-pill);
    }

    .stat-num {
      font-size: 1.35rem;
      font-weight: 800;
      display: block;
    }

    .stat-lbl {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* WORKSHEET STYLES */
    .worksheet-page {
      background: var(--clay-card-bg);
      border-radius: 24px;
      padding: 32px 36px;
      margin-bottom: 40px;
      box-shadow: var(--clay-shadow-out);
      border: 1px solid #ffffff;
      page-break-after: always;
    }

    .sheet-header {
      border-bottom: 2px dashed #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 24px;
      position: relative;
    }

    .curriculum-tag {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--pastel-blue-txt);
      background-color: var(--pastel-blue-bg);
      border: 1px solid var(--pastel-blue-border);
      padding: 4px 12px;
      border-radius: 12px;
      margin-bottom: 8px;
      box-shadow: var(--clay-shadow-pill);
    }

    .sheet-title {
      font-size: 1.55rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .sheet-subtitle {
      font-size: 0.95rem;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 16px;
    }

    .student-info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background-color: var(--clay-surface);
      border-radius: 16px;
      padding: 10px 16px;
      border: 1px solid #f1f5f9;
      box-shadow: var(--clay-shadow-in);
    }

    .info-field {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #64748b;
    }

    .info-field .line {
      flex: 1;
      border-bottom: 1.5px dotted #94a3b8;
      height: 14px;
    }

    .score-box {
      font-weight: 800;
      color: #0f172a;
      background: #ffffff;
      padding: 2px 10px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
    }

    /* Kanji Row */
    .kanji-unit {
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #edf2f7;
      padding: 18px 20px;
      margin-bottom: 20px;
      box-shadow: 4px 4px 12px rgba(203, 213, 225, 0.3), -3px -3px 8px #ffffff;
    }

    .kanji-header {
      display: flex;
      align-items: center;
      gap: 18px;
      margin-bottom: 12px;
    }

    .kanji-hero {
      width: 68px;
      height: 68px;
      border-radius: 16px;
      background: #ffffff;
      border: 2px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 800;
      color: #1e293b;
      box-shadow: var(--clay-shadow-pill);
      position: relative;
    }

    .kanji-hero::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      border-top: 1px dashed #e2e8f0;
      pointer-events: none;
    }

    .kanji-hero::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      border-left: 1px dashed #e2e8f0;
      pointer-events: none;
    }

    .kanji-meta {
      flex: 1;
    }

    .kanji-readings {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 6px;
    }

    .reading-tag {
      font-size: 0.78rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 10px;
      box-shadow: var(--clay-shadow-pill);
    }

    .tag-on { background: var(--pastel-rose-bg); color: var(--pastel-rose-txt); border: 1px solid var(--pastel-rose-border); }
    .tag-kun { background: var(--pastel-blue-bg); color: var(--pastel-blue-txt); border: 1px solid var(--pastel-blue-border); }
    .tag-stroke { background: var(--pastel-amber-bg); color: var(--pastel-amber-txt); border: 1px solid var(--pastel-amber-border); }
    .tag-radical { background: var(--pastel-lavender-bg); color: var(--pastel-lavender-txt); border: 1px solid var(--pastel-lavender-border); }

    .kanji-meaning {
      font-size: 1rem;
      font-weight: 800;
      color: #1e293b;
    }

    .stroke-rule {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 2px;
    }

    .kanji-details-row {
      font-size: 0.84rem;
      margin-bottom: 10px;
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px;
    }

    .row-label {
      font-weight: 700;
      color: #475569;
      min-width: 90px;
    }

    .word-pill {
      background: #f8fafc;
      padding: 3px 8px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      font-size: 0.82rem;
    }

    .word-kanji {
      font-weight: 700;
      color: #1e293b;
    }

    .sentence-jp {
      font-weight: 600;
      color: #1e293b;
      display: block;
    }

    .sentence-id {
      font-size: 0.8rem;
      color: #64748b;
      font-style: italic;
      display: block;
    }

    /* 10 Kotak Grid */
    .writing-grid-section {
      margin-top: 12px;
    }

    .grid-label-row {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      font-size: 0.65rem;
      font-weight: 800;
      color: #64748b;
      margin-bottom: 4px;
      text-align: center;
    }

    .grid-boxes-10 {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 6px;
    }

    .tianzige-box {
      aspect-ratio: 1 / 1;
      border: 1.5px solid #94a3b8;
      border-radius: 8px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      box-shadow: 2px 2px 4px rgba(203, 213, 225, 0.35);
      user-select: none;
    }

    .tianzige-box::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      border-top: 1px dashed #cbd5e1;
      pointer-events: none;
    }

    .tianzige-box::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      border-left: 1px dashed #cbd5e1;
      pointer-events: none;
    }

    .guidance-box {
      background: #fffdfa;
      border-color: #f43f5e;
      border-width: 2px;
      box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.15), var(--clay-shadow-pill);
    }

    .guidance-box svg {
      width: 90%;
      height: 90%;
      z-index: 2;
    }

    .model-box {
      background: #f8fafc;
      border-color: #2563eb;
      border-width: 2px;
    }

    .model-box span {
      font-size: 2.1rem;
      font-weight: 800;
      color: #0f172a;
      z-index: 2;
    }

    .trace-box span {
      font-size: 2.1rem;
      font-weight: 700;
      color: #cbd5e1;
      z-index: 2;
    }

    /* EXERCISES SECTION */
    .exercise-box {
      background: #ffffff;
      border-radius: 20px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: var(--clay-shadow-out);
      margin-top: 24px;
    }

    .section-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 12px;
    }

    .exercise-title {
      font-size: 0.92rem;
      font-weight: 700;
      color: #334155;
      margin-bottom: 10px;
    }

    .exercise-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }

    .exercise-item {
      background: #f8fafc;
      border-radius: 12px;
      padding: 10px 14px;
      border: 1px solid #e2e8f0;
      font-size: 0.88rem;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .exercise-q {
      font-size: 0.92rem;
      font-weight: 600;
      color: #1e293b;
    }

    .answer-key {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #9d174d;
      background: var(--pastel-rose-bg);
      border: 1px solid var(--pastel-rose-border);
      padding: 2px 8px;
      border-radius: 8px;
      align-self: flex-start;
      margin-top: 4px;
    }

    /* KANJI EXPLORER / KAMUS */
    .explorer-search-bar {
      margin-bottom: 24px;
      display: flex;
      gap: 12px;
    }

    .search-input {
      flex: 1;
      padding: 12px 20px;
      border-radius: 20px;
      border: 1px solid #cbd5e1;
      font-family: inherit;
      font-size: 0.95rem;
      box-shadow: var(--clay-shadow-pill);
      outline: none;
    }

    .search-input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
    }

    .explorer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .explorer-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 18px;
      border: 1px solid #edf2f7;
      box-shadow: var(--clay-shadow-pill);
      display: flex;
      flex-direction: column;
      gap: 10px;
      transition: transform 0.2s;
    }

    .explorer-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--clay-shadow-out);
    }

    .explorer-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .exp-char {
      font-size: 2.6rem;
      font-weight: 800;
      color: #1e293b;
      cursor: pointer;
    }

    .exp-svg-box {
      width: 70px;
      height: 70px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      background: #fdfbf7;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* DOWNLOAD CENTER */
    .download-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .dl-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 20px;
      border: 1px solid #edf2f7;
      box-shadow: var(--clay-shadow-pill);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
    }

    .dl-card-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: #1e293b;
    }

    .dl-card-sub {
      font-size: 0.82rem;
      color: #64748b;
    }

    .dl-actions {
      display: flex;
      gap: 8px;
    }

    .btn-dl-docx {
      flex: 1;
      padding: 8px 12px;
      border-radius: 12px;
      background: #e8f0fe;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      font-weight: 700;
      font-size: 0.8rem;
      text-align: center;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-dl-docx:hover {
      background: #1d4ed8;
      color: white;
    }

    .btn-dl-html {
      flex: 1;
      padding: 8px 12px;
      border-radius: 12px;
      background: #fdf2f8;
      color: #9d174d;
      border: 1px solid #fbcfe8;
      font-weight: 700;
      font-size: 0.8rem;
      text-align: center;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-dl-html:hover {
      background: #9d174d;
      color: white;
    }

    /* Print Optimization */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }

      .app-header, .hero-banner, .nav-tabs, .header-controls, .no-print {
        display: none !important;
      }

      .app-main {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      #tab-worksheets {
        display: block !important;
      }

      #tab-quiz, #tab-explorer, #tab-downloads {
        display: none !important;
      }

      .worksheet-page {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        margin-bottom: 20mm !important;
        page-break-after: always !important;
      }

      .kanji-unit {
        box-shadow: none !important;
        border: 1px solid #cbd5e1 !important;
        page-break-inside: avoid !important;
      }

      .tianzige-box {
        box-shadow: none !important;
      }

      .exercise-box {
        box-shadow: none !important;
        border: 1px solid #cbd5e1 !important;
        page-break-inside: avoid !important;
      }

      .answer-key {
        display: none !important;
      }
    }

    @media (max-width: 768px) {
      .grid-boxes-10 {
        grid-template-columns: repeat(5, 1fr);
      }
      .grid-label-row {
        grid-template-columns: repeat(5, 1fr);
      }
      .exercise-grid {
        grid-template-columns: 1fr;
      }
      .student-info-grid {
        grid-template-columns: 1fr 1fr;
      }
    }
  </style>
</head>
<body>

  <!-- Top App Bar -->
  <header class="app-header no-print">
    <div class="header-container">
      
      <!-- Brand -->
      <div class="brand-section">
        <div class="brand-logo">⛩️</div>
        <div>
          <h1 class="brand-title">IRODORI Kanji Studio</h1>
          <div class="brand-subtitle">Kurikulum JFT-Basic A2.2 • Bab 1 s.d. 18</div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <nav class="nav-tabs">
        <button class="tab-btn active" onclick="switchTab('worksheets')">
          📑 Lembar Latihan & Cetak
        </button>
        <button class="tab-btn" onclick="switchTab('quiz')">
          ⚡ Kuis Interaktif
        </button>
        <button class="tab-btn" onclick="switchTab('explorer')">
          🔍 Kamus Kanji
        </button>
        <button class="tab-btn" onclick="switchTab('downloads')">
          📥 Unduh Berkas
        </button>
      </nav>

      <!-- Controls -->
      <div class="header-controls">
        <select id="babSelector" class="select-bab" onchange="handleBabChange(this.value)">
          <option value="all">Tampilkan Semua (Bab 1 - 18)</option>
          ${kanjiData.map(d => `<option value="${d.bab}">Bab ${d.bab}: ${d.titleJp.split(' ')[1] || d.titleId}</option>`).join('')}
        </select>

        <button class="btn-action btn-print" onclick="window.print()">
          🖨️ Cetak PDF A4
        </button>

        <button class="btn-action btn-gh" id="toggleAnswerBtn" onclick="toggleGlobalAnswers()">
          👁️ Kunci Jawaban
        </button>
      </div>

    </div>
  </header>

  <!-- Main Application Body -->
  <main class="app-main">

    <!-- Hero Banner -->
    <div class="hero-banner no-print">
      <div class="hero-text">
        <h2>🎌 Studio Latihan & Evaluasi Mandiri Kanji IRODORI</h2>
        <p>
          Memenuhi standar <strong>10 Grid Tian-zi-ge</strong> dengan diagram nomor urutan goresan, model huruf standar buku ajar, 
          kotak jiplak berbayang lembut, serta <strong>20 butir latihan</strong> kontekstual per bab (10 membaca & 10 menulis).
        </p>
      </div>
      <div class="hero-stats">
        <div class="stat-pill">
          <span class="stat-num">18</span>
          <span class="stat-lbl">Bab Lengkap</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">226</span>
          <span class="stat-lbl">Target Kanji</span>
        </div>
        <div class="stat-pill">
          <span class="stat-num">360</span>
          <span class="stat-lbl">Latihan Soal</span>
        </div>
      </div>
    </div>

    <!-- TAB 1: LEMBAR LATIHAN KERJA (WORKSHEETS) -->
    <section id="tab-worksheets" class="tab-content active">
      ${kanjiData.map(ch => `
        <div class="worksheet-page" id="sheet-bab-${ch.bab}">
          
          <!-- Header Bab -->
          <div class="sheet-header">
            <div class="curriculum-tag">IRODORI: Nihongo de Kurashito Kotoba • 初級2 (A2.2 / JFT-Basic)</div>
            <h2 class="sheet-title">${ch.titleJp}</h2>
            <div class="sheet-subtitle">${ch.titleId} — Topik: ${ch.topic}</div>

            <div class="student-info-grid">
              <div class="info-field"><span class="label">Nama:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Tanggal:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Kelas:</span><span class="line"></span></div>
              <div class="info-field"><span class="label">Nilai:</span><span class="score-box">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/ 100</span></div>
            </div>
          </div>

          <!-- Daftar Kanji Unit -->
          <div class="kanji-list-container">
            ${ch.kanjiList.map(k => `
              <div class="kanji-unit">
                
                <div class="kanji-header">
                  <div class="kanji-hero">
                    <span>${k.kanji}</span>
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
                </div>

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

                <div class="kanji-details-row">
                  <span class="row-label">Contoh Kalimat:</span>
                  <div>
                    <span class="sentence-jp">${k.sentenceFurigana}</span>
                    <span class="sentence-id">${k.sentenceId}</span>
                  </div>
                </div>

                <!-- 10 Kotak Grid -->
                <div class="writing-grid-section">
                  <div class="grid-label-row">
                    <span style="color:#dc2626;">[① Urutan]</span>
                    <span style="color:#2563eb;">[② Contoh]</span>
                    <span style="color:#64748b;">[③ Tebal]</span>
                    <span style="color:#64748b;">[④ Tebal]</span>
                    <span style="color:#475569;">[⑤]</span>
                    <span style="color:#475569;">[⑥]</span>
                    <span style="color:#475569;">[⑦]</span>
                    <span style="color:#475569;">[⑧]</span>
                    <span style="color:#475569;">[⑨]</span>
                    <span style="color:#475569;">[⑩]</span>
                  </div>
                  <div class="grid-boxes-10">
                    <!-- Kotak 1: Guidance dengan Nomor Goresan -->
                    <div class="tianzige-box guidance-box" title="Urutan goresan dengan nomor petunjuk">
                      ${getGuidanceSvg(k.kanji)}
                    </div>

                    <!-- Kotak 2: Huruf Contoh Tebal -->
                    <div class="tianzige-box model-box" title="Huruf contoh acuan">
                      <span>${k.kanji}</span>
                    </div>

                    <!-- Kotak 3 & 4: Jiplak / Trace -->
                    <div class="tianzige-box trace-box" title="Tebalkan 1">
                      <span>${k.kanji}</span>
                    </div>
                    <div class="tianzige-box trace-box" title="Tebalkan 2">
                      <span>${k.kanji}</span>
                    </div>

                    <!-- Kotak 5 s.d. 10: Mandiri -->
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
          </div>

          <!-- Latihan Soal Evaluasi -->
          <div class="exercise-box">
            <div class="section-title">
              <span>📝 Latihan Evaluasi Pemahaman Kanji (Bab ${ch.bab} - 20 Soal)</span>
            </div>

            <div class="exercise-title">
              <span>📖 A. Latihan Membaca (10 Soal): Tuliskan cara baca (Hiragana) dari Kanji dalam tanda [ ]!</span>
            </div>
            <div class="exercise-grid">
              ${ch.readingExercise.map(ex => `
                <div class="exercise-item">
                  <span class="exercise-q">${ex.q}</span>
                  <span class="answer-key">${ex.a}</span>
                </div>
              `).join('')}
            </div>

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
      `).join('')}
    </section>

    <!-- TAB 2: KUIS INTERAKTIF -->
    <section id="tab-quiz" class="tab-content">
      <div style="background:#ffffff;border-radius:24px;padding:24px;box-shadow:var(--clay-shadow-out);margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
          <div>
            <h2 style="font-size:1.35rem;font-weight:800;color:#1e293b;">⚡ Mode Kuis Interaktif IRODORI</h2>
            <p style="font-size:0.88rem;color:#64748b;">Ketikkan jawaban Anda pada kotak di bawah lalu klik 'Periksa' untuk cek otomatis!</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="stat-pill" style="padding:8px 16px;">
              <span id="quizScoreText" class="stat-num" style="font-size:1.15rem;color:#2563eb;">0 / 20</span>
              <span class="stat-lbl">Skor Bab</span>
            </div>
            <button class="btn-action" style="background:#f1f5f9;color:#334155;" onclick="resetQuiz()">🔄 Reset Kuis</button>
          </div>
        </div>

        <div id="quizContainer">
          <!-- Dynamically populated per Bab -->
        </div>
      </div>
    </section>

    <!-- TAB 3: KAMUS KANJI & EKSPLORASI -->
    <section id="tab-explorer" class="tab-content">
      <div class="explorer-search-bar">
        <input type="text" id="explorerSearchInput" class="search-input" placeholder="🔍 Cari Kanji berdasarkan huruf, cara baca, bab, atau arti bahasa Indonesia..." oninput="handleKanjiSearch(this.value)">
      </div>

      <div class="explorer-grid" id="explorerGrid">
        <!-- Rendered by JavaScript -->
      </div>
    </section>

    <!-- TAB 4: PUSAT UNDUHAN BERKAS -->
    <section id="tab-downloads" class="tab-content">
      <div style="margin-bottom:24px;">
        <h2 style="font-size:1.35rem;font-weight:800;color:#1e293b;margin-bottom:6px;">📥 Pusat Unduhan Berkas Lengkap</h2>
        <p style="font-size:0.88rem;color:#64748b;">Unduh berkas Microsoft Word (.docx) siap cetak & edit, atau berkas HTML mandiri untuk setiap bab.</p>
      </div>

      <!-- Master Downloads -->
      <div style="background:linear-gradient(135deg, #e0e7ff, #fde8ef);border-radius:24px;padding:24px;margin-bottom:28px;box-shadow:var(--clay-shadow-out);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;">
        <div>
          <span class="curriculum-tag" style="background:#ffffff;">Master Bundle</span>
          <h3 style="font-size:1.25rem;font-weight:800;color:#1e293b;margin:6px 0;">Paket Lengkap Seluruh Bab 1 s.d. 18 (All-in-One)</h3>
          <p style="font-size:0.86rem;color:#475569;">Berisi seluruh 226 Kanji lengkap dengan diagram urutan goresan & 360 latihan soal.</p>
        </div>
        <div style="display:flex;gap:10px;">
          <a href="Lembar%20Latihan%20Kanji/Lembar_Latihan_Kanji_IRODORI_A2.2_Lengkap.docx" class="btn-action btn-print" download>
            📄 Unduh Master DOCX (1.2 MB)
          </a>
          <a href="Lembar%20Latihan%20Kanji/Lembar_Latihan_Kanji_IRODORI_A2.2.html" class="btn-action btn-gh" target="_blank">
            🌐 Buka Master HTML (1.6 MB)
          </a>
        </div>
      </div>

      <div class="download-grid">
        ${kanjiData.map(ch => `
          <div class="dl-card">
            <div>
              <span class="curriculum-tag" style="font-size:0.68rem;">Bab ${ch.bab}</span>
              <div class="dl-card-title">${ch.titleJp}</div>
              <div class="dl-card-sub">${ch.titleId}</div>
              <div style="font-size:0.78rem;color:#94a3b8;margin-top:6px;">
                ${ch.kanjiList.length} Kanji • 20 Soal Latihan
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

  <!-- Client-side Application Logic -->
  <script>
    const kanjiData = ${JSON.stringify(kanjiData)};
    let currentBab = 'all';
    let globalShowAnswers = true;

    // Tab Switching
    function switchTab(tabId) {
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      const targetBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => b.getAttribute('onclick').includes(tabId));
      if (targetBtn) targetBtn.classList.add('active');

      const targetContent = document.getElementById('tab-' + tabId);
      if (targetContent) targetContent.classList.add('active');

      if (tabId === 'quiz') renderQuizView();
      if (tabId === 'explorer') renderExplorerView();
    }

    // Bab Filtering
    function handleBabChange(val) {
      currentBab = val;
      const pages = document.querySelectorAll('.worksheet-page');
      if (val === 'all') {
        pages.forEach(p => p.style.display = 'block');
      } else {
        pages.forEach(p => p.style.display = 'none');
        const target = document.getElementById('sheet-bab-' + val);
        if (target) target.style.display = 'block';
      }

      // If in quiz tab, update quiz content
      if (document.getElementById('tab-quiz').classList.contains('active')) {
        renderQuizView();
      }
    }

    // Toggle Answers in Worksheet
    function toggleGlobalAnswers() {
      globalShowAnswers = !globalShowAnswers;
      const boxes = document.querySelectorAll('.answer-key');
      boxes.forEach(b => b.style.display = globalShowAnswers ? 'inline-block' : 'none');
      document.getElementById('toggleAnswerBtn').innerText = globalShowAnswers ? '👁️ Kunci: Tampil' : '👁️ Kunci: Sembunyi';
    }

    // QUIZ MODE LOGIC
    function renderQuizView() {
      const container = document.getElementById('quizContainer');
      const targetBab = currentBab === 'all' ? 1 : parseInt(currentBab);
      const ch = kanjiData.find(d => d.bab === targetBab) || kanjiData[0];

      container.innerHTML = \`
        <div style="margin-bottom:16px;">
          <h3 style="font-size:1.15rem;font-weight:800;color:#1e293b;">\${ch.titleJp} — \${ch.titleId}</h3>
          <div style="font-size:0.85rem;color:#64748b;">Menampilkan kuis Bab \${ch.bab}. Gunakan pemilih bab di kanan atas untuk mengganti bab.</div>
        </div>

        <h4 style="font-size:0.95rem;font-weight:700;color:#334155;margin:16px 0 10px;">A. Kuis Membaca (Hiragana):</h4>
        <div class="exercise-grid">
          \${ch.readingExercise.map((ex, idx) => \`
            <div class="exercise-card" id="quiz-r-\${idx}">
              <div class="exercise-q">\${idx + 1}. \${ex.q}</div>
              <div style="display:flex;gap:8px;margin-top:6px;">
                <input type="text" class="search-input" style="padding:6px 12px;font-size:0.88rem;" id="input-r-\${idx}" placeholder="Ketik hiragana..." onkeydown="if(event.key==='Enter') checkQuizItem('r', \${idx}, '\${ex.a}')">
                <button class="btn-action btn-print" style="padding:6px 14px;font-size:0.8rem;" onclick="checkQuizItem('r', \${idx}, '\${ex.a}')">Cek</button>
              </div>
              <div>
                <span class="ex-result" id="res-r-\${idx}" style="font-size:0.8rem;font-weight:700;margin-top:4px;display:none;"></span>
              </div>
            </div>
          \`).join('')}
        </div>

        <h4 style="font-size:0.95rem;font-weight:700;color:#334155;margin:24px 0 10px;">B. Kuis Menulis (Kanji):</h4>
        <div class="exercise-grid">
          \${ch.writingExercise.map((ex, idx) => \`
            <div class="exercise-card" id="quiz-w-\${idx}">
              <div class="exercise-q">\${idx + 1}. \${ex.q}</div>
              <div style="display:flex;gap:8px;margin-top:6px;">
                <input type="text" class="search-input" style="padding:6px 12px;font-size:0.88rem;" id="input-w-\${idx}" placeholder="Ketik kanji..." onkeydown="if(event.key==='Enter') checkQuizItem('w', \${idx}, '\${ex.a}')">
                <button class="btn-action btn-print" style="padding:6px 14px;font-size:0.8rem;" onclick="checkQuizItem('w', \${idx}, '\${ex.a}')">Cek</button>
              </div>
              <div>
                <span class="ex-result" id="res-w-\${idx}" style="font-size:0.8rem;font-weight:700;margin-top:4px;display:none;"></span>
              </div>
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
        res.style.color = '#dc2626';
        res.innerText = '⚠️ Silakan ketik jawaban terlebih dahulu';
        return;
      }

      res.style.display = 'inline-block';
      if (userVal === correctVal || userVal.toLowerCase() === correctVal.toLowerCase()) {
        res.style.color = '#16a34a';
        res.innerText = '✨ Benar! Tepat sekali.';
        input.style.borderColor = '#16a34a';
      } else {
        res.style.color = '#dc2626';
        res.innerText = \`❌ Jawaban tepat: \${correctVal}\`;
        input.style.borderColor = '#dc2626';
      }
      updateQuizScore();
    }

    function updateQuizScore() {
      const allResults = document.querySelectorAll('.ex-result');
      let correct = 0;
      allResults.forEach(r => {
        if (r.innerText.includes('Benar')) correct++;
      });
      const total = 20;
      const textEl = document.getElementById('quizScoreText');
      if (textEl) textEl.innerText = \`\${correct} / \${total}\`;
    }

    function resetQuiz() {
      document.querySelectorAll('#quizContainer input').forEach(i => {
        i.value = '';
        i.style.borderColor = '#cbd5e1';
      });
      document.querySelectorAll('#quizContainer .ex-result').forEach(r => {
        r.style.display = 'none';
        r.innerText = '';
      });
      updateQuizScore();
    }

    // EXPLORER VIEW LOGIC
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
              <span class="curriculum-tag" style="font-size:0.66rem;">Bab \${k.bab}</span>
              <div class="exp-char" title="Klik untuk salin" onclick="navigator.clipboard.writeText('\${k.kanji}'); alert('Kanji \${k.kanji} disalin ke clipboard!');">\${k.kanji}</div>
            </div>
            <div class="exp-svg-box">
              <span style="font-size:1.8rem;font-weight:800;color:#0f172a;">\${k.kanji}</span>
            </div>
          </div>
          <div>
            <div style="font-size:0.95rem;font-weight:700;color:#1e293b;">\${k.meaning}</div>
            <div style="font-size:0.8rem;color:#64748b;margin-top:2px;">
              音: <strong>\${k.on}</strong> | 訓: <strong>\${k.kun}</strong>
            </div>
            <div style="font-size:0.75rem;color:#94a3b8;margin-top:2px;">
              \${k.strokes} Goresan • Radikal: \${k.radical}
            </div>
          </div>
          <div style="font-size:0.8rem;background:#f8fafc;padding:6px 10px;border-radius:10px;color:#334155;">
            📚 <strong>\${k.words[0] ? k.words[0].word : k.kanji}</strong> (\${k.words[0] ? k.words[0].reading : ''}): \${k.words[0] ? k.words[0].meaning : ''}
          </div>
        </div>
      \`).join('');
    }

    function handleKanjiSearch(val) {
      renderExplorerView(val);
    }
  </script>
</body>
</html>`;

  const indexPath = path.join(rootDir, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`Successfully generated index.html (${(html.length / 1024).toFixed(1)} KB)!`);
}

buildIndexApp();
