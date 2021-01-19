import type { Media } from 'tinacms'
import Page from '../domain/Page'
import SiteConfig from '../domain/SiteConfig'
import NewsSummary from '../domain/NewsSummary'
import NewsPost from '../domain/NewsPost'

export default abstract class ContentService {
  private static _instance: ContentService | null = null
  static get instance(): ContentService {
    if (this._instance === null) {
      if (typeof window !== 'undefined') this._instance = new ClientContentService()
      else if (process.env.NODE_ENV === 'production') this._instance = new GitHubContentService()
      else this._instance = new FsContentService()
    }
    return this._instance
  }

  abstract getSiteConfig(): Promise<SiteConfig>
  abstract saveSiteConfig(config: SiteConfig): Promise<void>
  abstract getNewsSummaries(): Promise<Array<NewsSummary>>
  abstract getNewsPost(slug: string): Promise<NewsPost | null>
  abstract saveNewsPost(post: NewsPost): Promise<void>
  abstract getPage(slug: string): Promise<Page | null>
  abstract getPagePaths(): Promise<Array<string>>
  abstract savePage(page: Page): Promise<void>
  abstract saveMedia(filename: string, data: ArrayBuffer): Promise<void>
  abstract deleteMedia(filename: string): Promise<void>
  abstract listMedia(directory: string): Promise<Array<Media>>

  getMediaPreviewUrl(filename: string): string {
    const fixed = filename.startsWith('/') ? filename.slice(1) : filename
    if (process.env.NODE_ENV === 'production') {
      return `https://raw.githubusercontent.com/sunrisemvmtsb/sunrisemvmtsb.org/main/public/media/${fixed}`
    }
    return `/media/${fixed}`
  }
}

class ClientContentService extends ContentService {
  async getSiteConfig(): Promise<SiteConfig> {
    const url = '/api/content?method=getSiteConfig'
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  async saveSiteConfig(config: SiteConfig): Promise<void> {
    const url = '/api/content?method=saveSiteConfig'
    const response = await fetch(url, {
      body: JSON.stringify(config, null, 2),
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw Error('failed to save')
  }

  async getNewsSummaries(): Promise<Array<NewsSummary>> {
    const url = `/api/content?method=getNewsSummaries`
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  async getNewsPost(slug: string): Promise<NewsPost | null> {
    const url = `/api/content?method=getNewsPost&slug=${encodeURIComponent(slug)}`
    const response = await fetch(url)
    if (response.status === 404) return null
    const data = await response.json()
    return { ...data, slug }
  }

  async saveNewsPost(post: NewsPost): Promise<void> {
    const url = `/api/content?method=saveNewsPost&slug=${encodeURIComponent(post.slug)}`
    const response = await fetch(url, {
      body: JSON.stringify(post, null, 2),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw Error('failed to save')
  }

  async getPage(slug: string): Promise<Page | null> {
    const url = `/api/content?method=getPage&slug=${encodeURIComponent(slug)}`
    const response = await fetch(url)
    if (response.status === 404) return null
    const data = await response.json()
    return { ...data, slug }
  }

  async getPagePaths(): Promise<Array<string>> {
    throw Error('not implemented')
  }

  async savePage(page: Page): Promise<void> {
    const url = `/api/content?method=savePage&slug=${encodeURIComponent(page.slug)}`
    const response = await fetch(url, {
      body: JSON.stringify(page, null, 2),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw Error('failed to save')
  }

  async saveMedia(filename: string, data: ArrayBuffer) {
    const basename = filename.split('/').slice(-1)[0]
    const file = new File([data], basename)
    const formData = new FormData()
    formData.append('file', file)
    const url = `/api/content/upload?filename=${filename}`
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) throw Error('failed to upload')
  }

  async deleteMedia(filename: string): Promise<void> {
    const url = `/api/content?method=deleteMedia&filename=${filename}`
    const response = await fetch(url, { method: 'DELETE' })
    if (!response.ok) throw Error('failed to delete')
  }

  async listMedia(directory: string): Promise<Array<Media>> {
    const url = `/api/content?method=listMedia&directory=${directory}`
    const response = await fetch(url)
    const data = await response.json()
    return data
  }
}

class FsContentService extends ContentService {
  async getSiteConfig(): Promise<SiteConfig> {
    const fs = await import('fs')
    const json = fs.readFileSync('content/config.json', 'utf-8')
    const data = JSON.parse(json)
    return data
  }

  async saveSiteConfig(config: SiteConfig): Promise<void> {
    const fs = await import('fs')
    fs.writeFileSync('content/config.json', JSON.stringify(config, null, 2), { encoding: 'utf-8' })
  }

  async getNewsSummaries(): Promise<Array<NewsSummary>> {
    const fs = await import('fs')
    const path = await import('path')
    const { glob } = await import('glob')
    return Promise.all(glob.sync('content/news/*.json').map(async (file) => {
      const json = fs.readFileSync(file, 'utf-8')
      const data = JSON.parse(json)
      return {
        image: data.image,
        category: data.tags[0],
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
        published: data.published,
        url: '/news/' + path.basename(file, '.json'),
        slug: path.basename(file, '.json'),
      }
    }))
  }

  async getNewsPost(slug: string): Promise<NewsPost> {
    const fs = await import('fs')
    const pagePath = `content/news/${slug}.json`
    const json = fs.readFileSync(pagePath, 'utf-8')
    const data = JSON.parse(json)
    return { ...data, slug }
  }

  async saveNewsPost(post: NewsPost): Promise<void> {
    const fs = await import('fs')
    const postPath = NewsPost.path(post)
    fs.writeFileSync(postPath, JSON.stringify(post, null, 2), { encoding: 'utf-8' })
  }

  async getPage(slug: string): Promise<Page | null> {
    const fs = await import('fs')
    const pagePath = `content/${slug === '' ? 'index' : 'pages/' + slug}.json`
    if (!fs.existsSync(pagePath)) return null
    const json = fs.readFileSync(pagePath, 'utf-8')
    const data = JSON.parse(json)
    return { ...data, slug }
  }

  async getPagePaths(): Promise<Array<string>> {
    const { glob } = await import('glob')
    const path = await import('path')
    return glob
      .sync('content/pages/*.json')
      .map((p) => path.basename(p, '.json'))
  }

  async savePage(page: Page): Promise<void> {
    const fs = await import('fs')
    const pagePath = Page.path(page)
    fs.writeFileSync(pagePath, JSON.stringify(page, null, 2), { encoding: 'utf-8' })
  }

  async saveMedia(filename: string, data: ArrayBuffer) {
    const { default: mkdirp } = await import('mkdirp')
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(process.cwd(), 'public/media', filename)
    const directory = path.dirname(filePath)
    await mkdirp(directory)
    fs.writeFileSync(filePath, new Uint8Array(data))
  }

  async deleteMedia(filename: string) {
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.resolve(process.cwd(), 'public/media', filename)
    fs.rmSync(filePath)
  }

  async listMedia(directory: string): Promise<Array<Media>> {
    const fs = await import('fs')
    const path = await import('path')
    const dir = path.resolve(process.cwd(), 'public/media', directory)
    const result = fs.readdirSync(dir)
    return result.map((item) => ({
      type: fs.statSync(path.join(dir, item)).isDirectory() ? 'dir' : 'file',
      directory: directory,
      filename: item,
      id: path.join(directory, item),
    }))
  }
}

class GitHubContentService extends ContentService {
  private _b64EncodeUnicode(str: string): string {
    return Buffer.from(str, 'utf-8').toString('base64')
  }

  private async _getPreviousSha(path: string): Promise<string | undefined> {
    const query = `query { 
      repository(name: "sunrisemvmtsb.org", owner: "sunrisemvmtsb") { 
        object(expression: "main:${path}") {
          oid
        }
      }
    }`
    const url = 'https://api.github.com/graphql'
    const response = await fetch(url, {
      headers: { 'Authorization': `bearer ${process.env.GITHUB_ACCESS_TOKEN!}` },
      method: 'POST',
      body: JSON.stringify({ query })
    })
    const data = await response.json()
    return data.data.repository.object?.oid
  }

  /**
   * 
   * @param content string contents to upload. NOTE: must already be properly base64 encoded.
   * @param path the path in the repo to put contents.
   * @param commit a commit message for the file creation or update.
   */
  private async _saveFile(
    content: string,
    path: string,
    commit: string,
  ) {
    const body = {
      sha: await this._getPreviousSha(path),
      content: content,
      message: commit,
      branch: 'main',
      committer: {
        name: 'Sunrise SB Staff',
        email: 'website@sunrisemvmtsb.org',
      }
    }

    const url = `https://api.github.com/repos/sunrisemvmtsb/sunrisemvmtsb.org/contents/${path}`
    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      console.error(response.status, text)
      throw Error(`Could not update ${path}`)
    }
  }

  async getSiteConfig(): Promise<SiteConfig> {
    const url = 'https://raw.githubusercontent.com/sunrisemvmtsb/sunrisemvmtsb.org/main/content/config.json'
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  async saveSiteConfig(config: SiteConfig): Promise<void> {
    await this._saveFile(
      this._b64EncodeUnicode(JSON.stringify(config, null, 2)),
      'content/config.json',
      'Update Site Config from CMS',
    )
  }

  async getNewsSummaries(): Promise<Array<NewsSummary>> {
    const path = await import('path')
    const directoryUrl = 'https://api.github.com/repos/sunrisemvmtsb/sunrisemvmtsb.org/contents/content/news?ref=main'
    const directoryResponse = await fetch(directoryUrl, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
    const directoryData = await directoryResponse.json()
    return Promise.all(directoryData.map(async (d: any) => {
      const url = `https://raw.githubusercontent.com/sunrisemvmtsb/sunrisemvmtsb.org/main/${d.path}`
      const response = await fetch(url)
      const data = await response.json()
      return {
        image: data.image,
        category: data.tags[0],
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
        published: data.published,
        url: '/news/' + path.basename(d.path, '.json'),
        slug: path.basename(d.path, '.json'),
      }
    }))
  }

  async getNewsPost(slug: string): Promise<NewsPost> {
    const url = `https://raw.githubusercontent.com/sunrisemvmtsb/sunrisemvmtsb.org/main/content/news/${slug}.json`
    const response = await fetch(url)
    const data = await response.json()
    return { ...data, slug }
  }

  async saveNewsPost(post: NewsPost): Promise<void> {
    await this._saveFile(
      this._b64EncodeUnicode(JSON.stringify(post, null, 2)),
      NewsPost.path(post),
      `Update /news/${post.slug} from CMS`,
    )
  }

  async getPage(slug: string): Promise<Page | null> {
    const url = `https://raw.githubusercontent.com/sunrisemvmtsb/sunrisemvmtsb.org/main/content/${slug === '' ? 'index' : 'pages/' + slug}.json`
    const response = await fetch(url)
    if (response.status === 404) return null
    const data = await response.json()
    return data
  }

  async getPagePaths(): Promise<Array<string>> {
    const path = await import('path')
    const url = 'https://api.github.com/repos/sunrisemvmtsb/sunrisemvmtsb.org/contents/content/pages?ref=main'
    const response = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
    const data = await response.json()
    return data.map((d: any) => path.basename(d.path, '.json'))
  }

  async savePage(page: Page): Promise<void> {
    await this._saveFile(
      this._b64EncodeUnicode(JSON.stringify(page, null, 2)),
      Page.path(page),
      `Update /${page.slug} from CMS`,
    )
  }

  async saveMedia(filename: string, data: ArrayBuffer) {
    const path = await import('path')
    await this._saveFile(
      Buffer.from(data).toString('base64'),
      path.join('public/media', filename),
      `Upload media file ${filename}`
    )
    console.log('saved')
  }

  async deleteMedia(filename: string) {
    const path = `public/media/${filename}`
    const sha = await this._getPreviousSha(path)
    if (!sha) return
    const url = `https://api.github.com/repos/sunrisemvmtsb/sunrisemvmtsb.org/contents/${path}`
    const body = {
      sha,
      message: `Delete media ${filename}`,
      branch: 'main',
      committer: {
        name: 'Sunrise SB Staff',
        email: 'website@sunrisemvmtsb.org',
      }
    }
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: 'DELETE',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    })
    if (!response.ok) throw Error('failed to delete')
  }

  async listMedia(directory: string): Promise<Array<Media>> {
    const path = await import('path')
    const fullDirectory = path.join('public/media', directory)
    const url = `https://api.github.com/repos/sunrisemvmtsb/sunrisemvmtsb.org/contents/${fullDirectory}?ref=main`
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      }
    })
    const data = await response.json()
    return data
      .filter((d: any) => d.type === 'dir' || d.type === 'file')
      .map((d: any) => ({
        type: d.type === 'dir' ? 'dir' : 'file',
        directory: directory,
        filename: d.name,
        id: path.join(directory, d.name),
      }))
  }
}
