import { GetStaticProps, GetStaticPaths } from 'next'
import { css } from 'styled-components'
import Markdown from '../../components/fields/Markdown'
import { InlineForm } from 'react-tinacms-inline'
import { JsonFile, useJsonForm } from '../../infrastructure/CustomGitClient'
import { usePlugin } from 'tinacms'
import Typography from '../../components/Typography'
import glob from 'glob'
import fs from 'fs/promises'
import path from 'path'
import AdjustableImage, { Data as AdjustableImageData } from '../../components/fields/AdjustableImage'
import PostSummary from '../../components/molecules/PostSummary'

path.resolve('./content/news')

type Props = {
  file: JsonFile<{
    image: AdjustableImageData,
    title: string,
    subtitle: string,
    content: string,
    tags: Array<string>
  }>
}

export default function BlogTemplate({ file }: Props) {
  const [data, form] = useJsonForm(file, {
    label: 'News Article'
  })
  usePlugin(form)

  const fullData = Object.assign({}, file.data, data)

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
              data={fullData.image} />
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
                {fullData.tags.map((tag) => (
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
                {fullData.title}
              </h1>
              {fullData.subtitle &&
                <h3 css={css`
                  margin: 0;
                  font-size: 20px;
                  padding-bottom: 4px;
                  font-weight: 700;
                  line-height: 1.1;
                  font-style: italic;
                `}>
                  {fullData.subtitle}
                </h3>
              }
              <div css={css`
                padding-top: 12px;
                padding-bottom: 24px;
                font-size: 20px;
                font-family: Source Serif Pro;
              `}>
                Nikayla Jefferson November 7, 2020
              </div>
            </div>
            <div css={css`
              padding-top: 32px;
            `}>
              <Markdown
                name="content"
                content={fullData.content} />
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

export const getStaticProps: GetStaticProps = async ({ params, preview }) => {
  const { slug } = params
  const string = await fs.readFile(path.resolve(process.cwd(),`./content/news/${slug}.json`), 'utf-8')
  const data = JSON.parse(string)

  const siteConfigString = await fs.readFile(path.resolve(process.cwd(), './content/config.json'), 'utf-8')
  const config = JSON.parse(siteConfigString)

  const pages = glob.sync('content/pages/*.json')
  const pageSlugs = pages.map((file) => {
    return file
      .split('/')[2]
      .replace(/ /g, '-')
      .replace('.json', '')
      .trim()
  })

  return {
    props: {
      file: {
        fileRelativePath: `content/news/${slug}.json`,
        data,
      },
      config: {
        fileRelativePath: 'content/config.json',
        data: config,
      },
      pages: pageSlugs,
      preview: !!preview,
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  //get all .md files in the posts dir
  const blogs = glob.sync('content/news/*.json')

  //remove path and extension to leave filename only
  const blogSlugs = blogs.map(file =>
    file
      .split('/')[2]
      .replace(/ /g, '-')
      .replace('.json', '')
      .trim()
  )

  // create paths with `slug` param
  const paths = blogSlugs.map(slug => `/news/${slug}`)

  return {
    paths,
    fallback: false,
  }
}
