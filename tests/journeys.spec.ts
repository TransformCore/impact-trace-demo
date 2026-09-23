import { expect, test } from '@playwright/test';
import { abandonAtBasket, browseCatalogue, purchaseTwoItems, visitHome } from '../journeys/flows';

// Each test drives the same shared journey used by the ImpactTrace scripts in
// `impact-trace/journeys/`, then asserts the outcome. If a journey breaks here,
// the carbon report for that journey is no longer trustworthy either.

test('home page offers both storefronts', async ({ page }) => {
  await visitHome(page);

  await expect(page.getByTestId('shop-optimised')).toBeVisible();
  await expect(page.getByTestId('shop-legacy')).toBeVisible();
});

test('discovery journey: browse the optimised catalogue', async ({ page }) => {
  await browseCatalogue(page, 'optimised');

  await expect(page.getByTestId('seasonal-promo')).toBeVisible();
  await expect(page.getByTestId('product-grid')).toBeVisible();
  await expect(page.getByTestId('product-grid').locator('article')).toHaveCount(6);
});

test('discovery journey: browse the legacy catalogue', async ({ page }) => {
  await browseCatalogue(page, 'legacy');

  await expect(page.getByTestId('legacy-banner')).toBeVisible();
  await expect(page.getByTestId('legacy-product-grid').locator('article')).toHaveCount(6);
});

test('purchase journey: two items through to confirmation', async ({ page }) => {
  await purchaseTwoItems(page, 'optimised');

  await expect(page.getByTestId('order-confirmation')).toBeVisible();
  await expect(page.getByTestId('order-ref')).toHaveText(/^GC-\d{6}$/);
  await expect(page.getByTestId('basket-count')).toHaveText('0');
});

test('purchase journey: legacy storefront reaches the same outcome', async ({ page }) => {
  await purchaseTwoItems(page, 'legacy');

  await expect(page.getByTestId('order-confirmation')).toBeVisible();
});

test('abandonment journey: basket empties after removing the only line', async ({ page }) => {
  await abandonAtBasket(page, 'optimised');

  await expect(page.getByTestId('empty-basket')).toBeVisible();
  await expect(page.getByTestId('basket-count')).toHaveText('0');
});
