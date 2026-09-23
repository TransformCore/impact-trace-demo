export type Product = {
  slug: string;
  name: string;
  price: number;
  summary: string;
  description: string;
  material: string;
};

export const products: Product[] = [
  {
    slug: 'rain-shell',
    name: 'Coastline Rain Shell',
    price: 189,
    summary: 'Three-layer waterproof shell built for grey British weather.',
    description:
      'A fully taped three-layer shell with a helmet-compatible hood and pit zips. Recycled face fabric, PFC-free DWR finish, and a repair-first warranty.',
    material: '100% recycled polyester',
  },
  {
    slug: 'merino-hoodie',
    name: 'Everyday Merino Hoodie',
    price: 129,
    summary: 'Mid-weight merino that survives a week of commuting.',
    description:
      'Knitted from traceable non-mulesed merino with a touch of nylon at the elbows. Naturally odour resistant, so it needs washing far less often.',
    material: '87% merino wool, 13% nylon',
  },
  {
    slug: 'trail-runners',
    name: 'Fell Trail Runners',
    price: 145,
    summary: 'Grippy, resoleable trail shoes for soft ground.',
    description:
      'A 6mm lugged outsole on a resoleable midsole, so the shoe outlasts three sets of rubber rather than heading to landfill after one.',
    material: 'Recycled mesh upper, natural rubber outsole',
  },
  {
    slug: 'canvas-tote',
    name: 'Harbour Canvas Tote',
    price: 45,
    summary: 'Heavyweight organic canvas with a reinforced base.',
    description:
      'A 16oz organic cotton canvas tote with bar-tacked handles and an internal zip pocket. Designed to be the last bag you buy this decade.',
    material: '16oz organic cotton canvas',
  },
  {
    slug: 'wool-beanie',
    name: 'Moorland Wool Beanie',
    price: 32,
    summary: 'British lambswool, ribbed and roll-brimmed.',
    description:
      'Spun and knitted in Yorkshire from British lambswool. Undyed options available, which skips the most energy-intensive step in the process.',
    material: '100% British lambswool',
  },
  {
    slug: 'field-trousers',
    name: 'Fieldwork Trousers',
    price: 110,
    summary: 'Double-knee work trousers with a gusseted crotch.',
    description:
      'Organic cotton canvas with a double knee, articulated seat, and seven pockets. Pre-washed so they will not shrink on you.',
    material: '98% organic cotton, 2% elastane',
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function formatPrice(pence: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  }).format(pence);
}
