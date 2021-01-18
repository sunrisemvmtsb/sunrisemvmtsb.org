import { GetStaticPaths, GetStaticProps } from 'next'
import { InlineForm } from 'react-tinacms-inline'
import { css } from 'styled-components'
import { Temporal } from 'proposal-temporal'

import Typography from '../Typography'
import NewsPost from '../../domain/NewsPost'

import ContentService from '../../services/ContentService'

import NewsEditorPlugin from '../../plugins/NewsEditorPlugin'

import Markdown from '../fields/Markdown'
import AdjustableImage from '../fields/AdjustableImage'
import PostSummary from '../molecules/PostSummary'

export type Props = {
  post: NewsPost | null,
  slug: string,
}

export const Component = ({ slug, post }: Props) => {
  const [data, form] = NewsEditorPlugin.use(slug, post, 'News Article')

  return (
    <InlineForm form={form}>
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
              data={data.image} />
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
                {data.tags.map((tag) => (
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
                {data.title}
              </h1>
              {data.subtitle &&
                <h3 css={css`
                  margin: 0;
                  font-size: 20px;
                  padding-bottom: 4px;
                  font-weight: 700;
                  line-height: 1.1;
                  font-style: italic;
                `}>
                  {data.subtitle}
                </h3>
              }
              <div css={css`
                padding-top: 12px;
                padding-bottom: 24px;
                font-size: 20px;
                font-family: Source Serif Pro;
              `}>
                {data.author}{' • '}
                {Temporal.PlainDate.from(data.published).toLocaleString('default', {
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
                content={data.content} />
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
    </InlineForm>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const summaries = await ContentService.instance.getNewsSummaries()
  return {
    paths: summaries.map((s) => ({
      params: { slug: s.slug },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({
  preview,
  params,
}) => {
  const slug = params?.slug
  if (!slug || Array.isArray(slug)) throw Error('No news post can be accessed without a slug in the URL. If this error happens something is really wrong.')

  const post = await ContentService.instance.getNewsPost(slug)
  return {
    props: { slug, post, preview: !!preview },
    revalidate: 2,
  }
}
