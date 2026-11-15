export const MIN_PASSWORD_LENGTH = 12;
export const DEFAULT_SECURE_PASSWORD_LENGTH = 32;

const MAX_SECURE_PASSWORD_LENGTH = 1024;
const PASSWORD_ALPHABET =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

export function assertPasswordLength(
  password: unknown,
  label = 'Password',
): asserts password is string {
  if (
    typeof password !== 'string' ||
    Array.from(password).length < MIN_PASSWORD_LENGTH ||
    password.trim().length === 0
  )
    throw new TypeError(
      `${label} must contain at least ${MIN_PASSWORD_LENGTH} characters`,
    );
}

export function generateSecurePassword(
  length = DEFAULT_SECURE_PASSWORD_LENGTH,
): string {
  if (
    !Number.isSafeInteger(length) ||
    length < MIN_PASSWORD_LENGTH ||
    length > MAX_SECURE_PASSWORD_LENGTH
  )
    throw new RangeError(
      `Password length must be an integer between ${MIN_PASSWORD_LENGTH} and ${MAX_SECURE_PASSWORD_LENGTH}`,
    );
  if (typeof globalThis.crypto?.getRandomValues !== 'function')
    throw new Error('Secure random number generation is unavailable');

  const bytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(bytes);
  try {
    let password = '';
    for (const byte of bytes)
      password += PASSWORD_ALPHABET.charAt(byte % PASSWORD_ALPHABET.length);
    return password;
  } finally {
    bytes.fill(0);
  }
}
