// ===== LOADING SCREEN (GRAFIK GELOMBANG HATI) =====
// Loading bar-nya berupa grafik matematika dengan sumbu x-y. Gelombangnya
// makin rapat seiring persen naik, sampai membentuk hati penuh.
// Rumus yang dipakai (nggak ditulis di layar):
//   y = x^(2/3) + 0.9 * akar(3.3 - x²) * sin(a * π * x)
// "a" itu seperti slider di Desmos: a = 0 cuma lengkung polos, makin besar a
// makin banyak gelombangnya, dan bentuk hatinya makin kelihatan.
//
// Layar baru hilang setelah DUA syarat terpenuhi:
//   1) durasi minimal habis (biar animasinya sempat dinikmati)
//   2) window "load" beneran selesai (iframe/font/gambar termuat)

(function () {
  const layar = document.getElementById("layarLoading");
  const kanvas = document.getElementById("loadingGrafik");
  const teksPersen = document.getElementById("loadingPersen");

  // EDIT: lama loading minimal (ms) dan "kerapatan" gelombang di akhir
  const DURASI_MIN = 6000;
  const A_AKHIR = 9;

  // ----- kanvas (tajam di layar HP) -----
  const W = 300, H = 270;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  kanvas.width = W * dpr;
  kanvas.height = H * dpr;
  const g = kanvas.getContext("2d");
  g.scale(dpr, dpr);

  // titik (0,0) grafik ada di (X0, Y0); 1 satuan = S piksel
  const S = 56, X0 = W / 2, Y0 = H * 0.58;
  const px = (x) => X0 + x * S;
  const py = (y) => Y0 - y * S;
  const BATAS_X = Math.sqrt(3.3); // di luar ini akar-nya negatif, grafik berhenti

  function f(x, a) {
    return Math.cbrt(x * x) + 0.9 * Math.sqrt(Math.max(0, 3.3 - x * x)) * Math.sin(a * Math.PI * x);
  }

  function panah(x, y, arah) {
    g.beginPath();
    if (arah === "kanan") { g.moveTo(x, y); g.lineTo(x - 9, y - 5); g.lineTo(x - 9, y + 5); }
    else { g.moveTo(x, y); g.lineTo(x - 5, y + 9); g.lineTo(x + 5, y + 9); }
    g.closePath();
    g.fill();
  }

  function gambar(a) {
    g.clearRect(0, 0, W, H);

    // sumbu x dan y + panah + garis skala
    g.strokeStyle = g.fillStyle = "rgba(247,198,217,0.75)";
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(px(-2.6), py(0)); g.lineTo(px(2.6) - 8, py(0));
    g.moveTo(px(0), py(-2.0)); g.lineTo(px(0), py(2.8) + 8);
    for (const t of [-2, -1, 1, 2]) {
      g.moveTo(px(t), py(0) - 4); g.lineTo(px(t), py(0) + 4);
      g.moveTo(px(0) - 4, py(t)); g.lineTo(px(0) + 4, py(t));
    }
    g.stroke();
    panah(px(2.6), py(0), "kanan");
    panah(px(0), py(2.8), "atas");

    // kurva hati: dari kiri ke kanan, 500 titik
    g.strokeStyle = "#ff69b4";
    g.lineWidth = 2;
    g.lineJoin = "round";
    g.shadowColor = "rgba(255,105,180,0.6)";
    g.shadowBlur = 8;
    g.beginPath();
    const N = 500;
    for (let i = 0; i <= N; i++) {
      const x = -BATAS_X + (2 * BATAS_X * i) / N;
      const y = f(x, a);
      i === 0 ? g.moveTo(px(x), py(y)) : g.lineTo(px(x), py(y));
    }
    g.stroke();
    g.shadowBlur = 0;
  }

  // ----- progress berbasis waktu (halus), ditahan di 90% sampai halaman benar-benar load -----
  let halamanSudahLoad = false;
  window.addEventListener("load", () => { halamanSudahLoad = true; });

  let progres = 0;
  const mulai = performance.now();

  function langkah(now) {
    const u = Math.min((now - mulai) / DURASI_MIN, 1);
    const target = 0.5 - 0.5 * Math.cos(Math.PI * u); // pelan di awal & akhir
    progres = Math.max(progres, Math.min(target, halamanSudahLoad ? 1 : 0.9));

    gambar(A_AKHIR * progres);
    teksPersen.textContent = Math.round(progres * 100) + "%";

    if (progres >= 1) return selesaikanLoading();
    requestAnimationFrame(langkah);
  }
  requestAnimationFrame(langkah);

  function selesaikanLoading() {
    // tahan sebentar supaya hati penuhnya sempat terlihat
    setTimeout(() => {
      layar.classList.add("selesai");
      setTimeout(() => layar.remove(), 700);
    }, 700);
  }
})();
// ===== END LOADING SCREEN =====
