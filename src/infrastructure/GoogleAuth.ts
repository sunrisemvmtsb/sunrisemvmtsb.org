import { google } from 'googleapis'

const connection = (base: string) => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_AUTH_CLIENT_ID!,
    process.env.GOOGLE_AUTH_CLIENT_SECRET!,
    `${base}/api/auth/callback`,
  )
}

export default class GoogleAuth {
  private static _instance: GoogleAuth | null = null
  public static get instance(): GoogleAuth {
    if (this._instance === null) this._instance = new GoogleAuth()
    return this._instance
  }

  private _baseUrl() {
    const hostname = process.env.SERVER_HOSTNAME!
    const https = process.env.NODE_ENV === 'production'
    return https ? 'https://' + hostname : 'http://' + hostname
  }

  getAuthorizationUrl(state: string) {
    const conn = connection(this._baseUrl())
    return conn.generateAuthUrl({
      prompt: 'consent',
      response_type: 'code',
      login_hint: 'sunrisemvmtsb@gmail.com',
      state: state,
      scope: 'https://www.googleapis.com/auth/userinfo.email'
    })
  }

  async exchangeCode(code: string): Promise<string> {
    const conn = connection(this._baseUrl())
    const data = await conn.getToken(code)
    const ticket = await conn.verifyIdToken({
      idToken: data.tokens.id_token!,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID!,
    })
    const payload = ticket.getPayload()
    if (!payload) throw Error('Invalid auth response')
    if (payload.email !== 'sunrisemvmtsb@gmail.com') throw Error('Invalid email address')
    return data.tokens.access_token!
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    const conn = connection(this._baseUrl())
    try {
      await conn.getTokenInfo(token)
      return true
    } catch {
      return false
    }
  }
}
