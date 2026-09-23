import Script from 'next/script';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { formatPrice, getProduct, products } from '@/lib/products';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function LegacyProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <Script src="/heavy/vendor-bundle.js" strategy="afterInteractive" />
      <Script src="/heavy/carousel.js" strategy="afterInteractive" />

      <p>
        <Link href="/legacy/products">&larr; Back to legacy shop</Link>
      </p>
      <div className="product-detail">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/heavy/${product.slug}.png`} alt={product.name} width={520} height={520} />
        <div>
          <h1 data-testid="product-name">{product.name}</h1>
          <p className="price" data-testid="product-price">
            {formatPrice(product.price)}
          </p>
          <p>{product.description}</p>
          <p className="panel">
            <strong>Material:</strong> {product.material}
          </p>
          <AddToCartButton slug={product.slug} />
        </div>
      </div>
    </main>
  );
}
