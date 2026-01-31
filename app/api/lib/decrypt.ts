import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.SECRET_KEY ?? '';

export function decrypt(payload: any) {
  const key = Buffer.from(SECRET_KEY, 'hex');

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(payload.iv, 'hex')
  );

  decipher.setAuthTag(Buffer.from(payload.authTag, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.content, 'hex')),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString('utf8'));
}
