import * as React from "react";
import { cn } from "@/lib/nextjs/ui/lib/utils";

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Hero headline text
   */
  headline: string;

  /**
   * Hero subheadline/description
   */
  subheadline: string;

  /**
   * Primary CTA button
   */
  primaryCta?: {
    label: string;
    href: string;
  };

  /**
   * Secondary CTA button (optional)
   */
  secondaryCta?: {
    label: string;
    href: string;
  };

  /**
   * Background variant
   * @default "default"
   */
  variant?: "default" | "gradient" | "minimal";
}

/**
 * Hero - Landing page hero section component
 *
 * Generic marketing template customizable via design-tokens.json.
 * All colors use CSS variables for 15-min rebrand compatibility.
 *
 * @example
 * ```tsx
 * <Hero
 *   headline="Build SaaS Products Faster"
 *   subheadline="Production-ready components with built-in auth and payments"
 *   primaryCta={{ label: "Get Started", href: "/signup" }}
 *   secondaryCta={{ label: "View Demo", href: "/demo" }}
 * />
 * ```
 */
export const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    {
      headline,
      subheadline,
      primaryCta,
      secondaryCta,
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden",
          // Default: Subtle background
          variant === "default" && "bg-background",
          // Gradient: Primary gradient background
          variant === "gradient" &&
            "bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950 dark:to-accent-950",
          // Minimal: No background
          variant === "minimal" && "bg-transparent",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            {/* Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {headline}
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
              {subheadline}
            </p>

            {/* CTAs */}
            {(primaryCta || secondaryCta) && (
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                {primaryCta && (
                  <a
                    href={primaryCta.href}
                    className={cn(
                      "inline-flex items-center justify-center",
                      "rounded-md px-6 py-3 text-base font-semibold",
                      "bg-primary text-primary-foreground",
                      "shadow-sm hover:bg-primary/90",
                      "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    )}
                  >
                    {primaryCta.label}
                  </a>
                )}

                {secondaryCta && (
                  <a
                    href={secondaryCta.href}
                    className={cn(
                      "inline-flex items-center justify-center",
                      "rounded-md px-6 py-3 text-base font-semibold",
                      "bg-secondary text-secondary-foreground",
                      "shadow-sm hover:bg-secondary/80",
                      "transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
                    )}
                  >
                    {secondaryCta.label}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Decorative background pattern (optional) */}
        {variant === "gradient" && (
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-accent-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        )}
      </section>
    );
  }
);

Hero.displayName = "Hero";
