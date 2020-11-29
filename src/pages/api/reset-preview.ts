import { NextApiRequest, NextApiResponse } from 'next'

export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.clearPreviewData()
  res.status(200).end()
}
