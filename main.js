// ===== [MAIN-SETUP] =====
const semuaBabak = Array.from(document.querySelectorAll(".babak"));
const navTitik = document.getElementById("navTitik");
const tombolLanjut = document.getElementById("tombolLanjut");

let babakAktif = 0;
// ===== END [MAIN-SETUP] =====

// ===== [MAIN-BUAT-TITIK] =====
// satu titik kecil per babak, diklik langsung lompat ke sana
semuaBabak.forEach((babak, i) => {
  const titik = document.createElement("button");
  titik.className = "nav-titik__item" + (i === 0 ? " aktif" : "");
  titik.setAttribute("aria-label", "Ke babak " + (i + 1));
  titik.addEventListener("click", () => lompatKe(i));
  navTitik.appendChild(titik);
});

function tandaiAktif(index) {
  babakAktif = index;
  // babak lain dijeda animasinya (lihat .babak.jeda di style-base.css)
  semuaBabak.forEach((babak, i) => babak.classList.toggle("jeda", i !== index));
  navTitik.querySelectorAll(".nav-titik__item").forEach((titik, i) => {
    titik.classList.toggle("aktif", i === index);
  });
  tombolLanjut.classList.toggle("tersembunyi", index === semuaBabak.length - 1);
}

let sedangTransisi = false;

function lompatKe(index) {
  if (index < 0 || index >= semuaBabak.length) return;
  if (sedangTransisi) return; // cegah numpuk kalau titik nav diklik cepat-cepat
  sedangTransisi = true;

  mainkanTransisi(() => {
    semuaBabak[index].scrollIntoView({ behavior: "instant" });
  });

  // kira-kira selama ini transisi kelopak jalan (lihat shared/transisi.js),
  // dilebihkan sedikit biar aman
  setTimeout(() => {
    sedangTransisi = false;
  }, 1800);
}
// ===== END [MAIN-BUAT-TITIK] =====

// ===== [MAIN-TOMBOL-LANJUT] =====
// Wiring tombol gerbang ("mulai scroll") sekarang ada di
// shared/gerbang-kado.js, karena nempel sama alur kado->kue->gelap.
tombolLanjut.addEventListener("click", () => lompatKe(babakAktif + 1));
// ===== END [MAIN-TOMBOL-LANJUT] =====

// ===== [MAIN-LACAK-BABAK-AKTIF] =====
const pengamatBabak = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
        tandaiAktif(semuaBabak.indexOf(entry.target));
      }
    });
  },
  { threshold: 0.6 }
);

semuaBabak.forEach((babak) => pengamatBabak.observe(babak));
// ===== END [MAIN-LACAK-BABAK-AKTIF] =====
