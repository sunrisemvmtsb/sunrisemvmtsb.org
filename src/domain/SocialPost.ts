type InstagramPost = {
  type: 'InstagramPost'
  id: string,
  url: string,
  image: string,
  caption: string,
  timestamp: number,
  avatar: string,
  profile: string,
  video: boolean,
  comments: number,
  interactions: number,
}

type SocialPost =
  | InstagramPost

export default SocialPost
