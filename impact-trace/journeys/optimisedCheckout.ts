import type { Page } from 'playwright';
import { purchaseTwoItems } from '../../journeys/flows.ts';

/**
 * Optimised storefront: browse -> basket -> checkout -> confirmation.
 * Run with: npm run impact:journey:optimised
 */
export default async function run(page: Page): Promise<void> {
  await purchaseTwoItems(page, 'optimised');
}
