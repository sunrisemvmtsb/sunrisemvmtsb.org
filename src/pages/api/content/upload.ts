import { NextApiRequest, NextApiResponse } from 'next/types'
import { File } from 'formidable'
import { IncomingForm } from 'formidable-serverless'
import fs from 'fs'
import GoogleAuth from '../../../infrastructure/GoogleAuth.server'
import inject from '../../../infrastructure/Container.server'
import IContentBackend from '../../../services/IContentBackend'
import { v4 as uuid } from 'uuid'

export const config = {
  api: {
    bodyParser: false,
  },
}

const extractFileData = (form: IncomingForm, start: () => void): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    let file: File | null = null
    let aborted = false
    form
      .on('file', (name: string, f: File) => {
        if (!file) file = f
        else if (file) fs.unlinkSync(f.path)
      })
      .on('aborted', () => {
        aborted = true
        reject(Error('aborted'))
      })
      .on('end', async () => {
        if (aborted) return
        if (!file) {
          reject(Error('no file'))
          return
        }

        try {
          const data = fs.readFileSync(file.path)
          resolve(data)
        } catch (error) {
          reject(error)
        } finally {
          fs.unlinkSync(file.path)
        }
      })

    start()
  })
}

export default (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const container = inject(uuid())
  const auth = container.get(GoogleAuth)
  const backend = container.get(IContentBackend)
  return auth.protect(req, res, async (req, res) => {
    if (req.method !== 'POST') return res.status(404).end()

    const filename = req.query.filename
    if (typeof filename !== 'string') return res.status(400).end()

    const form = new IncomingForm({
      multiples: true,
      keepExtensions: true,
    } as any)

    try {
      const content = await extractFileData(form, () => form.parse(req))
      await backend.uploadMedia({ filename, content })
      return res.status(200).end()
    } catch (error) {
      return res.status(500).end()
    }
  })
}
