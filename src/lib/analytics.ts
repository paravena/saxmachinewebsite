/**
 * Thin, vendor-agnostic analytics wrapper.
 *
 * Components never touch `window.gtag` / `window.plausible` directly: they call
 * `track(event, params)`. Swapping vendors only requires editing this file.
 *
 * Configuration (all optional, via `.env`):
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN  - cookieless analytics (no consent banner required)
 *   NEXT_PUBLIC_PLAUSIBLE_SRC     - self-hosted script URL (defaults to plausible.io)
 *   NEXT_PUBLIC_GA_ID             - GA4 measurement ID (requires a consent gate in the EU)
 */

export type AnalyticsEvent =
  | 'contact_form_submit'
  | 'contact_form_error'
  | 'whatsapp_click'
  | 'press_kit_download'
  | 'video_play'
  | 'language_switch'
  | 'outbound_click';

export type AnalyticsParams = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: AnalyticsParams }) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
const PLAUSIBLE_SRC =
  process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? 'https://plausible.io/js/script.js';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

let initialized = false;

const loadScript = (src: string, attrs: Record<string, string> = {}): void => {
  const script = document.createElement('script');
  script.src = src;
  script.defer = true;
  Object.entries(attrs).forEach(([key, value]) => script.setAttribute(key, value));
  document.head.appendChild(script);
};

export const initAnalytics = (): void => {
  if (initialized || typeof window === 'undefined') return;
  initialized = true;

  if (PLAUSIBLE_DOMAIN) {
    loadScript(PLAUSIBLE_SRC, { 'data-domain': PLAUSIBLE_DOMAIN });
  }

  if (GA_ID) {
    loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer!.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }
};

export const track = (event: AnalyticsEvent, params: AnalyticsParams = {}): void => {
  if (typeof window === 'undefined') return;

  window.plausible?.(event, Object.keys(params).length ? { props: params } : undefined);
  window.gtag?.('event', event, params);

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[analytics]', event, params);
  }
};
