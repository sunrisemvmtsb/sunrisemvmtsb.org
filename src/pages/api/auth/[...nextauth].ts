import type { NextApiRequest, NextApiResponse } from 'next/types'
import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'

const options: InitOptions = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET!,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&response_type=code&login_hint=sunrisemvmtsb@gmail.com',
    }),
  ],
  callbacks: {
    signIn: async (user, account, profile) => {
      return account.provider === 'google' && profile.email === 'sunrisemvmtsb@gmail.com'
    },
  },
}

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)
