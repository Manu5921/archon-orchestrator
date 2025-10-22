import * as React from "react";
import { cn } from "@/lib/nextjs/ui/lib/utils";

export interface Feature {
  /**
   * Feature name/title
   */
  name: string;

  /**
   * Feature description
   */
  description: string;

  /**
   * Icon component or SVG element
   */
  icon?: React.ReactNode;
}

export interface FeaturesProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Section headline
   */
  headline: string;

  /**
   * Section subheadline (optional)
   */
  subheadline?: string;

  /**
   * List of features to display
   */
  features: Feature[];

  /**
   * Grid columns
   * @default 3
   */
  columns?: 2 | 3 | 4;
}

/**
 * Features - Features grid component with icons
 *
 * Generic marketing template customizable via design-tokens.json.
 * All colors use CSS variables for 15-min rebrand compatibility.
 *
 * @example
 * ```tsx
 * <Features
 *   headline="Everything you need"
 *   subheadline="All-in-one platform for modern SaaS"
 *   columns={3}
 *   features={[
 *     {
 *       name: "Authentication",
 *       description: "Secure auth with Supabase",
 *       icon: <LockIcon />
 *     },
 *     {
 *       name: "Payments",
 *       description: "Stripe integration built-in",
 *       icon: <CreditCardIcon />
 *     }
 *   ]}
 * />
 * ```
 */
export const Features = React.forwardRef<HTMLDivElement, FeaturesProps>(
  (
    { headline, subheadline, features, columns = 3, className, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("bg-background py-24 sm:py-32", className)}
        {...props}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {headline}
            </h2>
            {subheadline && (
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                {subheadline}
              </p>
            )}
          </div>

          {/* Features Grid */}
          <div
            className={cn(
              "mx-auto mt-16 max-w-7xl sm:mt-20 lg:mt-24",
              "grid gap-x-8 gap-y-12",
              // Responsive columns based on prop
              columns === 2 &&
                "grid-cols-1 sm:grid-cols-2",
              columns === 3 &&
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
              columns === 4 &&
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
            )}
          >
            {features.map((feature, index) => (
              <div
                key={`feature-${index}`}
                className="flex flex-col items-start"
              >
                {/* Icon */}
                {feature.icon && (
                  <div className="rounded-lg bg-primary/10 p-2 text-primary dark:bg-primary/20">
                    {feature.icon}
                  </div>
                )}

                {/* Name */}
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {feature.name}
                </h3>

                {/* Description */}
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Features.displayName = "Features";
