// ===== [AKTIF-SAAT-TERLIHAT] =====
// Dipakai modul yang jalan di dalam <iframe>. Masalahnya: iframe sudah dimuat
// duluan sebelum kamu sampai di babaknya, jadi animasi "sekali jalan" keburu
// selesai di latar belakang. Analoginya kayak film yang sudah diputar waktu
// kamu masih di lorong bioskop.
// Fungsi ini menunggu babak benar-benar terlihat, baru menjalankan masuk().
// Saat babak keluar layar, keluar() dipanggil supaya bisa di-reset dan
// animasinya mulai dari awal lagi kalau kamu kembali.
//
//   saatTerlihat(() => { /* mulai animasi */ }, () => { /* reset */ });
function saatTerlihat(masuk, keluar, tunda = 500) {
  // tunda: kelopak transisi antar babak masih menutupi layar sebentar,
  // jadi animasi dimulai sedikit setelahnya supaya tidak terlewat.
  let aktif = false;
  let pewaktu = null;
  new IntersectionObserver(
    ([e]) => {
      if (!aktif && e.intersectionRatio >= 0.6) {
        aktif = true;
        pewaktu = setTimeout(masuk, tunda);
      } else if (aktif && e.intersectionRatio === 0) {
        aktif = false;
        clearTimeout(pewaktu);
        if (keluar) keluar();
      }
    },
    { threshold: [0, 0.05, 0.6] } // 0.05 perlu: tepi babak bersebelahan dianggap "bersentuhan"
  ).observe(document.body);
}
// ===== END [AKTIF-SAAT-TERLIHAT] =====
