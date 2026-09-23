import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from '@/components/AddToCartButton';
import { formatPrice, products } from '@/lib/products';

export const metadata = { title: 'Shop — GreenCart' };

export default function ProductsPage() {
  return (
    <main>
      <h1>Shop</h1>
      <p className="lede">
        Six products, each with an optimised, compressible image served through the Next.js image
        pipeline.
      </p>

      <section className="seasonal-promo" data-testid="seasonal-promo">
        <Image
          src="/optimised/hero.png"
          alt="Green abstract landscape"
          width={1200}
          height={700}
          priority
          unoptimized
        />
        <div>
          <strong>Autumn layers have landed</strong>
          <span>Built for cooler trails and changeable skies.</span>
        </div>
      </section>

      <div className="grid" data-testid="product-grid">
        {products.map((product) => (
          <article className="card" key={product.slug} data-testid={`product-${product.slug}`}>
            <Link href={`/products/${product.slug}`}>
              <Image
                src={`/optimised/${product.slug}.png`}
                alt={product.name}
                width={520}
                height={520}
              />
            </Link>
            <div className="card-body">
              <h3>
                <Link href={`/products/${product.slug}`}>{product.name}</Link>
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
