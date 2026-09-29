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

Created the **armonia** Cloudflare Pages project in **Growthimize**, connected to `OptiLabResearch/armonia` through the existing GitHub integration. Cloudflare assigned `armonia-6hg.pages.dev`. The build command is `npm run build`, output is `dist`, and Node 24 is configured. Preview builds are enabled for `feat/swedish-armonia-site`. Production branch is `main`, with automatic production deployments disabled and the explicit launch gate enabled. The first branch preview deployed successfully (`2d3415c2-79b9-40bc-8d8f-10936a24f8f7`). Its stable preview address is https://feat-swedish-armonia-site.armonia-6hg.pages.dev.

No custom domain or DNS record has been created. `armonia.optiqo.dev` had no existing DNS record when checked. Associate the hostname with Pages before creating its CNAME, after approved production is ready.

Public launch remains blocked by address confirmation/directions, treatment duration/price/approval, final practitioner booking URL, and Swedish copy approval. `launchReady` and `copyApproved` remain false. The initial `main` branch is only a bootstrap commit; website implementation is isolated on `feat/swedish-armonia-site` for PR review. No merge is authorized by this delivery.

## Review notes

An independent Gemini review caught same-page mobile booking navigation failing to dismiss its menu and incomplete address handling. Both were fixed. Malformed treatment data now reports a launch blocker. Asset/script references flagged during the parallel review were completed and verified in the final build.

The review suggested a Cloudflare environment variable not present in the official injected-variable documentation. That suggestion was not adopted. Production gating instead uses documented branch variables and the explicit production-only setting described in `deployment.md`.

Browser accessibility checks identified two low-contrast secondary text colours; these were darkened without weakening the tests. Astro 7's agent-triggered background preview behaviour was handled with documented foreground mode. No persistent server or monitoring job is installed.

## Verification

- `npm run check`: passed, zero errors/warnings/hints.
- `npm run format:check`: passed.
- `npm test`: eight unit tests passed, including rejection of provisional address/booking values.
- `npm run build`: passed; five HTML pages plus robots and sitemap, responsive image variants including the new Samantha portrait.
- `npm run test:e2e`: 29 passed, four intentionally skipped cases (desktop mobile-menu plus three missing-booking fallbacks now that a temporary external link is configured). Checks cover 1440px, 768px, and 390px widths; axe reported no WCAG A/AA violations.
- Additional overflow checks at 320px: all four routes passed.
- `npm run check:launch` and a simulated Cloudflare `main` production build: failed as intended with the specific missing business details.
- Generated foliage has a real alpha channel. All eight generated/edited assets were visually inspected.
- Desktop/tablet/mobile homepage screenshots and desktop/mobile inner-page screenshots were captured for visual review. Durable homepage previews are in `docs/previews/`.
- Final independent review verified the fixes and reported no remaining substantive bugs in its scope.
- GitHub Actions run `36618484081`: all checks passed after the repository became public.

Automated accessibility checks are not a complete accessibility certification. Browser execution was Chromium-only. The initial hosted preview returned HTTPS 200 for all four pages, social image, robots and sitemap, and 404 for an unknown route. Real external booking, custom domain, and production HTTPS checks await confirmed business data and launch approval.

## Samantha content update

The user confirmed Samantha Paladino, Halmstad, and telephone `0734 816 735`. These are in the centralized business data. The provisional address is Fiskaregatan 15, 302 90 Halmstad, as supplied by the user. It is visibly marked preliminary. Booking buttons temporarily open https://www.bokadirekt.se/; the contact page explains that this is the provider homepage, not an Armonia booking page. Separate address and booking-link confirmation flags keep both provisional values behind the launch gate. The owner subsequently supplied **info@armonia.se**, which is now used for the contact link. The final hosting-domain switch remains a launch task.

An original Samantha portrait from the user-provided https://sustineer.com/samantha-gallery was adapted with the built-in image generator for the homepage and about page. The reference is an actual portrait rather than a fictional practitioner. AI background/editing is disclosed in the UI and image manifest. No qualifications or biography have been inferred from the gallery.

Samantha update validation: Astro checks and static build pass; eight unit tests pass; 29 Chromium checks pass across desktop/tablet/mobile with four conditional skips. Updated homepage screenshots were visually reviewed and saved in `docs/previews/`. The portrait retains the source likeness and is saved as `src/assets/images/samantha-portrait.png`; exact prompt and source URL are in the manifest.

## Business brief, services and technical quality update

Expanded the homepage philosophy and Samantha's About page using her brief: personal care, a calm pace, listening to the client, and whole-person attention expressed in plain Swedish. No invented credentials or therapeutic outcomes. Added four editable service drafts: Massage, Kroppspeeling, Ansiktsritual and Avslappningsstund. The last replaces vague healing language with a proposed rest/relaxation session. All remain unconfirmed; prices and durations remain pending. Existing original images suit these drafts and were reused with appropriate alternative text.

Fonts are local Latin WOFF2 files (three faces, 101,736 bytes in total). Main faces are preloaded with swap fallback. Image candidates avoid upscaling, the hero is prioritised, and fingerprinted assets receive immutable caching. Titles/descriptions are unique and location-specific; canonicals and sitemap agree. Preview noindex remains active while details await approval.

Validation: eight unit tests; 35 browser checks passed with four conditional skips, including accessibility and new SEO/resource checks. Local first-view resource payloads were approximately 246 KB desktop, 187 KB tablet and 148 KB mobile, with no third-party requests. These are unthrottled local measurements (resource bodies, excluding HTML), not a real-user performance guarantee. The production gate still blocks unconfirmed services, address and booking information. Email delivery and production-domain SEO cannot be verified before launch setup.

Final targeted verification after font-budget assertions: Astro diagnostics and build passed; all six metadata/performance checks passed again. The homepage uses 358 bytes of inline application JavaScript, with no external scripts. Desktop and mobile About/Services screenshots were visually reviewed and saved in `docs/previews/`. No new image generation was needed.
