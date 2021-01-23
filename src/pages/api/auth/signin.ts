import { NextApiRequest, NextApiResponse } from 'next/types'
import cookie from 'cookie'
import GoogleAuth from '../../../infrastructure/GoogleAuth.server'
import Crypto from '../../../infrastructure/Crypto.server'
import inject from '../../../infrastructure/Container.server'
import { v4 as uuid } from 'uuid'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(404).end()
  const container = inject(uuid())
  const crypto = container.get(Crypto)
  const auth = container.get(GoogleAuth)

  const url = auth.getAuthorizationUrl(req.body.state)

  res.setHeader('Set-Cookie', cookie.serialize('authstate', req.body.state, {
    httpOnly: true,
    maxAge: 120,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    encode: crypto.encrypt,
  }))

  res.send({ url })
}
