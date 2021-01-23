import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next/types'
import type { ContainerInstance } from 'typedi'
import { google } from 'googleapis'
import Crypto from './Crypto.server'


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

  private _connection(): any {
    const baseUrl = this._secure ? 'https://' + this._hostname : 'http://' + this._hostname
    return new google.auth.OAuth2(
      this._clientId,
      this._clientSecret,
      `${baseUrl}/api/auth/callback`,
    )
  }

  async protect(req: NextApiRequest, res: NextApiResponse, handler: NextApiHandler): Promise<void> {
    const data = req.previewData
    if (!data) return res.status(401).end()

    try {
      const authToken = this._crypto.decrypt(data.authToken)
      if (!authToken) return res.status(401).end()
      const valid = await this.verifyAccessToken(authToken)
      if (valid) return handler(req, res)
      else return res.status(401).end()
    } catch {
      return res.status(401).end()
    }
  }

  getAuthorizationUrl(state: string) {
    const conn = this._connection()
    return conn.generateAuthUrl({
      prompt: 'consent',
      response_type: 'code',
      state: state,
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      login_hint: this._allowed[0]
    })
  }

  async exchangeCode(code: string): Promise<string> {
    const conn = this._connection()
    const data = await conn.getToken(code)
    const ticket = await conn.verifyIdToken({
      idToken: data.tokens.id_token!,
      audience: process.env.GOOGLE_AUTH_CLIENT_ID!,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) throw Error('Invalid auth response')
    if (!this._allowed.includes(payload.email)) throw Error('Invalid email address')
    return data.tokens.access_token!
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
