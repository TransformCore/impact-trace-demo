# GreenCart — an ImpactTrace demo storefront

A small Next.js storefront built to demonstrate
[ImpactTrace](https://github.com/TransformCore/impact-trace), a carbon estimation CLI that runs
Playwright journeys and reports the energy and carbon cost of what your users actually do.

The site ships the **same catalogue twice**:

| Storefront | Path | What it does |
| --- | --- | --- |
| Optimised | `/products` | Next.js image optimisation, no third-party tags, no idle animation |
| Legacy | `/legacy/products` | Raw `<img>` tags on multi-megabyte PNGs, a 620 KB vendor bundle, two third-party CDN scripts, and a carousel that burns CPU after load |

Running the same checkout journey against both gives you a meaningful before/after:

```
Optimised   Impact Score A   0.01g CO2   0.06 MB   budgets PASS
Legacy      Impact Score C   0.22g CO2   1.86 MB   budgets FAIL
```

## Getting started

```bash
npm install
npx playwright install chromium
npm run build
npm run start          # http://localhost:3100
```

The heavy and optimised image assets are **generated, not committed** — `scripts/generate-assets.mjs`
writes them into `public/heavy` and `public/optimised` and runs automatically before `dev` and
`build`. A seeded PRNG keeps every run byte-identical.

## Running the Playwright tests

```bash
npm run test:e2e
```

The config starts the production server for you. Eight tests cover:

- both storefronts being reachable from the home page
- the discovery journey (home → catalogue → two product pages → back), optimised and legacy
- the purchase journey (add two items → basket → checkout → confirmation), optimised and legacy
- the abandonment journey (add one item → basket → remove → empty)
- payload guards asserting the legacy storefront really is at least 5× heavier, and that its
  oversized vendor bundle is still oversized

## Running ImpactTrace

ImpactTrace is not on npm yet, but its repo has a `prepare` script, so it installs and builds
straight from GitHub as a dev dependency:

```json
"@transform-uk/impact-trace": "github:TransformCore/impact-trace"
```

That puts an `impact-trace` binary on the path. With the site running:

```bash
npm run impact:home                 # single URL
npm run impact:compare              # optimised vs legacy product listing, side by side
npm run impact:journey:browse       # discovery journey
npm run impact:journey:optimised    # checkout journey, with --compare-cache
npm run impact:journey:legacy       # same journey, legacy storefront
npm run impact:all                  # all three journeys
```

Anything else the CLI supports can be passed straight through:

```bash
npm run impact -- --url http://localhost:3100/legacy/products --verbose --no-cpu
npm run impact -- impact-trace/journeys/legacyCheckout.ts --format github-pr
```

JSON reports land in `reports/`. The CLI does not create the output directory itself, so the
scripts run `npm run reports:dir` first.

## How the journeys are shared

`journeys/flows.ts` is the single source of truth for what a user does. Both consumers import it:

- `tests/*.spec.ts` runs the flows and asserts the outcomes
- `impact-trace/journeys/*.ts` exports each flow as the default function ImpactTrace expects

```ts
import type { Page } from 'playwright';
import { purchaseTwoItems } from '../../journeys/flows.ts';

export default async function run(page: Page): Promise<void> {
  await purchaseTwoItems(page, 'legacy');
}
```

That means the carbon report always describes a journey you actually test. If a flow breaks, the
Playwright suite fails first and you know the measurement is stale.

The journey scripts are loaded by Node's dynamic `import()`, so they rely on Node 22.18+ / 24
type stripping. The `.ts` extension in the import specifier and the `{"type": "module"}` marker
files in `journeys/` and `impact-trace/journeys/` are both required for that to resolve.

## Budgets

`impact-trace.config.json` sets deliberately tight budgets so the contrast is visible:

```json
{ "carbonGrams": 0.1, "transferMb": 1, "cpuSeconds": 1, "thirdPartyMb": 0.1 }
```

The optimised journey passes all four. The legacy journey blows the carbon and transfer budgets and
exits non-zero — which is exactly how you would wire it into a pipeline.

## CI

`.github/workflows/ci.yml` runs the Playwright suite, starts the site, measures both journeys, and
uploads the JSON reports as an artifact. The legacy run uses `continue-on-error: true` because
failing is the demonstration.

## Layout

```
app/                      Next.js App Router pages (optimised + legacy storefronts)
components/               Cart context, header, add-to-basket button
lib/products.ts           Catalogue data
journeys/flows.ts         Shared user journeys
impact-trace/journeys/    ImpactTrace entry points wrapping the shared flows
tests/                    Playwright specs
scripts/                  Asset generator
```

## Contributing

Bug reports, documentation improvements, and pull requests are welcome. Please keep changes
focused and run `npm run build` and `npm run test:e2e` before opening a pull request.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution checklist and [SECURITY.md](SECURITY.md)
for reporting security issues.

## License

This project is licensed under the [MIT License](LICENSE).
