import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { assertLaunchReady } from './src/data/launch.mjs';
import business from './src/data/business.json' with { type: 'json' };

// A Cloudflare production build must never publish unfinished business details.
const isCloudflareProduction =
  process.env.CF_PAGES === '1' && process.env.CF_PAGES_BRANCH === 'main';
if (
  isCloudflareProduction ||
  process.env.ARMONIA_REQUIRE_LAUNCH_READY === '1'
) {
  assertLaunchReady(business);
}

export default defineConfig({
  site: 'https://armonia.optiqo.dev',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
});
