/**
 * URL validation utilities for security
 * Prevents Open Redirect vulnerabilities
 */

/**
 * Allowed domains for redirect URLs (configured per project)
 * Add your app domains here
 */
const ALLOWED_DOMAINS = [
  process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, ''),
  'localhost',
  '127.0.0.1',
].filter(Boolean);

/**
 * Validate if a URL is safe for redirects
 * Prevents Open Redirect attacks
 *
 * @param url - URL to validate
 * @param allowedDomains - Optional array of allowed domains (defaults to ALLOWED_DOMAINS)
 * @returns true if URL is safe, false otherwise
 *
 * @example
 * import { isValidRedirectUrl } from '@/lib/shared/utils/validate-url';
 *
 * if (!isValidRedirectUrl(resetLink)) {
 *   throw new Error('Invalid redirect URL');
 * }
 */
export function isValidRedirectUrl(
  url: string,
  allowedDomains: string[] = ALLOWED_DOMAINS
): boolean {
  try {
    const parsed = new URL(url);

    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }

    // Check if domain is in allowed list
    const hostname = parsed.hostname;
    return allowedDomains.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    // Invalid URL format
    return false;
  }
}

/**
 * Sanitize URL for email templates
 * Returns safe URL or throws error
 *
 * @param url - URL to sanitize
 * @param context - Context for error message (e.g., 'password reset')
 * @returns Sanitized URL
 * @throws Error if URL is invalid
 *
 * @example
 * import { sanitizeEmailUrl } from '@/lib/shared/utils/validate-url';
 *
 * const safeResetLink = sanitizeEmailUrl(resetLink, 'password reset');
 */
export function sanitizeEmailUrl(url: string, context: string = 'redirect'): string {
  if (!isValidRedirectUrl(url)) {
    throw new Error(
      `Invalid ${context} URL: must point to an allowed domain (${ALLOWED_DOMAINS.join(', ')})`
    );
  }

  return url;
}

/**
 * Validate relative URL (starts with /)
 *
 * @param path - Path to validate
 * @returns true if valid relative path, false otherwise
 *
 * @example
 * isValidRelativePath('/dashboard') // true
 * isValidRelativePath('//evil.com') // false (protocol-relative URL)
 * isValidRelativePath('javascript:alert(1)') // false
 */
export function isValidRelativePath(path: string): boolean {
  // Must start with single /
  if (!path.startsWith('/') || path.startsWith('//')) {
    return false;
  }

  // No protocol-like patterns
  if (path.includes(':')) {
    return false;
  }

  return true;
}

/**
 * Get safe redirect URL
 * Returns URL if safe, fallback URL otherwise
 *
 * @param url - URL to validate
 * @param fallbackUrl - Fallback URL if validation fails (default: '/')
 * @returns Safe URL
 *
 * @example
 * const safeUrl = getSafeRedirectUrl(userProvidedUrl, '/dashboard');
 */
export function getSafeRedirectUrl(url: string, fallbackUrl: string = '/'): string {
  if (isValidRedirectUrl(url)) {
    return url;
  }

  if (isValidRelativePath(url)) {
    return url;
  }

  console.warn(`Unsafe redirect URL detected: ${url}, using fallback: ${fallbackUrl}`);
  return fallbackUrl;
}
