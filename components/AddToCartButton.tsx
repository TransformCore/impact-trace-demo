'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

export function AddToCartButton({ slug, label = 'Add to basket' }: { slug: string; label?: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      className="button"
      data-testid={`add-to-basket-${slug}`}
      onClick={() => {
        add(slug);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1500);
      }}
    >
      {added ? 'Added' : label}
    </button>
  );
}
