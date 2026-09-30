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
  console.log("Building Enhanced Web Application index.html with Auth, Dark Mode, Animations & Progress Dashboard...");

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IRODORI Kanji Studio A2.2 (Bab 1 - 18) | Latihan, Kuis & Manajemen Belajar</title>
  <meta name="description" content="Aplikasi Web Lembar Latihan Kanji IRODORI A2.2 dengan Sistem Login, Pembatasan Akses, Animasi Goresan, Dashboard Progres Belajar, dan Mode Gelap Pastel">
  
  <style>
    @font-face {
      font-family: 'UD Digi Kyokasho Fallback';
      src: local('UD デジタル 教科書体 NP-R'), local('UD Digi Kyokasho NP-R'), local('UD デジタル 教科書体'), local('UD Digi Kyokasho');
    }

    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=BIZ+UDPGothic:wght@400;700&family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');

    :root {
      /* Light Mode Pastel Claymorphism */
      --bg-base: #f0f4f8;
      --clay-card-bg: #ffffff;
      --clay-surface: #fdfbf7;
      --card-border: #edf2f7;
      
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
      --text-sub: #64748b;
      --text-light: #94a3b8;

      --grid-border: #94a3b8;
      --grid-cross: #cbd5e1;
      --trace-char: #cbd5e1;

      --clay-shadow-out: 6px 6px 16px rgba(185, 195, 210, 0.4), -4px -4px 12px #ffffff;
      --clay-shadow-pill: 3px 3px 8px rgba(185, 195, 210, 0.3), -2px -2px 6px #ffffff;
      --clay-shadow-in: inset 2px 2px 5px rgba(185, 195, 210, 0.35), inset -2px -2px 5px #ffffff;
    }

    body.dark-mode {
      /* Deep Slate Pastel Dark Mode */
      --bg-base: #0f172a;
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
      --trace-char: #475569;

      --clay-shadow-out: 6px 6px 18px rgba(0, 0, 0, 0.5), -3px -3px 10px rgba(255, 255, 255, 0.03);
      --clay-shadow-pill: 3px 3px 8px rgba(0, 0, 0, 0.4), -2px -2px 5px rgba(255, 255, 255, 0.02);
      --clay-shadow-in: inset 2px 2px 5px rgba(0, 0, 0, 0.5), inset -2px -2px 5px rgba(255, 255, 255, 0.02);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', 'UD Digi Kyokasho Fallback', 'Zen Maru Gothic', 'BIZ UDPGothic', 'Noto Sans JP', sans-serif;
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
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
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

    .brand-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: linear-gradient(135deg, #e0e7ff 0%, #fde8ef 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      box-shadow: var(--clay-shadow-pill);
    }

    .brand-title {
      font-size: 1.12rem;
      font-weight: 800;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }

    .brand-subtitle {
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--text-sub);
    }

    /* Tab Pills */
    .nav-tabs {
      display: flex;
      gap: 6px;
      background: var(--clay-surface);
      padding: 4px;
      border-radius: 30px;
      box-shadow: var(--clay-shadow-in);
    }

    .tab-btn {
      border: none;
      background: transparent;
      padding: 7px 14px;
      border-radius: 20px;
      font-family: inherit;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-sub);
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .tab-btn:hover { color: var(--text-main); }

    .tab-btn.active {
      background: var(--clay-card-bg);
      color: #2563eb;
      box-shadow: var(--clay-shadow-pill);
    }

    /* User & Controls */
    .header-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .select-bab {
      padding: 7px 12px;
      border-radius: 16px;
      border: 1px solid var(--card-border);
      background-color: var(--clay-card-bg);
      font-family: inherit;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-main);
      box-shadow: var(--clay-shadow-pill);
      outline: none;
      cursor: pointer;
    }

    .btn-action {
      padding: 7px 14px;
      border-radius: 16px;
      border: none;
      font-family: inherit;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .btn-print {
      background: linear-gradient(135deg, #2563eb, #1d4ed8);
      color: white;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    }

    .btn-theme {
      background: var(--clay-card-bg);
      color: var(--text-main);
      border: 1px solid var(--card-border);
      box-shadow: var(--clay-shadow-pill);
      padding: 7px 10px;
    }

    .btn-auth {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 3px 10px rgba(16, 185, 129, 0.3);
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px 4px 6px;
      border-radius: 20px;
      background: var(--pastel-blue-bg);
      border: 1px solid var(--pastel-blue-border);
      color: var(--pastel-blue-txt);
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
    }

    .user-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #2563eb;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
    }

    /* Container */
    .app-main {
      max-width: 1200px;
      margin: 20px auto;
      padding: 0 16px;
    }

    .tab-content { display: none; }
    .tab-content.active { display: block; animation: fadeIn 0.25s ease; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Hero Banner */
    .hero-banner {
      background: var(--clay-card-bg);
      border-radius: 20px;
      padding: 18px 24px;
      margin-bottom: 20px;
      box-shadow: var(--clay-shadow-out);
      border: 1px solid var(--card-border);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .hero-text h2 {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 4px;
    }

    .hero-text p {
      font-size: 0.86rem;
      color: var(--text-sub);
      max-width: 650px;
    }

    .hero-stats { display: flex; gap: 10px; }

    .stat-pill {
      background: var(--pastel-blue-bg);
      border: 1px solid var(--pastel-blue-border);
      color: var(--pastel-blue-txt);
      padding: 8px 14px;
      border-radius: 14px;
      text-align: center;
      box-shadow: var(--clay-shadow-pill);
    }

    .stat-num { font-size: 1.15rem; font-weight: 800; display: block; }
    .stat-lbl { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; }

    /* WORKSHEET STYLES */
    .worksheet-page {
      background: var(--clay-card-bg);
      border-radius: 20px;
      padding: 24px 28px;
      margin-bottom: 30px;
      box-shadow: var(--clay-shadow-out);
      border: 1px solid var(--card-border);
      position: relative;
    }

    .sheet-header {
      border-bottom: 2px dashed var(--card-border);
      padding-bottom: 14px;
      margin-bottom: 18px;
    }

    .curriculum-tag {
      display: inline-block;
      font-size: 0.68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--pastel-blue-txt);
      background-color: var(--pastel-blue-bg);
      border: 1px solid var(--pastel-blue-border);
      padding: 3px 10px;
      border-radius: 10px;
      margin-bottom: 6px;
    }

    .sheet-title { font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin-bottom: 2px; }
    .sheet-subtitle { font-size: 0.88rem; font-weight: 600; color: var(--text-sub); margin-bottom: 12px; }

    .student-info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background-color: var(--clay-surface);
      border-radius: 14px;
      padding: 8px 14px;
      border: 1px solid var(--card-border);
    }

    .info-field { display: flex; align-items: center; gap: 6px; font-size: 0.78rem; font-weight: 600; color: var(--text-sub); }
    .info-field .line { flex: 1; border-bottom: 1.5px dotted var(--text-light); height: 12px; }
    .score-box { font-weight: 800; color: var(--text-main); background: var(--clay-card-bg); padding: 2px 8px; border-radius: 6px; border: 1px solid var(--card-border); }

    /* Kanji Row */
    .kanji-unit {
      background: var(--clay-card-bg);
      border-radius: 16px;
      border: 1px solid var(--card-border);
      padding: 14px 16px;
      margin-bottom: 14px;
      box-shadow: var(--clay-shadow-pill);
    }

    .kanji-header { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }

    .kanji-hero {
      width: 58px;
      height: 58px;
      border-radius: 14px;
      background: var(--clay-card-bg);
      border: 1.5px solid var(--card-border);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--text-main);
      box-shadow: var(--clay-shadow-pill);
      position: relative;
    }

    .kanji-hero::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      border-top: 1px dashed var(--grid-cross);
      pointer-events: none;
    }

    .kanji-hero::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      border-left: 1px dashed var(--grid-cross);
      pointer-events: none;
    }

    .kanji-meta { flex: 1; }

    .kanji-readings { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }

    .reading-tag {
      font-size: 0.74rem;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 8px;
    }

    .tag-on { background: var(--pastel-rose-bg); color: var(--pastel-rose-txt); border: 1px solid var(--pastel-rose-border); }
    .tag-kun { background: var(--pastel-blue-bg); color: var(--pastel-blue-txt); border: 1px solid var(--pastel-blue-border); }
    .tag-stroke { background: var(--pastel-amber-bg); color: var(--pastel-amber-txt); border: 1px solid var(--pastel-amber-border); }
    .tag-radical { background: var(--pastel-lavender-bg); color: var(--pastel-lavender-txt); border: 1px solid var(--pastel-lavender-border); }

    .kanji-meaning { font-size: 0.95rem; font-weight: 800; color: var(--text-main); }
    .stroke-rule { font-size: 0.78rem; color: var(--text-sub); }

    .kanji-details-row {
      font-size: 0.8rem;
      margin-bottom: 8px;
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 6px;
    }

    .row-label { font-weight: 700; color: var(--text-sub); min-width: 80px; }

    .word-pill {
      background: var(--clay-surface);
      padding: 2px 8px;
      border-radius: 6px;
      border: 1px solid var(--card-border);
      font-size: 0.78rem;
    }

    .word-kanji { font-weight: 700; color: var(--text-main); }
    .sentence-jp { font-weight: 600; color: var(--text-main); display: block; }
    .sentence-id { font-size: 0.76rem; color: var(--text-sub); font-style: italic; display: block; }

    /* 10 Kotak Grid */
    .writing-grid-section { margin-top: 10px; }

    .grid-label-row {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      font-size: 0.6rem;
      font-weight: 800;
      color: var(--text-sub);
      margin-bottom: 3px;
      text-align: center;
    }

    .grid-boxes-10 {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 5px;
    }

    .tianzige-box {
      aspect-ratio: 1 / 1;
      border: 1.5px solid var(--grid-border);
      border-radius: 8px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--clay-card-bg);
      box-shadow: var(--clay-shadow-pill);
      user-select: none;
    }

    .tianzige-box::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      border-top: 1px dashed var(--grid-cross);
      pointer-events: none;
    }

    .tianzige-box::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
      border-left: 1px dashed var(--grid-cross);
      pointer-events: none;
    }

    .guidance-box {
      background: var(--clay-surface);
      border-color: #f43f5e;
      border-width: 2px;
      cursor: pointer;
    }

    .guidance-box svg { width: 90%; height: 90%; z-index: 2; }

    .model-box {
      border-color: #2563eb;
      border-width: 2px;
    }

    .model-box span { font-size: 1.9rem; font-weight: 800; color: var(--text-main); z-index: 2; }
    .trace-box span { font-size: 1.9rem; font-weight: 700; color: var(--trace-char); z-index: 2; }

    .btn-animate-stroke {
      margin-top: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      color: #e11d48;
      background: var(--pastel-rose-bg);
      border: 1px solid var(--pastel-rose-border);
      padding: 2px 8px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* EXERCISES */
    .exercise-box {
      background: var(--clay-surface);
      border-radius: 16px;
      padding: 18px;
      border: 1px solid var(--card-border);
      margin-top: 20px;
    }

    .section-title { font-size: 1.05rem; font-weight: 800; color: var(--text-main); margin-bottom: 10px; }
    .exercise-title { font-size: 0.88rem; font-weight: 700; color: var(--text-sub); margin-bottom: 8px; }

    .exercise-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }

    .exercise-item {
      background: var(--clay-card-bg);
      border-radius: 10px;
      padding: 8px 12px;
      border: 1px solid var(--card-border);
      font-size: 0.84rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .exercise-q { font-size: 0.88rem; font-weight: 600; color: var(--text-main); }
    .answer-key {
      display: inline-block;
      font-size: 0.76rem;
      font-weight: 700;
      color: var(--pastel-rose-txt);
      background: var(--pastel-rose-bg);
      border: 1px solid var(--pastel-rose-border);
      padding: 2px 6px;
      border-radius: 6px;
      align-self: flex-start;
    }

    /* CONTENT LOCK OVERLAY (Gembok Konten) */
    .locked-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(8px);
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 50;
      padding: 30px;
      text-align: center;
      color: white;
    }

    .lock-icon-circle {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f43f5e, #be123c);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      margin-bottom: 16px;
      box-shadow: 0 10px 25px rgba(244, 63, 94, 0.4);
    }

    /* MODAL (Login / Register & Animation) */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(6px);
      z-index: 2000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-card {
      background: var(--clay-card-bg);
      border: 1px solid var(--card-border);
      border-radius: 24px;
      max-width: 480px;
      width: 100%;
      padding: 28px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
      position: relative;
      animation: modalPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes modalPop {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-close {
      position: absolute;
      top: 16px;
      right: 18px;
      border: none;
      background: transparent;
      font-size: 20px;
      color: var(--text-sub);
      cursor: pointer;
    }

    .input-field {
      width: 100%;
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid var(--card-border);
      background: var(--clay-surface);
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.9rem;
      margin-top: 6px;
      margin-bottom: 14px;
      outline: none;
    }

    .input-field:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.25);
    }

    /* KANJI EXPLORER & KAMUS */
    .explorer-search-bar { margin-bottom: 20px; display: flex; gap: 10px; }
    .search-input {
      flex: 1;
      padding: 10px 16px;
      border-radius: 16px;
      border: 1px solid var(--card-border);
      background: var(--clay-card-bg);
      color: var(--text-main);
      font-family: inherit;
      font-size: 0.9rem;
      outline: none;
      box-shadow: var(--clay-shadow-pill);
    }

    .explorer-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 14px;
    }

    .explorer-card {
      background: var(--clay-card-bg);
      border-radius: 16px;
      padding: 16px;
      border: 1px solid var(--card-border);
      box-shadow: var(--clay-shadow-pill);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .explorer-top { display: flex; align-items: center; justify-content: space-between; }
    .exp-char { font-size: 2.4rem; font-weight: 800; color: var(--text-main); cursor: pointer; }

    /* DOWNLOAD CENTER */
    .download-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 14px;
    }

    .dl-card {
      background: var(--clay-card-bg);
      border-radius: 16px;
      padding: 16px;
      border: 1px solid var(--card-border);
      box-shadow: var(--clay-shadow-pill);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
    }

    .dl-card-title { font-size: 0.98rem; font-weight: 800; color: var(--text-main); }
    .dl-card-sub { font-size: 0.78rem; color: var(--text-sub); }
    .dl-actions { display: flex; gap: 8px; }

    .btn-dl-docx {
      flex: 1;
      padding: 7px 10px;
      border-radius: 10px;
      background: var(--pastel-blue-bg);
      color: var(--pastel-blue-txt);
      border: 1px solid var(--pastel-blue-border);
      font-weight: 700;
      font-size: 0.78rem;
      text-align: center;
      text-decoration: none;
    }

    .btn-dl-html {
      flex: 1;
      padding: 7px 10px;
      border-radius: 10px;
      background: var(--pastel-rose-bg);
      color: var(--pastel-rose-txt);
      border: 1px solid var(--pastel-rose-border);
      font-weight: 700;
      font-size: 0.78rem;
      text-align: center;
      text-decoration: none;
    }

    /* Print Optimization */
    @media print {
      body { background: #ffffff !important; color: #000000 !important; padding: 0 !important; }
      .app-header, .hero-banner, .no-print, .locked-overlay { display: none !important; }
      .app-main { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
      #tab-worksheets { display: block !important; }
      #tab-quiz, #tab-progress, #tab-explorer, #tab-downloads { display: none !important; }
      .worksheet-page { box-shadow: none !important; border: none !important; padding: 0 !important; margin-bottom: 15mm !important; page-break-after: always !important; }
      .kanji-unit { box-shadow: none !important; border: 1px solid #cbd5e1 !important; page-break-inside: avoid !important; }
      .tianzige-box { box-shadow: none !important; }
      .exercise-box { box-shadow: none !important; border: 1px solid #cbd5e1 !important; page-break-inside: avoid !important; }
      .answer-key { display: none !important; }
    }

    @media (max-width: 768px) {
      .grid-boxes-10 { grid-template-columns: repeat(5, 1fr); }
      .grid-label-row { grid-template-columns: repeat(5, 1fr); }
      .exercise-grid { grid-template-columns: 1fr; }
      .student-info-grid { grid-template-columns: 1fr 1fr; }
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
          📑 Lembar Kerja
        </button>
        <button class="tab-btn" onclick="switchTab('quiz')">
          ⚡ Kuis Mandiri
        </button>
        <button class="tab-btn" onclick="switchTab('progress')">
          📊 Progres Belajar
        </button>
        <button class="tab-btn" onclick="switchTab('explorer')">
          🔍 Kamus Kanji
        </button>
        <button class="tab-btn" onclick="switchTab('downloads')">
          📥 Unduh Berkas
        </button>
      </nav>

      <!-- Controls & Auth Profile -->
      <div class="header-controls">
        <select id="babSelector" class="select-bab" onchange="handleBabChange(this.value)">
          <option value="all">Semua Bab (1 - 18)</option>
          ${kanjiData.map(d => `<option value="${d.bab}">Bab ${d.bab}: ${d.titleJp.split(' ')[1] || d.titleId}</option>`).join('')}
        </select>

        <button class="btn-action btn-print" onclick="window.print()">
          🖨️ Cetak
        </button>

        <button class="btn-action btn-theme" onclick="toggleTheme()" id="themeBtn" title="Ganti Mode Gelap / Terang">
          🌙
        </button>

        <!-- User Authentication Button -->
        <div id="authProfileContainer">
          <!-- Populated by JS: either 'Masuk' button or User Pill -->
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
        <h2>🎌 Studio Latihan & Evaluasi Mandiri Kanji IRODORI</h2>
        <p>
          10 Grid Tianzige dengan diagram nomor urutan goresan, animasi langkah demi langkah, 
          kotak jiplak motorik, serta 360 butir soal latihan evaluasi.
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
          <span class="stat-num">360</span>
          <span class="stat-lbl">Soal Latihan</span>
        </div>
      </div>
    </div>

    <!-- TAB 1: LEMBAR LATIHAN KERJA (WORKSHEETS) -->
    <section id="tab-worksheets" class="tab-content active">
      ${kanjiData.map(ch => `
        <div class="worksheet-page" id="sheet-bab-${ch.bab}" data-bab="${ch.bab}">
          
          <!-- Content Lock Overlay for Guest on Bab 3-18 -->
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

          <!-- Header Bab -->
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
                  <div class="no-print">
                    <button class="btn-animate-stroke" onclick="openStrokeAnimation('${k.kanji}', '${k.meaning}', ${k.strokes})">
                      ▶️ Animasi
                    </button>
                  </div>
                </div>

                <div class="kanji-details-row">
                  <span class="row-label">Kosakata Bab:</span>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
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
                    <span style="color:#dc2626;">① Urutan</span>
                    <span style="color:#2563eb;">② Contoh</span>
                    <span style="color:var(--text-sub);">③ Jiplak</span>
                    <span style="color:var(--text-sub);">④ Jiplak</span>
                    <span>⑤</span>
                    <span>⑥</span>
                    <span>⑦</span>
                    <span>⑧</span>
                    <span>⑨</span>
                    <span>⑩</span>
                  </div>
                  <div class="grid-boxes-10">
                    <div class="tianzige-box guidance-box" onclick="openStrokeAnimation('${k.kanji}', '${k.meaning}', ${k.strokes})" title="Klik untuk putar animasi urutan goresan">
                      ${getGuidanceSvg(k.kanji)}
                    </div>
                    <div class="tianzige-box model-box" title="Huruf contoh">
                      <span>${k.kanji}</span>
                    </div>
                    <div class="tianzige-box trace-box" title="Tebalkan 1">
                      <span>${k.kanji}</span>
                    </div>
                    <div class="tianzige-box trace-box" title="Tebalkan 2">
                      <span>${k.kanji}</span>
                    </div>
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

            <div class="exercise-title" style="margin-top: 16px;">
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
      <div style="background:var(--clay-card-bg);border-radius:20px;padding:24px;box-shadow:var(--clay-shadow-out);border:1px solid var(--card-border);margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:18px;">
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

        <div id="quizContainer">
          <!-- Dynamically populated per Bab -->
        </div>
      </div>
    </section>

    <!-- TAB 3: DASHBOARD PROGRES BELAJAR SISWA -->
    <section id="tab-progress" class="tab-content">
      <div style="background:var(--clay-card-bg);border-radius:20px;padding:24px;border:1px solid var(--card-border);box-shadow:var(--clay-shadow-out);margin-bottom:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:20px;">
          <div>
            <h2 style="font-size:1.25rem;font-weight:800;color:var(--text-main);">📊 Dashboard Progres Belajar Siswa</h2>
            <p style="font-size:0.86rem;color:var(--text-sub);">Pantau perkembangan penguasaan Kanji dan riwayat nilai kuis Anda.</p>
          </div>
          <div id="progressUserBadge">
            <!-- Populated by JS -->
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;margin-bottom:24px;">
          <div class="stat-pill" style="padding:14px;">
            <span class="stat-num" id="dashTotalMastered">0 / 226</span>
            <span class="stat-lbl">Kanji Dikuasai</span>
          </div>
          <div class="stat-pill" style="padding:14px;background:var(--pastel-sage-bg);color:var(--pastel-sage-txt);border-color:var(--pastel-sage-border);">
            <span class="stat-num" id="dashCompletedBab">0 / 18</span>
            <span class="stat-lbl">Bab Selesai</span>
          </div>
          <div class="stat-pill" style="padding:14px;background:var(--pastel-amber-bg);color:var(--pastel-amber-txt);border-color:var(--pastel-amber-border);">
            <span class="stat-num" id="dashAvgScore">0%</span>
            <span class="stat-lbl">Rata-rata Nilai</span>
          </div>
        </div>

        <h3 style="font-size:1.05rem;font-weight:800;color:var(--text-main);margin-bottom:12px;">Daftar Capaian per Bab:</h3>
        <div id="progressBabList" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:10px;">
          <!-- Rendered by JS -->
        </div>
      </div>
    </section>

    <!-- TAB 4: KAMUS KANJI & EKSPLORASI -->
    <section id="tab-explorer" class="tab-content">
      <div class="explorer-search-bar">
        <input type="text" id="explorerSearchInput" class="search-input" placeholder="🔍 Cari Kanji berdasarkan huruf, cara baca, bab, atau arti bahasa Indonesia..." oninput="handleKanjiSearch(this.value)">
      </div>

      <div class="explorer-grid" id="explorerGrid">
        <!-- Rendered by JavaScript -->
      </div>
    </section>

    <!-- TAB 5: PUSAT UNDUHAN BERKAS -->
    <section id="tab-downloads" class="tab-content">
      <div style="margin-bottom:20px;">
        <h2 style="font-size:1.25rem;font-weight:800;color:var(--text-main);margin-bottom:4px;">📥 Pusat Unduhan Berkas Lengkap</h2>
        <p style="font-size:0.86rem;color:var(--text-sub);">Unduh berkas Microsoft Word (.docx) siap cetak & edit, atau berkas HTML mandiri.</p>
      </div>

      <!-- Master Downloads -->
      <div style="background:linear-gradient(135deg, #e0e7ff, #fde8ef);border-radius:20px;padding:20px;margin-bottom:20px;box-shadow:var(--clay-shadow-out);display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px;">
        <div>
          <span class="curriculum-tag" style="background:#ffffff;">Master Bundle</span>
          <h3 style="font-size:1.15rem;font-weight:800;color:#1e293b;margin:4px 0;">Paket Lengkap Seluruh Bab 1 s.d. 18 (All-in-One)</h3>
          <p style="font-size:0.84rem;color:#475569;">Berisi seluruh 226 Kanji lengkap dengan diagram nomor urutan goresan & 360 latihan soal.</p>
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

  <!-- AUTH MODAL (Login / Register) -->
  <div class="modal-backdrop" id="authModal">
    <div class="modal-card">
      <button class="modal-close" onclick="closeAuthModal()">✕</button>
      
      <div style="display:flex;gap:8px;margin-bottom:20px;border-bottom:1px solid var(--card-border);padding-bottom:10px;">
        <button id="authTabLogin" class="tab-btn active" onclick="switchAuthMode('login')">🔑 Masuk Akun</button>
        <button id="authTabRegister" class="tab-btn" onclick="switchAuthMode('register')">📝 Daftar Siswa Baru</button>
      </div>

      <!-- Form Login -->
      <div id="loginFormSection">
        <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-main);margin-bottom:4px;">Selamat Datang!</h3>
        <p style="font-size:0.82rem;color:var(--text-sub);margin-bottom:16px;">Masuk untuk membuka seluruh 18 Bab dan menyimpan riwayat belajar.</p>
        
        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Username</label>
        <input type="text" id="loginUsername" class="input-field" placeholder="Ketik username...">

        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Password</label>
        <input type="password" id="loginPassword" class="input-field" placeholder="Ketik password...">

        <button class="btn-action btn-print" style="width:100%;justify-content:center;padding:10px;" onclick="handleLoginSubmit()">
          Masuk Sekarang
        </button>

        <div style="font-size:0.75rem;color:var(--text-sub);margin-top:14px;background:var(--clay-surface);padding:8px 12px;border-radius:10px;">
          💡 Akun Demo: <strong>siswa</strong> / <strong>siswa123</strong> (Siswa) atau <strong>sensei</strong> / <strong>irodori2026</strong> (Guru)
        </div>
      </div>

      <!-- Form Register -->
      <div id="registerFormSection" style="display:none;">
        <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-main);margin-bottom:4px;">Buat Akun Siswa Baru</h3>
        <p style="font-size:0.82rem;color:var(--text-sub);margin-bottom:16px;">Daftar gratis untuk mengakses seluruh kurikulum Bab 1 s.d. 18.</p>

        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Nama Lengkap</label>
        <input type="text" id="regFullName" class="input-field" placeholder="Contoh: Budi Pratama">

        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Username</label>
        <input type="text" id="regUsername" class="input-field" placeholder="Pilih username...">

        <label style="font-size:0.8rem;font-weight:700;color:var(--text-sub);">Password</label>
        <input type="password" id="regPassword" class="input-field" placeholder="Buat password...">

        <button class="btn-action btn-auth" style="width:100%;justify-content:center;padding:10px;" onclick="handleRegisterSubmit()">
          Daftar & Buka Seluruh Bab
        </button>
      </div>

    </div>
  </div>

  <!-- STROKE ANIMATION MODAL -->
  <div class="modal-backdrop" id="strokeModal">
    <div class="modal-card" style="text-align:center;">
      <button class="modal-close" onclick="closeStrokeModal()">✕</button>
      
      <span class="curriculum-tag" id="animStrokeCount">8 Goresan</span>
      <h3 style="font-size:1.3rem;font-weight:800;color:var(--text-main);margin:4px 0 2px;" id="animKanjiTitle">山</h3>
      <div style="font-size:0.86rem;color:var(--text-sub);margin-bottom:16px;" id="animKanjiMeaning">Gunung</div>

      <!-- Canvas Box for Animated SVG -->
      <div id="animSvgContainer" style="width:180px;height:180px;margin:0 auto 16px;background:var(--clay-surface);border-radius:18px;border:2px solid var(--card-border);display:flex;align-items:center;justify-content:center;position:relative;">
        <!-- Injected via JS -->
      </div>

      <div style="font-size:0.82rem;font-weight:700;color:var(--text-sub);margin-bottom:14px;" id="animStepIndicator">
        Langkah Goresan: 1 / 8
      </div>

      <div style="display:flex;justify-content:center;gap:8px;">
        <button class="btn-action" style="background:var(--clay-surface);color:var(--text-main);" onclick="prevAnimStep()">⏮️ Mundur</button>
        <button class="btn-action btn-print" id="animPlayBtn" onclick="toggleAnimPlayback()">▶️ Putar</button>
        <button class="btn-action" style="background:var(--clay-surface);color:var(--text-main);" onclick="nextAnimStep()">Maju ⏭️</button>
      </div>
    </div>
  </div>

  <!-- Client-side Application Logic -->
  <script>
    const kanjiData = ${JSON.stringify(kanjiData)};
    let currentBab = 'all';
    let currentUser = null;
    let animActiveKanji = null;
    let animCurrentStep = 0;
    let animInterval = null;

    // --- AUTHENTICATION & ACCESS RESTRICTION ---
    function initAuth() {
      // Seed initial users if not exist
      if (!localStorage.getItem('irodori_users')) {
        const defaultUsers = [
          { username: 'sensei', password: 'irodori2026', name: 'Sensei (Guru)', role: 'admin', masteredKanji: [], quizScores: {} },
          { username: 'siswa', password: 'siswa123', name: 'Budi Pratama', role: 'student', masteredKanji: [], quizScores: {} }
        ];
        localStorage.setItem('irodori_users', JSON.stringify(defaultUsers));
      }

      // Check active user session
      const savedUser = localStorage.getItem('irodori_active_user');
      if (savedUser) {
        try {
          currentUser = JSON.parse(savedUser);
        } catch (e) {
          currentUser = null;
        }
      }
      updateAuthUI();
      applyContentLocks();
    }

    function updateAuthUI() {
      const container = document.getElementById('authProfileContainer');
      const statusTag = document.getElementById('userStatusTag');
      const studentNameField = document.getElementById('infoStudentName');

      if (currentUser) {
        if (statusTag) {
          statusTag.innerText = 'Status: Terverifikasi (' + currentUser.name + ')';
          statusTag.style.background = 'var(--pastel-sage-bg)';
          statusTag.style.color = 'var(--pastel-sage-txt)';
          statusTag.style.borderColor = 'var(--pastel-sage-border)';
        }
        if (studentNameField) studentNameField.innerText = ' ' + currentUser.name;

        container.innerHTML = \`
          <div class="user-pill" onclick="logoutUser()" title="Klik untuk keluar (Logout)">
            <div class="user-avatar">\${currentUser.name.charAt(0).toUpperCase()}</div>
            <span>\${currentUser.name.split(' ')[0]} (Keluar)</span>
          </div>
        \`;
      } else {
        if (statusTag) {
          statusTag.innerText = 'Status: Akses Tamu (Bab 1 - 2)';
          statusTag.style.background = 'var(--pastel-rose-bg)';
          statusTag.style.color = 'var(--pastel-rose-txt)';
          statusTag.style.borderColor = 'var(--pastel-rose-border)';
        }
        if (studentNameField) studentNameField.innerText = '';

        container.innerHTML = \`
          <button class="btn-action btn-auth" onclick="openAuthModal('login')">
            🔑 Masuk
          </button>
        \`;
      }
      updateProgressDashboard();
    }

    function applyContentLocks() {
      // If user is logged in, unlock everything!
      // If user is guest, lock Bab 3 s.d. 18
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

    function handleLoginSubmit() {
      const u = document.getElementById('loginUsername').value.trim();
      const p = document.getElementById('loginPassword').value.trim();
      if (!u || !p) { alert('Silakan isi username dan password!'); return; }

      const users = JSON.parse(localStorage.getItem('irodori_users') || '[]');
      const user = users.find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === p);

      if (user) {
        currentUser = user;
        localStorage.setItem('irodori_active_user', JSON.stringify(currentUser));
        closeAuthModal();
        updateAuthUI();
        applyContentLocks();
        alert('✨ Berhasil masuk sebagai: ' + user.name + '! Seluruh 18 Bab kini terbuka penuh.');
      } else {
        alert('❌ Username atau password salah. Silakan coba lagi atau daftar akun baru.');
      }
    }

    function handleRegisterSubmit() {
      const name = document.getElementById('regFullName').value.trim();
      const u = document.getElementById('regUsername').value.trim();
      const p = document.getElementById('regPassword').value.trim();
      if (!name || !u || !p) { alert('Harap lengkapi semua kolom pendaftaran!'); return; }

      const users = JSON.parse(localStorage.getItem('irodori_users') || '[]');
      if (users.some(x => x.username.toLowerCase() === u.toLowerCase())) {
        alert('⚠️ Username sudah digunakan. Silakan gunakan username lain!');
        return;
      }

      const newUser = {
        username: u,
        password: p,
        name: name,
        role: 'student',
        masteredKanji: [],
        quizScores: {}
      };

      users.push(newUser);
      localStorage.setItem('irodori_users', JSON.stringify(users));

      currentUser = newUser;
      localStorage.setItem('irodori_active_user', JSON.stringify(currentUser));
      closeAuthModal();
      updateAuthUI();
      applyContentLocks();
      alert('🎉 Selamat, akun berhasil dibuat! Seluruh materi Bab 1 s.d. 18 telah terbuka.');
    }

    function logoutUser() {
      if (confirm('Apakah Anda yakin ingin keluar dari akun?')) {
        currentUser = null;
        localStorage.removeItem('irodori_active_user');
        updateAuthUI();
        applyContentLocks();
      }
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

      if (document.getElementById('tab-quiz').classList.contains('active')) {
        renderQuizView();
      }
    }

    // --- STROKE ANIMATION MODAL ---
    function openStrokeAnimation(kanji, meaning, strokes) {
      animActiveKanji = kanji;
      animCurrentStep = 0;
      clearInterval(animInterval);
      document.getElementById('animPlayBtn').innerText = '▶️ Putar';

      document.getElementById('animKanjiTitle').innerText = kanji;
      document.getElementById('animKanjiMeaning').innerText = meaning;
      document.getElementById('animStrokeCount').innerText = strokes + ' Goresan';

      // Find SVG element from guidance box on page
      let targetSvg = null;
      document.querySelectorAll('.guidance-box').forEach(box => {
        if (box.getAttribute('onclick')?.includes(kanji)) {
          const svg = box.querySelector('svg');
          if (svg) targetSvg = svg.cloneNode(true);
        }
      });

      const container = document.getElementById('animSvgContainer');
      container.innerHTML = '';
      if (targetSvg) {
        targetSvg.style.width = '100%';
        targetSvg.style.height = '100%';
        container.appendChild(targetSvg);
        initSvgStrokeAnimation(targetSvg);
      } else {
        container.innerHTML = \`<div style="font-size:3rem;font-weight:800;">\${kanji}</div>\`;
      }

      document.getElementById('strokeModal').style.display = 'flex';
    }

    function closeStrokeModal() {
      clearInterval(animInterval);
      document.getElementById('strokeModal').style.display = 'none';
    }

    function initSvgStrokeAnimation(svg) {
      const paths = svg.querySelectorAll('path');
      const texts = svg.querySelectorAll('text');
      
      paths.forEach((p, idx) => {
        const len = p.getTotalLength ? p.getTotalLength() : 100;
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = '0';
        p.style.transition = 'stroke-dashoffset 0.6s ease, stroke 0.3s ease';
      });

      updateAnimStepDisplay(paths.length);
    }

    function updateAnimStepDisplay(total) {
      const indicator = document.getElementById('animStepIndicator');
      if (indicator) indicator.innerText = 'Langkah Goresan: ' + (animCurrentStep + 1) + ' / ' + total;
    }

    function highlightStroke(step) {
      const svg = document.querySelector('#animSvgContainer svg');
      if (!svg) return;
      const paths = svg.querySelectorAll('path');
      if (step < 0 || step >= paths.length) return;

      paths.forEach((p, idx) => {
        if (idx < step) {
          p.style.stroke = '#334155';
          p.style.opacity = '1';
        } else if (idx === step) {
          p.style.stroke = '#e11d48';
          p.style.opacity = '1';
        } else {
          p.style.opacity = '0.15';
        }
      });
      animCurrentStep = step;
      updateAnimStepDisplay(paths.length);
    }

    function nextAnimStep() {
      const svg = document.querySelector('#animSvgContainer svg');
      if (!svg) return;
      const paths = svg.querySelectorAll('path');
      if (animCurrentStep < paths.length - 1) {
        highlightStroke(animCurrentStep + 1);
      }
    }

    function prevAnimStep() {
      if (animCurrentStep > 0) {
        highlightStroke(animCurrentStep - 1);
      }
    }

    function toggleAnimPlayback() {
      const svg = document.querySelector('#animSvgContainer svg');
      if (!svg) return;
      const paths = svg.querySelectorAll('path');

      if (animInterval) {
        clearInterval(animInterval);
        animInterval = null;
        document.getElementById('animPlayBtn').innerText = '▶️ Putar';
      } else {
        document.getElementById('animPlayBtn').innerText = '⏸️ Jeda';
        animInterval = setInterval(() => {
          if (animCurrentStep >= paths.length - 1) {
            animCurrentStep = 0;
          } else {
            animCurrentStep++;
          }
          highlightStroke(animCurrentStep);
        }, 900);
      }
    }

    // --- QUIZ LOGIC WITH AUTO-SAVE TO STUDENT PROFILE ---
    function renderQuizView() {
      const container = document.getElementById('quizContainer');
      const targetBab = currentBab === 'all' ? 1 : parseInt(currentBab);
      const ch = kanjiData.find(d => d.bab === targetBab) || kanjiData[0];

      // Check if locked
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
        <div class="exercise-grid">
          \${ch.readingExercise.map((ex, idx) => \`
            <div class="exercise-item" id="quiz-r-\${idx}">
              <div class="exercise-q">\${idx + 1}. \${ex.q}</div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <input type="text" class="search-input" style="padding:5px 10px;font-size:0.84rem;" id="input-r-\${idx}" placeholder="Ketik hiragana..." onkeydown="if(event.key==='Enter') checkQuizItem('r', \${idx}, '\${ex.a}')">
                <button class="btn-action btn-print" style="padding:5px 12px;font-size:0.78rem;" onclick="checkQuizItem('r', \${idx}, '\${ex.a}')">Cek</button>
              </div>
              <div><span class="answer-key" id="res-r-\${idx}" style="display:none;"></span></div>
            </div>
          \`).join('')}
        </div>

        <h4 style="font-size:0.9rem;font-weight:700;color:var(--text-sub);margin:20px 0 8px;">B. Kuis Menulis (Kanji):</h4>
        <div class="exercise-grid">
          \${ch.writingExercise.map((ex, idx) => \`
            <div class="exercise-item" id="quiz-w-\${idx}">
              <div class="exercise-q">\${idx + 1}. \${ex.q}</div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <input type="text" class="search-input" style="padding:5px 10px;font-size:0.84rem;" id="input-w-\${idx}" placeholder="Ketik kanji..." onkeydown="if(event.key==='Enter') checkQuizItem('w', \${idx}, '\${ex.a}')">
                <button class="btn-action btn-print" style="padding:5px 12px;font-size:0.78rem;" onclick="checkQuizItem('w', \${idx}, '\${ex.a}')">Cek</button>
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

      // Save score to active student profile
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
      localStorage.setItem('irodori_active_user', JSON.stringify(currentUser));
      const users = JSON.parse(localStorage.getItem('irodori_users') || '[]');
      const idx = users.findIndex(x => x.username.toLowerCase() === currentUser.username.toLowerCase());
      if (idx !== -1) {
        users[idx] = currentUser;
        localStorage.setItem('irodori_users', JSON.stringify(users));
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
              <span style="font-size:0.72rem;font-weight:700;\${isLocked ? 'color:#e11d48;' : (score >= 14 ? 'color:#16a34a;' : 'color:var(--text-sub);')}">
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
              <button class="btn-animate-stroke" onclick="openStrokeAnimation('\${k.kanji}', '\${k.meaning}', \${k.strokes})">
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

    // Initialize on page load
    window.addEventListener('DOMContentLoaded', () => {
      initTheme();
      initAuth();
    });
  </script>
</body>
</html>`;

  const indexPath = path.join(rootDir, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`Successfully generated Enhanced index.html (${(html.length / 1024).toFixed(1)} KB)!`);
}

buildIndexApp();
