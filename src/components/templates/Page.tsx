import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import GoogleCalendar, { CalendarEvent } from '../../infrastructure/GoogleCalendar'
import dynamic from 'next/dynamic'

import Blocks from '../fields/Blocks'
import blocks from '../blocks'

import SiteConfig from '../../domain/SiteConfig'
import NewsSummary from '../../domain/NewsSummary'
import Page from '../../domain/Page'
import SocialPost from '../../domain/SocialPost'

import ContentService from '../../services/ContentService'
import SocialService from '../../services/SocialService'
import Preview from '../../contexts/Preview'

export type Props = {
  slug: string,
  page: Page | null,
  events: Array<CalendarEvent>,
  posts: Array<SocialPost>,
  news: Array<NewsSummary>,
  siteConfig: SiteConfig,
}

const Template = ({
  page,
  events,
  posts,
  news,
  siteConfig,
}: Props) => {
  return (
    <>
      <Head>
        <title>{page?.title ?? ''}</title>
        <meta property="og:title" content={page?.title ?? ''} key="title" />
      </Head>
      <Blocks
        name="blocks"
        itemProps={{ siteConfig, events, posts, news }}
        data={page?.blocks ?? []} 
        blocks={blocks} />
    </>
  )
}

const Editor = dynamic(async () => {
  const { default: PageEditorPlugin } = await import('../../plugins/PageEditorPlugin')
  const { InlineForm } = await import('react-tinacms-inline')
  return (props: Props) => {
    const [data, form] = PageEditorPlugin.use(props.slug, props.page, 'Home Page')

    return (
      <InlineForm form={form}>
        <Template {...props} page={data} />
      </InlineForm>
    )
  }
})

export const Component = Preview.component(Editor, Template)

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await ContentService.instance.getPagePaths()
  return {
    paths: paths.map((slug) => ({
      params: { slug }
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({
  preview,
  params,
}) => {
  const slug = params?.slug as string ?? ''
  const events = await GoogleCalendar.instance.load()
  const posts = await SocialService.instance.getPosts()
  const page = await ContentService.instance.getPage(slug)
  const news = await ContentService.instance.getNewsSummaries()

  if (!preview && page === null) {
    return { notFound: true }
  }

  return {
    props: { slug, posts, events, page, news, preview: !!preview },
    revalidate: 2,
  }
}
