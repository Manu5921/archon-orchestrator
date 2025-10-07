/**
 * Capabilities Probe for Archon REST API
 * Détecte les endpoints disponibles au démarrage
 */

/**
 * @typedef {Object} Capabilities
 * @property {boolean} ragQuery
 * @property {boolean} artifacts
 * @property {boolean} tasks
 * @property {boolean} events
 */

/**
 * Probe des capacités de l'API Archon avec RAG document count gate
 * @param {string} base - Base URL de l'API
 * @returns {Promise<Capabilities>}
 */
export async function probeCapabilities(base) {
  async function exists(method, path) {
    try {
      const res = await fetch(base + path, { 
        method, 
        headers: { Accept: "application/json" },
        // Timeout court pour probe
        signal: AbortSignal.timeout(2000)
      });
      // 200/204 → OK ; 405 → probablement OK par autre méthode ; 404 → absent
      return res.status !== 404;
    } catch {
      return false;
    }
  }

  console.log(`🔍 Probing Archon capabilities at ${base}...`);

  const [ragPost, ragGet, artifacts, tasks, events] = await Promise.all([
    exists("POST", "/rag/query"),
    exists("GET", "/rag/query?dry_run=1"),
    exists("GET", "/artifacts?limit=1"),
    exists("GET", "/tasks?limit=1"),
    exists("GET", "/events?limit=1"),
  ]);

  // RAG capability gating: check if documents exist
  let ragQuery = ragPost || ragGet;
  let ragDocCount = 'unavailable';
  
  if (ragQuery) {
    try {
      // Test with minimal query to check document presence
      const testRes = await fetch(base + '/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'test', top_k: 1 }),
        signal: AbortSignal.timeout(3000)
      });
      
      if (testRes.ok) {
        const testData = await testRes.json();
        const hasResults = (testData.results && testData.results.length > 0) ||
                          (testData.answers && testData.answers.length > 0);
        ragQuery = hasResults;
        ragDocCount = hasResults ? 'available' : 'empty';
      } else {
        ragQuery = false;
        ragDocCount = 'error';
      }
    } catch (ragError) {
      console.warn(`RAG document test failed: ${ragError.message}`);
      ragQuery = false; // Gate closed if test fails
      ragDocCount = 'test_failed';
    }
  }

  const capabilities = {
    ragQuery,
    ragDocCount,
    artifacts,
    tasks,
    events,
  };

  console.log(`✅ Capabilities detected:`, capabilities);
  return capabilities;
}

/**
 * Cache des capacités (éviter probe à chaque appel)
 */
let cachedCapabilities = null;

/**
 * Get capabilities avec cache
 */
export async function getCapabilities(base = "http://localhost:3737/api") {
  if (!cachedCapabilities) {
    cachedCapabilities = await probeCapabilities(base);
  }
  return cachedCapabilities;
}

/**
 * Reset cache (pour tests)
 */
export function resetCapabilitiesCache() {
  cachedCapabilities = null;
}