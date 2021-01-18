import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next/types'
import GoogleAuth from '../infrastructure/GoogleAuth'
import Crypto from '../infrastructure/Crypto'

export default abstract class AuthService {
  private static _instance: AuthService | null = null
  static get instance(): AuthService {
    if (this._instance === null) {
      if (typeof window !== 'undefined') this._instance = new ClientAuthService()
      else this._instance = new ServerAuthService()
    }
    return this._instance
  }

  abstract protect(handler: NextApiHandler): NextApiHandler
  abstract isLoggedIn(): Promise<boolean>
}

class ClientAuthService extends AuthService {
  protect(handler: NextApiHandler): NextApiHandler {
    throw Error('This method doesnt work on the client')
  }

  async isLoggedIn() {
    return sessionStorage.getItem('preview') === 'active'
  }
}

class ServerAuthService extends AuthService {
  protect(handler: NextApiHandler): NextApiHandler {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      const data = req.previewData
      if (!data) return res.status(401).end()

      try {
        const authToken = Crypto.decrypt(data.authToken)
        const valid = await GoogleAuth.instance.verifyAccessToken(authToken)
        if (valid) return handler(req, res)
        else return res.status(401).end()
      } catch {
        return res.status(401).end()
      }
    }
  }

  async isLoggedIn(): Promise<boolean> {
    throw Error('This method doesnt work on the server')
  }
}
