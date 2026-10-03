// ===== [CATATAN-OBSERVER] =====
const pengamat = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("tampak");
    });
  },
  { threshold: 0.35 }
);

document.querySelectorAll(".ck-kartu").forEach((kartu) => pengamat.observe(kartu));
// ===== END [CATATAN-OBSERVER] =====
