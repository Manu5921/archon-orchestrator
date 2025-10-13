# FormIQ - Technical Specification v1.0 (PIVOT: Developer Tool)

*Generated: 2025-10-15 via Multi-IA Roundtable (Gemini + Claude)*
*Constitution: See .specify/memory/constitution.md*
*⚠️ **PIVOT CONFIRMED** - Building open-source library, NOT SaaS*

---

## 🔧 Technical Standards

### Package Manager
**pnpm EXCLUSIVELY** (no npm/yarn)

### Node Version
**20.x+ LTS** (check: `node --version`)

### TypeScript Config
```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler"
  }
}
```

### Validation
**Zod** for schema definitions (FormIQ wraps Zod + adds AI layer)

### Build Tool
**tsup** (zero-config TypeScript bundler for libraries)

---

## 📦 Library Architecture (MVP v1.0)

### Package Structure

```
form-ai/
├── src/
│   ├── index.ts              # Main exports
│   ├── react/
│   │   └── useFormAI.ts      # React Hook (F001)
│   ├── vanilla/
│   │   └── FormAI.ts         # Vanilla JS API
│   ├── providers/
│   │   ├── openai.ts         # OpenAI adapter
│   │   ├── anthropic.ts      # Anthropic adapter
│   │   └── ollama.ts         # Ollama adapter
│   ├── prompts/
│   │   ├── email.ts          # Email validation prompts
│   │   ├── address.ts        # Address validation prompts
│   │   └── phone.ts          # Phone validation prompts
│   └── utils/
│       ├── cache.ts          # Response caching (24h)
│       └── rateLimit.ts      # Client-side rate limiting
├── tests/
│   ├── react.test.tsx        # React Hook tests
│   └── vanilla.test.ts       # Vanilla API tests
├── examples/
│   ├── nextjs/               # Next.js example
│   └── react/                # React example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🎯 Core Features Implementation

### F001: React Hook API

**File:** `src/react/useFormAI.ts`

```typescript
import { z } from 'zod';

export interface UseFormAIOptions {
  provider: 'openai' | 'anthropic' | 'ollama';
  apiKey?: string;              // Optional if using env var
  model?: string;               // Default: gpt-4o-mini | claude-haiku-3-5
  promptTemplate?: 'default' | 'email' | 'address' | 'phone';
  cacheEnabled?: boolean;       // Default: true (24h cache)
  rateLimitPerMin?: number;     // Default: 10 validations/min
  onError?: (error: Error) => void;
}

export interface FormAIValidationResult {
  isValid: boolean;
  aiSuggestion?: string;        // e.g., "Did you mean @gmail.com?"
  confidence?: number;          // 0-1 score
  cached?: boolean;             // true if response from cache
}

export function useFormAI<T extends z.ZodSchema>(
  schema: T,
  options: UseFormAIOptions
) {
  const [validationResults, setValidationResults] = useState<
    Record<string, FormAIValidationResult>
  >({});
  const [isValidating, setIsValidating] = useState(false);

  const validateField = useCallback(async (
    fieldName: string,
    fieldValue: unknown
  ) => {
    // 1. Zod validation first (fast, free)
    const zodResult = schema.shape[fieldName]?.safeParse(fieldValue);
    if (!zodResult?.success) {
      return {
        isValid: false,
        aiSuggestion: zodResult.error.errors[0]?.message
      };
    }

    // 2. Check cache (hash: fieldName + fieldValue)
    const cached = checkCache(fieldName, fieldValue);
    if (cached) {
      return { ...cached, cached: true };
    }

    // 3. Rate limit check (token bucket)
    if (!checkRateLimit()) {
      return { isValid: true, aiSuggestion: "Rate limited - skipping AI" };
    }

    // 4. LLM validation (AI enhancement)
    setIsValidating(true);
    try {
      const provider = createProvider(options.provider, options.apiKey);
      const prompt = getPromptTemplate(options.promptTemplate, fieldName);
      const result = await provider.validate(fieldValue, prompt);

      // Cache for 24h
      cacheResult(fieldName, fieldValue, result);

      return result;
    } catch (error) {
      options.onError?.(error);
      return { isValid: true }; // Fail open (don't block user)
    } finally {
      setIsValidating(false);
    }
  }, [schema, options]);

  return {
    validateField,
    validationResults,
    isValidating
  };
}
```

**Usage Example:**

```typescript
// app/contact/page.tsx
import { useFormAI } from 'form-ai/react';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  phone: z.string().min(10)
});

export default function ContactForm() {
  const { validateField, validationResults } = useFormAI(schema, {
    provider: 'openai',
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    promptTemplate: 'email'
  });

  return (
    <form>
      <input
        type="email"
        onBlur={(e) => validateField('email', e.target.value)}
      />
      {validationResults.email?.aiSuggestion && (
        <p className="text-amber-600">
          {validationResults.email.aiSuggestion}
        </p>
      )}
    </form>
  );
}
```

---

### F002: Prompt Library

**File:** `src/prompts/email.ts`

```typescript
export const emailPromptTemplate = (fieldValue: string) => `
You are validating an email address in a web form.

Email provided: "${fieldValue}"

Tasks:
1. Check for common typos in domain (gmial→gmail, yaho→yahoo, outlok→outlook)
2. Check for missing @ or TLD (.com, .org, .net)
3. Check for suspicious patterns (test@test, admin@localhost)

If valid: Return { isValid: true, confidence: 1.0 }
If fixable typo: Return { isValid: false, aiSuggestion: "Did you mean [corrected]?", confidence: 0.8 }
If suspicious: Return { isValid: false, aiSuggestion: "Please use a real email address", confidence: 0.9 }

Output JSON only (no markdown):
`;

export const addressPromptTemplate = (fieldValue: string) => `
You are validating a postal address.

Address provided: "${fieldValue}"

Tasks:
1. Check if address has street number + street name + city
2. Detect missing postal code
3. Suggest formatting improvements (abbreviations → full names)

If complete: Return { isValid: true, confidence: 1.0 }
If incomplete: Return { isValid: false, aiSuggestion: "Missing [component]", confidence: 0.7 }

Output JSON only:
`;

export const phonePromptTemplate = (fieldValue: string) => `
You are validating a phone number.

Phone provided: "${fieldValue}"

Tasks:
1. Check if valid format for country (FR: +33, US: +1, etc.)
2. Suggest adding country code if missing
3. Detect if too short or too long

If valid: Return { isValid: true, confidence: 1.0 }
If fixable: Return { isValid: false, aiSuggestion: "Did you mean +33[number]?", confidence: 0.8 }

Output JSON only:
`;
```

---

### F003: LLM Provider Abstraction

**File:** `src/providers/base.ts`

```typescript
export interface LLMProvider {
  validate(
    fieldValue: unknown,
    prompt: string
  ): Promise<FormAIValidationResult>;
}

export abstract class BaseLLMProvider implements LLMProvider {
  protected apiKey: string;
  protected model: string;

  constructor(apiKey: string, model: string) {
    this.apiKey = apiKey;
    this.model = model;
  }

  abstract validate(
    fieldValue: unknown,
    prompt: string
  ): Promise<FormAIValidationResult>;
}
```

**File:** `src/providers/openai.ts`

```typescript
import OpenAI from 'openai';
import { BaseLLMProvider } from './base';

export class OpenAIProvider extends BaseLLMProvider {
  private client: OpenAI;

  constructor(apiKey: string, model = 'gpt-4o-mini') {
    super(apiKey, model);
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });
  }

  async validate(fieldValue: unknown, prompt: string) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 150,
      temperature: 0.3
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from OpenAI');

    return JSON.parse(content) as FormAIValidationResult;
  }
}
```

**File:** `src/providers/anthropic.ts`

```typescript
import Anthropic from '@anthropic-ai/sdk';
import { BaseLLMProvider } from './base';

export class AnthropicProvider extends BaseLLMProvider {
  private client: Anthropic;

  constructor(apiKey: string, model = 'claude-3-5-haiku-20241022') {
    super(apiKey, model);
    this.client = new Anthropic({ apiKey });
  }

  async validate(fieldValue: unknown, prompt: string) {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 150,
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Unexpected response type');

    // Extract JSON from markdown if present
    const jsonMatch = content.text.match(/```json\n(.*?)\n```/s) ||
                      content.text.match(/\{.*\}/s);
    if (!jsonMatch) throw new Error('No JSON in response');

    return JSON.parse(jsonMatch[1] || jsonMatch[0]) as FormAIValidationResult;
  }
}
```

**File:** `src/providers/ollama.ts`

```typescript
import { BaseLLMProvider } from './base';

export class OllamaProvider extends BaseLLMProvider {
  private baseUrl: string;

  constructor(model = 'llama3.2', baseUrl = 'http://localhost:11434') {
    super('', model); // Ollama doesn't use API key
    this.baseUrl = baseUrl;
  }

  async validate(fieldValue: unknown, prompt: string) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        stream: false,
        format: 'json'
      })
    });

    if (!response.ok) throw new Error('Ollama API error');
    const data = await response.json();

    return JSON.parse(data.response) as FormAIValidationResult;
  }
}
```

---

### F004: Caching & Rate Limiting

**File:** `src/utils/cache.ts`

```typescript
import { createHash } from 'crypto';

const cache = new Map<string, { result: FormAIValidationResult; expiry: number }>();

export function getCacheKey(fieldName: string, fieldValue: unknown): string {
  const hash = createHash('sha256')
    .update(`${fieldName}:${JSON.stringify(fieldValue)}`)
    .digest('hex');
  return hash.substring(0, 16);
}

export function checkCache(
  fieldName: string,
  fieldValue: unknown
): FormAIValidationResult | null {
  const key = getCacheKey(fieldName, fieldValue);
  const cached = cache.get(key);

  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    cache.delete(key);
    return null;
  }

  return cached.result;
}

export function cacheResult(
  fieldName: string,
  fieldValue: unknown,
  result: FormAIValidationResult,
  ttl = 24 * 60 * 60 * 1000 // 24h
) {
  const key = getCacheKey(fieldName, fieldValue);
  cache.set(key, {
    result,
    expiry: Date.now() + ttl
  });
}
```

**File:** `src/utils/rateLimit.ts`

```typescript
export class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  private capacity: number;
  private refillRate: number; // tokens per second

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume(tokens = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  private refill() {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
}

// Global rate limiter (10 validations per minute)
const rateLimiter = new TokenBucket(10, 10 / 60);

export function checkRateLimit(): boolean {
  return rateLimiter.consume();
}
```

---

## 🧪 Testing Strategy

### Unit Tests (Vitest)

**File:** `tests/react.test.tsx`

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useFormAI } from '../src/react/useFormAI';
import { z } from 'zod';

describe('useFormAI', () => {
  it('validates email with Zod first', async () => {
    const schema = z.object({
      email: z.string().email()
    });

    const { result } = renderHook(() =>
      useFormAI(schema, {
        provider: 'openai',
        apiKey: 'test-key'
      })
    );

    await result.current.validateField('email', 'invalid');

    expect(result.current.validationResults.email?.isValid).toBe(false);
  });

  it('uses cache for repeated validations', async () => {
    // Test cache hit (no API call)
  });

  it('respects rate limits', async () => {
    // Test token bucket (max 10/min)
  });
});
```

### Integration Tests (Playwright)

**File:** `examples/nextjs/tests/e2e.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('AI suggests email typo correction', async ({ page }) => {
  await page.goto('/contact');

  await page.fill('input[name="email"]', 'user@gmial.com');
  await page.blur('input[name="email"]');

  await expect(page.locator('text=Did you mean @gmail.com?')).toBeVisible();
});
```

---

## 📦 Dependencies

### Core
```json
{
  "zod": "^3.23.0",
  "openai": "^4.60.0",
  "@anthropic-ai/sdk": "^0.30.0"
}
```

### Peer Dependencies (React Hook)
```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

### Dev
```json
{
  "typescript": "^5.6.0",
  "tsup": "^8.3.0",
  "vitest": "^2.1.0",
  "@testing-library/react": "^16.0.0",
  "@playwright/test": "^1.47.0"
}
```

---

## 🚀 Build & Publish

### Build Command (tsup)

```bash
tsup src/index.ts --format cjs,esm --dts --clean
```

**Output:**
```
dist/
├── index.js          # CommonJS
├── index.mjs         # ESM
├── index.d.ts        # TypeScript definitions
└── react/
    ├── useFormAI.js
    ├── useFormAI.mjs
    └── useFormAI.d.ts
```

### Package.json Exports

```json
{
  "name": "form-ai",
  "version": "1.0.0",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./react": {
      "import": "./dist/react/useFormAI.mjs",
      "require": "./dist/react/useFormAI.js",
      "types": "./dist/react/useFormAI.d.ts"
    }
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true }
  }
}
```

### Publish to npm

```bash
pnpm build
pnpm test
pnpm publish --access public
```

---

## 📊 Performance Targets

### MVP v1.0

- **Cache hit rate:** >60% (reduces API calls)
- **Validation latency:** <500ms (p95) with cache miss
- **Bundle size:** <50KB (gzipped) for core library
- **Rate limit:** 10 validations/min (prevents cost explosions)

### Monitoring

- **GitHub Stars:** Track adoption
- **npm Downloads:** Weekly growth
- **Issue velocity:** Response time <24h

---

## 🤖 Sub-Agents Architecture (Implementation Phase)

### Agents List

1. **library-specialist**
   - **Focus:** Core library (React Hook + Vanilla API)
   - **Files:** `src/react/`, `src/vanilla/`, `src/utils/`
   - **Tools:** Read, Write, Edit, Bash
   - **Quality Gates:** P0 Build, P1 Type-check, P2 Unit tests

2. **provider-specialist**
   - **Focus:** LLM provider adapters (OpenAI, Anthropic, Ollama)
   - **Files:** `src/providers/`
   - **Tools:** Read, Write, Edit
   - **Quality Gates:** P1 Integration tests (mock API responses)

3. **prompt-engineer**
   - **Focus:** Prompt library (email, address, phone templates)
   - **Files:** `src/prompts/`
   - **Tools:** Read, Write
   - **Quality Gates:** P2 Prompt testing (10+ examples per template)

4. **testing-specialist**
   - **Focus:** Unit tests (Vitest) + Integration tests (Playwright)
   - **Files:** `tests/`, `examples/*/tests/`
   - **Tools:** Read, Write, Bash
   - **Quality Gates:** P1 Coverage >80%

5. **docs-specialist**
   - **Focus:** README, examples, API reference
   - **Files:** `README.md`, `examples/`, `docs/`
   - **Tools:** Write, Read
   - **Quality Gates:** P2 Documentation complete

---

## 🎯 Implementation Plan

### Week 1-2: Core Library
- [ ] Setup monorepo (tsup + vitest + Playwright)
- [ ] Implement `useFormAI` React Hook (F001)
- [ ] Implement Zod integration
- [ ] Implement caching (F004)
- [ ] Implement rate limiting (F004)

### Week 3: Provider Adapters
- [ ] OpenAI provider (F003)
- [ ] Anthropic provider (F003)
- [ ] Ollama provider (F003)
- [ ] Provider factory (switch via config)

### Week 4: Prompt Library
- [ ] Email prompt template (F002)
- [ ] Address prompt template (F002)
- [ ] Phone prompt template (F002)
- [ ] Test prompts on 100+ examples

### Week 5: Examples & Documentation
- [ ] Next.js example app
- [ ] React (Vite) example app
- [ ] README with quickstart
- [ ] API reference docs

### Week 6: Launch
- [ ] Publish to npm
- [ ] Post on GitHub
- [ ] Launch on Product Hunt
- [ ] Write launch blog post

---

**Implementation:** Use `/speckit.plan` → `/speckit.tasks` → `/speckit.agents` to generate orchestration prompts.
