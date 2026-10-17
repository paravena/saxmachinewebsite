import { Resend } from 'resend';
import {
  CONTACT_LIMITS,
  type ContactErrorCode,
  type ContactRequest,
  type ContactResponse,
} from '../../../types/contact';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const json = (body: ContactResponse, status: number): Response => Response.json(body, { status });

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

const clientIp = (request: Request): string | null =>
  request.headers.get('fly-client-ip') ??
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  null;

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

export async function POST(request: Request): Promise<Response> {
  const { RESEND_API_KEY, TURNSTILE_SECRET_KEY, CONTACT_TO, CONTACT_FROM } = process.env;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return fail('invalid_payload', 400);
  }

  const payload = parsePayload(raw);
  if (payload === null) return fail('invalid_payload', 400);

  if (!TURNSTILE_SECRET_KEY || !payload.turnstileToken) {
    console.error('turnstile not configured or token missing');
    return fail('captcha_failed', 403);
  }

  const human = await verifyTurnstile(
    TURNSTILE_SECRET_KEY,
    payload.turnstileToken,
    clientIp(request)
  );
  if (!human) return fail('captcha_failed', 403);

  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error('email delivery not configured');
    return fail('send_failed', 500);
  }

  const { subject, text } = buildEmail(payload);

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: [CONTACT_TO],
      replyTo: payload.email,
      subject,
      text,
    });

    if (error) {
      console.error('resend error', error);
      return fail('send_failed', 502);
    }
  } catch (error) {
    console.error('resend request failed', error);
    return fail('send_failed', 502);
  }

  return json({ ok: true }, 200);
}
