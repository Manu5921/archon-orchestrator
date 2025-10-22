import * as React from "react";
import { cn } from "@/lib/nextjs/ui/lib/utils";

export interface CTAProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * CTA headline
   */
  headline: string;

  /**
   * CTA description (optional)
   */
  description?: string;

  /**
   * Primary button configuration
   */
  button: {
    label: string;
    href: string;
  };

  /**
   * Background variant
   * @default "default"
   */
  variant?: "default" | "gradient" | "bordered";
}

/**
 * CTA - Call-to-action section component
 *
 * Generic marketing template customizable via design-tokens.json.
 * All colors use CSS variables for 15-min rebrand compatibility.
 *
 * @example
 * ```tsx
 * <CTA
 *   headline="Ready to get started?"
 *   description="Start building your SaaS today"
 *   button={{ label: "Sign Up Now", href: "/signup" }}
 *   variant="gradient"
 * />
 * ```
 */
export const CTA = React.forwardRef<HTMLDivElement, CTAProps>(
  (
    {
      headline,
      description,
      button,
      variant = "default",
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn("relative isolate overflow-hidden", className)}
        {...props}
      >
        <div
          className={cn(
            "px-6 py-24 sm:px-6 sm:py-32 lg:px-8",
            // Default: Subtle background
            variant === "default" && "bg-muted/50",
            // Gradient: Primary gradient
            variant === "gradient" &&
              "bg-gradient-to-r from-primary-500 to-accent-500",
            // Bordered: Border + background
            variant === "bordered" &&
              "border-2 border-border bg-background shadow-md"
          )}
        >
          <div className="mx-auto max-w-2xl text-center">
            {/* Headline */}
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight sm:text-4xl",
                // Text color adapts to background
                variant === "gradient"
                  ? "text-white"
                  : "text-foreground"
              )}
            >
              {headline}
            </h2>

            {/* Description */}
            {description && (
              <p
                className={cn(
                  "mx-auto mt-6 max-w-xl text-lg leading-8",
                  variant === "gradient"
                    ? "text-primary-100"
                    : "text-muted-foreground"
                )}
              >
                {description}
              </p>
            )}

            {/* Button */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href={button.href}
                className={cn(
                  "inline-flex items-center justify-center",
                  "rounded-md px-6 py-3 text-base font-semibold",
                  "shadow-sm transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  // Button style adapts to background
                  variant === "gradient"
                    ? "bg-white text-primary-600 hover:bg-primary-50 focus-visible:outline-white"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary"
                )}
              >
                {button.label}
              </a>
            </div>
          </div>
        </div>

        {/* Decorative background blur (gradient variant only) */}
        {variant === "gradient" && (
          <>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#gradient-cta)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="gradient-cta">
                  <stop stopColor="currentColor" className="text-primary-400" />
                  <stop offset={1} stopColor="currentColor" className="text-accent-400" />
                </radialGradient>
              </defs>
            </svg>
          </>
        )}
      </div>
    );
  }
);

CTA.displayName = "CTA";
