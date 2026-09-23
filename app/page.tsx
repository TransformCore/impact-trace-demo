import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>GreenCart</h1>
      <p className="lede">
        A deliberately small storefront used to demonstrate{' '}
        <a href="https://github.com/TransformCore/impact-trace">ImpactTrace</a>. The same catalogue
        is served twice: an optimised build and a legacy build weighed down by unoptimised images, a
        bloated vendor bundle, and third-party tags. Run the journeys and compare the reports.
      </p>

      <div className="hero">
        <Image
          src="/optimised/hero.png"
          alt="Abstract gradient hero"
          width={1200}
          height={700}
          priority
        />
      </div>

      <h2>Two versions of the same shop</h2>
      <div className="grid">
        <div className="card">
          <div className="card-body">
            <h3>Optimised storefront</h3>
            <p>
              Next.js image optimisation, no third-party tags, no idle animation loop. This is the
              baseline you want your budgets set against.
            </p>
            <Link href="/products" className="button" data-testid="shop-optimised">
              Browse the shop
            </Link>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3>Legacy storefront</h3>
            <p>
              Raw <code>&lt;img&gt;</code> tags pointing at multi-megabyte PNGs, a 600&nbsp;KB vendor
              bundle, and a carousel that burns CPU long after load.
            </p>
            <Link href="/legacy/products" className="button secondary" data-testid="shop-legacy">
              Browse the legacy shop
            </Link>
          </div>
        </div>
      </div>

      <h2>Measuring it</h2>
      <p className="lede">
        With the site running on <code>http://localhost:3100</code>:
      </p>
      <pre className="panel">
        <code>
          npm run impact:compare{'\n'}
          npm run impact:journey:optimised{'\n'}
          npm run impact:journey:legacy
        </code>
      </pre>
    </main>
  );
}
