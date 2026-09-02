// RAYO scroll deck — scroll-driven slide transitions (zoom + fade through black),
// progress bar, counter, per-slide video, keyboard / arrow jumps, hash deep-links.

const deck = document.getElementById("deck");
if (deck) {
  const sections = Array.from(
    deck.querySelectorAll<HTMLElement>("[data-slide]"),
  );
  const frames = sections.map((s) => s.querySelector<HTMLElement>(":scope > .frame"));
  const bar = document.getElementById("bar")!;
  const countCur = document.getElementById("count-cur")!;
  const hint = document.getElementById("hint")!;
  const fsBtn = document.getElementById("fs")!;
  const root = document.documentElement;
  const total = sections.length;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let current = 0;

  function setActive(i: number) {
    if (i === current || i < 0 || i >= total) return;
    current = i;
    countCur.textContent = String(i + 1).padStart(2, "0");
    if (i > 0) hint.classList.add("gone");
    const hash = `#${sections[i].id}`;
    if (location.hash !== hash) history.replaceState(null, "", hash);
    warm(i + 1);
  }

  function warm(i: number) {
    const el = sections[i];
    if (!el) return;
    el.querySelectorAll<HTMLImageElement>("img[loading=lazy]").forEach(
      (img) => (img.loading = "eager"),
    );
    const vid = el.querySelector("video");
    if (vid && vid.preload === "metadata") vid.preload = "auto";
  }

  // video play/pause when a slide is on screen
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const vid = (e.target as HTMLElement).querySelector("video");
        if (vid) {
          if (e.isIntersecting && e.intersectionRatio > 0.4)
            vid.play().catch(() => {});
          else vid.pause();
        }
      }
    },
    { threshold: [0, 0.4, 0.8] },
  );
  sections.forEach((s) => io.observe(s));

  // --- scroll: progress + active + slide transitions ---
  let ticking = false;
  function onScroll() {
    const max = root.scrollHeight - innerHeight;
    bar.style.width = `${max > 0 ? Math.min(100, Math.max(0, (scrollY / max) * 100)) : 0}%`;

    const mid = innerHeight / 2;
    for (let i = 0; i < sections.length; i++) {
      const r = sections[i].getBoundingClientRect();

      // active = section crossing the viewport middle
      if (r.top <= mid && r.bottom > mid) setActive(i);

      const f = frames[i];
      if (!f) continue;
      if (r.bottom < -40 || r.top > innerHeight + 40) continue;

      if (reduce) {
        f.style.transform = "none";
        f.style.opacity = "1";
        continue;
      }

      const t = r.top / innerHeight; // +1 below · 0 aligned · -1 above
      let scale = 1;
      let opacity = 1;
      if (t > 0.002) {
        const e = Math.min(1, t);
        scale = 1 + e * 0.04;
        opacity = 1 - e * 0.72;
      } else if (t < -0.002) {
        const l = Math.min(1, -t);
        scale = 1 - l * (i === 0 ? 0.4 : 0.17);
        opacity = 1 - l * 1.1;
      }
      f.style.transform = `scale(${scale.toFixed(4)})`;
      f.style.opacity = `${Math.max(0, opacity).toFixed(3)}`;
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
  addEventListener("resize", onScroll);
  onScroll();

  // --- jump to a section ---
  let snapTimer = 0;
  function restoreSnap() {
    root.style.scrollSnapType = "";
    clearTimeout(snapTimer);
    removeEventListener("scrollend", restoreSnap);
  }
  function goTo(i: number) {
    const n = Math.max(0, Math.min(total - 1, i));
    setActive(n);
    root.style.scrollSnapType = "none";
    clearTimeout(snapTimer);
    removeEventListener("scrollend", restoreSnap);
    sections[n].scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      block: "start",
    });
    addEventListener("scrollend", restoreSnap, { once: true });
    snapTimer = window.setTimeout(restoreSnap, 1600);
  }

  document
    .querySelectorAll<HTMLElement>("[data-nav]")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        goTo(current + (btn.dataset.nav === "next" ? 1 : -1)),
      ),
    );

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

  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else root.requestFullscreen?.();
  }
  fsBtn.addEventListener("click", toggleFs);

  function fromHash() {
    const id = location.hash.slice(1);
    const i = sections.findIndex((s) => s.id === id);
    if (i >= 0 && i !== current) requestAnimationFrame(() => goTo(i));
  }
  addEventListener("hashchange", fromHash);
  if (location.hash) fromHash();
}
