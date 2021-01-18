
import { useForm, useCMS, Form, usePlugin } from 'tinacms'
import { FORM_ERROR } from 'final-form'
import ContentService from '../services/ContentService'
import NewsPost from '../domain/NewsPost'

export default class NewsEditorPlugin {
  private static _instance: NewsEditorPlugin | null = null
  static get instance(): NewsEditorPlugin {
    if (this._instance === null) this._instance = new NewsEditorPlugin()
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
          storeName: 'news',
          description: 'locally cached news post changes'
        })
        this._storagePromise = Promise.resolve(storage)
        return storage
      })
    return this._storagePromise
  }

  async latest(slug: string): Promise<NewsPost | null> {
    const storage = await this._getStorage()
    const local = await storage.getItem<any>(`news:${slug}`)
    if (local) return { ...local, slug }
    return ContentService.instance.getNewsPost(slug)
  }

  async save(post: NewsPost): Promise<void> {
    await ContentService.instance.saveNewsPost(post)
    const storage = await this._getStorage()
    await storage.removeItem(`news:${post.slug}`)
  }

  async persist(post: NewsPost): Promise<void> {
    const storage = await this._getStorage()
    const local = await storage.getItem<NewsPost>(`news:${post.slug}`)
    if (local) await storage.setItem(`news:${post.slug}`, post)
  }

  static use(slug: string, post: NewsPost | null, label: string): [NewsPost, Form] {
    const cms = useCMS()
    const [values, form] = useForm({
      id: `news:${slug}`,
      label: label,
      fields: [],
      actions: [],
      async loadInitialValues() {
        if (cms.disabled) return post ?? {}
        const initial = await NewsEditorPlugin.instance.latest(slug)
        if (!initial) throw Error('Not found')
        return initial
      },
      async onSubmit(values) {
        try {
          await NewsEditorPlugin.instance.save(values)
        } catch (e) {
          return { [FORM_ERROR]: e }
        }
      },
      async reset() {
        const page = await NewsEditorPlugin.instance.latest(slug)
        if (!page) return
        await NewsEditorPlugin.instance.persist(page)
      },
    }, {
      label
    })

    usePlugin(form)

    return [Object.assign({}, post ?? {}, values), form]
  }
}
