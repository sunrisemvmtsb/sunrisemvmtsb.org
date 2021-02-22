import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import type { CalendarEvent } from '../infrastructure/GoogleCalendar.server'

import Blocks from '../components/fields/Blocks'
import blocks from '../components/blocks'

import SiteConfig from '../domain/SiteConfig'
import NewsSummary from '../domain/NewsSummary'
import Page from '../domain/Page'
import SocialPost from '../domain/SocialPost'

import ISocialService from '../services/ISocialService'
import Preview from '../hooks/Preview'
import SiteConfigService from '../services/SiteConfigService'
import PagesService from '../services/PagesService'
import NewsService from '../services/NewsService'

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
  const { default: PageEditorPlugin } = await import(/* webpackChunkName: "tina" */ '../plugins/PageEditorPlugin')
  const { InlineForm } = await import(/* webpackChunkName: "tina" */ 'react-tinacms-inline')
  return (props: Props) => {
    const [data, form] = PageEditorPlugin.use(props.slug, props.page, 'Home Page')

    return (
      <InlineForm form={form}>
        <Template {...props} page={data} />
      </InlineForm>
    )
  }
})

export default Preview.component(Editor, Template)


export const getStaticProps: GetStaticProps = async ({
  preview,
  params,
}) => {
  const { default: inject } = await import('../infrastructure/Container.server')
  const { default: GoogleCalendar } = await import('../infrastructure/GoogleCalendar.server')

  const container = inject('prerender')
  const googleCalendar = container.get(GoogleCalendar)
  const socialService = container.get(ISocialService)
  const siteConfigService = container.get(SiteConfigService)
  const pagesService = container.get(PagesService)
  const newsService = container.get(NewsService)

  const siteConfig = await siteConfigService.get()

  const page = await pagesService.getPage('')
  
  if (!preview && page === null) {
    return { notFound: true }
  }

  const events = await googleCalendar.load()
  const posts = await socialService.getPosts()
  const news = await newsService.listNewsSummaries()
  
  return {
    props: { siteConfig, slug: '', posts, events, page, news, preview: !!preview },
    revalidate: 2,
  }
}
