// ===== [TRANSISI-ASCII] =====
// Transisi antar babak. Cara kerja singkatnya:
//   1) layar ditutup sapuan karakter ASCII dari satu arah acak
//      (karakter makin padat = makin tertutup)
//   2) begitu tertutup penuh, hati ASCII muncul sebentar
//      dan babak beneran dipindah (Vivi nggak lihat lompatannya)
//   3) layar dibuka lagi, disapu keluar dari arah lain
// Digambar di <canvas> (bukan ribuan elemen HTML) supaya tetap ringan di HP.
//
// EDIT: durasi (ms) dan karakter bisa diganti di sini.
const TRANSISI_ASCII = {
  tutup: 650,
  tahan: 260,
  buka: 650,
  huruf: " .:-=+*#%@", // gelap/jarang -> padat
  // Warna SAMA dengan modul ASCII di akhir (modules/ascii-kado): pink soft di atas hitam
  warna: { latar: "#000000", huruf: "#f7c6d9", glow: "#ff9ec7" },
};

function mainkanTransisi(callback) {
  const layer = document.getElementById("transisiLayer");
  const kurangGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  layer.classList.add("aktif");

  if (kurangGerak) {
    // versi ringan buat yang sensitif gerakan: fade aja, tanpa sapuan ASCII
    setTimeout(() => {
      callback();
      layer.classList.remove("aktif");
    }, 320);
    return;
  }

  // ----- siapkan kanvas & petak karakter -----
  layer.style.cssText = "background:transparent;transition:none"; // CSS dasar cuma buat fade
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth, H = window.innerHeight;
  const kanvas = document.createElement("canvas");
  kanvas.width = W * dpr;
  kanvas.height = H * dpr;
  kanvas.style.cssText = "width:100%;height:100%;display:block";
  layer.appendChild(kanvas);
  const g = kanvas.getContext("2d");
  g.scale(dpr, dpr);

  const cw = Math.max(14, Math.ceil(W / 80)); // lebar 1 petak karakter
  const ch = Math.round(cw * 1.6); // tinggi 1 petak karakter
  const kolom = Math.ceil(W / cw), baris = Math.ceil(H / ch);
  const noise = Float32Array.from({ length: kolom * baris }, Math.random); // bikin tepi sapuan "berbutir"
  const FONT = 'ui-monospace, "SF Mono", "Fira Code", "Courier New", monospace';
  const { latar: GELAP, huruf: PINK_SOFT, glow: GLOW } = TRANSISI_ASCII.warna;
  const huruf = TRANSISI_ASCII.huruf;

  // hati di tengah layar (pakai rumus dari shared/ascii-hati.js)
  const hk = Math.min(30, kolom - 4);
  const hatiPetak = petakHati(hk, cw / ch);
  const hc0 = Math.floor((kolom - hk) / 2);
  const hr0 = Math.floor((baris - hatiPetak.length) / 2) - 1;

  // posisi petak sepanjang arah sapuan: 0 = sisi awal, 1 = sisi akhir
  const arahList = {
    kiri: (c) => c / kolom,
    kanan: (c) => 1 - c / kolom,
    atas: (c, r) => r / baris,
    bawah: (c, r) => 1 - r / baris,
  };
  const nama = Object.keys(arahList);
  const arahMasuk = nama[Math.floor(Math.random() * nama.length)];
  const sisa = nama.filter((a) => a !== arahMasuk);
  const arahKeluar = sisa[Math.floor(Math.random() * sisa.length)];

  const LEBAR_TEPI = 0.4; // seberapa lebar "tepi sapuan" yang masih setengah tertutup

  function gambar(arah, p, membuka, alphaHati) {
    g.clearRect(0, 0, W, H);
    g.globalAlpha = 1;
    g.shadowBlur = 0;
    g.font = "bold " + Math.round(ch * 0.8) + "px " + FONT;
    g.textAlign = "center";
    g.textBaseline = "middle";
    const geser = p * (1 + LEBAR_TEPI);

    for (let r = 0; r < baris; r++) {
      for (let c = 0; c < kolom; c++) {
        const n = noise[r * kolom + c];
        let tutup = Math.min(Math.max((geser - arahList[arah](c, r) - n * 0.15) / LEBAR_TEPI, 0), 1);
        if (membuka) tutup = 1 - tutup;
        if (tutup <= 0) continue;

        const x = c * cw, y = r * ch;
        if (tutup >= 0.6) {
          // tertutup: latar gelap solid + huruf samar sebagai tekstur
          g.fillStyle = GELAP;
          g.fillRect(x, y, cw + 1, ch + 1);
          g.fillStyle = "rgba(247,198,217,0.22)";
          g.fillText(huruf[3 + Math.floor(n * 5)], x + cw / 2, y + ch / 2);
        } else {
          // tepi sapuan: huruf makin padat = makin tertutup, halaman masih kelihatan
          const ch2 = huruf[Math.min(Math.floor(tutup * (huruf.length - 1)), huruf.length - 1)];
          if (ch2 !== " ") {
            g.fillStyle = PINK_SOFT;
            g.fillText(ch2, x + cw / 2, y + ch / 2);
          }
        }
      }
    }

    if (alphaHati > 0) {
      g.globalAlpha = alphaHati;
      g.fillStyle = PINK_SOFT;
      g.shadowColor = GLOW; // glow pink seperti di modul ASCII
      g.shadowBlur = 8;
      hatiPetak.forEach((row, pr) =>
        row.forEach((isi, pc) => {
          if (isi) g.fillText("@#%*"[(pr * 5 + pc * 3) % 4], (hc0 + pc) * cw + cw / 2, (hr0 + pr) * ch + ch / 2);
        })
      );
    }
  }

  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const { tutup, tahan, buka } = TRANSISI_ASCII;
  const mulai = performance.now();
  let sudahPindah = false;

  function langkah(now) {
    const t = now - mulai;
    if (t < tutup) {
      const p = ease(t / tutup);
      gambar(arahMasuk, p, false, Math.max(0, (p - 0.55) / 0.45));
    } else if (t < tutup + tahan) {
      if (!sudahPindah) {
        gambar(arahMasuk, 1, false, 1);
        callback(); // babak beneran dipindah di sini, tertutup penuh
        sudahPindah = true;
      }
    } else if (t < tutup + tahan + buka) {
      const p = ease((t - tutup - tahan) / buka);
      gambar(arahKeluar, p, true, Math.max(0, 1 - p * 2.2));
    } else {
      if (!sudahPindah) callback();
      kanvas.remove();
      layer.style.cssText = "";
      layer.classList.remove("aktif");
      return;
    }
    requestAnimationFrame(langkah);
  }
  requestAnimationFrame(langkah);
}
// ===== END [TRANSISI-ASCII] =====
