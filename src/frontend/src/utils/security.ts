/**
 * Security utility module — defense-in-depth helpers.
 * Used across the app for input sanitization, email validation, and URL safety.
 */

/** Characters that can be used for Unicode direction spoofing or injection */
const DIRECTION_OVERRIDES_RE = /[\u202E\u200F\u200E]/g;

// Build null-byte regex via constructor to avoid ESLint/TSC control-char complaints
const NULL_BYTES_RE = new RegExp(String.fromCharCode(0), "g");

const MAX_SAFE_INPUT = 100_000;

/**
 * Sanitizes a user-supplied string:
 * - Trims whitespace
 * - Truncates to maxLength
 * - Removes null bytes (U+0000)
 * - Removes Unicode direction-override characters (U+202E, U+200F, U+200E)
 */
export function sanitizeInput(value: string, maxLength: number): string {
  return value
    .replace(NULL_BYTES_RE, "")
    .replace(DIRECTION_OVERRIDES_RE, "")
    .trim()
    .slice(0, Math.min(maxLength, MAX_SAFE_INPUT));
}

/**
 * Hardened email validation:
 * - Max 254 characters (RFC 5321 limit)
 * - Rejects addresses containing angle brackets, backslashes, or null bytes
 * - Validates basic structural correctness
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // Reject dangerous characters: < > \ and null byte
  if (/[<>\\]/.test(email) || email.includes(String.fromCharCode(0))) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Sanitizes a URL to allow only safe schemes:
 * - https:// for external resources
 * - data:image/ for evidence image thumbnails (base64)
 * All other schemes (javascript:, data:text/html, etc.) are stripped and replaced with "".
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("https://") || url.startsWith("data:image/")) {
    return url;
  }
  return "";
}
