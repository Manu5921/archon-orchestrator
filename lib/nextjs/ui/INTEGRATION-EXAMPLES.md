# Integration Examples - Full-Stack

**Version:** V7.0 Phase 2
**Purpose:** Real-world examples integrating UI components with auth, payments, and business logic
**Status:** ✅ Production Ready

---

## 📚 Table of Contents

1. [Auth Flow](#auth-flow) - Sign-in, sign-up, password reset
2. [Pricing + Checkout](#pricing--checkout) - Pricing page → Stripe checkout
3. [Dashboard with Subscription](#dashboard-with-subscription) - Protected route + subscription display
4. [Marketing Landing Page](#marketing-landing-page) - Hero + Features + CTA
5. [Form with Validation](#form-with-validation) - Custom form with react-hook-form

---

## 1. Auth Flow

### Complete Sign-In Flow

**File:** `app/signin/page.tsx`

```typescript
import { SignInForm } from "@/lib/ui/components/forms/SignInForm";
import { signIn } from "@/lib/auth/supabase/server";
import { redirect } from "next/navigation";

export default function SignInPage() {
  async function handleSignIn(values: { email: string; password: string }) {
    "use server";

    const { error } = await signIn({
      email: values.email,
      password: values.password,
    });

    if (error) {
      return { error: error.message };
    }

    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <SignInForm onSubmit={handleSignIn} redirectTo="/dashboard" />

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/signup" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
```

---

### Complete Sign-Up Flow

**File:** `app/signup/page.tsx`

```typescript
import { SignUpForm } from "@/lib/ui/components/forms/SignUpForm";
import { signUp } from "@/lib/auth/supabase/server";
import { redirect } from "next/navigation";

export default function SignUpPage() {
  async function handleSignUp(values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) {
    "use server";

    // Validation handled by SignUpForm component
    const { error } = await signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      return { error: error.message };
    }

    redirect("/verify-email");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-muted-foreground">
            Get started with your free account
          </p>
        </div>

        <SignUpForm onSubmit={handleSignUp} redirectTo="/verify-email" />

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/signin" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
```

---

### Password Reset Flow

**File:** `app/reset-password/page.tsx`

```typescript
import { ResetPasswordForm } from "@/lib/ui/components/forms/ResetPasswordForm";
import { resetPassword } from "@/lib/auth/supabase/server";

export default function ResetPasswordPage() {
  async function handleResetPassword(values: { email: string }) {
    "use server";

    const { error } = await resetPassword(values.email);

    if (error) {
      return { error: error.message };
    }

    return {
      success: "Check your email for a password reset link",
    };
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email to receive a reset link
          </p>
        </div>

        <ResetPasswordForm onSubmit={handleResetPassword} />

        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <a href="/signin" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
```

---

## 2. Pricing + Checkout

### Pricing Page with Checkout

**File:** `app/pricing/page.tsx`

```typescript
import { PricingTable } from "@/lib/ui/components/marketing/PricingTable";
import { CheckoutButton } from "@/lib/ui/components/marketing/CheckoutButton";
import { Hero } from "@/lib/ui/components/marketing/Hero";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/lib/ui/components/ui/card";
import { Button } from "@/lib/ui/components/ui/button";

const pricingPlans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small teams",
    price: { month: 9, year: 90 },
    priceId: {
      month: "price_starter_monthly",
      year: "price_starter_yearly",
    },
    features: [
      "10 projects",
      "Basic support",
      "5GB storage",
      "Community access",
    ],
  },
  {
    name: "Pro",
    description: "For growing businesses and professionals",
    price: { month: 29, year: 290 },
    priceId: {
      month: "price_pro_monthly",
      year: "price_pro_yearly",
    },
    features: [
      "Unlimited projects",
      "Priority support",
      "50GB storage",
      "Advanced analytics",
      "Team collaboration",
    ],
    highlighted: true, // Highlight as recommended
  },
  {
    name: "Enterprise",
    description: "Custom solutions for large organizations",
    price: { month: 99, year: 990 },
    priceId: {
      month: "price_enterprise_monthly",
      year: "price_enterprise_yearly",
    },
    features: [
      "Everything in Pro",
      "Dedicated support",
      "Unlimited storage",
      "Custom integrations",
      "SLA guarantee",
      "Advanced security",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <Hero
        headline="Simple, Transparent Pricing"
        subheadline="Choose the plan that's right for you. All plans include a 14-day free trial."
        variant="minimal"
      />

      {/* Pricing Table */}
      <div className="container mx-auto px-4 py-16">
        <PricingTable
          plans={pricingPlans}
          interval="month"
          onSelectPlan={(priceId) => {
            // Handled by CheckoutButton in PricingTable
            console.log("Selected price:", priceId);
          }}
        />
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Can I change plans later?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade at any time. Changes take
                effect at the start of your next billing cycle.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, Amex) via
                Stripe secure checkout.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

### Checkout Page (Stripe Integration)

**File:** `app/checkout/[priceId]/page.tsx`

```typescript
import { CheckoutButton } from "@/lib/ui/components/marketing/CheckoutButton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/lib/ui/components/ui/card";
import { Button } from "@/lib/ui/components/ui/button";
import { getSession } from "@/lib/auth/supabase/server";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  params,
}: {
  params: { priceId: string };
}) {
  const { session } = await getSession();

  if (!session) {
    redirect("/signin?redirect=/checkout/" + params.priceId);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            You'll be redirected to Stripe secure checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                <strong>What happens next:</strong>
              </p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Secure payment via Stripe</li>
                <li>14-day free trial (no charge today)</li>
                <li>Cancel anytime</li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/pricing">Back to Pricing</a>
          </Button>
          <CheckoutButton priceId={params.priceId} variant="default">
            Continue to Checkout
          </CheckoutButton>
        </CardFooter>
      </Card>
    </div>
  );
}
```

---

## 3. Dashboard with Subscription

### Protected Dashboard with Subscription Display

**File:** `app/dashboard/page.tsx`

```typescript
import { getSession } from "@/lib/auth/supabase/server";
import { getUserSubscription } from "@/lib/payments/stripe/subscription";
import { SubscriptionStatus } from "@/lib/ui/components/marketing/SubscriptionStatus";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/lib/ui/components/ui/card";
import { Button } from "@/lib/ui/components/ui/button";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { session } = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const subscription = await getUserSubscription(session.user.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back, {session.user.email}
          </p>
        </div>

        {/* Subscription Status */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Status</CardTitle>
              <CardDescription>
                Manage your subscription and billing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <SubscriptionStatus
                  subscription={subscription}
                  showActions={true}
                />
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    You don't have an active subscription yet.
                  </p>
                  <Button asChild>
                    <a href="/pricing">View Pricing Plans</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">12</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">2.4 GB</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">5</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
```

---

## 4. Marketing Landing Page

### Complete Landing Page (Hero + Features + CTA)

**File:** `app/page.tsx`

```typescript
import { Hero } from "@/lib/ui/components/marketing/Hero";
import { Features } from "@/lib/ui/components/marketing/Features";
import { CTA } from "@/lib/ui/components/marketing/CTA";
import { RocketIcon, ShieldIcon, ZapIcon, UsersIcon, BarChartIcon, LockIcon } from "lucide-react";

const features = [
  {
    name: "Lightning Fast",
    description: "Built for speed and performance from the ground up",
    icon: <ZapIcon className="size-6" />,
  },
  {
    name: "Secure by Default",
    description: "Enterprise-grade security with built-in authentication",
    icon: <ShieldIcon className="size-6" />,
  },
  {
    name: "Quick Setup",
    description: "Get started in minutes, not hours or days",
    icon: <RocketIcon className="size-6" />,
  },
  {
    name: "Team Collaboration",
    description: "Work together seamlessly with your team",
    icon: <UsersIcon className="size-6" />,
  },
  {
    name: "Advanced Analytics",
    description: "Track performance with detailed analytics",
    icon: <BarChartIcon className="size-6" />,
  },
  {
    name: "Data Privacy",
    description: "Your data is always private and secure",
    icon: <LockIcon className="size-6" />,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <Hero
        headline="Build Your SaaS Product in Days, Not Months"
        subheadline="Production-ready components with built-in auth, payments, and everything you need to launch fast"
        primaryCta={{ label: "Get Started Free", href: "/signup" }}
        secondaryCta={{ label: "View Demo", href: "/demo" }}
        variant="gradient"
      />

      {/* Features */}
      <Features
        headline="Everything You Need to Succeed"
        subheadline="All-in-one platform with powerful features designed for modern SaaS products"
        features={features}
        columns={3}
      />

      {/* CTA */}
      <CTA
        headline="Ready to Get Started?"
        description="Join thousands of developers building successful SaaS products"
        button={{ label: "Start Your Free Trial", href: "/signup" }}
        variant="gradient"
      />
    </div>
  );
}
```

---

## 5. Form with Validation

### Custom Form with react-hook-form

**File:** `app/contact/page.tsx`

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/lib/ui/components/ui/form";
import { Input } from "@/lib/ui/components/ui/input";
import { Textarea } from "@/lib/ui/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/lib/ui/components/ui/select";
import { Button } from "@/lib/ui/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/lib/ui/components/ui/card";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.enum(["general", "support", "sales", "billing"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "general",
      message: "",
    },
  });

  async function onSubmit(values: ContactFormValues) {
    console.log("Form submitted:", values);

    // Here you would send to API
    // const response = await fetch("/api/contact", {
    //   method: "POST",
    //   body: JSON.stringify(values),
    // });

    alert("Thank you for your message! We'll get back to you soon.");
    form.reset();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we'll get back to you as soon as possible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="sales">Sales Question</SelectItem>
                        <SelectItem value="billing">Billing Issue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide as much detail as possible
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔧 Common Patterns

### Server Action Pattern (Auth/Payments)

```typescript
async function handleServerAction(values: FormValues) {
  "use server"; // Next.js Server Action

  // 1. Validate session if needed
  const { session } = await getSession();
  if (!session) {
    return { error: "Unauthorized" };
  }

  // 2. Call lib/ module (auth, payments, email)
  const { error, data } = await someLibFunction(values);

  // 3. Return error OR redirect
  if (error) {
    return { error: error.message };
  }

  redirect("/success");
}
```

### Protected Route Pattern

```typescript
export default async function ProtectedPage() {
  const { session } = await getSession();

  if (!session) {
    redirect("/signin");
  }

  // Page content (user is authenticated)
  return <div>Protected content</div>;
}
```

### Client Form Pattern

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({ /* validation */ });

export default function ClientFormPage() {
  const form = useForm({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values) {
    // Call API or Server Action
  }

  return <Form {...form}>...</Form>;
}
```

---

## 📝 Notes

**Design Decoupling:**
- All examples use CSS variables (no hardcoded colors)
- Change `design-tokens.json` → UI updates automatically

**Integration:**
- Auth forms → `lib/auth/supabase`
- Payment components → `lib/payments/stripe`
- Email templates → `lib/email/resend`

**Testing:**
- All components have unit tests (see `tests/unit/`)
- Integration tests documented in `INTEGRATION-TEST.md`

---

**Version:** V7.0 Phase 2
**Status:** ✅ Production Ready

*Full-stack integration examples for auth, payments, and marketing* 🚀
