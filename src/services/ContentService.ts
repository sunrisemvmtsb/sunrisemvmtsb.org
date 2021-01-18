import fs from 'fs'
import glob from 'glob'
import path from 'path'
import base64 from 'base-64'
import Page from '../domain/Page'
import SiteConfig from '../domain/SiteConfig'
import NewsSummary from '../domain/NewsSummary'
import NewsPost from '../domain/NewsPost'

export default abstract class ContentService {
  private static _instance: ContentService | null = null
  static get instance(): ContentService {
    if (this._instance === null) {
      if (typeof window !== 'undefined') this._instance = new ClientContentService()
      else if (process.env.NODE_ENV !== 'production') this._instance = new FsContentService()
      else this._instance = new GitHubContentService()
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
}

class FsContentService extends ContentService {
  async getSiteConfig(): Promise<SiteConfig> {
    const json = fs.readFileSync('content/config.json', 'utf-8')
    const data = JSON.parse(json)
    return data
  }

  async saveSiteConfig(config: SiteConfig): Promise<void> {
    fs.writeFileSync('content/config.json', JSON.stringify(config, null, 2), { encoding: 'utf-8' })
  }

  async getNewsSummaries(): Promise<Array<NewsSummary>> {
    return glob.sync('content/news/*.json').map((file) => {
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
    })
  }

  async getNewsPost(slug: string): Promise<NewsPost> {
    const pagePath = `content/news/${slug}.json`
    const json = fs.readFileSync(pagePath, 'utf-8')
    const data = JSON.parse(json)
    return { ...data, slug }
  }

  async saveNewsPost(post: NewsPost): Promise<void> {
    const postPath = NewsPost.path(post)
    fs.writeFileSync(postPath, JSON.stringify(post, null, 2), { encoding: 'utf-8' })
  }

  async getPage(slug: string): Promise<Page | null> {
    const pagePath = `content/${slug === '' ? 'index' : 'pages/' + slug}.json`
    if (!fs.existsSync(pagePath)) return null
    const json = fs.readFileSync(pagePath, 'utf-8')
    const data = JSON.parse(json)
    return { ...data, slug }
  }

  async getPagePaths(): Promise<Array<string>> {
    return glob
      .sync('content/pages/*.json')
      .map((p) => path.basename(p, '.json'))
  }

  async savePage(page: Page): Promise<void> {
    const pagePath = Page.path(page)
    fs.writeFileSync(pagePath, JSON.stringify(page, null, 2), { encoding: 'utf-8' })
  }
}

class GitHubContentService extends ContentService {
  private async _saveFile(
    content: string,
    path: string,
    commit: string,
  ) {
    const url = `https://api.github.com/repos/sunrisemvmtsb/sunrisemvmtsb.org/contents/${path}`
    const currentResponse = await fetch(url + '?ref=main', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      }
    })
    const currentData = await currentResponse.json()

    const body = {
      // currentData.sha will be `undefined` if currentResponse is a 404 result, which is correct when we
      // are adding a new file. GitHub API v3 serves a JSON response for 404 here so we can just decode
      // and attempt to read `sha` rather than checking the status code.
      sha: currentData.sha,
      content,
      message: commit,
      branch: 'main',
      committer: {
        name: 'Sunrise SB Staff',
        email: 'website@sunrisemvmtsb.org',
      }
    }

    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      },

    })

    if (!response.ok) throw Error(`Could not update ${path}`)
  }

  async getSiteConfig(): Promise<SiteConfig> {
    const url = 'https://raw.githubusercontent.com/sunrisemvmtsb/sunrisemvmtsb.org/main/content/config.json'
    const response = await fetch(url)
    const data = await response.json()
    return data
  }

  async saveSiteConfig(config: SiteConfig): Promise<void> {
    await this._saveFile(
      JSON.stringify(config, null, 2),
      'content/config.json',
      'Update Site Config from CMS',
    )
  }

  async getNewsSummaries(): Promise<Array<NewsSummary>> {
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
      JSON.stringify(post, null, 2),
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
    const url = 'https://api.github.com/repos/sunrisemvmtsb/sunrisemvmtsb.org/contents/content/pages?ref=main'
    const response = await fetch(url, {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    })
    const data = await response.json()
    return data.map((d: any) => path.basename(d.path, '.json'))
  }

  async savePage(page: Page): Promise<void> {
    await this._saveFile(
      JSON.stringify(page, null, 2),
      Page.path(page),
      `Update /${page.slug} from CMS`,
    )
  }
}
