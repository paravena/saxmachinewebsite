export interface ContactRequest {
  name: string;
  email: string;
  serviceType: string;
  message: string;
  language: 'en' | 'es';
  turnstileToken: string;
}

export type ContactErrorCode =
  'invalid_payload' | 'captcha_failed' | 'send_failed' | 'rate_limited';

export type ContactResponse = { ok: true } | { ok: false; code: ContactErrorCode };

export const CONTACT_LIMITS = {
  name: 120,
  email: 254,
  serviceType: 120,
  message: 5000,
} as const;
