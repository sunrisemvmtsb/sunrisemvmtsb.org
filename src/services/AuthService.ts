import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next/types'
import { getSession } from 'next-auth/client'

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
      const session = await getSession({ req })
      if (!session) return res.status(401).end()
      return handler(req, res)
    }
  }

  async isLoggedIn() {
    const session = await getSession()
    return !!session
  }
}
