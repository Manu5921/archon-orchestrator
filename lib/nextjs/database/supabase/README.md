# lib/nextjs/database/supabase - Database + RLS

**Status:** 🚧 To be implemented (Day 6-7)
**Setup time:** 5 min (vs 1h manual)
**Dependencies:** @supabase/supabase-js

---

## 📋 OVERVIEW

Complete database module with:
- SQL migrations (users, profiles, subscriptions)
- RLS policies (per-user isolation)
- TypeScript types generated
- Type-safe query builders
- Seed data (dev)

---

## 🗄️ SCHEMA

**Tables:**
1. **users** - extends auth.users
2. **profiles** - user_id FK, name, avatar
3. **subscriptions** - user_id FK, stripe_customer_id, status

---

## 🚀 QUICK START

```bash
/use-modules nextjs/database/supabase

# Run migrations:
supabase db reset

# Seed data:
supabase db seed
```

---

**Status:** 🚧 Template Ready (Day 1/7)
