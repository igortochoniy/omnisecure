// Lightweight scroll-reveal: fade `.reveal` blocks up as they enter the viewport.
// IntersectionObserver only (no GSAP) — keeps it off the critical path and tiny.
// Honours prefers-reduced-motion: jump straight to the visible state.
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const els = document.querySelectorAll<HTMLElement>('.reveal');

if (reduce || !('IntersectionObserver' in window)) {
  els.forEach(el => el.classList.add('is-visible'));
} else {
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = el.dataset.revealDelay;
        if (delay) el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-visible');
        obs.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );
  els.forEach(el => io.observe(el));
}

export {};
