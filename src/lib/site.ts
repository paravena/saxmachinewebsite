/** Canonical production origin, configurable through `NEXT_PUBLIC_SITE_URL`. */
export const SITE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.saxmachineentertainment.com'
).replace(/\/$/, '');

export const absoluteUrl = (path: string): string =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
