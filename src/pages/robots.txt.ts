import type { APIRoute } from 'astro';
import { isDraft } from '../data/site';
export const GET: APIRoute = () =>
  new Response(
    isDraft
      ? 'User-agent: *\nDisallow: /\n'
      : 'User-agent: *\nAllow: /\nSitemap: https://armonia.optiqo.dev/sitemap-index.xml\n',
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
