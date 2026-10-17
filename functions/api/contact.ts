import {
  CONTACT_LIMITS,
  type ContactErrorCode,
  type ContactRequest,
  type ContactResponse,
} from '../../src/types/contact';

interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
  CONTACT_TO: string;
  CONTACT_FROM: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: ContactResponse, status: number): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const fail = (code: ContactErrorCode, status: number): Response =>
  json({ ok: false, code }, status);

const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

type ParsedPayload = Omit<ContactRequest, 'turnstileToken'> & { turnstileToken: string };

const parsePayload = (raw: unknown): ParsedPayload | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const data = raw as Record<string, unknown>;

  const name = str(data.name);
  const email = str(data.email);
  const serviceType = str(data.serviceType);
  const message = str(data.message);
  const language = data.language === 'es' ? 'es' : 'en';
  const turnstileToken = str(data.turnstileToken);

  if (!name || name.length > CONTACT_LIMITS.name) return null;
  if (!email || email.length > CONTACT_LIMITS.email || !EMAIL_RE.test(email)) return null;
  if (!message || message.length > CONTACT_LIMITS.message) return null;
  if (serviceType.length > CONTACT_LIMITS.serviceType) return null;

  return { name, email, serviceType, message, language, turnstileToken };
};

const verifyTurnstile = async (
  secret: string,
  token: string,
  ip: string | null
): Promise<boolean> => {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
    });
    const outcome = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!outcome.success) {
      console.error('turnstile rejected', outcome['error-codes']);
      return false;
    }
    return true;
  } catch (error) {
    console.error('turnstile request failed', error);
    return false;
  }
};

const buildEmail = (payload: ParsedPayload) => {
  const isEn = payload.language === 'en';
  const subject = isEn
    ? `Booking inquiry · Sax Machine — ${payload.name}`
    : `Consulta de booking · Sax Machine — ${payload.name}`;

  const serviceType = payload.serviceType || (isEn ? 'Not specified' : 'No especificado');

  const text = isEn
    ? `Name / Company: ${payload.name}\nEmail: ${payload.email}\nService type: ${serviceType}\nSubmitted in: English\n\nMessage:\n${payload.message}\n`
    : `Nombre / Empresa: ${payload.name}\nEmail: ${payload.email}\nTipo de servicio: ${serviceType}\nEnviado en: Español\n\nMensaje:\n${payload.message}\n`;

  return { subject, text };
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail('invalid_payload', 400);
  }

  const payload = parsePayload(raw);
  if (payload === null) return fail('invalid_payload', 400);

  if (!env.TURNSTILE_SECRET_KEY || !payload.turnstileToken) {
    console.error('turnstile not configured or token missing');
    return fail('captcha_failed', 403);
  }

  const human = await verifyTurnstile(
    env.TURNSTILE_SECRET_KEY,
    payload.turnstileToken,
    request.headers.get('CF-Connecting-IP')
  );
  if (!human) return fail('captcha_failed', 403);

  const { subject, text } = buildEmail(payload);

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM,
        to: [env.CONTACT_TO],
        reply_to: payload.email,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      console.error('resend error', res.status, await res.text());
      return fail('send_failed', 502);
    }
  } catch (error) {
    console.error('resend request failed', error);
    return fail('send_failed', 502);
  }

  return json({ ok: true }, 200);
};

// Catch-all: Pages routes POST to `onRequestPost`, so anything reaching this
// handler used a method the endpoint does not support.
export const onRequest: PagesFunction<Env> = async () =>
  new Response(JSON.stringify({ ok: false, code: 'invalid_payload' } satisfies ContactResponse), {
    status: 405,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      allow: 'POST',
    },
  });
