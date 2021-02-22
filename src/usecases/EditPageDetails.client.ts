import { ContainerInstance } from 'typedi'
import StorageService from '../services/StorageService.client'
import Page from '../domain/Page'
import SiteConfig from '../domain/SiteConfig'
import SiteConfigService from '../services/SiteConfigService'
import PagesService from '../services/PagesService'

class EditPageDetails {
  private _siteConfig: SiteConfigService
  private _pages: PagesService
  private _storage: StorageService

  constructor({
    container,
  }: {
    container: ContainerInstance,
  }) {
    this._siteConfig = container.get(SiteConfigService)
    this._pages = container.get(PagesService)
    this._storage = container.get(StorageService)
  }

  async exec(page: Page, data: { title: string, description: string, slug: string }): Promise<Page> {
    if (!Page.isSlugValid(data.slug)) {
      throw new EditPageDetails.SlugInvalidError()
    }

    if (data.slug === '' && page.slug !== '') {
      throw new EditPageDetails.HomeIsReservedError()
    }

    if (page.slug === '' && data.slug !== '') {
      throw new EditPageDetails.HomeIsNotEditableError()
    }

    const updated = { ...page, ...data }

    try {
      const local = await this._storage.getPage(page.slug)
      if (local) {
        await this._storage.removePage(local)
        await this._storage.savePage(updated)
        return updated
      }

      if (data.slug === page.slug && data.title === page.title && data.description === page.description) {
        return page
      }

      if (data.slug === page.slug) {
        await this._pages.savePage(updated)
        return updated
      }

      const pages = await this._pages.listPageSummaries()
      const existing = new Set(pages.map(({ slug }) => slug))
      if (existing.has(data.slug)) throw new EditPageDetails.PageExistsError(Page.href(updated))
      await this._pages.renamePage({ ...updated, slug: page.slug }, updated.slug)
      const siteConfig = await this._siteConfig.get()
      await this._siteConfig.save(SiteConfig.addPageRedirect(page.slug, updated.slug, siteConfig))
      return updated
    } catch (e) {
      if (e instanceof DomainError) throw e
      else throw new EditPageDetails.ServiceError(e)
    }
  }
}

class DomainError extends Error { }

namespace EditPageDetails {
  export class PageExistsError extends DomainError {
    constructor(public path: string) { super() }
  }
  export class SlugInvalidError extends DomainError { }
  export class HomeIsReservedError extends DomainError { }
  export class HomeIsNotEditableError extends DomainError { }
  export class ServiceError extends Error {
    constructor(public cause: Error) { super() }
  }
}

export default EditPageDetails
