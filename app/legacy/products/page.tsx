import Script from 'next/script';
import Link from 'next/link';
import { AddToCartButton } from '@/components/AddToCartButton';
import { formatPrice, products } from '@/lib/products';

export const metadata = { title: 'Legacy shop — GreenCart' };

export default function LegacyProductsPage() {
  return (
    <main>
      {/* Deliberately bad practice: a huge vendor bundle plus third-party tags. */}
      <Script src="/heavy/vendor-bundle.js" strategy="afterInteractive" />
      <Script src="/heavy/carousel.js" strategy="afterInteractive" />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"
        strategy="afterInteractive"
      />

      <div className="banner" data-testid="legacy-banner">
        <strong>Legacy storefront.</strong> Unoptimised <code>&lt;img&gt;</code> tags, a 600&nbsp;KB
        vendor bundle, two third-party CDN scripts, and an animation loop that keeps the CPU busy
        after load. This is the page ImpactTrace should be shouting about.
      </div>

      <h1>Shop</h1>
      <p className="lede">The same six products, served the expensive way.</p>

      <div className="hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/heavy/hero.png" alt="Abstract noise hero" width={1200} height={700} />
      </div>

      <div className="grid" data-testid="legacy-product-grid">
        {products.map((product) => (
          <article className="card" key={product.slug} data-testid={`product-${product.slug}`}>
            <Link href={`/legacy/products/${product.slug}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/heavy/${product.slug}.png`} alt={product.name} width={520} height={520} />
            </Link>
            <div className="card-body">
              <h3>
                <Link href={`/legacy/products/${product.slug}`}>{product.name}</Link>
              </h3>
              <p>{product.summary}</p>
              <p className="price">{formatPrice(product.price)}</p>
              <AddToCartButton slug={product.slug} />
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
