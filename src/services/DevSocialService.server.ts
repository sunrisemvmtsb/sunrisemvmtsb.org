import SocialPost from '../domain/SocialPost'
import ISocialService from './ISocialService'

export default class DevSocialService implements ISocialService {
  async getPosts(): Promise<Array<SocialPost>> {
    return fakeInstagramPosts
  }
}

const fakeInstagramPosts: Array<SocialPost> = [
  {
    type: 'InstagramPost',
    id: '1',
    url: 'https://sunrisemvmtsb.org',
    image: '/images/placeholder.svg',
    caption: '@sunrisemvmt Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. #GreenNewDeal',
    profile: 'sunrisemvmtsb',
    avatar: '/images/placeholder.svg',
    timestamp: 0,
    video: true,
    comments: 5,
    interactions: 200,
  },
  {
    type: 'InstagramPost',
    id: '2',
    url: 'https://sunrisemvmtsb.org',
    image: '/images/placeholder.svg',
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    profile: 'sunrisemvmtsb',
    avatar: '/images/placeholder.svg',
    timestamp: 1,
    video: false,
    comments: 5,
    interactions: 200,
  },
  {
    type: 'InstagramPost',
    id: '3',
    url: 'https://sunrisemvmtsb.org',
    image: '/images/placeholder.svg',
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    profile: 'sunrisemvmtsb',
    avatar: '/images/placeholder.svg',
    timestamp: 2,
    video: false,
    comments: 5,
    interactions: 200,
  },
  {
    type: 'InstagramPost',
    id: '4',
    url: 'https://sunrisemvmtsb.org',
    image: '/images/placeholder.svg',
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    profile: 'sunrisemvmtsb',
    avatar: '/images/placeholder.svg',
    timestamp: 3,
    video: false,
    comments: 5,
    interactions: 200,
  }
]
