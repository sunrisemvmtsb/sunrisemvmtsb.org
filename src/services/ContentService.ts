import type { Media } from 'tinacms'
import type { Octokit } from '@octokit/rest'
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
  abstract movePage(page: Page, slug: string): Promise<Page>
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
    const url = '/api/content?method=getPagePaths'
    const response = await fetch(url)
    const data = await response.json()
    return data
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

  async movePage(page: Page, slug: string): Promise<Page> {
    const url = `/api/content?method=movePage`
    const body = { page, slug }
    const response = await fetch(url, {
      body: JSON.stringify(body),
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw Error('failed to move page')
    return { ...page, slug }
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

  async movePage(page: Page, slug: string): Promise<Page> {
    const fs = await import('fs')
    const oldPagePath = Page.path(page)
    const newPage = { ...page, slug }
    const newPagePath = Page.path(newPage)
    if (fs.existsSync(newPagePath)) throw Error('Page already exists')
    fs.renameSync(oldPagePath, newPagePath)
    await this.savePage(newPage)
    return newPage
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

  private _b64DecodeUnicode(str: string): string {
    return Buffer.from(str, 'base64').toString('utf-8')
  }

  private async _octokit(): Promise<Octokit> {
    const octokit = await import('@octokit/rest')
    return new octokit.Octokit({
      auth: process.env.GITHUB_ACCESS_TOKEN,
      request: { fetch }
    })
  }

  private _getRequest(url: string) {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    })
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

  private async _getFile(path: string): Promise<string | null> {
    const url = `https://api.github.com/repos/sunrisemvmtsb/sunrisemvmtsb.org/contents/${path}?ref=main`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': `token ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    })
    if (response.status === 404) return null
    const data = await response.json()
    return this._b64DecodeUnicode(data.content)
  }

  async getSiteConfig(): Promise<SiteConfig> {
    const contents = await this._getFile('content/config.json')
    if (!contents) throw Error('site config should exist')
    return JSON.parse(contents)
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
    const contents: Array<{ path: string, contents: string | null }> = await Promise.all(directoryData.map(async (d: any) => {
      const contents = await this._getFile(d.path)
      return { path: d.path, contents }
    }))
    return contents.filter((s) => s.contents !== null).map((s) => {
      const data = JSON.parse(s.contents!)
      return {
        image: data.image,
        category: data.tags[0],
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
        published: data.published,
        url: '/news/' + path.basename(s.path, '.json'),
        slug: path.basename(s.path, '.json'),
      }
    })
  }

  async getNewsPost(slug: string): Promise<NewsPost | null> {
    const contents = await this._getFile(`content/news/${slug}.json`)
    if (!contents) return null
    const data = JSON.parse(contents)
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
    const contents = await this._getFile(`content/${slug === '' ? 'index' : 'pages/' + slug}.json`)
    if (!contents) return null
    return JSON.parse(contents)
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

  async movePage(page: Page, slug: string): Promise<Page> {
    const octokit = await this._octokit()
    const owner = 'sunrisemvmtsb'
    const repo = 'sunrisemvmtsb.org'
    const oldPagePath = Page.path(page)
    const newPage = { ...page, slug }
    const newPagePath = Page.path(newPage)

    const currentBranch = await octokit.repos.getBranch({
      owner,
      repo,
      branch: 'main',
    })

    const oldPageSha = await this._getPreviousSha(oldPagePath)

    const newTree = await octokit.git.createTree({
      owner,
      repo,
      base_tree: currentBranch.data.commit.sha,
      tree: [
        {
          mode: '100644',
          type: 'blob',
          path: newPagePath,
          sha: oldPageSha,
        },
        {
          mode: '100644',
          type: 'blob',
          path: newPagePath,
          content: JSON.stringify(newPage, null, 2),
        }
      ]
    })

    const commit = await octokit.git.createCommit({
      message: `Move page ${Page.href(page)} to ${Page.href(newPage)} and update content`,
      owner,
      repo,
      tree: newTree.data.sha,
      committer: {
        name: 'Sunrise SB Staff',
        email: 'website@sunrisemvmtsb.org',
      },
    })

    await octokit.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: commit.data.sha,
    })

    return newPage
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
