import crypto from 'crypto';

export function createMD5Hash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}
