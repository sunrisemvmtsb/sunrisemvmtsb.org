
import { useForm, useCMS, Form, usePlugin } from 'tinacms'
import { FORM_ERROR } from 'final-form'
import NewsPost from '../domain/NewsPost'
import container from '../infrastructure/Container.client'
import StorageService from '../services/StorageService.client'
import NewsService from '../services/NewsService'

export default class NewsEditorPlugin {
  private static _instance: NewsEditorPlugin | null = null
  static get instance(): NewsEditorPlugin {
    if (this._instance === null) this._instance = new NewsEditorPlugin()
    return this._instance
  }

  private _storage: StorageService
  private _news: NewsService

  constructor() {
    this._storage = container.get(StorageService)
    this._news = container.get(NewsService)
  }

  async latest(slug: string): Promise<NewsPost | null> {
    const local = await this._storage.getNewsPost(slug)
    if (local) return { ...local, slug }
    return this._news.getNewsPost(slug)
  }

  async save(post: NewsPost): Promise<void> {
    await this._news.saveNewsPost(post)
    await this._storage.removeNewsPost(post)
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
    }, {
      label
    })

    usePlugin(form)

    return [Object.assign({}, post ?? {}, values), form]
  }
}
