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

const outputDir = path.resolve(__dirname, '..', 'Lembar Latihan Kanji');
const pngDir = path.resolve(__dirname, '..', 'assets', 'kanjivg_png');
const kanjiData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'kanji_irodori_a2_2_data.json'), 'utf-8'));

// Font configuration
const JP_FONT = "UD Digi Kyokasho NP-R";
const EN_FONT = "Plus Jakarta Sans";

// Borders
const softBorder = {
  style: BorderStyle.SINGLE,
  size: 1,
  color: "CBD5E1"
};

const blueBorder = {
  style: BorderStyle.SINGLE,
  size: 2,
  color: "2563EB"
};

const redBorder = {
  style: BorderStyle.SINGLE,
  size: 2,
  color: "DC2626"
};

const cellBorders = {
  top: softBorder,
  bottom: softBorder,
  left: softBorder,
  right: softBorder
};

function buildBabChildrenV2(ch) {
  const children = [];

  // Header Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 40 },
      children: [
        new TextRun({
          text: "LEMBAR LATIHAN KANJI IRODORI A2.2",
          font: EN_FONT,
          bold: true,
          size: 22,
          color: "1E3A8A"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: `${ch.titleJp}`,
          font: JP_FONT,
          bold: true,
          size: 26,
          color: "0F172A"
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: `${ch.titleId} • Topik: ${ch.topic}`,
          font: EN_FONT,
          size: 18,
          color: "475569"
        })
      ]
    })
  );

  // Student Info Table (Pastel Calm Shading)
  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 36, type: WidthType.PERCENTAGE },
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              borders: cellBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Nama: ", bold: true, size: 17, color: "1E40AF", font: EN_FONT }),
                    new TextRun({ text: "....................................................", size: 17, color: "94A3B8" })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 24, type: WidthType.PERCENTAGE },
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              borders: cellBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Tanggal: ", bold: true, size: 17, color: "1E40AF", font: EN_FONT }),
                    new TextRun({ text: "....../....../202...", size: 17, color: "94A3B8" })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              borders: cellBorders,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Kelas: ", bold: true, size: 17, color: "1E40AF", font: EN_FONT }),
                    new TextRun({ text: "............", size: 17, color: "94A3B8" })
                  ]
                })
              ]
            }),
            new TableCell({
              width: { size: 20, type: WidthType.PERCENTAGE },
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              borders: cellBorders,
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({ text: "Nilai: ", bold: true, size: 17, color: "1E40AF", font: EN_FONT }),
                    new TextRun({ text: "........ / 100", bold: true, size: 17, color: "0F172A", font: EN_FONT })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }),
    new Paragraph({ spacing: { after: 120 } })
  );

  // Section 1 Heading
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 80, after: 100 },
      children: [
        new TextRun({
          text: `Bagian 1: Target Kanji & 10 Kotak Grid Latihan Menulis (${ch.kanjiList.length} Kanji)`,
          bold: true,
          size: 19,
          color: "1E3A8A",
          font: EN_FONT
        })
      ]
    })
  );

  // For each Kanji, create Info Block + 10 Grid Boxes
  ch.kanjiList.forEach((k) => {
    const codePoint = k.kanji.codePointAt(0).toString(16).padStart(5, '0');
    const pngPath = path.join(pngDir, codePoint + '.png');
    const hasPng = fs.existsSync(pngPath);

    // 1. Info Table
    const wordListStr = k.words.map(w => `${w.word} (${w.reading}): ${w.meaning}`).join("   |   ");

    const infoTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            // Hero Character Box
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
              borders: { top: blueBorder, bottom: blueBorder, left: blueBorder, right: blueBorder },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 60 },
                  children: [
                    new TextRun({
                      text: k.kanji,
                      font: JP_FONT,
                      bold: true,
                      size: 50,
                      color: "0F172A"
                    })
                  ]
                })
              ]
            }),
            // Details Box
            new TableCell({
              width: { size: 85, type: WidthType.PERCENTAGE },
              shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
              borders: cellBorders,
              children: [
                new Paragraph({
                  spacing: { before: 30, after: 20 },
                  children: [
                    new TextRun({ text: "音 (Onyomi): ", bold: true, size: 16, color: "9D174D", font: EN_FONT }),
                    new TextRun({ text: `${k.on}    `, font: JP_FONT, size: 16 }),
                    new TextRun({ text: "訓 (Kunyomi): ", bold: true, size: 16, color: "1D4ED8", font: EN_FONT }),
                    new TextRun({ text: `${k.kun}    `, font: JP_FONT, size: 16 }),
                    new TextRun({ text: `【${k.strokes} 画】  `, bold: true, size: 16, color: "166534", font: EN_FONT }),
                    new TextRun({ text: `Radikal: ${k.radical}`, size: 16, color: "6B21A8", font: EN_FONT })
                  ]
                }),
                new Paragraph({
                  spacing: { after: 20 },
                  children: [
                    new TextRun({ text: "Arti: ", bold: true, size: 16, color: "0F172A", font: EN_FONT }),
                    new TextRun({ text: `${k.meaning}    `, bold: true, size: 16, color: "0F172A", font: EN_FONT }),
                    new TextRun({ text: "Urutan goresan: ", bold: true, size: 15, color: "64748B", font: EN_FONT }),
                    new TextRun({ text: k.strokeRule, size: 15, color: "64748B", font: EN_FONT })
                  ]
                }),
                new Paragraph({
                  spacing: { after: 20 },
                  children: [
                    new TextRun({ text: "Kosakata Bab: ", bold: true, size: 15, color: "1D4ED8", font: EN_FONT }),
                    new TextRun({ text: wordListStr, font: JP_FONT, size: 15, color: "1E293B" })
                  ]
                }),
                new Paragraph({
                  spacing: { after: 30 },
                  children: [
                    new TextRun({ text: "Contoh Kalimat: ", bold: true, size: 15, color: "166534", font: EN_FONT }),
                    new TextRun({ text: `${k.sentenceFurigana} `, font: JP_FONT, size: 15 }),
                    new TextRun({ text: `("${k.sentenceId}")`, italics: true, size: 14, color: "64748B", font: EN_FONT })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });

    // 2. 10 Grid Writing Boxes Table
    // Row 1: Guidance Labels
    const labelCells = [
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: "FEE2E2", type: ShadingType.CLEAR },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "① Urutan", size: 12, bold: true, color: "DC2626", font: EN_FONT })]
          })
        ]
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: "DBEAFE", type: ShadingType.CLEAR },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "② Contoh", size: 12, bold: true, color: "2563EB", font: EN_FONT })]
          })
        ]
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "③ Jiplak", size: 12, color: "64748B", font: EN_FONT })]
          })
        ]
      }),
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: "F1F5F9", type: ShadingType.CLEAR },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: "④ Jiplak", size: 12, color: "64748B", font: EN_FONT })]
          })
        ]
      })
    ];

    for (let c = 5; c <= 10; c++) {
      labelCells.push(
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
          borders: cellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: `⑤ Mandiri`, size: 11, color: "94A3B8", font: EN_FONT })]
            })
          ]
        })
      );
    }

    // Row 2: Practice Writing Cells (10 Grid Cells)
    const contentCells = [];

    // Cell 1: Numbered Stroke Guidance Diagram (ImageRun)
    if (hasPng) {
      const imgBuffer = fs.readFileSync(pngPath);
      contentCells.push(
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: "FFF9F9", type: ShadingType.CLEAR },
          borders: { top: redBorder, bottom: redBorder, left: redBorder, right: redBorder },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 20, after: 20 },
              children: [
                new ImageRun({
                  data: imgBuffer,
                  transformation: { width: 38, height: 38 }
                })
              ]
            })
          ]
        })
      );
    } else {
      contentCells.push(
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: "FFF9F9", type: ShadingType.CLEAR },
          borders: { top: redBorder, bottom: redBorder, left: redBorder, right: redBorder },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: k.kanji, font: JP_FONT, bold: true, size: 30, color: "DC2626" })]
            })
          ]
        })
      );
    }

    // Cell 2: Model character (bold)
    contentCells.push(
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: "F8FAFC", type: ShadingType.CLEAR },
        borders: { top: blueBorder, bottom: blueBorder, left: blueBorder, right: blueBorder },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: k.kanji, font: JP_FONT, bold: true, size: 30, color: "0F172A" })
            ]
          })
        ]
      })
    );

    // Cell 3: Trace character 1
    contentCells.push(
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: k.kanji, font: JP_FONT, size: 30, color: "CBD5E1" })
            ]
          })
        ]
      })
    );

    // Cell 4: Trace character 2
    contentCells.push(
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
        borders: cellBorders,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: k.kanji, font: JP_FONT, size: 30, color: "CBD5E1" })
            ]
          })
        ]
      })
    );

    // Cell 5 to 10: Blank practice cells
    for (let c = 5; c <= 10; c++) {
      contentCells.push(
        new TableCell({
          width: { size: 10, type: WidthType.PERCENTAGE },
          shading: { fill: "FFFFFF", type: ShadingType.CLEAR },
          borders: cellBorders,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 40, after: 40 },
              children: [new TextRun({ text: " ", size: 30 })]
            })
          ]
        })
      );
    }

    const gridTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ children: labelCells }),
        new TableRow({ children: contentCells })
      ]
    });

    children.push(infoTable, gridTable, new Paragraph({ spacing: { after: 120 } }));
  });

  // Section 2: 10 Reading + 10 Writing Exercises
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 120, after: 80 },
      children: [
        new TextRun({
          text: `Bagian 2: Latihan Evaluasi Pemahaman (Bab ${ch.bab} - 20 Soal)`,
          bold: true,
          size: 19,
          color: "1E3A8A",
          font: EN_FONT
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 50 },
      children: [
        new TextRun({
          text: "A. Latihan Membaca (10 Soal): Tuliskan cara baca (Hiragana) dari Kanji dalam tanda [ ]!",
          bold: true,
          size: 16,
          color: "1E3A8A",
          font: EN_FONT
        })
      ]
    })
  );

  ch.readingExercise.forEach((ex, idx) => {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: `${ex.q}  -->  `, font: JP_FONT, size: 16 }),
          new TextRun({ text: "....................................................", size: 16, color: "94A3B8" })
        ]
      })
    );
  });

  children.push(
    new Paragraph({
      spacing: { before: 90, after: 50 },
      children: [
        new TextRun({
          text: "B. Latihan Menulis (10 Soal): Tuliskan huruf Kanji dari kata yang bergaris bawah!",
          bold: true,
          size: 16,
          color: "1E3A8A",
          font: EN_FONT
        })
      ]
    })
  );

  ch.writingExercise.forEach((ex, idx) => {
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({ text: `${ex.q}  -->  [                ]`, font: JP_FONT, size: 16 })
        ]
      })
    );
  });

  return children;
}

async function generateAllDocxV2() {
  console.log("Generating DOCX V2 files...");

  // Generate individual DOCX for Bab 1 to 18
  for (let b = 1; b <= 18; b++) {
    const ch = kanjiData.find(d => d.bab === b);
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4
            margin: { top: 720, bottom: 720, left: 720, right: 720 }
          }
        },
        children: buildBabChildrenV2(ch)
      }]
    });

    const buffer = await Packer.toBuffer(doc);
    const fileName = `Lembar_Latihan_Kanji_Bab_${String(b).padStart(2, '0')}.docx`;
    fs.writeFileSync(path.join(outputDir, fileName), buffer);
    console.log(`Saved: ${fileName}`);
  }

  // Generate Master DOCX (All Bab 1 to 10)
  const masterChildren = [];
  kanjiData.forEach((ch, idx) => {
    masterChildren.push(...buildBabChildrenV2(ch));
    if (idx < kanjiData.length - 1) {
      masterChildren.push(new Paragraph({ children: [new PageBreak()] }));
    }
  });

  const masterDoc = new Document({
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 720, bottom: 720, left: 720, right: 720 }
        }
      },
      children: masterChildren
    }]
  });

  const masterBuffer = await Packer.toBuffer(masterDoc);
  const masterFileName = "Lembar_Latihan_Kanji_IRODORI_A2.2_Lengkap.docx";
  fs.writeFileSync(path.join(outputDir, masterFileName), masterBuffer);
  console.log(`Saved Master DOCX: ${masterFileName} (${masterBuffer.length} bytes)`);

  console.log("All DOCX V2 files generated successfully!");
}

generateAllDocxV2().catch(err => {
  console.error("Error generating DOCX V2:", err);
});
