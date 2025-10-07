# 🔒 JULES SECURITY GUARDIAN - Setup Guide

**Version:** 1.0
**Date:** 2025-10-07
**Purpose:** Configuration complète Jules pour sécurité automatisée

---

## 📋 TABLE DES MATIÈRES

1. [Prerequisites](#prerequisites)
2. [Installation Jules CLI](#installation-jules-cli)
3. [Configuration GitHub](#configuration-github)
4. [Security Checklist Template](#security-checklist-template)
5. [Jules API Configuration](#jules-api-configuration)
6. [Testing Setup](#testing-setup)
7. [Troubleshooting](#troubleshooting)

---

## ✅ PREREQUISITES

### **Local Environment:**

```bash
# Required
✅ Node.js 18+ (check: node --version)
✅ npm 9+ (check: npm --version)
✅ Git (check: git --version)
✅ GitHub CLI (check: gh --version)

# Optional but recommended
✅ jq (JSON parser: brew install jq)
✅ curl (API testing)
```

### **Accounts:**

```bash
✅ Google account (for Jules)
✅ GitHub account
✅ Jules AI Pro subscription ($19.99/month)
   → Sign up: https://jules.google/pricing
```

---

## 🚀 INSTALLATION JULES CLI

### **Step 1: Install via npm (2 min)**

```bash
# Install globally
npm install -g @google/jules-cli

# Verify installation
jules --version
# Expected output: jules v1.2.0 (or higher)

# Check help
jules --help
# Expected: List of commands (auth, submit, wait, jobs, etc.)
```

---

### **Step 2: Authenticate (3 min)**

```bash
# Start authentication flow
jules auth login

# What happens:
# 1. Opens browser automatically
# 2. Redirects to: https://accounts.google.com/...
# 3. Select Google account
# 4. Authorize "Jules CLI" app
# 5. Redirect back with success message
# 6. Token saved locally (~/.jules/credentials.json)

# Verify authentication
jules auth status
# Expected output:
✅ Logged in as: your-email@gmail.com
✅ Plan: AI Pro ($19.99/month)
✅ Token expires: 2025-11-07 (30 days)
```

---

### **Step 3: Get API Key (2 min)**

```bash
# Generate API key for GitHub Actions
jules auth token

# Expected output (copy this):
sk-jules-abc123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yza890

# IMPORTANT: Save this token securely
# You'll need it for GitHub Secrets (next section)
```

---

### **Step 4: Verify Quota (1 min)**

```bash
# Check your daily quota
jules usage

# Expected output:
📊 Jules AI Pro Usage:
   Tasks used today: 0/15
   Concurrent tasks: 0/3
   Monthly quota: 0/450 tasks

   Next reset: 2025-10-08 00:00:00 UTC (23h 45m)

# If quota = 0/0:
→ Subscription not active
→ Check: https://jules.google/account
→ Verify payment method
```

---

## ⚙️ CONFIGURATION GITHUB

### **Step 1: Create Repository Secrets (5 min)**

**Navigate to GitHub:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions
```

**Click:** "New repository secret"

---

**Secret 1: JULES_API_KEY**

```yaml
Name: JULES_API_KEY
Value: sk-jules-abc123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yza890
       ↑ (paste token from: jules auth token)
```

**Click:** "Add secret"

---

**Secret 2: SLACK_WEBHOOK (Optional)**

```yaml
Name: SLACK_WEBHOOK
Value: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
       ↑ (get from: https://api.slack.com/messaging/webhooks)
```

**Note:** Si tu n'utilises pas Slack, skip ce secret (workflow fonctionne sans).

---

### **Step 2: Verify Secrets (1 min)**

```bash
# List repository secrets (GitHub CLI)
gh secret list

# Expected output:
JULES_API_KEY       Updated 2025-10-07
SLACK_WEBHOOK       Updated 2025-10-07 (optional)

# If missing:
gh secret set JULES_API_KEY < token.txt
```

---

## 📄 SECURITY CHECKLIST TEMPLATE

### **Create File: `.github/security-checklist.md`**

```bash
# Create directory
mkdir -p .github

# Create file
touch .github/security-checklist.md
```

**Content:**

```markdown
# Security Checklist - Jules Guardian

## OWASP Top 10 (2021)

### A01: Broken Access Control
- [ ] Authentication required for all protected routes
- [ ] Authorization checks before sensitive operations
- [ ] Row Level Security (RLS) enabled on database tables
- [ ] No direct object references (use UUIDs, not sequential IDs)
- [ ] CORS restricted to specific origins (not *)

### A02: Cryptographic Failures
- [ ] Passwords hashed with bcrypt (min 10 rounds)
- [ ] JWT tokens with strong secret (min 256 bits)
- [ ] HTTPS enforced (no HTTP fallback)
- [ ] Sensitive data encrypted at rest
- [ ] TLS 1.2+ only (no TLS 1.0/1.1)

### A03: Injection
- [ ] SQL queries parameterized (no string concatenation)
- [ ] Input validation with schemas (Zod, Yup, etc.)
- [ ] NoSQL injection protection (if using MongoDB)
- [ ] Command injection protection (avoid exec/spawn with user input)
- [ ] LDAP injection protection (if using LDAP)

### A04: Insecure Design
- [ ] Security requirements documented in spec.md
- [ ] Threat modeling completed for sensitive features
- [ ] Secure defaults (opt-in for sensitive features)
- [ ] Rate limiting on authentication endpoints
- [ ] Account lockout after failed attempts

### A05: Security Misconfiguration
- [ ] Helmet.js configured (security headers)
- [ ] X-Content-Type-Options: nosniff
- [ ] X-Frame-Options: DENY (or SAMEORIGIN)
- [ ] Strict-Transport-Security header (HSTS)
- [ ] Error messages don't leak sensitive info
- [ ] Unused dependencies removed
- [ ] Default credentials changed (if any)
- [ ] Debug mode disabled in production

### A06: Vulnerable and Outdated Components
- [ ] Dependencies up-to-date (npm audit clean)
- [ ] No known CVEs (high/critical severity)
- [ ] Automated dependency scanning enabled (Dependabot)
- [ ] License compliance verified (no GPL conflicts)

### A07: Identification and Authentication Failures
- [ ] Password strength requirements (min 8 chars, complexity)
- [ ] Account lockout after failed attempts (max 5 in 15 min)
- [ ] Session timeout configured (30 min inactivity)
- [ ] Password reset secure (token expiration, one-time use)
- [ ] Multi-factor authentication available (optional for MVP)
- [ ] No default credentials (admin/admin, etc.)

### A08: Software and Data Integrity Failures
- [ ] Code signing (Git commit signatures verified)
- [ ] Package integrity (package-lock.json committed)
- [ ] Subresource Integrity (SRI) for CDN assets
- [ ] Secure CI/CD pipeline (no secrets in logs)
- [ ] Artifacts signed (if applicable)

### A09: Security Logging and Monitoring Failures
- [ ] Audit logs for sensitive operations (login, data export, deletion)
- [ ] Failed login attempts logged with IP/timestamp
- [ ] Security events monitored (suspicious activity)
- [ ] Log retention policy defined (90 days recommended)
- [ ] Logs protected (read-only, encrypted)
- [ ] Alerting configured for critical events

### A10: Server-Side Request Forgery (SSRF)
- [ ] URL validation before fetching external resources
- [ ] Whitelist allowed domains (no user-controlled URLs)
- [ ] No user-controlled redirects (or strict validation)
- [ ] DNS rebinding protection
- [ ] Timeout configured for external requests (max 5s)

## Additional Security Requirements

### Rate Limiting
- [ ] API rate limiting (10 req/min per user, 100 req/min per IP)
- [ ] Login rate limiting (5 attempts per 15 min)
- [ ] Password reset rate limiting (3 attempts per hour)
- [ ] CAPTCHA on sensitive forms (optional for MVP)

### CSRF Protection
- [ ] CSRF tokens on all state-changing operations (POST/PUT/DELETE)
- [ ] SameSite cookie attribute set (Strict or Lax)
- [ ] Double-submit cookie pattern (if not using sessions)
- [ ] Origin/Referer header validation

### XSS Protection
- [ ] Content-Security-Policy header configured (strict policy)
- [ ] X-XSS-Protection header enabled (1; mode=block)
- [ ] React/Vue automatic escaping (default behavior)
- [ ] No dangerouslySetInnerHTML (or sanitized with DOMPurify)
- [ ] User-generated content sanitized (markdown, rich text)

### Secrets Management
- [ ] No secrets committed to Git (.gitignore includes .env*)
- [ ] Environment variables for all sensitive data
- [ ] API keys rotated regularly (quarterly minimum)
- [ ] Secrets encrypted in CI/CD (GitHub Secrets, etc.)
- [ ] No hardcoded credentials in code

### Database Security
- [ ] Row Level Security (RLS) enabled (Supabase, PostgreSQL)
- [ ] Prepared statements (no dynamic SQL)
- [ ] Least privilege principle (app user != admin user)
- [ ] Database backups encrypted
- [ ] Connection strings not exposed (environment variables)

## RGPD Compliance

### Mandatory Requirements
- [ ] Cookie consent banner (mandatory EU)
- [ ] Privacy policy page (mandatory, /privacy route)
- [ ] Terms of service page (mandatory, /terms route)
- [ ] Data export API endpoint (RGPD Article 20 - portability)
- [ ] Data deletion API endpoint (RGPD Article 17 - right to be forgotten)
- [ ] Audit logs (who accessed/modified personal data)
- [ ] Data retention policy documented (e.g., 90 days inactive accounts)
- [ ] Subprocessors documented (Vercel, Supabase, Stripe, etc.)
- [ ] Data Processing Agreement (DPA) with subprocessors

### Optional (Recommended)
- [ ] Consent management (granular: analytics, marketing, functional)
- [ ] Data breach notification procedure (72h RGPD requirement)
- [ ] Privacy by design (data minimization)
- [ ] Anonymization/pseudonymization where applicable

## License & Legal Compliance

- [ ] All dependencies have permissive licenses (MIT, Apache 2.0, BSD)
- [ ] No GPL dependencies (unless product is also GPL)
- [ ] License file included (LICENSE.md)
- [ ] Copyright notices in source files (if required)
- [ ] Attribution for third-party code (README credits)

## Performance & Availability

- [ ] Rate limiting protects against DoS
- [ ] Database connection pooling configured
- [ ] Timeout configured for external APIs (max 10s)
- [ ] Graceful degradation (fallback if service down)
- [ ] Health check endpoint (/health or /api/health)

## Deployment Security

- [ ] Production environment variables separate from staging
- [ ] No .env files deployed (use platform secrets)
- [ ] Vercel/Netlify environment variables encrypted
- [ ] No Git credentials in deployment logs
- [ ] Automated security scans in CI/CD (this workflow)

---

## Instructions for Jules

**Auto-fix (if possible):**
- Add missing security headers (Helmet.js)
- Add rate limiting middleware (express-rate-limit)
- Fix parameterized queries (SQL injection)
- Add CSRF token skeleton (implementation may need manual completion)
- Add input validation schemas (Zod templates)
- Create .env.example (remove .env from Git)

**Manual review required:**
- Business logic vulnerabilities (authorization flaws)
- CORS configuration (business decision: which domains?)
- Rate limiting thresholds (business decision: 10 req/min OK?)
- RGPD data export/deletion endpoints (API design decision)
- Password policies (complexity requirements)
- Session timeout values (business decision)

**Report format:**
- JSON output: security-report.json
- Severity levels: Critical / High / Medium / Low / Info
- Include: File path, line number, description, recommendation
- Group by: OWASP category
- Compliance status: PASS / FAIL / WARNING / N/A
```

---

## 🔧 JULES API CONFIGURATION

### **Create File: `.github/jules-config.json`**

```json
{
  "version": "1.0",
  "security": {
    "enabled": true,
    "auto_fix": true,
    "scan_depth": "full",
    "owasp_compliance": true,
    "rgpd_compliance": true,
    "report_format": "json",
    "severity_threshold": "medium"
  },
  "scans": {
    "baseline": {
      "enabled": true,
      "auto_fix": true,
      "checklist": ".github/security-checklist.md",
      "files": ["src/**/*.{js,ts,jsx,tsx}", "pages/**/*.{js,ts,jsx,tsx}"],
      "exclude": ["node_modules", ".next", "dist", "build"]
    },
    "dependencies": {
      "enabled": true,
      "npm_audit": true,
      "cve_check": true,
      "license_check": true,
      "outdated_check": true
    },
    "rgpd": {
      "enabled": true,
      "check_consent": true,
      "check_privacy_policy": true,
      "check_data_export": true,
      "check_data_deletion": true,
      "check_audit_logs": true
    }
  },
  "notifications": {
    "slack": {
      "enabled": true,
      "webhook_secret": "SLACK_WEBHOOK",
      "notify_on": ["critical", "high"],
      "include_summary": true
    },
    "github": {
      "create_pr": true,
      "create_issues": true,
      "label": "security",
      "assignee": null
    }
  },
  "thresholds": {
    "max_issues_before_block": 10,
    "max_critical_before_block": 1,
    "auto_merge_if_fixed": false
  }
}
```

---

### **Jules Command Examples**

#### **Basic Security Scan:**
```bash
jules submit \
  --task="Security baseline OWASP compliance" \
  --checklist=.github/security-checklist.md \
  --auto-fix \
  --output=security-report.json \
  --async
```

#### **Full Security Audit:**
```bash
jules submit \
  --task="Full security audit: OWASP + dependencies + RGPD" \
  --depth=full \
  --config=.github/jules-config.json \
  --branch=security/audit-$(date +%Y%m%d) \
  --async
```

#### **RGPD Compliance Check:**
```bash
jules submit \
  --task="RGPD compliance verification" \
  --standard=RGPD \
  --report-format=legal \
  --output=compliance-rgpd.json \
  --async
```

#### **Dependency Audit:**
```bash
jules submit \
  --task="Dependency security audit: npm + CVE" \
  --scan-deps \
  --severity=high \
  --output=deps-audit.json \
  --async
```

#### **Wait for Completion:**
```bash
# Block until job completes (max 30 min)
jules wait --timeout=30m

# Check job status
jules jobs list --recent

# Get job logs
jules jobs logs <job-id>
```

---

## 🧪 TESTING SETUP

### **Test 1: Manual Jules Scan (5 min)**

```bash
# Create test project
mkdir -p ~/test-jules-security
cd ~/test-jules-security

# Init Git
git init
git remote add origin https://github.com/YOUR_USERNAME/test-jules-security.git

# Create simple vulnerable code
cat > app.js <<EOF
const express = require('express');
const app = express();

// VULNERABLE: SQL injection
app.get('/user/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ' + req.params.id;
  db.query(query, (err, result) => {
    res.json(result);
  });
});

// VULNERABLE: No CSRF protection
app.post('/update', (req, res) => {
  // Update without CSRF token
  res.json({ success: true });
});

app.listen(3000);
EOF

# Commit
git add app.js
git commit -m "test: vulnerable code"
git push origin main

# Run Jules scan
jules submit \
  --task="Security scan test project" \
  --auto-fix \
  --output=security-report.json \
  --async

# Wait for result
jules wait --timeout=5m

# Check report
cat security-report.json | jq '.'

# Expected output:
{
  "issues_found": 2,
  "issues_fixed": 1,
  "manual_review_needed": 1,
  "issues": [
    {
      "type": "SQL Injection",
      "severity": "Critical",
      "file": "app.js:6",
      "description": "User input concatenated directly into SQL query",
      "recommendation": "Use parameterized queries",
      "fixed": false
    },
    {
      "type": "Missing CSRF Protection",
      "severity": "High",
      "file": "app.js:13",
      "description": "POST endpoint without CSRF token validation",
      "recommendation": "Add csurf middleware",
      "fixed": true
    }
  ]
}
```

---

### **Test 2: GitHub Actions Workflow (10 min)**

```bash
# Continue from test project
cd ~/test-jules-security

# Create workflow directory
mkdir -p .github/workflows

# Copy security-checklist.md
cp /path/to/security-checklist.md .github/

# Create workflow file
cat > .github/workflows/jules-security-guardian.yml <<EOF
name: Jules Security Guardian

on:
  push:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Trigger Jules
        env:
          JULES_API_KEY: \${{ secrets.JULES_API_KEY }}
        run: |
          npm install -g @google/jules-cli
          jules submit --task="Security scan" --auto-fix --async
          jules wait --timeout=10m

      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: security-report.json
EOF

# Commit
git add .github/
git commit -m "feat: add Jules security workflow"
git push origin main

# Check GitHub Actions
# Go to: https://github.com/YOUR_USERNAME/test-jules-security/actions
# Verify: "Jules Security Guardian" workflow triggered
# Wait: ~5 min for completion
# Check: Artifact "security-report" uploaded
```

---

### **Test 3: Slack Notification (Optional - 5 min)**

```bash
# If SLACK_WEBHOOK configured:

# Create test with critical issue
cat > critical-test.js <<EOF
const password = "hardcoded-password-123"; // CRITICAL: Hardcoded secret
EOF

# Commit
git add critical-test.js
git commit -m "test: critical security issue"
git push origin main

# Check Slack channel
# Expected: Message within 5 min
🚨 CRITICAL: 1 security issue detected in YOUR_USERNAME/test-jules-security
   Repository: YOUR_USERNAME/test-jules-security
   Branch: main
   Critical Issues: 1
```

---

## 🐛 TROUBLESHOOTING

### **Issue 1: Jules CLI Not Found**

**Error:**
```bash
bash: jules: command not found
```

**Solution:**
```bash
# Verify npm global bin path
npm config get prefix
# Expected: /usr/local (or ~/.npm-global)

# Add to PATH (if missing)
echo 'export PATH="$PATH:$(npm config get prefix)/bin"' >> ~/.zshrc
source ~/.zshrc

# Reinstall Jules
npm uninstall -g @google/jules-cli
npm install -g @google/jules-cli

# Verify
jules --version
```

---

### **Issue 2: Authentication Failed**

**Error:**
```bash
❌ Jules authentication failed: Invalid credentials
```

**Solution:**
```bash
# Clear credentials
rm ~/.jules/credentials.json

# Re-authenticate
jules auth logout
jules auth login

# If still fails:
# → Check Google account has Jules access
# → Go to: https://myaccount.google.com/permissions
# → Verify "Jules CLI" app authorized
# → Revoke and re-authorize if needed
```

---

### **Issue 3: GitHub Actions Workflow Not Triggered**

**Problem:**
Push to main but workflow doesn't run

**Solution:**
```bash
# Check workflow file syntax
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
# Look for: "Invalid workflow file" error

# Validate YAML locally
npm install -g yaml-validator
yaml-validator .github/workflows/jules-security-guardian.yml

# Common issues:
# → Indentation errors (use 2 spaces, not tabs)
# → Missing quotes around ${{ secrets.XXX }}
# → Invalid job name (no spaces allowed)

# Fix and re-push:
git add .github/workflows/
git commit --amend --no-edit
git push --force
```

---

### **Issue 4: Jules API Rate Limit**

**Error:**
```bash
❌ Jules API rate limit exceeded (15/15 tasks used today)
```

**Solution:**
```bash
# Check usage
jules usage
# Output: Tasks used today: 15/15

# Option 1: Wait until reset (midnight UTC)
# Check reset time:
jules usage | grep "Next reset"

# Option 2: Upgrade to Jules Ultra
# Go to: https://jules.google/pricing
# Upgrade: $19.99/month → $124.99/month
# Quota: 15/day → unlimited

# Option 3: Reduce scan frequency
# Edit workflow: Change trigger from 'push' to 'schedule: daily'
```

---

### **Issue 5: Security Report Empty**

**Problem:**
`security-report.json` exists but has 0 issues (suspicious)

**Solution:**
```bash
# Check Jules logs
jules jobs logs <job-id>

# Common causes:
# 1. Checklist file not found
ls .github/security-checklist.md
# If missing: Create file (see "Security Checklist Template" above)

# 2. No files matched scan pattern
# Check jules-config.json:
"files": ["src/**/*.{js,ts,jsx,tsx}"]
# Verify files exist: ls src/

# 3. All issues auto-fixed
# Check report:
cat security-report.json | jq '.issues_fixed'
# If issues_fixed > 0: Check PR created by Jules

# 4. Scan didn't run (timeout)
# Check job status:
jules jobs list | grep "status"
# If "timeout": Increase --timeout=30m → --timeout=60m
```

---

### **Issue 6: SLACK_WEBHOOK Not Working**

**Problem:**
No Slack notifications despite critical issues

**Solution:**
```bash
# Test webhook manually
curl -X POST $SLACK_WEBHOOK \
  -H 'Content-Type: application/json' \
  -d '{"text": "Test message from Jules"}'

# If error: "invalid_payload"
# → Webhook URL incorrect
# → Get new webhook: https://api.slack.com/messaging/webhooks

# If error: "channel_not_found"
# → Webhook not connected to channel
# → Reconnect webhook to Slack channel

# Update GitHub Secret:
gh secret set SLACK_WEBHOOK --body "https://hooks.slack.com/services/..."

# Verify secret:
gh secret list | grep SLACK_WEBHOOK
```

---

## 📊 MONITORING & MAINTENANCE

### **Daily Checks (2 min)**

```bash
# Check Jules usage
jules usage
# Verify: Not close to daily limit (15/15)

# Check recent scans
jules jobs list --recent --limit=5
# Verify: All jobs "completed" (not "failed")

# Check GitHub Actions
# Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
# Verify: Latest workflow run = green checkmark
```

---

### **Weekly Tasks (10 min)**

```bash
# Review open security PRs
gh pr list --label security

# For each PR:
# → Review security-report.json
# → Approve auto-fixes
# → Create issues for manual items
# → Merge PR

# Update dependencies (monthly)
npm outdated
npm update
git commit -am "chore: update dependencies"
git push
# → Triggers Jules scan automatically
```

---

### **Monthly Audit (30 min)**

```bash
# Generate security trend report
# Collect all security-report.json from last 30 days
# Analyze:
# → Avg issues/scan
# → Most common vulnerabilities
# → Time to fix (issue detected → PR merged)

# Example analysis:
find .github/workflows/artifacts -name "security-report*.json" | \
  xargs jq -s '[.[] | {date: .scan_date, issues: .issues_found}]' | \
  jq 'group_by(.date) | map({date: .[0].date, total: map(.issues) | add})'

# Adjust security-checklist.md based on trends
# → Add checks for recurring issues
# → Remove checks for non-issues
```

---

## 📚 ADDITIONAL RESOURCES

**Official Docs:**
- Jules API: https://jules.google/docs/api
- Jules CLI: https://jules.google/docs/cli
- GitHub Actions: https://docs.github.com/actions

**Security Standards:**
- OWASP Top 10: https://owasp.org/Top10/
- OWASP API Security: https://owasp.org/www-project-api-security/
- RGPD Guide: https://www.cnil.fr/fr/reglement-europeen-protection-donnees
- CWE (Common Weakness Enumeration): https://cwe.mitre.org/

**Tools:**
- npm audit: https://docs.npmjs.com/cli/audit
- Snyk: https://snyk.io (alternative to Jules for dependencies)
- Helmet.js: https://helmetjs.github.io/
- express-rate-limit: https://www.npmjs.com/package/express-rate-limit

---

**Version:** 1.0
**Last Updated:** 2025-10-07
**Maintainer:** archon-orchestrator team

*Jules Security Guardian - Automated security for multi-client workflows* 🔒
