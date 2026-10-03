// ===== [HATI-DATA] =====
// EDIT: ini foto lama yang dipakai buat mosaik hati (sengaja beda dari
// yang di modules/memory-timeline biar nggak keulang persis). Tambah
// path foto baru di array ini kalau mau lebih banyak foto asli
// (otomatis makin sedikit slot placeholder-nya).
const FOTO_HATI = [
  "img/Picture2.jpg",
  "img/Picture3.jpg",
  "img/Picture4.jpg",
  "img/Picture5.jpg",
  "img/Picture6.jpg", 
  "img/Picture7.jpg",
  "img/Picture8.jpg",
  "img/Picture9.jpg",
  "img/Picture10.jpg"
];
// ===== END [HATI-DATA] =====

// ===== [HATI-GRID] =====
// Cara nentuin sel grid mana yang "di dalam" bentuk hati: pakai rumus
// kurva hati implisit (x²+y²-1)³ - x²y³ <= 0. Tiap sel grid dites satu-
// satu, yang lolos baru dijadiin ubin. Analoginya kayak nyetak kue
// pakai cetakan hati — semua adonan (grid) dites, yang kena bentuk
// cetakan aja yang dipakai.
const BARIS = 8;
const KOLOM = 10;

function didalamHati(x, y) {
  return Math.pow(x * x + y * y - 1, 3) - x * x * Math.pow(y, 3) <= 0;
}

const selTerpilih = [];
for (let r = 0; r < BARIS; r++) {
  for (let c = 0; c < KOLOM; c++) {
    const x = (c / (KOLOM - 1)) * 2.4 - 1.2;
    const y = 1.2 - (r / (BARIS - 1)) * 2.4;
    if (didalamHati(x, y)) selTerpilih.push({ r, c });
  }
}
// ===== END [HATI-GRID] =====

// ===== [HATI-RENDER] =====
const panggung = document.getElementById("hatiPanggung");
// Dibuat sebagai fungsi supaya bisa dijalankan tiap kali babak ini terlihat
// (lihat shared/aktif-saat-terlihat.js), bukan langsung saat halaman dimuat.
function susunHati() {
  panggung.innerHTML = ""; // bersihkan dulu kalau ini kunjungan ke-2 dst
  const lebarPanggung = panggung.clientWidth;
  const pitch = lebarPanggung / KOLOM;
  const ukuranUbin = pitch - 6; // sisain jarak kecil antar ubin

  panggung.style.height = pitch * BARIS + "px";

  // urutan pengisian foto/placeholder diacak (bukan urut grid), biar
  // foto asli kesebar, nggak numpuk di satu sisi
  const urutanAcak = [...selTerpilih].sort(() => Math.random() - 0.5);

  const arahList = ["kiri", "kanan", "atas", "bawah"];
  const vektorArah = {
    kiri: { dx: -1, dy: 0 },
    kanan: { dx: 1, dy: 0 },
    atas: { dx: 0, dy: -1 },
    bawah: { dx: 0, dy: 1 },
  };
  const jauh = 420;

  urutanAcak.forEach((sel, i) => {
    const ubin = document.createElement("div");
    ubin.className = "hati-ubin";
    ubin.style.width = ukuranUbin + "px";
    ubin.style.height = ukuranUbin + "px";
    ubin.style.left = sel.c * pitch + "px";
    ubin.style.top = sel.r * pitch + "px";

    const pakaiFotoAsli = i % 2 === 0; // ganjil-genap, kira-kira 50/50
    if (pakaiFotoAsli) {
      const img = document.createElement("img");
      img.src = FOTO_HATI[i % FOTO_HATI.length];
      img.alt = "Foto kenangan";
      ubin.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "hati-ubin__placeholder";
      placeholder.textContent = "+";
      ubin.appendChild(placeholder);
    }

    // posisi awal: jauh di luar layar dari satu arah acak per ubin
    // (dokumennya minta "dari berbagai arah", jadi tiap ubin arahnya
    // independen, bukan seragam kayak transisi antar babak)
    const arah = arahList[Math.floor(Math.random() * arahList.length)];
    const v = vektorArah[arah];
    const miring = (Math.random() * 10 - 5).toFixed(1) + "deg";
    ubin.style.transform = `translate(${v.dx * jauh}px, ${v.dy * jauh}px) rotate(${miring})`;

    panggung.appendChild(ubin);

    const tunda = Math.random() * 900;
    setTimeout(() => {
      ubin.classList.add("tampak");
      ubin.style.transform = `translate(0, 0) rotate(${miring})`;
    }, tunda);
  });
}

saatTerlihat(susunHati, () => { panggung.innerHTML = ""; });
// ===== END [HATI-RENDER] =====
