# lib/nextjs/email/resend - Email Service

**Status:** 🚧 To be implemented (Day 4-5)
**Setup time:** 5 min (vs 2h manual)
**Dependencies:** resend, react-email

---

## 📋 OVERVIEW

Complete email service module with:
- Send email function
- React Email templates (welcome, reset, invoice)
- Branded email layout
- TypeScript types

---

## 📦 DEPENDENCIES

```json
{
  "resend": "^4.x.x",
  "react-email": "^3.x.x"
}
```

---

## ⚙️ ENVIRONMENT VARIABLES

```bash
# .env.local
RESEND_API_KEY=re_...
```

**Get key:** [Resend Dashboard](https://resend.com/api-keys)

---

## 🚀 QUICK START

```bash
/use-modules nextjs/email/resend

# Configure .env.local
# Install: pnpm install
```

---

## 📘 USAGE

```tsx
import { sendEmail } from '@/lib/email/client';
import { WelcomeEmail } from '@/lib/email/templates/welcome';

await sendEmail({
  to: user.email,
  subject: 'Welcome!',
  template: <WelcomeEmail name={user.name} />
});
```

---

**Status:** 🚧 Template Ready (Day 1/7)
