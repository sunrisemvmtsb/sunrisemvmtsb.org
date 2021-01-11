import { NextApiRequest, NextApiResponse } from 'next/types'
import Auth from '../../../infrastructure/Auth'
import { Octokit } from '@octokit/rest'
import { Gunzip } from 'zlib'
import GitHub from '../../../infrastructure/GitHub'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const stream = await GitHub.instance.streamJsonContent(req.query.path as string)
  res.writeHead(200, 'OK', { 'Content-Type': 'application/json' })
  stream.pipe(res)
}
