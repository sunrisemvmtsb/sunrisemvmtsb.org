import { GetStaticPaths, GetStaticProps } from 'next'
import { css } from 'styled-components'
import { Temporal } from 'proposal-temporal'
import dynamic from 'next/dynamic'

import Typography from '../../components/Typography'
import NewsPost from '../../domain/NewsPost'

import Markdown from '../../components/fields/Markdown'
import AdjustableImage from '../../components/fields/AdjustableImage'
import PostSummary from '../../components/molecules/PostSummary'
import Preview from '../../contexts/Preview'
import SiteConfigService from '../../services/SiteConfigService'
import NewsService from '../../services/NewsService'

export type Props = {
  post: NewsPost | null,
  slug: string,
}

export const Template = (props: Props) => {
  const post = props.post ?? NewsPost.default(props.slug)

  return (
    <article css={css`
      max-width: 1200px;
      margin: 0 auto;
      padding-top: 32px;
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
            <div css={css`
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              margin-bottom: 8px;
            `}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  css={css`
                    color: var(--sunrise-magenta);
                    text-transform: uppercase;
                    font-weight: 700;
                    margin-right: 16px;
                  `}>
                  {tag}
                </span>
              ))}
            </div>
            <h1 css={css`
              font-weight: 400;
              font-size: 56px;
              margin: 0;
              font-family: Source Serif Pro;
              padding-bottom: 12px;
            `}>
              {post.title}
            </h1>
            {post.subtitle &&
              <h3 css={css`
                margin: 0;
                font-size: 20px;
                padding-bottom: 4px;
                font-weight: 700;
                line-height: 1.1;
                font-style: italic;
              `}>
                {post.subtitle}
              </h3>
            }
            <div css={css`
              padding-top: 12px;
              padding-bottom: 24px;
              font-size: 20px;
              font-family: Source Serif Pro;
            `}>
              {post.author}{' • '}
              {Temporal.PlainDate.from(post.published ?? new Date().toISOString()).toLocaleString('default', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
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
        <div css={css`
          display: grid;
          grid-auto-rows: auto;
          grid-row-gap: 16px;
          align-content: start;
        `}>
          <Typography variant="ContentTitle">
            Featured Posts
          </Typography>
          <PostSummary
            author="Luke Westby"
            category="Featured"
            title="Hello world lolol" />
          <PostSummary
            author="Luke Westby"
            category="Featured"
            title="Hello world lolol" />
          <PostSummary
            author="Luke Westby"
            category="Featured"
            title="Hello world lolol" />
        </div>
      </div>
    </article>
  )
}

const Editor = dynamic(async () => {
  const { default: NewsEditorPlugin } = await import(/* webpackChunkName: "tina" */ '../../plugins/NewsEditorPlugin')
  const { InlineForm } = await import(/* webpackChunkName: "tina" */ 'react-tinacms-inline')
  return (props: Props) => {
    console.log(props.post)
    const [data, form] = NewsEditorPlugin.use(props.slug, props.post, 'News Article')
    console.log(data)
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

  console.log('preview', !!preview)

  if (!post?.published && !preview) {
    return { notFound: true }
  }

  return {
    props: { siteConfig, slug, post, preview: !!preview },
    revalidate: 2,
  }
}
