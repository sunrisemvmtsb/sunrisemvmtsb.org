import ContentService from '../services/ContentService'
import StorageService from '../services/StorageService'
import Page from '../domain/Page'
import SiteConfig from '../domain/SiteConfig'

class RenamePage {
  async exec(page: Page, title: string): Promise<Page> {
    const newPage = { ...page, title }
    const slug = Page.slugify(newPage)
    if (slug === page.slug) return page

    try {
      const local = await StorageService.instance.getPage(page.slug)
      if (local) {
        await StorageService.instance.removePage(local)
        const updated = { ...newPage, slug }
        await StorageService.instance.savePage(updated)
        return updated
      }

      const existing = await ContentService.instance.getPagePaths()
      if (existing.includes(slug)) throw new RenamePage.PageExistsError(Page.href({ ...page, slug }))
      const updated = await ContentService.instance.movePage(newPage, slug)
      const siteConfig = await ContentService.instance.getSiteConfig()
      await ContentService.instance.saveSiteConfig(SiteConfig.addPageRedirect(page.slug, updated.slug, siteConfig))
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
