import { stripe } from './checkout';
import type { PriceData, ProductData } from './types';

/**
 * Get all active prices (formatted)
 *
 * @example
 * const prices = await getPrices();
 * // [{ id: 'price_...', unitAmount: 1999, currency: 'usd', interval: 'month' }]
 */
export async function getPrices(): Promise<PriceData[]> {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring',
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: (price.recurring?.interval as 'month' | 'year') || null,
    intervalCount: price.recurring?.interval_count || 1,
    trialPeriodDays: price.recurring?.trial_period_days || null,
  }));
}

/**
 * Get specific price by ID
 */
export async function getPrice(priceId: string): Promise<PriceData> {
  const price = await stripe.prices.retrieve(priceId, {
    expand: ['product'],
  });

  return {
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: (price.recurring?.interval as 'month' | 'year') || null,
    intervalCount: price.recurring?.interval_count || 1,
    trialPeriodDays: price.recurring?.trial_period_days || null,
  };
}

/**
 * Get all active products (formatted)
 *
 * @example
 * const products = await getProducts();
 * // [{ id: 'prod_...', name: 'Pro Plan', description: '...', defaultPriceId: 'price_...' }]
 */
export async function getProducts(): Promise<ProductData[]> {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id || null,
    metadata: product.metadata || {},
  }));
}

/**
 * Get specific product by ID
 */
export async function getProduct(productId: string): Promise<ProductData> {
  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  });

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id || null,
    metadata: product.metadata || {},
  };
}

/**
 * Get products with their prices
 *
 * @example
 * const productsWithPrices = await getProductsWithPrices();
 * // [{ product: {...}, prices: [{...}, {...}] }]
 */
export async function getProductsWithPrices(): Promise<
  Array<{ product: ProductData; prices: PriceData[] }>
> {
  const [products, prices] = await Promise.all([getProducts(), getPrices()]);

  return products.map((product) => ({
    product,
    prices: prices.filter((price) => price.productId === product.id),
  }));
}

/**
 * Format price for display
 *
 * @example
 * formatPrice(1999, 'usd') // "$19.99"
 * formatPrice(2000, 'eur') // "€20.00"
 */
export function formatPrice(
  unitAmount: number | null,
  currency: string
): string {
  if (unitAmount === null) {
    return 'Free';
  }

  const amount = unitAmount / 100;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount);
}

/**
 * Format interval for display
 *
 * @example
 * formatInterval('month', 1) // "per month"
 * formatInterval('year', 1)  // "per year"
 * formatInterval('month', 3) // "every 3 months"
 */
export function formatInterval(
  interval: 'month' | 'year' | null,
  intervalCount: number
): string {
  if (!interval) {
    return '';
  }

  if (intervalCount === 1) {
    return `per ${interval}`;
  }

  return `every ${intervalCount} ${interval}s`;
}
