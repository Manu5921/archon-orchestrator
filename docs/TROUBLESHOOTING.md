# 🚨 TROUBLESHOOTING - Archon Orchestrator

Diagnostic et solutions pour problèmes courants.

---

## 📋 PROBLÈMES COURANTS

### 1. MCP Ne Répond Pas

**Symptômes:**
- `/mcp archon` timeout
- Commands MCP ne fonctionnent pas

**Diagnostic:**
```bash
# Vérifier MCP server
curl -s http://localhost:8051/mcp

# Vérifier configuration
cat .mcp.json
```

**Solutions:**
```bash
# Si server down
cd /Users/manu/Documents/DEV/archon && make dev

# Si configuration wrong
# Voir ../RESTART-GUIDE-COMPLET.md
```

---

### 2. Services Ne Démarrent Pas

**Symptômes:**
- `curl localhost:3737` échoue
- Archon UI inaccessible

**Diagnostic:**
```bash
# Vérifier tous services
curl -s http://localhost:3737 | head -2
curl -s http://localhost:8181/health
curl -s http://localhost:8051/mcp
curl -s http://localhost:7777/health
```

**Solutions:**
→ Voir [../RESTART-GUIDE-COMPLET.md](../RESTART-GUIDE-COMPLET.md)

---

### 3. Build Échoue

**Symptômes:**
- `pnpm run build` erreurs TypeScript
- Compilation failed

**Diagnostic:**
```bash
# Build avec logs détaillés
pnpm run build 2>&1 | tee build.log
cat build.log

# Type check seul
pnpm tsc --noEmit
```

**Solutions:**
```bash
# Clean reinstall
rm -rf node_modules package-lock.json
pnpm install

# Vérifier TypeScript version
pnpm list typescript  # Should be 5.x

# Check missing types
pnpm install --save-dev @types/node @types/jest
```

**Validation continue:**
→ Voir [ZERO-TRUST.md](./ZERO-TRUST.md)

---

### 4. Tests Échouent

**Symptômes:**
- `pnpm run test` failures
- Coverage insuffisante

**Diagnostic:**
```bash
# Tests avec verbose
pnpm run test --verbose 2>&1 | tee test.log

# Coverage report
pnpm run test:coverage
```

**Solutions:**
```bash
# Identifier tests failing
grep "FAIL" test.log

# Run specific test
pnpm run test -- --testNamePattern="nom-test"

# Update snapshots si nécessaire
pnpm run test -- -u
```

---

### 5. Gemini Bridge Timeout

**Symptômes:**
- Smart Review timeout
- `curl localhost:7777` échoue

**Diagnostic:**
```bash
# Vérifier Gemini Bridge
curl -s http://localhost:7777/health

# Check process
ps aux | grep "setup-gemini-bridge"
```

**Solutions:**
```bash
# Restart Gemini Bridge
cd /Users/manu/Documents/DEV/archon-orchestrator
node setup-gemini-bridge.js setup &

# Test Bridge
node setup-gemini-bridge.js test 7777
```

---

### 6. Jules MCP Ne Répond Pas

**Symptômes:**
- `/mcp jules` timeout
- Jules tasks not working

**Diagnostic:**
```bash
# Vérifier Jules MCP
curl -s http://localhost:8055/health

# Check Jules process
ps aux | grep jules
```

**Solutions:**
→ Voir [WORKFLOW-GUIDE.md § Jules Hybrid](./WORKFLOW-GUIDE.md)

---

### 7. Context7 Connection Failed

**Symptômes:**
- `/mcp context7` timeout
- Library resolution fails

**Diagnostic:**
```bash
# Test connection
/mcp context7 connection_test

# Check API key
echo $CONTEXT7_API_KEY
```

**Solutions:**
```bash
# Vérifier API key dans env
cat ~/.zshrc | grep CONTEXT7_API_KEY

# Test manuel
curl -H "Authorization: Bearer $CONTEXT7_API_KEY" https://mcp.context7.com/mcp
```

---

## 🔧 COMMANDES DIAGNOSTIC

### Health Check Complet

```bash
/mcp archon health_check_all
/mcp archon get_services_status
/mcp archon diagnose_system
/mcp archon test_all_integrations
```

---

### Logs Services

```bash
# Docker logs
./docker-start.sh logs

# Service spécifique
./docker-start.sh logs archon-api

# Mode watch
./docker-start.sh logs --follow
```

---

### Auto-Repair

```bash
# Tentative réparation auto
/mcp archon auto_repair_services

# Si échec, restart manuel
# Voir RESTART-GUIDE-COMPLET.md
```

---

## 📞 ESCALATION

**Si problème persiste après troubleshooting:**

1. Consulter [../RESTART-GUIDE-COMPLET.md](../RESTART-GUIDE-COMPLET.md)
2. Vérifier [ZERO-TRUST.md](./ZERO-TRUST.md) pour validation
3. Review [WORKFLOW-GUIDE.md](./WORKFLOW-GUIDE.md) pour workflows

**En dernier recours:**
- Restart complet système
- Clean install dependencies
- Verify environment variables

---

**Version:** 1.0
**Date:** 2025-10-04
