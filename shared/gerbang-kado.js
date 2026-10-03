// ===== GERBANG: KADO -> KUE -> GELAP =====
// Alurnya: (1) kado goyang, diketuk -> tutup meledak + bunga muncrat
// kayak air mancur -> (2) fade ke kue dengan lilin nyala -> ditekan
// tahan di apinya -> api padam + asap tipis -> (3) layar meredup jadi
// hitam, lalu kata-kata muncul dan siap lanjut ke babak 1.
(function () {
  const tombolKado = document.getElementById("tombolKado");
  const faseKado = document.getElementById("faseKado");
  const faseKue = document.getElementById("faseKue");
  const faseGelap = document.getElementById("faseGelap");
  const fountainLayer = document.getElementById("fountainLayer");
  const areaTiup = document.getElementById("areaTiup");
  const asapLilin = document.getElementById("asapLilin");
  const overlayGelap = document.getElementById("overlayGelap");
  const tombolGerbangLanjut = document.getElementById("tombolGerbangLanjut");
  const kontainer = document.getElementById("kapsulContainer");
  const hintNavigasi = document.getElementById("hintNavigasi");

  function pindahFase(dariEl, keEl) {
    dariEl.classList.remove("tampak");
    keEl.classList.add("tampak");
  }

  // ----- FASE 1: buka kado -----
  tombolKado.addEventListener("click", () => {
    if (tombolKado.classList.contains("meledak")) return; // cegah diklik dobel
    tombolKado.classList.add("meledak");
    semburkanBunga();
    setTimeout(() => pindahFase(faseKado, faseKue), 900);
  });

  function semburkanBunga() {
    const jumlah = 24;
    for (let i = 0; i < jumlah; i++) {
      const p = document.createElement("span");
      p.className = "partikel-fountain";
      p.textContent = Math.random() > 0.5 ? "🌸" : "🌺";
      p.style.setProperty("--dx", acakAngka(-150, 150) + "px");
      p.style.setProperty("--puncak", acakAngka(-230, -150) + "px");
      const durasi = acakAngka(0.9, 1.4);
      const tunda = acakAngka(0, 0.25);
      p.style.setProperty("--durasi", durasi + "s");
      p.style.setProperty("--tunda", tunda + "s");
      fountainLayer.appendChild(p);
      setTimeout(() => p.remove(), (durasi + tunda) * 1000 + 200);
    }
  }

  // ----- FASE 2: tekan & tahan buat tiup lilin -----
  let timerTiup = null;

  function mulaiMenahan(e) {
    if (areaTiup.classList.contains("padam")) return;
    e.preventDefault();
    areaTiup.classList.add("menahan");
    timerTiup = setTimeout(padamkanLilin, 900);
  }

  function batalMenahan() {
    if (!timerTiup) return;
    clearTimeout(timerTiup);
    timerTiup = null;
    areaTiup.classList.remove("menahan");
  }

  function padamkanLilin() {
    timerTiup = null;
    areaTiup.classList.remove("menahan");
    areaTiup.classList.add("padam");
    asapLilin.classList.add("tampak");

    setTimeout(() => {
      overlayGelap.classList.add("aktif");
      setTimeout(() => {
        pindahFase(faseKue, faseGelap);
        overlayGelap.classList.remove("aktif");
      }, 850);
    }, 500);
  }

  areaTiup.addEventListener("mousedown", mulaiMenahan);
  areaTiup.addEventListener("touchstart", mulaiMenahan, { passive: false });
  areaTiup.addEventListener("mouseup", batalMenahan);
  areaTiup.addEventListener("mouseleave", batalMenahan);
  areaTiup.addEventListener("touchend", batalMenahan);

  // ----- FASE 3: kata-kata, lanjut ke babak 1 -----
  tombolGerbangLanjut.addEventListener("click", () => {
    kontainer.classList.add("kapsul-terbuka");
    document.body.style.overflow = "";
    lompatKe(1);

    setTimeout(() => {
      hintNavigasi.classList.add("tampil");
      setTimeout(() => hintNavigasi.classList.remove("tampil"), 4000);
    }, 1000);
  });
})();
// ===== END GERBANG =====
