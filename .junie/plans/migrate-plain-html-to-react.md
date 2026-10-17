---
sessionId: session-261014-234134-gj5h
---

# Requirements

### Overview & Goals
Replace the contact form's `mailto:` hand-off with a real server-side submission path running on **Cloudflare Pages Functions**, so booking inquiries are actually delivered to the duo's inbox, protected from spam by **Cloudflare Turnstile**, and confirmed to the visitor without ever leaving the site.

Today `handleSubmit` in `src/components/sections/ContactSection.tsx` builds a subject/body and assigns `window.location.href = 'mailto:...'`. Visitors without a configured mail client lose the lead silently, the duo never learns a submission happened, and the `contact_form_submit` analytics event fires on *intent* rather than delivery.

**Current phase — production configuration.** All application code (Steps 1–4) is implemented and verified. The real domain **`saxmachineentertainment.com`** is now live in Cloudflare and verified in Resend, and a Resend API key exists. What remains is replacing the `saxmachine.cl` placeholder throughout the repo, pointing `CONTACT_FROM` at `noreply@saxmachineentertainment.com`, creating the Turnstile widget, and activating `VITE_TURNSTILE_SITE_KEY` so the form leaves `mailto:` fallback mode.

**Blocking issue — the Cloudflare Pages build never reaches the compile phase.** `npm clean-install` aborts with `npm error code E401 / Incorrect or missing password`. This is a packaging problem, not a code defect: `package-lock.json` was generated on a machine whose global `~/.npmrc` sets `registry=https://npm.artifacts.indeed.tech/npm/`, so **all 448 `resolved` URLs in the lockfile point at that private Artifactory** and none at `registry.npmjs.org`. Cloudflare's build container has no credentials for that host, so every dependency fetch is rejected. There is no project-level `.npmrc` to override the user-level one. This must be fixed before any deployment step can succeed.

### Scope

**In Scope**
- A Cloudflare Pages Function at `functions/api/contact.ts` that validates the payload, verifies Turnstile, and sends the email through **Resend**.
- Reworking `ContactSection.tsx` into a real async form with `idle | submitting | success | error` states, inline feedback, and a disabled button while in flight.
- Cloudflare Turnstile widget rendered in the form and verified server-side.
- New ES/EN i18n keys for the sending / success / error / validation states, preserving the existing compile-time completeness check.
- Truthful analytics: `contact_form_submit` fires only after a `200`; a new `contact_form_error` event covers failures.
- Graceful degradation: if the Turnstile site key or the API endpoint is unavailable, the form falls back to today's `mailto:` behaviour so the site never regresses.
- Local development support via `wrangler pages dev` and `.dev.vars`.
- Step-by-step Cloudflare setup guidance (Pages project, DNS, secrets, Turnstile keys, Resend domain verification).
- **Build reproducibility**: a committed `.npmrc` pinning the public npm registry plus a regenerated `package-lock.json`, so `npm ci` works in any credential-free CI environment; a `.nvmrc` pinning Node **24** via its canonical LTS codename `lts/krypton`, matching the `nodejs@24.21.0` runtime Cloudflare Pages already detects.
- **Production configuration**: replace the `https://www.saxmachine.cl` placeholder with `https://www.saxmachineentertainment.com` in `.env`, `src/lib/site.ts` and `vite.config.ts`; set `CONTACT_FROM` to `Sax Machine <noreply@saxmachineentertainment.com>` in `wrangler.toml` and `.dev.vars.example`; create the Turnstile widget and wire its site key.

**Out of Scope**
- Persisting leads to Workers KV or D1 (the function logs and emails only).
- An auto-reply email to the visitor.
- Migrating any other part of the site to a server-rendered or framework-adapter setup.
- Replacing the WhatsApp floating button or contact list links.

### User Stories
- **As a cruise-line entertainment manager**, I want to submit the booking form and immediately see a confirmation on the page, so I know my inquiry was received without having to open an email client.
- **As the duo (site owner)**, I want every submission delivered to `saxmachinee@gmail.com` with the visitor's email in the reply-to field, so I can reply directly from my inbox.
- **As the duo**, I want bots blocked before they can send anything, so the inbox stays usable.
- **As a developer**, I want the mail provider's API key to live in a Cloudflare secret rather than a `VITE_`-prefixed variable, so it is never shipped in the client bundle.

### Functional Requirements
- **Submission**: the form `POST`s JSON to `/api/contact` on the same origin. Fields: `name`, `email`, `serviceType`, `message`, `language`, plus the Turnstile token.
- **Validation**: both client and function require a non-empty `name`, a syntactically valid `email`, and a non-empty `message`; `serviceType` defaults to the "onboard" option. The function rejects oversized payloads (name > 120, message > 5000 chars) with `400`.
- **Turnstile**: the widget must be solved before the submit button is enabled; the function rejects any request whose token fails `siteverify` with `403`.
- **States & feedback**:
  - `submitting` — button disabled, label swaps to the localized "Sending…" string.
  - `success` — form fields clear and an inline success panel appears ("Thanks, we'll reply within 24h").
  - `error` — an inline error panel appears **with a `mailto:` link as a fallback**, so the path is never a dead end.
- **Email content**: subject `Booking inquiry · Sax Machine — {name}`; body carries all fields plus the submission language; `Reply-To` is set to the visitor's address.
- **Localization**: every new state string exists in both `src/i18n/en/contact.ts` and `src/i18n/es/contact.ts`; the existing `contact.form.note` text (which currently promises the email app will open) is rewritten.
- **Method guard**: `/api/contact` responds `405` to anything other than `POST`.

### Non-Functional Requirements
- **Secrets**: `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` are Cloudflare Pages secrets, never bundled. Only `VITE_TURNSTILE_SITE_KEY` (public by design) reaches the client.
- **Accessibility**: status panels use `role="status"` / `aria-live="polite"`; the invalid state is announced and keyboard-reachable; `npm run lint` (with `jsx-a11y`) stays clean.
- **No new runtime dependencies** in the client bundle — Turnstile loads as an external script, and the function uses `fetch` only.
- **Cost**: stays entirely within Cloudflare Pages' free tier and Resend's 3,000 emails/month free tier.

# Technical Design

### Current Implementation
- `src/components/sections/ContactSection.tsx` (225 lines) — renders the contact info list, the two brochure links, and a controlled form held in a single `ContactFormData` state object. `handleSubmit` (lines 21–41) calls `track('contact_form_submit', …)` then redirects to `mailto:`. `BOOKING_EMAIL` is hardcoded at line 8 and reused in the contact list.
- `src/lib/analytics.ts` — vendor-agnostic `track(event, params)` with a union `AnalyticsEvent` type; `contact_form_submit` is already a member.
- `src/i18n/en/contact.ts` / `es/contact.ts` — flat dotted-key dictionaries; `TranslationKey` is derived from the English dictionary, so any key added to `en` **must** be added to `es` or `tsc` fails.
- `vite.config.ts` — contains a custom plugin that emits `robots.txt` / `sitemap.xml` from `VITE_SITE_URL`; `.env` holds only public `VITE_*` placeholders and is intentionally committed.
- There is currently **no** `functions/` directory and no server-side code of any kind.

### Key Decisions

1. **Cloudflare Pages Functions, not a standalone Worker** *(confirmed with user)*
   The function lives in `functions/api/contact.ts` inside this repo. Cloudflare Pages auto-discovers the `functions/` directory and routes it by file path, so the endpoint is served from the **same origin** as the site — no CORS preflight, no second deploy pipeline, one `wrangler`/Git deploy for both.

2. **Resend as the mail provider** *(confirmed with user)*
   Cloudflare Workers have no raw TCP/SMTP, so mail must go out over HTTPS. MailChannels' free Workers integration was discontinued in 2024, leaving Resend as the best free option (3k/month, clean REST API). It is called with plain `fetch` — the `resend` npm SDK is **not** installed, keeping the function dependency-free.

3. **Cloudflare Turnstile for spam** *(confirmed with user)*
   Already available in the user's Cloudflare account, free, privacy-friendly (no cookie consent implications, unlike reCAPTCHA), and verified server-side via `https://challenges.cloudflare.com/turnstile/v0/siteverify`. The widget script is loaded lazily by a small `useTurnstile` hook rather than a React wrapper package.

4. **`mailto:` retained as a fallback, not deleted**
   If `VITE_TURNSTILE_SITE_KEY` is unset (e.g. before the user finishes Cloudflare setup, or on a plain `vite dev` run) the component renders in "legacy mode" and behaves exactly as today. The same `mailto:` link is also surfaced inside the error panel. This means the change is safe to merge before any Cloudflare configuration exists.

5. **Shared request/response contract in `src/types/contact.ts`**
   The function and the component both import the same `ContactRequest` / `ContactResponse` types, so a field rename breaks the build rather than production.

6. **Cloudflare Pages is the host — GitHub Pages is not viable**
   GitHub Pages serves **static files only**; it has no serverless runtime, so `functions/api/contact.ts` would never execute and `POST /api/contact` would return GitHub's 404 page, silently stranding the form in `mailto:` legacy mode. GitHub stays the **source of truth** (`origin git@github.com:paravena/saxmachinewebsite.git`, branch `main`); Cloudflare Pages connects to that repo and builds it, so pushing to `main` remains the deploy trigger — the developer workflow is identical, only the serving host differs. The custom domain is attached to the Pages project, not to GitHub.

### Proposed Changes

**Server side.** A new `functions/api/contact.ts` exports `onRequestPost` (and `onRequest` for the `405` guard). It parses JSON, runs the same validation the client does, posts the Turnstile token to `siteverify` with the visitor's `CF-Connecting-IP`, and on success posts to `https://api.resend.com/emails` with `Authorization: Bearer ${env.RESEND_API_KEY}`. It returns a typed JSON body and never leaks the provider's error text to the client — failures are logged with `console.error` (visible in `wrangler pages deployment tail`) and surfaced as a generic `error` code.

**Client side.** `ContactSection.tsx` gains a `status` state and an async `handleSubmit` that `fetch`es `/api/contact`. The Turnstile widget renders in a `<div>` managed by a new `useTurnstile` hook (`src/hooks/useTurnstile.ts`) which injects the Cloudflare script once, renders the widget into the ref, exposes the solved token, and resets the widget after each submit (tokens are single-use). The submit `Button` is disabled while `submitting` or while the token is missing.

**Analytics.** `contact_form_error` is added to the `AnalyticsEvent` union in `src/lib/analytics.ts`. `contact_form_submit` moves to *after* a successful response and carries `{ service_type, language, transport: 'api' | 'mailto' }`.

**Config.** `.env` gains a commented `VITE_TURNSTILE_SITE_KEY`; a new `.dev.vars.example` documents the two server secrets, and `.dev.vars` is added to `.gitignore`. `package.json` gets `dev:functions` (`wrangler pages dev -- npm run dev`) and `deploy` scripts, plus `wrangler` as a devDependency. `vite-env.d.ts` declares the new client var.

**Styling.** `src/styles/globals.css` gains `.form-status`, `.form-status.success`, `.form-status.error` and `.turnstile-box` rules reusing the existing gold/navy tokens.

### Data Models / Contracts

```ts
// src/types/contact.ts — shared by the client and the Pages Function
export interface ContactRequest {
  name: string;
  email: string;
  serviceType: string;
  message: string;
  language: 'en' | 'es';
  turnstileToken: string;
}

export type ContactErrorCode =
  | 'invalid_payload'
  | 'captcha_failed'
  | 'send_failed'
  | 'rate_limited';

export type ContactResponse =
  | { ok: true }
  | { ok: false; code: ContactErrorCode };
```

```ts
// functions/api/contact.ts
interface Env {
  RESEND_API_KEY: string;      // Pages secret
  TURNSTILE_SECRET_KEY: string; // Pages secret
  CONTACT_TO: string;           // plain var, e.g. saxmachinee@gmail.com
  CONTACT_FROM: string;         // plain var, e.g. "Sax Machine <web@saxmachine.cl>"
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => { /* … */ };
```

```ts
// src/hooks/useTurnstile.ts
export function useTurnstile(siteKey: string | undefined): {
  containerRef: React.RefObject<HTMLDivElement>;
  token: string | null;
  reset: () => void;
  enabled: boolean; // false when siteKey is unset -> mailto fallback
};
```

### File Structure

```
saxmachinewebsite/
├── functions/
│   └── api/
│       └── contact.ts          # NEW — Pages Function (POST /api/contact)
├── src/
│   ├── components/sections/
│   │   └── ContactSection.tsx   # MODIFIED — async submit, status panels, Turnstile
│   ├── hooks/
│   │   └── useTurnstile.ts      # NEW — loads + renders the Turnstile widget
│   ├── i18n/{en,es}/contact.ts  # MODIFIED — new state strings, rewritten note
│   ├── lib/analytics.ts         # MODIFIED — contact_form_error event
│   ├── styles/globals.css       # MODIFIED — .form-status, .turnstile-box
│   ├── types/contact.ts         # NEW — shared request/response contract
│   └── vite-env.d.ts            # MODIFIED — VITE_TURNSTILE_SITE_KEY
├── .dev.vars.example            # NEW — documents server secrets for wrangler
├── .env                         # MODIFIED — VITE_TURNSTILE_SITE_KEY placeholder
├── .gitignore                   # MODIFIED — ignore .dev.vars
├── .npmrc                       # NEW — pins registry.npmjs.org for CI builds
├── .nvmrc                       # NEW — `lts/krypton` (Node 24 LTS codename)
├── package.json                 # MODIFIED — wrangler dev/deploy scripts
├── package-lock.json            # REGENERATED — public registry resolved URLs
└── wrangler.toml                # NEW — Pages project name, compat date, vars
```

### Architecture Diagram

```mermaid
graph LR
  U[Visitor] --> F[ContactSection form]
  F --> T[Turnstile widget]
  T -->|token| F
  F -->|POST /api/contact| P[Pages Function functions/api/contact.ts]
  P -->|siteverify| CT[Cloudflare Turnstile API]
  P -->|POST /emails| R[Resend API]
  R --> IN[saxmachinee@gmail.com]
  P -->|ok / code| F
  F -->|on 200| A[analytics.track]
```

### Confirmed Production Values

| Setting | Value | Where it lives |
|---|---|---|
| Canonical origin | `https://www.saxmachineentertainment.com` | `VITE_SITE_URL` in `.env` + Pages build vars; fallbacks in `src/lib/site.ts` and `vite.config.ts` |
| Sender | `Sax Machine <noreply@saxmachineentertainment.com>` | `CONTACT_FROM` — `wrangler.toml` `[vars]` (local) and Pages env var (prod) |
| Recipient | `saxmachinee@gmail.com` *(unchanged)* | `CONTACT_TO` |
| Resend key | `re_…` *(provided by user)* | `.dev.vars` locally (gitignored) + **encrypted** Pages secret — never committed |
| Turnstile site key | to be created in Step 6 | `VITE_TURNSTILE_SITE_KEY` in `.env` + Pages build vars (public) |
| Turnstile secret | to be created in Step 6 | `TURNSTILE_SECRET_KEY` — `.dev.vars` + **encrypted** Pages secret |

### Cloudflare Setup Guide — remaining dashboard work

Resend domain verification and the API key are **done**. What remains:

1. **Create the Turnstile widget** — Cloudflare dashboard → Turnstile → *Add widget*. Name `saxmachine-contact`; hostnames `www.saxmachineentertainment.com`, `saxmachineentertainment.com`, the `*.pages.dev` preview host, and `localhost`; widget mode *Managed*. This yields the **site key** (public → `.env`) and the **secret key** (→ Pages secret).
2. **Create the Pages project** (if not already) — Workers & Pages → Create → Pages → **Connect to Git** → authorize GitHub → pick `paravena/saxmachinewebsite`. Production branch `main`, framework preset *Vite* (or *None*), build command `npm run build`, output directory `dist`, root directory blank. Cloudflare auto-detects `functions/`, so `functions/api/contact.ts` is served at `/api/contact` on the same origin, and every push to `main` triggers a production deploy (other branches get preview deploys). Leave GitHub Pages **disabled** in the repository settings — it cannot run the function and would only create a second, broken copy of the site.
3. **Add variables to Pages** — Settings → Environment variables, for **both** Production and Preview:
   - `RESEND_API_KEY` → **Secret (encrypted)**
   - `TURNSTILE_SECRET_KEY` → **Secret (encrypted)**
   - `CONTACT_TO` = `saxmachinee@gmail.com` (plain)
   - `CONTACT_FROM` = `Sax Machine <noreply@saxmachineentertainment.com>` (plain)
   - `VITE_TURNSTILE_SITE_KEY` and `VITE_SITE_URL` (plain, needed at **build** time)

   Then **retry the latest deployment** — variables are not applied retroactively.
4. **Custom domain** — Pages → Custom domains → add `www.saxmachineentertainment.com`. Since the zone already lives in this Cloudflare account the `CNAME` is created automatically and the certificate is issued within minutes. Then add a Cloudflare **redirect rule** sending the apex (`saxmachineentertainment.com/*`) to `https://www.saxmachineentertainment.com/$1` with a 301, so the canonical host is unambiguous.
5. **Local development** — `cp .dev.vars.example .dev.vars`, fill in the real keys, then `npx wrangler pages dev -- npm run dev` so `/api/contact` resolves alongside the Vite dev server.
6. **Debugging** — `npx wrangler pages deployment tail` streams the function's `console.error` output live.

### Risks
- **A private npm registry baked into the lockfile breaks every CI build.** `package-lock.json` resolves all 448 packages from `https://npm.artifacts.indeed.tech/npm/`, inherited from the global `~/.npmrc`, which is exactly why Cloudflare's `npm clean-install` returns `E401`. *Mitigation:* commit a project-level `.npmrc` pinning `registry=https://registry.npmjs.org/` (a project `.npmrc` takes precedence over the user-level one) and regenerate the lockfile so the resolved URLs are public. Worth re-checking after any future `npm install` run on a machine with a private registry configured, since npm will rewrite the URLs again.
- **Dependency drift when regenerating the lockfile.** Deleting and recreating `package-lock.json` can pull newer patch/minor versions within the existing semver ranges. *Mitigation:* re-run `typecheck`, `lint` and `build` immediately after regeneration, and inspect the diff for any unexpected major bump.
- **Node version drift on the build host** — Cloudflare auto-detected `nodejs@24.21.0`, newer than anything this project was tested against locally. *Mitigation:* commit a `.nvmrc` containing `lts/krypton`, the canonical codename for the Node 24 LTS line, so local, CI and production builds agree; if a dependency turns out to be incompatible with Node 24 that single value is the one place to roll it back.

- **Cloudflare Pages may reject the `lts/krypton` alias.** Pages resolves `.nvmrc` through `nvm`, but its build image is documented/reported to require an **exact numeric version** — LTS aliases such as `lts/hydrogen` have caused build failures, and a committed `.nvmrc` takes precedence over the `NODE_VERSION` environment variable, so the variable cannot rescue it. *Mitigation:* ship `lts/krypton` as requested (it is correct for local `nvm use` and for GitHub Actions' `setup-node`), then **read the Pages build log** for the resolved Node version. If the install step fails to resolve the alias, replace the file contents with the pinned numeric equivalent `24.11.1` (the first Krypton LTS release) — or whatever 24.x is current — keeping the codename in a comment is **not** an option, since `nvm` itself chokes on trailing comments in `.nvmrc`.

- **Comments and `v` prefixes break `.nvmrc` consumers.** Both `nvm` (unterminated-regex error on inline comments) and the Cloudflare parser expect the file to contain the bare version token and nothing else. *Mitigation:* the file holds exactly one line, `lts/krypton`, with no comment, no `v` prefix and no `NODE_VERSION=` assignment.
- **Choosing GitHub Pages would break the contact form.** It has no serverless runtime, so `/api/contact` would 404 and the form would fall back to `mailto:` — exactly the behaviour this work set out to replace. *Mitigation:* Cloudflare Pages is the host; GitHub remains only the Git remote that Pages builds from, and GitHub Pages is left disabled in the repository settings.
- **Two hosts competing for the domain** — enabling GitHub Pages with a committed `CNAME` file creates DNS requirements that conflict with the Pages custom domain. *Mitigation:* no `CNAME` file is committed and GitHub Pages stays off, so the only `www` record is the one Cloudflare Pages creates.
- ~~**Resend requires a verified domain**~~ — resolved: `saxmachineentertainment.com` is verified, so `CONTACT_FROM` can move off the `onboarding@resend.dev` sandbox sender to `noreply@saxmachineentertainment.com`.
- **Gmail deliverability** — mail sent to a Gmail inbox from a freshly verified domain can land in spam. *Mitigation:* confirm a DMARC record exists alongside the SPF/DKIM records Resend added, keep `Reply-To` as the visitor and `From` on the own domain (never spoof the visitor's address in `From`), and check the inbox placement during the end-to-end verification step.
- **Turnstile tokens are single-use and expire (~300s)** — resubmitting after an error with a stale token yields `403`. *Mitigation:* `useTurnstile().reset()` is called after every submit attempt, success or failure.
- **The Resend API key was shared in plain text in this conversation.** *Mitigation:* treat it as compromised — revoke it in Resend → API Keys and issue a replacement with *Sending access* only. The key must live **only** in `.dev.vars` (gitignored) and as an encrypted Pages secret; it must never be written into `wrangler.toml`, `.env` or `.dev.vars.example`, all of which are tracked by Git.
- **Secrets leaking into the bundle** — any `VITE_`-prefixed variable is inlined into client JS. *Mitigation:* the Resend and Turnstile secrets are deliberately **not** `VITE_`-prefixed and are read only from the function's `env`; a grep of `dist/` during validation confirms absence.
- **Canonical host mismatch** — if the Pages custom domain is the apex but `VITE_SITE_URL` says `www` (or vice versa), canonical/Open Graph/JSON-LD/sitemap all point at a redirecting host, which weakens SEO. *Mitigation:* `www` is the chosen canonical; the apex gets a redirect rule, and the built `dist/sitemap.xml` is checked after the change.
- **`vite dev` alone cannot serve `/api/contact`** (it would 404 and look like a broken form). *Mitigation:* the `enabled: false` fallback keeps `mailto:` behaviour whenever the site key is absent, and the README/script name makes `dev:functions` the documented way to test the real path.

# Testing

### Validation Approach
- `npm run typecheck`, `npm run lint` and `npm run build` must all pass — the i18n completeness check means a missing Spanish string is a compile error, and `jsx-a11y` covers the new status markup.
- Run `npx wrangler pages dev -- npm run dev` with `.dev.vars` populated and exercise the real endpoint end to end.
- Probe the function directly with `curl` to cover the branches that are awkward to reach through the UI.
- Grep the built `dist/` bundle for `RESEND` / the secret values to prove nothing server-side leaked.

### Key Scenarios
- **Credential-free dependency install** — `npm ci` run with the user-level npm config ignored completes without an `E401`, and no `resolved` URL in `package-lock.json` references `artifacts.indeed.tech`. This is the gate that unblocks the Cloudflare Pages build.
- **Node 24 toolchain** — `tsc`, `eslint`, `vite build` and `wrangler` all run clean on the pinned Node version.
- **Happy path** — fill all fields, solve Turnstile, submit: the button disables, the success panel appears, the fields clear, and an email arrives at `CONTACT_TO` with the visitor's address as `Reply-To`.
- **Analytics truthfulness** — `contact_form_submit` is logged (visible via the `import.meta.env.DEV` `console.debug` in `analytics.ts`) only *after* the `200`, with `transport: 'api'`.
- **Localized states** — switch to ES and repeat: the sending / success / error strings and the email body render in Spanish.
- **Fallback mode** — unset `VITE_TURNSTILE_SITE_KEY` and confirm the Turnstile box is absent and submitting still produces the original `mailto:` URL.
- **Production origin** — after the domain change, `dist/index.html` canonical/`og:url`, `dist/robots.txt` and `dist/sitemap.xml` all resolve to `https://www.saxmachineentertainment.com` with no `saxmachine.cl` string left anywhere in `dist/` or `src/`.
- **Live sender** — a real submission arrives `From: noreply@saxmachineentertainment.com` with SPF/DKIM passing, in the inbox rather than spam.

### Edge Cases
- `GET /api/contact` → `405`.
- Missing or malformed `email`, empty `message`, or a 10k-character message → `400 invalid_payload`, and the client shows the error panel with the `mailto:` escape hatch.
- Forged/replayed Turnstile token → `403 captcha_failed`.
- Resend returning a non-2xx (simulate with a bad `RESEND_API_KEY`) → `502 send_failed`, generic client error, provider detail only in the tail log.
- Network failure mid-submit (DevTools offline) → the `fetch` rejection is caught, `contact_form_error` fires, and the form returns to an editable state rather than staying stuck in `submitting`.

### Test Changes
The project has no test runner, and this plan does not introduce one — validation is the build/lint/typecheck gates plus the manual `wrangler pages dev` and `curl` checks above.

# Delivery Steps

### ✓ Step 1: Scaffold the Cloudflare Pages Function and shared contract
`POST /api/contact` exists and answers locally under `wrangler pages dev`, with validation and the method guard in place.

- Add `src/types/contact.ts` with `ContactRequest`, `ContactErrorCode` and the `ContactResponse` union, shared by client and function.
- Create `functions/api/contact.ts` exporting `onRequestPost`, plus a guard returning `405` for other methods.
- Implement payload parsing and validation (required `name`/`email`/`message`, email syntax, length caps) returning `400 invalid_payload`.
- Add `wrangler.toml` (project name, `compatibility_date`), `wrangler` as a devDependency, and `dev:functions` / `deploy` scripts in `package.json`.
- Add `.dev.vars.example` documenting `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_TO`, `CONTACT_FROM`, and ignore `.dev.vars` in `.gitignore`.

### ✓ Step 2: Wire Turnstile verification and Resend delivery in the function
A valid request produces a real email in the target inbox; an invalid captcha or provider failure returns a typed error code.

- Post the submitted token to `https://challenges.cloudflare.com/turnstile/v0/siteverify` together with the `CF-Connecting-IP` header; return `403 captcha_failed` when unsuccessful.
- Build the localized subject and plain-text body from the payload, mirroring the existing ES/EN wording in `ContactSection`.
- `fetch` `https://api.resend.com/emails` with the bearer key, `from: CONTACT_FROM`, `to: CONTACT_TO`, and `reply_to` set to the visitor's address.
- Map a non-2xx provider response to `502 send_failed`, logging the provider detail via `console.error` only.
- Verify each branch with `curl` against `wrangler pages dev`.

### ✓ Step 3: Add the Turnstile widget hook and the localized form states
The contact form renders a Turnstile challenge and has full ES/EN copy for every submission state.

- Add `src/hooks/useTurnstile.ts`: inject the Cloudflare script once, render the widget into a ref, expose `token`, `reset()` and `enabled` (false when `VITE_TURNSTILE_SITE_KEY` is unset).
- Declare `VITE_TURNSTILE_SITE_KEY` in `src/vite-env.d.ts` and add a commented placeholder to `.env`.
- Add the new keys to `src/i18n/en/contact.ts` (sending, success title/body, error title/body, captcha prompt) and mirror them in `src/i18n/es/contact.ts`.
- Rewrite `contact.form.note` in both locales so it no longer promises that the email app will open.
- Add `.form-status`, `.form-status.success`, `.form-status.error` and `.turnstile-box` styles to `src/styles/globals.css` using the existing gold/navy tokens.

### ✓ Step 4: Convert ContactSection to async submission with fallback and truthful analytics
Submitting the form calls the API, shows inline success or error feedback without leaving the page, and still works when Cloudflare is not configured.

- Replace the synchronous `handleSubmit` in `ContactSection.tsx` with an async handler that `fetch`es `/api/contact` and manages an `idle | submitting | success | error` status.
- Disable the submit `Button` and swap its label while `submitting`; clear the fields and render the success panel on `ok: true`.
- Render the error panel with the existing `mailto:` link as an escape hatch, and call `reset()` on the Turnstile widget after every attempt.
- Keep the legacy `mailto:` path when `useTurnstile().enabled` is false, so the form never regresses before setup is complete.
- Add `contact_form_error` to the `AnalyticsEvent` union in `src/lib/analytics.ts` and move `contact_form_submit` to fire after a successful response with a `transport` param.
- Mark the status panels with `role="status"` / `aria-live="polite"` and confirm `npm run lint`, `npm run typecheck` and `npm run build` are clean, with no secret present in `dist/`.

### Step 5: Unpin the private npm registry so the Cloudflare build can install dependencies
`npm ci` succeeds in a credential-free environment and the Pages build gets past the install phase.

- Leave `~/.npmrc` untouched. It is the user's corporate Indeed config (`registry=https://npm.artifacts.indeed.tech/npm/`, `email=...@contractor.indeed.com`) and rewriting it would break every other repo on the machine — and it would still not fix the Cloudflare build, which never reads this machine's home directory. The fix must live inside the repository.
- Add a committed `.npmrc` at the repo root so the project setting overrides the machine-level `~/.npmrc` pointing at `npm.artifacts.indeed.tech`:

  ```ini
  registry=https://registry.npmjs.org/
  ```

- Add a `.nvmrc` at the repo root containing the canonical LTS codename for the Node 24 line — a single line, no `v` prefix, no trailing comment (`nvm` fails to parse commented `.nvmrc` files):

  ```
  lts/krypton
  ```

- Delete `node_modules/` and `package-lock.json`, re-run `npm install`, and confirm the new lockfile resolves every package from `registry.npmjs.org` with zero references to `artifacts.indeed.tech`.
- Verify the toolchain works on the pinned runtime locally — `nvm install` / `nvm use` must resolve `lts/krypton` to a 24.x build, then `node -v`, a clean install and `npm run build` — so the pin is proven rather than assumed.
- Watch the first Cloudflare build log for the resolved Node version. If Pages cannot resolve the `lts/krypton` alias, swap the `.nvmrc` contents for the numeric equivalent (`24.11.1`, the first Krypton LTS release); note that a committed `.nvmrc` overrides the `NODE_VERSION` Pages variable, so editing the file is the only fix.
- Reproduce the CI environment locally by running `npm ci` with the user config neutralised (`npm_config_userconfig=/dev/null npm ci`) to prove the install needs no credentials.
- Re-run `npm run typecheck`, `npm run lint`, `npm run format:check` and `npm run build` against the regenerated dependency tree, and review the lockfile diff for unintended version bumps.

### Step 6: Point the repo at the real domain and sender
Every `saxmachine.cl` placeholder is gone and the function sends from `noreply@saxmachineentertainment.com`.

- Set `VITE_SITE_URL=https://www.saxmachineentertainment.com` in `.env` and rewrite the comment that still calls it a placeholder.
- Update the hard-coded fallback origin in `src/lib/site.ts` (line 3) and the matching fallback in `vite.config.ts` (line 47) so a missing env var no longer resolves to the dead domain.
- Change `CONTACT_FROM` in `wrangler.toml` `[vars]` to `Sax Machine <noreply@saxmachineentertainment.com>`; leave `CONTACT_TO` as `saxmachinee@gmail.com`.
- Update `.dev.vars.example` to show the verified sender and drop the "until the domain is verified" caveat, keeping the key itself as a `re_xxx` placeholder.
- Rebuild and verify that the canonical and Open Graph tags in `dist/index.html`, plus `dist/robots.txt` and `dist/sitemap.xml`, all carry the new origin.

### Step 7: Create the Turnstile widget and activate the live submission path
The contact form renders a real Turnstile challenge instead of silently falling back to `mailto:`.

- Create the `saxmachine-contact` Managed widget in Cloudflare Turnstile with the production, apex, `*.pages.dev` preview and `localhost` hostnames.
- Add the resulting site key as an **uncommented** `VITE_TURNSTILE_SITE_KEY` in `.env`, which flips `useTurnstile().enabled` to `true` and takes `ContactSection.tsx` out of legacy mode.
- Create `.dev.vars` from the example with the real `RESEND_API_KEY`, the real `TURNSTILE_SECRET_KEY`, and the confirmed `CONTACT_TO` / `CONTACT_FROM`; confirm `git check-ignore .dev.vars` reports it as ignored.
- Re-run `npm run build` and grep `dist/` for `re_` and the Turnstile secret to prove no server-side secret reached the client bundle.

### Step 8: End-to-end verification against the live configuration
A real submission is delivered to the Gmail inbox with the correct sender, reply-to and localized body.

- Run `npx wrangler pages dev -- npm run dev`, solve the live challenge, and submit the form in English; verify the success panel renders, the fields clear, and the mail arrives from `noreply@saxmachineentertainment.com` with `Reply-To` set to the visitor.
- Repeat in Spanish to confirm the localized subject and plain-text body.
- Re-exercise the error branches with Cloudflare's always-fail test secret (`2x…AA` → `403 captcha_failed`) and a deliberately invalid Resend key (`502 send_failed`), confirming the error panel still offers the `mailto:` escape hatch.
- Confirm the Gmail message lands in the inbox rather than spam and that its headers show SPF/DKIM passing for `saxmachineentertainment.com`.
- Close out with `npm run typecheck`, `npm run lint`, `npm run format:check` and `npm run build`.

### Step 9: Publish via Cloudflare Pages and attach the custom domain
The site is live on `https://www.saxmachineentertainment.com`, rebuilt from `main` on every push, with `/api/contact` answering on the same origin.

- Commit and push the pending work to `origin/main` — including the new `.npmrc`, `.nvmrc` and regenerated `package-lock.json` — confirming with `git status` that `.dev.vars` and `.wrangler/` stay untracked.
- Connect the Pages project to `paravena/saxmachinewebsite` with production branch `main`, build command `npm run build` and output directory `dist`; leave GitHub Pages disabled and commit no `CNAME` file.
- Add the production *and* preview environment variables — `RESEND_API_KEY` / `TURNSTILE_SECRET_KEY` encrypted, `CONTACT_TO` / `CONTACT_FROM` / `VITE_SITE_URL` / `VITE_TURNSTILE_SITE_KEY` plain — then retry the latest deployment so the build picks them up.
- Attach `www.saxmachineentertainment.com` as the custom domain and add the apex → `www` 301 redirect rule.
- Watch the build log and confirm the install phase now completes instead of failing with `E401` before checking the deployed output.
- Verify on the live origin: the page renders, `/robots.txt` and `/sitemap.xml` carry the new origin, `GET /api/contact` returns `405` (proving the function deployed rather than being served as a static 404), and a real submission reaches the Gmail inbox.