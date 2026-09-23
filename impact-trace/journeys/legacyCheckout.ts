import type { Page } from 'playwright';
import { purchaseTwoItems } from '../../journeys/flows.ts';

/**
 * The same checkout journey against the legacy storefront. Compare the report
 * with the optimised run to see where the carbon actually goes.
 * Run with: npm run impact:journey:legacy
 */
export default async function run(page: Page): Promise<void> {
  await purchaseTwoItems(page, 'legacy');
}
