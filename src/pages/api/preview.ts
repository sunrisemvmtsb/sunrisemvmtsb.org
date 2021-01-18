import { NextApiRequest, NextApiResponse } from 'next'
import AuthService from '../../services/AuthService'

export default AuthService.instance.protect((req: NextApiRequest, res: NextApiResponse) => {
  res.setPreviewData({})
  res.status(200).end()
})
