// ===== [TIMELINE-DATA] =====
// EDIT: ini daftar kenangannya. "foto: null" artinya slot buat foto BARU
// yang belum ditaruh — ganti null dengan path foto (taruh filenya di
// folder img/ dulu), dan ganti "keterangan" sesuai cerita aslinya.
const daftarKenangan = [
  { foto: "img/Picture1.jpg", keterangan: "Satu dari banyak momen favorit." },
  { foto: "img/Picture2.jpg", keterangan: "Ini part dimana kamu spam foto ke aku." },
  { foto: "img/Picture3.jpg", keterangan: "ini waktu kamu nungguin aku jemput." },
  { foto: "img/Picture4.jpg", keterangan: "Kenangan kecil yang nggak kelupaan." },
  { foto: "img/Picture7.jpg", keterangan: "first time gandeng tangan kamu" },
  { foto: "img/Picture8.jpg", keterangan: "first time study date bareng kamu" },
];
// ===== END [TIMELINE-DATA] =====

// ===== [TIMELINE-RENDER] =====
const kontainer = document.getElementById("daftar-kenangan");

daftarKenangan.forEach((item, i) => {
  const kartu = document.createElement("div");
  kartu.className = "tl-kartu " + (i % 2 === 0 ? "tl-kartu--kiri" : "tl-kartu--kanan");
  // sedikit miring acak, biar berasa ditaruh tangan bukan mesin
  const miring = (Math.random() * 6 - 3).toFixed(1);
  kartu.style.setProperty("--miring", miring + "deg");

  if (item.foto) {
    const img = document.createElement("img");
    img.src = item.foto;
    img.alt = "Foto kenangan";
    kartu.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className = "tl-kartu__placeholder";
    placeholder.textContent = "+ taruh foto baru di sini (img/ folder)";
    kartu.appendChild(placeholder);
  }

  const teks = document.createElement("p");
  teks.className = "tl-kartu__keterangan";
  teks.textContent = item.keterangan;
  kartu.appendChild(teks);

  kontainer.appendChild(kartu);
});
// ===== END [TIMELINE-RENDER] =====

// ===== [TIMELINE-OBSERVER] =====
// Kartu baru "muncul" (fade + geser naik) begitu masuk layar,
// bukan langsung semua kelihatan dari awal.
const pengamat = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("tampak");
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll(".tl-kartu").forEach((kartu) => pengamat.observe(kartu));
// ===== END [TIMELINE-OBSERVER] =====
