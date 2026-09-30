const fs = require('fs');
const path = require('path');

let docx;
try {
  docx = require('docx');
} catch (e) {
  docx = require('C:/Users/Iqbal/.gemini/antigravity/brain/807496bd-5b78-41b2-928e-77a101ea325d/scratch/node_modules/docx');
}
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, HeadingLevel, ShadingType, PageBreak, ImageRun
} = docx;

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'Lembar Latihan Kanji');
const pngDir = path.join(rootDir, 'assets', 'kanjivg_png');
const kanjiData = JSON.parse(fs.readFileSync(path.join(rootDir, 'kanji_irodori_a2_2_data.json'), 'utf-8'));

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Font priority: UD Digi Kyokasho
const JP_FONT = "UD Digi Kyokasho NP-R";
const EN_FONT = "Plus Jakarta Sans";

const softBorder = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" };
const blueBorder = { style: BorderStyle.SINGLE, size: 2, color: "2563EB" };
const redBorder = { style: BorderStyle.SINGLE, size: 2, color: "DC2626" };

const cellBorders = { top: softBorder, bottom: softBorder, left: softBorder, right: softBorder };

function buildBabChildrenV4(ch) {
  const children = [];

  // Header Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 60, after: 30 },
      children: [
        new TextRun({ text: "LEMBAR LATIHAN KANJI IRODORI A2.2", font: EN_FONT, bold: true, size: 22, color: "1E3A8A" })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({ text: `${ch.titleJp}`, font: JP_FONT, bold: true, size: 24, color: "0F172A" }),
        new TextRun({ text: `  (${ch.titleId})`, font: EN_FONT, size: 16, color: "475569" })
      ]
    })
  );

  // Student Info Table
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ width: { size: 30, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Nama: ", bold: true, font: EN_FONT, size: 15 })] })] }),
            new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Tanggal: ", bold: true, font: EN_FONT, size: 15 })] })] }),
            new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Kelas: ", bold: true, font: EN_FONT, size: 15 })] })] }),
            new TableCell({ width: { size: 20, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ children: [new TextRun({ text: "Nilai:      / 100", bold: true, font: EN_FONT, size: 15 })] })] })
          ]
        })
      ]
    }),
    new Paragraph({ spacing: { after: 60 } })
  );

  // Kanji List (20-Grid Layout)
  ch.kanjiList.forEach(k => {
    const codePoint = k.kanji.codePointAt(0).toString(16).padStart(5, '0');
    const pngPath = path.join(pngDir, `${codePoint}.png`);
    const hasPng = fs.existsSync(pngPath);

    // Kanji Header Table
    const headerRow = new TableRow({
      children: [
        new TableCell({
          width: { size: 15, type: WidthType.PERCENTAGE },
          shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
          borders: cellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 20, after: 20 },
              children: [new TextRun({ text: k.kanji, font: JP_FONT, bold: true, size: 36, color: "0F172A" })]
            })
          ]
        }),
        new TableCell({
          width: { size: 85, type: WidthType.PERCENTAGE },
          borders: cellBorders,
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: `  Arti: `, bold: true, font: EN_FONT, size: 16 }),
                new TextRun({ text: `${k.meaning}    `, font: EN_FONT, size: 16 }),
                new TextRun({ text: `音: `, bold: true, font: EN_FONT, size: 15, color: "9D174D" }),
                new TextRun({ text: `${k.on}    `, font: JP_FONT, size: 15 }),
                new TextRun({ text: `訓: `, bold: true, font: EN_FONT, size: 15, color: "1D4ED8" }),
                new TextRun({ text: `${k.kun}    `, font: JP_FONT, size: 15 }),
                new TextRun({ text: `(${k.strokes} 画, Radikal: ${k.radical})`, font: EN_FONT, size: 14, color: "64748B" })
              ]
            }),
            new Paragraph({
              spacing: { before: 20 },
              children: [
                new TextRun({ text: `  Kata: `, bold: true, font: EN_FONT, size: 14 }),
                new TextRun({ text: k.words.map(w => `${w.word} (${w.reading})`).join("  •  "), font: JP_FONT, size: 14 }),
                new TextRun({ text: `    Kalimat: `, bold: true, font: EN_FONT, size: 14 }),
                new TextRun({ text: k.sentenceFurigana, font: JP_FONT, size: 14 })
              ]
            })
          ]
        })
      ]
    });

    // Row 1: Labels 1-10
    const labelRow1 = new TableRow({
      children: [
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "FEE2E2", type: ShadingType.CLEAR }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "① Urutan", font: EN_FONT, size: 11, bold: true, color: "DC2626" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "DBEAFE", type: ShadingType.CLEAR }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "② Contoh", font: EN_FONT, size: 11, bold: true, color: "2563EB" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "③ Jiplak", font: EN_FONT, size: 11, color: "64748B" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "④ Jiplak", font: EN_FONT, size: 11, color: "64748B" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑤", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑥", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑦", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑧", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑨", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑩", font: EN_FONT, size: 11, color: "94A3B8" })] })] })
      ]
    });

    // Row 1: Practice Cells 1-10
    const cells1 = [];
    if (hasPng) {
      cells1.push(
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "FFF9F9", type: ShadingType.CLEAR }, borders: { top: redBorder, bottom: redBorder, left: redBorder, right: redBorder },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 20, after: 20 }, children: [new ImageRun({ data: fs.readFileSync(pngPath), transformation: { width: 34, height: 34 } })] })]
        })
      );
    } else {
      cells1.push(
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "FFF9F9", type: ShadingType.CLEAR }, borders: { top: redBorder, bottom: redBorder, left: redBorder, right: redBorder },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: k.kanji, font: JP_FONT, bold: true, size: 26, color: "DC2626" })] })]
        })
      );
    }

    // Model Cell
    cells1.push(
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "F8FAFC", type: ShadingType.CLEAR }, borders: { top: blueBorder, bottom: blueBorder, left: blueBorder, right: blueBorder },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 }, children: [new TextRun({ text: k.kanji, font: JP_FONT, bold: true, size: 26, color: "0F172A" })] })]
      })
    );

    // Trace Cells 1 & 2
    cells1.push(
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 }, children: [new TextRun({ text: k.kanji, font: JP_FONT, size: 26, color: "CBD5E1" })] })]
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 }, children: [new TextRun({ text: k.kanji, font: JP_FONT, size: 26, color: "CBD5E1" })] })]
      })
    );

    // Blank cells 5-10
    for (let c = 5; c <= 10; c++) {
      cells1.push(
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders,
          children: [new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: " " })] })]
        })
      );
    }
    const contentRow1 = new TableRow({ children: cells1 });

    // Row 2: Labels 11-20
    const labelRow2 = new TableRow({
      children: [
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑪ Jiplak", font: EN_FONT, size: 11, color: "64748B" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, shading: { fill: "F1F5F9", type: ShadingType.CLEAR }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑫ Jiplak", font: EN_FONT, size: 11, color: "64748B" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑬", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑭", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑮", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑯", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑰", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑱", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑲", font: EN_FONT, size: 11, color: "94A3B8" })] })] }),
        new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "⑳", font: EN_FONT, size: 11, color: "94A3B8" })] })] })
      ]
    });

    // Row 2: Practice Cells 11-20
    const cells2 = [];
    cells2.push(
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 }, children: [new TextRun({ text: k.kanji, font: JP_FONT, size: 26, color: "CBD5E1" })] })]
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders,
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 30, after: 30 }, children: [new TextRun({ text: k.kanji, font: JP_FONT, size: 26, color: "CBD5E1" })] })]
      })
    );

    for (let c = 13; c <= 20; c++) {
      cells2.push(
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE }, borders: cellBorders,
          children: [new Paragraph({ spacing: { before: 30, after: 30 }, children: [new TextRun({ text: " " })] })]
        })
      );
    }
    const contentRow2 = new TableRow({ children: cells2 });

    // Writing Practice Table (20 Grid Boxes)
    children.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, labelRow1, contentRow1, labelRow2, contentRow2]
      }),
      new Paragraph({
        spacing: { before: 20, after: 50 },
        children: [
          new TextRun({ text: `✏️ Tulis Kata: ____________________    💬 Salin Kalimat: _____________________________________________`, font: EN_FONT, size: 13, color: "64748B" })
        ]
      })
    );
  });

  // Exercises Section
  children.push(
    new Paragraph({
      spacing: { before: 100, after: 40 },
      children: [
        new TextRun({ text: `SOAL LATIHAN EVALUASI BAB ${ch.bab} (20 SOAL)`, font: EN_FONT, bold: true, size: 18, color: "1E3A8A" })
      ]
    }),
    new Paragraph({
      spacing: { after: 20 },
      children: [new TextRun({ text: "A. Latihan Membaca (Tuliskan cara baca Hiragana):", bold: true, font: EN_FONT, size: 15 })]
    })
  );

  ch.readingExercise.forEach(ex => {
    children.push(
      new Paragraph({
        spacing: { after: 30 },
        children: [
          new TextRun({ text: `${ex.q}  -->  [                ]`, font: JP_FONT, size: 15 })
        ]
      })
    );
  });

  children.push(
    new Paragraph({
      spacing: { before: 60, after: 20 },
      children: [new TextRun({ text: "B. Latihan Menulis (Tuliskan huruf Kanji dari kata yang bergaris bawah):", bold: true, font: EN_FONT, size: 15 })]
    })
  );

  ch.writingExercise.forEach(ex => {
    children.push(
      new Paragraph({
        spacing: { after: 30 },
        children: [
          new TextRun({ text: `${ex.q}  -->  [                ]`, font: JP_FONT, size: 15 })
        ]
      })
    );
  });

  return children;
}

async function generateAllDocxV4() {
  console.log("Generating 20-Grid DOCX V4 files...");

  // Generate Individual Bab 1 to 18
  for (let b = 1; b <= 18; b++) {
    const ch = kanjiData.find(d => d.bab === b);
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 600, bottom: 600, left: 600, right: 600 }
          }
        },
        children: buildBabChildrenV4(ch)
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = `Lembar_Latihan_Kanji_Bab_${String(b).padStart(2, '0')}.docx`;
    fs.writeFileSync(path.join(outputDir, fileName), buffer);
    console.log(`Saved 20-grid: ${fileName}`);
  }

  // Generate Master DOCX
  const masterChildren = [];
  kanjiData.forEach((ch, idx) => {
    masterChildren.push(...buildBabChildrenV4(ch));
    if (idx < kanjiData.length - 1) {
      masterChildren.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });

  const masterDoc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 600, bottom: 600, left: 600, right: 600 }
        }
      },
      children: masterChildren
    }]
  });

  const masterBuffer = await Packer.toBuffer(masterDoc);
  const masterFileName = "Lembar_Latihan_Kanji_IRODORI_A2.2_Lengkap.docx";
  fs.writeFileSync(path.join(outputDir, masterFileName), masterBuffer);
  console.log(`Saved Master 20-grid DOCX: ${masterFileName}`);

  // Sync to D:
  const dOutput = 'D:/KANJI Irodori A2.2/KANJI Irodori A2.2/Lembar Latihan Kanji';
  if (fs.existsSync(dOutput)) {
    fs.copyFileSync(path.join(outputDir, masterFileName), path.join(dOutput, masterFileName));
    for (let b = 1; b <= 18; b++) {
      const f = `Lembar_Latihan_Kanji_Bab_${String(b).padStart(2, '0')}.docx`;
      fs.copyFileSync(path.join(outputDir, f), path.join(dOutput, f));
    }
    console.log("Synced all 20-grid DOCX files to D: workspace!");
  }
}

generateAllDocxV4().catch(err => {
  console.error("Error generating DOCX V4:", err);
});
