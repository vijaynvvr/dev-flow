import CryptoJS from 'crypto-js'

if (!process.env.ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required')
}

const MASTER_KEY = process.env.ENCRYPTION_KEY

function deriveUserKey(userEmail: string): string {
  return CryptoJS.PBKDF2(MASTER_KEY + userEmail, 'dev-flow-salt', {
    keySize: 256/32,
    iterations: 10000
  }).toString()
}

function sanitizeCredential(credential: string): string {
  if (!credential || typeof credential !== 'string') {
    throw new Error('Invalid credential format')
  }
  
  const trimmed = credential.trim()
  if (trimmed.length < 8) {
    throw new Error('Credential too short')
  }
  
  if (trimmed.length > 500) {
    throw new Error('Credential too long')
  }
  
  return trimmed
}

export function encrypt(text: string, userEmail: string): string {
  if (!text || !userEmail) return ''
  
  try {
    const sanitized = sanitizeCredential(text)
    const userKey = deriveUserKey(userEmail)
    const iv = CryptoJS.lib.WordArray.random(16)
    
    const encrypted = CryptoJS.AES.encrypt(sanitized, userKey, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    
    const hmacKey = CryptoJS.PBKDF2(userKey, 'hmac-salt', {
      keySize: 256/32,
      iterations: 1000
    })
    
    const dataToAuth = iv.concat(encrypted.ciphertext)
    const hmac = CryptoJS.HmacSHA256(dataToAuth, hmacKey)
    
    const combined = dataToAuth.concat(hmac)
    return combined.toString(CryptoJS.enc.Base64)
  } catch {
    throw new Error('Encryption failed')
  }
}

export function decrypt(encryptedText: string, userEmail: string): string {
  if (!encryptedText || !userEmail) return ''
  
  try {
    const userKey = deriveUserKey(userEmail)
    const combined = CryptoJS.enc.Base64.parse(encryptedText)
    
    const hmacSize = 32
    const ivSize = 16
    
    const hmac = CryptoJS.lib.WordArray.create(
      combined.words.slice(-(hmacSize/4))
    )
    const dataToAuth = CryptoJS.lib.WordArray.create(
      combined.words.slice(0, -(hmacSize/4))
    )
    
    const hmacKey = CryptoJS.PBKDF2(userKey, 'hmac-salt', {
      keySize: 256/32,
      iterations: 1000
    })
    
    const expectedHmac = CryptoJS.HmacSHA256(dataToAuth, hmacKey)
    if (hmac.toString() !== expectedHmac.toString()) {
      throw new Error('Authentication failed')
    }
    
    const iv = CryptoJS.lib.WordArray.create(
      dataToAuth.words.slice(0, ivSize/4)
    )
    const ciphertext = CryptoJS.lib.WordArray.create(
      dataToAuth.words.slice(ivSize/4)
    )
    
    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({ ciphertext: ciphertext }),
      userKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )
    
    const result = decrypted.toString(CryptoJS.enc.Utf8)
    if (!result) {
      throw new Error('Decryption produced empty result')
    }
    
    return result
  } catch {
    return ''
  }
}