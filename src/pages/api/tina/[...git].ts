import { NextApiRequest, NextApiResponse } from 'next/types'
import * as GitApi from '@tinacms/api-git'
import Auth from '../../../infrastructure/Auth'
import express from 'express'

const git = GitApi.router({
  pathToRepo: process.cwd(),
  pathToContent: '',
} as any)

git.stack = git.stack.filter((layer) => {
  return layer.name !== 'jsonParser'
})

const router = express.Router()
router.use('/api/tina', git)

export default Auth.protect((req: NextApiRequest, res: NextApiResponse) => {

  router(req as any, res as any, (error) => { })
})
