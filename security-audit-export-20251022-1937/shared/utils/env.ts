/**
 * Environment variables validation utilities
 * Prevents runtime errors from missing environment variables
 */

/**
 * Get required environment variable
 * Throws error if variable is not set
 *
 * @param key - Environment variable key
 * @param context - Optional context for error message
 * @returns Environment variable value
 * @throws Error if variable is not set
 *
 * @example
 * const apiKey = getRequiredEnv('STRIPE_SECRET_KEY', 'Stripe configuration');
 */
export function getRequiredEnv(key: string, context?: string): string {
  const value = process.env[key];

  if (!value) {
    const message = context
      ? `Missing required environment variable ${key} (${context})`
      : `Missing required environment variable ${key}`;

    throw new Error(message);
  }

  return value;
}

/**
 * Get optional environment variable with default
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Environment variable value or default
 *
 * @example
 * const appName = getOptionalEnv('NEXT_PUBLIC_APP_NAME', 'My App');
 */
export function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

/**
 * Validate multiple environment variables at once
 * Throws error with all missing variables listed
 *
 * @param keys - Array of required environment variable keys
 * @param context - Optional context for error message
 * @returns Object with all environment variables
 * @throws Error if any variable is missing
 *
 * @example
 * const env = validateEnvVars(
 *   ['DATABASE_URL', 'JWT_SECRET', 'SMTP_HOST'],
 *   'Application configuration'
 * );
 */
export function validateEnvVars(
  keys: string[],
  context?: string
): Record<string, string> {
  const missing: string[] = [];
  const result: Record<string, string> = {};

  for (const key of keys) {
    const value = process.env[key];
    if (!value) {
      missing.push(key);
    } else {
      result[key] = value;
    }
  }

  if (missing.length > 0) {
    const message = context
      ? `Missing required environment variables (${context}): ${missing.join(', ')}`
      : `Missing required environment variables: ${missing.join(', ')}`;

    throw new Error(message);
  }

  return result;
}

/**
 * Check if environment variable is set
 *
 * @param key - Environment variable key
 * @returns true if set, false otherwise
 *
 * @example
 * if (isEnvSet('FEATURE_FLAG_BETA')) {
 *   enableBetaFeatures();
 * }
 */
export function isEnvSet(key: string): boolean {
  return Boolean(process.env[key]);
}

/**
 * Get environment variable as boolean
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 * @returns Boolean value
 *
 * @example
 * const isDevelopment = getEnvBoolean('IS_DEVELOPMENT', false);
 */
export function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Get environment variable as number
 *
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set or invalid
 * @returns Number value
 *
 * @example
 * const port = getEnvNumber('PORT', 3000);
 */
export function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate environment variables on application startup
 * Call this early in your application lifecycle
 *
 * @param config - Configuration object with required and optional keys
 * @throws Error if required variables are missing
 *
 * @example
 * validateEnvOnStartup({
 *   required: ['DATABASE_URL', 'JWT_SECRET'],
 *   optional: {
 *     PORT: '3000',
 *     NODE_ENV: 'development'
 *   }
 * });
 */
export function validateEnvOnStartup(config: {
  required: string[];
  optional?: Record<string, string>;
}): void {
  const { required, optional = {} } = config;

  // Validate required
  validateEnvVars(required, 'Application startup');

  // Set optional defaults
  for (const [key, defaultValue] of Object.entries(optional)) {
    if (!process.env[key]) {
      console.warn(`Environment variable ${key} not set, using default: ${defaultValue}`);
    }
  }

  console.log('✅ Environment variables validated successfully');
}
