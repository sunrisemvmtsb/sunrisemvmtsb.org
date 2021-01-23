import { NextApiRequest, NextApiResponse } from 'next/types'
import { v4 as uuid } from 'uuid'
import GoogleAuth from '../../../infrastructure/GoogleAuth.server'
import base64 from 'base-64'
import cookie from 'cookie'
import Crypto from '../../../infrastructure/Crypto.server'
import inject from '../../../infrastructure/Container.server'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(404).end()

  const container = inject(uuid())
  const crypto = container.get(Crypto)
  const auth = container.get(GoogleAuth)

  const encryptedAuthState = req.cookies.authstate
  if (!encryptedAuthState) return res.status(401).end()

  const state = crypto.decrypt(encryptedAuthState)

  if (state !== req.query.state) return res.status(401).end()

  res.setHeader('Set-Cookie', cookie.serialize('authstate', '', {
    httpOnly: true,
    maxAge: -1,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  }))

  try {
    const authToken = await auth.exchangeCode(req.query.code as string)
    const decodedState = JSON.parse(base64.decode(state))
    res
      .setPreviewData({ authToken: crypto.encrypt(authToken) })
      .redirect(decodedState.redirect)
  } catch (error) {
    console.error(error)
    return res.status(500).end()
  }
}
