import React from 'react'
import { useRouter } from 'next/router'
import { css } from 'styled-components'
import { useForm, useCMS, Form, usePlugins, Toggle, FieldMeta } from 'tinacms'
import { FORM_ERROR } from 'final-form'

import container from '../infrastructure/Container.client'

import StorageService from '../services/StorageService.client'
import NewsService from '../services/NewsService'
import { UnauthenticatedError } from '../application/ServiceError'

import NewsPost from '../domain/NewsPost'

import GetLatestNewsPost from '../usecases/GetLatestNewsPost.client'
import UpdateNewsPost from '../usecases/UpdateNewsPost.client'


const createToolbarPublishedPlugin = (stuff: any) => ({
  __type: 'toolbar:widget',
  name: `news-published`,
  weight: 2,
  component: () => stuff
})

export default class NewsEditorPlugin {
  static use(slug: string, maybePost: NewsPost | null, label: string): [NewsPost, Form] {
    const cms = useCMS()
    const router = useRouter()
    const post = React.useMemo(() => maybePost ?? NewsPost.default(slug), [maybePost, slug])
    const originalPublished = React.useMemo(() => maybePost?.published ?? null, [maybePost])

    const onLoggedOut = React.useCallback(() => {
      cms.alerts.error('You have been logged out. Please log in and try again.')
      cms.disable()
    }, [cms])

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
        if (cms.disabled) return post
        try {
          const usecase = container.get(GetLatestNewsPost)
          const post = await usecase.exec(slug)

          if (post === null) {
            cms.alerts.error(`News post with URL /news/${slug} could not be found.`)
            router.push('/')
            return
          }

          return { ...post, tagBlocks: post.tags.map((v, index) => ({ tag: v, id: index, _template: 'TagItem' })) }
        } catch (error) {
          if (error instanceof UnauthenticatedError) return onLoggedOut()
          throw error
        }
      },
      async onSubmit(values) {
        try {
          const usecase = container.get(UpdateNewsPost)
          const { tagBlocks, ...other } = values
          const post = { ...other, tags: tagBlocks.map((v: any) => v.tag).filter((t: string) => t) }
          console.log(post)
          await usecase.exec(post)
        } catch (error) {
          if (error instanceof UnauthenticatedError) onLoggedOut()
          return { [FORM_ERROR]: error.message }
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
                format: (a) => !!a
              }}
              input={{
                value: !!form.values.published,
                label: 'Published?',
                onChange: () => {
                  form.mutators.change('published',
                    form.values.published ? null : (originalPublished ?? new Date().toISOString())
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

    return [Object.assign({}, post, values), form]
  }
}
