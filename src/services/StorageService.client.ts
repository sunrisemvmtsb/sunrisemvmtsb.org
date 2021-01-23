import Page from '../domain/Page'
import NewsPost from '../domain/NewsPost'

export default class StorageService {
  private _storagePromise: Promise<LocalForage> | null = null
  private _getStorage(): Promise<LocalForage> {
    if (this._storagePromise) return this._storagePromise
    this._storagePromise = import('localforage')
      .then(({ default: localForage }) => {
        const storage = localForage.createInstance({
          driver: localForage.INDEXEDDB,
          name: 'sunrisemvmtsb_org',
          version: 1.0,
          storeName: 'StorageService',
          description: 'locally cached content changes'
        })
        this._storagePromise = Promise.resolve(storage)
        return storage
      })
    return this._storagePromise
  }

  async savePage(page: Page): Promise<void> {
    const storage = await this._getStorage()
    await storage.setItem(`pages:${page.slug}`, page)
  }

  async getPage(slug: string): Promise<Page | null> {
    const storage = await this._getStorage()
    const page = await storage.getItem<Page>(`pages:${slug}`)
    return page ?? null
  }

  async removePage(page: Page): Promise<void> {
    const storage = await this._getStorage()
    await storage.removeItem(`pages:${page.slug}`)
  }

  async saveNewsPost(post: NewsPost): Promise<void> {
    const storage = await this._getStorage()
    await storage.setItem(`news:${post.slug}`, post)
  }

  async getNewsPost(slug: string): Promise<NewsPost | null> {
    const storage = await this._getStorage()
    const post = await storage.getItem<NewsPost>(`news:${slug}`)
    return post ?? null
  }

  async removeNewsPost(post: NewsPost): Promise<void> {
    const storage = await this._getStorage()
    await storage.removeItem(`news:${post.slug}`)
  }
}
