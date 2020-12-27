import glob from 'glob'
import Head from 'next/head'
import { css } from 'styled-components'
import { GetServerSideProps } from 'next'
import { useCMS, usePlugin } from 'tinacms'
import { InlineForm, InlineBlocks } from 'react-tinacms-inline'
import * as CallToAction from '../components/blocks/CallToAction'
import * as EventsList from '../components/blocks/EventsList'
import * as NewsHeadlines from '../components/blocks/NewsHeadlines'
import * as PrimaryHero from '../components/blocks/PrimaryHero'
import GoogleCalendar, { CalendarEvent } from '../infrastructure/GoogleCalendar'
import Instagram from '../infrastructure/Instagram'
import { SocialPost } from '../components/molecules/SocialFeed'
import { useJsonForm, JsonFile } from '../infrastructure/CustomGitClient'

type BlocksData =
  | { _template: 'PrimaryHero' } & PrimaryHero.Data
  | { _template: 'CallToAction' } & CallToAction.Data
  | { _template: 'EventsList' } & EventsList.Data
  | { _template: 'NewsHeadlines' } & NewsHeadlines.Data

type HomeData = {
  blocks: Array<BlocksData>
}

const Home = ({
  file,
  events,
  posts,
}: {
  file: JsonFile<HomeData>,
  events: Array<CalendarEvent>,
  posts: Array<SocialPost>,
}) => {
  const [data, form] = useJsonForm(file, {
    label: 'Home Page'
  }) as [HomeData, any]
  usePlugin(form)

  return (
    <InlineForm form={form}>
      <InlineBlocks
        name="blocks"
        blocks={{ PrimaryHero, CallToAction, EventsList, NewsHeadlines }}
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

  const file = {
    fileRelativePath: 'content/index.json',
    data: (await import('../../content/index.json')).default,
  }

  return {
    props: { posts, events, file, preview: !!preview }
  }
}
