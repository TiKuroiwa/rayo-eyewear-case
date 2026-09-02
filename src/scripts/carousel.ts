// RAYO case gallery — horizontal strip scrubbed by vertical scroll (and2es-style),
// centre image focal-scaled, click any image to enlarge (lightbox).

const section = document.querySelector<HTMLElement>(".gallery");
const strip = document.querySelector<HTMLElement>("[data-strip]");
const lightbox = document.querySelector<HTMLElement>("[data-lightbox]");

if (section && strip && lightbox) {
  const cells = Array.from(strip.querySelectorAll<HTMLElement>("[data-cell]"));
  const lbImg = lightbox.querySelector<HTMLImageElement>("[data-lb-img]")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let ticking = false;

  function layout() {
    const rect = section!.getBoundingClientRect();
    const travel = rect.height - innerHeight;
    // 0 when the section top reaches the viewport top, 1 when its bottom leaves
    const p = Math.min(1, Math.max(0, -rect.top / Math.max(1, travel)));
    const mid = innerWidth / 2;

    // centre the "focused" cell (interpolated) under the viewport middle
    const f = p * (cells.length - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(cells.length - 1, i0 + 1);
    const c0 = cells[i0].offsetLeft + cells[i0].offsetWidth / 2;
    const c1 = cells[i1].offsetLeft + cells[i1].offsetWidth / 2;
    const focusX = c0 + (c1 - c0) * (f - i0);
    if (!reduce)
      strip!.style.transform = `translate3d(${(mid - focusX).toFixed(1)}px,0,0)`;

    // focal scaling — smooth falloff, 2–3 cells visibly in play
    const range = innerWidth * 0.92;
    for (const cell of cells) {
      const r = cell.getBoundingClientRect();
      const d = Math.min(1, Math.abs(r.left + r.width / 2 - mid) / range);
      const k = d * d; // ease
      const scale = reduce ? 1 : 1 - k * 0.3;
      const opacity = 1 - k * 0.62;
      cell.style.transform = `scale(${scale.toFixed(3)})`;
      cell.style.opacity = opacity.toFixed(3);
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(layout);
    }
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", layout);
  layout();

  // --- lightbox ---
  let lastFocus: HTMLElement | null = null;

  function openLB(full: string, alt: string) {
    lastFocus = document.activeElement as HTMLElement;
    lbImg.src = full;
    lbImg.alt = alt;
    lightbox!.hidden = false;
    document.documentElement.style.overflow = "hidden";
    (lightbox!.querySelector("[data-lb-close]") as HTMLElement)?.focus();
  }
  function closeLB() {
    lightbox!.hidden = true;
    lbImg.removeAttribute("src");
    document.documentElement.style.overflow = "";
    lastFocus?.focus();
  }

  strip.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      openLB(btn.dataset.full || img?.currentSrc || "", img?.alt || "");
    });
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || (e.target as HTMLElement).closest("[data-lb-close]") || e.target === lbImg)
      closeLB();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox!.hidden) closeLB();
  });
}
