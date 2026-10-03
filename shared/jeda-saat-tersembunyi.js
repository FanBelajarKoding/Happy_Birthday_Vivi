// ===== [JEDA-SAAT-TERSEMBUNYI] =====
/* SHARED */ // dipakai modul yang jalan di dalam <iframe>
// Masalah: iframe terus berjalan walau babaknya sudah di luar layar (bunga masih
// bergoyang, lagu masih bunyi), jadi boros baterai & bikin HP panas.
// Analoginya kayak TV di ruang kosong yang dibiarkan menyala.
// Solusi: saat babak benar-benar tak terlihat, semua ini dijeda otomatis:
//   - semua animasi CSS (posisi animasinya disimpan, lanjut dari situ)
//   - semua <audio> / <video> yang sedang main (lanjut lagi saat babak kembali)
//   - loop requestAnimationFrame
// Modul juga bisa menangkap event "babak-jeda" / "babak-lanjut" kalau perlu.
(function () {
  let jeda = false;
  const antrean = [];
  const sedangMain = new Set();
  const asliRAF = window.requestAnimationFrame.bind(window);

  window.requestAnimationFrame = (cb) => asliRAF((t) => (jeda ? antrean.push(cb) : cb(t)));

  const gaya = document.createElement("style");
  gaya.textContent =
    "html.jeda *, html.jeda *::before, html.jeda *::after { animation-play-state: paused !important; }";
  document.head.appendChild(gaya);

  function aturJeda(nilai) {
    if (nilai === jeda) return;
    jeda = nilai;
    document.documentElement.classList.toggle("jeda", jeda);

    document.querySelectorAll("audio, video").forEach((m) => {
      if (jeda && !m.paused) { sedangMain.add(m); m.pause(); }
      else if (!jeda && sedangMain.has(m)) { sedangMain.delete(m); m.play().catch(() => {}); }
    });

    if (!jeda) antrean.splice(0).forEach((cb) => asliRAF(cb));
    window.dispatchEvent(new Event(jeda ? "babak-jeda" : "babak-lanjut"));
  }

  // rasio 0 = benar-benar tak terlihat (babak bersebelahan yang cuma "bersentuhan" tidak dihitung)
  new IntersectionObserver(([e]) => aturJeda(e.intersectionRatio === 0), { threshold: [0, 0.01] })
    .observe(document.body);
})();
// ===== END [JEDA-SAAT-TERSEMBUNYI] =====
