const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'Lembar Latihan Kanji');
const svgDir = path.join(rootDir, 'assets', 'kanjivg');
const kanjiData = JSON.parse(fs.readFileSync(path.join(rootDir, 'kanji_irodori_a2_2_data.json'), 'utf-8'));

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Guidance SVG (With numbered order)
function getGuidanceSvg(kanjiChar) {
  if (!kanjiChar) return '';
  const codePoint = kanjiChar.codePointAt(0).toString(16).padStart(5, '0');
  const svgPath = path.join(svgDir, codePoint + '.svg');
  if (!fs.existsSync(svgPath)) {
    return `<div style="font-size:24px;font-weight:bold;color:#334155;">${kanjiChar}</div>`;
  }
  let rawSvg = fs.readFileSync(svgPath, 'utf-8');
  rawSvg = rawSvg.replace(/<\?xml[\s\S]*?<svg/i, '<svg');
  rawSvg = rawSvg.replace(/<!DOCTYPE[\s\S]*?>/i, '');

  const crossLines = `
    <!-- Tianzige Cross Guidelines -->
    <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
    <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#cbd5e1" stroke-dasharray="2.5,2.5" stroke-width="0.9" />
  `;
  rawSvg = rawSvg.replace(/(<svg[^>]*>)/i, `$1${crossLines}`);
  rawSvg = rawSvg.replace(/stroke:#000000;stroke-width:3;/g, 'stroke:#1e293b;stroke-width:3.8;stroke-linecap:round;stroke-linejoin:round;');
  rawSvg = rawSvg.replace(/fill:#808080/g, 'fill:#e11d48;font-weight:bold;');
  rawSvg = rawSvg.replace(/font-size:8/g, 'font-size:10');
  rawSvg = rawSvg.replace('<svg ', '<svg class="kanji-svg guidance-svg" ');
  return rawSvg;
}

// Model SVG (Identical size and strokes as guidance, solid dark ink, no numbers)
function getModelSvg(kanjiChar) {
  if (!kanjiChar) return '';
  const cp = kanjiChar.codePointAt(0).toString(16).padStart(5, '0');
  const svgPath = path.join(svgDir, cp + '.svg');
  if (!fs.existsSync(svgPath)) return `<div style="font-size:24px;font-weight:bold;color:#0f172a;">${kanjiChar}</div>`;
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

// Trace SVG (Identical size and strokes, calm slate gray for tracing)
function getTraceSvg(kanjiChar) {
  if (!kanjiChar) return '';
  const cp = kanjiChar.codePointAt(0).toString(16).padStart(5, '0');
  const svgPath = path.join(svgDir, cp + '.svg');
  if (!fs.existsSync(svgPath)) return `<div style="font-size:24px;font-weight:bold;color:#cbd5e1;">${kanjiChar}</div>`;
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

// Convert Kanji(furigana) to standard HTML <ruby>Kanji<rt>furigana</rt></ruby>
function formatSentenceRuby(str) {
  if (!str) return '';
  return str.replace(/([一-龯々\w]+)[\(（]([ぁ-んァ-ヶー]+)[\)）]/g, (match, kanji, furi) => {
    return `<ruby>${kanji}<rt>${furi}</rt></ruby>`;
  });
}

function generateHtmlContentV4(selectedBab = null) {
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
    @font-face {
      font-family: 'UD Digi Kyokasho Native';
      src: local('UD デジタル 教科書体 NP-R'),
           local('UD Digi Kyokasho NP-R'),
           local('UD デジタル 教科書体 NK-R'),
           local('UD Digi Kyokasho NK-R'),
           local('UD デジタル 教科書体 N-R'),
           local('UD Digi Kyokasho N-R'),
           local('UD デジタル 教科書体'),
           local('UD Digi Kyokasho');
    }

    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=BIZ+UDPGothic:wght@400;700&family=Zen+Maru+Gothic:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap');

    :root {
      --font-kyokasho: 'UD Digi Kyokasho Native', 'UD デジタル 教科書体 NP-R', 'UD Digi Kyokasho NP-R', 'UD デジタル 教科書体', 'UD Digi Kyokasho', 'BIZ UDPGothic', sans-serif;
      --bg-base: #f0f4f8;
      --clay-card-bg: #ffffff;
      --clay-surface: #fdfbf7;
      --card-border: #e2e8f0;
      --text-main: #1e293b;
      --text-sub: #475569;
      --grid-border: #94a3b8;
      --grid-cross: #cbd5e1;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: var(--font-kyokasho);
      background-color: var(--bg-base);
      color: var(--text-main);
      padding-bottom: 50px;
    }

    .no-print-toolbar {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }

    .btn-print {
      background: #2563eb;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 20px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .container {
      max-width: 1100px;
      margin: 20px auto;
      padding: 0 16px;
    }

    .worksheet-page {
      background: #ffffff;
      border-radius: 20px;
      padding: 24px 28px;
      margin-bottom: 30px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 6px 18px rgba(0,0,0,0.04);
      page-break-after: always;
    }

    .sheet-header {
      border-bottom: 2px dashed #cbd5e1;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }

    .curriculum-tag {
      font-size: 0.7rem;
      font-weight: 800;
      color: #1d4ed8;
      background: #e8f0fe;
      display: inline-block;
      padding: 3px 10px;
      border-radius: 10px;
      margin-bottom: 4px;
    }

    .sheet-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 2px; }
    .sheet-subtitle { font-size: 0.88rem; color: #64748b; margin-bottom: 12px; }

    .student-info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: #fdfbf7;
      padding: 8px 12px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      font-size: 0.8rem;
    }

    .kanji-unit {
      border: 1.5px solid #cbd5e1;
      border-radius: 16px;
      padding: 14px 16px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .kanji-header { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }

    .kanji-hero {
      width: 58px; height: 58px;
      border-radius: 14px;
      border: 1.5px solid #94a3b8;
      display: flex; align-items: center; justify-content: center;
      font-size: 2.3rem; font-weight: 800;
      position: relative;
    }

    .kanji-meta { flex: 1; }
    .kanji-readings { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; font-size: 0.75rem; }
    .reading-tag { padding: 2px 8px; border-radius: 8px; font-weight: 700; }
    .tag-on { background: #fde8ef; color: #9d174d; }
    .tag-kun { background: #e8f0fe; color: #1d4ed8; }
    .tag-stroke { background: #fef3c7; color: #92400e; }
    .tag-radical { background: #f3e8ff; color: #6b21a8; }

    .kanji-meaning { font-size: 0.95rem; font-weight: 800; }
    .stroke-rule { font-size: 0.76rem; color: #64748b; }

    /* 20-Grid Table (2 Baris x 10 Kotak) */
    .grid-20-wrapper {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .grid-boxes-row {
      display: grid;
      grid-template-columns: repeat(10, 1fr);
      gap: 5px;
    }

    .tianzige-box {
      aspect-ratio: 1 / 1;
      border: 1.5px solid #94a3b8;
      border-radius: 8px;
      position: relative;
      display: flex; align-items: center; justify-content: center;
      background: #ffffff;
      user-select: none;
      overflow: visible;
    }

    .box-tag {
      position: absolute;
      top: 1px;
      left: 1px;
      font-size: 0.52rem;
      font-weight: 800;
      line-height: 1;
      padding: 1px 3px;
      border-radius: 3px;
      z-index: 10;
      background: rgba(255, 255, 255, 0.9);
      pointer-events: none;
    }
    .box-tag.tag-urutan { color: #dc2626; background: #fee2e2; }
    .box-tag.tag-contoh { color: #1d4ed8; background: #dbeafe; }
    .box-tag.tag-jiplak { color: #64748b; background: #f1f5f9; }
    .box-tag.tag-latih { color: #94a3b8; }

    .tianzige-box::before {
      content: ''; position: absolute;
      top: 50%; left: 0; right: 0;
      border-top: 1px dashed #cbd5e1;
    }

    .tianzige-box::after {
      content: ''; position: absolute;
      left: 50%; top: 0; bottom: 0;
      border-left: 1px dashed #cbd5e1;
    }

    .guidance-box { border-color: #dc2626; border-width: 2px; }
    .model-box { border-color: #2563eb; border-width: 2px; }

    /* SVG inside box scaled identically to 90% */
    .kanji-svg {
      width: 90% !important;
      height: 90% !important;
      z-index: 2;
    }

    /* Ruled Writing Line */
    .ruled-writing-row {
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px dotted #cbd5e1;
      display: flex;
      flex-direction: column;
      gap: 5px;
      font-size: 0.78rem;
    }

    .ruled-item { display: flex; align-items: baseline; gap: 8px; }
    .ruled-lbl { font-weight: 700; color: #475569; white-space: nowrap; font-size: 0.74rem; }
    .ruled-line { flex: 1; border-bottom: 1.5px dotted #94a3b8; height: 14px; }

    /* Separated Exercises */
    .page-exercise-a, .page-exercise-b {
      background: #fdfbf7;
      border: 1.5px solid #cbd5e1;
      border-radius: 16px;
      padding: 18px 22px;
      margin-top: 20px;
    }

    .page-exercise-b {
      margin-top: 28px;
      page-break-before: always;
      break-before: page;
    }

    .exercise-title { font-size: 1rem; font-weight: 800; margin-bottom: 12px; }
    .exercise-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .exercise-item { background: #ffffff; border: 1.5px solid #e2e8f0; padding: 10px 14px; border-radius: 10px; font-size: 0.88rem; }
    .exercise-item-q { font-weight: 600; line-height: 1.4; }
    .answer-key { display: inline-block; font-size: 0.75rem; font-weight: 700; color: #9d174d; background: #fde8ef; padding: 2px 6px; border-radius: 6px; margin-top: 6px; }

    @page {
      size: A4 portrait;
      margin: 8mm 10mm;
    }

    @media print {
      body { background: #ffffff !important; padding: 0 !important; font-family: var(--font-kyokasho) !important; }
      .no-print-toolbar { display: none !important; }
      .container { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
      .worksheet-page { box-shadow: none !important; border: none !important; padding: 0 !important; margin-bottom: 10mm !important; }
      .kanji-unit { page-break-inside: avoid !important; }
      .page-exercise-a { page-break-inside: avoid !important; }
      .page-exercise-b { 
        page-break-before: always !important; 
        break-before: page !important; 
        page-break-inside: avoid !important;
      }
      .answer-key { display: none !important; }
    }
  </style>
</head>
<body>

  <div class="no-print-toolbar">
    <div style="font-weight: 800; font-size: 1rem;">
      🎌 Lembar Latihan Kanji IRODORI A2.2 (20 Kotak Grid • SVG Identik • Halaman Latihan Terpisah)
    </div>
    <div>
      <button class="btn-print" onclick="window.print()">🖨️ Cetak A4 / Simpan PDF</button>
    </div>
  </div>

  <div class="container">
    ${filteredData.map(ch => `
      <div class="worksheet-page" id="bab-${ch.bab}">
        
        <div class="sheet-header">
          <div class="curriculum-tag">IRODORI: Nihongo de Kurashito Kotoba • 初級2 (A2.2)</div>
          <h2 class="sheet-title">${ch.titleJp}</h2>
          <div class="sheet-subtitle">${ch.titleId} — Topik: ${ch.topic}</div>

          <div class="student-info-grid">
            <div>Nama: ________________</div>
            <div>Tanggal: ______________</div>
            <div>Kelas: _______________</div>
            <div>Nilai: _______ / 100</div>
          </div>
        </div>

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

              <div style="font-size: 0.85rem; margin-bottom: 6px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <strong>Kosakata:</strong>
                ${k.words.map(w => `<span style="background:#f1f5f9;padding:3px 8px;border-radius:6px;border:1px solid #e2e8f0;"><ruby><strong>${w.word}</strong><rt>${w.reading}</rt></ruby>: ${w.meaning}</span>`).join('')}
              </div>

              <div style="font-size: 0.9rem; margin-bottom: 8px; line-height: 1.6;">
                <strong>Contoh:</strong> <span>${formatSentenceRuby(k.sentenceFurigana)}</span> ➔ <em>"${k.sentenceId}"</em>
              </div>

              <!-- 20 Kotak Grid (2 Baris x 10 Kotak) -->
              <div class="grid-20-wrapper">
                
                <!-- Baris 1: Kotak 1 s/d 10 -->
                <div class="grid-boxes-row">
                  <div class="tianzige-box guidance-box">
                    <span class="box-tag tag-urutan">① Urutan</span>
                    ${getGuidanceSvg(k.kanji)}
                  </div>
                  <div class="tianzige-box model-box">
                    <span class="box-tag tag-contoh">② Contoh</span>
                    ${getModelSvg(k.kanji)}
                  </div>
                  <div class="tianzige-box trace-box">
                    <span class="box-tag tag-jiplak">③ Jiplak</span>
                    ${getTraceSvg(k.kanji)}
                  </div>
                  <div class="tianzige-box trace-box">
                    <span class="box-tag tag-jiplak">④ Jiplak</span>
                    ${getTraceSvg(k.kanji)}
                  </div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑤ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑥ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑦ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑧ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑨ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑩ Latih</span></div>
                </div>

                <!-- Baris 2: Kotak 11 s/d 20 -->
                <div class="grid-boxes-row">
                  <div class="tianzige-box trace-box">
                    <span class="box-tag tag-jiplak">⑪ Jiplak</span>
                    ${getTraceSvg(k.kanji)}
                  </div>
                  <div class="tianzige-box trace-box">
                    <span class="box-tag tag-jiplak">⑫ Jiplak</span>
                    ${getTraceSvg(k.kanji)}
                  </div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑬ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑭ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑮ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑯ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑰ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑱ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑲ Latih</span></div>
                  <div class="tianzige-box"><span class="box-tag tag-latih">⑳ Latih</span></div>
                </div>

                <!-- Baris Menulis saat Dicetak -->
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

        <!-- Latihan A (Halaman Terpisah) -->
        <div class="page-exercise-a">
          <div class="exercise-title">📖 A. Latihan Membaca (Hiragana) — Bab ${ch.bab} (10 Soal)</div>
          <div class="exercise-grid">
            ${ch.readingExercise.map(ex => `
              <div class="exercise-item">
                <div class="exercise-item-q">${ex.q}</div>
                <div class="answer-key">${ex.a}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Latihan B (Halaman Terpisah - Selalu Mulai di Page Baru) -->
        <div class="page-exercise-b">
          <div class="exercise-title">✏️ B. Latihan Menulis (Kanji) — Bab ${ch.bab} (10 Soal)</div>
          <div class="exercise-grid">
            ${ch.writingExercise.map(ex => `
              <div class="exercise-item">
                <div class="exercise-item-q">${ex.q}</div>
                <div class="answer-key">${ex.a}</div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `).join('')}
  </div>

</body>
</html>`;
}

// 1. Generate Master HTML in Lembar Latihan Kanji
const masterHtmlPath = path.join(outputDir, 'Lembar_Latihan_Kanji_IRODORI_A2.2.html');
fs.writeFileSync(masterHtmlPath, generateHtmlContentV4(null), 'utf-8');
console.log('Saved 20-grid Master HTML:', masterHtmlPath);

// 2. Generate Individual Bab HTML (Bab 1 to 18)
for (let b = 1; b <= 18; b++) {
  const babHtmlPath = path.join(outputDir, `Lembar_Latihan_Kanji_Bab_${b}.html`);
  fs.writeFileSync(babHtmlPath, generateHtmlContentV4(b), 'utf-8');
}
console.log('Saved 18 individual Bab HTML 20-grid files successfully!');

// Also sync to D:
const dOutput = 'D:/KANJI Irodori A2.2/KANJI Irodori A2.2/Lembar Latihan Kanji';
if (fs.existsSync(dOutput)) {
  fs.copyFileSync(masterHtmlPath, path.join(dOutput, 'Lembar_Latihan_Kanji_IRODORI_A2.2.html'));
  for (let b = 1; b <= 18; b++) {
    fs.copyFileSync(path.join(outputDir, `Lembar_Latihan_Kanji_Bab_${b}.html`), path.join(dOutput, `Lembar_Latihan_Kanji_Bab_${b}.html`));
  }
  console.log('Synced 20-grid HTML files to D: workspace!');
}
