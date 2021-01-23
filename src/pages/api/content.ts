import type { NextApiRequest, NextApiResponse } from 'next/types'
import GoogleAuth from '../../infrastructure/GoogleAuth.server'
import inject from '../../infrastructure/Container.server'
import IContentBackend from '../../services/IContentBackend'
import { v4 as uuid } from 'uuid'

export default (req: NextApiRequest, res: NextApiResponse) => {
  const container = inject(uuid())
  const auth = container.get(GoogleAuth)
  const backend = container.get(IContentBackend)

  return auth.protect(req, res, async (req, res) => {
    const method = req.query.method as string
    if (!method) return res.status(400).end()

    if (method === 'getTextFile' && req.method === 'GET') {
      const filename = req.query.filename as string | undefined
      const bucket = req.query.bucket as string | undefined
      const exclude = typeof req.query.exclude === 'undefined' ?
        [] :
        typeof req.query.exclude === 'string' ?
          [req.query.exclude] :
          req.query.exclude
      if (typeof filename === 'undefined' || typeof bucket === 'undefined') return res.status(400).end()
      const content = await backend.getTextFile({ bucket, filename, exclude })
      if (content === null) return res.status(404).end()
      return res.send(content)
    }

    if (method === 'saveTextFile' && req.method === 'POST') {
      await backend.saveTextFile(req.body)
      return res.status(200).end()
    }

    if (method === 'renameAndSaveTextFile' && req.method === 'PUT') {
      await backend.renameAndSaveTextFile(req.body)
      return res.status(200).end()
    }

    if (method === 'listTextBucket' && req.method === 'GET') {
      const bucket = req.query.bucket as string | undefined
      if (typeof bucket === 'undefined') return res.status(400).end()
      const data = await backend.listTextBucket({ bucket })
      return res.send(data)
    }

    if (method === 'deleteTextFile' && req.method === 'DELETE') {
      const filename = req.query.filename as string | undefined
      const bucket = req.query.bucket as string | undefined
      if (typeof filename === 'undefined' || typeof bucket === 'undefined') return res.status(400).end()
      await backend.deleteTextFile({ bucket, filename })
      return res.status(200).end()
    }

    if (method === 'listMedia' && req.method === 'GET') {
      const data = await backend.listMedia()
      return res.send(data)
    }

    if (method === 'deleteMedia' && req.method === 'DELETE') {
      const filename = req.query.filename as string | undefined
      if (typeof filename === 'undefined') return res.status(400).end()
      await backend.deleteMedia({ filename })
      return res.status(200).end()
    }

    if (method === 'getMediaPreviewEndpoint' && req.method === 'GET') {
      const url = await backend.getMediaPreviewEndpoint()
      return res.send({ url })
    }

    return res.status(404).end()
  })
}
