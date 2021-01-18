import { NextApiRequest, NextApiResponse } from 'next/types'
import GoogleAuth from '../../../infrastructure/GoogleAuth'
import cookie from 'cookie'
import Crypto from '../../../infrastructure/Crypto'

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') return res.status(404).end()

  const url = GoogleAuth.instance.getAuthorizationUrl(req.body.state)

  res.setHeader('Set-Cookie', cookie.serialize('authstate', req.body.state, {
    httpOnly: true,
    maxAge: 120,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    encode: Crypto.encrypt,
  }))

  res.send({ url })
}
