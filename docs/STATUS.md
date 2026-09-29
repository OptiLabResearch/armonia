# Delivery status

Updated 2026-09-29.

Implementation is available in [draft pull request #1](https://github.com/OptiLabResearch/armonia/pull/1). Both the bootstrap `main` and implementation branch are pushed. Nothing is merged.

## Implemented

- Four Swedish pages, a Swedish 404, responsive cream/olive design, botanical SVG identity, locally served fonts, accessible mobile navigation, and shared booking/contact components.
- Seven original generated assets stored in the repository, including room views with a single ordinary window, hand/forearm massage, linen, oil, shelf detail, and transparent foliage. Exact prompts are in `image-prompts.json`.
- Centralized typed business/treatment data. Missing facts remain explicit; no fabricated qualifications, reviews, prices, or contact information.
- External booking URL support with a contact-page fallback, draft indexing controls, and a production launch gate.
- Responsive AVIF/WebP/JPEG output, social image, canonical metadata, sitemap, robots file, and Cloudflare security headers.
- Unit and browser tests, CI workflow, content-editing instructions, and reviewed Cloudflare setup instructions.

## Deployment blockers

Cloudflare CLI authentication was checked with `wrangler whoami`: **not authenticated**. No connected Cloudflare tools were available, and plugin discovery returned no Cloudflare connection. The user requested a Bitwarden Secrets Manager lookup; the CLI is installed, but using the existing protected bootstrap credential requires explicit approval after automatic review rejected cross-account credential access. No secret values were retrieved or exposed. Therefore no Pages project, Git integration, preview deployment, DNS record, or custom domain has been created or changed. Domain/HTTPS verification remains pending.

The public launch is additionally blocked by missing confirmed practitioner details, contact/address/directions, treatment duration/price/approval, external booking URL, and Swedish copy approval. `launchReady` and `copyApproved` remain false. The initial `main` branch is only a bootstrap commit; website implementation is isolated on `feat/swedish-armonia-site` for PR review. No merge is authorized by this delivery.

## Review notes

An independent Gemini review caught same-page mobile booking navigation failing to dismiss its menu and incomplete address handling. Both were fixed. Malformed treatment data now reports a launch blocker. Asset/script references flagged during the parallel review were completed and verified in the final build.

The review suggested a Cloudflare environment variable not present in the official injected-variable documentation. That suggestion was not adopted. Production gating instead uses documented branch variables and the explicit production-only setting described in `deployment.md`.

Browser accessibility checks identified two low-contrast secondary text colours; these were darkened without weakening the tests. Astro 7's agent-triggered background preview behaviour was handled with documented foreground mode. No persistent server or monitoring job is installed.

## Verification

- `npm run check`: passed, zero errors/warnings/hints.
- `npm run format:check`: passed.
- `npm test`: seven unit tests passed.
- `npm run build`: passed; five HTML pages plus robots and sitemap, 73 optimized image variants.
- `npm run test:e2e`: 29 passed, one intentionally skipped desktop-only mobile-menu case. Checks cover 1440px, 768px, and 390px widths; axe reported no WCAG A/AA violations.
- Additional overflow checks at 320px: all four routes passed.
- `npm run check:launch` and a simulated Cloudflare `main` production build: failed as intended with the specific missing business details.
- Generated foliage has a real alpha channel. All seven generated assets were visually inspected.
- Desktop/tablet/mobile homepage screenshots and desktop/mobile inner-page screenshots were captured for visual review. Durable homepage previews are in `docs/previews/`.
- Final independent review verified the fixes and reported no remaining substantive bugs in its scope.
- GitHub Actions run `36617268068` did not start any steps: GitHub reported failed account payments or a spending-limit restriction. This is an account-level blocker, not a failing repository test. Local checks above passed; hosted CI remains unverified.

Automated accessibility checks are not a complete accessibility certification. Browser execution was Chromium-only. Hosted Cloudflare preview, real external booking, custom domain, and HTTPS checks could not be run without account access and confirmed business data.
