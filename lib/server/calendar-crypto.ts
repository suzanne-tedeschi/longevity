import crypto from 'crypto'

function getSecret() {
  const secret = process.env.CALENDAR_TOKEN_SECRET
  if (!secret) {
    throw new Error('Missing CALENDAR_TOKEN_SECRET')
  }
  return secret
}

function keyFromSecret(secret: string) {
  return crypto.createHash('sha256').update(secret).digest()
}

export function encryptToken(plainText: string) {
  const key = keyFromSecret(getSecret())
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`
}

export function decryptToken(cipherText: string) {
  const [ivB64, tagB64, dataB64] = cipherText.split('.')
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error('Invalid encrypted token format')
  }
  const key = keyFromSecret(getSecret())
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagB64, 'base64url'))
  const plain = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64url')),
    decipher.final(),
  ])
  return plain.toString('utf8')
}

export function signState(payloadBase64: string) {
  return crypto
    .createHmac('sha256', getSecret())
    .update(payloadBase64)
    .digest('base64url')
}

export function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a)
  const bBuf = Buffer.from(b)
  if (aBuf.length !== bBuf.length) return false
  return crypto.timingSafeEqual(aBuf, bBuf)
}
