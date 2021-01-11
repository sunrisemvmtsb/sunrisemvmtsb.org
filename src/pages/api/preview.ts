import { NextApiRequest, NextApiResponse } from 'next'
import Auth from '../../infrastructure/Auth'

export default Auth.protect((req: NextApiRequest, res: NextApiResponse) => {
  res.setPreviewData({})
  res.status(200).end()
})
