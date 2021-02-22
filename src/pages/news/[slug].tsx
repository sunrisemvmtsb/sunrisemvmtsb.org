import React from 'react'
import type { Field } from 'tinacms'
import { GetStaticPaths, GetStaticProps } from 'next'
import { css } from 'styled-components'
import { Temporal } from 'proposal-temporal'
import dynamic from 'next/dynamic'

import Typography from '../../components/Typography'
import Markdown from '../../components/fields/Markdown'
import PostSummary from '../../components/molecules/PostSummary'
import AdjustableImage from '../../components/fields/AdjustableImage'
import Text from '../../components/fields/Text'
import Blocks from '../../components/fields/Blocks'
import BlockItem from '../../components/fields/BlockItem'
import Group from '../../components/fields/Group'

import Preview from '../../hooks/Preview'

import NewsPost from '../../domain/NewsPost'

import SiteConfigService from '../../services/SiteConfigService'
import NewsService from '../../services/NewsService'
import NewsSummary from '../../domain/NewsSummary'

export type Props = {
  post: NewsPost | null,
  slug: string,
  summaries: Array<NewsSummary>
}

export const Template = (props: Props) => {
  const post = props.post ?? NewsPost.default(props.slug)
  const preview = Preview.use()
  const tagBlockData = React.useMemo(() => {
    return post.tags.map((tag, index) => ({ _template: 'TagItem', tag, id: index }))
  }, [post.tags])

  const featured = React.useMemo(() => {
    return props
      .summaries
      .filter(s => s.published && NewsSummary.isFeatured(s))
      .sort(NewsSummary.compare)
      .slice(0, 5)
  }, [props.summaries])

  return (
    <article css={css`
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px;
    `}>
      <h3 css={css`
        margin: 0;
        margin-bottom: 32px;
      `}>
        <Typography variant="SectionTitle">
          Hub Updates
        </Typography>
      </h3>
      <div css={css`
        display: grid;
        grid-template-columns: 2fr 1fr;
        grid-auto-flow: column;
        grid-column-gap: 64px;
      `}>
        <div>
          <AdjustableImage
            css={css`
              height: 360px;
              margin-bottom: 32px;
            `}
            name="image"
            data={post.image} />
          <div css={css`
            border-image-source: linear-gradient(to right, #8F0D56, #EF4C39, #FFDE16);
            border-style: solid;
            border-image-slice: 1;
            border-width: 0;
            border-bottom-width: 2px;
          `}>
            <Group
              name="."
              focusRing={{ offset: 16 }}
              fields={[
                {
                  component: 'list',
                  name: 'tags',
                  label: 'Tags',
                  field: {
                    component: 'text',
                    validate: (current: string, fields: NewsPost) => {
                      if (fields.tags.filter((t) => t === current).length > 1) return 'Duplicates not allowed'
                    }
                  },
                } as Field,
              ]}>
              <div css={css`
                margin-bottom: 8px;
                flex-wrap: wrap;
                display: flex;
              `}>
                {post.tags.map((tag, index) => (
                  <span
                    key={tag + index}
                    css={css`
                      color: var(--sunrise-magenta);
                      text-transform: uppercase;
                      font-weight: 700;
                      width: fit-content !important;
                      margin-right: 16px;
                    `}>
                    {tag}
                  </span>
                ))}
              </div>
            </Group>
            <h1 css={css`
              font-weight: 400;
              font-size: 56px;
              margin: 0;
              font-family: Source Serif Pro;
              padding-bottom: 12px;
            `}>
              <Text
                name="title"
                placeholder="Title">
                {post.title}
              </Text>
            </h1>
            {(preview || post.subtitle) &&
              <h3 css={css`
                margin: 0;
                font-size: 20px;
                padding-bottom: 4px;
                font-weight: 700;
                line-height: 1.1;
                font-style: italic;
              `}>
                <Text
                  name="subtitle"
                  placeholder="Subtitle (optional)">
                  {post.subtitle}
                </Text>
              </h3>
            }
            <div css={css`
              padding-top: 12px;
              padding-bottom: 24px;
              font-size: 20px;
              font-family: Source Serif Pro;
              display: grid;
              grid-auto-flow: column;
              grid-template-columns: auto auto 1fr;
              grid-column-gap: 4px;
              align-items: center;
              justify-content: start;
            `}>
              <span>
                {!post.published ?
                  '(unpublished)' :
                  Temporal.PlainDate.from(post.published).toLocaleString('default', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                }
              </span>
              <span>{(preview || !!post.author) ? ' • ' : ''}</span>
              <Text name="author" placeholder="Author Name">
                {post.author}
              </Text>
            </div>
          </div>
          <div css={css`
            padding-top: 32px;
          `}>
            <Markdown
              name="content"
              content={post.content} />
          </div>
        </div>
        {featured.length &&
          <div css={css`
            display: grid;
            grid-auto-rows: auto;
            grid-row-gap: 16px;
            align-content: start;
          `}>
            <Typography variant="ContentTitle">
              Featured Posts
            </Typography>
            {featured.map((s) => (
              <PostSummary
                key={s.slug}
                author={s.author}
                category="Featured"
                title={s.title}
                href={NewsSummary.href(s)} />
            ))}
          </div>
        }
      </div>
    </article>
  )
}

const Editor = dynamic(async () => {
  const { default: NewsEditorPlugin } = await import(/* webpackChunkName: "tina" */ '../../plugins/NewsEditorPlugin')
  const { InlineForm } = await import(/* webpackChunkName: "tina" */ 'react-tinacms-inline')
  return (props: Props) => {
    const [data, form] = NewsEditorPlugin.use(props.slug, props.post, 'News Article')
    return (
      <InlineForm form={form}>
        <Template {...props} post={data} />
      </InlineForm>
    )
  }
})

export default Preview.component(Editor, Template)

export const getStaticPaths: GetStaticPaths = async () => {
  const { default: inject } = await import('../../infrastructure/Container.server')
  const container = inject('prerender')
  const newsService = container.get(NewsService)
  const summaries = await newsService.listNewsSummaries()
  return {
    paths: summaries.map((s) => ({
      params: { slug: s.slug },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({
  preview,
  params,
}) => {
  const { default: inject } = await import('../../infrastructure/Container.server')
  const container = inject('prerender')
  const siteConfigService = container.get(SiteConfigService)
  const newsService = container.get(NewsService)

  const siteConfig = await siteConfigService.get()
  const slug = params?.slug
  if (!slug || Array.isArray(slug)) throw Error('No news post can be accessed without a slug in the URL. If this error happens something is really wrong.')

  const post = await newsService.getNewsPost(slug)

  if (!post?.published && !preview) {
    return { notFound: true }
  }

  const summaries = await newsService.listNewsSummaries()

  return {
    props: { siteConfig, summaries, slug, post, preview: !!preview },
    revalidate: 2,
  }
}
