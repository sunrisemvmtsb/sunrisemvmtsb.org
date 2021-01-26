import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next/types'
import type { ContainerInstance } from 'typedi'
import { google, Auth } from 'googleapis'
import Crypto from './Crypto.server'
import cookie from 'cookie'

type Tokens = {
  access: string,
  refresh: string
}

export default class GoogleAuth {
  private readonly _crypto: Crypto
  private readonly _allowed: Array<string>
  private readonly _secure: boolean
  private readonly _hostname: string
  private readonly _clientId: string
  private readonly _clientSecret: string

  constructor({
    container,
    allowed,
    hostname,
    secure,
    clientId,
    clientSecret,
  }: {
    container: ContainerInstance,
    allowed: Array<string>
    secure: boolean,
    hostname: string,
    clientId: string,
    clientSecret: string,
  }) {
    this._crypto = container.get(Crypto)
    this._allowed = allowed
    this._secure = secure
    this._hostname = hostname
    this._clientId = clientId
    this._clientSecret = clientSecret
  }

  private _conn: Auth.OAuth2Client | null = null
  private _connection(): Auth.OAuth2Client {
    if (this._conn) return this._conn
    const baseUrl = this._secure ? 'https://' + this._hostname : 'http://' + this._hostname
    this._conn = new google.auth.OAuth2(
      this._clientId,
      this._clientSecret,
      `${baseUrl}/api/auth/callback`,
    )
    return this._conn
  }

  async protect(req: NextApiRequest, res: NextApiResponse, handler: NextApiHandler): Promise<void> {
    const data = req.previewData
    if (!data) return res.status(401).end()

    const authCookie = req.cookies.auth
    if (!authCookie) return res.status(401).end()

    const decrypted = this._crypto.decrypt(authCookie)
    if (!decrypted) return res.status(401).end()

    try {
      const conn = this._connection()
      const tokens = JSON.parse(decrypted)
      conn.setCredentials({
        access_token: tokens.access,
        refresh_token: tokens.refresh,
      })

      conn.on('tokens', (newTokens) => {
        if (!newTokens.access_token) return
        this.setAuthCookie({
          access: newTokens.access_token,
          refresh: newTokens.refresh_token ?? tokens.refresh,
        }, res)
      })

      const valid = await this.verifyAccessToken(tokens.access)
      if (valid) {
        res.setPreviewData({ enabled: true }, {
          maxAge: 24 * 60 * 60
        })
        return handler(req, res)
      } else {
        return res.status(401).end()
      }
    } catch {
      return res.status(401).end()
    }
  }

  setAuthCookie(tokens: Tokens, res: NextApiResponse) {
    res.setPreviewData({ enabled: true }, {
      maxAge: 24 * 60 * 60
    })
    res.setHeader('Set-Cookie', cookie.serialize('auth', this._crypto.encrypt(JSON.stringify(tokens)), {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    }))
  }

  clearAuthCookie(res: NextApiResponse) {
    res.setHeader('Set-Cookie', cookie.serialize('auth', '', {
      httpOnly: true,
      maxAge: -1,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    }))
  }

  getAuthorizationUrl(state: string) {
    const conn = this._connection()
    return conn.generateAuthUrl({
      prompt: 'consent',
      response_type: 'code',
      state: state,
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      login_hint: this._allowed[0],
      access_type: 'offline',
    })
  }

  async exchangeCode(code: string): Promise<{ access: string, refresh: string }> {
    const conn = this._connection()
    const data = await conn.getToken(code)
    const ticket = await conn.verifyIdToken({
      idToken: data.tokens.id_token!,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID!,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) throw Error('Invalid auth response')
    if (!this._allowed.includes(payload.email)) throw Error('Invalid email address')
    if (!data.tokens.access_token) throw Error('No access token')
    if (!data.tokens.refresh_token) throw Error('No refresh token')
    return { access: data.tokens.access_token, refresh: data.tokens.refresh_token }
  }

  async verifyAccessToken(token: string): Promise<boolean> {
    const conn = this._connection()
    try {
      await conn.getTokenInfo(token)
      return true
    } catch {
      return false
    }
  }
}
