import { expect, test } from '@playwright/test';

// A crude, in-test version of what ImpactTrace measures properly. It exists so
// the demo fails loudly if the "heavy" assets ever stop being heavy, which
// would make the ImpactTrace comparison meaningless.

async function measurePageBytes(page: import('@playwright/test').Page, path: string) {
  let bytes = 0;
  const seen = new Set<string>();

  page.on('response', (response) => {
    const url = response.url();
    if (seen.has(url)) return;
    seen.add(url);
    const length = Number(response.headers()['content-length'] ?? 0);
    bytes += Number.isFinite(length) ? length : 0;
  });

  await page.goto(path, { waitUntil: 'networkidle' });
  return bytes;
}

test('the legacy storefront is measurably heavier than the optimised one', async ({ browser }) => {
  const optimisedPage = await browser.newPage();
  const optimisedBytes = await measurePageBytes(optimisedPage, '/products');
  await optimisedPage.close();

  const legacyPage = await browser.newPage();
  const legacyBytes = await measurePageBytes(legacyPage, '/legacy/products');
  await legacyPage.close();

  console.log(
    `optimised: ${(optimisedBytes / 1024).toFixed(0)} KB, legacy: ${(legacyBytes / 1024).toFixed(0)} KB`,
  );

  expect(legacyBytes).toBeGreaterThan(optimisedBytes * 5);
});

test('the legacy storefront loads its oversized vendor bundle', async ({ page }) => {
  const bundleResponse = page.waitForResponse((response) =>
    response.url().includes('/heavy/vendor-bundle.js'),
  );

  await page.goto('/legacy/products');
  const response = await bundleResponse;

  expect(response.status()).toBe(200);
  expect((await response.body()).byteLength).toBeGreaterThan(300 * 1024);
});
