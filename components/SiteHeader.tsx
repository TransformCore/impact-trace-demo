'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function SiteHeader() {
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <Link href="/" className="brand">
        GreenCart
      </Link>
      <nav>
        <Link href="/products">Shop</Link>
        <Link href="/legacy/products">Legacy shop</Link>
        <Link href="/cart" data-testid="basket-link">
          Basket (<span data-testid="basket-count">{itemCount}</span>)
        </Link>
      </nav>
    </header>
  );
}
