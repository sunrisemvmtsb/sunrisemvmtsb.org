import { Token } from 'typedi'
import SocialPost from '../domain/SocialPost'

interface ISocialService {
  getPosts(): Promise<Array<SocialPost>>
}

const ISocialService = new Token<ISocialService>('ISocialService')

export default ISocialService
