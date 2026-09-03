// RAYO case gallery — draggable, auto-rotating coverflow. Centre image in focus,
// the others fanned around it; pull to spin, click an image to enlarge.

const cf = document.querySelector<HTMLElement>("[data-cf]");
const lightbox = document.querySelector<HTMLElement>("[data-lightbox]");

if (cf && lightbox) {
  const cells = Array.from(cf.querySelectorAll<HTMLElement>("[data-cf-cell]"));
  const dots = Array.from(cf.querySelectorAll<HTMLButtonElement>("[data-cf-dot]"));
  const lbImg = lightbox.querySelector<HTMLImageElement>("[data-lb-img]")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const N = cells.length;

  let pos = 0; // rendered position (float); nearest int = centred cell
  let target = 0; // eased goal
  let dragging = false;
  let startX = 0;
  let startPos = 0;
  let lastX = 0;
  let lastMove = 0;
  let vel = 0; // cells / ms, for fling
  let idleUntil = 0; // autoplay resumes after this timestamp
  let visible = true;

  const spread = () => Math.min(innerWidth * 0.36, 360);

  function wrap(d: number) {
    d = ((d % N) + N) % N;
    if (d > N / 2) d -= N;
    return d;
  }

  function render() {
    const S = spread();
    for (let i = 0; i < N; i++) {
      const rel = wrap(i - pos);
      const a = Math.abs(rel);
      const x = rel * S;
      const rotY = Math.max(-1.4, Math.min(1.4, rel)) * -16;
      const scale = Math.max(0.5, 1 - a * 0.16);
      const opacity = a > 3.2 ? 0 : Math.max(0, 1 - a * 0.34);
      const el = cells[i];
      el.style.transform =
        `translate3d(-50%,-50%,0) translateX(${x.toFixed(1)}px) ` +
        `rotateY(${rotY.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.zIndex = String(500 - Math.round(a * 10));
      el.style.pointerEvents = a < 0.5 ? "auto" : a < 2.5 ? "auto" : "none";
    }
    const centre = ((Math.round(pos) % N) + N) % N;
    dots.forEach((d, i) => d.setAttribute("aria-current", String(i === centre)));
  }

  let raf = 0;
  let lastT = 0;
  let nextAuto = performance.now() + 4200;
  function tick(t: number) {
    const dt = lastT ? Math.min(120, t - lastT) : 16;
    lastT = t;
    if (dragging) {
      nextAuto = t + 4200;
    } else {
      // gentle autoplay: advance one image every ~4.2s
      if (autoplayOn() && t > idleUntil && t > nextAuto) {
        target = Math.round(target) + 1;
        nextAuto = t + 4200;
      }
      // frame-rate independent easing
      const k = 1 - Math.pow(0.0008, dt / 1000);
      pos += (target - pos) * k;
      if (Math.abs(target - pos) < 0.0004) pos = target;
    }
    render();
    raf = requestAnimationFrame(tick);
  }

  function autoplayOn() {
    return !reduce && visible && lightbox!.hidden;
  }

  // --- drag ---
  function down(e: PointerEvent) {
    dragging = true;
    startX = lastX = e.clientX;
    startPos = pos;
    lastMove = performance.now();
    vel = 0;
    cf!.setPointerCapture(e.pointerId);
  }
  function move(e: PointerEvent) {
    if (!dragging) return;
    const now = performance.now();
    pos = startPos - (e.clientX - startX) / spread();
    const dt = Math.max(1, now - lastMove);
    vel = -(e.clientX - lastX) / spread() / dt; // cells per ms
    lastX = e.clientX;
    lastMove = now;
  }
  function up(e: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    try {
      cf!.releasePointerCapture(e.pointerId);
    } catch {}
    // fling: nudge the target by the release velocity, then snap to nearest
    const fling = Math.max(-2.2, Math.min(2.2, vel * 260));
    target = Math.round(pos + fling);
    vel = 0;
    idleUntil = performance.now() + 5000;
  }
  cf.addEventListener("pointerdown", down);
  cf.addEventListener("pointermove", move);
  cf.addEventListener("pointerup", up);
  cf.addEventListener("pointercancel", up);

  // --- arrows / dots / keyboard ---
  function step(dir: number) {
    target = Math.round(target) + dir;
    vel = 0;
    idleUntil = performance.now() + 5000;
  }
  cf.querySelectorAll<HTMLElement>("[data-cf-nav]").forEach((b) =>
    b.addEventListener("click", () => step(Number(b.dataset.cfNav))),
  );
  dots.forEach((d, i) =>
    d.addEventListener("click", () => {
      const centre = ((Math.round(pos) % N) + N) % N;
      target = Math.round(pos) + wrap(i - centre);
      vel = 0;
      idleUntil = performance.now() + 5000;
    }),
  );
  cf.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  });

  // pause autoplay when off-screen
  new IntersectionObserver(
    (ents) => ents.forEach((en) => (visible = en.isIntersecting)),
    { threshold: 0.2 },
  ).observe(cf);

  // --- lightbox ---
  let moved = 0;
  cf.addEventListener("pointerdown", () => (moved = 0));
  cf.addEventListener("pointermove", (e) => {
    if (dragging) moved = Math.max(moved, Math.abs(e.clientX - startX));
  });
  cf.querySelectorAll<HTMLButtonElement>("[data-open]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (moved > 6) {
        e.preventDefault();
        return;
      }
      const img = btn.querySelector("img");
      openLB(btn.dataset.full || img?.currentSrc || "", img?.alt || "");
    });
  });

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
  lightbox.addEventListener("click", (e) => {
    const t = e.target as HTMLElement;
    if (t === lightbox || t === lbImg || t.closest("[data-lb-close]")) closeLB();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox!.hidden) closeLB();
  });

  addEventListener("resize", render);
  render();
  raf = requestAnimationFrame(tick);
  void raf;
}
