export type InstagramPost = {
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

const FIVE_MINUTES = 1000 * 60 * 5

export default class Instagram {
  private static _instance: Instagram | null = null
  static get instance() {
    if (!this._instance) this._instance = new Instagram()
    return this._instance
  }

  private _lastFetched: number
  private _cache: Array<InstagramPost>

  constructor() {
    this._lastFetched = 0
    this._cache = []
  }

  async load(): Promise<Array<InstagramPost>> {
    const now = Date.now()
    if (now - this._lastFetched > FIVE_MINUTES) {
      try {
        console.info('Reloading Instagram feed')
        const data = process.env.NODE_ENV === 'development' ? [] : await this._fetch()
        this._lastFetched = now
        this._cache = data
      } catch (error) {
        console.error(error)
      }
    }

    return this._cache
  }


  private async _fetch(): Promise<Array<InstagramPost>> {
    const response = await fetch('https://www.instagram.com/sunrisemvmtsb/')
    const html = await response.text()
    const firstHalf = html.split('window._sharedData = ')[1]
    const contents = firstHalf.split(';</script>')[0]
    const rawData = JSON.parse(contents)
    if (!rawData.entry_data.ProfilePage) {
      if (rawData.entry_data.LoginAndSignupPage) {
        console.info('Locked out of Instagram')
      }
      return []
    }
    return rawData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.map((edge: any) => {
      return {
        id: edge.node.id,
        url: `https://instagram.com/p/${edge.node.shortcode}`,
        image: edge.node.thumbnail_src,
        caption: edge.node.edge_media_to_caption.edges[0].node.text,
        profile: rawData.entry_data.ProfilePage[0].graphql.user.username,
        avatar: rawData.entry_data.ProfilePage[0].graphql.user.profile_pic_url,
        video: edge.node.is_video,
        comments: edge.node.edge_media_to_comment.count,
        interactions: edge.node.is_video ? edge.node.video_view_count : edge.node.edge_media_preview_like.count,
        timestamp: edge.node.taken_at_timestamp,
      }
    })
  }
}
