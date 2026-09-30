const fs = require('fs');
const path = require('path');

const outputDir = 'c:/Users/Iqbal/Downloads/File MD A2.2';

// Load existing Bab 1-10
const existingBab1to10 = JSON.parse(fs.readFileSync(path.join(outputDir, 'kanji_irodori_a2_2_data.json'), 'utf-8'));

// Bab 11 to 18 definitions
const bab11to18 = [
  {
    bab: 11,
    titleJp: "第11課 ポイントカードを忘れてしまいました",
    titleId: "Bab 11: Saya Lupa Membawa Kartu Poin",
    topic: "上手な買い物 (Belanja yang Cerdas)",
    kanjiList: [
      {
        kanji: "色", on: "ショク / シキ", kun: "いろ", strokes: 6, radical: "色 (warna)",
        meaning: "Warna",
        strokeRule: "Sapuan miring kiri atas, horizontal belok kait, garis vertikal pendek, horizontal melengkung kait bawah.",
        words: [{ word: "色", reading: "いろ", meaning: "warna" }, { word: "色々", reading: "いろいろ", meaning: "bermacam-macam" }],
        sentence: "このセーター、ほかの色はありますか？", sentenceFurigana: "このセーター、ほかの色(いろ)はありますか？",
        sentenceId: "Apakah sweter ini ada warna lainnya?"
      },
      {
        kanji: "女", on: "ジョ / ニョ", kun: "おんな", strokes: 3, radical: "女 (wanita)",
        meaning: "Wanita / Perempuan",
        strokeRule: "Garis menyilang belok kiri miring bawah, sapuan miring kiri kedua, garis horizontal melintang panjang.",
        words: [{ word: "女性", reading: "じょせい", meaning: "wanita / kaum hawa" }, { word: "彼女", reading: "かのじょ", meaning: "dia (wanita) / pacar" }],
        sentence: "この店は、女性にも男性にも人気があります。", sentenceFurigana: "この店(みせ)は、女(じょ)性(せい)にも男(だん)性(せい)にも人(にん)気(き)があります。",
        sentenceId: "Toko ini populer baik di kalangan wanita maupun pria."
      },
      {
        kanji: "性", on: "セイ / ショウ", kun: "-", strokes: 8, radical: "忄 (hati)",
        meaning: "Jenis kelamin / Sifat dasar",
        strokeRule: "Tiga titik hati 忄 di kiri (3 goresan), 生 (lahir) di kanan (5 goresan).",
        words: [{ word: "女性", reading: "じょせい", meaning: "wanita" }, { word: "男性", reading: "だんせい", meaning: "pria" }, { word: "性格", reading: "せいかく", meaning: "sifat / kepribadian" }],
        sentence: "女性にも男性にも人気があります。", sentenceFurigana: "女(じょ)性(せい)にも男(だん)性(せい)にも人(にん)気(き)があります。",
        sentenceId: "Disukai oleh kalangan wanita maupun pria."
      },
      {
        kanji: "赤", on: "セキ / シャク", kun: "あか / あか-い", strokes: 7, radical: "赤 (merah)",
        meaning: "Merah",
        strokeRule: "Tanah 土 di atas (3 goresan), lalu dua goresan kaki 八 dan sapuan bawah.",
        words: [{ word: "赤", reading: "あか", meaning: "warna merah" }, { word: "赤い", reading: "あかい", meaning: "merah (kata sifat)" }, { word: "赤ちゃん", reading: "あかちゃん", meaning: "bayi" }],
        sentence: "赤や青のセーターがあります。", sentenceFurigana: "赤(あか)や青(あお)のセーターがあります。",
        sentenceId: "Ada sweter warna merah dan biru."
      },
      {
        kanji: "男", on: "ダン / ナン", kun: "おとこ", strokes: 7, radical: "田 (sawah)",
        meaning: "Pria / Laki-laki",
        strokeRule: "Sawah 田 di atas (5 goresan), tenaga 力 di bawah (2 goresan).",
        words: [{ word: "男性", reading: "だんせい", meaning: "pria" }, { word: "男の子", reading: "おとこのこ", meaning: "anak laki-laki" }],
        sentence: "男性用のコーナーは2階にあります。", sentenceFurigana: "男(だん)性(せい)用(よう)のコーナーは2階(かい)にあります。",
        sentenceId: "Area pakaian pria berada di lantai 2."
      },
      {
        kanji: "青", on: "セイ / ショウ", kun: "あお / あお-い", strokes: 8, radical: "青 (biru)",
        meaning: "Biru / Hijau muda",
        strokeRule: "Bagian atas 生 variasi (4 goresan), bulan 月 di bawah (4 goresan).",
        words: [{ word: "青", reading: "あお", meaning: "warna biru" }, { word: "青い", reading: "あおい", meaning: "biru" }, { word: "青信号", reading: "あおしんごう", meaning: "lampu hijau lalu lintas" }],
        sentence: "青いシャツを試着しました。", sentenceFurigana: "青(あお)いシャツを試(し)着(ちゃく)しました。",
        sentenceId: "Saya mencoba kemeja warna biru."
      },
      {
        kanji: "急", on: "キュウ", kun: "いそ-ぐ", strokes: 9, radical: "心 (hati)",
        meaning: "Mendadak / Tergesa-gesa / Cepat",
        strokeRule: "奐 bagian atas (勹 dan 彐 variasi: 5 goresan), hati 心 di bawah (4 goresan).",
        words: [{ word: "急に", reading: "きゅうに", meaning: "tiba-tiba / mendadak" }, { word: "急ぐ", reading: "いそぐ", meaning: "terburu-buru" }, { word: "急行", reading: "きゅうこう", meaning: "kereta ekspres" }],
        sentence: "買い物のとき、急にお腹が痛くなりました。", sentenceFurigana: "買(か)い物(もの)のとき、急(きゅう)にお腹(なか)が痛(いた)くなりました。",
        sentenceId: "Saat berbelanja, tiba-tiba perut saya sakit."
      },
      {
        kanji: "黒", on: "コク", kun: "くろ / くろ-い", strokes: 11, radical: "黒 (hitam)",
        meaning: "Hitam",
        strokeRule: "Bagian atas 里 variasi (7 goresan), di bawahnya 4 titik api 灬 (4 goresan).",
        words: [{ word: "黒", reading: "くろ", meaning: "warna hitam" }, { word: "黒い", reading: "くろい", meaning: "hitam" }],
        sentence: "黒いジャケットを買いました。", sentenceFurigana: "黒(くろ)いジャケットを買(か)いました。",
        sentenceId: "Saya membeli jaket hitam."
      },
      {
        kanji: "営", on: "エイ", kun: "いとな-む", strokes: 12, radical: "ツ (mahkota)",
        meaning: "Mengelola / Usaha / Bisnis",
        strokeRule: "Tiga titik atas, mahkota 冖 (3 goresan), lalu dua mulut 口 di bawah (6 goresan).",
        words: [{ word: "営業する", reading: "えいぎょうする", meaning: "buka usaha / beroperasi" }, { word: "営業時間", reading: "えいぎょうじかん", meaning: "jam operasional" }],
        sentence: "この店は夜9時まで営業しています。", sentenceFurigana: "この店(みせ)は夜(よる)9時(じ)まで営(えい)業(ぎょう)しています。",
        sentenceId: "Toko ini buka beroperasi sampai jam 9 malam."
      },
      {
        kanji: "業", on: "ギョウ / ゴウ", kun: "わざ", strokes: 13, radical: "木 (pohon)",
        meaning: "Kegiatan / Pekerjaan / Industri",
        strokeRule: "Tiga titik atas, horizontal panjang, dua pasang vertikal bertolak, horizontal dasar, kayu 木 di bawah.",
        words: [{ word: "営業する", reading: "えいぎょうする", meaning: "beroperasi / buka" }, { word: "授業", reading: "じゅぎょう", meaning: "pelajaran / kelas" }, { word: "卒業", reading: "そつぎょう", meaning: "kelulusan" }],
        sentence: "毎日夜遅くまで営業しています。", sentenceFurigana: "毎(まい)日(にち)夜(よる)遅(おそ)くまで営(えい)業(ぎょう)しています。",
        sentenceId: "Setiap hari buka sampai larut malam."
      },
      {
        kanji: "白", on: "ハク / ビャク", kun: "しろ / しろ-い", strokes: 5, radical: "白 (putih)",
        meaning: "Putih",
        strokeRule: "Garis miring pendek atas, lalu kotak 日 di bawah (4 goresan).",
        words: [{ word: "白", reading: "しろ", meaning: "warna putih" }, { word: "白い", reading: "しろい", meaning: "putih" }],
        sentence: "白と黒の靴があります。", sentenceFurigana: "白(しろ)と黒(くろ)の靴(くつ)があります。",
        sentenceId: "Ada sepatu warna putih dan hitam."
      },
      {
        kanji: "案", on: "アン", kun: "-", strokes: 10, radical: "木 (pohon)",
        meaning: "Rancangan / Petunjuk / Memandu",
        strokeRule: "Tenang 安 di atas (6 goresan: 宀, 女), pohon 木 di bawah (4 goresan).",
        words: [{ word: "案内する", reading: "あんないする", meaning: "memandu / mengantar" }, { word: "案内所", reading: "あんないじょ", meaning: "pusat informasi" }],
        sentence: "レジまでご案内します。", sentenceFurigana: "レジまでご案(あん)内(ない)します。",
        sentenceId: "Akan saya pandu/antar sampai ke kasir."
      },
      {
        kanji: "内", on: "ナイ / ダイ", kun: "うち", strokes: 4, radical: "冂 (bingkai terbalik)",
        meaning: "Dalam / Di dalam",
        strokeRule: "Bingkai luar 冂 (2 goresan), garis masuk 人 variasi di dalam (2 goresan).",
        words: [{ word: "案内する", reading: "あんないする", meaning: "memandu" }, { word: "国内", reading: "こくない", meaning: "dalam negeri" }, { word: "案内", reading: "あんない", meaning: "informasi/pemandu" }],
        sentence: "店員が売り場を案内してくれました。", sentenceFurigana: "店(てん)員(いん)が売(う)り場(ば)を案(あん)内(ない)してくれました。",
        sentenceId: "Pelayan toko memandu saya di area penjualan."
      }
    ],
    readingExercise: [
      { q: "① この店は夜9時まで[営業]しています。", a: "えいぎょう" },
      { q: "② この店は、[女性]にも男性にも人気があります。", a: "じょせい" },
      { q: "③ この店は、女性にも[男性]にも人気があります。", a: "だんせい" },
      { q: "④ レジまでご[案内]します。", a: "あんない" },
      { q: "⑤ 買い物のとき、[急]にお腹が痛くなりました。", a: "きゅう" },
      { q: "⑥ このセーター、ほかの[色]はありますか？", a: "いろ" },
      { q: "⑦ [赤]いセーターを試着しました。", a: "あか" },
      { q: "⑧ [青]いシャツを買いました。", a: "あお" },
      { q: "⑨ [黒]いバッグを見せてください。", a: "くろ" },
      { q: "⑩ [白]いスニーカーがとても軽いです。", a: "しろ" }
    ],
    writingExercise: [
      { q: "① このみせは よる９じまで ( _________ ) [えいぎょう] しています。", a: "営業" },
      { q: "② このふくは ( _________ ) [じょせい] に にんきです。", a: "女性" },
      { q: "③ ( _________ ) [だんせい] ようの コーナーへ いきます。", a: "男性" },
      { q: "④ レジまで ご ( _________ ) [あんない] します。", a: "案内" },
      { q: "⑤ かいもののとき、 ( _________ ) [きゅう] に おなかが いたくなりました。", a: "急" },
      { q: "⑥ ほかの ( _________ ) [いろ] は ありますか？", a: "色" },
      { q: "⑦ ( _________ ) [あか] い スカートを えらびました。", a: "赤" },
      { q: "⑧ ( _________ ) [あお] い シャツを きます。", a: "青" },
      { q: "⑨ ( _________ ) [くろ] い くつを はきます。", a: "黒" },
      { q: "⑩ ( _________ ) [しろ] い セーターを かいました。", a: "白" }
    ]
  },

  {
    bab: 12,
    titleJp: "第12課 このボタンを押すと、エコモードに変わります",
    titleId: "Bab 12: Kalau Menekan Tombol Ini, Akan Berubah ke Mode Hemat Daya",
    topic: "上手な買い物 (Belanja yang Cerdas)",
    kanjiList: [
      {
        kanji: "商", on: "ショウ", kun: "あきな-う", strokes: 11, radical: "口 (mulut)",
        meaning: "Dagang / Produk / Niaga",
        strokeRule: "亠 di atas, lalu 丷, 冂 luar dengan 八 dan 口 di dalam.",
        words: [{ word: "商品", reading: "しょうひん", meaning: "produk / barang dagangan" }, { word: "商店", reading: "しょうてん", meaning: "toko" }],
        sentence: "この商品の値段、消費税は入っていますか？", sentenceFurigana: "この商(しょう)品(ひん)の値(ね)段(だん)、消(しょう)費(ひ)税(ぜい)は入(はい)っていますか？",
        sentenceId: "Apakah harga produk ini sudah termasuk pajak konsumsi?"
      },
      {
        kanji: "品", on: "ヒン", kun: "しな", strokes: 9, radical: "口 (mulut)",
        meaning: "Barang / Produk / Kualitas",
        strokeRule: "Tiga buah kotak 口: satu di atas tengah, dua di bawah (kiri lalu kanan).",
        words: [{ word: "商品", reading: "しょうひん", meaning: "barang produk" }, { word: "食品", reading: "しょくひん", meaning: "bahan makanan" }],
        sentence: "新しい商品がたくさん並んでいます。", sentenceFurigana: "新(あたら)しい商(しょう)品(ひん)がたくさん並(なら)んでいます。",
        sentenceId: "Banyak produk baru yang dipajang."
      },
      {
        kanji: "値", on: "チ", kun: "ね / あたい", strokes: 10, radical: "亻 (orang)",
        meaning: "Harga / Nilai",
        strokeRule: "Orang 亻 di kiri (2 goresan), 直 (lurus: 8 goresan) di kanan.",
        words: [{ word: "値段", reading: "ねだん", meaning: "harga barang" }, { word: "値引き", reading: "ねびき", meaning: "potongan harga" }],
        sentence: "この商品の値段はいくらですか？", sentenceFurigana: "この商(しょう)品(ひん)の値(ね)段(だん)はいくらですか？",
        sentenceId: "Berapa harga barang ini?"
      },
      {
        kanji: "段", on: "ダン", kun: "-", strokes: 9, radical: "殳 (senjata/ketukan)",
        meaning: "Tingkatan / Anak tangga",
        strokeRule: "Sisi kiri berupa 𠂊 dan tiga garis lengkung vertikal, sisi kanan 殳 (4 goresan).",
        words: [{ word: "値段", reading: "ねだん", meaning: "harga" }, { word: "階段", reading: "かいだん", meaning: "tangga" }],
        sentence: "値段を確認してください。", sentenceFurigana: "値(ね)段(だん)を確(かく)認(にん)してください。",
        sentenceId: "Silakan periksa harganya."
      },
      {
        kanji: "親", on: "シン", kun: "おや / した-しい", strokes: 16, radical: "見 (melihat)",
        meaning: "Orang tua / Akrab / Ramah",
        strokeRule: "Berdiri 立 (5 goresan) di atas pohon 木 (4 goresan), melihat 見 di kanan (7 goresan).",
        words: [{ word: "親切（な）", reading: "しんせつ（な）", meaning: "ramah / baik hati" }, { word: "両親", reading: "りょうしん", meaning: "orang tua" }],
        sentence: "店員がとても親切でした。", sentenceFurigana: "店(てん)員(いん)がとても親(しん)切(せつ)でした。",
        sentenceId: "Pelayan tokonya sangat ramah."
      },
      {
        kanji: "価", on: "カ", kun: "あたい", strokes: 8, radical: "亻 (orang)",
        meaning: "Harga / Nilai jual",
        strokeRule: "Orang 亻 di kiri (2 goresan), 賈 bagian atas 西 di kanan (6 goresan).",
        words: [{ word: "価格", reading: "かかく", meaning: "harga" }, { word: "定価", reading: "ていか", meaning: "harga pas" }],
        sentence: "この価格は税別です。", sentenceFurigana: "この価(か)格(かく)は税(ぜい)別(べつ)です。",
        sentenceId: "Harga ini belum termasuk pajak."
      },
      {
        kanji: "格", on: "カク", kun: "-", strokes: 10, radical: "木 (pohon)",
        meaning: "Standar / Status",
        strokeRule: "Pohon 木 di kiri (4 goresan), 各 di kanan (5 goresan: 夂, 口).",
        words: [{ word: "価格", reading: "かかく", meaning: "harga patokan" }, { word: "合格", reading: "ごうかく", meaning: "lulus" }],
        sentence: "お手頃な価格の商品です。", sentenceFurigana: "お手(て)頃(ごろ)な価(か)格(かく)の商(しょう)品(ひん)です。",
        sentenceId: "Barang dengan harga yang terjangkau."
      },
      {
        kanji: "重", on: "ジュウ / チョウ", kun: "おも-い / かさ-なる", strokes: 9, radical: "里 (desa)",
        meaning: "Berat / Bertumpuk",
        strokeRule: "Sapuan atas, garis horizontal panjang, 日 di tengah, garis vertikal lurus menembus, lalu garis dasar.",
        words: [{ word: "重い", reading: "おもい", meaning: "berat" }, { word: "体重", reading: "たいじゅう", meaning: "berat badan" }],
        sentence: "こっちは、ちょっと重いですね。", sentenceFurigana: "こっちは、ちょっと重(おも)いですね。",
        sentenceId: "Yang ini agak berat ya."
      },
      {
        kanji: "軽", on: "ケイ", kun: "かる-い", strokes: 12, radical: "車 (roda)",
        meaning: "Ringan",
        strokeRule: "Roda 車 di kiri (7 goresan), 圣 di kanan (5 goresan: 又, 土).",
        words: [{ word: "軽い", reading: "かるい", meaning: "ringan" }, { word: "手軽（な）", reading: "てがる（な）", meaning: "praktis / mudah" }],
        sentence: "この掃除機、とても軽いですね。", sentenceFurigana: "この掃(そう)除(じ)機(き)、とても軽(かる)いですね。",
        sentenceId: "Penghisap debu ini sangat ringan ya."
      },
      {
        kanji: "消", on: "ショウ", kun: "き-える / け-す", strokes: 10, radical: "氵 (air)",
        meaning: "Hilang / Memadamkan / Konsumsi",
        strokeRule: "Tiga titik air 氵 di kiri (3 goresan), 肖 di kanan (7 goresan: 小, 月).",
        words: [{ word: "消費税", reading: "しょうひぜい", meaning: "pajak konsumsi (PPN)" }, { word: "消す", reading: "けす", meaning: "mematikan (lampu/mesin)" }],
        sentence: "消費税は入っていますか？", sentenceFurigana: "消(しょう)費(ひ)税(ぜい)は入(はい)っていますか？",
        sentenceId: "Apakah sudah termasuk pajak pertambahan nilai (konsumsi)?"
      },
      {
        kanji: "費", on: "ヒ", kun: "つい-やす", strokes: 12, radical: "貝 (uang/kerang)",
        meaning: "Biaya / Pengeluaran",
        strokeRule: "弗 di atas (5 goresan: 弓 dan dua garis vertikal tembus), kerang 貝 di bawah (7 goresan).",
        words: [{ word: "消費税", reading: "しょうひぜい", meaning: "pajak konsumsi" }, { word: "会費", reading: "かいひ", meaning: "iuran keanggotaan" }],
        sentence: "生活費を節約します。", sentenceFurigana: "生(せい)活(かつ)費(ひ)を節(せつ)約(やく)します。",
        sentenceId: "Menghemat biaya hidup."
      },
      {
        kanji: "税", on: "ゼイ", kun: "-", strokes: 12, radical: "禾 (padi)",
        meaning: "Pajak",
        strokeRule: "Padi 禾 di kiri (5 goresan), 兌 di kanan (7 goresan: 八, 兄).",
        words: [{ word: "消費税", reading: "しょうひぜい", meaning: "pajak konsumsi" }, { word: "税別", reading: "ぜいべつ", meaning: "belum termasuk pajak" }],
        sentence: "この価格は税別です。", sentenceFurigana: "この価(か)格(かく)は税(ぜい)別(べつ)です。",
        sentenceId: "Harga ini adalah harga sebelum pajak."
      },
      {
        kanji: "変", on: "ヘン", kun: "か-わる / か-える", strokes: 9, radical: "夂 (kaki)",
        meaning: "Berubah / Mengubah / Aneh",
        strokeRule: "亠 di atas, 糹 disederhanakan (4 goresan), lalu 夂 di bawah (3 goresan).",
        words: [{ word: "変わる", reading: "かわる", meaning: "berubah" }, { word: "大変", reading: "たいへん", meaning: "berat / sangat" }],
        sentence: "ボタンを押すと、エコモードに変わります。", sentenceFurigana: "ボタンを押(お)すと、エコモードに変(か)わります。",
        sentenceId: "Jika menekan tombol ini, akan berubah ke mode hemat daya."
      }
    ],
    readingExercise: [
      { q: "① [店員]がとても親切でした。", a: "てんいん" },
      { q: "② 店員がとても[親切]でした。", a: "しんせつ" },
      { q: "③ このボタンを押すと、エコモードに[変]わります。", a: "か" },
      { q: "④ この掃除機、とても[軽]いですね。", a: "かる" },
      { q: "⑤ こっちは、ちょっと[重]いですね。", a: "おも" },
      { q: "⑥ この[商品]の値段を教えてください。", a: "しょうひん" },
      { q: "⑦ この商品の[値段]はいくらですか？", a: "ねだん" },
      { q: "⑧ [消費税]は入っていますか？", a: "しょうひぜい" },
      { q: "⑨ この[価格]は税別です。", a: "かかく" },
      { q: "⑩ 表示されている価格は[税別]です。", a: "ぜいべつ" }
    ],
    writingExercise: [
      { q: "① ( _________ ) [てんいん] さんに ききました。", a: "店員" },
      { q: "② とても ( _________ ) [しんせつ] に おしえてくれました。", a: "親切" },
      { q: "③ この ( _________ ) [しょうひん] を ください。", a: "商品" },
      { q: "④ この カメラの ( _________ ) [ねだん] は いくらですか？", a: "値段" },
      { q: "⑤ この ( _________ ) [かかく] は ぜいべつです。", a: "価格" },
      { q: "⑥ ( _________ ) [しょうひぜい] は ふくまれていますか？", a: "消費税" },
      { q: "⑦ この そうじきは とても ( _________ ) [かる] いです。", a: "軽" },
      { q: "⑧ この にもつは すこし ( _________ ) [おも] いです。", a: "重" },
      { q: "⑨ ボタンを おすと いろが ( _________ ) [か] わります。", a: "変" },
      { q: "⑩ ひょうじは ( _________ ) [ぜいべつ] です。", a: "税別" }
    ]
  },

  {
    bab: 13,
    titleJp: "第13課 いろいろな資料を展示してあります",
    titleId: "Bab 13: Berbagai Dokumen dan Arsip Dipamerkan",
    topic: "公共の施設 (Fasilitas Umum)",
    kanjiList: [
      {
        kanji: "市", on: "シ", kun: "いち", strokes: 5, radical: "巾 (kain)",
        meaning: "Kota / Pasar",
        strokeRule: "Titik atas, garis horizontal panjang, lalu 巾 di bawah (3 goresan).",
        words: [{ word: "市", reading: "し", meaning: "kota madya" }, { word: "市民", reading: "しみん", meaning: "warga kota" }, { word: "市役所", reading: "しやくしょ", meaning: "kantor wali kota" }],
        sentence: "ここは市の施設なので、安い料金で利用できます。", sentenceFurigana: "ここは市(し)の施(し)設(せつ)なので、安(やす)い料(りょう)金(きん)で利(り)用(よう)できます。",
        sentenceId: "Karena tempat ini fasilitas kota, bisa digunakan dengan tarif murah."
      },
      {
        kanji: "借", on: "シャク", kun: "か-りる", strokes: 10, radical: "亻 (orang)",
        meaning: "Meminjam",
        strokeRule: "Orang 亻 di kiri (2 goresan), 昔 (zaman dulu: 8 goresan) di kanan.",
        words: [{ word: "借りる", reading: "かりる", meaning: "meminjam" }, { word: "借金", reading: "しゃっきん", meaning: "utang" }],
        sentence: "必要な本を図書館で借りました。", sentenceFurigana: "必(ひつ)要(よう)な本(ほん)を図(と)書(しょ)館(かん)で借(か)りました。",
        sentenceId: "Saya meminjam buku yang diperlukan di perpustakaan."
      },
      {
        kanji: "料", on: "リョウ", kun: "-", strokes: 10, radical: "斗 (gantang/takaran)",
        meaning: "Biaya / Bahan",
        strokeRule: "Beras 米 di kiri (6 goresan), 斗 di kanan (4 goresan).",
        words: [{ word: "料金", reading: "りょうきん", meaning: "tarif / biaya" }, { word: "無料", reading: "むりょう", meaning: "gratis" }, { word: "料理", reading: "りょうり", meaning: "masakan" }],
        sentence: "安い料金で利用できます。", sentenceFurigana: "安(やす)い料(りょう)金(きん)で利(り)用(よう)できます。",
        sentenceId: "Dapat digunakan dengan biaya murah."
      },
      {
        kanji: "金", on: "キン / コン", kun: "かね / かな", strokes: 8, radical: "金 (emas/logam)",
        meaning: "Uang / Biaya / Emas",
        strokeRule: "Atap 人 di atas (2 goresan), garis horizontal, dua titik kiri kanan, garis horizontal dasar panjang, vertikal tengah.",
        words: [{ word: "料金", reading: "りょうきん", meaning: "biaya" }, { word: "お金", reading: "おかね", meaning: "uang" }, { word: "金曜日", reading: "きんようび", meaning: "hari Jumat" }],
        sentence: "利用料金はいくらですか？", sentenceFurigana: "利(り)用(よう)料(りょう)金(きん)はいくらですか？",
        sentenceId: "Berapa biaya pemakaiannya?"
      },
      {
        kanji: "返", on: "ヘン", kun: "かえ-す / かえ-る", strokes: 7, radical: "辶 (jalan)",
        meaning: "Mengembalikan / Membalas",
        strokeRule: "反 di dalam (4 goresan), lalu radikal jalan 辶 di luar (3 goresan).",
        words: [{ word: "返す", reading: "かえす", meaning: "mengembalikan" }, { word: "返事", reading: "へんじ", meaning: "jawaban / balasan" }],
        sentence: "本は来週返します。", sentenceFurigana: "本(ほん)は来(らい)週(しゅう)返(かえ)します。",
        sentenceId: "Buku akan saya kembalikan minggu depan."
      },
      {
        kanji: "図", on: "ズ / ト", kun: "はか-る", strokes: 7, radical: "囗 (bingkai)",
        meaning: "Gambar / Peta / Denah",
        strokeRule: "Bingkai luar tiga sisi 冂, di dalam terdapat 丶 dan garis silang 乂, lalu garis penutup bawah.",
        words: [{ word: "図書館", reading: "としょかん", meaning: "perpustakaan" }, { word: "地図", reading: "ちず", meaning: "peta" }],
        sentence: "図書館で本を借りました。", sentenceFurigana: "図(と)書(しょ)館(かん)で本(ほん)を借(か)りました。",
        sentenceId: "Meminjam buku di perpustakaan."
      },
      {
        kanji: "書", on: "ショ", kun: "か-く", strokes: 10, radical: "曰 (bicara)",
        meaning: "Menulis / Buku / Dokumen",
        strokeRule: "聿 bagian atas (6 goresan: empat horizontal bertingkat dan vertikal tengah), lalu 曰 di bawah (4 goresan).",
        words: [{ word: "図書館", reading: "としょかん", meaning: "perpustakaan" }, { word: "書く", reading: "かく", meaning: "menulis" }, { word: "書類", reading: "しょるい", meaning: "berkas dokumen" }],
        sentence: "必要な本を図書館で借りました。", sentenceFurigana: "必(ひつ)要(よう)な本(ほん)を図(と)書(しょ)館(かん)で借(か)りました。",
        sentenceId: "Saya meminjam buku yang dibutuhkan di perpustakaan."
      },
      {
        kanji: "閉", on: "ヘイ", kun: "し-まる / し-める / と-じる", strokes: 11, radical: "門 (pintu gerbang)",
        meaning: "Tutup / Menutup",
        strokeRule: "Pintu 門 di luar (8 goresan), 才 di dalam (3 goresan).",
        words: [{ word: "閉まる", reading: "しまる", meaning: "tutup (intransitif)" }, { word: "閉める", reading: "しめる", meaning: "menutup (transitif)" }],
        sentence: "ジムは夜8時に閉まります。", sentenceFurigana: "ジムは夜(よる)8時(じ)に閉(し)まります。",
        sentenceId: "Pusat kebugaran tutup jam 8 malam."
      },
      {
        kanji: "具", on: "グ", kun: "-", strokes: 8, radical: "八 (delapan)",
        meaning: "Alat / Perlengkapan",
        strokeRule: "Kotak 目 di atas (5 goresan), 一 di tengah, dan dua kaki 八 di bawah.",
        words: [{ word: "道具", reading: "どうぐ", meaning: "alat / perkakas" }, { word: "家具", reading: "かぐ", meaning: "mebel / perabot" }],
        sentence: "昔の道具がたくさん展示してあります。", sentenceFurigana: "昔(むかし)の道(どう)具(ぐ)がたくさん展(てん)示(じ)してあります。",
        sentenceId: "Banyak perkakas zaman dulu dipamerkan."
      },
      {
        kanji: "点", on: "テン", kun: "-", strokes: 9, radical: "灬 (renga/titik)",
        meaning: "Poin / Butir / Titik",
        strokeRule: "占 di atas (5 goresan: 卜, 口), empat titik api 灬 di bawah (4 goresan).",
        words: [{ word: "～点", reading: "てん", meaning: "buah / item (satuan buku/barang)" }, { word: "交差点", reading: "こうさてん", meaning: "perempatan" }],
        sentence: "本は一人5点まで借りられます。", sentenceFurigana: "本(ほん)は一(ひと)人(り)5点(てん)まで借(か)りられます。",
        sentenceId: "Buku bisa dipinjam sampai 5 buah per orang."
      },
      {
        kanji: "利", on: "リ", kun: "き-く", strokes: 7, radical: "刂 (pisau)",
        meaning: "Manfaat / Keuntungan",
        strokeRule: "Padi 禾 di kiri (5 goresan), pisau 刂 di kanan (2 goresan).",
        words: [{ word: "利用する", reading: "りようする", meaning: "menggunakan / memanfaatkan" }, { word: "便利（な）", reading: "べんり（な）", meaning: "praktis" }],
        sentence: "だれでも自由に利用できます。", sentenceFurigana: "だれでも自(じ)由(ゆう)に利(り)用(よう)できます。",
        sentenceId: "Siapa saja dapat memanfaatkannya dengan bebas."
      },
      {
        kanji: "用", on: "ヨウ", kun: "もち-いる", strokes: 5, radical: "用 (guna)",
        meaning: "Penggunaan / Keperluan",
        strokeRule: "冂 garis luar (2 goresan), dua horizontal di dalam, dan vertikal tegak lurus menembus.",
        words: [{ word: "利用する", reading: "りようする", meaning: "menggunakan" }, { word: "用事", reading: "ようじ", meaning: "urusan / keperluan" }],
        sentence: "安い料金で利用できます。", sentenceFurigana: "安(やす)い料(りょう)金(きん)で利(り)用(よう)できます。",
        sentenceId: "Dapat digunakan dengan tarif yang terjangkau."
      },
      {
        kanji: "必", on: "ヒツ", kun: "かなら-ず", strokes: 5, radical: "心 (hati)",
        meaning: "Pasti / Harus",
        strokeRule: "Garis miring kiri pertama, garis lengkung kait tengah, titik kiri atas, garis vertikal miring menembus, dan titik kanan.",
        words: [{ word: "必要（な）", reading: "ひつような", meaning: "perlu / dibutuhkan" }, { word: "必ず", reading: "かならず", meaning: "pasti / tanpa gagal" }],
        sentence: "必要な本を図書館で借りました。", sentenceFurigana: "必(ひつ)要(よう)な本(ほん)を図(と)書(しょ)館(かん)で借(か)りました。",
        sentenceId: "Saya meminjam buku yang dibutuhkan di perpustakaan."
      },
      {
        kanji: "要", on: "ヨウ", kun: "い-る", strokes: 9, radical: "覀 (tutup)",
        meaning: "Perlu / Pokok / Penting",
        strokeRule: "覀 di atas (6 goresan), wanita 女 di bawah (3 goresan).",
        words: [{ word: "必要（な）", reading: "ひつような", meaning: "perlu / penting" }, { word: "重要（な）", reading: "じゅうような", meaning: "sangat penting" }],
        sentence: "利用カードを作るには、身分証明書が必要です。", sentenceFurigana: "利(り)用(よう)カードを作(つく)るには、身(み)分(ぶん)証(しょう)明(めい)書(しょ)が必(ひつ)要(よう)です。",
        sentenceId: "Untuk membuat kartu anggota, diperlukan kartu identitas."
      }
    ],
    readingExercise: [
      { q: "① ここは[市]の施設です。", a: "し" },
      { q: "② 安い[料金]で利用できます。", a: "りょうきん" },
      { q: "③ 必要な本を[図書館]で借りました。", a: "としょかん" },
      { q: "④ [必要]な書類を準備しました。", a: "ひつよう" },
      { q: "⑤ 昔の[道具]がたくさん展示してあります。", a: "どうぐ" },
      { q: "⑥ ジムはまだ[開]いていますか？", a: "あ" },
      { q: "⑦ 夜8時に[閉]まります。", a: "し" },
      { q: "⑧ 本を5[点]まで借りました。", a: "てん" },
      { q: "⑨ 図書館で本を[借]りることができます。", a: "か" },
      { q: "⑩ 市民は無料で施設を[利用]できます。", a: "りよう" }
    ],
    writingExercise: [
      { q: "① ( _________ ) [し] の しせつを りようします。", a: "市" },
      { q: "② やすい ( _________ ) [りょうきん] で つかえます。", a: "料金" },
      { q: "③ ( _________ ) [としょかん] で ほんを さがします。", a: "図書館" },
      { q: "④ ( _________ ) [ひつよう] な しょるいを かくにんします。", a: "必要" },
      { q: "⑤ むかしの ( _________ ) [どうぐ] を みました。", a: "道具" },
      { q: "⑥ ドアが ( _________ ) [あ] いています。", a: "開" },
      { q: "⑦ ８じに ( _________ ) [し] まります。", a: "閉" },
      { q: "⑧ ほんを ( _________ ) [か] りました。", a: "借" },
      { q: "⑨ らいしゅう ほんを ( _________ ) [かえ] します。", a: "返" },
      { q: "⑩ だれでも ( _________ ) [りよう] できます。", a: "利用" }
    ]
  },

  {
    bab: 14,
    titleJp: "第14課 外国からの観光客のための情報がたくさんあります",
    titleId: "Bab 14: Banyak Informasi untuk Turis Asing",
    topic: "公共の施設 (Fasilitas Umum)",
    kanjiList: [
      {
        kanji: "外", on: "ガイ / ゲ", kun: "そと / ほか / はず-す", strokes: 5, radical: "夕 (sore)",
        meaning: "Luar / Asing",
        strokeRule: "Sore 夕 di kiri (3 goresan), 卜 di kanan (2 goresan).",
        words: [{ word: "外国", reading: "がいこく", meaning: "luar negeri" }, { word: "外国人", reading: "がいこくじん", meaning: "orang asing" }],
        sentence: "外国からの観光客のための情報がたくさんあります。", sentenceFurigana: "外(がい)国(こく)からの観(かん)光(こう)客(きゃく)のための情(じょう)報(ほう)がたくさんあります。",
        sentenceId: "Terdapat banyak informasi bagi wisatawan mancanegara."
      },
      {
        kanji: "郵", on: "ユウ", kun: "-", strokes: 11, radical: "阝 (wilayah)",
        meaning: "Pos",
        strokeRule: "垂 bagian kiri (8 goresan: 千 dan dua garis horizontal serta vertikal), telinga kanan 阝 (3 goresan).",
        words: [{ word: "郵便局", reading: "ゆうびんきょく", meaning: "kantor pos" }, { word: "郵便", reading: "ゆうびん", meaning: "layanan pos" }],
        sentence: "この近所に郵便局がありますか？", sentenceFurigana: "この近(きん)所(じょ)に郵(ゆう)便(びん)局(きょく)がありますか？",
        sentenceId: "Apakah di dekat sini ada kantor pos?"
      },
      {
        kanji: "局", on: "キョク", kun: "-", strokes: 7, radical: "尸 (atap pelindung)",
        meaning: "Kantor / Biro / Bagian",
        strokeRule: "尸 di atas (3 goresan), garis horizontal lengkung dan mulut 口 di bawah.",
        words: [{ word: "郵便局", reading: "ゆうびんきょく", meaning: "kantor pos" }, { word: "薬局", reading: "やっきょく", meaning: "apotek" }],
        sentence: "郵便局へ手紙を出しに行きます。", sentenceFurigana: "郵(ゆう)便(びん)局(きょく)へ手(て)紙(がみ)を出(だ)しに行(い)きます。",
        sentenceId: "Pergi ke kantor pos untuk mengirim surat."
      },
      {
        kanji: "情", on: "ジョウ / セイ", kun: "なさ-け", strokes: 11, radical: "忄 (hati)",
        meaning: "Informasi / Keadaan / Perasaan",
        strokeRule: "Hati 忄 di kiri (3 goresan), biru 青 di kanan (8 goresan).",
        words: [{ word: "情報", reading: "じょうほう", meaning: "informasi" }],
        sentence: "観光客のための情報がたくさんあります。", sentenceFurigana: "観(かん)光(こう)客(きゃく)のための情(じょう)報(ほう)がたくさんあります。",
        sentenceId: "Ada banyak informasi untuk turis."
      },
      {
        kanji: "報", on: "ホウ", kun: "むく-いる", strokes: 12, radical: "土 (tanah)",
        meaning: "Laporan / Kabar / Warta",
        strokeRule: "幸 variasi di kiri (7 goresan), 卩 dan 又 di kanan (5 goresan).",
        words: [{ word: "情報", reading: "じょうほう", meaning: "informasi" }, { word: "天気予報", reading: "てんきよほう", meaning: "ramalan cuaca" }],
        sentence: "ネットで最新の情報を調べます。", sentenceFurigana: "ネットで最(さい)新(しん)の情(じょう)報(ほう)を調(しら)べます。",
        sentenceId: "Mencari informasi terbaru di internet."
      },
      {
        kanji: "近", on: "キン", kun: "ちか-い", strokes: 7, radical: "辶 (jalan)",
        meaning: "Dekat",
        strokeRule: "Kapak 斤 di dalam (4 goresan), radikal jalan 辶 di luar (3 goresan).",
        words: [{ word: "近所", reading: "きんじょ", meaning: "lingkungan tetangga / dekat rumah" }, { word: "近い", reading: "ちかい", meaning: "dekat" }, { word: "最近", reading: "さいきん", meaning: "akhir-akhir ini" }],
        sentence: "この近所に郵便局がありますか？", sentenceFurigana: "この近(きん)所(じょ)に郵(ゆう)便(びん)局(きょく)がありますか？",
        sentenceId: "Apakah di sekitar sini ada kantor pos?"
      },
      {
        kanji: "所", on: "ショ", kun: "ところ", strokes: 8, radical: "戸 (pintu)",
        meaning: "Tempat",
        strokeRule: "Pintu 戸 di kiri (4 goresan), kapak 斤 di kanan (4 goresan).",
        words: [{ word: "近所", reading: "きんじょ", meaning: "lingkungan dekat" }, { word: "場所", reading: "ばしょ", meaning: "tempat" }, { word: "市役所", reading: "しやくしょ", meaning: "kantor wali kota" }],
        sentence: "近所の人にあいさつをしました。", sentenceFurigana: "近(きん)所(じょ)の人(ひと)にあいさつをしました。",
        sentenceId: "Menyapa tetangga di sekitar tempat tinggal."
      },
      {
        kanji: "相", on: "ソウ / ショウ", kun: "あい", strokes: 9, radical: "目 (mata)",
        meaning: "Saling / Konsultasi / Wujud",
        strokeRule: "Pohon 木 di kiri (4 goresan), mata 目 di kanan (5 goresan).",
        words: [{ word: "相談する", reading: "そうだんする", meaning: "berkonsultasi / berdiskusi" }, { word: "相手", reading: "あいて", meaning: "lawan bicara / pasangan" }],
        sentence: "困ったときは窓口で相談してください。", sentenceFurigana: "困(こま)ったときは窓(まど)口(ぐち)で相(そう)談(だん)してください。",
        sentenceId: "Jika ada kesulitan, silakan berkonsultasi di loket."
      },
      {
        kanji: "談", on: "ダン", kun: "-", strokes: 15, radical: "言 (kata)",
        meaning: "Bicara / Percakapan",
        strokeRule: "Kata 言 di kiri (7 goresan), dua api 炎 di kanan (8 goresan: 火 atas, 火 bawah).",
        words: [{ word: "相談する", reading: "そうだんする", meaning: "berkonsultasi" }, { word: "会談", reading: "かいだん", meaning: "pertemuan resmi" }],
        sentence: "市役所で生活の相談ができます。", sentenceFurigana: "市(し)役(やく)所(しょ)で生(せい)活(かつ)の相(そう)談(だん)ができます。",
        sentenceId: "Bisa berkonsultasi mengenai kehidupan sehari-hari di kantor pemerintah."
      },
      {
        kanji: "質", on: "シツ / シチ", kun: "たち", strokes: 15, radical: "貝 (uang/kerang)",
        meaning: "Pertanyaan / Kualitas",
        strokeRule: "Dua kapak 斤 di atas (8 goresan), kerang 貝 di bawah (7 goresan).",
        words: [{ word: "質問", reading: "しつもん", meaning: "pertanyaan" }, { word: "品質", reading: "ひんしつ", meaning: "kualitas barang" }],
        sentence: "ここに質問を入力してください。", sentenceFurigana: "ここに質(しつ)問(もん)を入(にゅう)力(りょく)してください。",
        sentenceId: "Silakan masukkan pertanyaan Anda di sini."
      },
      {
        kanji: "問", on: "モン", kun: "と-う", strokes: 11, radical: "口 (mulut)",
        meaning: "Bertanya / Masalah",
        strokeRule: "Pintu gerbang 門 di luar (8 goresan), mulut 口 di dalam (3 goresan).",
        words: [{ word: "質問", reading: "しつもん", meaning: "pertanyaan" }, { word: "問題", reading: "もんだい", meaning: "masalah / soal ujian" }],
        sentence: "質問があれば聞いてください。", sentenceFurigana: "質(しつ)問(もん)があれば聞(き)いてください。",
        sentenceId: "Jika ada pertanyaan, silakan bertanya."
      },
      {
        kanji: "窓", on: "ソウ", kun: "まど", strokes: 11, radical: "穴 (atap lubang)",
        meaning: "Jendela / Loket",
        strokeRule: "Atap lubang 穴 di atas (5 goresan), 厶 di tengah, hati 心 di bawah.",
        words: [{ word: "窓口", reading: "まどぐち", meaning: "loket pelayanan" }, { word: "窓", reading: "まど", meaning: "jendela" }],
        sentence: "1番の窓口に行ってください。", sentenceFurigana: "1番(ばん)の窓(まど)口(ぐち)に行(い)ってください。",
        sentenceId: "Silakan pergi ke loket nomor 1."
      },
      {
        kanji: "口", on: "コウ / ク", kun: "くち", strokes: 3, radical: "口 (mulut)",
        meaning: "Mulut / Pintu keluar-masuk / Loket",
        strokeRule: "Garis vertikal kiri, horizontal belok bawah, lalu garis horizontal penutup.",
        words: [{ word: "窓口", reading: "まどぐち", meaning: "loket" }, { word: "入口", reading: "いりぐち", meaning: "pintu masuk" }, { word: "出口", reading: "でぐち", meaning: "pintu keluar" }],
        sentence: "相談窓口はこちらです。", sentenceFurigana: "相(そう)談(だん)窓(まど)口(ぐち)はこちらです。",
        sentenceId: "Loket konsultasi ada di sebelah sini."
      },
      {
        kanji: "力", on: "リョク / リキ", kun: "ちから", strokes: 2, radical: "力 (tenaga)",
        meaning: "Kekuatan / Tenaga / Daya",
        strokeRule: "Garis horizontal belok kait ke kiri bawah, sapuan miring kiri kedua membelah.",
        words: [{ word: "入力する", reading: "にゅうりょくする", meaning: "memasukkan input data" }, { word: "力", reading: "ちから", meaning: "tenaga" }],
        sentence: "ここに質問を入力してください。", sentenceFurigana: "ここに質(しつ)問(もん)を入(にゅう)力(りょく)してください。",
        sentenceId: "Tolong ketik/masukkan pertanyaan di sini."
      }
    ],
    readingExercise: [
      { q: "① [外国]からの観光客が多いです。", a: "がいこく" },
      { q: "② この近所に[郵便局]がありますか？", a: "ゆうびんきょく" },
      { q: "③ 観光客のための[情報]がたくさんあります。", a: "じょうほう" },
      { q: "④ この[近所]にスーパーはありますか？", a: "きんじょ" },
      { q: "⑤ 市役所で生活の[相談]ができます。", a: "そうだん" },
      { q: "⑥ 答えが[自動]で画面に出ます。", a: "じどう" },
      { q: "⑦ ここに[質問]を書いてください。", a: "しつもん" },
      { q: "⑧ カットの前に、髪を[洗]います。", a: "あら" },
      { q: "⑨ 1番の[窓口]に行ってください。", a: "まどぐち" },
      { q: "⑩ キーボードで文字を[入力]します。", a: "にゅうりょく" }
    ],
    writingExercise: [
      { q: "① ( _________ ) [がいこく] からの おきゃくさんです。", a: "外国" },
      { q: "② ちかくに ( _________ ) [ゆうびんきょく] が ありますか？", a: "郵便局" },
      { q: "③ やくだつ ( _________ ) [じょうほう] を あつめます。", a: "情報" },
      { q: "④ この ( _________ ) [きんじょ] は しずかです。", a: "近所" },
      { q: "⑤ こまったときは ( _________ ) [そうだん] してください。", a: "相談" },
      { q: "⑥ ドアが ( _________ ) [じどう] で ひらきます。", a: "自動" },
      { q: "⑦ わからないときは ( _________ ) [しつもん] します。", a: "質問" },
      { q: "⑧ てと かおを ( _________ ) [あら] います。", a: "洗" },
      { q: "⑨ うけつけの ( _________ ) [まどぐち] は こちらです。", a: "窓口" },
      { q: "⑩ なまえを ( _________ ) [にゅうりょく] してください。", a: "入力" }
    ]
  },

  {
    bab: 15,
    titleJp: "第15課 水がもったいないですよ",
    titleId: "Bab 15: Airnya Mubazir Kalau Dibiarkan Terus Mengalir",
    topic: "自然と環境 (Alam dan Lingkungan)",
    kanjiList: [
      {
        kanji: "節", on: "セツ", kun: "ふし", strokes: 13, radical: "竹 (bambu)",
        meaning: "Menghemat / Ruas buku",
        strokeRule: "Bambu 竹 di atas (6 goresan), 即 di bawah (7 goresan: 艮 dan 卩).",
        words: [{ word: "節電", reading: "せつでん", meaning: "hemat listrik" }, { word: "節水", reading: "せっすい", meaning: "hemat air" }, { word: "節約", reading: "せつやく", meaning: "penghematan" }],
        sentence: "部屋を出るときは節電しましょう。", sentenceFurigana: "部(へ)屋(や)を出(で)るときは節(せつ)電(でん)しましょう。",
        sentenceId: "Mari hemat listrik saat keluar ruangan."
      },
      {
        kanji: "電", on: "デン", kun: "-", strokes: 13, radical: "雨 (hujan)",
        meaning: "Listrik",
        strokeRule: "Hujan 雨 di atas (8 goresan), 申 yang meliuk ekornya 乚 di bawah (5 goresan).",
        words: [{ word: "節電", reading: "せつでん", meaning: "hemat listrik" }, { word: "電気", reading: "でんき", meaning: "listrik / lampu" }, { word: "電話", reading: "でんわ", meaning: "telepon" }],
        sentence: "使わない電気はこまめに消します。", sentenceFurigana: "使(つか)わない電(でん)気(き)はこまめに消(け)します。",
        sentenceId: "Mematikan lampu/listrik yang tidak digunakan."
      },
      {
        kanji: "減", on: "ゲン", kun: "へ-らす / へ-る", strokes: 12, radical: "氵 (air)",
        meaning: "Mengurangi / Berkurang",
        strokeRule: "Tiga titik air 氵 di kiri (3 goresan), 咸 di kanan (9 goresan: 厂, 一, 口, 戈).",
        words: [{ word: "減らす", reading: "へらす", meaning: "mengurangi" }, { word: "減る", reading: "へる", meaning: "berkurang" }],
        sentence: "ごみの量をできるだけ減らしましょう。", sentenceFurigana: "ごみの量(りょう)をできるだけ減(へ)らしましょう。",
        sentenceId: "Mari kurangi jumlah sampah sebanyak mungkin."
      },
      {
        kanji: "下", on: "カ / ゲ", kun: "さ-げる / さ-がる / した", strokes: 3, radical: "一 (satu)",
        meaning: "Bawah / Menurunkan",
        strokeRule: "Garis horizontal atas, garis vertikal tengah lurus ke bawah, lalu titik diagonal pendek kanan.",
        words: [{ word: "下げる", reading: "さげる", meaning: "menurunkan" }, { word: "下", reading: "した", meaning: "bawah" }, { word: "地下", reading: "ちか", meaning: "bawah tanah" }],
        sentence: "エアコンの設定温度を少し下げます。", sentenceFurigana: "エアコンの設(せっ)定(てい)温(おん)度(ど)を少(すこ)し下(さ)げます。",
        sentenceId: "Menurunkan sedikit setelan suhu pendingin ruangan."
      },
      {
        kanji: "洗", on: "セン", kun: "あら-う", strokes: 9, radical: "氵 (air)",
        meaning: "Mencuci / Membersihkan",
        strokeRule: "Tiga titik air 氵 di kiri (3 goresan), 先 di kanan (6 goresan: 𠂉, 一, 儿).",
        words: [{ word: "洗剤", reading: "せんざい", meaning: "detergen / sabun cuci" }, { word: "洗う", reading: "あらう", meaning: "mencuci" }],
        sentence: "洗剤を使いすぎないように気をつけています。", sentenceFurigana: "洗(せん)剤(ざい)を使(つか)いすぎないように気(き)をつけています。",
        sentenceId: "Berhati-hati agar tidak menggunakan detergen secara berlebihan."
      },
      {
        kanji: "止", on: "シ", kun: "と-める / と-まる", strokes: 4, radical: "止 (berhenti)",
        meaning: "Mematikan / Berhenti",
        strokeRule: "Vertikal lurus tengah, horizontal pendek, vertikal kiri pendek, horizontal dasar.",
        words: [{ word: "止める", reading: "とめる", meaning: "menghentikan / mematikan" }, { word: "止まる", reading: "とまる", meaning: "berhenti" }],
        sentence: "歯をみがくときは水を止めましょう。", sentenceFurigana: "歯(は)をみがくときは水(みず)を止(と)めましょう。",
        sentenceId: "Tutuplah keran air saat menyikat gigi."
      },
      {
        kanji: "持", on: "ジ", kun: "も-つ", strokes: 9, radical: "扌 (tangan)",
        meaning: "Membawa / Memegang",
        strokeRule: "Tangan 扌 di kiri (3 goresan), kuil 寺 di kanan (6 goresan: 土, 寸).",
        words: [{ word: "持ち歩く", reading: "もちあるく", meaning: "membawa bepergian" }, { word: "持つ", reading: "もつ", meaning: "memegang / memiliki" }],
        sentence: "マイボトルを持ち歩いています。", sentenceFurigana: "マイボトルを持(も)ち歩(ある)いています。",
        sentenceId: "Saya selalu membawa botol minum pribadi ke mana-mana."
      },
      {
        kanji: "歩", on: "ホ / ブ", kun: "ある-く / あゆ-む", strokes: 8, radical: "止 (berhenti)",
        meaning: "Berjalan kaki",
        strokeRule: "止 di atas (4 goresan), 少 variasi di bawah (4 goresan).",
        words: [{ word: "持ち歩く", reading: "もちあるく", meaning: "membawa jalan" }, { word: "歩く", reading: "あるく", meaning: "berjalan kaki" }, { word: "散歩", reading: "さんぽ", meaning: "jalan-jalan santai" }],
        sentence: "毎日歩いて通勤しています。", sentenceFurigana: "毎(まい)日(にち)歩(ある)いて通(つう)勤(きん)しています。",
        sentenceId: "Setiap hari berangkat kerja dengan berjalan kaki."
      },
      {
        kanji: "分", on: "ブン / フン", kun: "わ-ける / わ-かる", strokes: 4, radical: "刀 (pisau)",
        meaning: "Memilah / Bagian / Menit",
        strokeRule: "Delapan 八 di atas (2 goresan), pisau 刀 di bawah (2 goresan).",
        words: [{ word: "分け方", reading: "わけかた", meaning: "cara memilah" }, { word: "分別", reading: "ぶんべつ", meaning: "pemilahan sampah" }, { word: "半分", reading: "はんぶん", meaning: "setengah" }],
        sentence: "ごみの分け方を教えてください。", sentenceFurigana: "ごみの分(わ)け方(かた)を教(おし)えてください。",
        sentenceId: "Tolong ajari saya cara memilah sampah."
      }
    ],
    readingExercise: [
      { q: "① 部屋を出るときは[節電]しましょう。", a: "せつでん" },
      { q: "② 水を出しっぱなしにするのは、[水]がもったいないです。", a: "みず" },
      { q: "③ 使わない[電気]はこまめに消します。", a: "でんき" },
      { q: "④ 裏が白い[紙]をメモ用紙に使います。", a: "かみ" },
      { q: "⑤ ごみの量をできるだけ[減]らします。", a: "へ" },
      { q: "⑥ エアコンの設定温度を少し[下]げます。", a: "さ" },
      { q: "⑦ 食器用の[洗剤]を使いすぎないでください。", a: "せんざい" },
      { q: "⑧ 水をこまめに[止]めましょう。", a: "と" },
      { q: "⑨ マイボトルをいつも[持]ち歩いています。", a: "も" },
      { q: "⑩ 駅まで毎日[歩]いて行きます。", a: "ある" }
    ],
    writingExercise: [
      { q: "① つかわないときは ( _________ ) [せつでん] します。", a: "節電" },
      { q: "② つめたい ( _________ ) [みず] を のみます。", a: "水" },
      { q: "③ つかわない ( _________ ) [でんき] を けします。", a: "電気" },
      { q: "④ メモようの ( _________ ) [かみ] です。", a: "紙" },
      { q: "⑤ ごみを ( _________ ) [へ] らしましょう。", a: "減" },
      { q: "⑥ おんどを すこし ( _________ ) [さ] げてください。", a: "下" },
      { q: "⑦ しょっきを ( _________ ) [あら] います。", a: "洗" },
      { q: "⑧ みずを ( _________ ) [と] めてください。", a: "止" },
      { q: "⑨ マイバッグを ( _________ ) [も] ちあるきます。", a: "持" },
      { q: "⑩ まいにち えきまで ( _________ ) [ある] きます。", a: "歩" }
    ]
  },

  {
    bab: 16,
    titleJp: "第16課 地震が来ても、あわてて動かないでください",
    titleId: "Bab 16: Meskipun Terjadi Gempa, Tolong Jangan Panik",
    topic: "自然と環境 / 防災 (Alam dan Mitigasi Bencana)",
    kanjiList: [
      {
        kanji: "災", on: "サイ", kun: "わざわ-い", strokes: 7, radical: "火 (api)",
        meaning: "Bencana",
        strokeRule: "Tiga garis aliran sungai 巛 di atas (3 goresan), api 火 di bawah (4 goresan).",
        words: [{ word: "災害", reading: "さいがい", meaning: "bencana alam" }, { word: "火災", reading: "かさい", meaning: "musibah kebakaran" }],
        sentence: "自然災害に備えて非常持ち出し袋を準備します。", sentenceFurigana: "自(し)然(ぜん)災(さい)害(がい)に備(そな)えて非(ひ)常(じょう)持(も)ち出(だ)し袋(ぶくろ)を準(じゅん)備(び)します。",
        sentenceId: "Menyiapkan tas siaga darurat untuk menghadapi bencana alam."
      },
      {
        kanji: "害", on: "ガイ", kun: "-", strokes: 10, radical: "宀 (atap)",
        meaning: "Dampak buruk / Kerusakan",
        strokeRule: "Atap 宀 di atas (3 goresan), 三 garis horizontal pendek di tengah, mulut 口 di bawah.",
        words: [{ word: "災害", reading: "さいがい", meaning: "bencana" }, { word: "被害", reading: "ひがい", meaning: "kerusakan / korban bencana" }],
        sentence: "災害時の避難場所を確認してください。", sentenceFurigana: "災(さい)害(がい)時(じ)の避(ひ)難(なん)場(ば)所(しょ)を確(かく)認(にん)してください。",
        sentenceId: "Pastikan lokasi evakuasi saat terjadi bencana."
      },
      {
        kanji: "台", on: "タイ / ダイ", kun: "-", strokes: 5, radical: "口 (mulut)",
        meaning: "Topan / Panggung / Unit",
        strokeRule: "厶 di atas (2 goresan), kotak 口 di bawah (3 goresan).",
        words: [{ word: "台風", reading: "たいふう", meaning: "angin topan / taifun" }, { word: "～台", reading: "だい", meaning: "unit (mesin/kendaraan)" }],
        sentence: "大きい台風が近づいています。", sentenceFurigana: "大(おお)きい台(たい)風(ふう)が近(ちか)づいています。",
        sentenceId: "Angin topan berkekuatan besar sedang mendekat."
      },
      {
        kanji: "風", on: "フウ / フ", kun: "かぜ", strokes: 9, radical: "風 (angin)",
        meaning: "Angin",
        strokeRule: "Bingkai luar 几 melengkung (2 goresan), sapuan miring kiri, ulat 虫 di dalam (6 goresan).",
        words: [{ word: "台風", reading: "たいふう", meaning: "angin topan" }, { word: "風", reading: "かぜ", meaning: "angin" }],
        sentence: "台風で強い風が吹いています。", sentenceFurigana: "台(たい)風(ふう)で強(つよ)い風(かぜ)が吹(ふ)いています。",
        sentenceId: "Karena topan, angin kencang sedang bertiup."
      },
      {
        kanji: "震", on: "シン", kun: "ふる-える", strokes: 15, radical: "雨 (hujan)",
        meaning: "Guncang / Gempa",
        strokeRule: "Hujan 雨 di atas (8 goresan), 辰 (naga: 7 goresan) di bawah.",
        words: [{ word: "地震", reading: "じしん", meaning: "gempa bumi" }, { word: "震度", reading: "しんど", meaning: "skala intensitas gempa" }],
        sentence: "大きな地震が起こりました。", sentenceFurigana: "大(おお)きな地(じ)震(しん)が起(お)こりました。",
        sentenceId: "Telah terjadi gempa bumi besar."
      },
      {
        kanji: "火", on: "カ", kun: "ひ / ほ", strokes: 4, radical: "火 (api)",
        meaning: "Api / Kebakaran",
        strokeRule: "Dua titik samping kiri dan kanan atas, sapuan miring kiri, sapuan kanan membelah.",
        words: [{ word: "火事", reading: "かじ", meaning: "kebakaran" }, { word: "火災", reading: "かさい", meaning: "bencana kebakaran" }, { word: "火曜日", reading: "かようび", meaning: "hari Selasa" }],
        sentence: "地震のあとは火事に気をつけてください。", sentenceFurigana: "地(じ)震(しん)のあとは火(か)事(じ)に気(き)をつけてください。",
        sentenceId: "Setelah gempa bumi, berhati-hatilah terhadap bahaya kebakaran."
      },
      {
        kanji: "雪", on: "セツ", kun: "ゆき", strokes: 11, radical: "雨 (hujan)",
        meaning: "Salju",
        strokeRule: "Hujan 雨 di atas (8 goresan), 彐 di bawah (3 goresan).",
        words: [{ word: "大雪", reading: "おおゆき", meaning: "salju lebat" }, { word: "雪", reading: "ゆき", meaning: "salju" }],
        sentence: "大雪で電車が止まりました。", sentenceFurigana: "大(おお)雪(ゆき)で電(でん)車(しゃ)が止(と)まりました。",
        sentenceId: "Kereta terhenti karena hujan salju lebat."
      },
      {
        kanji: "波", on: "ハ", kun: "なみ", strokes: 8, radical: "氵 (air)",
        meaning: "Gelombang / Ombak",
        strokeRule: "Tiga titik air 氵 di kiri (3 goresan), kulit 皮 di kanan (5 goresan).",
        words: [{ word: "津波", reading: "つなみ", meaning: "tsunami / gelombang pasang" }, { word: "波", reading: "なみ", meaning: "ombak" }],
        sentence: "海岸に津波警報が出ました。", sentenceFurigana: "海(かい)岸(がん)に津(つ)波(なみ)警(けい)報(ほう)が出(で)ました。",
        sentenceId: "Peringatan tsunami telah dikeluarkan untuk wilayah pesisir pantai."
      },
      {
        kanji: "起", on: "キ", kun: "お-こる / お-きる", strokes: 10, radical: "走 (lari)",
        meaning: "Terjadi / Bangun",
        strokeRule: "Lari 走 di kiri bawah (7 goresan), 已 di kanan atas (3 goresan).",
        words: [{ word: "起こる", reading: "おこる", meaning: "terjadi" }, { word: "起きる", reading: "おきる", meaning: "bangun" }],
        sentence: "もし地震が起こったら、あわてないでください。", sentenceFurigana: "もし地(じ)震(しん)が起(お)こったら、あわてないでください。",
        sentenceId: "Jika terjadi gempa bumi, tolong jangan panik."
      },
      {
        kanji: "避", on: "ヒ", kun: "さ-ける", strokes: 16, radical: "辶 (jalan)",
        meaning: "Menghindar / Mengungsi",
        strokeRule: "辟 di dalam (13 goresan: 尸, 口, 辛), radikal jalan 辶 di luar (3 goresan).",
        words: [{ word: "避難する", reading: "ひなんする", meaning: "mengungsi / evakuasi" }, { word: "避難所", reading: "ひなんじょ", meaning: "tempat pengungsian" }],
        sentence: "近くの避難所へ避難してください。", sentenceFurigana: "近(ちか)くの避(ひ)難(なん)所(じょ)へ避(ひ)難(なん)してください。",
        sentenceId: "Silakan mengungsi ke tempat evakuasi terdekat."
      },
      {
        kanji: "難", on: "ナン", kun: "むずか-しい", strokes: 18, radical: "隹 (burung berekor pendek)",
        meaning: "Bencana / Kesulitan / Sukar",
        strokeRule: "Sisi kiri (10 goresan: 廿, 口, 夫 variasi), burung 隹 di kanan (8 goresan).",
        words: [{ word: "避難する", reading: "ひなんする", meaning: "mengungsi" }, { word: "難しい", reading: "むずかしい", meaning: "sulit" }],
        sentence: "学校で避難訓練に参加しました。", sentenceFurigana: "学(がっ)校(こう)で避(ひ)難(なん)訓(くん)練(れん)に参(さん)加(か)しました。",
        sentenceId: "Mengikuti simulasi latihan evakuasi di sekolah."
      },
      {
        kanji: "安", on: "アン", kun: "やす-い", strokes: 6, radical: "宀 (atap)",
        meaning: "Aman / Murah / Tenang",
        strokeRule: "Atap 宀 di atas (3 goresan), wanita 女 di bawah (3 goresan).",
        words: [{ word: "安全（な）", reading: "あんぜんな", meaning: "aman" }, { word: "安心する", reading: "あんしんする", meaning: "merasa lega / tenang" }, { word: "安い", reading: "やすい", meaning: "murah" }],
        sentence: "机の下に入って、安全を確保します。", sentenceFurigana: "机(つくえ)のしたに入(はい)って、安(あん)全(ぜん)を確(かく)保(ほ)します。",
        sentenceId: "Masuk ke bawah meja untuk memastikan keselamatan diri."
      }
    ],
    readingExercise: [
      { q: "① 自然[災害]に備えて準備します。", a: "さいがい" },
      { q: "② 大きい[台風]が近づいています。", a: "たいふう" },
      { q: "③ 強い[風]が吹いているので注意してください。", a: "かぜ" },
      { q: "④ 大きな[地震]が起こりました。", a: "じしん" },
      { q: "⑤ 地震のあとは[火事]に気をつけてください。", a: "かじ" },
      { q: "⑥ 冬に[大雪]が降りました。", a: "おおゆき" },
      { q: "⑦ 海岸の近くは[津波]の危険があります。", a: "つなみ" },
      { q: "⑧ もし地震が[起]こったら、身を守ってください。", a: "お" },
      { q: "⑨ すぐに近くの学校へ[避難]してください。", a: "ひなん" },
      { q: "⑩ 机の下に入って、[安全]を確保します。", a: "あんぜん" }
    ],
    writingExercise: [
      { q: "① しぜん ( _________ ) [さいがい] に そなえます。", a: "災害" },
      { q: "② おおきい ( _________ ) [たいふう] が きています。", a: "台風" },
      { q: "③ つよい ( _________ ) [かぜ] が ふいています。", a: "風" },
      { q: "④ きのう ( _________ ) [じしん] が ありました。", a: "地震" },
      { q: "⑤ ( _________ ) [かじ] に きをつけてください。", a: "火事" },
      { q: "⑥ ふゆに ( _________ ) [おおゆき] が つもりました。", a: "大雪" },
      { q: "⑦ ( _________ ) [つなみ] けいほうが でました。", a: "津波" },
      { q: "⑧ じしんが ( _________ ) [お] こりました。", a: "起" },
      { q: "⑨ がっこうへ ( _________ ) [ひなん] します。", a: "避難" },
      { q: "⑩ ( _________ ) [あんぜん] な ばしょへ にげてください。", a: "安全" }
    ]
  },

  {
    bab: 17,
    titleJp: "第17課 日本語が前より話せるようになりました",
    titleId: "Bab 17: Sudah Bisa Berbicara Bahasa Jepang Lebih Baik dari Sebelumnya",
    topic: "私の人生 (Kehidupanku)",
    kanjiList: [
      {
        kanji: "最", on: "サイ", kun: "もっと-も", strokes: 12, radical: "日 (matahari)",
        meaning: "Paling / Ter-",
        strokeRule: "Matahari 日 di atas (4 goresan), 取 di bawah (8 goresan: 耳, 又).",
        words: [{ word: "最近", reading: "さいきん", meaning: "akhir-akhir ini" }, { word: "最高", reading: "さいこう", meaning: "terbaik / paling hebat" }],
        sentence: "最近、日本語が前より話せるようになりました。", sentenceFurigana: "最(さい)近(きん)、日(に)本(ほん)語(ご)が前(まえ)より話(はな)せるようになりました。",
        sentenceId: "Akhir-akhir ini, saya sudah bisa berbicara bahasa Jepang lebih baik daripada sebelumnya."
      },
      {
        kanji: "違", on: "イ", kun: "ちが-う / ちが-える", strokes: 13, radical: "辶 (jalan)",
        meaning: "Berbeda / Salah",
        strokeRule: "韋 di dalam (10 goresan), radikal jalan 辶 di luar (3 goresan).",
        words: [{ word: "違う", reading: "ちがう", meaning: "berbeda / bukan" }, { word: "間違い", reading: "まちがい", meaning: "kesalahan" }],
        sentence: "文化が違って、苦労しました。", sentenceFurigana: "文(ぶん)化(か)が違(ちが)って、苦(く)労(ろう)しました。",
        sentenceId: "Karena budayanya berbeda, saya sempat mengalami kesulitan."
      },
      {
        kanji: "授", on: "ジュ", kun: "さず-かる", strokes: 11, radical: "扌 (tangan)",
        meaning: "Mengajar / Memberikan",
        strokeRule: "Tangan 扌 di kiri (3 goresan), 受 (menerima: 8 goresan) di kanan.",
        words: [{ word: "授業", reading: "じゅぎょう", meaning: "pelajaran kelas / perkuliahan" }],
        sentence: "毎日、日本語の授業を受けています。", sentenceFurigana: "毎(まい)日(にち)、日(に)本(ほん)語(ご)の授(じゅ)業(ぎょう)を受(う)けています。",
        sentenceId: "Setiap hari mengikuti kelas pelajaran bahasa Jepang."
      },
      {
        kanji: "問", on: "モン", kun: "と-う", strokes: 11, radical: "口 (mulut)",
        meaning: "Masalah / Soal",
        strokeRule: "Pintu gerbang 門 di luar (8 goresan), mulut 口 di dalam (3 goresan).",
        words: [{ word: "問題", reading: "もんだい", meaning: "masalah / soal" }, { word: "質問", reading: "しつもん", meaning: "pertanyaan" }],
        sentence: "何か問題や困ったことはありませんか？", sentenceFurigana: "何(なに)か問(もん)題(だい)や困(こま)ったことはありませんか？",
        sentenceId: "Apakah ada masalah atau hal yang menyulitkan?"
      },
      {
        kanji: "題", on: "ダイ", kun: "-", strokes: 18, radical: "頁 (halaman/kepala)",
        meaning: "Topik / Judul / Soal",
        strokeRule: "Benar 是 di kiri (9 goresan: 日, 疋), halaman 頁 di kanan (9 goresan).",
        words: [{ word: "問題", reading: "もんだい", meaning: "masalah" }, { word: "宿題", reading: "しゅくだい", meaning: "pekerjaan rumah (PR)" }],
        sentence: "テストの問題を解きました。", sentenceFurigana: "テストの問(もん)題(だい)を解(と)きました。",
        sentenceId: "Mengerjakan soal-soal ujian."
      },
      {
        kanji: "増", on: "ゾウ", kun: "ふ-える / ふ-やす", strokes: 14, radical: "土 (tanah)",
        meaning: "Bertambah / Meningkat",
        strokeRule: "Tanah 土 di kiri (3 goresan), 曽 di kanan (11 goresan: 丷, 田, 日).",
        words: [{ word: "増える", reading: "ふえる", meaning: "bertambah" }, { word: "増やす", reading: "ふやす", meaning: "menambah" }],
        sentence: "日本人の友だちが増えました。", sentenceFurigana: "日(に)本(ほん)人(じん)の友(とも)だちが増(ふ)えました。",
        sentenceId: "Teman orang Jepang saya sudah bertambah banyak."
      },
      {
        kanji: "笑", on: "ショウ", kun: "わら-う / え-む", strokes: 10, radical: "竹 (bambu)",
        meaning: "Tertawa / Tersenyum",
        strokeRule: "Bambu 竹 di atas (6 goresan), 夭 di bawah (4 goresan: sapuan miring dan 大 variasi).",
        words: [{ word: "笑う", reading: "わらう", meaning: "tertawa" }, { word: "笑顔", reading: "えがお", meaning: "wajah tersenyum" }],
        sentence: "ドラマを見て、たくさん笑いました。", sentenceFurigana: "ドラマを見(み)て、たくさん笑(わら)いました。",
        sentenceId: "Saya menonton drama dan tertawa terbahak-bahak."
      },
      {
        kanji: "困", on: "コン", kun: "こま-る", strokes: 7, radical: "囗 (bingkai)",
        meaning: "Bingung / Susah / Repot",
        strokeRule: "Bingkai luar 冂 (2 goresan), pohon 木 di dalam (4 goresan), garis penutup bawah.",
        words: [{ word: "困る", reading: "こまる", meaning: "bingung / dalam kesulitan" }],
        sentence: "困ったときはいつでも言ってください。", sentenceFurigana: "困(こま)ったときはいつでも言(い)ってください。",
        sentenceId: "Katakan saja kapan pun jika Anda sedang bingung atau dalam kesulitan."
      },
      {
        kanji: "苦", on: "ク", kun: "くる-しい / にが-い", strokes: 8, radical: "艹 (rumput)",
        meaning: "Susah / Pahit / Jerih",
        strokeRule: "Rumput 艹 di atas (3 goresan), tua 古 di bawah (5 goresan: 十, 口).",
        words: [{ word: "苦労する", reading: "くろうする", meaning: "bekerja keras / bersusah payah" }, { word: "苦しい", reading: "くるしい", meaning: "berat / sesak" }, { word: "苦手", reading: "にがて", meaning: "lemah / tidak suka" }],
        sentence: "最初は文化が違って、苦労しました。", sentenceFurigana: "最(さい)初(しょ)は文(ぶん)化(か)が違(ちが)って、苦(く)労(ろう)しました。",
        sentenceId: "Pada awalnya saya mengalami masa sulit karena perbedaan budaya."
      },
      {
        kanji: "労", on: "ロウ", kun: "-", strokes: 7, radical: "力 (tenaga)",
        meaning: "Kerja keras / Jerih payah",
        strokeRule: "丷 di atas (2 goresan), mahkota 冖 (2 goresan), tenaga 力 di bawah (2 goresan).",
        words: [{ word: "苦労する", reading: "くろうする", meaning: "bersusah payah" }, { word: "労働", reading: "ろうどう", meaning: "tenaga kerja / buruh" }],
        sentence: "苦労した分、成長できました。", sentenceFurigana: "苦(く)労(ろう)した分(ぶん)、成(せい)長(ちょう)できました。",
        sentenceId: "Seiring dengan kerja keras itu, saya bisa bertumbuh/berkembang."
      }
    ],
    readingExercise: [
      { q: "① [最近]、日本語が前より話せるようになりました。", a: "さいきん" },
      { q: "② 文化が[違]って、最初はびっくりしました。", a: "ちが" },
      { q: "③ 毎日の[授業]がとても楽しいです。", a: "じゅぎょう" },
      { q: "④ 日本の生活に少しずつ[慣]れてきました。", a: "な" },
      { q: "⑤ 何か[問題]や困ったことはありませんか？", a: "もんだい" },
      { q: "⑥ 日本人の友だちが[増]えました。", a: "ふ" },
      { q: "⑦ 一人暮らしは[大変]ですが、楽しいです。", a: "たいへん" },
      { q: "⑧ 面白い話を聞いて、みんなで[笑]いました。", a: "わら" },
      { q: "⑨ 道に迷って[困]りました。", a: "こま" },
      { q: "⑩ 仕事を始めたとき、言葉で[苦労]しました。", a: "くろう" }
    ],
    writingExercise: [
      { q: "① ( _________ ) [さいきん] とても いそがしいです。", a: "最近" },
      { q: "② いけんは ひとによって ( _________ ) [ちが] います。", a: "違" },
      { q: "③ あしたの ( _________ ) [じゅぎょう] を よしゅうします。", a: "授業" },
      { q: "④ にほんの たべものに ( _________ ) [な] れました。", a: "慣" },
      { q: "⑤ なにか ( _________ ) [もんだい] が ありますか？", a: "問題" },
      { q: "⑥ にほんごの ごいが ( _________ ) [ふ] えました。", a: "増" },
      { q: "⑦ しごとは ( _________ ) [たいへん] ですが、がんばります。", a: "大変" },
      { q: "⑧ たのしく ( _________ ) [わら] いました。", a: "笑" },
      { q: "⑨ どうしたらいいか ( _________ ) [こま] っています。", a: "困" },
      { q: "⑩ たくさん ( _________ ) [くろう] しました。", a: "苦労" }
    ]
  },

  {
    bab: 18,
    titleJp: "第18課 将来、自分の会社を作ろうと思います",
    titleId: "Bab 18: Di Masa Depan, Saya Berpikir Ingin Membangun Perusahaan Sendiri",
    topic: "私の人生 (Kehidupanku)",
    kanjiList: [
      {
        kanji: "希", on: "キ", kun: "-", strokes: 7, radical: "巾 (kain)",
        meaning: "Harapan / Jarang",
        strokeRule: "爻 bagian atas (4 goresan: sapuan miring dan silang), kain 巾 di bawah (3 goresan).",
        words: [{ word: "希望", reading: "きぼう", meaning: "harapan / keinginan" }],
        sentence: "日本で働くことを希望しています。", sentenceFurigana: "日(に)本(ほん)で働(はたら)くことを希(き)望(ぼう)しています。",
        sentenceId: "Saya berharap dapat bekerja di Jepang."
      },
      {
        kanji: "望", on: "ボウ / モウ", kun: "のぞ-む", strokes: 11, radical: "月 (bulan)",
        meaning: "Mengharap / Memandang",
        strokeRule: "亡 di kiri atas (3 goresan), bulan 月 di kanan atas (4 goresan), raja 王 di bawah (4 goresan).",
        words: [{ word: "希望", reading: "きぼう", meaning: "harapan / cita-cita" }, { word: "望む", reading: "のぞむ", meaning: "mengharapkan" }],
        sentence: "将来の希望について話しました。", sentenceFurigana: "将(しょう)来(らい)の希(き)望(ぼう)について話(はな)しました。",
        sentenceId: "Saya menceritakan harapan dan cita-cita saya di masa depan."
      },
      {
        kanji: "続", on: "ゾク", kun: "つづ-ける / つづ-く", strokes: 13, radical: "糸 (benang)",
        meaning: "Melanjutkan / Berlanjut",
        strokeRule: "Benang 糸 di kiri (6 goresan), 売 di kanan (7 goresan: 十, 冖, 儿).",
        words: [{ word: "続ける", reading: "つづける", meaning: "melanjutkan (transitif)" }, { word: "続く", reading: "つづく", meaning: "berlanjut (intransitif)" }],
        sentence: "卒業したあとも、日本語の勉強は続けたほうがいいですよ。", sentenceFurigana: "卒(そつ)業(ぎょう)したあとも、日(に)本(ほん)語(ご)の勉(べん)強(きょう)は続(つづ)けたほうがいいですよ。",
        sentenceId: "Setelah lulus pun, sebaiknya Anda terus melanjutkan belajar bahasa Jepang."
      },
      {
        kanji: "募", on: "ボ", kun: "つの-る", strokes: 12, radical: "力 (tenaga)",
        meaning: "Merekrut / Mengumpulkan",
        strokeRule: "艹 di atas (3 goresan), 日 di tengah, 大 di bawahnya membentuk 莫 (10 goresan), lalu 力 di bawah (2 goresan).",
        words: [{ word: "募集する", reading: "ぼしゅうする", meaning: "merekrut / membuka pendaftaran" }],
        sentence: "新しいスタッフを募集しています。", sentenceFurigana: "新(あたら)しいスタッフを募(ぼ)集(しゅう)しています。",
        sentenceId: "Sedang membuka lowongan untuk merekrut staf baru."
      },
      {
        kanji: "集", on: "シュウ", kun: "あつ-まる / あつ-める", strokes: 12, radical: "隹 (burung)",
        meaning: "Berkumpul / Mengumpulkan",
        strokeRule: "Burung 隹 di atas (8 goresan), pohon 木 di bawah (4 goresan).",
        words: [{ word: "募集", reading: "ぼしゅう", meaning: "rekrutmen" }, { word: "集まる", reading: "あつまる", meaning: "berkumpul" }],
        sentence: "詳しい情報は募集案内を見てください。", sentenceFurigana: "詳(くわ)しい情(じょう)報(ほう)は募(ぼ)集(しゅう)案(あん)内(ない)を見(み)てください。",
        sentenceId: "Untuk informasi rinci, silakan lihat panduan rekrutmen."
      },
      {
        kanji: "建", on: "ケン", kun: "た-てる / た-つ", strokes: 9, radical: "廴 (langkah panjang)",
        meaning: "Membangun / Mendirikan",
        strokeRule: "聿 di kanan dalam (6 goresan: horizontal dan garis vertikal), radikal langkah panjang 廴 di luar (3 goresan).",
        words: [{ word: "建てる", reading: "たてる", meaning: "membangun (rumah/gedung)" }, { word: "建物", reading: "たてもの", meaning: "bangunan / gedung" }],
        sentence: "将来、自分の家を建てたいです。", sentenceFurigana: "将(しょう)来(らい)、自(じ)分(ぶん)の家(いえ)を建(た)てたいです。",
        sentenceId: "Di masa depan, saya ingin membangun rumah milik sendiri."
      },
      {
        kanji: "役", on: "ヤク / エキ", kun: "-", strokes: 7, radical: "彳 (langkah kecil)",
        meaning: "Peran / Kegunaan / Tugas",
        strokeRule: "彳 di kiri (3 goresan), 殳 di kanan (4 goresan).",
        words: [{ word: "役に立つ", reading: "やくにたつ", meaning: "berguna / bermanfaat" }, { word: "役割", reading: "やくわり", meaning: "peran" }],
        sentence: "人の役に立つ仕事がしたいと考えています。", sentenceFurigana: "人(ひと)の役(やく)に立(た)つ仕(し)事(ごと)がしたいと考(かんが)えています。",
        sentenceId: "Saya berpikir ingin melakukan pekerjaan yang berguna bagi orang lain."
      },
      {
        kanji: "考", on: "コウ", kun: "かんが-える", strokes: 6, radical: "耂 (tua)",
        meaning: "Memikirkan / Gagasan",
        strokeRule: "耂 di atas (4 goresan: 土 dan sapuan miring panjang), 丂 di bawah (2 goresan).",
        words: [{ word: "考える", reading: "かんがえる", meaning: "memikirkan / merenungkan" }, { word: "考え", reading: "かんがえ", meaning: "pikiran / gagasan" }],
        sentence: "将来の進路についてよく考えています。", sentenceFurigana: "将(しょう)来(らい)の進(しん)路(ろ)についてよく考(かんが)えています。",
        sentenceId: "Saya sedang memikirkan dengan baik jalan masa depan saya."
      },
      {
        kanji: "卒", on: "ソツ", kun: "-", strokes: 8, radical: "十 (sepuluh)",
        meaning: "Tamat / Kelulusan",
        strokeRule: "亠 di atas, dua 人 di tengah (4 goresan), sepuluh 十 di bawah (2 goresan).",
        words: [{ word: "卒業する", reading: "そつぎょうする", meaning: "lulus sekolah" }, { word: "卒業生", reading: "そつぎょうせい", meaning: "alumni / lulusan" }],
        sentence: "卒業したあとも勉強を続けます。", sentenceFurigana: "卒(そつ)業(ぎょう)したあとも勉(べん)強(きょう)を続(つづ)けます。",
        sentenceId: "Setelah lulus pun saya akan terus belajar."
      },
      {
        kanji: "住", on: "ジュウ", kun: "す-む / す-まう", strokes: 7, radical: "亻 (orang)",
        meaning: "Tinggal / Menetap",
        strokeRule: "Orang 亻 di kiri (2 goresan), 主 (tuan/utama: 5 goresan) di kanan.",
        words: [{ word: "住む", reading: "すむ", meaning: "tinggal / bermukim" }, { word: "住所", reading: "じゅうしょ", meaning: "alamat tempat tinggal" }],
        sentence: "将来もずっと日本に住みたいと思っています。", sentenceFurigana: "将(しょう)来(らい)もずっと日(に)本(ほん)に住(す)みたいと思(おも)っています。",
        sentenceId: "Di masa depan saya ingin terus tinggal di Jepang."
      },
      {
        kanji: "留", on: "リュウ / ル", kun: "と-まる / と-める", strokes: 10, radical: "田 (sawah)",
        meaning: "Menetap / Tinggal / Belajar di luar",
        strokeRule: "卯 variasi di atas (5 goresan), sawah 田 di bawah (5 goresan).",
        words: [{ word: "留学する", reading: "りゅうがくする", meaning: "studi di luar negeri" }, { word: "留学生", reading: "りゅうがくせい", meaning: "mahasiswa asing" }],
        sentence: "留学するために、特に外国語の勉強をがんばっています。", sentenceFurigana: "留(りゅう)学(がく)するために、特(とく)に外(がい)国(こく)語(ご)の勉(べん)強(きょう)をがんばっています。",
        sentenceId: "Untuk bisa studi di luar negeri, saya berjuang belajar bahasa asing."
      },
      {
        kanji: "学", on: "ガク", kun: "まな-ぶ", strokes: 8, radical: "子 (anak)",
        meaning: "Belajar / Ilmu pengetahuan",
        strokeRule: "Tiga titik atas ⺌, mahkota 冖 (2 goresan), anak 子 di bawah (3 goresan).",
        words: [{ word: "留学する", reading: "りゅうがくする", meaning: "studi ke luar negeri" }, { word: "学校", reading: "がっこう", meaning: "sekolah" }, { word: "学生", reading: "がくせい", meaning: "pelajar / mahasiswa" }],
        sentence: "日本の大学に留学したいです。", sentenceFurigana: "日(に)本(ほん)の大(だい)学(がく)に留(りゅう)学(がく)したいです。",
        sentenceId: "Saya ingin studi di universitas di Jepang."
      }
    ],
    readingExercise: [
      { q: "① 将来の[希望]について作文を書きました。", a: "きぼう" },
      { q: "② 卒業したあとも、勉強は[続]けたほうがいいですよ。", a: "つづ" },
      { q: "③ 新しいアルバイトを[募集]しています。", a: "ぼしゅう" },
      { q: "④ 将来、自分の家を[建]てたいです。", a: "た" },
      { q: "⑤ [特]に会話の練習をがんばっています。", a: "とく" },
      { q: "⑥ 人の[役]に[立]つ仕事がしたいと考えています。", a: "やく / た" },
      { q: "⑦ 将来の夢について真剣に[考]えています。", a: "かんが" },
      { q: "⑧ 来年の春、専門学校を[卒業]します。", a: "そつぎょう" },
      { q: "⑨ これからもずっと日本に[住]みたいです。", a: "す" },
      { q: "⑩ 日本へ[留学]するために試験を受けます。", a: "りゅうがく" }
    ],
    writingExercise: [
      { q: "① しょうらいの ( _________ ) [きぼう] を はなしました。", a: "希望" },
      { q: "② まいにち れんしゅうを ( _________ ) [つづ] けます。", a: "続" },
      { q: "③ スタッフの ( _________ ) [ぼしゅう] を みました。", a: "募集" },
      { q: "④ いつか じぶんの いえを ( _________ ) [た] てたいです。", a: "建" },
      { q: "⑤ ( _________ ) [とく] に にほんごが すきです。", a: "特" },
      { q: "⑥ ひとの ( _________ ) [やくにた] つ しごとが したいです。", a: "役に立" },
      { q: "⑦ しょうらいの ことを ( _________ ) [かんが] えます。", a: "考" },
      { q: "⑧ らいねん だいがくを ( _________ ) [そつぎょう] します。", a: "卒業" },
      { q: "⑨ とうきょうに ( _________ ) [す] んでいます。", a: "住" },
      { q: "⑩ にほんへ ( _________ ) [りゅうがく] したいです。", a: "留学" }
    ]
  }
];

// Combine all 18 Bab
const full18BabData = [...existingBab1to10, ...bab11to18];

fs.writeFileSync(
  path.join(outputDir, 'kanji_irodori_a2_2_data.json'),
  JSON.stringify(full18BabData, null, 2),
  'utf-8'
);
console.log('Successfully saved full 18-Bab dataset (kanji_irodori_a2_2_data.json)! Total Bab:', full18BabData.length);
