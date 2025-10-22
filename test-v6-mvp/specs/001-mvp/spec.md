# Technical Specification - Test V6 MVP

**Project:** Test V6 MVP
**Version:** 1.0
**Date:** 2025-10-16

## Overview

Simple test project to validate /speckit.final command with 3 agents.

## Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- shadcn/ui

**Backend:**
- Node.js
- Express
- Supabase

**Testing:**
- Playwright (E2E)
- Vitest (unit)

## Architecture

**Pattern:** Monolith (simple)

**Structure:**
```
src/
├── app/           # Pages
├── components/    # UI components
├── lib/           # Business logic
└── services/      # API calls
```

## Features

1. **User Authentication** (T001-T003)
2. **Dashboard UI** (T004-T006)
3. **API Endpoints** (T007-T008)
4. **Tests** (T009-T010)

## Design System

Design tokens: `design/design-tokens.json`
- Primary: #3B82F6 (blue)
- Neutral: #6B7280 (gray)
- Font: Inter

## Success Criteria

- ✅ 10 tasks completed
- ✅ Build passes
- ✅ 3 agents executed sequentially
- ✅ Pulse log complete
