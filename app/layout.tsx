import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CartProvider } from '@/components/CartProvider';
import { SiteHeader } from '@/components/SiteHeader';
import './globals.css';

export const metadata: Metadata = {
  title: 'GreenCart — ImpactTrace demo storefront',
  description:
    'A sample Next.js storefront used to demonstrate ImpactTrace carbon estimation across user journeys.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
