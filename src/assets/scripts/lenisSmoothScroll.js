import '@styles/lenis.css';

import Lenis from 'lenis';

// Script to handle Lenis library settings for smooth scrolling
// https://github.com/darkroomengineering/lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Route in-page anchor clicks through Lenis. Without this, the browser's native
// hash jump fights Lenis's rAF loop: Lenis animates the scroll back toward its
// own internal target, so the page snaps back to the top and the target section
// ends up hidden under the hero. lenis.scrollTo() sets Lenis's target to the
// destination, so there's no fight. It scrolls to the TOP of the element,
// honoring each target's CSS scroll-margin-top (no centering).
function sameDocumentTarget(anchor) {
  const href = anchor.getAttribute('href');
  if (!href) return null;
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return null;

  // Only same-document links: '#id', '/#id' or '/current-path#id'. A link to a
  // different path must navigate normally.
  const path = href.slice(0, hashIndex);
  const here = location.pathname.replace(/\/$/, '');
  if (path && path !== '/' && path.replace(/\/$/, '') !== here) return null;

  const id = href.slice(hashIndex + 1);
  return id ? document.getElementById(id) : null;
}

document.addEventListener('click', event => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  const anchor = event.target.closest?.('a[href*="#"]');
  if (!anchor) return;

  const target = sameDocumentTarget(anchor);
  if (!target) return;

  event.preventDefault();
  // Compute the absolute destination from the offsetTop chain (layout position),
  // NOT getBoundingClientRect: the target often still carries its unrevealed
  // reveal transform (translateY) at click time, which would skew a rect-based
  // measurement. Pass Lenis a number — its own element measurement lands ~74px
  // off here. Subtract scroll-margin-top so it lands at the top of the element.
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  let top = 0;
  for (let el = target; el; el = el.offsetParent) top += el.offsetTop;
  const destination = Math.max(0, top - margin);
  lenis.scrollTo(destination);
  history.pushState(null, '', anchor.getAttribute('href'));
});
