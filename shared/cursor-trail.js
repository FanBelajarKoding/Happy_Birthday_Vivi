// ===== CURSOR TRAIL (utas penghubung) =====
// Cara kerjanya: tiap mouse/jari bergerak, kita taruh satu simbol hati
// kecil di posisi itu, kasih class "tampil" (biar CSS transition-nya
// jalan), lalu dia dihapus sendiri lewat munculLaluHilang() dari
// shared/utils.js. Analoginya kayak kembang api kecil yang nyalain diri
// sendiri terus padam sendiri, kita cuma perlu "menyalakannya" satu-satu.

(function () {
  let waktuTerakhir = 0;
  const JEDA_MS = 90; // biar tidak spawn ratusan elemen tiap gerakan

  function spawnHati(x, y) {
    const hati = document.createElement("span");
    hati.className = "jejak-hati";
    hati.textContent = "❤";
    hati.style.left = x + "px";
    hati.style.top = y + "px";
    document.body.appendChild(hati);
    munculLaluHilang(hati, 700);
  }

  function tanganiGerakan(x, y) {
    const sekarang = Date.now();
    if (sekarang - waktuTerakhir < JEDA_MS) return;
    waktuTerakhir = sekarang;
    spawnHati(x, y);
  }

  document.addEventListener("mousemove", (e) => {
    tanganiGerakan(e.clientX, e.clientY);
  });

  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches[0]) {
        tanganiGerakan(e.touches[0].clientX, e.touches[0].clientY);
      }
    },
    { passive: true }
  );
})();
// ===== END CURSOR TRAIL =====
