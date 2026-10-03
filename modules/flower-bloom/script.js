const randomImages = [
  "img/Picture4.jpg",
  "img/Picture5.jpg",
  "img/Picture6.jpg",
  "img/Picture7.jpg",
  "img/Picture8.jpg",
];

const randomTexts = [
  "I Always Love U Vivi 🩶",
  "Cantiknya bikin hati meleleh~",
  "Senyummm dong, biar dunia tenang sejenak",
  "Ngobrol sama kamu tu susah, tapi worth it",
  "Jangan lupa makan ya, jangan cuma makan hati aku",
  "Kalau kamu bintang, aku rela jadi langit",
  "KAMU ITU CANTIKK 🫵",
  "Semangat ya! 💪",
  "I Proud Of You",
];

let clickCount = 0;
let nextImageAfter = getRandomInt(3, 5); // awal random 3-5 tap sebelum gambar

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function bloomFlower() {
  if (document.body.classList.contains("not-loaded")) {
    document.body.classList.remove("not-loaded");
    document.querySelector(".reloadBtn").textContent = "Reload Page";
    const audio = document.getElementById("linkmp3");
    audio.play();
  } else {
    location.reload();
  }
}

document.body.addEventListener("click", function (e) {
  if (e.target.classList.contains("reloadBtn")) return;

  const x = e.clientX;
  const y = e.clientY;

  clickCount++;

  if (clickCount >= nextImageAfter) {
    // Tampilkan gambar
    const img = document.createElement("img");
    img.className = "image-bubble";
    img.src = randomImages[Math.floor(Math.random() * randomImages.length)];
    img.style.left = x + 20 + "px";
    img.style.top = y - 60 + "px";
    document.body.appendChild(img);

    setTimeout(() => {
      img.remove();
    }, 2000);

    // Reset hitungan
    clickCount = 0;
    nextImageAfter = getRandomInt(2, 4); // acak ulang untuk siklus selanjutnya
  } else {
    // Tampilkan teks
    const bubble = document.createElement("div");
    bubble.className = "heart-bubble";
    bubble.innerText =
      randomTexts[Math.floor(Math.random() * randomTexts.length)];
    bubble.style.left = x - 40 + "px";
    bubble.style.top = y - 20 + "px";
    document.body.appendChild(bubble);

    setTimeout(() => {
      bubble.remove();
    }, 2000);
  }
});
