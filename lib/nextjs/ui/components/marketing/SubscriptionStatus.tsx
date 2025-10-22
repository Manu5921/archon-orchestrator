import * as React from "react";
import {
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  AlertTriangleIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/nextjs/ui/components/ui/card";
import { Button } from "@/lib/nextjs/ui/components/ui/button";

export type SubscriptionState =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export interface SubscriptionStatusProps {
  /**
   * Current subscription status from Stripe
   */
  status: SubscriptionState;

  /**
   * Plan name (e.g., "Pro", "Enterprise")
   */
  planName: string;

  /**
   * Next billing date (for active subscriptions)
   */
  renewsAt?: Date;

  /**
   * Trial end date (for trialing subscriptions)
   */
  trialEndsAt?: Date;

  /**
   * Callback to open Stripe Customer Portal
   * Example: import { createPortalLink } from '@/lib/nextjs/payments/stripe/portal'
   */
  onManageSubscription?: () => Promise<void>;

  /**
   * Show detailed subscription information
   * @default false
   */
  detailed?: boolean;
}

/**
 * Subscription Status Component
 *
 * Displays current subscription state with visual indicators.
 * Integrates with lib/nextjs/payments/stripe for subscription data.
 *
 * @example
 * ```tsx
 * // app/(dashboard)/settings/billing/page.tsx
 * import { SubscriptionStatus } from '@/lib/nextjs/ui/components/marketing/SubscriptionStatus';
 * import { getSubscription } from '@/lib/nextjs/payments/stripe/subscriptions';
 * import { createPortalLink } from '@/lib/nextjs/payments/stripe/portal';
 *
 * export default async function BillingPage() {
 *   const subscription = await getSubscription();
 *
 *   async function handleManageSubscription() {
 *     'use server';
 *     const { url } = await createPortalLink();
 *     redirect(url);
 *   }
 *
 *   return (
 *     <SubscriptionStatus
 *       status={subscription.status}
 *       planName={subscription.planName}
 *       renewsAt={subscription.currentPeriodEnd}
 *       onManageSubscription={handleManageSubscription}
 *       detailed
 *     />
 *   );
 * }
 * ```
 */
export function SubscriptionStatus({
  status,
  planName,
  renewsAt,
  trialEndsAt,
  onManageSubscription,
  detailed = false,
}: SubscriptionStatusProps) {
  const statusConfig = getStatusConfig(status);

  return (
    <Card data-testid="subscription-status">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <statusConfig.icon className={`size-5 ${statusConfig.color}`} />
              {statusConfig.label}
            </CardTitle>
            <CardDescription>{planName} Plan</CardDescription>
          </div>
          {onManageSubscription && (
            <Button
              variant="outline"
              size="sm"
              onClick={onManageSubscription}
              data-testid="manage-subscription-button"
            >
              Manage
            </Button>
          )}
        </div>
      </CardHeader>

      {detailed && (
        <CardContent className="space-y-3">
          {/* Status Message */}
          <p className="text-muted-foreground text-sm">
            {statusConfig.description}
          </p>

          {/* Next Billing Date */}
          {status === "active" && renewsAt && (
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="size-4 text-muted-foreground" />
              <span className="text-foreground">
                Renews on{" "}
                <strong>{renewsAt.toLocaleDateString()}</strong>
              </span>
            </div>
          )}

          {/* Trial End Date */}
          {status === "trialing" && trialEndsAt && (
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon className="size-4 text-warning" />
              <span className="text-foreground">
                Trial ends on{" "}
                <strong>{trialEndsAt.toLocaleDateString()}</strong>
              </span>
            </div>
          )}

          {/* Past Due Warning */}
          {status === "past_due" && (
            <div className="bg-warning/10 border border-warning/50 rounded-md p-3">
              <p className="text-warning text-sm font-medium">
                ⚠️ Payment failed. Please update your payment method.
              </p>
            </div>
          )}

          {/* Canceled Notice */}
          {status === "canceled" && renewsAt && (
            <div className="bg-muted rounded-md p-3">
              <p className="text-foreground text-sm">
                Your subscription will end on{" "}
                <strong>{renewsAt.toLocaleDateString()}</strong>
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

/**
 * Get status configuration (icon, color, label, description)
 */
function getStatusConfig(status: SubscriptionState) {
  const configs: Record<
    SubscriptionState,
    {
      icon: typeof CheckCircle2Icon;
      color: string;
      label: string;
      description: string;
    }
  > = {
    active: {
      icon: CheckCircle2Icon,
      color: "text-success",
      label: "Active Subscription",
      description: "Your subscription is active and will renew automatically.",
    },
    trialing: {
      icon: ClockIcon,
      color: "text-info",
      label: "Free Trial",
      description:
        "You're currently on a free trial. No charges until trial ends.",
    },
    past_due: {
      icon: AlertTriangleIcon,
      color: "text-warning",
      label: "Payment Failed",
      description:
        "Your last payment failed. Please update your payment method to avoid service interruption.",
    },
    canceled: {
      icon: XCircleIcon,
      color: "text-destructive",
      label: "Canceled",
      description:
        "Your subscription has been canceled. You'll retain access until the end of the billing period.",
    },
    unpaid: {
      icon: AlertTriangleIcon,
      color: "text-destructive",
      label: "Unpaid",
      description:
        "Your subscription is unpaid. Please update your payment method.",
    },
    incomplete: {
      icon: AlertTriangleIcon,
      color: "text-warning",
      label: "Incomplete",
      description:
        "Your subscription setup is incomplete. Please complete payment.",
    },
    incomplete_expired: {
      icon: XCircleIcon,
      color: "text-muted-foreground",
      label: "Expired",
      description: "Your subscription setup expired. Please try again.",
    },
    paused: {
      icon: ClockIcon,
      color: "text-muted-foreground",
      label: "Paused",
      description: "Your subscription is paused.",
    },
  };

  return configs[status];
}
