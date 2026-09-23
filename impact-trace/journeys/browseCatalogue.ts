import type { Page } from 'playwright';
import { browseCatalogue } from '../../journeys/flows.ts';

/**
 * Discovery journey: home -> catalogue -> two product pages -> back.
 * Run with: npm run impact:journey:browse
 */
export default async function run(page: Page): Promise<void> {
  await browseCatalogue(page, 'optimised');
}
