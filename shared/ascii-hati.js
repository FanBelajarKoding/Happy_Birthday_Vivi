// ===== [ASCII-HATI] =====
/* SHARED */ // dipakai loading.js dan transisi.js
// Rumus hati dari internet: (x² + y² − 1)³ − x²y³ = 0.
// Titik (x, y) ada DI DALAM hati kalau hasil rumusnya <= 0.
// Analoginya kayak cetakan kue: kita tes tiap petak, yang kena cetakan dipakai.
function didalamKurvaHati(x, y) {
  return Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3) <= 0;
}

// Hasilnya petak [baris][kolom] berisi true (isi hati) / false (kosong).
// rasio = lebar huruf / tinggi huruf (±0.55 untuk font monospace),
// supaya hatinya tidak gepeng walau hurufnya berbentuk tinggi.
function petakHati(kolom, rasio) {
  const LEBAR_DUNIA = 2.6, TINGGI_DUNIA = 2.5;
  const baris = Math.round(kolom * rasio * (TINGGI_DUNIA / LEBAR_DUNIA));
  const petak = [];
  for (let r = 0; r < baris; r++) {
    const row = [];
    for (let c = 0; c < kolom; c++) {
      const x = (c / (kolom - 1)) * LEBAR_DUNIA - LEBAR_DUNIA / 2;
      const y = 1.35 - (r / (baris - 1)) * TINGGI_DUNIA;
      row.push(didalamKurvaHati(x, y));
    }
    petak.push(row);
  }
  return petak;
}
// ===== END [ASCII-HATI] =====
