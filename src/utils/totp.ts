function base32Decode(encoded: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const cleaned = encoded.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');
  const output: number[] = [];
  let bits = 0;
  let value = 0;

  for (const char of cleaned) {
    const idx = alphabet.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return new Uint8Array(output);
}

export async function generateTOTP(secret: string, timeStep = 30): Promise<string> {
  const keyBytes = base32Decode(secret);
  const counter = Math.floor(Date.now() / 1000 / timeStep);

  const counterBytes = new Uint8Array(8);
  let c = counter;
  for (let i = 7; i >= 0; i--) {
    counterBytes[i] = c & 0xff;
    c = Math.floor(c / 256);
  }

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign('HMAC', cryptoKey, counterBytes);
  const hash = new Uint8Array(sig);

  const offset = hash[19] & 0xf;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return String(code % 1_000_000).padStart(6, '0');
}

export function secondsUntilNextWindow(timeStep = 30): number {
  return timeStep - (Math.floor(Date.now() / 1000) % timeStep);
}
