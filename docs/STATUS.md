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

## Hosting status and launch blockers

The repository is public. GitHub Actions run [36618484081](https://github.com/OptiLabResearch/armonia/actions/runs/36618484081) passed all checks, including hosted browser tests. The earlier account/spending restriction is resolved.

Cloudflare access is working through a user-supplied token in the ignored local `.env.cloudflare` file (mode 0600). Its value is never stored in project documentation or Git. The previous Bitwarden token was invalid and is not used.

Created the **armonia** Cloudflare Pages project in **Growthimize**, connected to `OptiLabResearch/armonia` through the existing GitHub integration. Cloudflare assigned `armonia-6hg.pages.dev`. The build command is `npm run build`, output is `dist`, and Node 24 is configured. Preview builds are enabled for `feat/swedish-armonia-site`. Production branch is `main`, with automatic production deployments disabled and the explicit launch gate enabled. This documentation push requests the first branch preview; its hosted result remains to be verified.

No custom domain or DNS record has been created. `armonia.optiqo.dev` had no existing DNS record when checked. Associate the hostname with Pages before creating its CNAME, after approved production is ready.

Public launch remains blocked by missing confirmed practitioner details, contact/address/directions, treatment duration/price/approval, external booking URL, and Swedish copy approval. `launchReady` and `copyApproved` remain false. The initial `main` branch is only a bootstrap commit; website implementation is isolated on `feat/swedish-armonia-site` for PR review. No merge is authorized by this delivery.

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
- GitHub Actions run `36618484081`: all checks passed after the repository became public.

Automated accessibility checks are not a complete accessibility certification. Browser execution was Chromium-only. Hosted Cloudflare preview verification is pending its first deployment. Real external booking, custom domain, and production HTTPS checks await confirmed business data and launch approval.
