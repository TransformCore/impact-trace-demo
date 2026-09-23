import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { formatPrice, getProduct, products } from '@/lib/products';

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <p>
        <Link href="/products">&larr; Back to shop</Link>
      </p>
      <div className="product-detail">
        <Image
          src={`/optimised/${product.slug}.png`}
          alt={product.name}
          width={520}
          height={520}
          priority
        />
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
