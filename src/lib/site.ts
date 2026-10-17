/** Canonical production origin, configurable through `VITE_SITE_URL`. */
export const SITE_URL: string = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://www.saxmachineentertainment.com'
).replace(/\/$/, '');

export const absoluteUrl = (path: string): string =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
