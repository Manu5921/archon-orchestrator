# 📦 Archon Library - Astro Architecture

**Version:** 1.0.0 (Phase 3 - Landing Pages)
**Date:** 2025-11-01
**Astro Version:** 5.15+
**Status:** 🚧 Planning Complete - Ready for Development

---

## 🎯 PURPOSE

**Astro Library** = Reusable landing page components optimized for **performance** and **SEO**.

### Problem Solved

**Before Astro Library:**
- Build landing page from scratch: 3-4h
- Configure SEO manually: 30-45 min
- Optimize performance: 1-2h
- Set up email capture: 30 min
- **Total: 5-7h per landing page**

**After Astro Library:**
```bash
/use-modules astro/ui astro/integrations/resend
# → 15 min setup
# → 1h30 customization (content + brand)
# → Total: 1h45 (-75% time)
```

---

## 🏗️ ARCHITECTURE

### Structure Complète

```
lib/astro/
├── ui/                          # ⭐ PHASE 3.1 (Core UI - 3h)
│   ├── components/
│   │   ├── layout/              # Layout components
│   │   │   ├── Layout.astro     # Base layout wrapper
│   │   │   ├── Header.astro     # Navigation header
│   │   │   ├── Footer.astro     # Site footer
│   │   │   └── Container.astro  # Content container
│   │   │
│   │   ├── marketing/           # Landing page sections
│   │   │   ├── Hero.astro           # Hero with CTA
│   │   │   ├── HeroVideo.astro      # Hero with video background
│   │   │   ├── Features.astro       # Features grid (3-col)
│   │   │   ├── FeaturesList.astro   # Features list (vertical)
│   │   │   ├── Pricing.astro        # Pricing table (3 tiers)
│   │   │   ├── PricingSimple.astro  # Simple pricing (1-2 plans)
│   │   │   ├── Testimonials.astro   # Social proof quotes
│   │   │   ├── TestimonialsGrid.astro # Grid layout testimonials
│   │   │   ├── CTA.astro            # Call-to-action section
│   │   │   ├── CTAInline.astro      # Inline CTA (no section)
│   │   │   ├── FAQ.astro            # FAQ accordion
│   │   │   ├── Stats.astro          # Statistics showcase
│   │   │   ├── LogoCloud.astro      # Partner/customer logos
│   │   │   └── Newsletter.astro     # Email capture form
│   │   │
│   │   ├── forms/               # Interactive forms (React islands)
│   │   │   ├── ContactForm.react.tsx     # Full contact form
│   │   │   ├── NewsletterForm.react.tsx  # Email capture
│   │   │   ├── WaitlistForm.react.tsx    # Waitlist signup
│   │   │   └── LeadForm.react.tsx        # Lead generation
│   │   │
│   │   └── seo/                 # SEO & Analytics
│   │       ├── SEO.astro            # Meta tags + OpenGraph
│   │       ├── Schema.astro         # JSON-LD structured data
│   │       ├── Analytics.astro      # Plausible/GA4 setup
│   │       └── Favicons.astro       # Favicon meta tags
│   │
│   ├── styles/
│   │   ├── design-tokens.css    # CSS variables (Design Decoupling)
│   │   ├── global.css           # Global base styles
│   │   ├── utilities.css        # Utility classes
│   │   └── animations.css       # Animation presets
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro     # Minimal layout (SEO + styles)
│   │   ├── LandingLayout.astro  # Full landing (header + footer)
│   │   └── MinimalLayout.astro  # Minimal (no header/footer)
│   │
│   └── README.md
│
├── integrations/                # ⭐ PHASE 3.2 (Email & Analytics - 1h)
│   ├── resend/                  # Resend email integration
│   │   ├── send-email.ts        # Email sending utility
│   │   ├── templates/           # HTML email templates
│   │   │   ├── waitlist-confirmation.html
│   │   │   ├── newsletter-welcome.html
│   │   │   └── contact-notification.html
│   │   └── README.md
│   │
│   ├── analytics/               # Analytics integrations
│   │   ├── plausible.ts         # Plausible setup
│   │   ├── google-analytics.ts  # GA4 setup
│   │   └── README.md
│   │
│   └── forms/                   # Form backend services
│       ├── formspree.ts         # Formspree integration
│       └── README.md
│
├── templates/                   # ⭐ PHASE 3.3 (Templates - 1h)
│   ├── saas-landing/            # SaaS product landing
│   │   ├── index.astro          # Main landing page
│   │   ├── pricing.astro        # Pricing page
│   │   ├── about.astro          # About page
│   │   └── README.md
│   │
│   ├── waitlist/                # Pre-launch waitlist
│   │   ├── index.astro          # Single page waitlist
│   │   └── README.md
│   │
│   └── agency/                  # Agency/Portfolio
│       ├── index.astro          # Homepage
│       ├── services.astro       # Services page
│       ├── portfolio.astro      # Work showcase
│       └── README.md
│
├── scripts/                     # Build utilities
│   ├── generate-sitemap.ts      # Sitemap generator
│   └── optimize-images.ts       # Image optimization
│
└── README.md                    # Main documentation

```

---

## 📦 COMPOSANTS DÉTAILLÉS

### 1. Layout Components

#### Layout.astro

**Purpose:** Base wrapper for all pages (SEO + styles + scripts)

**Props:**
```typescript
interface LayoutProps {
  title: string;                    // Page title
  description: string;               // Meta description
  canonical?: string;                // Canonical URL
  ogImage?: string;                  // Open Graph image
  noindex?: boolean;                 // Hide from search engines
  schema?: 'WebSite' | 'Organization' | 'Product';
}
```

**Usage:**
```astro
---
import Layout from '@/lib/astro/ui/layouts/Layout.astro';
---

<Layout
  title="My Landing Page"
  description="Convert visitors into customers"
  canonical="https://mysite.com/landing"
  ogImage="/og-image.png"
>
  <slot />
</Layout>
```

**Generated HTML:**
- SEO meta tags (title, description, canonical)
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card tags
- Favicon links
- CSS imports (design-tokens.css, global.css)
- Analytics scripts (if configured)

---

#### Header.astro

**Purpose:** Navigation header with logo + links + CTA button

**Props:**
```typescript
interface HeaderProps {
  logo: {
    src: string;                    // Logo image path
    alt: string;                    // Logo alt text
    href?: string;                  // Logo link (default: '/')
  };
  links: Array<{
    label: string;                  // Link text
    href: string;                   // Link URL
    external?: boolean;             // Open in new tab
  }>;
  cta?: {
    label: string;                  // CTA button text
    href: string;                   // CTA button URL
    variant?: 'primary' | 'secondary';
  };
  transparent?: boolean;            // Transparent background
  sticky?: boolean;                 // Sticky on scroll
}
```

**Usage:**
```astro
<Header
  logo={{
    src: '/logo.svg',
    alt: 'Company Logo'
  }}
  links={[
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'About', href: '/about' }
  ]}
  cta={{
    label: 'Get Started',
    href: '/signup',
    variant: 'primary'
  }}
  sticky={true}
/>
```

---

#### Footer.astro

**Purpose:** Site footer with links + social + copyright

**Props:**
```typescript
interface FooterProps {
  logo?: {
    src: string;
    alt: string;
  };
  columns: Array<{
    title: string;                  // Column heading
    links: Array<{
      label: string;
      href: string;
      external?: boolean;
    }>;
  }>;
  social?: Array<{
    platform: 'twitter' | 'linkedin' | 'github' | 'youtube';
    url: string;
  }>;
  copyright?: string;               // Copyright text (auto-year if not provided)
}
```

**Usage:**
```astro
<Footer
  columns={[
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' }
      ]
    }
  ]}
  social={[
    { platform: 'twitter', url: 'https://twitter.com/company' },
    { platform: 'linkedin', url: 'https://linkedin.com/company/company' }
  ]}
  copyright="© 2025 Company Name. All rights reserved."
/>
```

---

### 2. Marketing Components

#### Hero.astro

**Purpose:** Hero section with headline + subheadline + CTA

**Props:**
```typescript
interface HeroProps {
  headline: string;                 // Main headline (H1)
  subheadline?: string;             // Supporting text
  cta: {
    primary: {
      label: string;
      href: string;
    };
    secondary?: {
      label: string;
      href: string;
    };
  };
  image?: {
    src: string;                    // Hero image
    alt: string;
    position?: 'right' | 'left' | 'background';
  };
  badge?: string;                   // Small badge text (e.g., "New")
  variant?: 'default' | 'centered' | 'split';
}
```

**Usage:**
```astro
<Hero
  headline="Build Landing Pages 10× Faster"
  subheadline="Pre-built Astro components optimized for conversions and SEO"
  cta={{
    primary: {
      label: 'Get Started Free',
      href: '/signup'
    },
    secondary: {
      label: 'View Demo',
      href: '/demo'
    }
  }}
  image={{
    src: '/hero-image.png',
    alt: 'Product screenshot',
    position: 'right'
  }}
  badge="New: Astro 5 Support"
  variant="split"
/>
```

**Output:**
- Responsive layout (mobile: stacked, desktop: split)
- Optimized image (Astro Image component)
- Accessible headings (semantic HTML)
- CTA buttons with hover states

---

#### Features.astro

**Purpose:** Features grid (3-column layout)

**Props:**
```typescript
interface FeaturesProps {
  title?: string;                   // Section title
  description?: string;             // Section description
  features: Array<{
    icon: string;                   // Icon name or SVG path
    title: string;                  // Feature title
    description: string;            // Feature description
  }>;
  columns?: 2 | 3 | 4;              // Grid columns (default: 3)
}
```

**Usage:**
```astro
<Features
  title="Why Choose Us"
  description="Everything you need to launch faster"
  features={[
    {
      icon: 'rocket',
      title: 'Lightning Fast',
      description: '0 KB JavaScript. Pure HTML performance.'
    },
    {
      icon: 'seo',
      title: 'SEO Optimized',
      description: 'Perfect Lighthouse scores out of the box.'
    },
    {
      icon: 'components',
      title: 'Reusable Components',
      description: 'Copy-paste ready. No configuration needed.'
    }
  ]}
  columns={3}
/>
```

**Output:**
- Responsive grid (mobile: 1-col, tablet: 2-col, desktop: 3-col)
- Icon support (SVG inline or icon font)
- Accessible structure (headings hierarchy)

---

#### Pricing.astro

**Purpose:** Pricing table with 3 tiers

**Props:**
```typescript
interface PricingProps {
  title?: string;                   // Section title
  description?: string;             // Section description
  plans: Array<{
    name: string;                   // Plan name (e.g., "Pro")
    price: {
      amount: number;               // Price amount
      currency?: string;            // Currency symbol (default: '$')
      interval?: 'month' | 'year';  // Billing interval
    };
    features: string[];             // Feature list
    cta: {
      label: string;
      href: string;
      variant?: 'primary' | 'secondary';
    };
    badge?: string;                 // Badge text (e.g., "Popular")
    highlighted?: boolean;          // Highlight this plan
  }>;
  interval?: 'month' | 'year';      // Default interval
  toggleInterval?: boolean;         // Show monthly/yearly toggle
}
```

**Usage:**
```astro
<Pricing
  title="Simple, Transparent Pricing"
  description="Choose the plan that fits your needs"
  plans={[
    {
      name: 'Starter',
      price: { amount: 0, interval: 'month' },
      features: [
        '10 landing pages',
        'Basic analytics',
        'Email support'
      ],
      cta: {
        label: 'Start Free',
        href: '/signup',
        variant: 'secondary'
      }
    },
    {
      name: 'Pro',
      price: { amount: 29, interval: 'month' },
      features: [
        'Unlimited landing pages',
        'Advanced analytics',
        'Priority support',
        'Custom domain'
      ],
      cta: {
        label: 'Get Started',
        href: '/signup?plan=pro',
        variant: 'primary'
      },
      badge: 'Popular',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: { amount: 99, interval: 'month' },
      features: [
        'Everything in Pro',
        'White-label',
        'Dedicated support',
        'SLA guarantee'
      ],
      cta: {
        label: 'Contact Sales',
        href: '/contact',
        variant: 'secondary'
      }
    }
  ]}
  toggleInterval={true}
/>
```

**Output:**
- Responsive cards (mobile: stacked, desktop: 3-col)
- Highlighted plan (visual emphasis)
- Optional monthly/yearly toggle (vanilla JS)
- Accessible pricing table markup

---

#### Testimonials.astro

**Purpose:** Social proof quotes with avatars

**Props:**
```typescript
interface TestimonialsProps {
  title?: string;                   // Section title
  description?: string;             // Section description
  testimonials: Array<{
    quote: string;                  // Testimonial text
    author: {
      name: string;                 // Author name
      title?: string;               // Author title/role
      company?: string;             // Author company
      avatar?: string;              // Avatar image URL
    };
    rating?: 1 | 2 | 3 | 4 | 5;     // Star rating (optional)
  }>;
  layout?: 'grid' | 'carousel' | 'single';
}
```

**Usage:**
```astro
<Testimonials
  title="Loved by Developers"
  description="See what our users say"
  testimonials={[
    {
      quote: "This library saved me 10+ hours on my last project. Incredible ROI!",
      author: {
        name: 'John Doe',
        title: 'Founder',
        company: 'Startup Inc',
        avatar: '/avatars/john.jpg'
      },
      rating: 5
    },
    {
      quote: "Perfect for rapid prototyping. Clean code, great performance.",
      author: {
        name: 'Jane Smith',
        title: 'Senior Developer',
        company: 'Tech Corp',
        avatar: '/avatars/jane.jpg'
      },
      rating: 5
    }
  ]}
  layout="grid"
/>
```

**Output:**
- Responsive grid/carousel
- Star ratings (if provided)
- Avatar images optimized (Astro Image)
- Accessible quote markup

---

#### CTA.astro

**Purpose:** Call-to-action section (conversion-focused)

**Props:**
```typescript
interface CTAProps {
  headline: string;                 // CTA headline
  subheadline?: string;             // Supporting text
  cta: {
    primary: {
      label: string;
      href: string;
    };
    secondary?: {
      label: string;
      href: string;
    };
  };
  variant?: 'default' | 'gradient' | 'image';
  backgroundImage?: string;         // Background image (if variant='image')
}
```

**Usage:**
```astro
<CTA
  headline="Ready to Build Faster?"
  subheadline="Join 1,000+ developers using Archon Library"
  cta={{
    primary: {
      label: 'Get Started Free',
      href: '/signup'
    },
    secondary: {
      label: 'View Docs',
      href: '/docs'
    }
  }}
  variant="gradient"
/>
```

**Output:**
- Full-width section
- Gradient/image backgrounds
- Centered layout
- High-contrast CTAs

---

#### FAQ.astro

**Purpose:** Frequently Asked Questions accordion

**Props:**
```typescript
interface FAQProps {
  title?: string;                   // Section title
  description?: string;             // Section description
  faqs: Array<{
    question: string;               // Question text
    answer: string;                 // Answer text (supports HTML)
  }>;
  layout?: 'single' | 'two-column';
}
```

**Usage:**
```astro
<FAQ
  title="Frequently Asked Questions"
  faqs={[
    {
      question: 'Is this free to use?',
      answer: 'Yes! All components are MIT licensed and free to use.'
    },
    {
      question: 'Can I customize the design?',
      answer: 'Absolutely. All styles use CSS variables for easy theming.'
    },
    {
      question: 'Do you support TypeScript?',
      answer: 'Yes, all components are fully typed with TypeScript.'
    }
  ]}
  layout="single"
/>
```

**Output:**
- Accordion UI (vanilla JS, no React)
- Keyboard accessible (Space/Enter to toggle)
- ARIA attributes (expandable)
- Smooth animations

---

### 3. Form Components (React Islands)

#### ContactForm.react.tsx

**Purpose:** Full contact form with validation

**Props:**
```typescript
interface ContactFormProps {
  endpoint?: string;                // API endpoint (default: /api/contact)
  fields?: Array<'name' | 'email' | 'company' | 'message'>;
  submitLabel?: string;             // Submit button text
  onSuccess?: (data: any) => void;  // Success callback
  onError?: (error: Error) => void; // Error callback
}
```

**Usage:**
```astro
---
import ContactForm from '@/lib/astro/ui/components/forms/ContactForm.react';
---

<ContactForm
  client:load
  endpoint="/api/contact"
  fields={['name', 'email', 'company', 'message']}
  submitLabel="Send Message"
/>
```

**Features:**
- Client-side validation (Zod schemas)
- Loading states
- Error handling
- Success messages
- Accessible form markup

---

#### NewsletterForm.react.tsx

**Purpose:** Simple email capture form

**Props:**
```typescript
interface NewsletterFormProps {
  endpoint?: string;                // API endpoint
  placeholder?: string;             // Input placeholder
  submitLabel?: string;             // Button text
  successMessage?: string;          // Success message
  inline?: boolean;                 // Inline layout (email + button horizontal)
}
```

**Usage:**
```astro
<NewsletterForm
  client:visible
  endpoint="/api/newsletter"
  placeholder="Enter your email"
  submitLabel="Subscribe"
  successMessage="Thanks! Check your email."
  inline={true}
/>
```

**Features:**
- Email validation
- Loading spinner
- Success/error states
- GDPR-friendly (no auto-submit)

---

### 4. SEO Components

#### SEO.astro

**Purpose:** Complete SEO meta tags + Open Graph

**Props:**
```typescript
interface SEOProps {
  title: string;                    // Page title
  description: string;              // Meta description
  canonical?: string;               // Canonical URL
  ogImage?: string;                 // Open Graph image
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;                // Prevent indexing
}
```

**Usage:**
```astro
<SEO
  title="Landing Page Builder | Archon Library"
  description="Build high-converting landing pages in minutes with Astro components"
  canonical="https://archon.dev/landing"
  ogImage="https://archon.dev/og-image.png"
  ogType="website"
  twitterCard="summary_large_image"
/>
```

**Generated Tags:**
```html
<title>Landing Page Builder | Archon Library</title>
<meta name="description" content="Build high-converting..." />
<link rel="canonical" href="https://archon.dev/landing" />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:title" content="Landing Page Builder | Archon Library" />
<meta property="og:description" content="Build high-converting..." />
<meta property="og:image" content="https://archon.dev/og-image.png" />
<meta property="og:url" content="https://archon.dev/landing" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Landing Page Builder | Archon Library" />
<meta name="twitter:description" content="Build high-converting..." />
<meta name="twitter:image" content="https://archon.dev/og-image.png" />
```

---

#### Schema.astro

**Purpose:** JSON-LD structured data for search engines

**Props:**
```typescript
interface SchemaProps {
  type: 'WebSite' | 'Organization' | 'Product' | 'Article';
  data: any;                        // Schema-specific data
}
```

**Usage (WebSite):**
```astro
<Schema
  type="WebSite"
  data={{
    name: 'Archon Library',
    url: 'https://archon.dev',
    description: 'Reusable Astro components for landing pages',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://archon.dev/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }}
/>
```

**Usage (Product):**
```astro
<Schema
  type="Product"
  data={{
    name: 'Pro Plan',
    description: 'Unlimited landing pages with advanced features',
    image: 'https://archon.dev/product.png',
    offers: {
      '@type': 'Offer',
      price: '29.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    }
  }}
/>
```

---

#### Analytics.astro

**Purpose:** Analytics tracking (Plausible, GA4)

**Props:**
```typescript
interface AnalyticsProps {
  provider: 'plausible' | 'google-analytics' | 'both';
  plausibleDomain?: string;         // Required if provider includes 'plausible'
  gaTrackingId?: string;            // Required if provider includes 'google-analytics'
}
```

**Usage:**
```astro
<Analytics
  provider="plausible"
  plausibleDomain="archon.dev"
/>
```

**Generated Script (Plausible):**
```html
<script defer data-domain="archon.dev" src="https://plausible.io/js/script.js"></script>
```

---

## 🎨 DESIGN SYSTEM

### design-tokens.css

**Purpose:** CSS variables for Design Decoupling (same philosophy as Next.js library)

**Structure:**
```css
/* lib/astro/ui/styles/design-tokens.css */

:root {
  /* Colors - Primary */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;   /* Main brand color */
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Colors - Neutral */
  --color-neutral-50: #f9fafb;
  --color-neutral-100: #f3f4f6;
  --color-neutral-200: #e5e7eb;
  --color-neutral-300: #d1d5db;
  --color-neutral-400: #9ca3af;
  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5563;
  --color-neutral-700: #374151;
  --color-neutral-800: #1f2937;
  --color-neutral-900: #111827;

  /* Typography */
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */

  /* Spacing */
  --space-1: 0.25rem;      /* 4px */
  --space-2: 0.5rem;       /* 8px */
  --space-3: 0.75rem;      /* 12px */
  --space-4: 1rem;         /* 16px */
  --space-6: 1.5rem;       /* 24px */
  --space-8: 2rem;         /* 32px */
  --space-12: 3rem;        /* 48px */
  --space-16: 4rem;        /* 64px */
  --space-24: 6rem;        /* 96px */

  /* Border Radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-xl: 1rem;       /* 16px */
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* Container */
  --container-max-width: 1280px;
  --container-padding: var(--space-4);
}

/* Dark Mode Override (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-neutral-50: #111827;
    --color-neutral-100: #1f2937;
    --color-neutral-900: #f9fafb;
    /* ... invert other colors */
  }
}
```

**Usage in Components:**
```astro
<!-- Hero.astro -->
<section class="hero">
  <h1 class="headline">Build Faster</h1>
  <p class="subheadline">With pre-built components</p>
</section>

<style>
  .hero {
    padding: var(--space-24) var(--container-padding);
    max-width: var(--container-max-width);
    margin: 0 auto;
  }

  .headline {
    font-family: var(--font-heading);
    font-size: var(--text-5xl);
    color: var(--color-neutral-900);
    margin-bottom: var(--space-4);
  }

  .subheadline {
    font-family: var(--font-body);
    font-size: var(--text-xl);
    color: var(--color-neutral-600);
  }
</style>
```

**15-min Rebrand Example:**
```css
/* custom-tokens.css (client's brand) */
:root {
  --color-primary-500: #8B5CF6;  /* Change blue → violet */
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Roboto', sans-serif;
}
```

**Merge:**
```bash
/import-design custom-tokens.css
# → UI transforms automatically (0 code changes needed)
```

---

## 📚 TEMPLATES

### Template 1: SaaS Landing Page

**Structure:**
```
lib/astro/templates/saas-landing/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── pricing.astro        # Pricing page
│   │   ├── about.astro          # About page
│   │   └── contact.astro        # Contact page
│   │
│   ├── components/              # Custom components (use lib/)
│   │   └── DemoVideo.astro
│   │
│   └── content/                 # Content collections
│       └── features.json        # Features data
│
├── public/
│   ├── logo.svg
│   └── og-image.png
│
├── astro.config.mjs
├── package.json
└── README.md
```

**index.astro Example:**
```astro
---
import Layout from '@/lib/astro/ui/layouts/LandingLayout.astro';
import Hero from '@/lib/astro/ui/components/marketing/Hero.astro';
import Features from '@/lib/astro/ui/components/marketing/Features.astro';
import Pricing from '@/lib/astro/ui/components/marketing/Pricing.astro';
import Testimonials from '@/lib/astro/ui/components/marketing/Testimonials.astro';
import CTA from '@/lib/astro/ui/components/marketing/CTA.astro';

const features = [
  {
    icon: 'rocket',
    title: 'Lightning Fast',
    description: 'Built with Astro for optimal performance'
  },
  // ... more features
];

const plans = [
  {
    name: 'Starter',
    price: { amount: 0, interval: 'month' },
    features: ['10 projects', 'Basic support'],
    cta: { label: 'Start Free', href: '/signup' }
  },
  // ... more plans
];
---

<Layout
  title="SaaS Product - Build Faster"
  description="The best SaaS tool for productivity"
>
  <Hero
    headline="Build Your SaaS 10× Faster"
    subheadline="Pre-built components, authentication, and payments included"
    cta={{
      primary: { label: 'Get Started', href: '/signup' },
      secondary: { label: 'View Demo', href: '/demo' }
    }}
  />

  <Features
    title="Everything You Need"
    features={features}
  />

  <Pricing
    title="Simple Pricing"
    plans={plans}
  />

  <Testimonials
    testimonials={[
      {
        quote: "Saved me 100+ hours of development time!",
        author: { name: 'John Doe', title: 'Founder, Startup Inc' }
      }
    ]}
  />

  <CTA
    headline="Ready to Launch?"
    cta={{
      primary: { label: 'Start Building', href: '/signup' }
    }}
  />
</Layout>
```

**Setup Time:** 15-20 min
- Copy template: 5 min
- Customize content: 10 min
- Deploy: 5 min

---

### Template 2: Waitlist Page

**Structure:**
```
lib/astro/templates/waitlist/
├── src/
│   ├── pages/
│   │   └── index.astro          # Single page
│   │
│   └── components/
│       └── CountdownTimer.react.tsx
│
├── public/
│   └── preview.png
│
└── README.md
```

**index.astro Example:**
```astro
---
import Layout from '@/lib/astro/ui/layouts/MinimalLayout.astro';
import WaitlistForm from '@/lib/astro/ui/components/forms/WaitlistForm.react';
import Stats from '@/lib/astro/ui/components/marketing/Stats.astro';
---

<Layout
  title="Join the Waitlist - Product Launch"
  description="Be the first to know when we launch"
>
  <section class="waitlist-hero">
    <h1>Something Amazing is Coming</h1>
    <p>Join 1,247 early adopters waiting for launch</p>

    <WaitlistForm
      client:load
      endpoint="/api/waitlist"
    />

    <Stats
      stats={[
        { label: 'People Waiting', value: '1,247' },
        { label: 'Days Until Launch', value: '42' },
        { label: 'Countries', value: '67' }
      ]}
    />
  </section>
</Layout>

<style>
  .waitlist-hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: var(--space-8);
    text-align: center;
  }

  h1 {
    font-size: var(--text-6xl);
    margin-bottom: var(--space-4);
  }
</style>
```

**Setup Time:** 10 min
- Copy template: 3 min
- Customize text: 5 min
- Deploy: 2 min

---

### Template 3: Agency Portfolio

**Structure:**
```
lib/astro/templates/agency/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── services.astro       # Services
│   │   ├── portfolio.astro      # Work showcase
│   │   └── contact.astro        # Contact
│   │
│   └── content/
│       ├── projects/            # Portfolio projects
│       │   ├── project-1.md
│       │   └── project-2.md
│       └── services.json
│
└── README.md
```

**Setup Time:** 20-25 min

---

## 🔗 INTEGRATIONS

### Resend Email

**File:** `lib/astro/integrations/resend/send-email.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

interface SendEmailOptions {
  to: string;
  subject: string;
  html?: string;
  template?: 'waitlist' | 'newsletter' | 'contact';
  data?: Record<string, any>;
}

export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, html, template, data } = options;

  // Load template if specified
  let emailHtml = html;
  if (template) {
    emailHtml = await loadTemplate(template, data);
  }

  return resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
    to,
    subject,
    html: emailHtml,
  });
}

async function loadTemplate(template: string, data?: Record<string, any>) {
  // Load HTML template and replace variables
  const templatePath = `./templates/${template}-confirmation.html`;
  let html = await Astro.glob(templatePath);

  // Simple variable replacement
  if (data) {
    Object.keys(data).forEach(key => {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    });
  }

  return html;
}
```

**API Route Example:**
```typescript
// src/pages/api/waitlist.ts
import type { APIRoute } from 'astro';
import { sendEmail } from '@/lib/astro/integrations/resend/send-email';

export const POST: APIRoute = async ({ request }) => {
  const { email } = await request.json();

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(
      JSON.stringify({ error: 'Invalid email' }),
      { status: 400 }
    );
  }

  // Send confirmation email
  try {
    await sendEmail({
      to: email,
      subject: 'Welcome to the Waitlist!',
      template: 'waitlist',
      data: { email }
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500 }
    );
  }
};
```

---

## 🚀 WORKFLOW INTEGRATION

### Spec-Kit + Astro Library

**Phase 0: Analysis (5-10 min)**
```bash
/zen-roundtable "Brief: Landing page for SaaS product XYZ"
# → constitution.md + spec.md generated
```

**Phase 1: Planning (15-20 min)**
```bash
/speckit.constitution
/speckit.specify
# Specification détecte: framework=astro, type=landing-page

/speckit.design
# → design-tokens.css created (based on brand)

# ⭐ NEW: Library integration
/use-modules astro/ui astro/integrations/resend astro/templates/saas-landing
# Actions:
# → Copy lib/astro/ui/ → src/components/lib/
# → Copy lib/astro/integrations/resend/ → src/lib/resend/
# → Copy lib/astro/templates/saas-landing/ → project root
# → Install: pnpm add astro resend
# → Create .env.example (RESEND_API_KEY, SITE_URL)
# → Update CLAUDE.md (document modules used)
# → Total: 5-10 min ✅
```

**Phase 2: Customization Planning (10 min)**
```bash
/speckit.plan
# Plan focuses on:
# - Content customization (headlines, features, pricing)
# - Brand application (design-tokens.css merge)
# - API endpoints setup (waitlist, contact)
# - Analytics configuration

/speckit.tasks
# Tasks = delta only (NOT full build):
# - [ ] T001 [P0] Update Hero headline + CTA
# - [ ] T002 [P0] Customize Features section (6 features)
# - [ ] T003 [P1] Configure Pricing plans (3 tiers)
# - [ ] T004 [P1] Add Testimonials (5 quotes)
# - [ ] T005 [P2] Setup Resend API endpoint
# - [ ] T006 [P2] Configure Analytics (Plausible)
# - [ ] T007 [P3] Customize FAQ (10 questions)
# Total: ~20-30 tasks (vs 100+ from scratch)
```

**Phase 3: Implementation (1-1h30)**
```bash
/speckit.final
# Execution:
# - Frontend-specialist (Astro-adapted)
# - Implements customizations (content + brand)
# - Checkpoints every 10 tasks (P0 Build, P1 Lint)
# - Duration: 1-1h30 (vs 2h45-3h Next.js)
```

**Phase 4: Deploy (5 min)**
```bash
git push
# Vercel/Netlify auto-detect Astro
# Build: 5-10s
# Live: 30s ✅
```

**Total Time: 1h45-2h15** (vs 5-7h from scratch = **-70%**)

---

## 📊 PERFORMANCE TARGETS

### Lighthouse Scores (Target)

**Homepage:**
- Performance: **100/100** (0 KB JavaScript)
- Accessibility: **100/100** (semantic HTML + ARIA)
- Best Practices: **100/100** (HTTPS, no console errors)
- SEO: **100/100** (meta tags + structured data)

**With Interactive Forms:**
- Performance: **95-100/100** (<10 KB React island)
- Other scores: **100/100**

---

### Core Web Vitals (Target)

- **LCP (Largest Contentful Paint):** <1.0s
- **FID (First Input Delay):** <50ms
- **CLS (Cumulative Layout Shift):** <0.05

**vs Next.js Baseline:**
- LCP: 1.0s (Astro) vs 2.5s (Next.js) = **-60%**
- FID: 50ms (Astro) vs 200ms (Next.js) = **-75%**

---

## 📁 FILE ORGANIZATION

### Project Structure (After `/use-modules`)

```
my-landing-page/
├── src/
│   ├── pages/
│   │   └── index.astro          # Your custom page
│   │
│   ├── components/
│   │   └── lib/                 # ⭐ Library components (copied)
│   │       ├── layout/
│   │       ├── marketing/
│   │       ├── forms/
│   │       └── seo/
│   │
│   ├── lib/
│   │   └── resend/              # ⭐ Resend integration (copied)
│   │       └── send-email.ts
│   │
│   └── styles/
│       └── design-tokens.css    # ⭐ Design system (copied)
│
├── public/
│   ├── logo.svg
│   └── og-image.png
│
├── astro.config.mjs
├── package.json
├── .env.example                 # Generated by /use-modules
└── README.md
```

---

## 🔒 SECURITY

**All components follow V6.1.5 standards:**
- ✅ Environment variables (no hardcoded secrets)
- ✅ Input validation (forms use Zod schemas)
- ✅ XSS prevention (Astro auto-escapes)
- ✅ HTTPS enforcement (production config)
- ✅ CSP headers (recommended config)

**API Routes Security:**
```typescript
// src/pages/api/contact.ts
import { z } from 'zod';

const contactSchema = z.object({
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export const POST: APIRoute = async ({ request }) => {
  // Rate limiting (recommend Upstash)
  // ...

  // Validate input
  const body = await request.json();
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({ error: 'Invalid input' }),
      { status: 400 }
    );
  }

  // Process...
};
```

---

## 📚 DOCUMENTATION PLAN

**Files to Create:**

1. **lib/astro/README.md** (300 lines)
   - Quick start guide
   - Component showcase
   - Performance benchmarks

2. **lib/astro/INTEGRATION-GUIDE.md** (400 lines)
   - Setup instructions
   - Component usage examples
   - Troubleshooting

3. **lib/astro/ui/components/README.md** (200 lines)
   - All components list
   - Props reference
   - Code examples

4. **lib/astro/templates/README.md** (150 lines)
   - Template descriptions
   - Setup guides per template

**Total Documentation:** ~1,050 lines

---

## 🎯 DEVELOPMENT PHASES

### Phase 3.1: Core UI (3h)

**Components to Build:**
1. Layout (30 min)
   - Layout.astro
   - Header.astro
   - Footer.astro
   - Container.astro

2. Marketing (1h30)
   - Hero.astro
   - Features.astro
   - Pricing.astro
   - Testimonials.astro
   - CTA.astro
   - FAQ.astro
   - Stats.astro
   - LogoCloud.astro

3. Forms (30 min)
   - ContactForm.react.tsx
   - NewsletterForm.react.tsx
   - WaitlistForm.react.tsx

4. SEO (30 min)
   - SEO.astro
   - Schema.astro
   - Analytics.astro

**Total:** 3h

---

### Phase 3.2: Integrations (1h)

**To Build:**
1. Resend Integration (30 min)
   - send-email.ts
   - waitlist-confirmation.html
   - newsletter-welcome.html

2. Analytics (15 min)
   - Plausible setup
   - GA4 setup

3. Forms Backend (15 min)
   - API routes examples
   - Validation schemas

**Total:** 1h

---

### Phase 3.3: Templates (1h)

**To Build:**
1. SaaS Landing (30 min)
   - index.astro (full page)
   - pricing.astro

2. Waitlist (15 min)
   - index.astro (single page)

3. Agency (15 min)
   - index.astro (portfolio homepage)

**Total:** 1h

---

### Phase 3.4: Documentation (1h)

**To Write:**
1. Main README (15 min)
2. Integration Guide (25 min)
3. Component Reference (15 min)
4. Templates Guide (5 min)

**Total:** 1h

---

## 📊 ROI SUMMARY

### Time Savings (Per Landing Page)

| Phase | Manual | With Library | Savings |
|-------|--------|--------------|---------|
| Setup | 1h | 10 min | **-83%** |
| Layout | 1h | 5 min | **-92%** |
| Sections | 2h | 30 min | **-75%** |
| Forms | 1h | 15 min | **-75%** |
| SEO | 45 min | 5 min | **-89%** |
| **TOTAL** | **5h45** | **1h45** | **-70%** |

---

### Performance Gains (vs Next.js)

| Metric | Next.js | Astro | Improvement |
|--------|---------|-------|-------------|
| Bundle Size | 85-120 KB | 0-10 KB | **-95%** |
| LCP | 2.5s | 1.0s | **-60%** |
| Lighthouse | 70-85 | 95-100 | **+15-25 pts** |
| Build Time | 30-60s | 5-10s | **-80%** |

---

## ✅ NEXT STEPS

**Ready to develop? Plan approuvé.**

**Options:**

1. **Start Phase 3.1 NOW** (Build UI components - 3h)
2. **Review plan first** (Questions/adjustments)
3. **Create minimal POC** (1 component test - 30 min)

**Quelle option tu préfères ?** 🚀

---

**Version:** 1.0.0 Planning Complete
**Date:** 2025-11-01
**Status:** ✅ **Ready for Development**
**Estimated Total:** 6h (3h UI + 1h integrations + 1h templates + 1h docs)
**ROI:** -70% landing page development time

*Astro Library: Optimized for performance, built for speed* 🚀⚡
