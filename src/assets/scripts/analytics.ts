// Lightweight, provider-agnostic conversion tracking. Fires events into
// Plausible or GA if present; no-op otherwise. Enable Cloudflare Web Analytics
// (free, cookieless) in the Pages dashboard for pageviews, and add a provider
// (Plausible / GA via the CMS headCode) if you want custom events to land.
export function track(event: string, props?: Record<string, unknown>): void {
  const w = window as unknown as {
    plausible?: (e: string, o?: { props?: Record<string, unknown> }) => void;
    gtag?: (t: string, e: string, p?: Record<string, unknown>) => void;
  };
  w.plausible?.(event, props ? { props } : undefined);
  w.gtag?.('event', event, props);
}

// Auto-track clicks on phone-number links — the key conversion for lead-gen.
document.addEventListener('click', e => {
  const a = (e.target as HTMLElement).closest('a[href^="tel:"]');
  if (a) track('call_click');
});
