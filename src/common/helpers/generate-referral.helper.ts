import { createHash } from 'crypto';

export function generateReferral(userEmail: string) {
  const hash = createHash('md5')
    .update(`${userEmail}${Date.now()}`)
    .digest('hex')
    .toUpperCase()
    .substring(0, 8);
  return hash; // =>: A1B2C3D4
}
