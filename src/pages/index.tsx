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
import * as HeadlineHero from '../components/blocks/HeadlineHero'
import GoogleCalendar, { CalendarEvent } from '../infrastructure/GoogleCalendar'
import Instagram from '../infrastructure/Instagram'
import { SocialPost } from '../components/molecules/SocialFeed'
import { useJsonForm, JsonFile } from '../infrastructure/CustomGitClient'
import Blocks from '../components/fields/Blocks'
import fs from 'fs'
import path from 'path'
import GitHub from '../infrastructure/GitHub'

type BlocksData =
  | { _template: 'PrimaryHero' } & PrimaryHero.Data
  | { _template: 'HeadlineHero' } & HeadlineHero.Data
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
      <Blocks
        name="blocks"
        blocks={{ PrimaryHero, HeadlineHero, CallToAction, EventsList, NewsHeadlines }}
        itemProps={{ events, posts }}
        data={file.data.blocks} />
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

  const config = {
    fileRelativePath: `content/config.json`,
    data: JSON.parse(fs.readFileSync(path.resolve(process.cwd(), `./content/config.json`), 'utf-8')),
  }

  const pages = await GitHub.instance.listContentDirectory('pages')

  console.log(pages)

  return {
    props: { posts, events, file, config, pages, preview: !!preview }
  }
}
