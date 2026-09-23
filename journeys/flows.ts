import type { Page } from 'playwright';

/**
 * Shared user journeys.
 *
 * These are the single source of truth for "what a user does" in this demo.
 * The Playwright specs in `tests/` run them with assertions, and the ImpactTrace
 * journey scripts in `impact-trace/journeys/` run the exact same code so the
 * carbon report describes the journey you actually test.
 */

export const BASE_URL = process.env.DEMO_BASE_URL ?? 'http://localhost:3100';

export type Storefront = 'optimised' | 'legacy';

function shopPath(storefront: Storefront): string {
  return storefront === 'legacy' ? '/legacy/products' : '/products';
}

export async function visitHome(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.getByRole('heading', { name: 'GreenCart', level: 1 }).waitFor();
}

/** Land on the home page, open the catalogue, then drill into two products. */
export async function browseCatalogue(page: Page, storefront: Storefront = 'optimised'): Promise<void> {
  await visitHome(page);

  await page.getByTestId(storefront === 'legacy' ? 'shop-legacy' : 'shop-optimised').click();
  await page.waitForURL(`**${shopPath(storefront)}`);
  await page.getByTestId('product-rain-shell').waitFor();

  for (const slug of ['rain-shell', 'trail-runners']) {
    await page.getByTestId(`product-${slug}`).getByRole('link').first().click();
    await page.waitForURL(`**${shopPath(storefront)}/${slug}`);
    await page.getByTestId('product-name').waitFor();
    await page.goBack();
    await page.getByTestId('product-rain-shell').waitFor();
  }
}

/** Add two items to the basket, remove one, and place the order. */
export async function purchaseTwoItems(
  page: Page,
  storefront: Storefront = 'optimised',
): Promise<void> {
  await page.goto(`${BASE_URL}${shopPath(storefront)}`, { waitUntil: 'networkidle' });

  await page.getByTestId('add-to-basket-merino-hoodie').click();
  await page.getByTestId('add-to-basket-wool-beanie').click();
  await page.getByTestId('basket-link').click();
  await page.waitForURL('**/cart');

  await page.getByTestId('basket-table').waitFor();
  await page.getByTestId('go-to-checkout').click();
  await page.waitForURL('**/checkout');

  await page.getByTestId('checkout-name').fill('Sam Rivers');
  await page.getByTestId('checkout-email').fill('sam.rivers@example.com');
  await page.getByTestId('checkout-postcode').fill('BS1 4DJ');
  await page.getByTestId('place-order').click();

  await page.getByTestId('order-confirmation').waitFor();
}

/** Abandon at the basket — the most common journey on a real storefront. */
export async function abandonAtBasket(
  page: Page,
  storefront: Storefront = 'optimised',
): Promise<void> {
  await page.goto(`${BASE_URL}${shopPath(storefront)}`, { waitUntil: 'networkidle' });
  await page.getByTestId('add-to-basket-canvas-tote').click();
  await page.getByTestId('basket-link').click();
  await page.waitForURL('**/cart');
  await page.getByTestId('basket-total').waitFor();
  await page.getByTestId('remove-canvas-tote').click();
  await page.getByTestId('empty-basket').waitFor();
}
