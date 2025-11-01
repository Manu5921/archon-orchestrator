/**
 * Idempotency handling for Stripe webhooks
 * Prevents duplicate processing of the same event
 */

/**
 * In-memory cache for processed webhook events
 * In production, replace this with Redis or database storage
 *
 * Key: event_id
 * Value: { processedAt: timestamp, result: any }
 */
const processedEvents = new Map<
  string,
  { processedAt: number; result: any }
>();

/**
 * Cache TTL: 24 hours (Stripe recommends keeping processed events for 24h)
 */
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Check if webhook event has already been processed
 *
 * @param eventId - Stripe event ID
 * @returns true if event was already processed, false otherwise
 *
 * @example
 * if (await isEventProcessed(event.id)) {
 *   console.log('Event already processed, skipping');
 *   return { received: true, duplicate: true };
 * }
 */
export async function isEventProcessed(eventId: string): Promise<boolean> {
  const cached = processedEvents.get(eventId);

  if (!cached) {
    return false;
  }

  // Check if cache entry is still valid
  const now = Date.now();
  if (now - cached.processedAt > CACHE_TTL_MS) {
    // Expired, remove from cache
    processedEvents.delete(eventId);
    return false;
  }

  return true;
}

/**
 * Mark webhook event as processed
 *
 * @param eventId - Stripe event ID
 * @param result - Processing result (optional)
 *
 * @example
 * await markEventAsProcessed(event.id, { userId, subscriptionId });
 */
export async function markEventAsProcessed(
  eventId: string,
  result?: any
): Promise<void> {
  processedEvents.set(eventId, {
    processedAt: Date.now(),
    result,
  });

  // Cleanup old entries (keep cache size manageable)
  cleanupExpiredEvents();
}

/**
 * Get result of previously processed event
 *
 * @param eventId - Stripe event ID
 * @returns Processing result if available, null otherwise
 */
export async function getProcessedEventResult(
  eventId: string
): Promise<any | null> {
  const cached = processedEvents.get(eventId);

  if (!cached) {
    return null;
  }

  // Check if still valid
  const now = Date.now();
  if (now - cached.processedAt > CACHE_TTL_MS) {
    processedEvents.delete(eventId);
    return null;
  }

  return cached.result;
}

/**
 * Cleanup expired cache entries
 */
function cleanupExpiredEvents(): void {
  const now = Date.now();
  const expired: string[] = [];

  for (const [eventId, cached] of processedEvents.entries()) {
    if (now - cached.processedAt > CACHE_TTL_MS) {
      expired.push(eventId);
    }
  }

  for (const eventId of expired) {
    processedEvents.delete(eventId);
  }
}

/**
 * Idempotent wrapper for webhook handler functions
 * Ensures function is executed only once per event ID
 *
 * @param eventId - Stripe event ID
 * @param handler - Async function to execute
 * @returns Handler result
 *
 * @example
 * await withIdempotency(event.id, async () => {
 *   await updateDatabase(userId, data);
 *   await sendEmail(userId);
 *   return { success: true };
 * });
 */
export async function withIdempotency<T>(
  eventId: string,
  handler: () => Promise<T>
): Promise<T> {
  // Check if already processed
  if (await isEventProcessed(eventId)) {
    const cachedResult = await getProcessedEventResult(eventId);
    console.log(`Event ${eventId} already processed, returning cached result`);
    return cachedResult as T;
  }

  // Execute handler
  const result = await handler();

  // Mark as processed
  await markEventAsProcessed(eventId, result);

  return result;
}

/**
 * Clear all processed events cache
 * Useful for testing
 */
export function clearProcessedEventsCache(): void {
  processedEvents.clear();
}

/**
 * Get cache statistics
 * Useful for monitoring
 */
export function getCacheStats(): {
  totalEvents: number;
  validEvents: number;
  expiredEvents: number;
} {
  const now = Date.now();
  let validEvents = 0;
  let expiredEvents = 0;

  for (const cached of processedEvents.values()) {
    if (now - cached.processedAt > CACHE_TTL_MS) {
      expiredEvents++;
    } else {
      validEvents++;
    }
  }

  return {
    totalEvents: processedEvents.size,
    validEvents,
    expiredEvents,
  };
}

/**
 * PRODUCTION NOTE:
 *
 * This implementation uses in-memory cache, which works for single-instance deployments
 * but will NOT work correctly in multi-instance / serverless environments.
 *
 * For production with multiple instances, replace with:
 *
 * 1. **Redis** (recommended):
 *    - Use SET NX EX commands for atomic check-and-set
 *    - TTL handled automatically by Redis
 *
 * 2. **Database** (PostgreSQL/MySQL):
 *    - Create `webhook_events` table with unique constraint on `event_id`
 *    - Use INSERT ... ON CONFLICT DO NOTHING for atomic operations
 *
 * 3. **Vercel KV / Upstash** (serverless):
 *    - Built on Redis, serverless-friendly
 *    - Example: https://vercel.com/docs/storage/vercel-kv
 *
 * Example Redis implementation:
 *
 * ```typescript
 * import { createClient } from 'redis';
 * const redis = createClient({ url: process.env.REDIS_URL });
 *
 * export async function isEventProcessed(eventId: string): Promise<boolean> {
 *   const exists = await redis.exists(`webhook:${eventId}`);
 *   return exists === 1;
 * }
 *
 * export async function markEventAsProcessed(eventId: string, result: any): Promise<void> {
 *   await redis.set(`webhook:${eventId}`, JSON.stringify(result), {
 *     EX: 86400, // 24 hours TTL
 *     NX: true,  // Only set if not exists
 *   });
 * }
 * ```
 */
