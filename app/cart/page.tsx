'use client';

import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { formatPrice, getProduct } from '@/lib/products';

export default function CartPage() {
  const { lines, remove } = useCart();

  const total = lines.reduce((sum, line) => {
    const product = getProduct(line.slug);
    return product ? sum + product.price * line.quantity : sum;
  }, 0);

  if (lines.length === 0) {
    return (
      <main>
        <h1>Your basket</h1>
        <p className="lede" data-testid="empty-basket">
          Your basket is empty.
        </p>
        <Link href="/products" className="button">
          Browse the shop
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Your basket</h1>
      <table data-testid="basket-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => {
            const product = getProduct(line.slug);
            if (!product) return null;
            return (
              <tr key={line.slug} data-testid={`basket-row-${line.slug}`}>
                <td>{product.name}</td>
                <td>{line.quantity}</td>
                <td>{formatPrice(product.price * line.quantity)}</td>
                <td>
                  <button
                    type="button"
                    className="button secondary"
                    data-testid={`remove-${line.slug}`}
                    onClick={() => remove(line.slug)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="price" data-testid="basket-total">
        Total: {formatPrice(total)}
      </p>

      <Link href="/checkout" className="button" data-testid="go-to-checkout">
        Checkout
      </Link>
    </main>
  );
}
