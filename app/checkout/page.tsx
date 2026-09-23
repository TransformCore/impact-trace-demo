'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { formatPrice, getProduct } from '@/lib/products';

export default function CheckoutPage() {
  const { lines, clear } = useCart();
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const total = lines.reduce((sum, line) => {
    const product = getProduct(line.slug);
    return product ? sum + product.price * line.quantity : sum;
  }, 0);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderRef(`GC-${Math.floor(100000 + Math.random() * 899999)}`);
    clear();
  }

  if (orderRef) {
    return (
      <main>
        <h1 data-testid="order-confirmation">Order confirmed</h1>
        <p className="lede">
          Thanks — your order reference is <strong data-testid="order-ref">{orderRef}</strong>.
        </p>
        <Link href="/products" className="button">
          Keep shopping
        </Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Checkout</h1>
      {lines.length === 0 ? (
        <p className="lede" data-testid="checkout-empty">
          There is nothing to check out.
        </p>
      ) : (
        <>
          <p className="lede" data-testid="checkout-total">
            Paying {formatPrice(total)} for {lines.length} line(s).
          </p>
          <form onSubmit={handleSubmit}>
            <label className="field">
              <span>Full name</span>
              <input name="name" data-testid="checkout-name" required defaultValue="" />
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" data-testid="checkout-email" required />
            </label>
            <label className="field">
              <span>Postcode</span>
              <input name="postcode" data-testid="checkout-postcode" required />
            </label>
            <button type="submit" className="button" data-testid="place-order">
              Place order
            </button>
          </form>
        </>
      )}
    </main>
  );
}
