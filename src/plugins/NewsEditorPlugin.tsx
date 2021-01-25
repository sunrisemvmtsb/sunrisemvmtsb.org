import { css } from 'styled-components'
import React from 'react'
import { useForm, useCMS, Form, usePlugins, Toggle, FieldMeta } from 'tinacms'
import { FORM_ERROR } from 'final-form'
import NewsPost from '../domain/NewsPost'
import container from '../infrastructure/Container.client'
import StorageService from '../services/StorageService.client'
import NewsService from '../services/NewsService'

const createToolbarPublishedPlugin = (stuff: any) => ({
  __type: 'toolbar:widget',
  name: `news-published`,
  weight: 2,
  component: () => stuff
})

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
      actions: [],
      fields: [
        { component: 'text', name: 'published' }
      ],
      mutators: {
        change: ([name, value], mutable, { changeValue }) => {
          changeValue(mutable, name, () => value)
          const field = mutable.fields[name]
          if (field) field.touched = true
        }
      },
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

    React.useEffect(() => {
      form.finalForm.registerField('published', () => {}, {})
    }, [form])

    const plugin = React.useMemo(() => {
      return createToolbarPublishedPlugin(
        <FieldMeta label="Published?" name="published" margin>
          <div css={css`
            display: flex;
            justify-content: center;
            padding-top: 4px;
          `}>
            <Toggle
              field={{
                component: 'toggle',
                name: 'published',
                label: 'Published?',
                parse: (p) => {
                  return p ?
                    new Date().toISOString() :
                    null
                },
                format: (a) => !!a
              }}
              input={{
                value: !!form.values.published,
                label: 'Published?',
                onChange: (e: any) => {
                  form.mutators.change('published',
                    form.values.published ? null : new Date().toISOString()
                  )
                },
              }}
              name="published"
              onBlur={() => {}}
              onChange={() => {}}
              onFocus={() => {}} />
            </div>
          </FieldMeta>
      )
    }, [values?.published, form])

    usePlugins([
      form,
      plugin,
    ])

    return [Object.assign({}, post ?? {}, values), form]
  }
}
