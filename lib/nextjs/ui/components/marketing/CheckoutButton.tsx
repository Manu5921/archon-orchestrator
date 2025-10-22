"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { Button, type ButtonProps } from "@/lib/nextjs/ui/components/ui/button";

export interface CheckoutButtonProps extends Omit<ButtonProps, "onClick"> {
  /**
   * Stripe Price ID for checkout
   */
  priceId: string;

  /**
   * Server Action to create Stripe Checkout Session
   * Should accept priceId and redirect to Stripe Checkout
   * Example: import { createCheckoutSession } from '@/lib/nextjs/payments/stripe/checkout'
   */
  onCheckout: (priceId: string) => Promise<void>;

  /**
   * Custom button text
   * @default "Subscribe Now"
   */
  children?: React.ReactNode;
}

/**
 * Checkout Button Component
 *
 * One-click button to initiate Stripe Checkout flow.
 * Integrates with lib/nextjs/payments/stripe for session creation.
 *
 * @example
 * ```tsx
 * // app/(marketing)/pricing/page.tsx
 * import { CheckoutButton } from '@/lib/nextjs/ui/components/marketing/CheckoutButton';
 * import { createCheckoutSession } from '@/lib/nextjs/payments/stripe/checkout';
 *
 * export default function PricingPage() {
 *   async function handleCheckout(priceId: string) {
 *     'use server';
 *     const { url } = await createCheckoutSession({ priceId });
 *     redirect(url);
 *   }
 *
 *   return (
 *     <CheckoutButton
 *       priceId="price_xxx"
 *       onCheckout={handleCheckout}
 *     >
 *       Buy Now
 *     </CheckoutButton>
 *   );
 * }
 * ```
 */
export function CheckoutButton({
  priceId,
  onCheckout,
  children = "Subscribe Now",
  disabled,
  ...props
}: CheckoutButtonProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await onCheckout(priceId);
    });
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isPending || disabled}
      data-testid="checkout-button"
      {...props}
    >
      {isPending ? (
        <>
          <Loader2Icon className="mr-2 size-4 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
