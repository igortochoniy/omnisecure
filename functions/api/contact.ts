// Cloudflare Pages Function — POST /api/contact
//
// Receives the contact-form submission, checks a honeypot, and emails it via the
// Resend API. The Astro site stays fully static; this runs on Cloudflare's edge.
// No secrets in the client — the Resend key lives in Cloudflare env vars.
//
// Env (Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY  — Resend API key (mark as Secret)
//   CONTACT_TO      — recipient inbox
//   CONTACT_FROM    — verified sender, e.g. "Site <noreply@yourdomain>".
//                     Defaults to Resend's shared onboarding sender (test only).

interface Env {
  RESEND_API_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM?: string;
  // Optional hardening / reliability (skipped when unset):
  TURNSTILE_SECRET?: string; // Cloudflare Turnstile secret → verify the token
  ALERT_WEBHOOK?: string; // Slack/Telegram/etc. webhook — pinged if a send fails
}

interface Ctx {
  request: Request;
  env: Env;
}

const MAX = {
  name: 120,
  email: 200,
  phone: 40,
  service: 80,
  message: 5000,
} as const;

// Verify a Cloudflare Turnstile token (only when TURNSTILE_SECRET is set).
async function turnstileOk(
  env: Env,
  token: string,
  ip: string
): Promise<boolean> {
  if (!env.TURNSTILE_SECRET) return true; // not configured → skip
  try {
    const body = new FormData();
    body.append('secret', env.TURNSTILE_SECRET);
    body.append('response', token || '');
    if (ip) body.append('remoteip', ip);
    const r = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body }
    );
    const j = (await r.json()) as { success?: boolean };
    return !!j.success;
  } catch {
    return false;
  }
}

// Last-resort alert + recoverable log so a failed send never loses a lead.
async function notifyFailure(
  env: Env,
  lead: Record<string, string>
): Promise<void> {
  console.error('[contact] send FAILED — lead:', JSON.stringify(lead));
  if (!env.ALERT_WEBHOOK) return;
  try {
    await fetch(env.ALERT_WEBHOOK, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: `⚠️ Contact form send failed. Lead: ${JSON.stringify(lead)}`,
      }),
    });
  } catch {
    /* swallow — we already logged */
  }
}

function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return input.replace(/[&<>"']/g, c => map[c]);
}

export const onRequestPost = async ({
  request,
  env,
}: Ctx): Promise<Response> => {
  const wantsJson =
    request.headers.get('x-requested-with') === 'fetch' ||
    (request.headers.get('accept') || '').includes('application/json');

  const reply = (ok: boolean, status: number, error?: string): Response => {
    if (wantsJson) {
      return new Response(
        JSON.stringify(ok ? { ok: true } : { ok: false, error }),
        { status, headers: { 'content-type': 'application/json' } }
      );
    }
    const url = new URL(ok ? '/?sent=1' : '/?sent=0', request.url);
    return Response.redirect(url.toString(), 303);
  };

  let data: Record<string, string> = {};
  try {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = (await request.json()) as Record<string, string>;
    } else {
      const form = await request.formData();
      form.forEach((value, key) => {
        data[key] = typeof value === 'string' ? value : '';
      });
    }
  } catch {
    return reply(false, 400, 'Invalid request.');
  }

  // Honeypot: bots fill the hidden field. Pretend success, send nothing.
  if (data._gotcha) return reply(true, 200);

  // Spam: optional Cloudflare Turnstile (invisible). No-op when unconfigured.
  const ip = request.headers.get('CF-Connecting-IP') || '';
  if (!(await turnstileOk(env, data['cf-turnstile-response'], ip))) {
    return reply(
      false,
      403,
      'Could not verify you are human. Please try again.'
    );
  }

  const name = (data.name || '').trim().slice(0, MAX.name);
  const email = (data.email || '').trim().slice(0, MAX.email);
  const phone = (data.phone || '').trim().slice(0, MAX.phone);
  const service = (data.service || '').trim().slice(0, MAX.service);
  const message = (data.message || '').trim().slice(0, MAX.message);

  if (!name || (!phone && !email && !message)) {
    return reply(false, 422, 'Please enter your name and a way to reach you.');
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
    return reply(false, 500, 'The form is not configured yet. Please call us.');
  }

  const html =
    '<h2 style="margin:0 0 12px">New enquiry</h2>' +
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
    `<p><strong>Email:</strong> ${escapeHtml(email) || '—'}</p>` +
    `<p><strong>Phone:</strong> ${escapeHtml(phone) || '—'}</p>` +
    `<p><strong>Service:</strong> ${escapeHtml(service) || '—'}</p>` +
    `<p><strong>Message:</strong> ${escapeHtml(message) || '—'}</p>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM || 'Website <onboarding@resend.dev>',
        to: [env.CONTACT_TO],
        subject: `New enquiry from ${name}`,
        html,
      }),
    });
    if (!res.ok) {
      await notifyFailure(env, { name, email, phone, message });
      return reply(
        false,
        502,
        'We could not send your message right now. Please try again.'
      );
    }
  } catch {
    await notifyFailure(env, { name, email, phone, message });
    return reply(
      false,
      502,
      'We could not send your message right now. Please try again.'
    );
  }

  return reply(true, 200);
};
