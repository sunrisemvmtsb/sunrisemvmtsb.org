import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next/types'
import { getSession } from 'next-auth/client'

export default {
  protect: (handler: NextApiHandler): NextApiHandler => async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req })
    if (!session) return res.status(401).end()
    return handler(req, res)
  }
}
