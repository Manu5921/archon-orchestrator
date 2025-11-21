# 🔌 Multi-IA Integration Requirements - V7.0

**Purpose:** Technical requirements for integrating multiple AI providers in Full Auto Pipeline
**Status:** 📋 Research & Planning
**Target:** V7.0 (Future)

---

## 🎯 Overview

**Current State (V6.2.1):**
- ✅ Claude Sonnet 4.5 (Orchestrator + Implementation)
- ✅ Gemini 2.5 Pro (Analysis via Zen MCP OAuth)

**Target State (V7.0):**
- ✅ Claude Sonnet 4.5 (Orchestrator + Implementation)
- ✅ Gemini 2.5 Pro (Analysis + Design via Zen MCP OAuth)
- 🔲 OpenAI Codex (Code Review via Zen MCP)
- 🔲 Google Jules (Security via API/CLI)

---

## 1️⃣ Gemini 2.5 Pro (READY ✅)

### Current Integration

**Provider:** Google AI Studio
**Access Method:** OAuth via Gemini CLI
**Integration:** Zen MCP (`mcp__zen__clink`)

**Config:**
```json
// ~/Documents/DEV/zen-mcp-server/conf/cli_clients/gemini.json
{
  "name": "gemini",
  "command": "gemini",
  "args": ["chat"],
  "model": "gemini-2.5-pro",
  "system_prompt": "You are a comprehensive business and technical analyst."
}
```

**Usage:**
```typescript
// Phase 0: Analysis
await mcp__zen__clink({
  cli_name: "gemini",
  prompt: "Analyze this project: [brief]..."
});

// Phase 2: Design
await mcp__zen__clink({
  cli_name: "gemini",
  prompt: "Generate 3 design variants based on: [constitution + spec]..."
});
```

**Rate Limits:**
- 15 RPM (requests per minute)
- 1M TPM (tokens per minute)

**Cost:**
- Input: $0.00125 / 1K tokens
- Output: $0.005 / 1K tokens

**Status:** ✅ Production Ready

---

## 2️⃣ OpenAI Codex (NEEDED 🔲)

### Proposed Integration

**Provider:** OpenAI
**Access Method:** API Key OR OAuth
**Integration:** Zen MCP (`mcp__zen__clink` with `cli_name: "codex"`)

### Research Tasks

**1. Verify Codex Availability (Q4 2024):**
- ❓ Is Codex still available as standalone API?
- ❓ OR merged into GPT-4 Turbo with code capabilities?
- ❓ Alternative: Use GPT-4 Turbo with system prompt "You are an expert code reviewer"

**2. Authentication:**
- Option A: API Key (`OPENAI_API_KEY`)
- Option B: OAuth (if available)

**3. Pricing:**
- GPT-4 Turbo: $0.01 / 1K input tokens, $0.03 / 1K output tokens
- Estimated cost per review: $0.50-1.00 (50K-100K tokens)

### Proposed Config

**File:** `~/Documents/DEV/zen-mcp-server/conf/cli_clients/codex.json`

```json
{
  "name": "codex",
  "command": "openai",
  "args": ["api", "chat.completions.create"],
  "model": "gpt-4-turbo",
  "system_prompt": "You are an expert code reviewer. Analyze architecture patterns, best practices, performance, and suggest refactorings. Output structured JSON with issues categorized by severity (critical/high/medium/low).",
  "auth": {
    "type": "api_key",
    "env_var": "OPENAI_API_KEY"
  }
}
```

### Usage (Phase 4: Code Review)

```typescript
// Review complete codebase
const review = await mcp__zen__clink({
  cli_name: "codex",
  prompt: `Review this codebase for:
1. Architecture patterns (proper separation of concerns?)
2. Best practices (SOLID, DRY, KISS violations?)
3. Performance hotspots (N+1 queries, memory leaks?)
4. Security issues (SQL injection, XSS, CSRF?)

Codebase structure:
${await readDirectory('./src')}

Key files:
${await readFiles(['./src/app/page.tsx', './src/lib/supabase.ts', ...])}

Output JSON format:
{
  "score": 85,
  "issues": [
    {
      "file": "src/lib/supabase.ts",
      "line": 42,
      "severity": "high",
      "category": "security",
      "message": "SQL injection risk...",
      "suggestion": "Use parameterized queries..."
    }
  ],
  "summary": "Overall code quality is good but..."
}`
});

// Parse response
const codeReviewReport = JSON.parse(review);

// Save report
await writeFile('code-review-report.md', formatReport(codeReviewReport));
```

### Rate Limits

- **Tier 1 (New API Key):** 500 RPM, 30K TPM
- **Tier 4 (After $100 spent):** 5,000 RPM, 300K TPM

**Pipeline Impact:** Phase 4 needs ~50-100K tokens → OK even with Tier 1

### Alternative: Claude Code Review

**If Codex unavailable:**
- Use Claude Sonnet 4.5 for code review (same model, different prompt)
- Advantage: No additional integration needed
- Disadvantage: Less specialized than Codex (trained on code specifically)

---

## 3️⃣ Google Jules Security (RESEARCH NEEDED 🔍)

### What is Jules?

**Jules (Google):** AI-powered security assistant (announced 2024)
**Purpose:** Automated security scanning, vulnerability detection, compliance checks

### Research Tasks (CRITICAL)

**1. Availability:**
- ❓ Is Jules publicly available? (Beta? GA?)
- ❓ API access? CLI tool?
- ❓ Pricing model?
- ❓ How to request access?

**2. Contact Google:**
- Email: `google-cloud-ai@google.com` (or appropriate contact)
- Request: Access to Jules for Archon Orchestrator project
- Use case: Automated security scanning in CI/CD pipeline

**3. Documentation:**
- ❓ API docs available?
- ❓ Supported languages/frameworks?
- ❓ Output format (JSON? Markdown?)?

### Proposed Integration (IF Available)

**Option A: REST API**

```bash
# Scan codebase
curl -X POST https://jules.googleapis.com/v1/scan \
  -H "Authorization: Bearer $JULES_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "./",
    "rules": ["owasp-top-10", "cwe-top-25", "rgpd", "hipaa"],
    "framework": "nextjs",
    "output_format": "json"
  }'

# Response
{
  "scan_id": "scan_abc123",
  "score": 78,
  "vulnerabilities": [
    {
      "file": "src/app/api/auth/route.ts",
      "line": 23,
      "severity": "critical",
      "cwe_id": "CWE-89",
      "owasp_id": "A03:2021",
      "title": "SQL Injection",
      "description": "User input concatenated in SQL query...",
      "remediation": "Use parameterized queries or ORM..."
    }
  ],
  "compliance": {
    "rgpd": { "status": "pass", "issues": 0 },
    "hipaa": { "status": "fail", "issues": 2 }
  }
}
```

**Option B: CLI Tool**

```bash
# Install Jules CLI (hypothetical)
npm install -g @google-cloud/jules-cli

# Authenticate
jules auth login

# Scan
jules scan ./ \
  --rules owasp-top-10,cwe-top-25,rgpd \
  --framework nextjs \
  --output security-report.md
```

### Usage (Phase 5: Security Scan)

```typescript
// Option A: API
const scanResult = await fetch('https://jules.googleapis.com/v1/scan', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.JULES_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    path: './',
    rules: ['owasp-top-10', 'rgpd'],
    framework: detectedFramework
  })
});

const report = await scanResult.json();

// Save report
await writeFile('security-report.md', formatSecurityReport(report));

// Option B: CLI
await bash(`jules scan ./ --output security-report.md`);
```

### Alternatives (IF Jules Unavailable)

**Option 1: Snyk (Dependency Scanning)**
```bash
# Install
npm install -g snyk

# Authenticate
snyk auth $SNYK_API_KEY

# Scan
snyk test --json > snyk-report.json
```

**Option 2: OWASP ZAP (Security Testing)**
```bash
# Docker
docker run -v $(pwd):/zap/wrk:rw \
  owasp/zap2docker-stable \
  zap-baseline.py \
  -t http://localhost:3000 \
  -r zap-report.html
```

**Option 3: Custom OWASP Checker (Basic)**
```typescript
// Manual checks for common issues
const owaspCheck = async () => {
  const issues = [];

  // A01: Broken Access Control
  if (await hasUnprotectedRoutes()) {
    issues.push({
      owasp_id: 'A01:2021',
      severity: 'critical',
      message: 'Unprotected API routes found'
    });
  }

  // A03: Injection
  if (await hasUnsafeQueries()) {
    issues.push({
      owasp_id: 'A03:2021',
      severity: 'critical',
      message: 'SQL injection risk detected'
    });
  }

  // ... other checks

  return issues;
};
```

---

## 4️⃣ Cost Analysis (V7.0 Pipeline)

### Per-MVP Cost Estimate

**Phase 0: Gemini Analysis (5 min)**
- Input: ~10K tokens (brief + context)
- Output: ~5K tokens (analysis)
- Cost: $0.01 + $0.025 = **$0.035**

**Phase 2: Gemini Design (15 min)**
- Input: ~20K tokens (constitution + spec + brief)
- Output: ~15K tokens (3 variants)
- Cost: $0.025 + $0.075 = **$0.10**

**Phase 3: Claude Implementation (2-3h)**
- Estimated: 300K-500K tokens (sub-agents)
- Cost: ~$10-15 (Claude Pro subscription covers)
- Marginal cost: **$0** (included in Pro)

**Phase 4: Codex Code Review (30 min)**
- Input: ~50K tokens (codebase)
- Output: ~5K tokens (report)
- Cost: $0.50 + $0.15 = **$0.65**

**Phase 5: Jules Security Scan (15 min)**
- Cost: **TBD** (depends on Jules pricing)
- Estimate: $0.50-1.00 per scan

**Total per MVP:** $0.035 + $0.10 + $0 + $0.65 + $1.00 = **~$1.80**

**With Claude Pro ($20/month):**
- Effective cost per MVP: ~$2-3 (including Claude subscription pro-rata)

**Acceptable if client €5K+** ✅

---

## 5️⃣ Rate Limit Matrix

| Provider | Limit (RPM) | Limit (TPM) | Pipeline Usage | Status |
|----------|-------------|-------------|----------------|--------|
| **Gemini** | 15 | 1M | ~5 requests | ✅ OK |
| **Claude** | Unlimited | 200K context | Continuous | ✅ OK |
| **Codex** | 500 (Tier 1) | 30K (Tier 1) | ~3 requests | ✅ OK |
| **Jules** | TBD | TBD | ~2 requests | 🔍 Research |

**Bottleneck:** None expected (well below limits)

---

## 6️⃣ Next Steps (Research & Setup)

### Immediate (Before V7.0 Implementation)

**1. Codex Research (3-4 hours):**
- [ ] Verify Codex availability (API docs)
- [ ] Test GPT-4 Turbo with code review prompt
- [ ] Create Zen MCP config for Codex
- [ ] Test end-to-end code review workflow

**2. Jules Research (1 week - depends on Google response):**
- [ ] Contact Google for Jules access
- [ ] Review Jules documentation (if available)
- [ ] Test Jules API/CLI (if available)
- [ ] Document integration approach

**3. Cost Validation (2-3 hours):**
- [ ] Run full pipeline with all IAs on test project
- [ ] Measure actual token usage per phase
- [ ] Calculate real cost per MVP
- [ ] Validate acceptable if client €5K+

### Before Launch (V7.0.0)

**4. Integration Testing (1 week):**
- [ ] Test Gemini + Claude (already working)
- [ ] Test Codex integration (code review)
- [ ] Test Jules integration (security scan)
- [ ] Test error handling (API failures)

**5. Fallback Strategies (3-4 days):**
- [ ] If Codex fails → Use Claude code review
- [ ] If Jules fails → Use Snyk + OWASP ZAP
- [ ] Document degraded mode (skip validation phases)

---

## 7️⃣ References

**Gemini:**
- Docs: https://ai.google.dev/docs
- Pricing: https://ai.google.dev/pricing
- OAuth: https://ai.google.dev/tutorials/oauth_quickstart

**OpenAI:**
- Docs: https://platform.openai.com/docs
- Pricing: https://openai.com/pricing
- API Reference: https://platform.openai.com/docs/api-reference

**Jules (Google):**
- Announcement: [TBD - need to find official announcement]
- Contact: google-cloud-ai@google.com (tentative)

**Alternatives:**
- Snyk: https://snyk.io/product/open-source-security-management/
- OWASP ZAP: https://www.zaproxy.org/
- SonarQube: https://www.sonarqube.org/

---

**Status:** 📋 Research Document
**Next Update:** After Codex + Jules research complete
**Owner:** Beehive Innovations / Archon Team
**Last Updated:** 2025-11-21

*Multi-IA Integration: Research & Planning for V7.0 Full Auto Pipeline* 🔌🤖
