// RAYO deck viewer — keyboard, wheel, swipe, click-zones, hash sync, per-slide video.

const deck = document.getElementById("deck");
if (deck) {
  const slides = Array.from(deck.querySelectorAll<HTMLElement>(".slide"));
  const bar = document.getElementById("bar")!;
  const countCur = document.getElementById("count-cur")!;
  const hint = document.getElementById("hint")!;
  const fsBtn = document.getElementById("fs")!;
  const total = slides.length;

  let index = 0;
  const clamp = (n: number) => Math.max(0, Math.min(total - 1, n));

  function warm(i: number) {
    const el = slides[i];
    if (!el) return;
    const img = el.querySelector("img");
    if (img && img.loading === "lazy") img.loading = "eager";
    const vid = el.querySelector("video");
    if (vid && vid.preload === "metadata") vid.preload = "auto";
  }

  function show(n: number) {
    index = clamp(n);
    slides.forEach((el, i) => {
      const on = i === index;
      el.classList.toggle("on", on);
      el.setAttribute("aria-hidden", String(!on));
      const vid = el.querySelector("video");
      if (vid) {
        if (on) {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        } else {
          vid.pause();
        }
      }
    });
    bar.style.width = `${((index + 1) / total) * 100}%`;
    countCur.textContent = String(index + 1).padStart(2, "0");
    if (index > 0) hint.classList.add("gone");
    if (location.hash !== `#${index + 1}`)
      history.replaceState(null, "", `#${index + 1}`);
    warm(index + 1);
    warm(index - 1);
  }

  const next = () => show(index + 1);
  const prev = () => show(index - 1);

  deck.querySelectorAll<HTMLElement>("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () =>
      btn.dataset.nav === "next" ? next() : prev(),
    );
  });

  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.();
  }
  fsBtn.addEventListener("click", toggleFs);

  // keyboard
  addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case "PageDown":
      case " ":
        e.preventDefault();
        next();
        break;
      case "ArrowLeft":
      case "ArrowUp":
      case "PageUp":
        e.preventDefault();
        prev();
        break;
      case "Home":
        e.preventDefault();
        show(0);
        break;
      case "End":
        e.preventDefault();
        show(total - 1);
        break;
      case "f":
      case "F":
        toggleFs();
        break;
    }
  });

  // wheel / trackpad — scroll to advance
  let wheelLock = false;
  let wheelAcc = 0;
  addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      if (wheelLock) return;
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAcc += d;
      if (Math.abs(wheelAcc) > 40) {
        wheelAcc > 0 ? next() : prev();
        wheelAcc = 0;
        wheelLock = true;
        setTimeout(() => (wheelLock = false), 620);
      }
    },
    { passive: false },
  );

  // touch swipe
  let x0: number | null = null;
  let y0 = 0;
  addEventListener(
    "touchstart",
    (e) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    },
    { passive: true },
  );
  addEventListener(
    "touchend",
    (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      const dy = e.changedTouches[0].clientY - y0;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 44) {
        if (Math.abs(dx) >= Math.abs(dy)) dx < 0 ? next() : prev();
        else dy < 0 ? next() : prev();
      }
      x0 = null;
    },
    { passive: true },
  );

  addEventListener("hashchange", () => {
    const n = parseInt(location.hash.slice(1), 10);
    if (Number.isInteger(n) && n >= 1 && n <= total) show(n - 1);
  });

  const start = parseInt(location.hash.slice(1), 10);
  show(Number.isInteger(start) && start >= 1 && start <= total ? start - 1 : 0);
  deck.focus({ preventScroll: true });
}
