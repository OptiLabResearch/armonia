import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import business from '../../src/data/business.json' with { type: 'json' };
import { launchIssues, isHttpsUrl } from '../../src/data/launch.mjs';

const routes = [
  '/',
  '/behandlingar/',
  '/om-armonia/',
  '/kontakt/',
  '/404.html',
];
for (const route of routes) {
  test(`${route} has accessible Swedish content and no overflow`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      launchIssues(business).length || route === '/404.html'
        ? 'noindex, nofollow'
        : 'index, follow',
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    for (const image of await page.locator('img').all()) {
      // Decorative foliage can sit partially off-screen and should not move the viewport.
      if (await image.getAttribute('alt')) await image.scrollIntoViewIfNeeded();
      await expect(image).toHaveJSProperty('complete', true);
      expect(
        await image.evaluate((img: HTMLImageElement) => img.naturalWidth),
      ).toBeGreaterThan(0);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('all page links and local anchors resolve', async ({ page, request }) => {
  const links = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    for (const href of await page
      .locator('a[href]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href')!),
      )) {
      if (href.startsWith('/')) links.add(href);
    }
  }
  for (const href of links) {
    const [path, fragment] = href.split('#');
    expect((await request.get(path)).status(), href).toBe(200);
    if (fragment) {
      await page.goto(href);
      await expect(page.locator(`[id="${fragment}"]`)).toHaveCount(1);
    }
  }
});

test('booking fallback explains missing booking service', async ({ page }) => {
  test.skip(isHttpsUrl(business.bookingUrl), 'Real booking is configured.');
  await page.goto('/');
  await page.locator('.hero .button').click();
  await expect(page).toHaveURL(/\/kontakt\/#bokning$/);
  await expect(page.locator('#bokning')).toContainText(
    'Bokningen öppnar snart',
  );
  await expect(page.locator('#bokning')).toContainText(
    'Bokningslänk kompletteras',
  );
  await expect(page.locator('a[href^="mailto:"], a[href^="tel:"]')).toHaveCount(
    0,
  );
});

test('mobile menu supports keyboard, escape and navigation', async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name === 'desktop',
    'Desktop shows regular navigation.',
  );
  await page.goto('/');
  const menu = page.locator('.mobile-menu');
  const toggle = menu.locator('summary');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveAttribute('open', '');
  await page.keyboard.press('Escape');
  await expect(menu).not.toHaveAttribute('open');
  await expect(toggle).toBeFocused();
  await toggle.click();
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  expect(audit.violations).toEqual([]);
  await menu.getByRole('link', { name: 'Behandlingar', exact: true }).click();
  await expect(page).toHaveURL('/behandlingar/');
  if (isHttpsUrl(business.bookingUrl)) return;
  await page.goto('/kontakt/');
  await toggle.click();
  await menu.getByRole('link', { name: 'Boka behandling' }).click();
  await expect(menu).not.toHaveAttribute('open');
  await expect(page).toHaveURL('/kontakt/#bokning');
});

test('skip link and reduced motion remain usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(
    page.getByRole('link', { name: 'Hoppa till innehållet' }),
  ).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
});

test('homepage review screenshot', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator('img[alt]:not([alt=""])').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate((img: HTMLImageElement) => img.decode());
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({
    path: `test-results/home-${testInfo.project.name}.png`,
    fullPage: true,
  });
});
