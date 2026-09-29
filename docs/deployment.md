# Cloudflare Pages deployment

## Project settings

Create or reuse a **Git-integrated Pages project**, connected to `OptiLabResearch/armonia`. Do not deploy to GitHub Pages and do not substitute a Workers project or a Direct Upload project.

| Setting                      | Value                                 |
| ---------------------------- | ------------------------------------- |
| Suggested Pages project name | `armonia` (subject to availability)   |
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

## Domain and verification

1. Verify the intended Cloudflare account and an existing project before creating resources. Git integration may require enabling Cloudflare's GitHub app for this repository.
2. Once the approved production build is ready, add `armonia.optiqo.dev` under the Pages project's **Custom domains**.
3. Only after associating the hostname, create or confirm its CNAME to the actual project hostname returned by Cloudflare (`<project>.pages.dev`). Do not assume project-name availability and do not alter unrelated `optiqo.dev` records.
4. Wait for domain activation and managed HTTPS certificate issuance using supported Cloudflare status checks.
5. Verify `/`, `/behandlingar/`, `/om-armonia/`, `/kontakt/`, a missing route, all booking links, `/social.jpg`, `/robots.txt`, and `/sitemap-index.xml` over HTTPS. Confirm the canonical domain is `https://armonia.optiqo.dev`.

The site collects no form data. External booking is a normal link; any information entered there is handled by the booking provider. Add an appropriate factual privacy notice if future integrations change this arrangement.

## Operations

No background job, timer, or persistent development service is installed. Browser tests own the preview process and stop it after the test run; each test has a 30-second timeout. For a short manual review, run `timeout 240s npm run preview` in a terminal. Do not leave an unsupervised preview server running. Future tasks lasting more than five minutes require a documented OS supervisor and hard deadline before submission.

Reference documentation checked during implementation:

- [Astro on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Build settings and injected environment variables](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
