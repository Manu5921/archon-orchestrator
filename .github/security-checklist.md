# Security Checklist Template - OWASP + RGPD + CVE

**Version:** 1.0.0
**Date:** 2025-10-07
**Usage:** Template pour audits sécurité Jules Security Guardian

---

## 🎯 OWASP Top 10 (2021) Compliance

### A01:2021 – Broken Access Control

- [ ] **Authentication Required:** Routes sensibles protégées (middleware auth)
- [ ] **Role-Based Access Control (RBAC):** Users ne voient que leurs données
- [ ] **Supabase RLS Enabled:** Row Level Security policies actives sur toutes tables
- [ ] **JWT Validation:** Tokens validés côté serveur (pas seulement client)
- [ ] **API Rate Limiting:** 10 req/min par user (protection brute-force)

**Automated Fix:** `middleware.ts` protection + Supabase RLS policies

---

### A02:2021 – Cryptographic Failures

- [ ] **HTTPS Enforced:** Toutes connexions en TLS 1.2+ (Vercel default)
- [ ] **Secrets Management:** API keys dans `.env.local` (jamais committées)
- [ ] **Password Hashing:** bcrypt/argon2 (Supabase Auth default)
- [ ] **Sensitive Data Encryption:** PII chiffrée at-rest (Supabase encryption)
- [ ] **No Credentials in Logs:** Console.log ne contient jamais tokens/passwords

**Automated Fix:** Vérification `.env*` dans `.gitignore` + log sanitization

---

### A03:2021 – Injection

- [ ] **SQL Injection Prevention:** Supabase prepared statements (parameterized queries)
- [ ] **NoSQL Injection Prevention:** Input sanitization (validator.js)
- [ ] **Command Injection Prevention:** Pas d'exécution shell côté serveur
- [ ] **LDAP Injection Prevention:** N/A (pas d'LDAP dans stack)
- [ ] **Input Validation:** Zod schemas côté client ET serveur

**Automated Fix:** Ajout validation Zod + sanitization middleware

---

### A04:2021 – Insecure Design

- [ ] **Threat Modeling:** ADR documenté (Architecture Decision Records)
- [ ] **Secure Development Lifecycle:** Tests sécurité automatisés (GitHub Actions)
- [ ] **Rate Limiting:** Protection DoS (10 req/min)
- [ ] **Business Logic Validation:** Workflows multi-étapes validés
- [ ] **Fail-Safe Defaults:** Default deny (pas default allow)

**Automated Fix:** Architecture review + fail-safe patterns

---

### A05:2021 – Security Misconfiguration

- [ ] **Default Credentials Changed:** Pas de `admin/admin`
- [ ] **Error Messages:** Pas d'infos sensibles dans 500 errors (stack traces hidden)
- [ ] **Security Headers:** Helmet.js configuré (CSP, HSTS, X-Frame-Options)
- [ ] **Unnecessary Features Disabled:** Pas de debug mode en production
- [ ] **CORS Policy:** Whitelist domains (pas `*`)

**Automated Fix:** `helmet.js` installation + CORS configuration

---

### A06:2021 – Vulnerable and Outdated Components

- [ ] **Dependency Scanning:** `npm audit` clean (0 vulnerabilities)
- [ ] **Automated Updates:** Dependabot enabled (GitHub)
- [ ] **Component Inventory:** `package.json` maintenu à jour
- [ ] **CVE Monitoring:** Jules scan quotidien (GitHub Actions cron)
- [ ] **Unmaintained Libraries:** Pas de libs abandonnées (>2 ans)

**Automated Fix:** `npm audit fix` + Dependabot PRs

---

### A07:2021 – Identification and Authentication Failures

- [ ] **Multi-Factor Authentication (MFA):** Supabase Auth MFA enabled (optionnel user)
- [ ] **Session Management:** JWT expiration 1h, refresh tokens 7j
- [ ] **Brute-Force Protection:** Rate limiting 10 login attempts/min
- [ ] **Password Strength:** Minimum 8 chars, complexité validée (Supabase default)
- [ ] **Session Fixation Prevention:** New session ID après login

**Automated Fix:** Rate limiting login endpoint + session configuration

---

### A08:2021 – Software and Data Integrity Failures

- [ ] **CI/CD Pipeline Secure:** GitHub Actions secrets encrypted
- [ ] **Code Signing:** Git commits signés (optionnel)
- [ ] **Update Verification:** `npm install` lock file integrity check
- [ ] **Serialization Security:** Pas de `eval()` ou `Function()` constructors
- [ ] **Subresource Integrity (SRI):** CDN scripts avec integrity hash

**Automated Fix:** `.nvmrc` + lock file validation GitHub Action

---

### A09:2021 – Security Logging and Monitoring Failures

- [ ] **Audit Logs:** Toutes actions critiques loggées (login, data modification)
- [ ] **Log Retention:** 90 jours minimum (Vercel logs)
- [ ] **Anomaly Detection:** Jules scan quotidien détecte patterns suspects
- [ ] **Alerting:** Slack notification si critical issues
- [ ] **Log Sanitization:** Pas de PII dans logs

**Automated Fix:** Logging middleware + Slack webhook configuration

---

### A10:2021 – Server-Side Request Forgery (SSRF)

- [ ] **URL Validation:** Whitelist domains pour external requests
- [ ] **Network Segmentation:** Pas d'accès intranet depuis API publique
- [ ] **Response Validation:** External API responses validées
- [ ] **Metadata Service Protection:** Vercel functions isolées
- [ ] **DNS Rebinding Protection:** URL parsing avec `new URL()`

**Automated Fix:** URL validation helper + fetch wrapper

---

## 🇪🇺 RGPD (General Data Protection Regulation) Compliance

### Article 6 – Lawfulness of Processing

- [ ] **Consent Mechanism:** Cookie consent banner (user opt-in)
- [ ] **Legal Basis Documented:** Privacy Policy page explicite
- [ ] **Purpose Limitation:** Data collectée uniquement pour review management
- [ ] **Data Minimization:** Pas de collecte excessive (email + restaurant name only)

**Automated Fix:** Cookie consent component + privacy policy template

---

### Article 15-20 – Data Subject Rights

- [ ] **Right to Access:** User dashboard avec export data (JSON)
- [ ] **Right to Rectification:** Edit profile endpoint
- [ ] **Right to Erasure (Right to be Forgotten):** Delete account endpoint
- [ ] **Right to Data Portability:** Export reviews + responses (CSV/JSON)
- [ ] **Right to Object:** Opt-out analytics tracking

**Automated Fix:** Data export API route + delete account flow

---

### Article 25 – Data Protection by Design and by Default

- [ ] **Privacy by Design:** Supabase RLS enabled by default
- [ ] **Pseudonymization:** User IDs (pas emails) dans analytics
- [ ] **Encryption at Rest:** Supabase PostgreSQL encryption
- [ ] **Encryption in Transit:** HTTPS enforced (Vercel)
- [ ] **Access Controls:** RLS policies restrictives

**Automated Fix:** RLS policy templates + anonymization helpers

---

### Article 32 – Security of Processing

- [ ] **Risk Assessment:** Threat model documenté (ADR)
- [ ] **Technical Measures:** HTTPS + RLS + rate limiting
- [ ] **Organizational Measures:** Security checklist process (ce document)
- [ ] **Regular Testing:** Jules scan quotidien + manual review
- [ ] **Incident Response Plan:** Breach notification workflow (48h)

**Automated Fix:** Security documentation + incident response template

---

### Article 33-34 – Personal Data Breach Notification

- [ ] **Breach Detection:** Logging + monitoring Jules scan
- [ ] **72-Hour Notification:** Process documenté (email template CNIL)
- [ ] **Data Breach Register:** Incident log table (Supabase)
- [ ] **User Notification:** Automated email si breach affects user
- [ ] **Authority Notification:** CNIL contact process

**Automated Fix:** Breach detection webhook + notification templates

---

## 🛡️ CVE & Dependency Scanning

### npm Dependencies

- [ ] **Zero High/Critical Vulnerabilities:** `npm audit` clean
- [ ] **Automated Updates:** Dependabot PRs merged dans 48h
- [ ] **License Compliance:** Pas de GPL/AGPL libs (MIT/Apache only)
- [ ] **Unmaintained Dependencies:** Max 6 mois depuis dernière release
- [ ] **Dev Dependencies Isolation:** `devDependencies` pas en production

**Automated Fix:** `npm audit fix --force` + Dependabot config

---

### Supabase Security

- [ ] **RLS Policies Active:** Toutes tables ont policies
- [ ] **Service Key Protected:** Jamais exposée côté client
- [ ] **API Keys Rotation:** Keys rotated tous les 90 jours
- [ ] **Database Backups:** Automated daily backups (Supabase Pro)
- [ ] **Connection Pooling:** pgBouncer enabled (performance + security)

**Automated Fix:** RLS audit script + key rotation reminder

---

### Vercel Security

- [ ] **Environment Variables Encrypted:** Secrets dans Vercel dashboard
- [ ] **Preview Deployments Protected:** Authentication required
- [ ] **Custom Domains HTTPS:** Auto-renewing SSL certificates
- [ ] **DDoS Protection:** Vercel Edge Network (default)
- [ ] **Log Retention:** 90 jours (Vercel Pro)

**Automated Fix:** Vercel security headers configuration

---

## 🚀 Custom Security Rules (Restaurant SaaS Context)

### Google Business Profile API Security

- [ ] **OAuth Token Refresh:** Automatic refresh avant expiration (30 days)
- [ ] **API Rate Limiting:** Respect Google quotas (1000 req/day)
- [ ] **Scope Minimization:** Only `businessprofileapi.readonly` + `write`
- [ ] **Token Storage:** Encrypted dans Supabase (AES-256)
- [ ] **Revocation Flow:** User peut déconnecter Google account

**Automated Fix:** OAuth refresh middleware + scope validation

---

### Claude API Security

- [ ] **API Key Rotation:** Monthly rotation (Anthropic dashboard)
- [ ] **Rate Limiting:** 50 req/min (Anthropic tier limit)
- [ ] **PII Sanitization:** Pas de customer emails envoyés à Claude
- [ ] **Prompt Injection Prevention:** User input sanitized avant AI call
- [ ] **Response Validation:** AI responses validées avant publish

**Automated Fix:** API key rotation reminder + input sanitization

---

### Review Data Security

- [ ] **Public Review Data Only:** Pas de PII customer (Google ToS compliant)
- [ ] **Response Draft Mode:** Pas d'auto-publish (Human-in-the-Loop principe)
- [ ] **Review Sync Logging:** Audit trail de toutes syncs Google
- [ ] **Data Retention Policy:** Reviews archivées après 2 ans
- [ ] **Cache Invalidation:** Stale data cleared après 24h

**Automated Fix:** Data retention job + cache headers

---

## 📊 Jules Scan Output Format

**Expected JSON Structure:**

```json
{
  "scan_date": "2025-10-07T14:30:00Z",
  "repository": "username/reviewrescue",
  "branch": "security/auto-scan-20251007-143000",
  "issues_found": 12,
  "critical_count": 2,
  "high_count": 4,
  "medium_count": 6,
  "low_count": 0,
  "issues_fixed": 8,
  "manual_review_needed": [
    {
      "issue": "RGPD Cookie Consent Missing",
      "severity": "High",
      "file": "app/layout.tsx",
      "description": "No cookie consent banner detected for RGPD compliance",
      "recommendation": "Add CookieConsent component with opt-in mechanism"
    }
  ],
  "fixes_applied": [
    "Added Helmet.js security headers (CSP, HSTS)",
    "Configured CORS whitelist (removed wildcard *)",
    "Added rate limiting middleware (10 req/min)",
    "Sanitized error messages (removed stack traces)"
  ],
  "compliance": {
    "owasp_top_10": {
      "A01_broken_access_control": "Pass",
      "A02_cryptographic_failures": "Pass",
      "A03_injection": "Pass",
      "A04_insecure_design": "Warning",
      "A05_security_misconfiguration": "Pass",
      "A06_vulnerable_components": "Pass",
      "A07_auth_failures": "Pass",
      "A08_integrity_failures": "Pass",
      "A09_logging_failures": "Warning",
      "A10_ssrf": "Pass"
    },
    "rgpd": {
      "consent_mechanism": "Fail",
      "data_subject_rights": "Pass",
      "privacy_by_design": "Pass",
      "security_measures": "Pass",
      "breach_notification": "Pass"
    },
    "cve_scan": {
      "npm_audit": "Pass",
      "high_vulnerabilities": 0,
      "critical_vulnerabilities": 0,
      "outdated_dependencies": 3
    }
  }
}
```

---

## ✅ Usage Instructions

### 1. Initial Setup (One-Time)

```bash
# Copy template to new project
cp .github/security-checklist.md ~/clients/reviewrescue/.github/

# Customize for project specifics
# Edit sections marked with "N/A" or "Optionnel"
```

---

### 2. Jules Scan Trigger

```bash
# Manual scan
jules submit \
  --task="Security audit: OWASP Top 10 + npm dependencies + RGPD compliance" \
  --checklist=.github/security-checklist.md \
  --auto-fix \
  --output=security-report.json \
  --async

# Wait for completion (max 30 min)
jules wait --timeout=30m
```

---

### 3. Review Results

```bash
# Parse report
cat security-report.json | jq '.'

# Check critical issues
cat security-report.json | jq '.critical_count'

# List manual review items
cat security-report.json | jq '.manual_review_needed[]'
```

---

### 4. Approve Fixes

```bash
# Review PR created by Jules
gh pr view security/auto-scan-20251007-143000

# Approve if acceptable
gh pr review --approve

# Merge
gh pr merge --squash
```

---

## 🔄 Maintenance Schedule

- **Daily:** Automated Jules scan via GitHub Actions cron (2am UTC)
- **Weekly:** Manual review of security PRs (15 min)
- **Monthly:** API key rotation (Claude + Google OAuth)
- **Quarterly:** Full security audit (1h)
- **Yearly:** Threat model update + penetration test

---

**Version:** 1.0.0
**Last Updated:** 2025-10-07
**Maintained by:** Jules Security Guardian
**Template License:** MIT
