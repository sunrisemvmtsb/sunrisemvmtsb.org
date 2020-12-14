import glob from 'glob'
import Head from 'next/head'
import { css } from 'styled-components'
import { GetServerSideProps } from 'next'
import { usePlugin } from 'tinacms'
import { InlineForm, InlineBlocks } from 'react-tinacms-inline'
import { useGithubJsonForm } from 'react-tinacms-github'
import { getGithubPreviewProps, parseJson, GithubFile } from 'next-tinacms-github'
import { Data as InlineAdjustableImageData } from '../components/fields/InlineAdjustableImage'
import HomeHero from '../components/heros/HomeHero'
import * as CallToAction from '../components/blocks/CallToAction'
import * as EventsList from '../components/blocks/EventsList'
import * as NewsHeadlines from '../components/blocks/NewsHeadlines'
import GoogleCalendar, { CalendarEvent } from '../infrastructure/GoogleCalendar'
import Instagram, { InstagramPost } from '../infrastructure/Instagram'
import { SocialPost } from '../components/molecules/SocialFeed'

type HeroData = {
  background: InlineAdjustableImageData
}

type BlocksData =
  | { _template: 'CallToAction' } & CallToAction.Data
  | { _template: 'EventsList' } & EventsList.Data
  | { _template: 'NewsHeadlines' } & NewsHeadlines.Data

type HomeData = {
  hero: HeroData,
  blocks: Array<BlocksData>
}

const Home = ({
  file,
  events,
  posts,
}: {
  file: GithubFile<HomeData>,
  events: Array<CalendarEvent>,
  posts: Array<SocialPost>,
}) => {
  const [data, form] = useGithubJsonForm(file, {
    label: 'Home Page'
  }) as [HomeData, any]
  usePlugin(form)

  return (
    <InlineForm form={form}>
      <HomeHero
        data={{
          background: {
            data: data.hero.background,
            name: 'hero.background',
          }
        }} />
      <InlineBlocks
        name="blocks"
        blocks={{ CallToAction, EventsList, NewsHeadlines }}
        itemProps={{ events, posts }} />
    </InlineForm>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async ({
  preview,
  previewData,
}) => {
  const events = await GoogleCalendar.instance.load()
  const instagram = await Instagram.instance.load()
  const posts = instagram.map((p) => ({ type: 'Instagram', ...p }))

  const github = preview ?
    (await getGithubPreviewProps({
      ...previewData,
      fileRelativePath: 'content/index.json',
      parse: parseJson,
    })).props : {
      sourceProvider: null,
      error: null,
      preview: false,
      file: {
        fileRelativePath: 'content/index.json',
        data: (await import('../../content/index.json')).default,
      },
    }

  return {
    props: { posts, events, ...github }
  }
}
