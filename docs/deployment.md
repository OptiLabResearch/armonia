# Cloudflare Pages deployment

## Project settings

The **Git-integrated Pages project** `armonia` is connected to `OptiLabResearch/armonia` in the Growthimize account. Its assigned hostname is `armonia-6hg.pages.dev`. Do not deploy to GitHub Pages and do not substitute a Workers project or a Direct Upload project.

| Setting                      | Value                                 |
| ---------------------------- | ------------------------------------- |
| Suggested Pages project name | `armonia` / `armonia-6hg.pages.dev`   |
| Production branch            | `main`                                |
| Preview branch               | `feat/swedish-armonia-site`           |
| Root directory               | Repository root                       |
| Framework                    | Astro                                 |
| Build command                | `npm run build`                       |
| Output directory             | `dist`                                |
| Node version                 | `24` via `.nvmrc` / `NODE_VERSION=24` |
| Both environments            | `ASTRO_TELEMETRY_DISABLED=1`          |
| Production environment only  | `ARMONIA_REQUIRE_LAUNCH_READY=1`      |

Keep the production launch gate enabled. `astro.config.mjs` additionally recognizes Cloudflare's documented `CF_PAGES=1` and `CF_PAGES_BRANCH=main` variables, so even the first production build refuses unfinished content. The explicit production-only variable protects the gate if the production branch is later renamed. Do **not** set it on the preview environment.

The initial `main` branch is a bootstrap commit to allow a reviewable feature PR. It does not contain a deployable website. Connect the repository, enable previews for the feature branch, and review its preview deployment. The production build remains blocked until the business content is confirmed and the reviewed PR is merged. Do not merge simply to obtain a preview.

Automatic production deployments are currently disabled. Enable them only after content approval and PR review. Preview deployments are restricted to `feat/swedish-armonia-site`.

Local API access uses `.env.cloudflare`, ignored by Git with file mode 0600. Do not commit or paste its token into logs. Required scopes are Account → Cloudflare Pages → Edit, Zone → Zone → Read, and Zone → DNS → Edit for the intended account and `optiqo.dev`. The token is used locally; it is not a website build variable.

## Review domain and verification

At the user's request on 2026-09-30, **https://armonia.optiqo.dev** is the stable review URL. It is associated with the Pages project, then routed using a proxied CNAME to `feat-swedish-armonia-site.armonia-6hg.pages.dev`. This follows Cloudflare's [custom branch alias setup](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/). Keep proxying enabled: unproxied custom aliases resolve to production instead.

This hostname follows the latest successful feature-branch deployment. Hash-prefixed deployment URLs are immutable snapshots and should not be shared as the ongoing review link. The branch alias is also available at https://feat-swedish-armonia-site.armonia-6hg.pages.dev.

Production remains disabled and the site remains noindex while business details are pending. The user explicitly authorized this review-domain setup before the final public launch. No merge is required. When moving to an approved production release, update this CNAME to the actual production Pages hostname (or set up the final `.se` domain), and verify canonical URLs, sitemap, HTTPS and indexing settings together.

Verify `/`, `/behandlingar/`, `/om-armonia/`, `/kontakt/`, a missing route, booking links, `/social.jpg`, `/robots.txt`, and `/sitemap-index.xml` over HTTPS after deployment. The canonical domain is currently `https://armonia.optiqo.dev`.

The site collects no form data. External booking is a normal link; any information entered there is handled by the booking provider. Add an appropriate factual privacy notice if future integrations change this arrangement.

## Operations

No background job, timer, or persistent development service is installed. Browser tests own the preview process and stop it after the test run; each test has a 30-second timeout. For a short manual review, run `timeout 240s npm run preview` in a terminal. Do not leave an unsupervised preview server running. Future tasks lasting more than five minutes require a documented OS supervisor and hard deadline before submission.

Reference documentation checked during implementation:

- [Astro on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Build settings and injected environment variables](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
