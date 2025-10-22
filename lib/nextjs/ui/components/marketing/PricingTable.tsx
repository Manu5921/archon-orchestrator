import * as React from "react";
import { CheckIcon } from "lucide-react";
import { Button } from "@/lib/nextjs/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/lib/nextjs/ui/components/ui/card";

export interface PricingPlan {
  /**
   * Plan name (e.g., "Basic", "Pro", "Enterprise")
   */
  name: string;

  /**
   * Price in cents (e.g., 999 = $9.99)
   */
  price: number;

  /**
   * Billing interval (e.g., "month", "year")
   */
  interval: "month" | "year";

  /**
   * Trial period days (optional)
   */
  trialDays?: number;

  /**
   * List of features included in this plan
   */
  features: string[];

  /**
   * Stripe Price ID for checkout
   */
  priceId: string;

  /**
   * Highlight this plan as "Popular" or "Recommended"
   */
  highlighted?: boolean;

  /**
   * CTA button text
   * @default "Get Started"
   */
  ctaText?: string;
}

export interface PricingTableProps {
  /**
   * Array of pricing plans to display
   */
  plans: PricingPlan[];

  /**
   * Server Action to handle checkout
   * Should accept priceId and redirect to Stripe Checkout
   * Example: import { createCheckoutSession } from '@/lib/nextjs/payments/stripe/checkout'
   */
  onCheckout: (priceId: string) => Promise<void>;

  /**
   * Loading state
   */
  isLoading?: boolean;
}

/**
 * Pricing Table Component
 *
 * Displays pricing plans with CSS variables ONLY (no hardcoded colors).
 * Integrates with lib/nextjs/payments/stripe for checkout.
 *
 * **FIXED:** Converted hardcoded colors from Vercel starter:
 * - text-gray-900 → text-foreground
 * - text-gray-600 → text-muted-foreground
 * - text-gray-700 → text-foreground
 * - text-orange-500 → text-primary
 *
 * @example
 * ```tsx
 * // app/(marketing)/pricing/page.tsx
 * import { PricingTable } from '@/lib/nextjs/ui/components/marketing/PricingTable';
 * import { createCheckoutSession } from '@/lib/nextjs/payments/stripe/checkout';
 *
 * export default function PricingPage() {
 *   const plans = [
 *     {
 *       name: 'Basic',
 *       price: 999,
 *       interval: 'month',
 *       trialDays: 7,
 *       features: ['Feature 1', 'Feature 2'],
 *       priceId: 'price_xxx',
 *     },
 *   ];
 *
 *   async function handleCheckout(priceId: string) {
 *     'use server';
 *     await createCheckoutSession({ priceId });
 *   }
 *
 *   return <PricingTable plans={plans} onCheckout={handleCheckout} />;
 * }
 * ```
 */
export function PricingTable({
  plans,
  onCheckout,
  isLoading = false,
}: PricingTableProps) {
  return (
    <div
      className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
      data-testid="pricing-table"
    >
      {plans.map((plan) => (
        <PricingCard
          key={plan.priceId}
          plan={plan}
          onCheckout={onCheckout}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

function PricingCard({
  plan,
  onCheckout,
  isLoading,
}: {
  plan: PricingPlan;
  onCheckout: (priceId: string) => Promise<void>;
  isLoading: boolean;
}) {
  const [isPending, startTransition] = React.useTransition();

  const handleCheckout = () => {
    startTransition(async () => {
      await onCheckout(plan.priceId);
    });
  };

  return (
    <Card
      className={plan.highlighted ? "border-primary shadow-lg" : ""}
      data-testid="pricing-card"
    >
      <CardHeader>
        {plan.highlighted && (
          <div className="bg-primary text-primary-foreground inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 w-fit">
            Popular
          </div>
        )}
        <CardTitle className="text-2xl text-foreground">{plan.name}</CardTitle>
        {plan.trialDays && (
          <CardDescription>
            with {plan.trialDays} day free trial
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price */}
        <div>
          <p className="text-4xl font-medium text-foreground">
            ${(plan.price / 100).toFixed(2)}
            <span className="text-xl font-normal text-muted-foreground ml-1">
              / {plan.interval}
            </span>
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-3" data-testid="pricing-features">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckIcon className="size-5 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={plan.highlighted ? "default" : "outline"}
          onClick={handleCheckout}
          disabled={isPending || isLoading}
        >
          {isPending ? "Processing..." : plan.ctaText || "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  );
}
