import Page from '../domain/Page'
import type { TinaCMS, Field, AddContentPlugin } from 'tinacms'
import { FORM_ERROR } from 'final-form'

type Fields = {
  title: string,
  description: string,
}

export default class PageCreatorPlugin implements AddContentPlugin<Fields> {
  __type: 'content-creator' = 'content-creator'
  name: AddContentPlugin<Fields>['name'] = 'Page'
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

  private _storagePromise: Promise<LocalForage> | null = null
  private _getStorage(): Promise<LocalForage> {
    if (this._storagePromise) return this._storagePromise
    this._storagePromise = import('localforage')
      .then(({ default: localForage }) => {
        const storage = localForage.createInstance({
          driver: localForage.INDEXEDDB,
          name: 'sunrisemvmtsb_org',
          version: 1.0,
          storeName: 'pages',
          description: 'locally cached page changes'
        })
        this._storagePromise = Promise.resolve(storage)
        return storage
      })
    return this._storagePromise
  }

  async onSubmit(form: Fields, cms: TinaCMS) {
    const slug = this.slugify(form.title)
    const page: Page = {
      slug,
      title: form.title,
      description: form.description,
      blocks: [],
    }

    try {
      const storage = await this._getStorage()
      await storage.setItem(`pages:${slug}`, page)
      window.location.assign('/' + slug)
    } catch (e) {
      return { [FORM_ERROR]: e } as unknown as void // lol cool types guys
    }
  }

  slugify(title: string): string {
    return (
      title
        .trim()
        .toLowerCase()
        //replace invalid chars
        .replace(/[^a-z0-9 -]/g, '')
        // Collapse whitespace and replace by -
        .replace(/\s+/g, '-')
        // Collapse dashes
        .replace(/-+/g, '-')
    )
  }
}
