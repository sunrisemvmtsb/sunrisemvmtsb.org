import crypto from 'crypto'

export default {
  encrypt: (value: string): string => {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.SIGNING_KEY!, 'base64'), iv)
    let crypted = cipher.update(value, 'utf8', 'hex')
    crypted += cipher.final('hex')
    crypted = iv.toString('hex') + crypted
    return crypted
  },
  decrypt: (value: string): string => {
    const iv = Buffer.from(value.slice(0, 32), 'hex')
    const encryptedText = Buffer.from(value.slice(32), 'hex')
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.SIGNING_KEY!, 'base64'), iv)
    let decrypted = decipher.update(encryptedText)
    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  }
}
