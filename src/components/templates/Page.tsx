import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { InlineForm } from 'react-tinacms-inline'
import PageEditorPlugin from '../../plugins/PageEditorPlugin'
import GoogleCalendar, { CalendarEvent } from '../../infrastructure/GoogleCalendar'

import * as CallToAction from '../blocks/CallToAction'
import * as EventsList from '../blocks/EventsList'
import * as NewsHeadlines from '../blocks/NewsHeadlines'
import * as PrimaryHero from '../blocks/PrimaryHero'
import * as HeadlineHero from '../blocks/HeadlineHero'
import * as OneColumnText from '../blocks/OneColumnText'
import * as TwoColumnText from '../blocks/TwoColumnText'
import * as TeamExplorer from '../blocks/TeamExplorer'
import Blocks from '../fields/Blocks'

import SiteConfig from '../../domain/SiteConfig'
import NewsSummary from '../../domain/NewsSummary'
import Page from '../../domain/Page'
import SocialPost from '../../domain/SocialPost'

import ContentService from '../../services/ContentService'
import SocialService from '../../services/SocialService'

export const Component = ({
  slug,
  page,
  events,
  posts,
  news,
  siteConfig,
}: {
  slug: string,
  page: Page | null,
  events: Array<CalendarEvent>,
  posts: Array<SocialPost>,
  news: Array<NewsSummary>,
  siteConfig: SiteConfig,
}) => {
  const [data, form] = PageEditorPlugin.use(slug, page, 'Home Page')

  return (
    <InlineForm form={form}>
      <Head>
        <title>{data?.title ?? ''}</title>
        <meta property="og:title" content={data?.title ?? ''} key="title" />
      </Head>
      <Blocks
        name="blocks"
        itemProps={{ siteConfig, events, posts, news }}
        data={data?.blocks ?? []} 
        blocks={{
          PrimaryHero,
          HeadlineHero,
          CallToAction,
          EventsList,
          NewsHeadlines,
          OneColumnText,
          TwoColumnText,
          TeamExplorer,
        }} />
    </InlineForm>
  )
}

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
    revalidate: 30,
  }
}
