import Page from '../domain/Page'
import type { TinaCMS, Field, AddContentPlugin } from 'tinacms'
import StorageService from '../services/StorageService.client'
import container from '../infrastructure/Container.client'
import PagesService from '../services/PagesService'

type Fields = {
  title: string,
  description: string,
}

export default class PageCreatorPlugin implements AddContentPlugin<Fields> {
  __type: 'content-creator' = 'content-creator'
  name: AddContentPlugin<Fields>['name'] = 'Create Page'
  fields: AddContentPlugin<Fields>['fields'] = [
    {
      name: 'title',
      component: 'text',
      label: 'Title',
      placeholder: 'New Page',
      description: 'The title of the page. Whatever you type here will also be converted into the URL. For example, if the title is My New Page then the URL will be https://sunrisemvmtsb.org/my-new-page. This will also show up in the browser tab for the page and on Google results.',
    } as Field,
    {
      name: 'description',
      component: 'textarea',
      label: 'Description',
      placeholder: 'Describe the page...',
      description: 'A short description of the page. This will show up in Google results and factor into search rankings. Please fill this out!',
    } as Field,
  ]

  private _storage: StorageService
  private _pages: PagesService

  constructor() {
    this._storage = container.get(StorageService)
    this._pages = container.get(PagesService)
  }

  async onSubmit(form: Fields, cms: TinaCMS) {
    const page = {
      ...Page.default(form.title),
      description: form.description,
    }

    try {
      const pages = await this._pages.listPageSummaries()
      const existing = new Set(pages.map(({ slug }) => slug))
      if (page.slug === '' || existing.has(page.slug)) {
        cms.alerts.error(`A page with path ${Page.href(page)} already exists.`)
        return
      }

      await this._storage.savePage(page)
      window.location.assign(Page.href(page))
    } catch (e) {
      cms.alerts.error(`Page creation failed: ${e.message}`)
    }
  }
}
