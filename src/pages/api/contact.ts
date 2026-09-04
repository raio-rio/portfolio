import type { APIRoute } from 'astro';

export const prerender = false;

const MAX_REQUEST_BYTES = 12_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9\s().-]{7,32}$/;

type ContactPayload = {
  email?: unknown;
  whatsapp?: unknown;
  message?: unknown;
  company?: unknown;
};

const json = (body: Record<string, unknown>, status = 200, initialHeaders?: HeadersInit) => {
  const headers = new Headers(initialHeaders);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('Cache-Control', 'no-store');

  return new Response(JSON.stringify(body), {
    status,
    headers,
  });
};

const normalizeString = (value: unknown) => typeof value === 'string' ? value.trim() : '';

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export const POST: APIRoute = async ({ request }) => {
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return json({ ok: false, message: 'Please submit the contact form normally.' }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return json({ ok: false, message: 'That message is too large to send.' }, 413);
  }

  let parsedPayload: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_REQUEST_BYTES) {
      return json({ ok: false, message: 'That message is too large to send.' }, 413);
    }
    parsedPayload = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, message: 'The submitted form could not be read.' }, 400);
  }

  if (!parsedPayload || typeof parsedPayload !== 'object' || Array.isArray(parsedPayload)) {
    return json({ ok: false, message: 'The submitted form could not be read.' }, 400);
  }
  const payload = parsedPayload as ContactPayload;

  const email = normalizeString(payload.email);
  const whatsapp = normalizeString(payload.whatsapp);
  const message = normalizeString(payload.message);
  const company = normalizeString(payload.company);

  // Bots commonly fill this visually hidden field. Return success without sending.
  if (company) return json({ ok: true, message: 'Message sent.' });

  const errors: Record<string, string> = {};
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (whatsapp && !PHONE_PATTERN.test(whatsapp)) {
    errors.whatsapp = 'Enter a valid WhatsApp number.';
  }
  if (message.length < 10 || message.length > 5_000) {
    errors.message = 'Your message must be between 10 and 5,000 characters.';
  }

  if (Object.keys(errors).length > 0) {
    return json({ ok: false, message: 'Please check the highlighted fields.', errors }, 422);
  }

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error('Contact form is missing its Resend environment configuration.');
    return json({ ok: false, message: 'Messaging is temporarily unavailable.' }, 503);
  }

  const safeEmail = escapeHtml(email);
  const safeWhatsapp = escapeHtml(whatsapp);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');
  const text = `Email: ${email}\n${whatsapp ? `WhatsApp: ${whatsapp}\n` : ''}\n${message}`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: 'New portfolio message',
        text,
        html: `
          <h1>New portfolio message</h1>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          ${whatsapp ? `<p><strong>WhatsApp:</strong> ${safeWhatsapp}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      }),
    });

    if (!response.ok) {
      console.error('Resend rejected a portfolio message.', response.status, await response.text());
      return json({ ok: false, message: 'Your message could not be sent right now.' }, 502);
    }

    return json({ ok: true, message: 'Message sent — I’ll get back to you soon.' });
  } catch (error) {
    console.error('Portfolio message delivery failed.', error);
    return json({ ok: false, message: 'Your message could not be sent right now.' }, 502);
  }
};

export const ALL: APIRoute = () => json(
  { ok: false, message: 'Method not allowed.' },
  405,
  { Allow: 'POST' },
);
