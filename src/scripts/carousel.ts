// RAYO case carousel — drag, arrows, counter, keyboard, staggered card reveal.

const root = document.querySelector<HTMLElement>("[data-carousel]");
if (root) {
  const track = root.querySelector<HTMLElement>("[data-track]")!;
  const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-card]"));
  const prev = root.querySelector<HTMLButtonElement>('[data-g="prev"]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-g="next"]')!;
  const cur = root.querySelector<HTMLElement>("[data-g-cur]")!;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;

  function render() {
    cur.textContent = String(index + 1).padStart(2, "0");
    prev.disabled = index === 0;
    next.disabled = index === cards.length - 1;
    cards.forEach((c, i) => c.classList.toggle("is-active", i === index));
  }

  function go(i: number) {
    index = Math.max(0, Math.min(cards.length - 1, i));
    cards[index].scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
    render();
  }

  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  });

  // keep counter synced with manual scroll / swipe
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio < 0.6) continue;
          const i = cards.indexOf(e.target as HTMLElement);
          if (i !== -1 && i !== index) {
            index = i;
            render();
          }
        }
      },
      { root: track, threshold: [0.6] },
    );
    cards.forEach((c) => io.observe(c));
  }

  // pointer drag
  let down = false;
  let startX = 0;
  let startScroll = 0;
  let moved = 0;
  track.addEventListener("pointerdown", (e) => {
    down = true;
    moved = 0;
    startX = e.clientX;
    startScroll = track.scrollLeft;
    track.classList.add("dragging");
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    moved = Math.abs(dx);
    track.scrollLeft = startScroll - dx;
  });
  function endDrag(e: PointerEvent) {
    if (!down) return;
    down = false;
    track.classList.remove("dragging");
    try {
      track.releasePointerCapture(e.pointerId);
    } catch {}
    // settle to nearest card
    const c = track.getBoundingClientRect();
    const mid = c.left + c.width / 2;
    let best = 0;
    let bestD = Infinity;
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - mid);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    if (moved > 6) go(best);
  }
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  // block click navigation right after a drag
  track.addEventListener(
    "click",
    (e) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  render();
}
