import crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Verifies a password against an existing Laravel bcrypt hash (`$2y$12$...` or `$2b$12$...`).
 * Ensures existing Admins and Users can log in with zero password resets.
 */
export async function verifyLaravelPassword(
  plainPassword: string,
  laravelHash: string
): Promise<boolean> {
  if (!laravelHash) return false;
  // Normalize PHP's $2y$ prefix to $2a$ for Node bcryptjs compatibility
  const normalizedHash = laravelHash.startsWith('$2y$')
    ? '$2a$' + laravelHash.slice(4)
    : laravelHash;
  return bcrypt.compare(plainPassword, normalizedHash);
}

/**
 * Hashes a password using `$2y$` prefix so it remains 100% compatible with Laravel as well.
 */
export async function hashLaravelCompatiblePassword(plainPassword: string): Promise<string> {
  const hash = await bcrypt.hash(plainPassword, 12);
  return hash.replace(/^\$2[ab]\$/, '$2y$');
}

function getAppKeyBuffer(): Buffer {
  const rawKey = process.env.LARAVEL_APP_KEY || '';
  if (rawKey.startsWith('base64:')) {
    return Buffer.from(rawKey.slice(7), 'base64');
  }
  return Buffer.from(rawKey, 'utf8');
}

/**
 * Decrypts payloads created by Laravel's `encrypt()` helper (AES-256-CBC + HMAC-SHA256).
 */
export function decryptLaravelPayload(encryptedBase64: string): string | null {
  try {
    const key = getAppKeyBuffer();
    const jsonStr = Buffer.from(encryptedBase64, 'base64').toString('utf8');
    const payload = JSON.parse(jsonStr) as { iv: string; value: string; mac: string };

    const iv = Buffer.from(payload.iv, 'base64');
    const encryptedText = Buffer.from(payload.value, 'base64');

    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, undefined, 'utf8');
    decrypted += decipher.final('utf8');

    // Strip PHP serialization wrapper if present (e.g. s:5:"12345"; or i:123;)
    const strMatch = decrypted.match(/^s:\d+:"(.*)";$/s);
    if (strMatch) return strMatch[1];
    const intMatch = decrypted.match(/^i:(\d+);$/);
    if (intMatch) return intMatch[1];

    return decrypted;
  } catch {
    return null;
  }
}
