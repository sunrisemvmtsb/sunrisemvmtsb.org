import { NextApiRequest, NextApiResponse } from 'next/types'
import GoogleAuth from '../../../infrastructure/GoogleAuth'
import base64 from 'base-64'
import cookie from 'cookie'
import Crypto from '../../../infrastructure/Crypto'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') return res.status(404).end()
  const base = process.env.SERVER_ORIGIN!

  const cookies = req.headers.cookie
  if (typeof cookies !== 'string') res.status(401).end()

  const parsed = cookie.parse(cookies!, {
    decode: Crypto.decrypt,
  })

  const state = parsed.authstate

  if (state !== req.query.state) return res.status(401).end()

  res.setHeader('Set-Cookie', cookie.serialize('authstate', '', {
    httpOnly: true,
    maxAge: -1,
    sameSite: 'lax',
    secure: base.startsWith('https://'),
    path: '/',
  }))

  try {
    const authToken = await GoogleAuth.instance.exchangeCode(base, req.query.code as string)
    const decodedState = JSON.parse(base64.decode(state))
    res
      .setPreviewData({ authToken: Crypto.encrypt(authToken) })
      .redirect(decodedState.redirect)
  } catch (error) {
    return res.status(500).end()
  }
}
