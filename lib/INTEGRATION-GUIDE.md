# 📚 Library Integration Guide

**Version:** 1.0.0 (Phase 1)
**Last Updated:** 2025-10-22
**Modules Available:** Auth, Payments, Email (3/5 ready)

---

## 🎯 Quick Start

### Step 1: Choose Your Modules

**Available (Phase 1):**
- ✅ `nextjs/auth/supabase` - Authentication (Supabase)
- ✅ `nextjs/payments/stripe` - Payments (Stripe)
- ✅ `nextjs/email/resend` - Email (Resend + React Email)

**Coming Soon (Phase 2):**
- 🚧 `nextjs/ui` - Design System + shadcn/ui
- 🚧 `nextjs/database/supabase` - SQL Migrations + RLS

---

### Step 2: Manual Copy (Phase 1)

**Until `/use-modules` command is built, manual copy:**

```bash
# Example: Add auth + payments + email to your project

# 1. Copy module files
cp -r ~/archon-orchestrator/lib/nextjs/auth/supabase src/lib/auth
cp -r ~/archon-orchestrator/lib/nextjs/payments/stripe src/lib/payments
cp -r ~/archon-orchestrator/lib/nextjs/email/resend src/lib/email

# 2. Install dependencies
pnpm add @supabase/supabase-js @supabase/ssr stripe resend react-email

# 3. Configure environment variables
cat >> .env.local << 'EOF'
# Supabase (Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Resend (Email)
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com

# App Config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Your App
EOF
```

---

## 🔐 Module Integration

### Auth Module (Supabase)

**1. Wrap app with AuthProvider:**

```tsx
// app/layout.tsx
import { AuthProvider } from '@/lib/auth/providers';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

**2. Add middleware for route protection:**

```tsx
// middleware.ts
import { authMiddleware } from '@/lib/auth/middleware';

export const middleware = authMiddleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

**3. Use in components:**

```tsx
// Client component
'use client';
import { useUser } from '@/lib/auth/client';

export function ProfileButton() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <a href="/sign-in">Sign In</a>;

  return <div>Hello {user.email}</div>;
}

// Server Action
'use server';
import { signIn, signOut } from '@/lib/auth/server';

export async function handleSignIn(formData: FormData) {
  const { user, error } = await signIn({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) return { error: error.message };
  redirect('/dashboard');
}
```

---

### Payments Module (Stripe)

**1. Create checkout endpoint:**

```tsx
// app/api/checkout/route.ts
import { createCheckoutSession } from '@/lib/payments/checkout';
import { getUser } from '@/lib/auth/server';

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { priceId } = await request.json();

  const session = await createCheckoutSession({
    userId: user.id,
    priceId,
    successUrl: '/dashboard',
    cancelUrl: '/pricing',
  });

  return Response.json({ url: session.url });
}
```

**2. Create webhook endpoint:**

```tsx
// app/api/stripe/webhook/route.ts
import { handleWebhook } from '@/lib/payments/webhooks';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  try {
    const result = await handleWebhook(body, signature);
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

**3. Test webhooks locally:**

```bash
# Terminal 1: Run your app
pnpm dev

# Terminal 2: Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

### Email Module (Resend)

**1. Send welcome email after signup:**

```tsx
// app/auth/actions.ts
'use server';
import { signUp } from '@/lib/auth/server';
import { sendEmail } from '@/lib/email/client';
import { WelcomeEmail } from '@/lib/email/templates/welcome';

export async function handleSignUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { user, error } = await signUp({ email, password });

  if (error) return { error: error.message };

  // Send welcome email
  await sendEmail({
    to: email,
    subject: 'Welcome to Our App!',
    react: <WelcomeEmail email={email} name={user?.user_metadata?.name} />
  });

  return { success: 'Check your email to verify your account' };
}
```

**2. Send password reset email:**

```tsx
import { sendEmail } from '@/lib/email/client';
import { PasswordResetEmail } from '@/lib/email/templates/reset-password';

await sendEmail({
  to: user.email,
  subject: 'Reset Your Password',
  react: <PasswordResetEmail name={user.name} resetLink={resetLink} expiresIn="24 hours" />
});
```

**3. Send invoice email (after payment):**

```tsx
import { sendEmail } from '@/lib/email/client';
import { InvoiceEmail } from '@/lib/email/templates/invoice';

await sendEmail({
  to: user.email,
  subject: `Invoice ${invoiceNumber}`,
  react: <InvoiceEmail
    name={user.name}
    invoiceNumber={invoiceNumber}
    amount="$19.99"
    date="October 22, 2025"
    invoiceLink={invoiceLink}
  />
});
```

---

## 🔗 Module Interactions

### Auth + Payments

**Protect checkout with authentication:**

```tsx
// app/api/checkout/route.ts
import { createCheckoutSession } from '@/lib/payments/checkout';
import { requireAuth } from '@/lib/auth/server';

export async function POST(request: Request) {
  // Require authentication (redirects if not logged in)
  const user = await requireAuth();

  const { priceId } = await request.json();

  const session = await createCheckoutSession({
    userId: user.id,
    priceId,
  });

  return Response.json({ url: session.url });
}
```

---

### Auth + Email

**Send verification email after signup:**

```tsx
import { signUp } from '@/lib/auth/server';
import { sendEmail } from '@/lib/email/client';
import { WelcomeEmail } from '@/lib/email/templates/welcome';

const { user } = await signUp({ email, password });

await sendEmail({
  to: email,
  subject: 'Verify Your Email',
  react: <WelcomeEmail
    email={email}
    verificationLink={`${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`}
  />
});
```

---

### Payments + Email

**Send invoice after successful payment:**

```tsx
// In webhook handler (lib/payments/webhooks.ts)
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const userId = invoice.subscription_details?.metadata?.userId;

  // TODO: Fetch user from database
  // const user = await getUser(userId);

  await sendEmail({
    to: user.email,
    subject: `Invoice Paid - ${invoice.number}`,
    react: <InvoiceEmail
      name={user.name}
      invoiceNumber={invoice.number!}
      amount={formatPrice(invoice.amount_paid, invoice.currency)}
      date={new Date(invoice.created * 1000).toLocaleDateString()}
      invoiceLink={invoice.hosted_invoice_url!}
    />
  });
}
```

---

## 🐛 Troubleshooting

### Auth Issues

**"User is not authenticated" error:**
1. Check `.env.local` has correct Supabase keys
2. Verify AuthProvider wraps your app
3. Check middleware is configured

**Middleware not protecting routes:**
1. Verify `middleware.ts` exports `authMiddleware`
2. Check `matcher` config includes your protected routes
3. Clear browser cookies and try again

---

### Payments Issues

**Webhooks not receiving events:**
1. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
2. Copy webhook signing secret to `.env.local` (STRIPE_WEBHOOK_SECRET)
3. Verify webhook endpoint returns 200 OK

**Checkout session creation fails:**
1. Check STRIPE_SECRET_KEY is set
2. Verify priceId exists in Stripe Dashboard
3. Ensure user is authenticated (if required)

---

### Email Issues

**Emails not sending:**
1. Check RESEND_API_KEY is valid (test in Resend Dashboard)
2. Verify RESEND_FROM_EMAIL domain is verified in Resend
3. Check rate limits (Resend free tier: 100 emails/day)

**Template not rendering:**
1. Verify all React Email dependencies installed
2. Check template props match types
3. Test with plain text first: `sendEmail({ to, subject, text: 'Test' })`

---

## 📊 Performance Tips

### Auth

- **Use server-side checks:** `requireAuth()` in Server Actions (faster than client hooks)
- **Cache user data:** Store in React Context (AuthProvider already does this)
- **Middleware optimization:** Only run on protected routes (use `matcher` config)

### Payments

- **Cache products/prices:** Fetch once, store in database, refresh daily
- **Webhook idempotency:** Check `event.id` to prevent duplicate processing
- **Use metadata:** Store `userId` in all Stripe objects for easy lookup

### Email

- **Batch emails:** Use `sendBatchEmails()` for multiple recipients
- **Queue system:** For high volume, use a queue (BullMQ, Inngest)
- **Template caching:** React Email templates compile once per deployment

---

## 🚀 Next Steps

1. **Implement database integration** (Phase 2)
   - Connect auth module to Supabase database
   - Store user subscriptions (payments module)
   - Add user profiles table

2. **Add UI module** (Phase 2)
   - design-tokens.json for branding
   - Auth forms (SignInForm, SignUpForm)
   - Payment components (PricingTable)

3. **Build `/use-modules` command** (Phase 2)
   - Automate file copying
   - Auto-install dependencies
   - Generate .env.example

---

**Version:** 1.0.0
**Last Updated:** 2025-10-22
**Status:** Phase 1 Complete (3/5 modules)

*For questions or issues, refer to individual module READMEs*
