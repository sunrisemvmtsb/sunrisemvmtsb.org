import { NextApiRequest, NextApiResponse } from 'next'
import Auth from '../../infrastructure/Auth'

export default (_req: NextApiRequest, res: NextApiResponse) => {
  res.clearPreviewData()
  res.status(200).end()
}
