// Progressive enhancement for the contact form. Without JS it native-POSTs to
// /api/contact (the Function redirects back with ?sent=1/0). With JS we submit
// via fetch and show an inline status, no page reload.
import { track } from './analytics';

const forms = document.querySelectorAll<HTMLFormElement>('form.contact-form');

forms.forEach(form => {
  const status = form.querySelector<HTMLElement>('.contact-status');
  const setStatus = (msg: string, ok: boolean) => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.state = ok ? 'ok' : 'error';
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const submit = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );
    if (submit) submit.disabled = true;
    setStatus('Sending…', true);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { accept: 'application/json', 'x-requested-with': 'fetch' },
        body: new FormData(form),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && json.ok) {
        form.reset();
        track('form_submit');
        setStatus(
          'Thanks! We received your message and will get back to you shortly.',
          true
        );
      } else {
        setStatus(
          json.error || 'Something went wrong. Please try again.',
          false
        );
      }
    } catch {
      setStatus('Network error. Please try again.', false);
    } finally {
      if (submit) submit.disabled = false;
    }
  });
});

export {};
