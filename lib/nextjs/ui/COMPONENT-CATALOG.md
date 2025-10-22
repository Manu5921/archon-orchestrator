# Component Catalog - API Reference

**Version:** V7.0 Phase 2
**Total Components:** 21
**Status:** ✅ Complete

---

## 📦 Table of Contents

### shadcn/ui Foundational
- [Button](#button)
- [Input](#input)
- [Textarea](#textarea)
- [Label](#label)
- [Form](#form)
- [Select](#select)
- [Card](#card)
- [Modal](#modal)
- [Table](#table)
- [Dropdown Menu](#dropdown-menu)
- [Radio Group](#radio-group)
- [Avatar](#avatar)

### Auth Forms
- [SignInForm](#signinform)
- [SignUpForm](#signupform)
- [ResetPasswordForm](#resetpasswordform)

### Payment Components
- [PricingTable](#pricingtable)
- [CheckoutButton](#checkoutbutton)
- [SubscriptionStatus](#subscriptionstatus)

### Marketing Components
- [Hero](#hero)
- [Features](#features)
- [CTA](#cta)

---

## shadcn/ui Foundational

### Button

**Path:** `components/ui/button.tsx`

**Variants:**
- `default` - Primary button (bg-primary)
- `secondary` - Secondary button (bg-secondary)
- `outline` - Outlined button (border + bg-transparent)
- `destructive` - Destructive action (bg-destructive/red)
- `ghost` - No background, hover effect
- `link` - Text link style (underline on hover)

**Sizes:**
- `default` - h-9 px-4 py-2
- `sm` - h-8 px-3 (small)
- `lg` - h-10 px-6 (large)
- `icon` - size-9 (square, for icons)

**Example:**
```typescript
import { Button } from "@/lib/ui/components/ui/button";

<Button variant="default" size="default">Submit</Button>
<Button variant="secondary" size="lg">Cancel</Button>
<Button variant="outline" size="sm">Edit</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Skip</Button>
<Button variant="link">Learn More</Button>
```

---

### Input

**Path:** `components/ui/input.tsx`

**Props:**
- `type` - HTML input type (text, email, password, etc.)
- `placeholder` - Placeholder text
- `disabled` - Disabled state
- `aria-invalid` - Validation state (adds red border/ring)

**Example:**
```typescript
import { Input } from "@/lib/ui/components/ui/input";
import { Label } from "@/lib/ui/components/ui/label";

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input
    id="email"
    type="email"
    placeholder="you@example.com"
    aria-invalid={errors.email ? "true" : undefined}
  />
</div>
```

---

### Textarea

**Path:** `components/ui/textarea.tsx`

**Props:**
- `placeholder` - Placeholder text
- `disabled` - Disabled state
- `rows` - Number of visible rows (default: auto)

**Example:**
```typescript
import { Textarea } from "@/lib/ui/components/ui/textarea";

<Textarea
  placeholder="Enter your message..."
  rows={4}
/>
```

---

### Label

**Path:** `components/ui/label.tsx`

**Props:**
- `htmlFor` - Associates label with input ID (accessibility)

**Example:**
```typescript
import { Label } from "@/lib/ui/components/ui/label";
import { Input } from "@/lib/ui/components/ui/input";

<Label htmlFor="username">Username</Label>
<Input id="username" />
```

---

### Form

**Path:** `components/ui/form.tsx`

**Usage:** Wrapper for react-hook-form compatible forms.

**Components:**
- `Form` - Root form provider
- `FormField` - Field wrapper with validation
- `FormItem` - Item container
- `FormLabel` - Label (linked to field)
- `FormControl` - Control wrapper (input, select, etc.)
- `FormDescription` - Help text
- `FormMessage` - Validation error message

**Example:**
```typescript
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/lib/ui/components/ui/form";
import { Input } from "@/lib/ui/components/ui/input";

const form = useForm();

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} type="email" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

---

### Select

**Path:** `components/ui/select.tsx`

**Usage:** Radix UI dropdown select component.

**Components:**
- `Select` - Root
- `SelectTrigger` - Button that opens dropdown
- `SelectValue` - Displays selected value
- `SelectContent` - Dropdown container
- `SelectItem` - Individual option

**Example:**
```typescript
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/lib/ui/components/ui/select";

<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Select country" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="us">United States</SelectItem>
    <SelectItem value="ca">Canada</SelectItem>
    <SelectItem value="uk">United Kingdom</SelectItem>
  </SelectContent>
</Select>
```

---

### Card

**Path:** `components/ui/card.tsx`

**Components:**
- `Card` - Root container
- `CardHeader` - Header section
- `CardTitle` - Title (h3)
- `CardDescription` - Subtitle (muted text)
- `CardContent` - Main content
- `CardFooter` - Footer section

**Example:**
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/lib/ui/components/ui/card";
import { Button } from "@/lib/ui/components/ui/button";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card subtitle or description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### Modal

**Path:** `components/ui/modal.tsx`

**Usage:** Radix UI Dialog component (renamed to Modal for clarity).

**Components:**
- `Modal` - Root
- `ModalTrigger` - Button that opens modal
- `ModalContent` - Modal container
- `ModalHeader` - Header section
- `ModalTitle` - Title (h2)
- `ModalDescription` - Description
- `ModalFooter` - Footer section

**Example:**
```typescript
import { Modal, ModalTrigger, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalFooter } from "@/lib/ui/components/ui/modal";
import { Button } from "@/lib/ui/components/ui/button";

<Modal>
  <ModalTrigger asChild>
    <Button>Open Modal</Button>
  </ModalTrigger>
  <ModalContent>
    <ModalHeader>
      <ModalTitle>Confirm Action</ModalTitle>
      <ModalDescription>Are you sure you want to proceed?</ModalDescription>
    </ModalHeader>
    <ModalFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

---

### Table

**Path:** `components/ui/table.tsx`

**Components:**
- `Table` - Root table
- `TableHeader` - Header section (<thead>)
- `TableBody` - Body section (<tbody>)
- `TableFooter` - Footer section (<tfoot>)
- `TableRow` - Row (<tr>)
- `TableHead` - Header cell (<th>)
- `TableCell` - Body cell (<td>)
- `TableCaption` - Caption (below table)

**Example:**
```typescript
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/lib/ui/components/ui/table";

<Table>
  <TableCaption>A list of recent transactions.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>#001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Dropdown Menu

**Path:** `components/ui/dropdown-menu.tsx`

**Usage:** Radix UI dropdown menu.

**Components:**
- `DropdownMenu` - Root
- `DropdownMenuTrigger` - Button that opens menu
- `DropdownMenuContent` - Menu container
- `DropdownMenuItem` - Menu item
- `DropdownMenuSeparator` - Separator line
- `DropdownMenuLabel` - Section label

**Example:**
```typescript
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/lib/ui/components/ui/dropdown-menu";
import { Button } from "@/lib/ui/components/ui/button";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Sign Out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

### Radio Group

**Path:** `components/ui/radio-group.tsx`

**Usage:** Radix UI radio button group.

**Components:**
- `RadioGroup` - Root container
- `RadioGroupItem` - Individual radio button

**Example:**
```typescript
import { RadioGroup, RadioGroupItem } from "@/lib/ui/components/ui/radio-group";
import { Label } from "@/lib/ui/components/ui/label";

<RadioGroup defaultValue="option1">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
</RadioGroup>
```

---

### Avatar

**Path:** `components/ui/avatar.tsx`

**Usage:** Radix UI avatar with fallback.

**Components:**
- `Avatar` - Root container
- `AvatarImage` - Image element
- `AvatarFallback` - Fallback (initials or icon)

**Example:**
```typescript
import { Avatar, AvatarImage, AvatarFallback } from "@/lib/ui/components/ui/avatar";

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

---

## Auth Forms

### SignInForm

**Path:** `components/forms/SignInForm.tsx`

**Props:**
- `onSubmit: (values: { email: string; password: string }) => Promise<{ error?: string }>`
- `redirectTo?: string` - Redirect URL after sign-in

**Integration:** lib/auth/supabase/server.ts

**Example:**
```typescript
import { SignInForm } from "@/lib/ui/components/forms/SignInForm";
import { signIn } from "@/lib/auth/supabase/server";

async function handleSignIn(values: { email: string; password: string }) {
  "use server";
  const { error } = await signIn(values);
  if (error) return { error: error.message };
  redirect("/dashboard");
}

<SignInForm onSubmit={handleSignIn} redirectTo="/dashboard" />
```

---

### SignUpForm

**Path:** `components/forms/SignUpForm.tsx`

**Props:**
- `onSubmit: (values: { email: string; password: string; confirmPassword: string }) => Promise<{ error?: string }>`
- `redirectTo?: string` - Redirect URL after sign-up

**Validation:**
- Email format
- Password min length (8 chars)
- Password confirmation match

**Integration:** lib/auth/supabase/server.ts

**Example:**
```typescript
import { SignUpForm } from "@/lib/ui/components/forms/SignUpForm";
import { signUp } from "@/lib/auth/supabase/server";

async function handleSignUp(values: { email: string; password: string }) {
  "use server";
  const { error } = await signUp(values);
  if (error) return { error: error.message };
  redirect("/verify-email");
}

<SignUpForm onSubmit={handleSignUp} redirectTo="/verify-email" />
```

---

### ResetPasswordForm

**Path:** `components/forms/ResetPasswordForm.tsx`

**Props:**
- `onSubmit: (values: { email: string }) => Promise<{ error?: string; success?: string }>`

**Integration:** lib/auth/supabase/server.ts

**Example:**
```typescript
import { ResetPasswordForm } from "@/lib/ui/components/forms/ResetPasswordForm";
import { resetPassword } from "@/lib/auth/supabase/server";

async function handleResetPassword(values: { email: string }) {
  "use server";
  const { error } = await resetPassword(values.email);
  if (error) return { error: error.message };
  return { success: "Check your email for reset link" };
}

<ResetPasswordForm onSubmit={handleResetPassword} />
```

---

## Payment Components

### PricingTable

**Path:** `components/marketing/PricingTable.tsx`

**Props:**
- `plans: Plan[]` - Array of pricing plans
- `interval: 'month' | 'year'` - Billing interval
- `onSelectPlan: (priceId: string) => void` - Plan selection handler

**Types:**
```typescript
interface Plan {
  name: string;
  description: string;
  price: { month: number; year: number };
  priceId: { month: string; year: string }; // Stripe Price IDs
  features: string[];
  highlighted?: boolean;
}
```

**Integration:** lib/payments/stripe

**Example:**
```typescript
import { PricingTable } from "@/lib/ui/components/marketing/PricingTable";

const plans = [
  {
    name: "Starter",
    description: "For individuals",
    price: { month: 9, year: 90 },
    priceId: { month: "price_xxx", year: "price_yyy" },
    features: ["10 projects", "Basic support"],
  },
];

<PricingTable
  plans={plans}
  interval="month"
  onSelectPlan={(priceId) => handleCheckout(priceId)}
/>
```

---

### CheckoutButton

**Path:** `components/marketing/CheckoutButton.tsx`

**Props:**
- `priceId: string` - Stripe Price ID
- `children: React.ReactNode` - Button label
- `variant?: ButtonVariant` - Button variant (default: "default")

**Integration:** lib/payments/stripe/checkout.ts

**Example:**
```typescript
import { CheckoutButton } from "@/lib/ui/components/marketing/CheckoutButton";

<CheckoutButton priceId="price_xxxxx" variant="default">
  Subscribe Now
</CheckoutButton>
```

---

### SubscriptionStatus

**Path:** `components/marketing/SubscriptionStatus.tsx`

**Props:**
- `subscription: Subscription` - Stripe subscription object
- `showActions?: boolean` - Show manage/cancel buttons (default: true)

**States Displayed:**
- active - Green badge
- trialing - Blue badge
- past_due - Yellow badge
- canceled - Gray badge
- unpaid - Red badge
- incomplete - Yellow badge
- incomplete_expired - Red badge
- paused - Gray badge

**Integration:** lib/payments/stripe

**Example:**
```typescript
import { SubscriptionStatus } from "@/lib/ui/components/marketing/SubscriptionStatus";

<SubscriptionStatus
  subscription={userSubscription}
  showActions={true}
/>
```

---

## Marketing Components

### Hero

**Path:** `components/marketing/Hero.tsx`

**Props:**
- `headline: string` - Main headline
- `subheadline: string` - Description
- `primaryCta?: { label: string; href: string }` - Primary button
- `secondaryCta?: { label: string; href: string }` - Secondary button (optional)
- `variant?: 'default' | 'gradient' | 'minimal'` - Background variant

**Example:**
```typescript
import { Hero } from "@/lib/ui/components/marketing/Hero";

<Hero
  headline="Build SaaS Products Faster"
  subheadline="Production-ready components with built-in auth and payments"
  primaryCta={{ label: "Get Started", href: "/signup" }}
  secondaryCta={{ label: "View Demo", href: "/demo" }}
  variant="gradient"
/>
```

---

### Features

**Path:** `components/marketing/Features.tsx`

**Props:**
- `headline: string` - Section headline
- `subheadline?: string` - Section description (optional)
- `features: Feature[]` - Features list
- `columns?: 2 | 3 | 4` - Grid columns (default: 3)

**Types:**
```typescript
interface Feature {
  name: string;
  description: string;
  icon?: React.ReactNode;
}
```

**Example:**
```typescript
import { Features } from "@/lib/ui/components/marketing/Features";
import { RocketIcon, ShieldIcon } from "lucide-react";

const features = [
  {
    name: "Fast Setup",
    description: "Get started in minutes",
    icon: <RocketIcon className="size-6" />,
  },
  {
    name: "Secure",
    description: "Enterprise-grade security",
    icon: <ShieldIcon className="size-6" />,
  },
];

<Features
  headline="Everything you need"
  subheadline="All-in-one platform for modern SaaS"
  features={features}
  columns={3}
/>
```

---

### CTA

**Path:** `components/marketing/CTA.tsx`

**Props:**
- `headline: string` - CTA headline
- `description?: string` - CTA description (optional)
- `button: { label: string; href: string }` - Button configuration
- `variant?: 'default' | 'gradient' | 'bordered'` - Background variant

**Example:**
```typescript
import { CTA } from "@/lib/ui/components/marketing/CTA";

<CTA
  headline="Ready to get started?"
  description="Start building your SaaS today"
  button={{ label: "Sign Up Now", href: "/signup" }}
  variant="gradient"
/>
```

---

## 🎨 Design Principles

### CSS Variables Only

**All components enforce CSS variables:**

```typescript
// ✅ GOOD
className="text-foreground bg-primary"

// ❌ BAD
className="text-gray-900 bg-blue-600"
```

**Color Variables:**
- `text-foreground` - Primary text
- `text-muted-foreground` - Secondary text
- `bg-primary` - Primary background
- `bg-secondary` - Secondary background
- `bg-accent` - Accent background
- `bg-background` - Page background
- `border-border` - Border color
- `text-destructive` / `bg-destructive` - Error/danger

### Dark Mode Support

All components support dark mode via `.dark` class:

```typescript
<html className="dark">  {/* Toggle dark mode */}
```

CSS variables automatically switch:

```css
:root { --background: 0 0% 100%; }      /* Light */
.dark { --background: 222.2 84% 4.9%; } /* Dark */
```

---

**Version:** V7.0 Phase 2
**Components:** 21 total
**Status:** ✅ Complete

*Complete API reference for all library components* 📚
