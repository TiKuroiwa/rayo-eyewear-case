// RAYO scroll deck — reveal on scroll, progress bar, counter, per-slide video,
// keyboard / arrow jumps, hash deep-links.

const deck = document.getElementById("deck");
if (deck) {
  const sections = Array.from(deck.querySelectorAll<HTMLElement>(".slide"));
  const bar = document.getElementById("bar")!;
  const countCur = document.getElementById("count-cur")!;
  const hint = document.getElementById("hint")!;
  const fsBtn = document.getElementById("fs")!;
  const root = document.documentElement;
  const total = sections.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // `current` is authoritative for nav intent; scrolling keeps it in sync.
  let current = 0;

  function setActive(i: number) {
    if (i === current) return;
    current = i;
    countCur.textContent = String(i + 1).padStart(2, "0");
    if (i > 0) hint.classList.add("gone");
    const hash = `#s${i + 1}`;
    if (location.hash !== hash) history.replaceState(null, "", hash);
    warm(i + 1);
  }

  function warm(i: number) {
    const el = sections[i];
    if (!el) return;
    const img = el.querySelector("img");
    if (img && img.loading === "lazy") img.loading = "eager";
    const vid = el.querySelector("video");
    if (vid && vid.preload === "metadata") vid.preload = "auto";
  }

  // --- reveal + active tracking + video playback ---
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const el = e.target as HTMLElement;
        const i = Number(el.dataset.slide);
        if (e.isIntersecting) el.classList.add("in");

        const vid = el.querySelector("video");
        if (vid) {
          if (e.intersectionRatio > 0.55) vid.play().catch(() => {});
          else vid.pause();
        }

        if (e.intersectionRatio > 0.55) setActive(i);
      }
    },
    { threshold: [0, 0.55, 1] },
  );
  sections.forEach((s) => io.observe(s));

  // --- scroll progress bar + parallax drift ---
  const frames = sections.map((s) => s.querySelector<HTMLElement>(".frame"));
  const AMP = reduce ? 0 : 0.05; // fraction of viewport height
  let ticking = false;
  function onScroll() {
    const max = root.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    bar.style.width = `${p * 100}%`;

    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();
      // reveal anything that has reached the viewport (belt-and-braces with the IO)
      if (r.top < innerHeight * 0.85 && r.bottom > innerHeight * 0.15)
        sections[i].classList.add("in");
      if (r.bottom < -80 || r.top > innerHeight + 80) continue;
      if (AMP) {
        const centre = (r.top + r.height / 2) / innerHeight; // 0.5 = centred
        const py = Math.max(-1, Math.min(1, 0.5 - centre)) * AMP * innerHeight;
        frames[i]?.style.setProperty("--py", `${py.toFixed(1)}px`);
      }
    }
    ticking = false;
  }
  addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  // --- jump to a slide ---
  let snapTimer = 0;
  function restoreSnap() {
    root.style.scrollSnapType = "";
    clearTimeout(snapTimer);
    removeEventListener("scrollend", restoreSnap);
  }
  function goTo(i: number) {
    const n = Math.max(0, Math.min(total - 1, i));
    setActive(n); // update intent immediately so rapid presses chain
    root.style.scrollSnapType = "none"; // snap can cancel a programmatic scroll
    clearTimeout(snapTimer);
    removeEventListener("scrollend", restoreSnap);
    sections[n].scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    addEventListener("scrollend", restoreSnap, { once: true });
    snapTimer = window.setTimeout(restoreSnap, 1600); // fallback
  }

  document
    .querySelectorAll<HTMLElement>("[data-nav]")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        goTo(current + (btn.dataset.nav === "next" ? 1 : -1)),
      ),
    );

  // --- keyboard ---
  addEventListener("keydown", (e) => {
    if (e.key === "PageDown" || (e.key === "ArrowDown" && e.shiftKey)) {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === "PageUp" || (e.key === "ArrowUp" && e.shiftKey)) {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(total - 1);
    } else if (e.key === "f" || e.key === "F") {
      toggleFs();
    }
  });

  // --- fullscreen ---
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else root.requestFullscreen?.();
  }
  fsBtn.addEventListener("click", toggleFs);

  // --- hash deep-link ---
  function fromHash() {
    const m = location.hash.match(/^#s(\d+)$/);
    if (m) {
      const i = parseInt(m[1], 10) - 1;
      if (i >= 0 && i < total && i !== current)
        requestAnimationFrame(() => goTo(i));
    }
  }
  addEventListener("hashchange", fromHash);
  if (location.hash) fromHash();
}
