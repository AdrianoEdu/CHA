import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const AES_SECRET = process.env.AES_SECRET ?? '';

export function encrypt(data: unknown) {
  const iv = crypto.randomBytes(12); 
  const key = Buffer.from(AES_SECRET, 'hex');

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(data), 'utf8'),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
    authTag: authTag.toString('hex'),
  };
}

export function decrypt(payload: any) {
  const key = Buffer.from(AES_SECRET, 'hex');

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
