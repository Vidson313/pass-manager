export function secureRandomIndex(maxExclusive: number): number {
  if (!Number.isSafeInteger(maxExclusive) || maxExclusive <= 0) {
    throw new Error('maxExclusive must be a positive safe integer');
  }

  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const randomValues = new Uint32Array(1);

  do {
    window.crypto.getRandomValues(randomValues);
  } while (randomValues[0] >= limit);

  return randomValues[0] % maxExclusive;
}

export function createSecureId(prefix: string): string {
  if (typeof window.crypto.randomUUID === 'function') {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  const id = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return `${prefix}-${id}`;
}
