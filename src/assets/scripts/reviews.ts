// Reviews carousel — 1:1 with the design's marquee. Two rows auto-scroll in
// opposite directions via a single rAF loop. Movement is accumulated in a float
// `pos` (NOT `scrollLeft += 0.2`, which loses the fractional step and stutters),
// then written to scrollLeft each frame. Pause on hover; mouse-drag to scrub
// (touch keeps native scroll/snap). Mobile: arrows page one card. Honours
// prefers-reduced-motion.
interface Marquee {
  row: HTMLElement;
  dir: number;
  pos: number;
  paused: boolean;
  dragging: boolean;
  half: () => number;
}

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = () => window.matchMedia('(max-width: 56.25rem)').matches;
const SPEED = 0.2; // px per frame

const rows = Array.from(document.querySelectorAll<HTMLElement>('.ms-marquee'));

const marquees: Marquee[] = rows.map(row => {
  const track = row.querySelector<HTMLElement>('.ms-marquee-track')!;
  const group = row.querySelector<HTMLElement>('.ms-marquee-group')!;
  // Duplicate the card group once so the loop is seamless; half() = one set.
  track.appendChild(group.cloneNode(true));

  const half = () => track.scrollWidth / 2;
  const dir = Number(row.dataset.dir || '1') < 0 ? -1 : 1;
  // Reverse row starts at its midpoint so it can scroll left.
  row.scrollLeft = dir < 0 ? half() : 0;

  const st: Marquee = { row, dir, pos: row.scrollLeft, paused: false, dragging: false, half };

  const wrap = () => {
    const h = st.half();
    if (h <= 0) return;
    if (row.scrollLeft >= h) row.scrollLeft -= h;
    else if (row.scrollLeft <= 0) row.scrollLeft += h;
  };

  // Pause on hover.
  row.addEventListener('mouseenter', () => (st.paused = true));
  row.addEventListener('mouseleave', () => {
    if (!st.dragging) st.paused = false;
  });

  // Drag to scrub (desktop pointers only; touch keeps native scroll/snap).
  let startX = 0;
  let startScroll = 0;
  let pointerId: number | null = null;
  row.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') {
      st.paused = true;
      return;
    }
    st.dragging = true;
    st.paused = true;
    pointerId = e.pointerId;
    startX = e.clientX;
    startScroll = row.scrollLeft;
    row.classList.add('dragging');
    try {
      row.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  });
  row.addEventListener('pointermove', e => {
    if (!st.dragging) return;
    row.scrollLeft = startScroll - (e.clientX - startX);
    wrap();
    st.pos = row.scrollLeft;
  });
  const end = () => {
    if (!st.dragging) return;
    st.dragging = false;
    st.paused = false;
    row.classList.remove('dragging');
    if (pointerId != null) {
      try {
        row.releasePointerCapture(pointerId);
      } catch {
        /* ignore */
      }
      pointerId = null;
    }
  };
  row.addEventListener('pointerup', end);
  row.addEventListener('pointercancel', end);

  return st;
});

// Single rAF loop drives every row (freezes on mobile — snap + arrows there).
if (!reduce && marquees.length) {
  const tick = () => {
    marquees.forEach(st => {
      if (st.paused || st.dragging || isMobile()) return;
      const h = st.half();
      st.pos += SPEED * st.dir;
      if (h > 0) {
        if (st.pos >= h) st.pos -= h;
        else if (st.pos < 0) st.pos += h;
      }
      st.row.scrollLeft = st.pos;
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Mobile prev/next arrows — page the first row one card at a time.
const nav = document.querySelector<HTMLElement>('.ms-rev-nav');
const primaryRow = rows[0];
if (nav && primaryRow) {
  const cards = primaryRow.querySelectorAll<HTMLElement>('.ms-rev-card');
  const stride = () =>
    cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 320;
  nav
    .querySelector('[data-dir="prev"]')
    ?.addEventListener('click', () =>
      primaryRow.scrollBy({ left: -stride(), behavior: 'smooth' })
    );
  nav
    .querySelector('[data-dir="next"]')
    ?.addEventListener('click', () =>
      primaryRow.scrollBy({ left: stride(), behavior: 'smooth' })
    );
}

export {};
