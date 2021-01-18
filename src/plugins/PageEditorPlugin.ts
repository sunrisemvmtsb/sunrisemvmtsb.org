
import { useForm, useCMS, Form, usePlugin } from 'tinacms'
import { FORM_ERROR } from 'final-form'
import ContentService from '../services/ContentService'
import Page from '../domain/Page'

export default class PageEditorPlugin {
  private static _instance: PageEditorPlugin | null = null
  static get instance(): PageEditorPlugin {
    if (this._instance === null) this._instance = new PageEditorPlugin()
    return this._instance
  }

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

  async latest(slug: string): Promise<Page | null> {
    const storage = await this._getStorage()
    const local = await storage.getItem<any>(`pages:${slug}`)
    if (local) return { ...local, slug }
    return ContentService.instance.getPage(slug)
  }

  async save(page: Page): Promise<void> {
    await ContentService.instance.savePage(page)
    const storage = await this._getStorage()
    await storage.removeItem(`pages:${page.slug}`)
  }

  async persist(page: Page): Promise<void> {
    const storage = await this._getStorage()
    const local = await storage.getItem<Page>(`pages:${page.slug}`)
    if (local) await storage.setItem(`pages:${page.slug}`, page)
  }

  static use(slug: string, page: Page | null, label: string): [Page, Form] {
    const cms = useCMS()
    const [values, form] = useForm({
      id: `pages:${slug}`,
      label: label,
      fields: [],
      actions: [],
      async loadInitialValues() {
        if (cms.disabled) return page ?? {}
        const initial = await PageEditorPlugin.instance.latest(slug)
        if (!initial) throw Error('Not found')
        return initial
      },
      async onSubmit(values) {
        try {
          await PageEditorPlugin.instance.save(values)
        } catch (e) {
          return { [FORM_ERROR]: e }
        }
      },
      async reset() {
        const page = await PageEditorPlugin.instance.latest(slug)
        if (!page) return
        await PageEditorPlugin.instance.persist(page)
      },
    }, {
      label
    })

    usePlugin(form)

    return [Object.assign({}, page, values), form]
  }
}
