import CallToAction from './blocks/CallToAction'
import EventsList from './blocks/EventsList'
import NewsHeadlines from './blocks/NewsHeadlines'
import PrimaryHero from './blocks/PrimaryHero'
import HeadlineHero from './blocks/HeadlineHero'
import OneColumnText from './blocks/OneColumnText'
import TwoColumnText from './blocks/TwoColumnText'

type Block =
  | PrimaryHero
  | HeadlineHero
  | CallToAction
  | EventsList
  | NewsHeadlines
  | OneColumnText
  | TwoColumnText

type Page = {
  slug: string,
  title: string,
  description: string,
  blocks: Array<Block>
}

const Page = {
  path: (page: Page): string => {
    if (page.slug === '') return 'content/index.json'
    return `content/pages/${page.slug}.json`
  }
}

export default Page
