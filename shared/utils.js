// ===== SHARED UTILS =====
// Kumpulan fungsi kecil yang berulang dipakai di beberapa modul baru.
// Pola-pola ini nyontek dari yang sudah ada di modul lama (lihat mega
// prompt Bagian 4), bukan pola baru.

// Angka acak antara min-max (dipakai buat rotasi kartu polaroid di
// memory-timeline, nyontek gaya random di flower-bloom)
function acakAngka(min, max) {
  return Math.random() * (max - min) + min;
}

// Deteksi apakah perangkat pakai layar sentuh, dipakai buat milih
// script mouse vs touch (pola yang sama seperti drag-paper)
function pakaiTouch() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// Elemen yang muncul lalu otomatis hilang sendiri, pola yang sama
// dengan bubble teks di flower-bloom (setTimeout -> remove)
function munculLaluHilang(elemen, durasiMs = 2000) {
  requestAnimationFrame(() => elemen.classList.add("tampil"));
  setTimeout(() => {
    elemen.classList.remove("tampil");
    setTimeout(() => elemen.remove(), 400);
  }, durasiMs);
}
// ===== END SHARED UTILS =====
