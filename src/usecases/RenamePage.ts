import container from '../infrastructure/Container.client'
import StorageService from '../services/StorageService.client'
import Page from '../domain/Page'
import SiteConfig from '../domain/SiteConfig'
import SiteConfigService from '../services/SiteConfigService'
import PagesService from '../services/PagesService'
import content from '../pages/api/content'

class RenamePage {
  private _siteConfig: SiteConfigService
  private _pages: PagesService
  private _storage: StorageService

  constructor() {
    this._siteConfig = container.get(SiteConfigService)
    this._pages = container.get(PagesService)
    this._storage = container.get(StorageService)
  }

  async exec(page: Page, title: string): Promise<Page> {
    const newPage = { ...page, title }
    const slug = Page.slugify(newPage)
    if (slug === page.slug) return page

    try {
      const local = await this._pages.getPage(page.slug)
      if (local) {
        await this._storage.removePage(local)
        const updated = { ...newPage, slug }
        await this._storage.savePage(updated)
        return updated
      }

      const existing = await this._pages.listSlugs()
      if (existing.includes(slug)) throw new RenamePage.PageExistsError(Page.href({ ...page, slug }))
      const updated = await this._pages.renamePage(newPage, slug)
      const siteConfig = await this._siteConfig.get()
      await this._siteConfig.save(SiteConfig.addPageRedirect(page.slug, updated.slug, siteConfig))
      return updated
    } catch (e) {
      throw new RenamePage.ServiceError(e)
    }
  }
}

namespace RenamePage {
  export class PageExistsError extends Error {
    constructor(public path: string) {
      super()
    }
  }
  export class ServiceError extends Error {
    constructor(public cause: Error) { super() }
  }
}

export default RenamePage
