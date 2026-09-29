# Armonia

A Swedish, static Astro website for a small independent massage practice. Source lives in [OptiLabResearch/armonia](https://github.com/OptiLabResearch/armonia); the intended host is Cloudflare Pages at `https://armonia.optiqo.dev`.

## Local development

Use Node 24 (`.nvmrc`) and npm. No application secrets or backend are required.

```sh
npm ci
npm run dev
```

The development server runs at `http://localhost:4321`. `npm run build` writes the static site to `dist/`; `npm run preview` serves it locally. Both server scripts use Astro's foreground mode (`--ignore-lock`) so their parent process owns their lifecycle, including in agent sessions. Set `ASTRO_TELEMETRY_DISABLED=1` to disable Astro CLI telemetry.

## Content and images

- `src/data/business.json`: practitioner, contact information, address, booking link, and treatments. Nullable fields are intentional placeholders; replace them with confirmed facts.
- `src/data/site.ts`: typed content interface, navigation, Swedish price formatting, and booking fallback.
- `src/pages/`: Swedish editorial copy for home, treatments, about, contact, and the 404 page.
- `src/styles/global.css`: cream/olive palette, typography, shared components, and responsive layouts.
- `src/assets/images/`: seven original AI-generated assets and one edited Samantha portrait. Their prompts and provenance are recorded in `docs/image-prompts.json`.

The sole initial treatment entry, **Massage**, is provisional. Confirm its name, copy, price in SEK, and duration in minutes; set `confirmed: true` only after approval. No other services, qualifications, client reviews, or specific health outcomes have been invented. Additional treatments use the same generic massage image until appropriate treatment-specific imagery is added.

Set `bookingUrl` to an HTTPS URL from the actual external booking service. A treatment may override it with its own HTTPS `bookingUrl`, or use `null` to inherit the site-wide link. Missing/invalid links lead to `/kontakt/#bokning`, which clearly explains the pending booking setup. No nonfunctional contact form or fake contact links are shown.

Room images depict a modest imaginary treatment room, not the actual premises. The site labels them as illustrative. Samantha’s portrait is an AI edit of her real photograph from the owner-supplied gallery, with an illustrative background and a visible disclosure. Preserve her likeness; never substitute a fictional practitioner. The treatment illustration is a fully clothed hand-and-forearm massage close-up.

Astro generates responsive AVIF/WebP/JPEG variants during the build. The foliage keeps its transparency. Fonts are served locally from Fontsource packages. If the hero changes, regenerate the social crop with `node scripts/build-social.mjs` and commit `public/social.jpg`.

## Verification

```sh
npm run format:check
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` starts and stops its own preview server. It checks desktop (1440px), tablet (768px), and mobile (390px) layouts, navigation, image loading, internal links, booking fallback, keyboard interaction, reduced motion, and automated WCAG A/AA checks. Screenshots and reports are written under ignored `test-results/` and `playwright-report/`. A custom installed Chromium can be supplied through `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

GitHub Actions runs formatting, Astro diagnostics, unit tests, build, and browser tests on pull requests and `main`. Fontsource packages include their OFL font licenses. No analytics, tracking widgets, or external font requests are included.

## Launch gate

This is a **preview**, not an approved public launch. While details are incomplete, the site has `noindex, nofollow`, a preview notice, and `robots.txt` disallows crawling. These are indexing directives, not access control.

```sh
npm run check:launch
ARMONIA_REQUIRE_LAUNCH_READY=1 npm run build
```

Both commands deliberately fail until required business details and treatments are complete, `copyApproved` is `true`, and `launchReady` is `true`. This prevents a production Pages build from publishing unresolved content. Re-read all editorial copy with the practitioner before setting the approval flags. Do not change the validation to make a draft pass.

See [Cloudflare setup](docs/deployment.md) and [delivery status](docs/STATUS.md).

### Provisional contact details

Samantha Paladino, Halmstad and telephone 0734 816 735 are supplied by the owner. Fiskaregatan 15, 302 90 Halmstad is provisional (`addressConfirmed: false`). The current booking URL is the temporary Bokadirekt homepage (`bookingUrlConfirmed: false`); replace it with the practitioner booking page and confirm it before launch. The chosen email prefix is `hej`; leave `email` null until the exact `.se` domain and mailbox are ready. Do not guess a domain.
