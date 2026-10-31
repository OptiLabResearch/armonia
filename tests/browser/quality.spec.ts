import { test, expect } from '@playwright/test';

const routes = ['/', '/behandlingar/', '/om-armonia/', '/kontakt/'];

test('unique search metadata, canonical URLs and sitemap agree', async ({
  page,
  request,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    const description = await page
      .locator('meta[name="description"]')
      .getAttribute('content');
    expect(title).toContain('Halmstad');
    expect(description!.length).toBeGreaterThan(60);
    titles.add(title);
    descriptions.add(description!);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://armonia.optiqo.dev${route}`,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `https://armonia.optiqo.dev${route}`,
    );
    await expect(page.locator('h1')).toHaveCount(1);
  }
  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
  const sitemap = await (await request.get('/sitemap-0.xml')).text();
  for (const route of routes)
    expect(sitemap).toContain(`https://armonia.optiqo.dev${route}`);
  expect(sitemap).not.toContain('404');
});

test('first view uses local fonts and responsive images within asset budgets', async ({
  page,
}, testInfo) => {
  const external: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.protocol.startsWith('http') && url.hostname !== '127.0.0.1')
      external.push(request.url());
  });
  await page.addInitScript(() => {
    const metrics = { lcp: 0, cls: 0 };
    (window as any).__performanceAudit = metrics;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
    }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any) {
        if (!entry.hadRecentInput) metrics.cls += entry.value;
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/');
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images]
        .filter((image) => image.getBoundingClientRect().top < innerHeight)
        .map((image) => image.decode()),
    );
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );
  });
  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType(
      'resource',
    ) as PerformanceResourceTiming[];
    const fontResources = resources.filter((entry) =>
      entry.name.endsWith('.woff2'),
    );
    return {
      ...(window as any).__performanceAudit,
      resourceBytes: resources.reduce(
        (sum, entry) => sum + entry.encodedBodySize,
        0,
      ),
      fontBytes: fontResources.reduce(
        (sum, entry) => sum + entry.encodedBodySize,
        0,
      ),
      fontCount: fontResources.length,
      scriptBytes: resources
        .filter((entry) => entry.initiatorType === 'script')
        .reduce((sum, entry) => sum + entry.encodedBodySize, 0),
      inlineScriptBytes: [...document.scripts]
        .filter((script) => !script.src)
        .reduce(
          (sum, script) =>
            sum + new TextEncoder().encode(script.textContent ?? '').length,
          0,
        ),
      fontsLoaded:
        document.fonts.check('16px "Manrope Variable"', 'Åäö') &&
        document.fonts.check('16px "Cormorant Garamond Variable"', 'Åäö'),
    };
  });
  expect(external).toEqual([]);
  expect(metrics.fontsLoaded).toBe(true);
  expect(metrics.fontCount).toBe(3);
  expect(metrics.fontBytes).toBeLessThan(110_000);
  expect(metrics.scriptBytes + metrics.inlineScriptBytes).toBeLessThan(10_000);
  expect(metrics.cls).toBeLessThan(0.1);
  expect(metrics.resourceBytes).toBeLessThan(1_000_000);
  await expect(page.locator('.hero img')).toHaveAttribute('loading', 'eager');
  await expect(page.locator('.hero img')).toHaveAttribute(
    'fetchpriority',
    'high',
  );
  for (const image of await page.locator('img').all()) {
    expect(Number(await image.getAttribute('width'))).toBeGreaterThan(0);
    expect(Number(await image.getAttribute('height'))).toBeGreaterThan(0);
    if (await image.getAttribute('alt')) {
      expect(await image.getAttribute('srcset')).toBeTruthy();
      expect(await image.getAttribute('sizes')).toBeTruthy();
    }
  }
  await testInfo.attach('performance-lab-snapshot', {
    body: JSON.stringify(metrics, null, 2),
    contentType: 'application/json',
  });
  console.log(
    `${testInfo.project.name} performance snapshot: ${JSON.stringify(metrics)}`,
  );
});
